import axios from 'axios';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import ecommerce from "../../assets/images/ecommerce.svg";
import { NEW_SALE_URL } from "../../commonUtils/ApiConstants";
import { BASE_URL } from "../../commonUtils/Base";
import { formatDate } from "../../commonUtils/FormatDate";
import ReactPageNation from "../../commonUtils/Pagination";
import AccountingPortalService from '../../services/AccountingPortal/AccountingPortalService';
import NewSaleService from '../../services/NewSaleService';
import { debitNotes_Err_Msg, errorLengthMax } from './Error';
import confirm from '../../assets/images/conformation.svg';

export default class DebitNotes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isDebit: false,
      pageNumber:0,
      totalPages:0,
      mobileNumber: "",
      storeName: "",
      userName: "",
      userId: "",
      debitAmount: "",
      error: {},
      storeId: "",
      customerData: {},
      debitData: [],
      isEdit: false,
      searchMobileNumber: '',
      transactionType: '',
      trasanctionTypes: [
        {label: 'Card', value: 'Card'},
        {label: 'Cash', value: 'Cash'}
      ],
      payableAmount: '',
      isPayMore: false,
      transactionHistory: [],
      isShowAllTransactions: false
    };

    this.addDebit = this.addDebit.bind(this);
    this.closeDebit = this.closeDebit.bind(this);
    this.saveDebit = this.saveDebit.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.changePage = this.changePage.bind(this);
    this.Validation=this.Validation.bind(this);
  }


  addDebit() {
    this.setState({ isDebit: true });
  }

  closeDebit() {
    this.setState({ isDebit: false ,transactionType: '', payableAmount: '', comments: '', isEdit: false,error:{}});
  }

  componentWillMount() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const selectedStore = JSON.parse(sessionStorage.getItem('selectedstoreData'));
    this.setState({ storeName: selectedStore.storeName, storeId: selectedStore.storeId, userName: user["cognito:username"], userId: user["custom:userId"] }, () => this.getDebitNotes());
  }

  getDebitNotes() {
  const { storeId } = this.state;
   const reqOb =  {
      fromDate: null,
      mobileNumber:null,
      storeId: storeId,
      toDate: null,
      accountType: "DEBIT",
      customerId: null
    }
    AccountingPortalService.getDebitNotes(reqOb).then(response => {
      if (response) {
        this.setState({ debitData: response.data,totalPages: response.data.totalPages });
      }
    });
  }

  searchDebitNotes = (pageNumber) => {
    if(this.state.fromDate || this.state.toDate || this.state.searchMobileNumber){
    const { storeId, fromDate, toDate, searchMobileNumber } = this.state;
    const reqOb =  {
      fromDate: fromDate,
      mobileNumber: searchMobileNumber ? `+91${searchMobileNumber}` : null,
      storeId: storeId,
      toDate: toDate,
      accountType: "DEBIT",
      customerId: null
    }
    AccountingPortalService.getDebitNotes(reqOb,pageNumber).then(response => {
      if (response.data.content.length !== 0) {
        this.state.debitData=response?.data;
        this.setState({ debitData: response.data,totalPages: response.data.totalPages});
      }
      else{
        this.setState({ debitData: [] });
        toast.error("No Record Found")
      }
    });
  }else{
    toast.error("Please Give Any Input Field");
  }
    }
  clearSearch = () => {
    this.setState({ fromDate: "", toDate: "", searchMobileNumber: "" }, () => {
      this.getDebitNotes();
    });
  }


  saveDebit() {
   
    const {customerData, comments, storeId, mobileNumber, payableAmount, transactionType} = this.state;
    const obj = {
      comments: comments,
      amount: payableAmount,
      customerId: customerData.userId,
      // mobileNumber: mobileNumber,
      storeId: storeId,
      transactionType: "DEBIT",
      accountType:"DEBIT",
      paymentType: transactionType
    }
   if(this.handleValidation()) {
    AccountingPortalService.saveDebit(obj).then(response => {
      if (response) {
        if(transactionType === 'Card') {
          this.savePayment(response.data.amount, response.data.referenceNumber);
        }
        toast.success(response.data.message);
        this.getDebitNotes();
        if(transactionType === 'Cash') {
           this.closeDebit();
        }
      
      }
    });
  }

  }

  savePayment = (cardAmount, referenceNumber) => {
    const reqObj = {
      amount: cardAmount,
      type: "D",
      referenceNumber : referenceNumber
    }
    AccountingPortalService.creditdebitOrder(reqObj).then((res) => {
    const options = {
     // process.env.RAZORPAY_KEY_ID
      key: "rzp_test_z8jVsg0bBgLQer",
      currency:"INR",
      amount: res.data.result.amount ,
      name: "OTSI",
      description: "Transaction",
      image: ecommerce,
      order_id: res.data.result.razorPayId,
      handler: function (response) {
        toast.success("Payment Done Successfully");
        let status = true
        const param = '?razorPayId=' + response.razorpay_order_id + '&payStatus=' + status;
        const result = axios.post(BASE_URL + NEW_SALE_URL.saveSale + param, {});
      },
      prefill: {
        name: "Kadali",
        email: "kadali@gmail.com",
        contact: "9999999999",
      },
   };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    this.closeDebit();
  });
}

  getCustomerDetails = (e) => {
    if (e.key === "Enter") {
      NewSaleService.getMobileData("+91" + this.state.mobileNumber).then((res) => {
        if (res && res.data.result) {
          // this.state.customerData = res.data.result;
          this.setState({ customerData: res.data.result });

        } else {
          toast.error("No Data Found");
        }
      });
    }
  };

  addMore = (item) => {
    this.setState({
      isDebit: true,
      isPayMore: true,
      debitAmount: item.amount,
      selectedItem: item,
      mobileNumber: item.mobileNumber,
      customerData: { userName: item.customerName, userId: item.customerId }
    });
  }

  handelTrasanctionTypes = (e) => {
    this.state.error["transactionType"] = '';
      this.setState({ transactionType: e.target.value 
    });
}

handleValidation () {
    let error= {};
    let formIsValid= true;

    //Payment type
    if(!this.state.transactionType){
      formIsValid = false;
      error["transactionType"] = debitNotes_Err_Msg.transactionType;
      }
    // payable amount
  if(this.state.transactionType && !this.state.payableAmount){
    formIsValid = false;
    error["payableAmount"] = debitNotes_Err_Msg.payableAmount;
    }

    this.setState({ error: error });               
    return formIsValid;  
  }
  Validation (){
    let error= {};
    let formIsValid= true;
    if( this.state.debitAmount < this.state.payableAmount ){
      error["payableAmount2"] = debitNotes_Err_Msg.payableAmount2
    }
    this.setState({ error: error });               
    return formIsValid;

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
  toggle = () => {
    this.setState({
      isShowAllTransactions: false,
      transactionHistory: []
    });
  }
  onPayableAmount = (e) => {
    e.preventDefault();    
    const { payableAmount, transactionType, comments } = this.state;
    if(comments !== '' & payableAmount !== '' && transactionType === 'Card') {
      this.saveDebit();
    }  
  }

  changePage(pageNumber) {
    console.log(">>>page", pageNumber);
    let pageNo = pageNumber + 1;
    this.setState({ pageNumber: pageNo });
    // this.getUserBySearch(pageNumber);
    // this.searchUser(pageNumber);
    this.searchDebitNotes(pageNumber); 
  }


  render() {
    return (
      <div className="maincontent">
        <Modal isOpen={this.state.isDebit} size="lg">
          <ModalHeader>Add Debit Notes</ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-12">
                <h6 className="text-red mb-2 fs-14">Debit information</h6>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label>Mobile Number <span className="text-red font-bold" name="bold">*</span></label>
                  <input type="text" className="form-control" placeholder="+91"
                    value={this.state.mobileNumber} maxLength={errorLengthMax.mobileNumber}
                    onChange={(e) => {
                      const regex = /^[0-9\b]+$/;
                      const value = e.target.value;
                      this.state.error["mobileNumber"]="";
                      if (value === '' || regex.test(value)) {
                        this.setState({
                          [e.target.id]: e.target.value, mobileNumber: e.target.value,

                        });
                      } else {
                        // toast.error("pls enter numbers")
                      }

                    }}
                    autoComplete="off"
                    minLength="10"
                    // maxLength="10"
                    onKeyPress={this.getCustomerDetails}
                    disabled
                  />
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label>Customer Name <span className="text-red font-bold" name="bold">*</span></label>
                  <input type="text" className="form-control" placeholder=""
                    value={this.state.customerData?.userName} disabled
                  />
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label>Debit Amount <span className="text-red font-bold" name="bold">*</span></label>
                  <input type="text" className="form-control" placeholder="₹"
                    value={this.state.debitAmount}
                    disabled
                    onChange={(e) => {
                      const regex = /^[0-9]+/;
                      const value = e.target.value;
                      this.state.error["debitAmount"]="";
                      if (value === '' || regex.test(value)) {
                        this.setState({
                          [e.target.id]: e.target.value, debitAmount: e.target.value,

                        });
                      } else {
                        // toast.error("pls enter numbers")
                      }
                    }}
                  />
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
                  <label>Approved By</label>
                  <input type="text" className="form-control" placeholder=""
                    value={this.state.userName} disabled
                  />
                </div>
              </div>
              <div className="col-4 mt-3">
                <div className="form-group">
                  <label>Payment Type <span className="text-red font-bold" name="bold">*</span></label>
                  <select value={this.state.transactionType}  disabled={this.state.isEdit}
                  onChange={(e) => this.handelTrasanctionTypes(e)} 
                  className="form-control">
                      <option>Select Payment Type</option>
                        { 
                            this.state.trasanctionTypes &&
                            this.state.trasanctionTypes.map((item, i) => 
                            (<option key={i} value={item.value}>{item.label}</option>))
                          }
                    </select>
                </div>
                <span style={{ color: "red" }}>{this.state.error["transactionType"]}</span>
              </div>


             {this.state.transactionType && <React.Fragment><div className="col-4 mt-3">
                <div className="form-group">
                  <label>Payable Amount <span className="text-red font-bold" name="bold">*</span></label>
                  <input type="text" className="form-control" placeholder="₹"
                    value={this.state.payableAmount} 
                    onChange={(e) => { 
                      const regex = /^[0-9]+/;
                      const value = e.target.value;
                      this.state.error["payableAmount"]="";
                      if (value === '' || regex.test(value)) {
                        this.setState({
                          [e.target.id]: e.target.value, payableAmount: e.target.value,

                        },() =>{this.Validation()} );
                      }
                     }}
                  />
                </div>
               <span style={{ color: "red" }}>{this.state.error["payableAmount"]}</span>
                <span style={{ color: "red" }}>{this.state.error["payableAmount2"]}</span>
              </div>
              <div className="col-4">
              <div className="form-group">
               
              </div>
            </div>
            <div className="col-4">
              <div className="form-group">
               
              </div>
            </div> 
          </React.Fragment>}

              
              
              <div className="col-4 mt-3">
                <div className="form-group">
                  <label>Comments</label>
                  <textarea
                    value={this.state.comments}
                    onChange={(e) => this.setState({ comments: e.target.value })}
                     onBlur={(e) => this.onPayableAmount(e)}
                  ></textarea>
                </div>
              </div>
              {this.state.isPayMore && <div className="col-4 mt-5">
                <div className="form-group underline geeks">
                <label></label>
                  <a onClick={() => this.getAllLedgerLogs()}>Show All Transactions</a>
                </div>
              </div>}
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.closeDebit}>
              Cancel
            </button>
            <button
              //className="btn-unic active fs-12"
              className={ this.state.payableAmount <=this.state.debitAmount  ? "btn-unic active fs-12" : "btn-selection fs-12"}
              disabled = {!(this.state.payableAmount <=this.state.debitAmount ) }
              onClick={this.saveDebit}
            >
              Save
            </button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.isShowAllTransactions}  size="lg" style={{maxWidth: '1000px', width: '100%'}}>
        <ModalHeader toggle={() =>this.toggle()} charCode="close">All Transactions</ModalHeader>
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
            {/* <ModalFooter>
            <button onClick={() => this.closeTransactionModel()} className="btn-unic" >
              Cancel
            </button>
          </ModalFooter> */}
          </Modal>



        <div className="row">
          {/* <div className="col-sm-3 col-12">
            <div className="form-group mt-2 mb-3">
              <select className="form-control">
                <option>Select Store</option>
                <option>Bradipet</option>
                <option>Arundel Pet</option>
                <option>Lakshmipuram</option>
              </select>
            </div>
          </div> */}
          <div className="col-sm-2 col-12 mt-2">
            <div className="form-group mb-3">
            <label>From Date</label>
              <input type="date" className="form-control"
                placeholder="FROM DATE"
                value={this.state.fromDate}
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
                  console.log(">>>", this.state.fromDate);
                  if(!this.state.fromDate){
                    toast.error("Please Select From Date")
                    console.log("++++++startdate+++++"+this.state.fromDate)
                  }
                  if (startDate <= endDate) {
                    this.setState({ toDate: e.target.value });
                  } else {
                    toast.error("To Date Should Be Greater Than From Date");
                    console.log("++++++enddate+++++"+endDate)
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
                    // toast.error("pls enter numbers")
                  }

                }}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="col-sm-6 col-12 scaling-mb scaling-center pt-4">
            <button className="btn-unic-search active m-r-2 mt-2" onClick={()=>{this.searchDebitNotes(0);this.setState({pageNumber:0})}}>Search</button>
            <button className="btn-clear m-r-2 mt-2" onClick={this.clearSearch}>Clear</button>
            {/* <button className="btn-unic-search mt-2 active" onClick={this.addDebit}>Add Debit Notes</button> */}
          </div>
        </div>
        <div className="row m-0 p-0 scaling-center">
          <h5 className="mt-1 mb-2 fs-18 p-l-0">List Of Debit Notes</h5>
          <div className="table-responsive p-0">
            <table className="table table-borderless mb-1 mt-2">
              <thead>
                <tr className="m-0 p-0">
                  <th className="col-1">#CRM ID</th>
                  <th className="col-2">Customer Name</th>
                  <th className="col-1">Store</th>
                  <th className="col-2">Date</th>
                  <th className="col-2">Balance</th>
                  <th className="col-2">Approved By</th>
                  <th className="col-2"></th>
                  {/* <th className="col-1"></th> */}
                </tr>
              </thead>
              <tbody>

                {this.state.debitData?.content?.length > 0 && this.state.debitData?.content?.map((items, index) => {
                   let date = formatDate (items.createdDate);
                  return (
                    <tr key={index}>
                      <td className="col-1">{items.customerId}</td>
                      <td className="col-2">{items.customerName}</td>
                      <td className="col-1">{items.storeId}</td>
                      <td className="col-2">{date.substring(0,10)}</td>
                      <td className="col-2">₹ {items.amount}</td>
                      <td className="col-2">{items.approvedBy}</td>
                      <td className="col-2 underline geeks"><a onClick={() => this.addMore(items)}>Pay Due</a></td>
                      {/*<td className="col-1">
                         <img src={edit} className="w-12 pb-2" />
                        <i className="icon-delete m-l-2 fs-16"></i> 
                      </td>*/}
                    </tr>
                  );
                })}
                 {this.state.debitData?.content?.length === 0 &&   <div className='no_records'><img src={confirm}></img> <label>No records found</label> </div>} 
              </tbody>
            </table>
            <div className="row m-0 pb-3 mb-5 mt-3">

{this.state.totalPages > 1 ? (
            <div className="d-flex justify-content-center">
                 <ReactPageNation
                  {...this.state.debitData}
                  changePage={(pageNumber) => {
                    this.changePage(pageNumber);
                    }}
                   />
                  </div>):null}
                  </div>

          </div>

        </div>

      </div>
    );
  }
}
