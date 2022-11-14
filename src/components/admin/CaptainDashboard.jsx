
import React, { Component } from 'react';

class CaptainDashboard extends Component {
    render() {
        return (
            <div className='maincontent text-center'>
              <h6 className='text-grey fs-25 mt-5 pt-5'>page is under development...</h6>  
            </div>
        );
    }
}



// import React, { Component } from 'react';   
// import edit from '../../assets/images/edit.svg';
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
// import { ToastContainer, toast } from "react-toastify";
// import Multiselect from 'multiselect-react-dropdown';
// import URMService from '../../services/URM/URMService';
// import  PrivilegesList  from '../../commonUtils/PrivilegesList';
// import { errorLengthMin , errorLengthMax , urmErrorMessages} from "../../commonUtils/Errors";
// import moment from 'moment';
// import ReactPageNation from "../../commonUtils/Pagination";
// class CaptainDashboard extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             showModal: false,
//             showCreate: false,
//             name: "",
//             dob: "",
//             gender: "",
//             mobileNumber: "",
//             address: "",
//             email: "",
//             storeName: [],
//             role: "",
//             isUser: false,
//             usersList: [],
//             storesList: [],
//             rolesList: [],
//             rolesData:[],
//             domainsList: [],
//             domain: "",
//             isSuperAdmin: false,
//             selectedPrivilages: null,
//             isAddStore: false,
//             selectedStoresList: [],
//             clientId: "",
//             loggedInUser: "",
//             copyStoresList: [],
//             isLoggedUser: false,
//             isAdmin: false,
//             userName:"NA",
//             isEdit: false,
//             userId: "",
//             usersList1: [],
//             errors: {},
//             adminRole: "",
//             userType:"",
//             loggedUserId:null,
//             pageNumber:0,
//             totalPages:0,
//             usersStatus: [
//                             { value: true, label: 'Active' },
//                             { value:  false, label: 'Inactive' },
//                         ],
//             userStatus: true,
//             addUserPrevilige: '',
//             editUserPrevilige: '',
//             deleteUserPrevilige: '',
//             viewUserPrevilige: ''
//         }
//         this.setState({usersList: []})
//         this.showCreateUser = this.showCreateUser.bind(this);
//         this.hideCreateUser = this.hideCreateUser.bind(this);
//         this.createUser = this.createUser.bind(this);
//         this.hideUser = this.hideUser.bind(this);
//         this.addCreateUser = this.addCreateUser.bind(this);
//         this.onSelect = this.onSelect.bind(this);
//         this.onRemove = this.onRemove.bind(this);
//         this.closeStores = this.closeStores.bind(this);
//         this.addStores = this.addStores.bind(this);
//         this.getAllStoresList = this.getAllStoresList.bind(this);
//         this.getAllRolesList = this.getAllRolesList.bind(this);
//         this.getDomainsList = this.getDomainsList.bind(this);
//         this.validation = this.validation.bind(this);
//         this.emailValidation = this.emailValidation.bind(this);
//         this.getDomainValue = this.getDomainValue.bind(this);
//         this.searchUser = this.searchUser.bind(this);
//         this.getUsers = this.getUsers.bind(this);
//         this.handleValidation = this.handleValidation.bind(this);
//         this.changePage = this.changePage.bind(this);
//         this.deleteUser=this.deleteUser.bind(this);

//     }
    
   

//     getDomainsList() {
//         // URMService.getDomainsList(this.state.clientId).then((res) => { 
//         //     if(res) {
//         //         this.setState({domainsList: res.data.result, domain: res.data.result[0].id});
//         //         this.getAllStoresList();
//         //         this.getAllRolesList();
//         //     }
           
//         // });
//         this.getAllStoresList();
//         this.getAllRolesList();
//         this.getUsers(0);
//     }

//     validation(e){

//         // this.setState({
//         //                 [e.target.id]: e.target.value, mobileNumber:  e.target.value
//         //                 });
      
//         const regex = /^[0-9\b]+$/;
//         const value = e.target.value;
//         if (value === '' || regex.test(value)) {
//             this.setState({
//                 [e.target.id]: e.target.value, mobileNumber:  e.target.value
//                 });
//         } else {
//             // toast.error("pls enter numbers")
//         }
       
          
//        }

//        emailValidation(e){
//         const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{4,})$/i;
//         const value = e.target.value;
//         if(!value || regex.test(value) === false) {
//             this.setState({
//                 [e.target.id]: e.target.value, email:  e.target.value
//                 });
//         } else {
//             // toast.error("pls enter numbers")
//         }
       
          
//        }

   

//     showCreateUser() {
//         this.setState({ showModal: true,isSearch: false, isSuperAdmin: false });
       
//         this.setState({
//             name: "",
//             dob: "",
//             gender: "",
//             mobileNumber: "",
//             address: "",
//             email: "",
//             isEdit: false,
//             errors: {}, 
//             isAdmin: false

//         });
//         // this.getDomainsList();
//     }

//     searchUser() {
//         this.setState({isSearch: true});
//         const searchUser = {
//             "id": 0,
//             "phoneNo": null,
//             "name": null,
//             "active":this.state.userType === "Active" ? "True" : "False",
//             "inActive":this.state.userType === "InActive" ? "True" : "False",
//             "roleName": this.state.searchRole ? this.state.searchRole.trim() : null,
//             "storeName": this.state.searchStore ? this.state.searchStore.trim() : null,
//             "clientId": this.state.clientId
//             }

//             URMService.getUserBySearch(searchUser).then(res => {
//                 if(res) {
                    
//                     res.data.result.content.forEach(element => {
//                         element.roleName = element.role.roleName ? element.role.roleName : "";
//                     });
//                     this.setState({usersList: res.data.result, totalPages: res.data.result.totalPages, isUser: true});
//                 } else {
//                     this.setState({usersList: [], isUser: false});
//                 }
//             })
//     }
   
//     getAllStoresList() {
//         URMService.getStoresByDomainId(this.state.clientId).then((res) =>{
//             if(res) {
//                this.setState({storesList: res.data, storeName: this.state.isEdit ? this.state.storeName : []});
//              this.state.storesList = res.data;
//             }
//         }); 
//     }
    
//     getAllRolesList() {
//         URMService.getRolesByDomainId(this.state.clientId).then((res) =>{
//             if(res) {
               
//                  this.setState({rolesData: res.data,
//                      role: this.state.isEdit ? this.state.role : res.data[0].roleName},()=>{
//                          const obj = {
//                              roleName: "Select"
//                          }
//                         this.state.rolesData.splice(0,0,obj);
//                          this.setState({rolesList: this.state.rolesData})

//                      });

                
//             }
           
//          }); 
//     }

//     hideCreateUser() {
//         this.setState({ showModal: false });
//     }

//     createUser() {
//         this.setState({ showCreate: true });
//     }

//     hideUser() {
//         this.setState({ showCreate: false });
//     }
    
//     componentDidMount() {
//         const childPrivileges =  PrivilegesList('Users');
//         childPrivileges.then((res) => {
//           if(res) {
//             const result = res.sort((a , b) => a.id - b.id);
//             console.log('+++++++result++++++++', result);
//             this.setState({
//                 addUserPrevilige: result[0],
//                 editUserPrevilige: result[1],
//                 deleteUserPrevilige: result[2],
//                 viewUserPrevilige: result[3] ,    
//             });
//           }
//         });
//         const user = JSON.parse(sessionStorage.getItem('user'));
//         this.setState({userName : user["cognito:username"], isEdit: false,loggedUserId: user["custom:userId"] });
//         if(user) {
//             this.setState({ clientId: user["custom:clientId1"],
//             domainId: user["custom:domianId1"] }, () => {this.getDomainsList();});
            
//         }
       
       
//     }

   
//     getUsers(pageNumber) {
//         if(this.state.isSearch) {
//             this.setState({
//                 searchStore : "",
//                 userType : "Select User Type",
//                 searchRole : ""
//             })
           
//         }
//         URMService.getUsers(this.state.clientId,pageNumber).then(res => {
//             console.log("ressss",res)
//             if(res) {
                
//                 this.state.usersList = res.data;
//                this.setState({
//                 //    usersList: res.data.result, 
//                 usersList:  this.state.usersList, 
//                    totalPages: res.data.totalPages,
//                    isUser: true });
          
//                    console.log("totalpages",this.state.totalPages);
//             }
//         });
//     }
  
//     editUser(items) { 
//         console.log(items);
//         const obj = {
            
//             "id":items.id,
//             "phoneNo":"",
//             "name":"",
//             "active":"False",
//             "inActive": "False",
//             "roleName": "",
//             "storeName": "",
//             "clientId": this.state.clientId,
//             }
//         URMService.getUserBySearch(obj).then(res=> {
//             console.log(res);
//             if(res) {
//                 const userDetails = res.data.result.content[0];
//                 // const userDetails = res?.data?.result;
//                 this.setState({
//                     showModal: true,
//                     name: userDetails.userName,
//                     dob:  items.dob,
//                     gender: userDetails.gender,
//                     // mobileNumber: userDetails.phoneNumber.substring(3,13),
//                     mobileNumber: userDetails.phoneNumber,
//                     email: items.email,
//                     address: items.address,
//                     isAdmin: userDetails.superAdmin,
//                     // domain: userDetails.clientDomians[0]?.id, 
//                     role: userDetails.role?.roleName,
//                     storeName: userDetails.stores,
//                     isEdit: true,
//                     isSearch: false,
//                     isSuperAdmin: userDetails.superAdmin,
//                     userId: items.id,
//                     userStatus: userDetails.isActive
//                 }, () => {
//                     this.state.isSuperAdmin = this.state.isAdmin;
//                     const user = sessionStorage.getItem('domainName');
//                     this.state.domain = this.state.isAdmin ? "" : this.state.domain;
//                     if(user !== 'config_user' && !this.state.isSuperAdmin) {
//                         this.getAllRolesList();
//                         this.getAllStoresList();
//                     } 
                   
//                 });
        
//             }
          

//         });

        
//     }
  

//     deleteUser(items) {
        
//         URMService.deleteUser(items.id).then(
//           (res) => {
//             if (res.data && res.data.isSuccess === "true") {
//               toast.success(res.data.result);
//               this.props.history.push("/users");
//               this.stateReset();
//               this.getUsers(0);
//             //   this.getUsers(0)
//               console.log(".....userId", items.id);
//             } else {
//               toast.error(res.data.message);
//             }
//           }
//         );
//       }
//     stateReset(){
//         this.setState({
//         id:"",
//         userName:"",
//         roleName:"",
//         createdBy:"",
//         // "domian:0,
//         email:"",
//         createdDate:"",
//         isActive:false,
//         address: "",
//         createdBy: "",
//         createdDate: "",
//         dob: "",
//         email: "",
//         gender: "",
//         roleName: "",
//         })
//     }
       
//     handleValidation() {
//         let errors = {};
//         let formIsValid = true;

//         //Name
//         // if (!this.state.name) {
//         //     formIsValid = false;
//         //     errors["name"] = "Enter name";
//         // }
//         if (this.state.name.length < errorLengthMin.name) {
//             formIsValid = false;
//             errors["name"] = urmErrorMessages.name;
      
//       }

       


        
//        // Mobile number
//        if(!this.state.mobileNumber){
//         formIsValid = false;
//         errors["mobileNumber"] = urmErrorMessages.mobileNumber;
//       }
           
//     if (this.state.mobileNumber.length < errorLengthMin.mobileNumber) {
//       var pattern = new RegExp(/^[0-9\b]+$/);
//       if (pattern.test(this.state.mobileNumber)) {
//           formIsValid = false;
//         errors["mobileNumber"] = urmErrorMessages.mobileNumber;
//       }
//     }

//         //email 
//         // if (!this.state.email) {
//         //     formIsValid = false;
//         //     errors["email"] = "Please Enter email";
//         // }

//         // if (typeof this.state.email !== "undefined") {

//         //     if (!this.state.email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{4,})$/i)) {
//         //         formIsValid = false;
//         //         errors["email"] = "Please Enter Valid Email";
//         //     }

//         // }

//         if (!this.state.email) {
//             errors["email"] = urmErrorMessages.email;
//           } else if (!/\S+@\S+\.\S+/.test(this.state.email)) {
//             errors["email"] = urmErrorMessages.email;
//           }


//         // if(!this.state.isSuperAdmin) {
//         //     if (this.state.storeName.length === 0) {
//         //         formIsValid = false;
//         //         errors["storeName"] = "Please Select Store";
//         //     }
//             // if (!this.state.domain) {
//             //     formIsValid = false;
//             //     errors["domain"] = "Please Select Domain";
//             // }
//             // if (!this.state.role) {
//             //     formIsValid = false;
//             //     errors["role"] = "Please Select Role";
//             // }
//             if(!this.state.isSuperAdmin) {
//                 if (this.state.storeName.length === 0) {
//                     formIsValid = false;
//                     errors["storeName"] = urmErrorMessages.storeName;
//                 }
//                 // if (!this.state.domain) {
//                 //     formIsValid = false;
//                 //     errors["domain"] = urmErrorMessages.domain;
//                 // }
//                 if (!this.state.role) {
//                     formIsValid = false;
//                     errors["role"] = urmErrorMessages.role;
//                 }
//             }
//         this.setState({ errors: errors });               
//         return formIsValid;

//     }
  
   
//     addCreateUser() {
//         if(this.state.email && this.state.mobileNumber && this.state.name){
//         const formValid = this.handleValidation();
//          if (formValid) {
//         const user = sessionStorage.getItem('domainName');
//         const clientDomain = this.state.domain !== "" ? this.state.domain : this.state.clientId;
//         let saveObj; 
//         if(this.state.isEdit) {
//             saveObj = {
//                 "id": this.state.userId,
//                 "email":this.state.email,	
//                 "phoneNumber":(this.state.mobileNumber),
//                 "birthDate": this.state.dob,
//                 "gender":this.state.gender,
//                 "name":this.state.name,
//                 "username":this.state.name,
//                 // "assginedStores":"kphb",
//                 // "parentId":"1",
//                 // "domianId": this.state.domain,
//                 "address": this.state.address,
//                 "role":{
//                     "roleName": this.state.role,
//                 },
//                 "roleName": this.state.role,
//                 "stores": this.state.storeName,
//                 "clientId": this.state.clientId,
//                 "isConfigUser": false,
//                 "clientDomain": [clientDomain],
//                 "isSuperAdmin": JSON.stringify(this.state.isAdmin),
//                 "createdBy" : this.state.loggedUserId,
//                 "isActive": this.state.userStatus
//             }
//             URMService.editUser(saveObj).then((response) => {
//                 if(response) {
//                     toast.success("User Created Successfully");
//                                       this.getDomainsList();
//                     this.hideCreateUser();
                    
//                 }
//             });
            
//         } else {
//             saveObj = {
//                 "email":this.state.email,	
//                 "phoneNumber":"+91".concat(this.state.mobileNumber),
//                 "birthDate": this.state.dob,
//                 "gender":this.state.gender,
//                 "name":this.state.name,
//                 "username":this.state.name,
//                 // "assginedStores":"kphb",
//                 // "parentId":"1",
//                 // "domianId": this.state.domain,
//                 "address": this.state.address,
//                 "role":{
//                     "roleName": this.state.isAdmin ? this.state.adminRole:  this.state.role,
//                 },
//                 "roleName":  this.state.isAdmin ? this.state.adminRole:  this.state.role,
//                 "stores": this.state.storeName,
//                 "clientId": this.state.clientId,
//                 "isConfigUser": false,
//                 "clientDomain": [clientDomain],
//                 "isSuperAdmin": JSON.stringify(this.state.isAdmin),
//                 "createdBy" : this.state.loggedUserId,
//                 "isActive": this.state.userStatus
    
//                 }

//                 URMService.saveUser(saveObj).then((response) => {
//                     if(response) {
//                         toast.success("User Created Successfully");
//                         this.getDomainsList();
//                         this.hideCreateUser();
                        
//                     }
//                 });

               
                
    
//         }
    

//     } 
// }else {
//     toast.info("Please Enter all mandatory fields");
// }
// }
          
        
    

//     changePage(pageNumber) {
//         console.log(">>>page", pageNumber);
//         let pageNo = pageNumber + 1;
//         this.setState({ pageNumber: pageNo });
//         // this.getUserBySearch(pageNumber);
//         // this.searchUser(pageNumber);
//         this.getUsers(pageNumber); 
//       }
    
//     getTableData() {
        
//         return this.state?.usersList?.content.map((items, index) => {
//             let date = this.dateFormat(items.createdDate)
//             const {id, userName, roleName, stores, active,isSuperAdmin } = items;
//             return (

//                 <tr className="" key={index}>
//                     <td className="col-1">{id}</td>
//                     <td className="col-2">{userName}</td>
//                     {/* <td className="col-2">{email}</td> */}
//                     <td className="col-1">{roleName}</td>
//                     <td className="col-2">
//                      {
//                          stores?.map((store,index) => {
//                              return(
//                                  <div key={index}>{store.name}</div>
//                              )
//                          })
//                      }
//                     </td>
//                     {/* <td className="col-2" name="createdata">{createdDate}</td> */}
//                     <td className="col-1" name="date">{date}</td>
//                     <td className="col-1" name="date">{date}</td>
//                     {/* <td className="col-1">{address}</td> */}
//                     <td className="col-1">
//                     {items.isActive ? 
//                       <button className="btn-active">Active</button> : 
//                       <button className="btn-inactive">Inactive</button>}
//                   </td>
//                   <td className="col-2" name="date">{date}</td>
//                     <td className="col-1">
//                     {items.stores.length > 0 ? <img src={edit} className="w-12 m-r-2 pb-2" disabled={!this.state.editUserPrevilige.isEnabeld} onClick={(e) => this.editUser(items)} name="image" /> : <img src={edit} className="w-12 m-r-2 pb-2" name="image" />}
//                     <i className="icon-delete"onClick={(e) => this.deleteUser(items)}></i>
//                     </td>
//                 </tr>


//             );
//         });
//     }

//     getUserTable() {
//         return this.state.isUser && (
//             <div>
//                 <div className="col-sm-12 col-12 scaling-center scaling-mb mt-3">
//                     <h5 className='fs-18'>List Of Super Admin's</h5>
//                 </div>
//                 <div className="table-responsive p-0">
//                 <table className="table table-borderless mb-1 mt-2">
//                     <thead>
//                         <tr className="m-0 p-0">
//                             <th className="col-1">S.NO </th>
//                             <th className="col-2">Name</th>
//                             {/* <th className="col-2">Email</th> */}
//                             <th className="col-1">EMP ID</th>
//                             <th className="col-2">Email</th>
//                             <th className="col-1">Gender</th>
//                             <th className="col-1">CREATED BY</th>
//                             <th className="col-1">Created Date</th>
//                             {/* <th className="col-1">Store</th> */}
//                             <th className="col-2">Description</th>
//                             <th className="col-1"></th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {/* {this.getTableData()} */}



//                     </tbody>
//                 </table>
                
//                 <div className="row m-0 pb-3 mb-5 mt-3">

//                 {this.state.totalPages > 1 ? (
//                 <div className="d-flex justify-content-center">
//                  <ReactPageNation
//                   {...this.state.usersList}
//                   changePage={(pageNumber) => {
//                     this.changePage(pageNumber);
//                     }}
//                    />
//                   </div>
//                   ) : null} 
//                    </div>
//                 </div>
//             </div>
//         )
//     }

//     onSelect(selectedList, selectedItem) {
//         this.setState({ storeName: selectedList });
//     }

//     onRemove(selectedList, removedItem) {
//         this.setState({ storeName: selectedList });
//     }

//     setRoles = (e) => {
//         console.log(e.target.value)
//         this.setState({ role: e.target.value  === "Select" ? null : e.target.value });
//     }

//     addStores() {
        
//         this.state.storesList.forEach(ele => {
//            const obj = {
//                id: ele.id,
//                name: ele.name
//            }
//            this.state.copyStoresList.push(obj);
//         });
//         this.setState({isAddStore: true});
//     }

//     closeStores() {
//         this.setState({isAddStore: false});
//     }
//     dateFormat = (d) => {
//         let date = new Date(d)
        
//         return date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()
//     }

//     setStoresList(e, value, storeName) {
//         if (e.target.checked) {
//            this.state.storesList[value].isCheck = e.target.checked;
//            const obj = {
//                storeName: storeName
//            }
//            this.state.selectedStoresList.push(obj);
//         } else {
//             this.state.storesList[value].isCheck = e.target.checked;
//             let index = this.state.selectedStoresList.findIndex(ele => ele.storeName === storeName);
//             this.state.selectedStoresList.splice(index, 1);
//         }
//         this.selectedStoresList = this.removeDuplicates(this.state.selectedStoresList, "storeName");
//         this.setState({ selectedStoresList: this.state.selectedStoresList });
//         this.setState({ storesList: this.state.storesList });
//     }

//     setSuperAdmin(e) {
       
        
//         if(e.target.checked) {
//           //  this.setState({domain: "", storeName: [], role: ""})
//           this.state.domain = "";
//           this.state.storeName = [];
//           this.state.domainsList = [];
//          //  this.state.rolesList = [];
//           this.state.role = "";
//           this.setState({adminRole: 'super_admin' });
//         //   this.getPrivilegesByDomainId()
//         }
//         console.log(this.state.domain);
//         this.setState({isAdmin: e.target.checked, isSuperAdmin: e.target.checked });
//     }

//     // getPrivilegesByDomainId() {
//     //     URMService.getAllPrivilegesbyDomain(0).then(res => {
//     //         if(res) {
//     //         
//     //         }
//     //       });

//     // }




    
//     removeDuplicates(array,key) {
//         const lookup = new Set();
//         return array.filter(obj => !lookup.has(obj[key]) && lookup.add(obj[key]));
//     } 


//     getStoresList() {
//         return this.state.storesList &&  this.state.storesList.map((items, index) => {
//             const { name, isCheck } = items;
//             return (
//                 <tr className="row m-0 p-0" key={index}>
//                     <td className="col-1">{index + 1}</td>
//                     <td className="col-4">{name}</td>
//                     <td className="col-1">
//                         <div className="form-check checkbox-rounded checkbox-living-coral-filled pointer fs-15">
//                           <input type="checkbox" className="form-check-input filled-in mt-1"  id="remember{{index}}"  
//                             name="barcodes{{index}}" checked={isCheck}
//                             onChange={(e) => this.setStoresList(e, index, name)}/>
//                           <label className="form-check-label" name="checklabel" htmlFor="remember{{index}}"></label>
//                         </div>
//                     </td>
//                 </tr>
//             );
//         });
//     }

//     getDomainValue = (e) => {
//         this.setState({domain: e.target.value, role: '', storesList:[], rolesList:[] }, () => {
//             this.getAllStoresList();
//                 this.getAllRolesList();
//         });
// }
// capitalization= () => {
//     const { name } = this.state;
//    if(name) {
//     const store_name =   name[0].toLocaleUpperCase() + name.substring(1);
//     this.setState({
//         name: store_name
//     })
//     }
//   }
//   handleUserStatus(e){
//     this.setState({userStatus: e.target.value});
//   }


//     render() {
//         let storesList;
//         let rolesList;
//         let domainsList;
//         if (this.state.storesList && this.state.storesList.length > 0) {
//             const modules = this.state.storesList;
//             storesList = modules.length > 0
//                 && modules.map((item, i) => {
//                     return (

//                         <option key={i} value={item.id}>{item.name}</option>
//                     )
//                 }, this);
//         }

//         if (this.state.rolesList && this.state.rolesList.length > 0) {
//             const modules = this.state.rolesList;
//             rolesList = modules.length > 0
//                 && modules.map((item, i) => {
//                     return (

//                         <option key={i} value={item.roleName}>{item.roleName}</option>
//                     )
//                 }, this);
//         }

//         if (this.state.domainsList && this.state.domainsList.length > 0) {
//             const modules = this.state.domainsList;
//             domainsList = modules.length > 0
//                 && modules.map((item, i) => {
//                     return (

//                         <option key={i} value={item.id}>{item.domaiName}</option>
//                     )
//                 }, this);
//         }


//         return (
//             <div className="maincontent">

//                 <Modal isOpen={this.state.isAddStore} size="lg">
//                     <ModalHeader>Add Store</ModalHeader>
//                     <ModalBody>
//                         <div className="maincontent p-0">
//                         <div className="table-responsive p-0">
//                             <table className="table table-borderless">
//                                 <thead>
//                                     <tr className="row m-0 p-0">
//                                         <th className="col-1 pt-1">S.No</th>
//                                         <th className="col-4 pt-1">Store Name</th>
//                                         <th className="col-1 pt-1"></th>

//                                     </tr>
//                                 </thead>
//                                 <tbody>

//                                     {this.getStoresList()}
//                                 </tbody>
//                             </table>
//                             </div>
//                         </div>
//                     </ModalBody>
//                     <ModalFooter>
//                         <button className="btn-unic" onClick={this.closeStores} name="closestore">
//                             Cancel
//                         </button>
//                         <button
//                             className="btn-unic active fs-12" name="click"
//                             onClick={this.closeStores}
//                         >
//                             Save
//                         </button>
//                     </ModalFooter>
//                 </Modal>

             

//                 <Modal isOpen={this.state.showModal} size="lg">
//                     <ModalHeader>
//                         {
//                             !this.state.isEdit && (
//                                 <div>
//                                      Super Admin Details
//                                     </div>
                               
//                             )
//                         }
//                         {
//                             this.state.isEdit && (
//                                 <div>
//                                 Edit Super Admin
//                                     </div>
                               
//                             )
//                         }
//                         </ModalHeader>
//                     <ModalBody>
//                         <div className="">
//                             {/* <h5 className="fs-14 text-red scaling-center scaling-mb">Super Admin Details</h5> */}
//                             <div className="row">
//                                 <div className="col-12 col-sm-4 scaling-mb">
//                                     <div className="form-group">
//                                         <label>Name <span className="text-red font-bold" name="bold">*</span></label>
//                                         <input type="text" className="form-control" name="entername" placeholder="Enter Name"
//                                             value={this.state.name} disabled={this.state.isEdit}
//                                             maxLength={errorLengthMax.name}
//                                             onChange={(e) => this.setState({ name: e.target.value })}
//                                             autoComplete="off" />
//                                              <div>
//                                             <span style={{ color: "red" }}>{this.state.errors["name"]}</span>
//                                         </div>

//                                     </div>
//                                 </div>
//                                 <div className="col-12 col-sm-4 scaling-mb">
//                                     <div className="form-group">
//                                         <label>DOB </label>
//                                         <input type="date" className="form-control" name="date"
//                                             value={this.state.dob}
//                                             onChange={(e) => this.setState({ dob: e.target.value })}
//                                             autoComplete="off"
//                                             max={moment().format("YYYY-MM-DD")} />
//                                     </div>
//                                 </div>
//                                 <div className="col-12 col-sm-4">
//                                     <div className="form-group">
//                                         <label>Gender </label>
//                                         <select className="form-control" name="gender" value={this.state.gender}
//                                             onChange={(e) => this.setState({ gender: e.target.value })}
//                                         >
//                                             <option>Select</option>
//                                             <option>Male</option>
//                                             <option>Female</option>
                                            
//                                         </select>
//                                     </div>
//                                 </div>
//                                 <div className="col-12 col-sm-4 mt-3">
//                                     <div className="form-group">
//                                         <label>Mobile <span className="text-red font-bold">*</span></label>
//                                         <input type="text" className="form-control" placeholder="" name="number"
//                                             value={this.state.mobileNumber} maxLength={errorLengthMax.mobileNumber}
//                                             onChange={this.validation}
//                                             autoComplete="off" />
//                                              <div>
//                                             <span style={{ color: "red" }}>{this.state.errors["mobileNumber"]}</span>
//                                         </div>

//                                     </div>
//                                 </div>
//                                 <div className="col-12 col-sm-4 mt-3">
//                                     <div className="form-group">
//                                         <label>Email <span className="text-red font-bold">*</span></label>
//                                         <input type="email" className="form-control" placeholder="sample@gmail.com" name="email"
//                                             value={this.state.email} disabled={this.state.isEdit}
//                                             onChange={this.emailValidation}
//                                             autoComplete="off" />
//                                              <div>
//                                             <span style={{ color: "red" }}>{this.state.errors["email"]}</span>
//                                         </div>

//                                     </div>
//                                 </div>

//                                 <div className="col-12 col-sm-4 mt-3">
//                                     <div className="form-group">
//                                         <label>Address</label>
//                                         <input type="text" className="form-control" placeholder="Enter Address" name="adress"
//                                             value={this.state.address}
//                                             onChange={(e) => this.setState({ address: e.target.value })}
//                                             autoComplete="off" />
//                                     </div>
//                                 </div>
//                                 <div className="col-12 col-sm-12 mt-3">
//                                     <div className="form-group">
//                                         <label>Description</label>
//                                         <input type="text" className="form-control" placeholder="Enter Description" name="adress"
//                                             value={this.state.address}
//                                             onChange={(e) => this.setState({ address: e.target.value })}
//                                             autoComplete="off" />
//                                     </div>
//                                 </div>

//                                 {/* <div className="col-3">
//                             <div className="form-group mt-3 pt-2">
//                                 <button className="btn-login btn-create">Apply Filters </button>
//                             </div>
//                         </div> */}
//                                 <hr />
//                             </div>

             
//                         </div>
//                     </ModalBody>
//                     <ModalFooter>
//                         <button className="btn-unic" onClick={this.hideCreateUser} name="cancel">Cancel</button>
//                         <button className="btn-unic active fs-12" onClick={this.addCreateUser} name="save">Save</button>
//                     </ModalFooter>
//                 </Modal>
//                 <div className="row">
//                     {/* <div className="col-12 col-sm-2 mt-2">
//                         <div className="form-group">
//                         <label>User Type</label>
//                             <select className="form-control" name="formcontrol" onChange={(e) => this.setState({ userType: e.target.value })}>
//                                 <option>Select User Type</option>
//                                 <option>Active</option>
//                                 <option>InActive</option>
//                             </select>
//                         </div>
//                     </div>
//                     <div className="col-12 col-sm-2 mt-2">
//                         <div className="form-group outline-remove">
//                         <label>Role</label>
//                         <input type="text" className="form-control" name ="role" placeholder="role" value={this.state.searchRole}
//                                 onChange={(e) => this.setState({ searchRole: e.target.value })} />
//                         </div>
//                     </div>

//                     <div className="col-12 col-sm-2 mt-2">
//                         <div className="form-group">
//                         <label>Store/Branch</label>
//                         <input type="text" className="form-control" name="store" placeholder="Store/Branch" value={this.state.searchStore}
//                                 onChange={(e) => this.setState({ searchStore: e.target.value })} />
//                         </div>
//                     </div>
//                      */}
//                      <div className="col-12 col-sm-2 mt-2">
//                         <div className="form-group">
//                         <label>Search</label>
//                         <input type="text" className="form-control" name="store" placeholder="Search Name / Emp ID" value={this.state.searchStore}
//                                 onChange={(e) => this.setState({ searchStore: e.target.value })} />
//                         </div>
//                     </div>
//                     <div className="col-12 scaling-center scaling-mb col-sm-6 pt-4 mt-2 p-l-0">
//                         <button className="btn-unic-search m-r-2"  name="search" onClick={this.searchUser}>Search </button>
//                         {/* <button className="btn-clear m-r-2" name="clear" onClick={()=>{this.getUsers(0); this.setState({ pageNumber: 0 });}}>Clear </button> */}
//                         <button className={"btn-unic-search active  "}  name="createuser"   onClick={this.showCreateUser}><i className="icon-create_customer"></i> Create Super Admin </button>
//                     </div>

//                     {/* <div className="col-6 text-right mb-1">
//                         <button type="button" className="btn-nobdr" onClick={this.showCreateUser}>
//                             <i className="icon-create_customer mr-1"></i> Create User</button>
//                     </div> */}
//                 </div>
//                 <div>
//                     {this.getUserTable()}
//                 </div>

//             </div>
//         )
//     }
// }

export default CaptainDashboard;