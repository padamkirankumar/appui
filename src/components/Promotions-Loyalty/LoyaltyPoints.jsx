
import React, { Component } from 'react';
import edit from '../../assets/images/edit.svg';
import left from "../../assets/images/table_arrow_left.svg";
import right from "../../assets/images/table_arrow_right.svg";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import PromotionsService from "../../services/PromotionsService";
import { toast } from "react-toastify";
import confirm from '../../assets/images/conformation.svg';
import URMService from '../../services/URM/URMService';


export default class LoyaltyPoints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdd: false,
      invoiceNumber: '',
      mobileNumer: '',
      amountPaid: '',
      clientId: '',
      listAllLoyaltyPoints: [],
      saveMobileNumer: '',
      amountPaid: '',
      name: '',
      saveInvoiceNumber: '',
      userId: '',
      invoiceCreatedDate: ''
    }
    this.addLoyalityPoints = this.addLoyalityPoints.bind(this);
    this.closeLoyalityPoints = this.closeLoyalityPoints.bind(this);
    this.saveLoyalyatyPoints = this.saveLoyalyatyPoints.bind(this);
    this.getInvoiceDetails = this.getInvoiceDetails.bind(this);
    this.getAllLoyaltyPoints = this.getAllLoyaltyPoints.bind(this);
    this.searchLoyaltyPoints = this.searchLoyaltyPoints.bind(this);
  }
  componentDidMount() {
    const selectedDomain = sessionStorage.getItem('selectedDomain');
    const domainName =  JSON.parse(selectedDomain);
    // URMService.getSelectedPrivileges(domainName.label).then(res => {
    //   if(res.data.isSuccess === 'true') {
    //    //  this.setState({ clientId:  res.data.result['clientDomian']['domain'][0].id});
    //   } else {
    //     toast.error(res.data.message);
    //   }      
    // });
    this.getAllLoyaltyPoints();
  }
  getAllLoyaltyPoints () {
    PromotionsService.getAllLoyaltyPoints().then((res) => {
      if(res.data.isSuccess === 'true') {
        this.setState({
          listAllLoyaltyPoints: res.data['result']
        });
      } else {
        toast.error(res.data.message);
      }
    });
  }
  searchLoyaltyPoints() {
    const { invoiceNumber, mobileNumer } = this.state;
   const obj =  {
      invoiceNumber: invoiceNumber,
      mobileNumber : mobileNumer
    }
    PromotionsService.searchLoyaltyPoints(obj).then((res) => {
      if(res.data.isSuccess === 'true') {
        this.setState({
          invoiceNumber: '',
          mobileNumber : '',
          listAllLoyaltyPoints: res.data['result']
        });
      } else {
          toast.error(res.data.message);
      }
    });

  }
  
  getInvoiceDetails = (e) => {
    if(e.key === 'Enter') {
      PromotionsService.getInvoiceDetails(this.state.saveInvoiceNumber).then(res => {
        if(res.data.isSuccess === 'true') {
          const result = res.data['result'];
           this.setState({
             saveMobileNumer: result.mobileNumber,
             amountPaid: result.netPayableAmount,
             name: result.customerName,
             userId: result.userId,
             invoiceCreatedDate: result.createdDate
           });
         } else {
          toast.error(res.data.message);
         }
       });
    }
    
  }

  addLoyalityPoints() {
    this.setState({ isAdd: true });
  }
  closeLoyalityPoints() {
    this.setState({ isAdd: false });
  }
  handleInvoiceNumber(e) {
    this.setState({ invoiceNumber: e.target.value });
  }
  handleAmountPaid(e) {
    this.setState({ amountPaid: e.target.value });
  }
  handleMobileNumer(e) {
    this.setState({ mobileNumer: e.target.value });
  }
  handleSaveInvoiceNumber(e) {
    this.setState({ saveInvoiceNumber: e.target.value });
  }
  handleaSaveName(e) {
    this.setState({ name: e.target.value });
  }
  handleAmountPaid(e) {
    this.setState({ amountPaid: e.target.value });
  }
  handleSaveMobileNumer(e) {
    this.setState({ saveMobileNumer: e.target.value });
  } 
  getTodaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm  + '-' + dd;
    return today;
  }
  
  saveLoyalyatyPoints() {
    const { saveMobileNumer, name, saveInvoiceNumber, amountPaid, clientId, userId, createdDate } = this.state;
    const obj = {
      userId: userId,
      domainId: clientId,
      mobileNumber: saveMobileNumer,
      customerName: name,
      invoiceNumber: saveInvoiceNumber,
      invoiceCreatedDate: createdDate === undefined ? this.getTodaysDate() : createdDate,
      invoiceAmount: amountPaid
    }
    PromotionsService.saveLoyaltyPoints(obj).then(res => {
      if(res.data.isSuccess === 'true') {
        toast.success(res.data.message);
        this.setState({
          isAdd: false,
          userId: '',
          domainId: '',
          saveMobileNumer: '',
          amountPaid: '', 
          name: '',
          saveInvoiceNumber: '',
        });
      } else {
        toast.error(res.data.message);
      }
      this.getAllLoyaltyPoints();
    });
  }

    render() { 
        return (
            <div className="maincontent">
                      <Modal isOpen={this.state.isAdd} size="lg">
          <ModalHeader>Add Loyalty Points</ModalHeader>
          <ModalBody>
          <div className="row">
                {/* <div className="col-4">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" className="form-control" placeholder="" />
                </div>
                </div> */}
                
                {/* <div className="col-4">
                <div className="form-group">
                  <label>Gender</label>
                  <select className="form-control">
                    <option>Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                </div> */}
                {/* <div className="col-12 mt-3">
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" className="form-control" placeholder="Enter Address" />
                </div>
                </div> */}
                <div className="col-4 mt-3">
                <div className="form-group">
                  <label>Invoice No</label>
                  <input type="text" value={this.state.saveInvoiceNumber} onKeyDown={(e) => this.getInvoiceDetails(e)} onChange={(e) => this.handleSaveInvoiceNumber(e)} className="form-control" placeholder="" />
                </div>
                </div>
                <div className="col-4 mt-3">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" value={this.state.name} onChange={(e) => this.handleaSaveName(e)} className="form-control" placeholder="" />
                </div>
                </div>
                <div className="col-4 mt-3">
                <div className="form-group">
                  <label>Amount Paid</label>
                  <input type="text" disabled="true" value={this.state.amountPaid} onChange={(e) => this.handleAmountPaid(e)} className="form-control" placeholder="₹" />
                </div>
                </div>
                <div className="col-4 mt-3">
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="text" value={this.state.saveMobileNumer}  onChange={(e) => this.handleSaveMobileNumer(e)} className="form-control" placeholder="" />
                </div>
                </div>
                {/* <div className="col-4 mt-3">
                <div className="form-group">
                  <label>Add Points </label>
                  <select className="form-control">
                    <option>Select Points</option>
                    <option>Store Manager</option>
                    <option>Admin</option>
                    <option>Super Admin</option> 
                  </select>
                </div>
                </div> */}
                {/* <div className="col-4 mt-3">
                <div className="form-group">
                  <label>Store</label>
                    <select className="form-control">
                      <option>Kukatpally</option>
                      <option>Nizampet</option>
                      <option>LB Nagar</option>
                    </select>
                </div>
                </div> */}
                </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.closeLoyalityPoints}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              onClick={this.saveLoyalyatyPoints}
            >
              Save
            </button>
          </ModalFooter>
        </Modal>
            <div className="row">
              <div className="col-sm-3 col-12">
                <div className="form-group mt-2 mb-3">
                  <label>Invoice</label>
                   <input value={this.state.invoiceNumber} placeholder="Invoice Number" onChange={(e) => this.handleInvoiceNumber(e)} type="text" className="form-control" />
                </div>
              </div>
              <div className="col-sm-3 col-12">
                <div className="form-group mt-2 mb-3">
                <label>Mobile</label>
                    <input value={this.state.mobileNumer} placeholder="Mobile Number" onChange={(e) => this.handleMobileNumer(e)} type="text" className="form-control" />
                </div>
              </div>
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
              <div className="col-sm-3 col-12 scaling-mb scaling-center pt-4">
                <button className="btn-unic-search active m-r-2 mt-2" onClick={this.searchLoyaltyPoints}>SEARCH</button>
                <button className="btn-unic-redbdr mt-2" onClick={this.addLoyalityPoints}>Add Loyalty Points</button>
              </div>
            </div>
            <div className="row m-0 p-0 scaling-center">
              <div className="col-6 p-l-0"> <h5 className="mt-1 mb-2 fs-18 p-l-0">List Of Loyalty Customers <span className="text-red fs-14">(100 POINTS = ₹ 10)</span></h5></div>
            <div className="col-6 text-right p-r-0 mt-2 align-self-center">
            <span className="mt-3">Show on page </span><span className="font-bold fs-14"> 1-10</span><span> out of 11</span><button className="btn-transparent" type="button"><img src={left} /></button><button className="btn-transparent" type="button"><img src={right} /></button>
          </div>
             
              <div className="table-responsive p-0">
              <table className="table table-borderless mb-1 mt-2">
                <thead>
                  <tr className="m-0 p-0">
                    <th className="col-1">S.NO</th>
                    <th className="col-3">Customer Name</th>
                    <th className="col-2">Mobile Number</th>
                    <th className="col-2 text-center">Loyalty Points</th>
                    <th className="col-3">Expiry Date</th>
                    <th className="col-1 text-center">Points Value</th>
                    {/* <th className="col-1"></th> */}
                  </tr>
                </thead>
                  <tbody>
                      {this.state.listAllLoyaltyPoints.length > 0 && this.state.listAllLoyaltyPoints.map((item, index) => {
                          return( 
                            <tr key={index}>
                              <td className="col-1 underline geeks">{item.loyaltyId}</td>
                              <td className="col-3">{item.customerName}</td>
                              <td className="col-2">{item.mobileNumber}</td>
                              <td className="col-2 text-center">{item.loyaltyPoints}</td>
                              <td className="col-3">{item.expiredDate}</td>
                              <td className="col-1 text-center">0</td>
                            </tr> 
                            )
                          })}
                      {this.state.listAllLoyaltyPoints.length == 0  && <div className='no_records'><img src={confirm}></img> <label>No records found</label> </div>}
                  </tbody>
              </table>
             </div>
    
            </div>
    
          </div>
        )
    }
}
