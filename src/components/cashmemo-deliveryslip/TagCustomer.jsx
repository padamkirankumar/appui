import moment from "moment";
import React, { Component } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import close from '../../assets/images/cross.svg';
import {
  errorLengthMax, errorLengthMin, tagCustomer_Err_Msg
} from "../../commonUtils/Errors";
import PrivilegesList from '../../commonUtils/PrivilegesList';
import CreateDeliveryService from "../../services/CreateDeliveryService";

export default class TagCustomer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openn: false,
      mobileNumber: "",
      mobileData: {
        customerId: "",
        name: "",
        statusbar:"",
        startDate:"",
        endDate:"",
        gvNumber1:"",
        mobileNumber: "",
        gstNumber: "",
        address: "",
        email: "",
        dob: "",
        gender: "",
        altMobileNo: "",
      },
      errors: {},
      isUserTagged: false,
      name: "",
      gvNumber: "",
      gvNumberData: {
        gvId: "",
        userId: "",
        gvNumber: "",
        description: "",
        isTagged: "",
        expiryDate: "",
        totalAmount: "",
        leftOverAmount: "",
        createdDate: "",
        giftVochersList: [],
        isGiftVocher: false,
        addAddGiftVoucher:'',
        amount: "",
        fromDate: "",
        toDate: "",
        description: "",
      },
      gvSearchList: [],
      fromDate: "",
      toDate: "",
      gvNumber: "",
      activeGVNumber:""
    };

    this.handleChangeMobile = this.handleChangeMobile.bind(this);
    this.handleChangeGvNumber = this.handleChangeGvNumber.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createTagCustomerToGv = this.createTagCustomerToGv.bind(this);
    this.getGiftVochersList = this.getGiftVochersList.bind(this);
    this.addGiftVoucher = this.addGiftVoucher.bind(this);
    this.searchGiftVoucher = this.searchGiftVoucher.bind(this);
    this.saveGVNumber = this.saveGVNumber.bind(this);
  }

  componentWillMount() {
    const childPrivileges =PrivilegesList('Gift Voucher');
    childPrivileges.then((res) => {
      if(res) {
        const result = res.sort((a , b) => a.id - b.id);
        this.setState({
          addAddGiftVoucher: result[0],  
        });
      }
    });
    this.getGiftVochersList();
  }

  handleValidation() {
    let errors = {};
    let formIsValid = true;

    //Name

    if (this.state.gvNumber.length !== errorLengthMin.gvNumber) {
      formIsValid = false;
      errors["gvNumber"] = tagCustomer_Err_Msg.gvNumber;
    }

    // Mobile
    if (!this.state.fromDate) {
      formIsValid = false;
      errors["fromDate"] = tagCustomer_Err_Msg.fromDate;
    }

    // if (typeof this.state.mobileNumber !== "undefined") {
    //     if (!this.state.mobileNumber.match(/^[0-9\b]+$/)) {
    //         formIsValid = false;
    //         errors["mobileNumber"] = "Please Enter Valid Mobile Number";
    //     }
    // }

    if (!this.state.toDate) {
      formIsValid = false;
      errors["toDate"] = tagCustomer_Err_Msg.toDate;
    }

    if (!this.state.amount) {
      formIsValid = false;
      errors["amount"] = tagCustomer_Err_Msg.amount;
    }

    // if (typeof this.state.email !== "undefined") {

    //     if (!this.state.email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{4,})$/i)) {
    //         formIsValid = false;
    //         errors["email"] = "Please Enter Valid Email";
    //     }

    // }

    this.setState({ errors: errors });
    return formIsValid;
  }

  handleGVNumber=(e) =>{
    this.state.errors["gvNumber"] = '';
    this.setState({ gvNumber: e.target.value })
  };
  
  
  handleAmount=(e) =>{
    this.state.errors["amount"] = '';
    this.setState({ amount: e.target.value })
  };
  
  getGiftVochersList() {
    CreateDeliveryService.getGiftVochersList().then((res) => {
      if (res) {
        if (res.data.result != "Record not found") {
          this.setState({
            giftVochersList: res.data.result,
            isGiftVocher: true,
          });
        }

        // this.state.giftVochersList = res.data.result;
        // console.log(this.state.giftVochersList);
      }
    });
  }

  handleChangeMobile(event) {
    this.setState({ mobileNumber: event.target.value });
  }

  handleChangeGvNumber(event) {
    this.setState({ gvNumber: event.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.createTagCustomerToGv();
  }

  createTagCustomerToGv() {
    CreateDeliveryService.createTagCustomerToGv(
      this.state.customerId,
      this.state.gvId
    ).then((res) => {
      if (
        this.state.mobileNumber &&
        this.state.name &&
        this.state.gvNumber &&
        res.data !== "Gift voucher is not valid"
      ) {
        toast.success(res.data.message);
        this.setState({});
      } else {
        toast.error("Gift voucher is not valid");
      }
    });
  }

  getMobileDetails = (e) => {
    if (e.key === "Enter") {
      if (this.state.mobileNumber.trim().length === 10) {
        CreateDeliveryService.getMobileData(this.state.mobileNumber).then(
          (res) => {
            console.log(res);
            if (res.data.status === 200) {
              toast.success("Mobile Details Fetched Successfully");
              this.state.mobileData = res.data.result;
              this.setState({
                isUserTagged: true,
                customerId: res.data.result.customerId,
                name: res.data.result.name,
                mobileNumber: res.data.result.mobileNumber,
                gstNumber: res.data.result.gstNumber,
                address: res.data.result.address,
                email: res.data.result.email,
                dob: res.data.result.dob,
                gender: res.data.result.gender,
                altMobileNo: res.data.result.altMobileNo,
              });
            } else {
              this.setState({
                isUserTagged: false,
              });
              toast.error("Customer not found");
            }
          }
        );
      } else {
        toast.error("Enter a valid mobile number");
      }
    }
  };

  getGvNumberDetails = (e) => {
    if (e.key === "Enter") {
      CreateDeliveryService.getGvNumberData(this.state.gvNumber).then((res) => {
        console.log(res);
        if (res.data.status === 200) {
          toast.success("GvNumber Details Fetched Successfully");
          this.state.gvNumberData = res.data.result;
          this.setState({
            isUserTagged: true,
            gvNumber: res.data.result.gvNumber,

            gvId: res.data.result.gvId,
            userId: res.data.result.userId,
            description: res.data.result.description,
            isTagged: res.data.result.isTagged,
            expiryDate: res.data.result.expiryDate,
            totalAmount: res.data.result.totalAmount,
            leftOverAmount: res.data.result.leftOverAmount,
            createdDate: res.data.result.createdDate,
          });
        } else {
          this.setState({
            isUserTagged: false,
          });
          toast.error(res.data.body);
        }
      });
    }
  };
 activeGV = (item) =>{
  console.log("++++++++++item+++++++",item)
  this.setState({ isgvModel: true ,activeGVNumber : item.gvNumber},()=>(
  console.log("++++++++activeGVNumber+++++++++",this.state.activeGVNumber)));
}
hideGVModel = () => {
  this.setState({ isgvModel: false });
}
saveGVNumber() {
  console.log("++++++++activeGVNumber+++++++++",this.state.activeGVNumber)
  const obj = [this.state.activeGVNumber]; 
  CreateDeliveryService.saveGVNumber(obj, true).then(resposne => {
    if (resposne) {
      toast.success(resposne.data.message);
      this.searchGiftVoucher();
    }
  })
  this.hideGVModel();
}
  getGiftVocherTable() {
    if (this.state.giftVochersList && this.state.giftVochersList.length > 0) {
      return this.state.giftVochersList.map((items, index) => {
        const { gvNumber, fromDate, toDate, value, isActivated } = items;
        return (
          <tr key={index}>
            <td className="col-1 geeks">{index + 1}</td>
            <td className="col-2">{gvNumber}</td>
            <td className="col-2">{fromDate}</td>
            <td className="col-2">{toDate}</td>
            <td className="col-2">₹ {value}</td>
          </tr>
        );
      });
    }
  }

  addGiftVoucher() {
    const formValid = this.handleValidation();
    if (formValid) {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const obj = {
        gvNumber: this.state.gvNumber,
        description: this.state.description,
        fromDate: this.state.selectedFromDate,
        toDate: this.state.selectedToDate,
        clientId: user["custom:clientId1"],
        value: this.state.amount,
        isApplied : false,
      };
      CreateDeliveryService.saveGiftVoucher(obj).then((res) => {
        if (res && res.data.isSuccess === "true") {
          this.setState({
            gvNumber: "",
            description: "",
            fromDate: "",
            toDate: "",
            amount: "",
          });
          this.getGiftVochersList();
          toast.success(res.data.message);
        }
      });
    } else {
      toast.error("Please enter mandatory fields");
    }
  }

  searchGiftVoucher() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    // let params =
    //   "?fromDate=" +
    //   this.state.fromDate +
    //   "&toDate=" +
    //   this.state.toDate +
    //   "&gvNumber=GV" +
    //   this.state.gvNumber;
    const obj = {
      fromDate: this.state.startDate ? this.state.startDate : undefined,
      toDate: this.state.endDate ? this.state.endDate : undefined,
      gvNumber: this.state.gvNumber1 ? this.state.gvNumber1 : undefined,
      clientId:parseInt(user["custom:clientId1"])
    };
    console.log(">>>>>paramsss", obj);
    CreateDeliveryService.searchGiftVoucher(obj).then((res) => {
      console.log(res.data.result);
      this.setState({
        gvSearchList: res.data.result,
      });
    });
  }

  clearSearch() {
    this.setState({
      gvSearchList: [],
      startDate: "",
      endDate: "",
      gvNumber1: "",
    });
  }

  renderTableData() {
    return this.state.gvSearchList.map((items, index) => {
      const { gvNumber, fromDate, toDate, value } = items;
      return (
        <tr key={index}>
          <td className="col-1 geeks">{index + 1}</td>
          <td className="col-2">{gvNumber}</td>
          <td className="col-2">{fromDate}</td>
          <td className="col-2">{toDate}</td>
          <td className="col-2">₹ {value}</td>
          <td className="col-2">
          {items.isApplied ? <button className={ items.isActivated === false && items.isApplied === false ? "fs-12 m-l-3 btn-sm-green" : "fs-12 m-l-3 btn-sm-disable"} disabled={items.isActivated} >
           { items.isActivated === false && items.isApplied === false ? <span>Assign</span> :   <span>Assigned</span>}

            </button> : 
            <button className={ items.isActivated === false && items.isApplied === false ? "fs-12 m-l-3 btn-sm-green" : "fs-12 m-l-3 btn-sm-disable"} disabled={items.isActivated}  onClick={(e) =>this.activeGV(items)}>
            { items.isActivated === false && items.isApplied === false ? <span>Assign</span> :   <span>Assigned</span>}
 
             </button>
            }
            </td> 
        </tr>
      );
    });
  }
  

  render() {
    return (
      
      <div className="maincontent">
        <Modal
          isOpen={this.state.isgvModel}
          size="sm"
          onRequestHide={this.hideGVModel}
        >
          <ModalHeader>Assign GV Number<button type='button' onClick={() =>this.hideGVModel()} className='btn search modal-close text-right'> <img className="pt-2" src={close}></img></button></ModalHeader>
          <ModalBody className="p-3">
            <div className="row mt-2 mb-3">
              <div className="form-group">
                <label> GV Number: </label>
                <input
                  type="Numeric"
                  name="cash"
                  className="form-control"
                  value={this.state.activeGVNumber}
                  // onChange={(e) =>
                  //   this.setState({ gvNumber: e.target.value })
                  // }
                  maxLength ="8"

                  autoComplete="off"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="pt-2 btn-bdr" onClick={this.hideGVModel}>
              CANCEL
            </button>
            <button
              className="btn btn-bdr active fs-12"
              onClick={this.saveGVNumber}
            >
              SAVE
            </button>
          </ModalFooter>
        </Modal>


        <div className="customer-gift">
          <div className="row">
            <div className="col-12 col-sm-3">
              <h5 className="mt-2 fs-18">Generate Gift Voucher </h5>
              <div className="form-group mt-2 mb-2">
                <label>
                  GV Number{" "}
                  <span className="text-red font-bold" name="bold">
                    *
                  </span>
                </label>
                <input
                  type="search"
                  className="form-control"
                  maxLength={errorLengthMax.gvNumber}
                  placeholder="Enter GV Number"
                  value={this.state.gvNumber}
                  onChange={this.handleGVNumber}                  
                />
                <div>
                  <span className="fs-12" style={{ color: "red" }}>
                    {this.state.errors["gvNumber"]}
                  </span>
                </div>
              </div>
              <div className="form-group mb-2">
                <label>Description</label>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Enter Description"
                  value={this.state.description}
                  onChange={(e) =>
                    this.setState({ description: e.target.value })
                  }
                />
              </div>
              <div className="form-group mb-2">
                <label>
                  From Date{" "}
                  <span className="text-red font-bold" name="bold">
                    *
                  </span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Enter FromDate"
                  value={this.state.fromDate}
                  onChange={(e) =>
                    this.setState({ fromDate: e.target.value }, () => {
                      this.state.errors["fromDate"] = '';
                      var localTime = moment().format("YYYY-MM-DD"); // store localTime
                      var proposedDate = this.state.fromDate + "T00:00:00.000Z";

                      this.setState({ selectedFromDate: proposedDate });
                    })
                  }
                  autoComplete="off"
                />
                <div>
                  <span className="fs-12" style={{ color: "red" }}>
                    {this.state.errors["fromDate"]}
                  </span>
                </div>
              </div>
              <div className="form-group mb-2">
                <label>
                  To Date{" "}
                  <span className="text-red font-bold" name="bold">
                    *
                  </span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Enter ToDate"
                  value={this.state.toDate}
                  onChange={(e) =>
                    this.setState({ toDate: e.target.value }, () => {
                      this.state.errors["toDate"] = '';
                      var localToTime = moment().format("YYYY-MM-DD"); // store localTime
                      var proposedToDate = this.state.toDate + "T00:00:00.000Z";

                      this.setState({ selectedToDate: proposedToDate });
                    })
                  }
                  autoComplete="off"
                />
                <div>
                  <span className="fs-12" style={{ color: "red" }}>
                    {this.state.errors["toDate"]}
                  </span>
                </div>
              </div>
              <div className="form-group mb-2">
                <label>
                  Amount{" "}
                  <span className="text-red font-bold" name="bold">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Value"
                  value={this.state.amount}
                  onChange={this.handleAmount}                  
                />
                <div>
                  <span className="fs-12" style={{ color: "red" }}>
                    {this.state.errors["amount"]}
                  </span>
                </div>
              </div>
              {/* <div className="form-group mb-3">
                      <input type="text" className="form-control"
                        placeholder="END DATE" />
                    </div>
                    <div className="form-group mb-3">
                      <input type="text" className="form-control"
                        placeholder="GV AMOUNT" />
                    </div> */}
              <button
                className={this.state.addAddGiftVoucher?.isEnabeld ? "btn-unic-search active mt-1 m-r-2" : "btn-unic-search btn-disable mt-1 m-r-2"}
                onClick={this.addGiftVoucher}
                disabled={!this.state.addAddGiftVoucher?.isEnabeld}
              >
                Add Gift Voucher
              </button>
            </div>
            <div className="col-12 col-sm-9">
            <div className="row">
            <h5 className="mt-2 mb-0 fs-18">Filters</h5>
          <div className="col-6 col-sm-3 mt-2 mb-2">
            <div className="form-group">
              <label>From Date</label>

              <input
                type="date"
                id="start"
                className="form-control"
                name="trip-start"
                value={this.state.startDate}
                onChange={(e) =>
                  this.setState({
                    startDate: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="col-6 col-sm-3 mt-2 mb-2">
            <div className="form-group">
              <label>To Date</label>
              <input
                type="date"
                name="trip-start"
                className="form-control"
                value={this.state.endDate}
                onChange={(e) => this.setState({ endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="col-6 col-sm-3 mt-2 mb-2">
            <div className="form-group">
              <label>GV Number</label>
              <input
                type="text"
                className="form-control"
                // min={0}
                placeholder="GV Number"
                value={this.state.gvNumber1}
                onChange={(e) => this.setState({ gvNumber1: e.target.value })}
              />
            </div>
          </div>

          <div className="col-6 col-sm-3 pt-4 scaling-mb mt-2">
            <div className="form-group">
              <button
                className="btn-unic-search active m-r-2"
                onClick={this.searchGiftVoucher}
              >
                Search
              </button>
              <button
                className="btn-clear m-r-2"
                onClick={() => {
                  this.clearSearch();
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
              <h5 className="mt-2 mb-1 fs-18">Gift Vouchers</h5>

              <div className="table-responsive scaling-mb">
                <table className="table table-borderless mb-1 mt-2">
                  <thead>
                    <tr className="m-0 p-0">
                      <th className="col-1">S.NO</th>

                      <th className="col-2">GV NUMBER</th>
                      <th className="col-2">FROM DATE</th>

                      <th className="col-2">TO DATE</th>
                      <th className="col-2">VALUE</th>
                      <th className="col-2"></th>

                    </tr>
                  </thead>
                  {/* <tbody>{this.getGiftVocherTable()}</tbody> */}
                  <tbody>{this.renderTableData()}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
