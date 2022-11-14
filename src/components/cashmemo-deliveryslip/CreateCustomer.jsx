import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { addCustomer_Err_Msg, errorLengthMax, errorLengthMin } from "../../commonUtils/Errors";
import CreateDeliveryService from '../../services/CreateDeliveryService';
export default class CreateCustomer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      phoneNumber: "",
      birthDate: "",
      gender: "",
      name: "",
      username: "",
      tempPassword: "Otsi@123",
      parentId: "1",
      domianId: "802",
      address: "",
      role: {
        roleName: ""
      },
      stores: [],
      clientId: "",
      isConfigUser: "",
      clientDomain: [],
      gstNumber: "",
      gstmobile: "",
      gstemail: "",
      gstaddress: "",
      isCustomer: true,
      isConfigUser: "false",
      errors: {},

    };

    this.addCustomer = this.addCustomer.bind(this);
    this.validation=this.validation.bind(this);
  }

  handleValidation() {
    let errors = {};
    let formIsValid = true;

    //Name
    if (this.state.name.length < errorLengthMin.name) {
      formIsValid = false;
      errors["name"] = addCustomer_Err_Msg.name;
    }
    
     // Mobile
     
  const patternRegExp = (/^[0-9\b]+$/);
  let input = this.state.phoneNumber;
  if (input.length !== errorLengthMin.phoneNumber || patternRegExp.test(this.state.phoneNumber) === false) {
  formIsValid = false;
  errors["phoneNumber"] = addCustomer_Err_Msg.phoneNumber;
 }


 
    //email 
    // if (!this.state.email) {
    //     formIsValid = false;
    //     errors["email"] = " Please Enter Email";
    // }
    if(this.state.email.length>0){
      const emailReg = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    if (emailReg.test(this.state.email) === false) {
      formIsValid = false;
      errors["email"] = addCustomer_Err_Msg.email;
    }
  }
  //Gst number
  if(this.state.gstNumber.length>0){
    let input = this.state.gstNumber;
  const gstValid = input.length===15;
  if (!gstValid) {
    formIsValid = false;
    errors["gstNumber"] = addCustomer_Err_Msg.gstNumber;
  }
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
validation(e) {
  console.log(e.target.value)
  const regex = /^[0-9\b]+$/;
  const value = e.target.value;
  if (value === "" || regex.test(value)) {
    this.state.errors["phoneNumber"] = '';
    this.setState({
      [e.target.id]: e.target.value,
      phoneNumber: e.target.value,
    });
  } else {
    this.setState({phoneNumber: ""});
    // toast.error("pls enter numbers")
  }
}


handleCustomer=(e) =>{
  this.state.errors["name"] = '';
  this.setState({ name: e.target.value, username: e.target.value })
};

  addCustomer() {
    const formValid = this.handleValidation();
         if (formValid) {
          if(this.state.name && this.state.phoneNumber){

    this.state.phoneNumber = "+91" + this.state.phoneNumber;
    CreateDeliveryService.addCustomer(this.state).then(res => {
      if (res) {
        toast.success("AddCustomer Created Successfully");
        toast.success(res.data.result.body);
        this.setState({
          email: "",
          phoneNumber: "",
          birthDate: "",
          gender: "",
          name: "",
          username: "",
          tempPassword: "Otsi@123",
          parentId: "1",
          domianId: "802",
          address: "",
          role: {
            roleName: ""
          },
          stores: [],
          clientId: "",
          isConfigUser: "",
          clientDomain: [],
          gstNumber: "",
          gstmobile: "",
          gstemail: "",
          gstaddress: "",
          isCustomer: true,
          isConfigUser: "false"
        })
      }
    });
  }
  } else {
    toast.error("Please enter all mandatory fields");
  }

  }
  render() {
    return (
      <div className="maincontent">
        <div className="customer-bg">
          <h5 className="mt-2">Personal Information </h5>
          <div className="row">
            <div className="col-sm-9 col-12">
              <div className="row mt-2">
                <div className="col-sm-4 col-12 scaling-mb">
                  <div className="form-group">
                  <label>Customer Name  <span className="text-red font-bold" name="bold">*</span></label>
                    <input type="text" className="form-control"
                      placeholder="Customer Name " autoFocus
                      value={this.state.name}
                      maxLength={errorLengthMax.name}
                      onChange={this.handleCustomer}
                      autoComplete="off" />
                    <div>
                      <span className="fs-12" style={{ color: "red" }}>{this.state.errors["name"]}</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-4 col-12 scaling-mb">
                  <div className="form-group">
                  <label>Mobile Number  <span className="text-red font-bold" name="bold">*</span></label>
                    <input type="text" className="form-control"
                      placeholder="Mobile Number " autoFocus
                      value={this.state.phoneNumber} maxLength={errorLengthMax.phoneNumber}
                      onChange={this.validation}
                      // onChange={(e) => this.setState({ phoneNumber: e.target.value })}
                      autoComplete="off" />
                    <div>
                      <span className="fs-12" style={{ color: "red" }}>{this.state.errors["phoneNumber"]}</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-4 col-12 scaling-mb">
                {/* <label>Email <span className="text-red font-bold" name="bold">*</span></label> */}
                <label>Email</label>
                  <div className="form-group">
                    <input type="email" className="form-control"
                      placeholder="Email *" autoFocus
                      value={this.state.email}
                      onChange={(e) => this.setState({ email: e.target.value })}
                      autoComplete="off" />
                    <div>
                      <span className="fs-12" style={{ color: "red" }}>{this.state.errors["email"]}</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-4 col-12 mt-4">
                <label>Gender</label>
                  <select className="form-control" value={this.state.gender}
                    onChange={(e) => this.setState({ gender: e.target.value })} >
                    <option>Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div className="col-sm-4 col-12 mt-4">
                <label>Address</label>
                  <div className="form-group">
                    <input type="text" className="form-control"
                      placeholder="Address" value={this.state.address}
                      onChange={(e) => this.setState({ address: e.target.value })} autoComplete="off" />
                  </div>
                </div>
                <div className="col-sm-4 col-12 mt-4">
                 <label>GST NUMBER</label>
                  <div className="form-group">
                    <input type="text" className="form-control"
                    minLength={15} maxLength={15}
                      placeholder="GST Number" value={this.state.gstNumber}
                      onChange={(e) => this.setState({ gstNumber: e.target.value })} autoComplete="off"
                    />
                     <div>
                      <span className="fs-12" style={{ color: "red" }}>{this.state.errors["gstNumber"]}</span>
                    </div>
                    </div>
                  </div>
              </div>
              
              {/* <h5 className="mt-4 mb-2">Business Information(Optional) </h5> */}
              <div className="row mt-3">
                {/* <div className="col-sm-4 col-12 scaling-mb">
                  <div className="form-group">
                    <input type="text" className="form-control"
                      placeholder="GST NUMBER" value={this.state.gstNumber}
                      onChange={(e) => this.setState({ gstNumber: e.target.value })} autoComplete="off"
                    />
                  </div>
                </div>
                <div className="col-sm-4 col-12 scaling-mb">
                  <div className="form-group">
                    <input type="text" className="form-control"
                      placeholder="COMPANY NAME" value={this.state.companyName}
                      onChange={(e) => this.setState({ companyName: e.target.value })} autoComplete="off"
                    />
                  </div>
                </div>
                <div className="col-sm-4 col-12 scaling-mb">
                  <div className="form-group">
                    <input type="email" className="form-control"
                      placeholder="EMAIL"
                      value={this.state.gstemail}
                      onChange={(e) => this.setState({ gstemail: e.target.value })} autoComplete="off"
                    />
                  </div>
                </div>
                <div className="col-sm-4 col-12 mt-4">
                  <div className="form-group">
                    <input type="text" className="form-control"
                      placeholder="PHONE NUMBER"
                      value={this.state.gstmobile}
                      onChange={(e) => this.setState({ gstmobile: e.target.value })} autoComplete="off"
                    />
                  </div>
                </div>
                <div className="col-sm-4 col-12 mt-4">
                  <div className="form-group">
                    <input type="text" className="form-control"
                      placeholder="ADDRESS *"
                      value={this.state.gstaddress}
                      onChange={(e) => this.setState({ gstaddress: e.target.value })} autoComplete="off"
                    />
                  </div>
                </div> */}
                <div className="col-12 mt-4">
                  <button className="btn-unic-search active m-r-2" onClick={this.addCustomer}>Add Customer</button>
                </div>
              </div>
            </div>
            <div className="col-3">

            </div>
          </div>
        </div>
      </div>
    )
  }
}
