import React, { Component } from 'react';
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import close from '../../assets/images/cross.svg';
import edit from '../../assets/images/edit.svg';
import { account_err_msg, errorLengthMax, errorLengthMin } from "../../commonUtils/Errors";
import { formatDate } from "../../commonUtils/FormatDate";
import PrivilegesList from '../../commonUtils/PrivilegesList';
import URMService from '../../services/URM/URMService';
import confirm from '../../assets/images/conformation.svg';


export default class Stores extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showStore: false,
            stateName: "",
            district: "",
            city: "",
            area: "",
            mobileNumber: "",
            address: "",
            storeManager: "",
            phoneNumber: "",
            storeName: "",
            domain: "",
            isAddStatus:false,
            storesList: [],
            isStore: false,
            domainList: [],
            stateList: [],
            districtList: [],
            stateId: null,
            userName: "",
            addStorePrevilige:'',
            addEditPrevilige:'',
            isEdit: false,
            selectedStore: {},
            errors: {
                "city": ""
            },
            fields: {},
            focus: false,
            isSearch: false,
            gstNumber: "",
            isGstNumber: false,
            isState:false,
            isDistrict:false,
            loggedUser:"",
            searchDistrict:0,
            storesStatus: [
                { value: true, label: 'Active' },
                { value:  false, label: 'Inactive' },
            ],
            storeStatus: true,
            isConfigUser:''
        }

        this.showStores = this.showStores.bind(this);
        this.hideStores = this.hideStores.bind(this);
        this.saveStores = this.saveStores.bind(this);
        this.getDistricts = this.getDistricts.bind(this);
        this.getStates = this.getStates.bind(this);
        this.validation = this.validation.bind(this);
        this.searchStore = this.searchStore.bind(this);
        this.getAllStores = this.getAllStores.bind(this);
        this.deleteStore = this.deleteStore.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
    }

    showStores() {
        this.setState({
            showModal: true,
            district: "",
            city: "",
            area: "",
            mobileNumber: "",
            address: "",
            storeManager: "",
            phoneNumber: "",
            storeName: "",
            domain: this.state.domainList[0]?.id,
            errors: {},
            isEdit: false,
            isSearch: false,
            isGstNumber: false,
            isState:false,
            isDistrict:false,
            gstNumber:"",
          

        });
        // this.getDomainsList();
    }

    hideStores() {
        // this.getDomainsList();
        this.setState({ showModal: false });
        this.setState({
            stateName:"",
            isAddStatus:false
        });
    }

    getDomainsList() {
        URMService.getDomainsList(this.state.clientId).then((res) => {
            if (res) {
                this.setState({ domainList: res.data.result, domain: res.data.result[0].id });
            }

        });
    }

    componentWillMount() {
        const user1 = JSON.parse(sessionStorage.getItem('user'));
        if(user1['custom:isConfigUser'] === "false"){
        const childPrivileges = PrivilegesList('Stores');
        childPrivileges.then((res) => {
          if(res) {
            const result = res.sort((a , b) => a.id - b.id);
            this.setState({
                addStorePrevilige: result[0],  
                addEditPrevilige: result[1],  

            });
          }
        });   
    }  const user = JSON.parse(sessionStorage.getItem('user'));
        this.setState({loggedUser: user["custom:userId"]});
        if (user) {
            this.setState({ clientId: user["custom:clientId1"],isConfigUser: user['custom:isConfigUser'], userName: user["cognito:username"] }, () => { this.getAllStores(); })
            this.getStates();
        }

    }

    validation(e) {

        const regex = /^[0-9\b]+$/;
        const value = e.target.value;
        if (value === '' || regex.test(value)) {
            this.setState({
                [e.target.id]: e.target.value, phoneNumber: e.target.value,

            });
        } else {
            // toast.error("pls enter numbers")
        }


    }

    handleStoreStatus = (e) => {
     this.setState({
         storeStatus: e.target.value
     })
    }
    clear(){
        this.setState({
            state:"",
            district:"",
            storeName:""
          
        }, () => {
            this.getAllStores();
          }); 
       
    
        
      }
    getStates() {
        URMService.getStates().then(res => {
            if (res && res.data.result.length > 0) {
                this.setState({ stateList: res.data.result, stateName: res.data.result[0].stateCode }, ()=>{
                  
                    const obj = {
                        stateCode: "Select",
                        stateName: "Select"

                    }
                    this.state.stateList.splice(0,0,obj);
                    this.setState({
                        stateName: this.state.isEdit ? this.state.stateName : this.state.stateList[0].stateCode
                    });

                });
            }


        });
    }

    getDistricts() {

        const stateCode = this.state.isSearch ? this.state.searchState : this.state.stateName;
        URMService.getDistricts(stateCode).then(res => {
            if (res) {
                this.setState({ districtList: res.data.result, 
                   }, () => {
                    const obj = {
                        districtId: "Select",
                        districtName: "Select"

                    }
                    this.state.districtList.splice(0,0,obj);

                    this.setState({searchDistrict: this.state.districtList[0].districtName,
                        district: this.state.isEdit ? this.state.district : this.state.districtList[0].districtId
                    });
                });
            }

        });


        this.state.stateList.forEach(ele => {
            if (ele.stateCode === this.state.stateName) {
                this.setState({ stateId: ele.stateId });
            }
        });

      // this.getGSTNumber();
    }

    getGSTNumber() {
    
        const stateCode = this.state.isSearch ? this.state.searchState : this.state.stateName;
        URMService.getGSTDetails(stateCode, this.state.clientId).then(res => {
            if (res) {
                this.setState({gstNumber: res.data.result.gstNumber},()=>{
                    if(this.state.gstNumber) {
                        this.setState({isGstNumber: true});
                    } else {
                        this.setState({isGstNumber: false});
                    }
                })
            }

        });

    }

    getAllStores() {
        if(this.state.isSearch){
            this.state.searchState = "";
            this.state.searchStoreId = "";
            this.state.searchDistrict = "";
            this.state.districtList = [];
        }
        URMService.getAllStores(this.state.clientId).then(res => {
            if (res) {
                this.setState({ storesList: res.data, isStore: true });
            }


        });
        // this.getDomainsList();
    }



    searchStore() {

        this.setState({isSearch: true});
        const searchStore = {
            "stateId": this.state.searchState,
            "cityId": null,
            "districtId": this.state.searchDistrict === "Select" || this.state.searchDistrict === "" ?  0 : parseInt(this.state.searchDistrict) ,
            "storeName": this.state.searchStoreId
        }

        URMService.getStoresBySearch(searchStore).then(res => {
            if (res) {
                this.setState({ storesList: res.data.result, isStore: true });
            } else {
                this.setState({ storesList: [], isStore: false }); 
            }

        });
    }

    
    saveStores() {

        const formValid = this.handleValidation();
        if (formValid) {
            let saveObj;
            if (this.state.isEdit) {
                saveObj = {
                    "id": this.state.selectedStore.id,
                    "name": this.state.storeName,
                    "stateId": parseInt(this.state.stateId),
                    "districtId": parseInt(this.state.district),
                    "cityId": this.state.city,
                    "area": this.state.area,
                    "address": this.state.address,
                    "phoneNumber": this.state.phoneNumber,
                    // "domainId": parseInt(this.state.domain),
                    "createdBy": parseInt(this.state.loggedUser),
                    "createdDate": "",
                    "stateCode": this.state.stateName,
                    "gstNumber": parseInt(this.state.gstNumber),
                    "clientId":parseInt(this.state.clientId),
                    "isActive": this.state.storeStatus

                }

                URMService.editStore(saveObj).then(res => {
                    if (res) {
                        toast.success("Store updated Successfully");
                        this.getAllStores();
                        this.hideStores();
                    }
                    if(this.state.isEdit){
                        this.setState({isAddStatus:false})
                    }else{
                        this.setState({isAddStatus:true})
                    }

                });
            } else {
                saveObj = {
                    "name": this.state.storeName,
                    "stateId": parseInt(this.state.stateId),
                    "districtId": parseInt(this.state.district),
                    "cityId": this.state.city,
                    "area": this.state.area,
                    "address": this.state.address,
                    "phoneNumber": this.state.phoneNumber,
                    // "domainId": parseInt(this.state.domain),
                    "createdBy":  parseInt(this.state.loggedUser),
                    "stateCode": this.state.stateName,
                    "gstNumber": this.state.gstNumber,
                    "clientId":parseInt(this.state.clientId),
                    "isActive": this.state.storeStatus
                }
                URMService.saveStore(saveObj).then(res => {
                    if (res) {
                        toast.success("Store Saved Successfully");
                        this.getAllStores();
                         this.hideStores();
                    }
                   

                });
            }
           
        } else {
            toast.info("Please Enter all mandatory fields");
        }





        // this.state.storesList.push(obj);
        // this.setState({ isStore: true });
        // sessionStorage.setItem("storeList", JSON.stringify(this.state.storesList));
        // toast.success("Stores Created Successfully");

    }

    editStore(items) {
        this.setState({
            showModal: true, stateName: items.stateCode, district: items.districtId.toString(), city: items.cityId,
            area: items.area, phoneNumber: items.phoneNumber,
            address: items.address,
            domain: items.domainId, storeName: items.name,
            gstNumber:items.gstNumber,
            isGstNumber:true,
            isState:true,
            isDistrict:true,
            isEdit: true,
            selectedStore: items,
            isSearch: false,
            storeStatus: items.isActive
        }, () => {
            this.getDistricts();
        });
    }
    deleteStore(items) {
    
        URMService.deleteStore(items.id).then(
          (res) => {
            if (res.data && res.data.isSuccess === "true") {
              toast.success(res.data.result);
              this.props.history.push("/stores");
            //   this.stateReset();
              this.getAllStores(0);
            } else {
              toast.error(res.data.message);
            }
          }
        );
      }
      stateReset(){
        this.setState({
            address: "",
        area: "",
        cityId: "",
        clientId: "",
        createdBy:"",
        createdDate: "",
        districtId: "",
        domainId: "",
        domainName: "",
        gstNumber: "",
        id: "",
        isActive:false,
        lastModifyedDate: null,
        name: "",
        phoneNumber: "",
        stateCode: "",
        stateId: "",
        storeOwner: "",
        userName: "",
          })


    }    

    getTableData() {
        return this.state.storesList.map((items, index) => {
            let date = formatDate(items.createdDate)
            // const { storeManager, createdDate,clientDomianlId["domaiName"], createdBy, cityId, name, domain } = items;
            return (

                <tr className="" key={index}>
                    <td className="col-1">{index + 1}</td>
                    <td className="col-2">{items.name}</td>
                    <td className="col-2">{items.cityId}</td>
                    {/* <td className="col-2">{items.domainName}</td> */}
                    <td className="col-2">{items.userName}</td>
                    <td className="col-2">{date}</td>
                    <td className="col-2">
                    {items.isActive ? 
                      <button className="btn-active">Active</button> : 
                      <button className="btn-inactive">Inactive</button>}
                    </td>
     {/* {this.state.addEditPrevilige?.isEnabeld ? <td className="col-1">
        <img src={edit} className="w-12 m-r-2 pb-2" 
                        onClick={(e) => this.editStore(items)} /> */}
                        
                        {/* <i className="icon-delete"onClick={(e) => this.deleteStore(items)}></i> */}
                    {/* </td> :<td className="col-1">
        <img src={edit} className="w-12 m-r-2 pb-2" />
                    </td> } */}
                     {this.state.isConfigUser === "false" &&  <td className="col-1">
                        {this.state.addEditPrevilige?.isEnabeld ? <img src={edit} className="w-12 m-r-2 pb-2"  onClick={(e) => this.editStore(items)}/> : <img src={edit} className="w-12 m-r-2 pb-2"  />}</td>  }
                    {this.state.isConfigUser === "true" && <td className="col-1"> <img src={edit} className="w-12 m-r-2 pb-2"  onClick={(e) => this.editStore(items)} /> </td>}
                </tr>

            );
        });
    }

    getStoreTable() {
        return this.state.isStore && (
            <div>
                <div className="col-12 mt-3 scaling-center scaling-mb">
                    <h5>Stores List</h5>
                </div>
                <div className="table-responsive p-0">
                    <table className="table table-borderless mb-0">
                        <thead>
                            <tr className="">
                                <th className="col-1">Store ID </th>
                                <th className="col-2">Store Name</th>
                                <th className="col-2">Location</th>
                                {/* <th className="col-2">Domain</th> */}
                                <th className="col-2 p-l-1">Created By</th>
                                <th className="col-2 p-l-0">Created Date</th>
                                <th className="col-2">Status</th>
                                {/* <th className='col-2'>Status</th> */}
                                <th className="col-1"></th>
                            </tr>
                        </thead>
                        <tbody>
                        
                            {this.state.storesList.length > 0 && this.getTableData()}
                    {this.state.storesList.length === 0  && <div className='no_records'><img src={confirm}></img> <label>No records found</label> </div>}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
    


    handleValidation() {
        let errors = {};
        let formIsValid = true;

        //Name
        // if (!this.state.city) {
        //     formIsValid = false;
        //     errors["city"] = "Enter City";
        // }



        // Area 
        // if (!this.state.area) {
        //     formIsValid = false;
        //     errors["area"] = "Enter area";
        // }



        // Mobile
        // if (!this.state.phoneNumber) {
        //     formIsValid = false;
        //     errors["phoneNumber"] = "Enter phoneNumber";
        // }

        // if (typeof this.state.phoneNumber !== "undefined") {
        //     if (!this.state.phoneNumber.match(/^[0-9\b]+$/)) {
        //         formIsValid = false;
        //         errors["phoneNumber"] = "Please Enter Valid Mobile Number";
        //     }
        // }

        //Domain 
        // if (!this.state.domain) {
        //     formIsValid = false;
        //     errors["domain"] = account_err_msg.domain;
        // }



        // Store Name

        if (this.state.storeName.length < errorLengthMin.storeName) {
            formIsValid = false;
            errors["storeName"] = account_err_msg.storeName;
        }
        // if (this.state.storeName) {
        //     let input = this.state.storeName;
        //     const storeValid = input.length < 6 ;
        //     const exstoreValid = input.length > 25 ;
        //     if (this.state.storeName && storeValid) {
        //       formIsValid = false;
        //       errors["storeName"] = "Please enter Atlest 6 Characters";
        //     }else if(this.state.storeName && exstoreValid){
        //         formIsValid = false;
        //         errors["storeName"] = "Please Enter Store Name Below 25 characters";
        //     }
        //   }



        // State Name

        if (!this.state.stateName) {
            formIsValid = false;
            errors["stateName"] = account_err_msg.stateName;
        }


        // District Name
        if ( this.state.district === 'Select' || !this.state.district) {
            formIsValid = false;
            errors["districtName"] = account_err_msg.districtName;
        }

        // gstNumber 
        // gstNumber 
        // if (!this.state.gstNumber) {
        //     formIsValid = false;
        //     errors["gstNumber"] =  account_err_msg.gstNumber;
        // }
        if (this.state.gstNumber.length !== errorLengthMin.gstNumber) {
            formIsValid = false;
            errors["gstNumber"] = account_err_msg.gstNumber;
    }




        this.setState({ errors: errors });
        return formIsValid;

    }

    capitalization= () => {
      const { storeName } = this.state;
      if(storeName) {
        const store_name =   storeName[0].toLocaleUpperCase() + storeName.substring(1);
        this.setState({
          storeName: store_name
        })
      }
     
    }



    render() {
        let city;
        let modulesList;
        if (this.state.domainList && this.state.domainList.length > 0) {
            const modules = this.state.domainList;

            modulesList = modules.length > 0
                && modules.map((item, i) => {
                    return (

                        <option key={i} value={item.id}>{item.domaiName}</option>
                    )
                }, this);
        }


        const states = this.state.stateList;

        let statesList = states.length > 0
            && states.map((item, i) => {
                return (
                   
                    <option key={i} value={item.stateCode}>{item.stateName}</option>
                )
            }, this);

        const districts = this.state.districtList;

        let districtList = districts.length > 0
            && districts.map((district, i) => {
                return (
                    <option key={i} value={district.districtId}>{district.districtName}</option>
                )
            }, this);



        return (
            <div className="maincontent">


                <Modal isOpen={this.state.showModal} size="lg">
                        {
                            !this.state.isEdit && <ModalHeader>
                                    Add Store <button type='button' onClick={() =>this.hideStores()} className='btn search modal-close text-right'> <img src={close}></img></button>
                                </ModalHeader>
                        }
                         {
                            this.state.isEdit && <ModalHeader>
                                     Edit Store <button type='button' onClick={() =>this.hideStores()} className='btn search modal-close text-right'> <img src={close}></img></button>
                                </ModalHeader>
                        }
                    <ModalBody>
                        <div className="p-3">
                            <div className="row">
                                <div className="col-12">
                                    <h6 className="text-red mb-2 fs-14 scaling-center scaling-mb">Store Details</h6>
                                </div>
                                <div className="col-sm-4 col-12">
                                    <div className="form-group">
                                        <label>State<span className="text-red font-bold">*</span></label>
                                      
                                        {/* <select className="form-control" value={this.state.stateName}
                                            onChange={(e) => this.setState({ stateName: e.target.value })}
                                        >
                                            <option> Select </option>
                                            <option>Andhra Pradesh</option>
                                            <option>Telangana</option>
                                            <option>Mumbai</option>
                                        // </select> */}
                                        {/* <span style={{ color: "red" }}>{this.state.errors["stateName"]}</span> */}

                                        <select className="form-control" value={this.state.stateName}
                                        disabled={this.state.isState}
                                        
                                            onChange={(e) => this.setState({ stateName: e.target.value, isGstNumber:false,isState:false,
                                                isDistrict:false, gstNumber:"" }, () => {
                                                this.getDistricts();
                                                this.getGSTNumber();
                                            })}>
                                                 {/* <span style={{ color: "red" }}>{this.state.errors["stateName"]}</span> */}

                                            {statesList}
                                        </select >
                                        <div>
                                            <span style={{ color: "red" }}>{this.state.errors["stateName"]}</span>
                                        </div>

                                    </div>
                                    
                                </div>
                                <div className="col-sm-4 col-12">
                                    <div className="form-group">
                                        
                                        <label>District<span className="text-red font-bold">*</span></label>
                                      
                                        {/* <select className="form-control" value={this.state.district}
                                            onChange={(e) => this.setState({ district: e.target.value })}>
                                            <option> Select </option>
                                            <option>Guntur</option>
                                            <option>Krishna</option>
                                            <option>Kurnool</option>
                                        </select> */}

                                        <select className="form-control" value={this.state.district}
                                          disabled={this.state.isDistrict}
                                            onChange={(e) => this.setState({ district: e.target.value })}>
                                            
                                            {districtList}
                                            
                                            
                                        </select >
                                    
                                       

                                    
                                    
                                    <div>
                                            <span style={{ color: "red" }}>{this.state.errors["districtName"]}</span>
                                        </div>
                                        </div>
                                </div>
                                <div className="col-sm-4 col-12">
                                    <div className="form-group">
                                        <label>City</label>
                                        {/* <select className="form-control" value={this.state.city}
                                            onChange={(e) => this.setState({ city: e.target.value })}>
                                            <option> Select </option>
                                            <option>Guntur</option>
                                            <option>Vijayawada</option>
                                            <option>Kurnool</option>
                                        </select> */}
                                        <input type="text" className="form-control"
                                            placeholder="City" value={this.state.city}
                                            onChange={(e) => this.setState({ city: e.target.value })}
                                        // onFocus={(e)=> {
                                        //     if (!this.state.focus) {
                                        //         this.setState({
                                        //             focus: true,
                                        //             city: "Enter City"
                                        //         });
                                        //     }

                                        // }}
                                        />
                                        
                                        <div>
                                            <span style={{ color: "red" }}>{city}</span>
                                        </div>



                                        {/* <input type="text" className="form-control"
                                            placeholder="City" value={this.state.city}
                                            onChange={(e) => this.setState({ city: e.target.value }, 
                                            this.state.fields["city"] = e.target.value ),  () => {this.handleValidation();}} />
                                            {
                                                this.state.errors["city"] && (
                                                    <div>
                                                         <span style={{ color: "red" }}>{this.state.errors["city"]}</span>
                                                        </div>
                                                )
                                            } */}


                                    </div>
                                </div>
                                <div className="col-sm-4 col-12 mt-3">
                                    <div className="form-group">
                                        <label>Area</label>

                                        <input type="text" className="form-control"
                                            placeholder="Area" value={this.state.area}
                                            onChange={(e) => this.setState({ area: e.target.value })} />
                                        <div>
                                            <span style={{ color: "red" }}>{this.state.errors["area"]}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4 col-12 mt-3">
                                    <div className="form-group">
                                        <label>Store Phone Number</label>
                                        <input type="text" className="form-control" minLength="10"
                                            maxLength={errorLengthMax.phoneNumber} placeholder="+91" value={this.state.phoneNumber}
                                            onChange={this.validation} />
                                        {/* <div>
                                            <span style={{ color: "red" }}>{this.state.errors["phoneNumber"]}</span>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="col-sm-4 col-12 mt-3">
                                    <div className="form-group">
                                        <label>Address</label>
                                        <input type="text" className="form-control" placeholder="" value={this.state.address}
                                            onChange={(e) => this.setState({ address: e.target.value })} />
                                    </div>
                                </div>
                                <div className="col-12 mt-4">
                                    <h6 className="text-red mb-1 fs-14 scaling-center scaling-mb">Store Info</h6>
                                </div>
                                {/* <div className="col-4">
                                    <div className="form-group">
                                        <label>Domain<span className="text-red font-bold">*</span></label>
                                        
                                        <select className="form-control" value={this.state.domain}
                                            onChange={(e) => this.setState({ domain: e.target.value })}>
                                                
                                                <div>
                                            <span style={{ color: "red" }}>{this.state.errors["domain"]}</span>
                                        </div>
                                            {modulesList}
                                        </select >
                                    </div>
                                </div> */}
                                <div className="col-sm-4 col-12">
                                    <div className="form-group">
                                        <label>Store Name<span className="text-red font-bold">*</span></label>
                                        <input type="text" className="form-control"
                                            value={this.state.storeName}
                                            maxLength ={errorLengthMax.storeName}
                                            onChange={(e) => this.setState({ storeName: e.target.value })} />                                            
                                        
                                    
                                    <div>
                                            <span style={{ color: "red" }}>{this.state.errors["storeName"]}</span>
                                        </div>
                                        </div>
                                </div>
                                <div className="col-sm-4 col-12">
                                    <div className="form-group">
                                        <label>GST Number<span className="text-red font-bold">*</span></label>
                                        <input type="text" className="form-control" placeholder="Gst Number" 
                                            value={this.state.gstNumber}
                                            disabled={this.state.isGstNumber}
                                            maxLength={errorLengthMax.gstNumber}
                                            onChange={(e) => this.setState({ gstNumber: e.target.value })} 
                                            erorText="Please enter only 15 digits number"/>
                                            
                                   
                                    <div>
                                            <span style={{ color: "red" }}>{this.state.errors["gstNumber"]}</span>
                                        </div>
                                        </div>
                                    
                                </div>
                                <div className="col-sm-4 col-12">
                                    <div className="form-group">
                                        <label>Status <span className="text-red font-bold">*</span></label>
                                            <select value={this.state.storeStatus} disabled ={!this.state.isEdit} onChange={(e) =>  this.handleStoreStatus(e)} className="form-control">
                                                
                                                <option>Select Status</option>
                                                { 
                                                this.state.storesStatus &&
                                                this.state.storesStatus.map((item, i) => 
                                                (<option key={i} value={item.value}>{item.label}</option>))
                                                }
                                            </select>
                                        <div>
                                          <span style={{ color: "red" }}>{this.state.errors["role"]}</span>
                                        </div>
                                    </div>
                                </div>
                                

                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn-unic m-r-2" onClick={this.hideStores}>Cancel</button>
                        <button className="btn-unic active" onClick={this.saveStores}>Save</button>
                        {/* <button className="btn btn-bdr active fs-12"  onClick={this.createStore}>SAVE</button> */}
                    </ModalFooter>
                </Modal>


                <div className="row">
                    <div className="col-sm-2 col-12 mt-2">
                        <div className="form-group">
                        <label>State</label>
                            <select className="form-control" value={this.state.searchState}
                                onChange={(e) => this.setState({ searchState: e.target.value, isSearch: true }, ()=>{
                                    this.getDistricts()
                                })}>

                                {statesList}
                            </select >
                        </div>
                    </div>
                    <div className="col-sm-2 col-12 mt-2">
                        <div className="form-group">
                        <label>District</label>
                            <select className="form-control" value={this.state.searchDistrict}
                                onChange={(e) => this.setState({ searchDistrict: e.target.value })}>

                                {districtList}
                            </select >

                        </div>
                    </div>
                    <div className="col-sm-2 col-12 mt-2">
                        <div className="form-group">
                        <label>Store Name</label>
                            <input type="text" className="form-control"
                                placeholder="Enter Name" value={this.state.searchStoreId}
                                onChange={(e) => this.setState({ searchStoreId: e.target.value })} />
                        </div>
                    </div>
                    <div className="col-sm-6 col-12 scaling-center scaling-mb mt-2  pt-4 p-l-0">
                        <button className="btn-unic-search active m-r-2" onClick={this.searchStore}>Search </button>

                        <button
                className="btn-clear m-l-2"
                onClick={() => {
                  this.clear();
                }}
              >
                Clear
              </button>
                      
               {this.state.isConfigUser === "true" ? <button className="btn-unic-search active"  onClick={this.showStores}><i className="icon-store"></i>  Add Store</button> :                    
                        <button disabled={!this.state.addStorePrevilige?.isEnabeld} className={this.state.addStorePrevilige?.isEnabeld ? "btn-unic-search active" : "btn-unic-search btn-disable" }  name="createuser" onClick={this.showStores}><i className="icon-create_customer"></i> Add Store</button>}
                    </div>
                    <div>
                        {this.getStoreTable()}
                    </div>


                </div>

            </div>
        )
    }
}
