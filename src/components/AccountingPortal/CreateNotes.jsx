import axios from 'axios';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import close from '../../assets/images/cross.svg';
import ecommerce from "../../assets/images/ecommerce.svg";
import { ACCOUNTING_PORTAL } from "../../commonUtils/ApiConstants";
import { BASE_URL } from "../../commonUtils/Base";
import { formatDate } from "../../commonUtils/FormatDate";
import ReactPageNation from "../../commonUtils/Pagination";
import PrivilegesList from '../../commonUtils/PrivilegesList';
import AccountingPortalService from '../../services/AccountingPortal/AccountingPortalService';
import NewSaleService from '../../services/NewSaleService';
import { creditNotes_Err_Msg, errorLengthMax } from './Error';
import confirm from '../../assets/images/conformation.svg';
import { col,container } from 'react-bootstrap';

export default class CreateNotes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCredit: false,
      pageNumber:0,
      totalPages:0,
      mobileNumber: "",
      storeName: "",
      userName: "",
      userId: "",
      creditAmount: "",
      storeId: "",
      fromDate: "",
      toDate:"",
      value: "",
      isSave:false,
      isCardAuto:false,
      searchMobileNumber:"",
      customerData: {},
      creditData: [],
      error:{},
      storeId:"",
      isAddMore: false,
      addCreditNotePrevilige:'',  
     addEditPrevilige:'',
      isEdit: false,
      selectedItem: '',
      transactionNumber:0.0,
      isShowAllTransactions: false,
      transactionHistory: [],
      trasanctionTypes: [
        {label: 'Card', value: 'Card'},
        {label: 'Cash', value: 'Cash'}
        ],
        transactionType: '',
        referenceNumber: '',
        paidAmount: ''
    };

    this.addCredit = this.addCredit.bind(this);
    this.closeCredit = this.closeCredit.bind(this);
    this.saveCredit = this.saveCredit.bind(this);
    this.saveManual = this.saveManual.bind(this);
    this.getCreditNotes = this.getCreditNotes.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.changePage = this.changePage.bind(this);
    this.hideCardAutoModel = this.hideCardAutoModel.bind(this);

  }

  componentWillMount() {
    const childPrivileges =PrivilegesList('Credit Notes');
    childPrivileges.then((res) => {
      if(res) {
        const result = res.sort((a , b) => a.id - b.id);
        this.setState({
            addCreditNotePrevilige: result[0],  
            addEditPrevilige: result[1],  

        });
      }
    });     
    const user = JSON.parse(sessionStorage.getItem('user'));
    const selectedStore = JSON.parse(sessionStorage.getItem('selectedstoreData'));
    this.setState({ storeName: selectedStore.storeName, storeId: selectedStore.storeId,
     userName: user["cognito:username"], isEdit: false,userId: user["custom:userId"] }, () => this.getCreditNotes());
    
  }
  hideCashModal = () => {
    this.setState({
      isCardAuto:false,
      transactionNumber: 0,
    });
  };

  addCredit() {
    this.setState({ isCredit: true });
  }

 
  hideCardAutoModel = (e) => {
    this.setState({ isCardAuto: false
    })
    this.setState({ isCredit: false
    })
    
  };

  saveManual() {
    if(this.state.cardPaymentType === "Automatic") {
      this.hideCardAutoModel()
      this.saveCredit();
    }else {
      this.setState({transactionNumber: this.state.creditAmount})
   this.manualCardPayment()

    }
}

manualCardPayment=()=>{
  this.hideCardAutoModel();
  this.saveCredit();
}


  closeCredit() {
    this.setState({ isCredit: false, isAddMore: false, mobileNumber: '', customerData: '', creditAmount: '', transactionType: '', isSave:false,isEdit: false,error:{}});
  }


  getCreditNotes() {
    const accountType ='CREDIT';
    const { storeId } = this.state;
   const reqOb =  {
      fromDate: null,
      mobileNumber:null,
      storeId: storeId,
      toDate: null,
      accountType: "CREDIT",
      customerId: null
    }
    AccountingPortalService.getCreditNotes(reqOb).then(response => {
      if (response) {
        this.setState({ creditData: response.data,totalPages: response.data.totalPages });
      }
    });
  }

  searchCreditNotes = (pageNumber) => {
    if(this.state.fromDate || this.state.toDate || this.state.searchMobileNumber){
    const { storeId, fromDate, toDate, searchMobileNumber } = this.state;
   const reqOb =  {
      fromDate: fromDate,
      mobileNumber: searchMobileNumber ? `+91${searchMobileNumber}` : null,
      storeId: storeId,
      toDate: toDate,
      accountType: "CREDIT",
      customerId: null
    }
    AccountingPortalService.getCreditNotes(reqOb,pageNumber).then(response => {
      if (response.data.content.length !== 0) {
        this.state.creditData=response?.data;
          this.setState({ creditData: response.data, totalPages: response.data.totalPages });
      }
      else{
        this.setState({ creditData: [] });
        toast.error("No Record Found")
      }
    });
  }else{
    toast.error("Please Give Any Input Field");
  }
  }

  clearCreditNotes = () => {
    this.setState({fromDate:"", toDate:"",searchMobileNumber:""}, () => {
        this.getCreditNotes();
    });
  }
  

   

  saveCredit() {
    const {customerData, comments, storeId, creditAmount, transactionType,cardPaymentType } = this.state;
    const obj = {
      comments: comments,
      amount: creditAmount,
      customerId: customerData.userId,
      storeId: storeId,
      transactionType: "CREDIT",
      accountType:"CREDIT",
      paymentType: transactionType
    }
    if(this.handleValidation()) {
    AccountingPortalService.saveCredit(obj).then(response => {
      if (response) {
        this.setState({ isCardAuto: false ,isCredit:false});
        if(cardPaymentType === 'Automatic') {
          this.savePayment(response.data.amount, response.data.referenceNumber);
        } 
        if(cardPaymentType === 'Manual') {
          this.getCreditNotes()
          this.closeCredit();
        }        
        toast.success ("Payment Done Successfully")
        this.getCreditNotes();       
      }
    });
    }
  else{
    toast.info("Please Enter all mandatory fields");
  }
  }

  getAllLedgerLogs = () => {
    const { selectedItem } = this.state;
    const reqOb =  {
      fromDate: null,
      mobileNumber:null,
      storeId: selectedItem.storeId,
      toDate: null,
      accountType: selectedItem.accountType,
      customerId: selectedItem.customerId
    }
    AccountingPortalService.getAllLedgerLogs(reqOb).then(response => {
      if (response) {
        this.setState({
          isShowAllTransactions: true,
          transactionHistory: response.data.content
        });
      }
    });
  }
  addMore = (item) => {
    this.setState({
      isCredit: true,
      isAddMore: true,
      selectedItem: item,
      isSave:true,
      mobileNumber: item.mobileNumber,
      customerData: { userName: item.customerName, userId: item.customerId }
    });
  }
  handelTrasanctionTypes = (e) => {
      this.setState({ transactionType: e.target.value }, () => {
        const  { transactionType } = this.state;
       if( transactionType === 'Card') {
        this.setState({ isCardAuto: true });
       }
      });
  }
  handleValidation () {
    let error= {};
    let formIsValid= true;

    //Mobile Number
    if(!this.state.mobileNumber){
      formIsValid = false;
      error["mobileNumber"] = creditNotes_Err_Msg.mobileNumber;
      }
      //credit Amount
    if(!this.state.creditAmount){
      formIsValid = false;
      error["creditAmount"] = creditNotes_Err_Msg.creditAmount;
      }

    //Payment type
    if(!this.state.transactionType){
      formIsValid = false;
      error["transactionType"] = creditNotes_Err_Msg.transactionType;
      }
   
    this.setState({ error: error });               
    return formIsValid;  
  }


  getCustomerDetails = (e) => {

    if (e.key === "Enter" ) {
  if(this.state.mobileNumber.length >=10){
      NewSaleService.getMobileData("+91" + this.state.mobileNumber).then((res) => {

        if (res && res.data.result) {

          this.setState({ customerData: res.data.result,isSave:true });
        
        }else{
          this.setState({isSave:false})
        }
      });
  }
  else{
    toast.info("Please Enter Valid Mobile Number");
  }
    
  }
}

  toggle = () => {
    this.setState({
      isShowAllTransactions: false,
      transactionHistory: []
    });
  }

  hideCardAutomatic = (e) =>{
    this.setState({ cardPaymentType: e.target.value});
    this.setState({ value: e.target.value});
  
  }

 

  
  savePayment = (cardAmount, referenceNumber) => {
    const reqObj = {
      amount: cardAmount,
      type: "C",
      referenceNumber : referenceNumber
    }
    AccountingPortalService.creditdebitOrder(reqObj).then((res) => {
      const self = this;
    const options = {
      key: "rzp_test_z8jVsg0bBgLQer",
      currency:"INR",
      amount: res.data.result.amount ,
      name: "OTSI",
      description: "Transaction",
      image: ecommerce,
      order_id: res.data.result.razorPayId,
      handler: function (response) {
        toast.success("Payment Done Successfully");
        self.getCreditNotes();
        let status = true
        const param = '?razorPayId=' + response.razorpay_order_id + '&payStatus=' + status;
        const result = axios.post(BASE_URL + ACCOUNTING_PORTAL.payconfirmation + param, {});
      },
      prefill: {
        name: "Kadali",
        email: "kadali@gmail.com",
        contact: "9999999999",
      },
   };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    this.closeCredit();
    this.getCreditNotes();
  });
}


changePage(pageNumber) {
  let pageNo = pageNumber + 1;
  this.setState({ pageNumber: pageNo });
  this.searchCreditNotes(pageNumber); 
}

  render() {
    const {value} =this.state;
    return (
      <div className="maincontent">
        <Modal isOpen={this.state.isCredit} size="lg">
          <ModalHeader>Add Credit Notes <button type='button' onClick={() =>this.closeCredit()} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-12">
                <h6 className="text-red mb-2 fs-14">Credit information</h6>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label>Mobile Number <span className="text-red font-bold" name="bold">*</span></label>
                  <input type="text" className="form-control" placeholder=""
                    value={this.state.mobileNumber} disabled={this.state.isEdit}
                    maxLength={errorLengthMax.mobileNumber}
                    onChange={(e) => 
                      {
                        const regex = /^[0-9\b]+$/;
                        const value = e.target.value;
                        this.state.error["mobileNumber"]="";
                        if (value === '' || regex.test(value)) {
                            this.setState({
                                [e.target.id]: e.target.value, mobileNumber: e.target.value,
                
                            });
                        } else {
                         
                        }
                
                      }
                    }
                    minLength="10"
                    onKeyPress={this.getCustomerDetails}


                  />
                  <span style={{ color: "red" }}>{this.state.error["mobileNumber"]}</span>
                </div>
                
              </div>
              <div className="col-4">
                <div className="form-group">
                  <label>Customer Name</label>
                  <input type="text" className="form-control" placeholder=""
                    value={this.state.customerData?.userName} disabled
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="form-group">
                  <label>Credit Amount <span className="text-red font-bold" name="bold">*</span></label>
                  <input type="text" className="form-control" placeholder="₹"
                    value={this.state.creditAmount} disabled={this.state.isEdit}
                    maxLength={errorLengthMax.creditAmount}
                    onChange={(e) =>  {
                      const regex = /^[0-9]+/;
                      const value = e.target.value;
                      this.state.error["creditAmount"]="";
                      if (value === '' || regex.test(value)) {
                          this.setState({
                              [e.target.id]: e.target.value, creditAmount: e.target.value,
              
                          });
                      } else {
                          
                      }
                    }}
                  />
                   <span style={{ color: "red" }}>{this.state.error["creditAmount"]}</span>
                </div>
               
              </div>
              <div className="col-4 mt-3">
                <div className="form-group">
                  <label>Store</label>
                  <input type="text" className="form-control" placeholder=""
                    value={this.state.storeName} disabled
                  />
                </div>
              </div>
              <div className="col-4 mt-3">
                <div className="form-group">
                  <label>Created By</label>
                  <input type="text" className="form-control" placeholder=""
                    value={this.state.userName} disabled
                  />
                </div>
              </div>
              <div className="col-4 mt-3">
                <div className="form-group">
                  <label>Payment Type <span className="text-red font-bold" name="bold">*</span></label>
                  <select disabled={!this.state.creditAmount} value={this.state.transactionType} 
                  onChange={(e) => this.handelTrasanctionTypes(e)} className="form-control">
                      <option>Select Payment Type</option>
                        { 
                            this.state.trasanctionTypes &&
                            this.state.trasanctionTypes.map((item, i) => 
                            (<option key={i} value={item.value}>{item.label}</option>))
                          }
                    </select>
                    <span style={{ color: "red" }}>{this.state.error["transactionType"]}</span>
                </div>
               
              </div>
              <Modal
          isOpen={this.state.isCardAuto}
          size="sm"
          onRequestHide={this.hideCardAutoModel}
        >
          <ModalHeader> Payment Type <button type='button' onClick={() =>this.hideCashModal()} className='btn search modal-close text-right'></button></ModalHeader>
          
            <div className="row mt-4 mb-3">
              <div className="form-group">
               
      <input type="radio" id="specifyColor" checked={this.state.cardPaymentType === "Automatic"} 
onClick={this.hideCardAutomatic.bind(this)} value="Automatic" /> <label className="fs-14">Automatic</label>
            
            <input type="radio" id="specifyColor" className="m-l-3" checked={this.state.cardPaymentType === "Manual"} 
onClick={this.hideCardAutomatic.bind(this)} value="Manual" /> <label className="fs-14">Manual</label>
   
{value === "Manual" && (
                 <div className="col-4">
                <div className="form-group">
                  <label>Credit Amount </label>
                  <input type="text" className="form-control" placeholder="₹"
                    value={this.state.creditAmount} 
                    onChange={(e) =>  {
                      const regex = /^[0-9]+/;
                      const value = e.target.value;
                      this.state.error["creditAmount"]="";
                      if (value === '' || regex.test(value)) {
                          this.setState({
                              [e.target.id]: e.target.value, creditAmount: e.target.value,
              
                          });
                      } else {
                          
                      }
                    }}
                    disabled
                  />
                  
                </div>  
              </div>

              )}
               
              {value === "Manual" && ( 
                <div className="col-4">
                <div className="form-group">
                <label>Transaction Number </label>
                <input
                  type="text"
                  name="cash"
                  id="transactionNumber"
                  className="form-control"
                  value={this.state.transactionNumber}
                  onChange={(e) =>
                    this.setState({ transactionNumber: e.target.value })
                  }
                />
              </div>
              </div>
            )}
            <ModalFooter>
            <button className="pt-2 btn-bdr" onClick={this.hideCardAutoModel}>
              CANCEL
            </button>
            <button
                            className="btn-unic active fs-12" name="click"
                            onClick={this.saveManual}
                        >
                            Save
                        </button>
          </ModalFooter>
        
         </div>
         </div>
        </Modal>
              <div className="col-4 mt-3">
                <div className="form-group">
                  <label>Comments</label>
                  <textarea
                    value={this.state.comments}
                    onChange={(e) => this.setState({ comments: e.target.value })}
                  ></textarea>
                </div>
              </div>
              {this.state.isAddMore && <div className="col-4 mt-5">
                <div className="form-group underline geeks">
                <label></label>
                  <a onClick={() => this.getAllLedgerLogs()}>Show All Transactions</a>
                </div>
              </div>}
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.closeCredit}>
              Cancel
            </button>
            <button
              // className="btn-unic active fs-12"
              className={this.state.isSave ? "btn-unic active fs-12" : "btn-selection fs-12"}
              disabled={!this.state.isSave}
              onClick={this.saveCredit}
            >
              Save
            </button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.isShowAllTransactions}  size="lg"  style={{maxWidth: '1000px', width: '100%'}}>
        <ModalHeader>All Transactions <button type='button' onClick={() =>this.toggle()} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>
          <ModalBody>
                  <div className="table-responsive p-0">                      
                    <table className="table table-borderless mb-1 mt-2">
                      {this.state.transactionHistory && <thead>
                        <tr className="mt-1 p-0">
                          <th className="col-2">#CRM ID</th>
                          <th className="col-1">STORE</th>
                          <th className="col-2">TRASANCTION TYPE</th>
                          <th className="col-2">ACCOUNT TYPE</th>                          
                          <th className="col-2">AMOUNT</th>
                          <th className="col-3">DATE</th>
                        </tr>
                      </thead>}
                      <tbody>
                        {this.state.transactionHistory && this.state.transactionHistory.map((itm, ind) => {
                            return (
                              <tr key={ind}>
                                <td className="col-2">{itm.customerId}</td>
                                <td className="col-1">{itm.storeId}</td>
                                <td className="col-2">{itm.transactionType}</td>
                                <td className="col-2">{itm.accountType}</td>
                                <td className="col-2">{itm.amount}</td>
                                <td className="col-3">{itm.createdDate}</td>
                              </tr>
                              )
                        })}
                      </tbody>
                    </table>
                  </div>
            </ModalBody>
          </Modal>
        <div className="row">
          <div className="col-sm-2 col-12 mt-2">
            <div className="form-group mb-3">
            <label>From Date</label>
              <input type="date" className="form-control"
                placeholder="FROM DATE" value={this.state.fromDate}
                onChange={(e) => this.setState({ fromDate: e.target.value })}
                autoComplete="off"
                />
            </div>
          </div>
          <div className="col-sm-2 col-12 mt-2">
            <div className="form-group mb-3">
            <label>To Date</label>
              <input type="date" className="form-control"
                placeholder="TO DATE" 
                value={this.state.toDate}
                onChange={(e) =>{
                  var startDate = new Date(this.state.fromDate);
                  var endDate = new Date(e.target.value);
                  if(!this.state.fromDate){
                    toast.error("Please Select From Date")
                  }
                  if (startDate <= endDate) {
                    this.setState({ toDate: e.target.value });
                  } else {
                    toast.error("To Date Should Be Greater Than From Date");
                  }
                }}
                autoComplete="off"
                />
            </div>
          </div>
          <div className="col-sm-2 col-12 mt-2">
            <div className="form-group mb-3">
            <label>Mobile</label>
              <input type="text" className="form-control"
                placeholder="Mobile Number" 
                maxLength="10"
                minLength="10"
                value={this.state.searchMobileNumber}
                onChange={(e) => {
                  const regex = /^[0-9\b]+$/;
                  const value = e.target.value;
                  if (value === '' || regex.test(value)) {
                      this.setState({
                          [e.target.id]: e.target.value, searchMobileNumber: e.target.value,
          
                      });
                  } else {
                  }
          
                }}
                autoComplete="off"
                />
            </div>
          </div>
          <div className="col-sm-6 col-12 scaling-mb scaling-center pt-4">
            <button className="btn-unic-search active m-r-2 mt-2" onClick={()=>{this.searchCreditNotes(0); this.setState({ pageNumber: 0 });}}>Search</button>
            <button className="btn-clear m-r-2 mt-2" onClick={this.clearCreditNotes}>Clear</button>
            <button className={this.state.addCreditNotePrevilige?.isEnabeld ? "btn-unic-search active mt-1 m-r-2" : "btn-unic-search btn-disable mt-1 m-r-2"}
              disabled={!this.state.addCreditNotePrevilige?.isEnabeld} onClick={this.addCredit}><i className="icon-credit_notes"></i> Add Credit Notes</button>
          </div>
        </div>
        <div className="row m-0 p-0 scaling-center">
          <h5 className="mt-1 mb-2 fs-18 p-l-0">List Of Credit Notes</h5>
          <div className="table-responsive p-0">
            <table className="table table-borderless mb-1 mt-2">
              <thead>
                <tr className="m-0 p-0">
                  <th className="col-1">#CRM ID</th>
                  <th className="col-2">Customer Name</th>
                  <th className="col-1">Store</th>
                  <th className="col-2">Date</th>
                  <th className="col-2">Used Amount</th>
                  <th className="col-1">Balance</th>
                  <th className="col-2">Approved By</th>
                  <th className="col-1"></th>
                  {/* <th className="col-1"></th> */}
                </tr>
              </thead>
              <tbody>
               {this.state.creditData?.content?.length > 0 && <div> {this.state.creditData?.content?.map((items, index) => {
                  let date = formatDate(items.createdDate)
                  return (
                    <tr key={index}>
                      <td className="col-1">{items.customerId}</td>
                      <td className="col-2">{items.customerName}</td>
                      <td className="col-1">{items.storeId}</td>
                      <td className="col-2">{date.substring(0,10)}</td>
                      <td className="col-2">₹ {items.usedAmount}</td>
                      <td className="col-1">₹ {items.amount}</td>
                      <td className="col-2">{items.createdBy}</td>
                      <td className="col-1 underline geeks"><a onClick={() => this.addMore(items)}>Add Credit</a></td>

                    </tr>
                  );
                })}
              </div>  }
              {
                this.state.creditData?.content?.length === 0
                 && <div className='no_records'><img src={confirm}></img> <label>No records found</label> </div>
              }
              </tbody>
           
            </table>

            <div className="row m-0 pb-3 mb-5 mt-3">

{this.state.totalPages > 1 ? (
            <div className="d-flex justify-content-center">
                 <ReactPageNation
                  {...this.state.creditData}
                  changePage={(pageNumber) => {
                    this.changePage(pageNumber);
                    }}
                   />
                  </div>
                   ) : null} 
                   </div>


          </div>

        </div>

      </div>
    )
  }
}
