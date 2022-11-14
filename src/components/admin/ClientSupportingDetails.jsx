import moment from 'moment';
import React, { Component } from 'react';
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import close from '../../assets/images/cross.svg';
import edit from '../../assets/images/edit.svg';
import { errorLengthMax, errorLengthMin, urmErrorMessages } from "../../commonUtils/Errors";
import { formatDate } from "../../commonUtils/FormatDate";
import ReactPageNation from "../../commonUtils/Pagination";
import PrivilegesList from '../../commonUtils/PrivilegesList';
import URMService from '../../services/URM/URMService';


export default class ClientSupportingDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showCreate: false,
            name: "",
            dob: "",
            gender: "",
            mobileNumber: "",
            address: "",
            email: "",
            storeName: [],
            role: "client_support",
            // role: "",
            isUser: false,
            usersList: [],
            storesList: [],
            rolesList: [],
            rolesData:[],
            domainsList: [],
            domain: "",
            isSuperAdmin: false,
            selectedPrivilages: null,
            isAddStore: false,
            selectedStoresList: [],
            clientId: "",
            loggedInUser: "",
            copyStoresList: [],
            isLoggedUser: false,
            isAdmin: false,
            userName:"NA",
            isEdit: false,
            userId: "",
            usersList1: [],
            errors: {},
            adminRole: "",
            userType:"",
            loggedUserId:null,
            pageNumber:0,
            totalPages:0,
            usersStatus: [
                            { value: true, label: 'Active' },
                            { value:  false, label: 'Inactive' },
                        ],
            userStatus: true,
            addUserPrevilige: '',
            editUserPrevilige: '',
            deleteUserPrevilige: '',
            viewUserPrevilige: '',
            isConfigUser: '',
            clientSupportData:[],
            storeNames:"",
            fromDate:"",
            toDate:"",
            storeList:[],
            store:"",
            value:"",
            supporterName:""
            
        }
        this.setState({usersList: []})
        this.showCreateUser = this.showCreateUser.bind(this);
        this.hideCreateUser = this.hideCreateUser.bind(this);
        this.createUser = this.createUser.bind(this);
        this.hideUser = this.hideUser.bind(this);
        this.addCreateUser = this.addCreateUser.bind(this);
        this.validation = this.validation.bind(this);
        this.emailValidation = this.emailValidation.bind(this);
        this.getAllStoreList=this.getAllStoreList.bind(this);
        this.handleStoreChange=this.handleStoreChange.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.searchSupporters=this.searchSupporters.bind(this);
       }
    
    handleStoreChange=(e)=>{
        this.setState({supporterName:e.target.value})
        }

    validation(e){

        // this.setState({
        //                 [e.target.id]: e.target.value, mobileNumber:  e.target.value
        //                 });
      
        const regex = /^[0-9\b]+$/;
        const value = e.target.value;
        if (value === '' || regex.test(value)) {
            this.setState({
                [e.target.id]: e.target.value, mobileNumber:  e.target.value
                });
                this.state.errors["mobileNumber"] = '';

        } else {
            // toast.error("pls enter numbers")
        }
       
          
       }

       emailValidation(e){
        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{4,})$/i;
        const value = e.target.value;
        if(!value || regex.test(value) === false) {
            this.setState({
                [e.target.id]: e.target.value, email:  e.target.value
                });
                this.state.errors["email"] = '';

        } else {
            // toast.error("pls enter numbers")
        }
       
          
       }

   

    showCreateUser() {
        this.setState({ showModal: true,isSearch: false, isSuperAdmin: true });
       
        this.setState({
            name: "",
            dob: "",
            gender: "",
            mobileNumber: "",
            address: "",
            email: "",
            isEdit: false,
            errors: {}, 
            isAdmin: true

        });
        // this.getDomainsList();
    }

   
    setRoles = (e) => {
        console.log(e.target.value)
        this.setState({ role: e.target.value  === "Select" ? null : e.target.value });
    }
   
   

    hideCreateUser() {
        this.setState({ showModal: false });
    }

    createUser() {
        this.setState({ showCreate: true });
    }

    hideUser() {
        this.setState({ showCreate: false });
    }
    
    componentDidMount() {
        const user1 = JSON.parse(sessionStorage.getItem('user'));
        // sessionStorage.setItem("user",JSON.stringify(user));
        //  sessionStorage.setItem("clientId",this.state.role);
       
         this.setState({roleName : user1["custom:roleName"], clientId:user1["custom:clientId1"]});
      
      
       if(user1['custom:isConfigUser'] === "false"){
        const childPrivileges =  PrivilegesList('Users');
        childPrivileges.then((res) => {
          if(res) {
            const result = res.sort((a , b) => a.id - b.id);
            console.log('+++++++result++++++++', result);
            this.setState({
                addUserPrevilige: result[0],
                editUserPrevilige: result[1],
                deleteUserPrevilige: result[2],
                viewUserPrevilige: result[3] ,    
            });
          }
        });
    }
        const user = JSON.parse(sessionStorage.getItem('user'));
        this.setState({userName : user["cognito:username"], isEdit: false,loggedUserId: user["custom:userId"] });
        if(user) {
            this.setState({ clientId: user["custom:clientId1"],
            isConfigUser: user['custom:isConfigUser'],
            domainId: user["custom:domianId1"] }, () => {
                this.getClientSupporters();
                // this.getAllStoreList();
            });
            
        }
        

       
    }

 
       
    handleValidation() {
        let errors = {};
        let formIsValid = true;

       
     
  
    if (this.state.name.length < errorLengthMin.name) {
        formIsValid = false;
        errors["name"] = urmErrorMessages.name;
}

// DOB
if(!this.state.dob){
formIsValid = false;
errors["dob"] = urmErrorMessages.dob;
}
// Mobile number
if(!this.state.mobileNumber){
formIsValid = false;
errors["mobileNumber"] = urmErrorMessages.mobileNumber;
}

if (!this.state.email) {
errors["email"] = urmErrorMessages.email;
} else if (!/\S+@\S+\.\S+/.test(this.state.email)) {
errors["email"] = urmErrorMessages.email;
}
this.setState({ errors: errors });
return formIsValid;
}

  
   
    addCreateUser() {
        // if(this.state.email && this.state.mobileNumber && this.state.name){
        const formValid = this.handleValidation();
         if (formValid) {
        // const user = sessionStorage.getItem('domainName');
        const clientDomain = this.state.clientId;
        let saveObj; 
        if(this.state.isEdit) {
            saveObj = {
                "id": this.state.userId,
                "email":this.state.email,	
                "phoneNumber":"+91".concat(this.state.mobileNumber),
                "birthDate": this.state.dob,
                "gender":this.state.gender,
                "name":this.state.name,
                "username":this.state.name,
                "address": this.state.address,
                "role":{
                    // "roleName":this.state.roleName,
                    "roleName": "client_support",
                },
                "roleName": "client_support",
                // "stores": this.state.storeName,
                // "clientDomain":this.state.clientId, 
                "isConfigUser": false,
                "clientDomain": [clientDomain],
                // "isSuperAdmin": JSON.stringify(this.state.isAdmin),
                "createdBy" : this.state.loggedUserId,
                 "isActive": this.state.userStatus
            }
            URMService.editUser(saveObj).then((response) => {
                if(response) {
                    // toast.success(response.data.result);
                    toast.success("Updated Successfully")

                                    //   this.getDomainsList();
                     this.hideCreateUser();

                }
            });
            
        } else {
            saveObj = {
                "email":this.state.email,	
                "phoneNumber": "+91".concat(this.state.mobileNumber),
                "birthDate": this.state.dob,
                "gender":this.state.gender,
                "name":this.state.name,
                "username":this.state.name,             
                "address": this.state.address,
                "role":{
                    "roleName":"client_support",
                },
                "roleName": "client_support",
                "stores": this.state.storeName,
                "isSuperAdmin": false,
                "isConfigUser": false,
                "clientId": 0,
                "clientDomain": [clientDomain],
                "createdBy" : this.state.loggedUserId,
                "isActive": this.state.userStatus
    
                }

                URMService.saveUser(saveObj).then((response) => {
                    if(response) {
                        toast.success("Client Support Created Successfully")
                        // this.getDomainsList();
                        this.hideCreateUser();
                        
                    }
                });
            }
    
        }
     } 
      

    toggle = () => {
        this.setState({
            showModal: false,
          
        });
      }



      handleClientName=(e) =>{
        this.state.errors["name"] = '';
        this.setState({ name: e.target.value })
         };

         handleDob=(e) =>{
            this.state.errors["dob"] = '';
            this.setState({ dob: e.target.value })
             };

      clear= ()=> {
        this.setState({ 
        clientSupportData:[],
          supporterName: "",
          fromDate: "",
          toDate: "" ,
      }, () => this.getClientSupporters());
        
      }
    getAllStoreList(){
        this.setState({storeList:[]})
        URMService.getAllStoreList().then((res)=>{
         if(res.data){
            res.data.forEach((ele,index)=>{
                let obj={
                    id:ele.id,
                    value:ele.name,
                    lable:ele.name
                }
                this.state.storeList.push(obj);
            });
            this.setState({storeList:this.state.storeList})
         }else{
            this.setState({storeList:[]})
         }
    });
    }
    handleStatus = (e) => {
        this.setState({
            userStatus: e.target.value
        })
       }
    editUser(items) { 
            this.setState({
                showModal: true,
                isEdit: true,
                userId: items.id,
                email: items.email,	
                mobileNumber: items.phoneNumber.substring(3,13),
                dob: items.dob,
                gender: items.gender,
                name: items.userName,
                address: items.address ,
                role: items.role,
                userStatus : items.isActive
                // storeName: items.storeName,
                // userStatus: items.userStatus

            })
    }
  
    searchSupporters(pageNumber){
            const obj={
                supporterName:this.state.supporterName?this.state.supporterName:null,
                fromDate:this.state.fromDate?this.state.fromDate:null,
                toDate:this.state.toDate?this.state.toDate:null,
               }

            //    if((obj.supporterName !== null && obj.supporterName.length >= 3)||obj.fromDate==null||obj.toDate==null){
                if((obj.supporterName !== null && obj.supporterName.length >= 3)||obj.fromDate==""||obj.toDate==""){
               URMService.searchSupporters(this.state.role,pageNumber,obj).then((res)=>{
                console.log(res.data.result);
               
                if(res.data.result){
                   
                    this.state.clientSupportData=res.data.result;
                    this.setState({
                        clientSupportData:this.state.clientSupportData,
                        totalPages:res?.data?.result?.totalPages
                    });
                  }    
                });
            }else if(obj.fromDate!==null && obj.toDate!==""){
                URMService.searchSupporters(this.state.role,pageNumber,obj).then((res)=>{
                    console.log(res.data.result);
                   
                    if(res.data.result){
                       
                        this.state.clientSupportData=res.data.result;
                        this.setState({
                            clientSupportData:this.state.clientSupportData,
                            totalPages:res?.data?.result?.totalPages
                        });
                      }    
                    });
            }
            else {
                toast.error("Please Enter Atleast 3 Letters");
               
               }  
            } 

    getClientSupporters(pageNumber){
        const obj={
            supporterName:this.state.supporterName?this.state.supporterName:null,
            fromDate:this.state.fromDate?this.state.fromDate:"",
            toDate:this.state.toDate?this.state.toDate:"",
           
        }
    
        URMService.getClientSupporters(this.state.role?this.state.role:null,pageNumber,obj).then((response)=>{
            console.log(response.result);
            if(response.data.result){
                // this.state.clientData=response.data;
                this.setState({
                    clientSupportData:response.data.result,
                    totalPages:response?.data?.result?.totalPages
                   });
            }
           
        });
    }
  
//     getDomainValue = (e) => {
//         this.setState({domain: e.target.value, role: '', storesList:[], rolesList:[] }, () => {
//                 this.getAllRolesList();
//         });
// }

    changePage(pageNumber){
        let pageNo=pageNumber+1;
        this.setState({pageNumber:pageNo});
        this.getClientSupporters(pageNumber);
    }

    renderTableData() {
      return this.state?.clientSupportData?.content?.map((items,index)=>{
        let date = formatDate(items.createdDate)
        const {userName,email,gender,createdBy,createdDate,planActivatedDate}=items;
        return(
            <tr className="m-0 p-0" key={index}>
                            <td className="col-1">{index+1}</td>
                            <td className="col-1">{userName}</td>
                            <td className="col-2">{email}</td>
                            <td className="col-1">{gender}</td>
                            <td className="col-2">{date.substring(0,10)}</td>
                            <td className="col-1">
                            <img src={edit} className="w-12 m-r-2 pb-2"  onClick={(e) => this.editUser(items)} name="image" /> </td>
                            <td className="col-1">
                    {items.isActive ? 
                      <button className="btn-active">Active</button> : 
                      <button className="btn-inactive">Inactive</button>}
                  </td>
                           
                            
                        </tr> 
        )
      })
    }

    render() {
        let storesList;
        let rolesList;
        let domainsList;
        if (this.state.storesList && this.state.storesList.length > 0) {
            const modules = this.state.storesList;
            storesList = modules.length > 0
                && modules.map((item, i) => {
                    return (

                        <option key={i} value={item.id}>{item.name}</option>
                    )
                }, this);
        }

        if (this.state.rolesList && this.state.rolesList.length > 0) {
            const modules = this.state.rolesList;
            rolesList = modules.length > 0
                && modules.map((item, i) => {
                    return (

                        <option key={i} value={item.roleName}>{item.roleName}</option>
                    )
                }, this);
        }

        if (this.state.domainsList && this.state.domainsList.length > 0) {
            const modules = this.state.domainsList;
            domainsList = modules.length > 0
                && modules.map((item, i) => {
                    return (

                        <option key={i} value={item.id}>{item.domaiName}</option>
                    )
                }, this);
        }


        return (
            <div className="maincontent">
                <Modal isOpen={this.state.showModal} size="lg">
                    <ModalHeader>
                        {
                            !this.state.isEdit && (
                                <div>
                                     Add Client Support
                                     <button type='button' onClick={() =>this.toggle()} className='btn search modal-close text-right'> <img src={close}></img></button> 

                                    </div>
                               
                            )
                        }
                        {
                            this.state.isEdit && (
                                <div>
                                Edit Client Support
                                <button type='button' onClick={() =>this.toggle()} className='btn search modal-close text-right'> <img src={close}></img></button> 

                                    </div>
                               
                            )
                        }
                        </ModalHeader>
                    <ModalBody>
                        <div className="p-3">
                            {/* <h5 className="fs-14 text-red scaling-center scaling-mb">User Details</h5> */}
                            <div className="row">
                                <div className="col-12 col-sm-4 scaling-mb">
                                    <div className="form-group">
                                        <label>Name <span className="text-red font-bold" name="bold">*</span></label>
                                        <input type="text" className="form-control" name="entername" placeholder="Enter Name"
                                            value={this.state.name} disabled={this.state.isEdit}
                                            maxLength={errorLengthMax.name}
                                            onChange={this.handleClientName}
                                            autoComplete="off" />
                                             <div>
                                            <span style={{ color: "red" }}>{this.state.errors["name"]}</span>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 scaling-mb">
                                    <div className="form-group">
                                    <label>DOB <span className="text-red font-bold" name="bold">*</span></label>
                                        <input type="date" className="form-control" name="date"
                                            value={this.state.dob}
                                            onChange={this.handleDob}
                                            autoComplete="off"
                                            max={moment().format("YYYY-MM-DD")} />
                                         <span style={{ color: "red" }}>{this.state.errors["dob"]}</span>

                                    </div>
                                </div>
                                <div className="col-12 col-sm-4">
                                    <div className="form-group">
                                        <label>Gender </label>
                                        <select className="form-control" name="gender" value={this.state.gender}
                                            onChange={(e) => this.setState({ gender: e.target.value })}
                                        >
                                            <option>Select</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                            
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 mt-3">
                                    <div className="form-group">
                                        <label>Mobile <span className="text-red font-bold">*</span></label>
                                        <input type="text" className="form-control" placeholder="" name="number"
                                            value={this.state.mobileNumber} maxLength={errorLengthMax.mobileNumber}
                                            onChange={this.validation}
                                            autoComplete="off" />
                                             <div>
                                            <span style={{ color: "red" }}>{this.state.errors["mobileNumber"]}</span>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 mt-3">
                                    <div className="form-group">
                                        <label>Email <span className="text-red font-bold">*</span></label>
                                        <input type="email" className="form-control" placeholder="sample@gmail.com" name="email"
                                            value={this.state.email} disabled={this.state.isEdit}
                                            onChange={this.emailValidation}
                                            autoComplete="off" />
                                             <div>
                                            <span style={{ color: "red" }}>{this.state.errors["email"]}</span>
                                        </div>

                                    </div>
                                </div>

                                <div className="col-12 col-sm-4 mt-3">
                                    <div className="form-group">
                                        <label>Address</label>
                                        <input type="text" className="form-control" placeholder="Enter Address" name="adress"
                                            value={this.state.address}
                                            onChange={(e) => this.setState({ address: e.target.value })}
                                            autoComplete="off" />
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 scaling-mb mt-3">
                                    <div className="form-group">
                                        <label>Status <span className="text-red font-bold">*</span></label>
                                            <select value={this.state.userStatus}  onChange={(e) =>  this.handleStatus(e)} className="form-control">
                                                
                                                <option>Select Status</option>
                                                { 
                                                this.state.usersStatus &&
                                                this.state.usersStatus.map((item, i) => 
                                                (<option key={i} value={item.value}>{item.label}</option>))
                                                }
                                            </select>
                                        <div>
                                          {/* <span style={{ color: "red" }}>{this.state.errors["role"]}</span> */}
                                        </div>
                                    </div>
                                </div>
                                </div>
                        </div>
                                   
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn-unic" onClick={this.hideCreateUser} name="cancel">Cancel</button>
                        <button className="btn-unic active fs-12" onClick={this.addCreateUser} name="save">Save</button>
                    </ModalFooter>
                </Modal>
                <div className="row">
                <div className=" col-2">
                   <div className="form-group">
                   <label>
                   Supporter Name          
                   </label>
                    <input type="text" 
                     className="form-control"
                      placeholder="Enter supporter Name"
                      value={this.state.supporterName}
                    onChange= {this.handleStoreChange}
                    />
              
                   </div>
                  </div>


                   <div className="col-2">
                        <div className="form-group">
                        <label>From Date</label>
                            <input 
                            type="date"
                             className="form-control"
                             value={this.state.fromDate}
                             onChange={(e)=>this.setState({fromDate:e.target.value})}/>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-group">
                        <label>To Date</label>
                            <input 
                            type="date" 
                            className="form-control"
                            value={this.state.toDate}
                            onChange={(e)=>{
                                var startDate=new Date(this.state.fromDate);
                                var endDate=new Date(e.target.value);
                                if(startDate<=endDate){
                                    this.setState({toDate:e.target.value});
                                }else{
                                    toast.error("To date should be greater than From date");
                                }
                            }}
                            />
                        </div>
                    </div>
                    
                    <div className="col-12 scaling-center scaling-mb col-sm-6 pt-4 p-l-0">
                        <button 
                        className="btn-unic-search active m-r-2" 
                        name="search" 
                        onClick={()=>{this.searchSupporters()}}>
                            Search 
                            </button>
                  <button className="btn-unic-search active m-r-2" onClick={() => {this.clear() }}>Clear </button>
                <button className="btn-unic-search active" name="createuser"  onClick={this.showCreateUser}><i className="icon-create_customer"></i> Add Client Support</button>                   
                    
                    </div>

                    
                </div>
                <div>
                    {/* {this.getUserTable()} */}
                    <div>
                <div className="col-sm-12 col-12 scaling-center scaling-mb mt-3">
                    <h5 className='fs-18'>List Of Client Supports</h5>
                </div>
                <div className="table-responsive p-0">
                <table className="table table-borderless mb-1 mt-2">
                    <thead>
                        <tr className="m-0 p-0">
                            <th className="col-1">S.No </th>
                            <th className="col-1">Name</th>
                            <th className="col-2">EMAIL</th>
                            <th className="col-1">GENDER</th>
                            <th className="col-2">CREATED ON</th>
                            <th className="col-1"></th>
                            <th className="col-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTableData()}
                    </tbody>
                </table>
                <div className="row m-0 pb-3 mb-5 mt-3">

{this.state.totalPages > 1 ? (

                <div className="d-flex justify-content-center">
                 <ReactPageNation
                  {...this.state.clientSupportData}
                  changePage={(pageNumber) => {
                    this.changePage(pageNumber);
                    }}
                   />
                  </div>
                    ):null}
                    </div>


                </div>
            </div>
                </div>

            </div>
        )
    }
}
