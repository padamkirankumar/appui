
import Multiselect from 'multiselect-react-dropdown';
import React, { Component } from 'react';
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import close from '../../assets/images/cross.svg';
import edit from '../../assets/images/edit.svg';
import { debounce } from '../../commonUtils/FunctionUtils';
import ReactPageNation from "../../commonUtils/Pagination";
import URMService from '../../services/URM/URMService';
import { formatDate } from "../../commonUtils/FormatDate";


export default class ClientMapping extends Component {

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
            clientName:"",
            supporterName:"",
            // role: "config_user",
             role: "client_support",
            
            // role: "",
            clientsList:[],
            supportersList:[],
            client:"",
            clientId:"",
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
            loggedUserId:"",
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
            selectedOption: [],
            selectedOptionVal: [],
            createdBy:"",
            modifiedBy:"",
            clientIdList:"",
            domainId:"",
            clientIdData:[],
            sortedStoreIds :[],
            sortedUserIds :[],
            userIdList:"",
            enable:true,
            storeNames:"",
            fromDate:"",
            toDate:"",
            storeList:[],
            store:"",
            mappingData:[],
            selectedClient: '',
            isSupportEdited: '',
            isClientEdited: '',
            clientData: [],
            clientTotalPages: '',
            supportersData: [],
            supportrsTotalPages: '',
            selectedSupport:'',
            isClientSearch: false,
            isSupporterSearch: false
        
        }
        this.setState({usersList: []})
    //    this.getDomainsList = this.getDomainsList.bind(this);
        this.getAllClients=this.getAllClients.bind(this);
        this.getClientSupporters=this.getClientSupporters.bind(this);
        this.showCreateUser = this.showCreateUser.bind(this);
        this.hideCreateUser = this.hideCreateUser.bind(this);
        // this.handleClients=this.handleClients.bind(this);
        this.addClient=this.addClient.bind(this);
        this.getClientMappingDetails=this.getClientMappingDetails.bind(this);
        this.getAllStoreList=this.getAllStoreList.bind(this);
        this.handleStoreChange=this.handleStoreChange.bind(this);
        this.handleStoreChange1=this.handleStoreChange1.bind(this);
        this.searchClientMapping=this.searchClientMapping.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.debouncedFetch = debounce(this.fetchData, 1000);
        this.debouncedFetchSupporters = debounce(this.fetchSupporterrsData, 1000);
    }

    handleStoreChange=(e)=>{
        this.setState({clientName:e.target.value})
       
        }
        handleStoreChange1=(e)=>{
            this.setState({supporterName:e.target.value})
           
            }
    // handleChange = (e) => {
    //     this.setState({ client: e.target.value });
    //   };


    handleChange = selectedOption => {  
        // this.setState({selectedOption});
        let selectedSupporters = [];
        let obj={};
        this.state.sortedClientIds = [];
         selectedOption.forEach((ele, index) => {
        obj = {
          id: ele.id,
        };
         this.state.sortedClientIds.push(obj);
        });
          if(this.state.selectedOptionVal.length > 0) {
            selectedSupporters = this.state.selectedOptionVal.map((itm) => {
            let obj = {};
            obj.id = itm.id;
            return obj;
            });
          }
        this.setState({
            clientIdList:this.state.sortedClientIds,
            userIdList: selectedSupporters,
            selectedOption
        });
       
      }
      handleSearch = selectedOption => {
        const obj={
          clientName: selectedOption 
        }
        this.debouncedFetch(obj);
      }
      
      clear= ()=> {
        this.setState({ 
        mappingData:[],
          clientName: "",
          supporterName:"",
          fromDate: "",
          toDate: "" ,
      }, () => {
          this.getAllClients(0);
          this.getClientSupporters(0);
        })
        
      }
      
    fetchData(input) {        
        if (input !== '') { 
            URMService.searchClientMapping(input).then((response)=>{
                if (response && response.data.result) {                   
                    let result = response.data.result.content.map((item) => {
                        let obj = {};                      
                        obj.id = item.clientId;
                        obj.value = item.clientName;
                        obj.label = item.clientName;                        
                        return obj;
                    });
                    this.setState({
                        clientsList: result
                    });
                }
            });      
        }
    }

    handleSearch = selectedOption => {
        const obj={
          clientName: selectedOption 
        }
        this.debouncedFetch(obj);
      }

    getUniqueListBy(arr, key) {
        return [...new Map(arr.map(item => [item[key], item])).values()]
    }

    fetchSupporterrsData(input) {        
        if (input !== '') { 
            URMService.getClientSupportersData(this.state.role ? this.state.role : null, 0 ,input).then((response) => {
                response?.data?.result?.content.forEach((ele, index) => {
                    const obj = {
                    id: ele.id,
                    value: ele.userName,
                    label: ele.userName,
                    };
                                        
                  this.setState({
                    supportersList: this.getUniqueListBy([...this.state.supportersList, obj], 'label')
                  })
                });
            });  
        }
    }
    handleSearchSupporters = selectedOptionVal => {
        const obj={
            clientName:this.state.clientName?this.state.clientName:null,
            supporterName:this.state.supporterName?this.state.supporterName:null,
            fromDate:this.state.fromDate?this.state.fromDate:"",
            toDate:this.state.toDate?this.state.toDate:"",           
        }
        this.debouncedFetchSupporters(obj);
    }
      handleSupporters = selectedOptionVal => {
        // this.setState({selectedOptionVal});
        let selectedOptionList = [];
        let obj={};
        this.state.sortedUserIds = [];
        selectedOptionVal.forEach((ele, index) => {
            obj = {
              id: ele.id,
            };
            this.state.sortedUserIds.push(obj);
        });
        if(this.state.selectedOption.length > 0) {
            selectedOptionList = this.state.selectedOption.map((itm) => {
            let obj = {};
            obj.id = itm.id;
            return obj;
            });
          }
    
       this.setState({ 
        userIdList:this.state.sortedUserIds,
        clientIdList: selectedOptionList,
        selectedOptionVal
        })
           
    };

    

    showCreateUser() {
        this.setState({ showModal: true,selectedOption:"",selectedOptionVal:"",clientIdList:"",userIdList:""}, () => {
            this.getAllClients(0);
        });
    }

    hideCreateUser() {
        this.setState({ showModal: false, selectedClient: '', isSupportEdited: '', isEdit: false, selectedSupport: ''});
    }

    getAllClients(pageNumber) {
        this.setState({clientsList: []})
        URMService.getAllClients(pageNumber).then((response) => {
          response?.data?.result?.content.forEach((ele, index) => {
            const obj = {
              id: ele.id,
              value: ele.name,
              label: ele.name,
            };   
            this.state.clientsList.push(obj);        
            this.setState({
                clientData: response?.data?.result,
                clientTotalPages: response?.data?.result?.totalPages
               });
          });
         
         });
    }


      getClientSupporters(pageNumber) {
        const obj={
            clientName:this.state.clientName?this.state.clientName:null,
            supporterName:this.state.supporterName?this.state.supporterName:null,
            fromDate:this.state.fromDate?this.state.fromDate:"",
            toDate:this.state.toDate?this.state.toDate:"",
           
        }
        this.setState({supportersList: []})
        URMService.getClientSupporters(this.state.role?this.state.role:null,pageNumber,obj).then((response) => {
          response?.data?.result?.content.forEach((ele, index) => {
            const obj = {
              id: ele.id,
              value: ele.userName,
              label: ele.userName,
            };
            this.state.supportersList.push(obj);
            this.setState({
                supportersData: response?.data?.result,
                supportrsTotalPages: response?.data?.result?.totalPages
            });
          });
        });             
      }
      toggle = () => {
        this.setState({
            showModal: false,
          
        });
      }
      addClient(){ 
            const {  selectedOption, selectedOptionVal} = this.state;
            let userIds;
            let clientsIds; 
            if(selectedOptionVal.length > 0 && selectedOption.length > 0){
            if(selectedOptionVal.length > 0){
            userIds = selectedOptionVal.map((ele, index) => {
                let obj = {};
                obj.id = ele.id;
                return obj;
            });
            }
            if(selectedOption.length > 0){
            clientsIds = selectedOption.map((ele, index) => {
                let obj = {};
                obj.id = ele.id;
                return obj;
            });
            }
        const obj={
            createdBy:this.state.loggedUserId,
            modifiedBy:this.state.loggedUserId,
            clientIds: clientsIds,
            userIds: userIds
            }
            URMService.addClient(obj).then((response)=>{
                if(response?.data?.result){
                toast.success(response?.data?.result);
                this.hideCreateUser();
                }else {
                    toast.error(response?.data?.message);
                }
            });
    } else {
        toast.error("please select clients and supporters");
    }
}
  
  

    componentDidMount() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        this.setState({userName : user["cognito:username"], isEdit: false,loggedUserId: user["custom:userId"]});
        if(user) {
            this.setState({ clientId: user["custom:clientId1"],
            isConfigUser: user['custom:isConfigUser'],
            domainId: user["custom:domianId1"] }, () =>
             {
                // this.getDomainsList();
             this.getAllClients(0);
             this.getClientSupporters(0);
             // this.getClientMappingDetails();
            //  this.getAllStoreList();
            });
            this.setState({ domainId: user["custom:domianId1"] })
            }
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

searchClientMapping(){
    const obj={
        clientName:this.state.clientName?this.state.clientName:null,
        supporterName:this.state.supporterName?this.state.supporterName:null,
        fromDate:this.state.fromDate?this.state.fromDate:null,
        toDate:this.state.toDate?this.state.toDate:null
    }
    if((obj.clientName !== null && obj.clientName.length >=3)||(obj.supporterName !== null && obj.supporterName.length >=3)||obj.fromDate==null ||obj.toDate==null){
        URMService.searchClientMapping(obj).then((res)=>{
        if(res){
            this.state.mappingData=res?.data?.result;

            this.setState({
                mappingData:this.state.mappingData,
                totalPages: res.data.result.totalPages
            });
        }
     });
    } 
    else if(obj.fromDate!==null&&obj.toDate!==null){
        URMService.searchClientMapping(obj).then((res)=>{
            if(res){
                this.state.mappingData=res?.data?.result;
    
                this.setState({
                    mappingData:this.state.mappingData,
                    totalPages: res.data.result.totalPages
                });
            }
         });
    } 
    else{
        toast.error("Please Enter Atleast 3 Letters");
       }
    } 

    getClientMappingDetails(pageNumber){
        URMService.getClientMappingDetails(pageNumber).then((res)=>{
            if(res){
                this.setState({mappingData:res?.data?.result,  totalPages: res.data.result.totalPages});
            }
        });
    }
    changePage = (pageNumber, userType) => {
        if(userType === 'client') {
            let pageNo=pageNumber+1;
            this.setState({pageNumber:pageNo});
            this.getAllClients(pageNumber);
        } else {
            let pageNo=pageNumber+1;
            this.setState({pageNumber:pageNo});
            this.getClientSupporters(pageNumber);
        }
       
    }
  

    handleClientRemove = (selectedList, removedItem)  => {
        const {selectedOption, selectedOptionVal} = this.state;
       let removedItemsList =  selectedOption.filter((itm) => itm.id ==  removedItem.id);
       let remainingItemsList =  selectedOption.filter((itm) => itm.id !==  removedItem.id);

        const deletedClientsList = removedItemsList.map((itm) => {
                let obj = {};
                obj.id = itm.id;
                return obj;
        });
        let supporter;
        if(selectedOptionVal.length > 0) {
            supporter = selectedOptionVal.map((itm) => {
                let obj = {};
                obj.id = itm.id;
                return obj;
            });
        } 
       const obj = {
            clientIds: deletedClientsList,
            userIds: supporter
        }
        this.setState({
            selectedOption: remainingItemsList
        }, () => {
            URMService.deleteMapping(obj).then((response)=>{
                if(response?.data?.result){
                 toast.success(response?.data?.result);
                }
                
            });
        })        
    } 
    handleSupportRemove = (selectedList, removedItem)  => {
    const {selectedOption, selectedOptionVal} = this.state;
    let removedItemsList =  selectedOptionVal.filter((itm) => itm.id ==  removedItem.id);
    let remainingItemsList =  selectedOptionVal.filter((itm) => itm.id !==  removedItem.id);

    const deletedSuportersList = removedItemsList.map((itm) => {
            let obj = {};
            obj.id = itm.id;
            return obj;
    });

    let client;
    if( selectedOption.length > 0) {
        client = selectedOption.map((itm) => {
            let obj = {};
            obj.id = itm.id;
            return obj;
        });
    } 
    

    const obj = {
        clientIds: client,
        userIds: deletedSuportersList
    }
    this.setState({
        selectedOptionVal: remainingItemsList
    }, () => {
        URMService.deleteMapping(obj).then((response)=>{
            if(response?.data?.result){
                toast.success(response?.data?.result);
            }
            
        });
    })    
}
changePage(pageNumber){
    let pageNo=pageNumber+1;
    this.setState({pageNumber:pageNo});
    this.getClientMappingDetails(pageNumber);
}

edit = (items, userType) => {     
       if(userType === 'client') {
        this.setState({selectedClient: items, showModal: true}, () => {
            URMService.getUsersForClient(items.id).then((res) => {
                let clientsIds = [];
                let supportersIds = [];

                let clientObj = {};
                clientObj.label = items.name;
                clientObj.value = items.name;
                clientObj.id = items.id;  
                clientsIds.push(clientObj);
                if(res.data.result) {
                    supportersIds = res.data.result.map((itm) => {
                        let obj = {};
                        obj.label = itm.userName;
                        obj.value = itm.userName;
                        obj.id = itm.id;  
                        return obj;
                    }); 
                }                   
                this.setState({
                    selectedOptionVal: supportersIds,
                    selectedOption:  clientsIds
                });
            });
        })
       } else {
        this.setState({selectedSupport: items, showModal: true}, () => {
            URMService.getClientsForUser(items.id).then((res) => {
                let clientsIds = [];
                let supportersIds = [];

                let supportObj = {};
                supportObj.label = items.userName;
                supportObj.value = items.userName;
                supportObj.id = items.id;  
                supportersIds.push(supportObj);
                if(res.data.result) {
                    clientsIds = res.data.result.map((itm) => {
                        let obj = {};
                        obj.label = itm.name;
                        obj.value = itm.name;
                        obj.id = itm.id;  
                        return obj;
                    }); 
                }                   
                this.setState({
                    selectedOptionVal: supportersIds,
                    selectedOption:  clientsIds
                });
            });
        })
       }       
   }

    renderTableData(){
      
        return this.state?.mappingData?.content?.map((items,index)=>{
            const {clientName,supporterName,email,mappingBy,createdOn}=items;
            return(
                <tr className="m-0 p-0" key={index}>
                                <td className="col-1">{index+1}</td>
                                <td className="col-2">{clientName}</td>
                                <td className="col-1">{supporterName}</td>
                                <td className="col-2">{email}</td>
                                <td className="col-1">{mappingBy}</td>
                                <td className="col-2">{createdOn}</td>
                                <td className="col-1">
                                <img src={edit} onClick= {() => this.editClient(items, 'client')} className="w-12 m-r-2 pb-2" name="image" />
                                <i className="icon-delete"></i>
                                </td>
                            </tr> 
            )
         });
    
    }

    searchClientSupport = () => {
        if(this.state.clientName && this.state.clientName !== '') {
            const obj={
                clientName: this.state.clientName ? this.state.clientName : null,
                fromDate: this.state.fromDate ? this.state.fromDate : null,
                toDate: this.state.toDate ? this.state.toDate : null
            }

            if(obj.clientName.length >= 3){
                URMService.getClientSearch(obj).then((res)=>{
                if(res.data.result?.content.length > 0){
                    this.setState({ 
                        clientData: res.data.result,
                        clientTotalPages: res?.data?.result?.totalPages
                    }, () => {
                        URMService.getUsersForClient(res?.data?.result?.content[0].id).then((data) => {                                                   
                            if(data?.data?.result) {
                                let resData = {};
                                resData.content =  data?.data?.result;
                                this.setState({
                                    supportersData: resData,
                                    isClientSearch: true,
                                    isSupporterSearch: false
                                });
                           } 
                        });
                    });
                 } else {
                    toast.error("Please provide valied client name");
                 }               
            });
        } else {
                toast.error("Please Enter Atleast 3 Letters");
            
            }
        } else {
            const obj={
                    supporterName: this.state.supporterName ? this.state.supporterName : null,
                    fromDate: this.state.fromDate ? this.state.fromDate : null,
                    toDate: this.state.toDate ? this.state.toDate : null,
                  }
    
                // if((obj.supporterName !== null && obj.supporterName.length >= 3) || obj.fromDate==null || obj.toDate==null){
                    if((obj.supporterName !== null && obj.supporterName.length >= 3)){
                    URMService.searchSupporters(this.state.role, 0 ,obj).then((res)=>{                   
                        if(res.data.result?.content.length > 0){                       
                            this.state.clientSupportData=res.data.result;
                            this.setState({
                                supportersData: res?.data?.result,
                                supportrsTotalPages: res?.data?.result?.totalPages
                            }, () => {
                                URMService.getClientsForUser(res?.data?.result?.content[0].id).then((data) => {                                                   
                                    if(data?.data?.result) {
                                        let resData = {};
                                        resData.content =  data?.data?.result;
                                        this.setState({
                                            clientData: resData,
                                            isSupporterSearch: true,
                                            isClientSearch: false
                                        });
                                   } 
                                });
                            });
                        } else {
                            toast.error('Please provide valid supporter name');
                        }  
                    });
                } else {
                toast.error("Please Enter Atleast 3 Letters");                   
                }  
        } 
    }

    render() {
        const { selectedOption } = this.state;
        const { selectedOptionVal } = this.state;
        return (
            <div className="maincontent">
               <Modal isOpen={this.state.showModal} size="lg">
                    <ModalHeader>
                        {
                            !this.state.isEdit && (
                                <div>
                                Client Mapping
                                <button type='button' onClick={() =>this.toggle()} className='btn search modal-close text-right'> <img src={close}></img></button> 

                                    </div>
                               
                            )
                        }
                        {
                            this.state.isEdit && (
                                <div>
                                Edit Client Mapping
                                <button type='button' onClick={() =>this.toggle()} className='btn search modal-close text-right'> <img src={close}></img></button> 

                                    </div>
                               
                            )
                        }
                        </ModalHeader>
                    <ModalBody>
                        <div className="p-3">
                            {/* <h5 className="fs-14 text-red scaling-center scaling-mb">User Details</h5> */}
                            <div className="row">
                           <div className="col-sm-6 col-12 mt-3">
                          <div className="form-group">
                            <label>Clients</label>
                      <Multiselect 
                        placeholder="Select Clients"
                        isMulti={true}
                        selectedValues={this.state.selectedOption}
                        displayValue="label"
                        onSelect={this.handleChange}
                        isSearchable={true}
                        onSearch={this.handleSearch}
                        disable={this.state.selectedClient}
                        options={this.state.clientsList}
                        onRemove={this.handleClientRemove}
                      />

                   </div>
                  </div> 



                  <div className="col-sm-6 col-12 mt-3">
                  <div className="form-group">
                  <label>Supporters</label>
                      <Multiselect 
                         placeholder="Select Supporters"
                         isMulti={true}
                         selectedValues={this.state.selectedOptionVal}
                         onSelect={this.handleSupporters}
                         isSearchable={true}
                         displayValue="label"
                         onSearch={this.handleSearchSupporters}
                         options={this.state.supportersList}
                         disable={this.state.selectedSupport}
                         onRemove={this.handleSupportRemove}
                        />
                         {/* { this.state.selectedOptionVal.map((option) =>
                              option.id,
                              option.label)} */}
                    </div>
                </div> 
            </div>
        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn-unic" onClick={this.hideCreateUser} name="cancel">Cancel</button>
                        <button className="btn-unic active fs-12" onClick={this.addClient} name="save">Save</button>
                    </ModalFooter>
                </Modal>
                <div className="row">
                <div className="col-sm-2 col-12">
                   <div className="form-group">
                    <label>
                    Client Name 
                    </label>
                    <input type="text" 
                     className="form-control"
                      placeholder="Enter client Name "
                      value={this.state.clientName}
                    onChange= {this.handleStoreChange}
                    />
                    </div>
                    </div>
                    <div className="col-sm-2 col-12">
                   <div className="form-group">
                    <label>
                    Supporter Name 
                    </label>
                    <input type="text" 
                     className="form-control"
                      placeholder="Enter Supporter Name"
                      value={this.state.supporterName}
                    onChange= {this.handleStoreChange1}
                    />
                    </div>
                    </div>
                 
                 {/* <div className="col-sm-2 col-12">
                        <div className="form-group">
                        <label>From Date</label>
                            <input 
                            type="date"
                             className="form-control"
                             value={this.state.fromDate}
                             onChange={(e)=>this.setState({fromDate:e.target.value})}/>
                        </div>
                    </div> */}

                    {/* <div className="col-sm-2 col-12">
                        <div className="form-group">
                        <label>To Date</label>
                            <input
                             type="date" 
                             className="form-control"
                             value={this.state.toDate}
                            //  onChange={(e)=>this.setState({toDate:e.target.value})}
                            onChange={(e)=>{
                                var startDate=new Date(this.state.fromDate);
                                var endDate=new Date(e.target.value);
                                if(startDate<=endDate){
                                    this.setState({toDate:e.target.value})
                                }else
                                    {
                                    toast.error("To Date should be greater then From date");
                                }
                            }}
                             />
                        </div>
                    </div> */}

                    {/* <div className="col-12 scaling-center scaling-mb col-sm-6 pt-4 mt-2 p-l-0"> */}
                    <div className="col-sm-4 col-12 mt-4">
                        <button 
                        className="btn-unic-search active m-r-2"  
                         name="search" 
                         onClick={()=>{this.searchClientSupport()}}>Search </button>
               <button className="btn-unic-search active m-r-2" onClick={() => {this.clear() }}>Clear </button>

                         {/* <button className="btn-unic-search active" name="createuser"  onClick={this.showCreateUser}><i className="icon-create_customer"></i> Create Client Map</button>                */}
                         </div>
                
                </div > 
                <div className='row'>
                    <div className='col-6 p-r-1'>  
                    <div className='round-card mt-3'>
                        <div className="col-sm-12 col-12 scaling-center scaling-mb">
                         <h5 className='fs-18 mb-1'>Clients</h5>
                        </div>
                        <div className="table-responsive p-0">
                            <table className="table table-borderless mb-1 mt-1">
                                <thead>
                                    <tr className="m-0 p-0">
                                        <th className="col-1">S.NO </th>
                                        <th className="col-2">CLIENT NAME</th>
                                        <th className="col-2">BUSINESS  NAME</th>
                                        <th className="col-1">PLAN</th>
                                        <th className="col-2">Created DATE</th>
                                        <th className="col-1"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state?.clientData?.content && this.state?.clientData?.content?.map((items, index) => { 
                                        let createdDate  = formatDate(items.createdDate);                           
                                        return(
                                            <tr className="m-0 p-0" key={index}>
                                            <td className="col-1">{index+1}</td>
                                            <td className="col-2">{items.name}</td>
                                            <td className="col-2">{items.organizationName}</td>
                                            <td className="col-1">{items.planName}</td>
                                            <td className="col-2">{createdDate.substring(0,10)}</td>
                                            <td className="col-1">
                                            <img disabled={this.state.isClientSearch} src={edit} className="w-12 m-r-2 pb-2"   onClick={(e) => this.edit(items, 'client')} name="image" />
                                            <i className="icon-delete"></i>
                                            </td>
                                            </tr> )
                                    })}
                                </tbody>                                 
                            </table>                            
                        </div>
                    </div>
                    <div className="row m-0 pb-3 mb-5 mt-3">
                        {this.state.clientTotalPages > 1 ? (
                            <div className="d-flex justify-content-center">
                        <ReactPageNation
                            {...this.state.clientData}
                            changePage={(pageNumber) => {
                            this.changePage(pageNumber, 'client');
                            }}
                            />
                            </div>
                        ):null}
                    </div>
                    </div>
                    <div className='col-6 p-r-1'> 
                    <div className='round-card mt-3'>
                    <div className="col-sm-12 col-12 scaling-center scaling-mb ">
                         <h5 className='fs-18 mb-1'>Supporters</h5>
                    </div>
                    <div className="table-responsive p-0">
                            <table className="table table-borderless mb-1 mt-1">
                                <thead>
                                    <tr className="m-0 p-0">
                                        <th className="col-1">S.NO </th>
                                        <th className="col-2">Name</th>
                                        <th className="col-4">EMAIL</th>
                                        <th className="col-2">CREATED BY</th>
                                        <th className="col-2">CREATED ON</th>
                                        <th className="col-1"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.supportersData.content && this.state.supportersData.content.map((items, index) => {                            
                                        return(
                                            <tr className="m-0 p-0" key={index}>
                                            <td className="col-1">{index+1}</td>
                                            <td className="col-2">{items.userName}</td>
                                            <td className="col-4">{items.email}</td>
                                            <td className="col-2">{items.createdBy}</td>
                                            <td className="col-2">{items.date}</td>
                                            <td className="col-1 p-r-0">
                                            <img src={edit} disabled={this.state.isSupporterSearch} className="w-12 m-r-2 pb-2" onClick={(e) => this.edit(items, 'support')}  name="image" />
                                            <i className="icon-delete"></i>
                                            </td>
                                            </tr> )
                                    })}
                                </tbody>                    
                            </table>                
                        </div>
                      
                    </div>
                    <div className="row m-0 mt-3">
                        {this.state.supportrsTotalPages > 1 ? (
                            <div className="d-flex justify-content-center">
                        <ReactPageNation
                            {...this.state.supportersData}
                            changePage={(pageNumber) => {
                            this.changePage(pageNumber, 'support');
                            }}
                            />
                            </div>
                        ):null}
                    </div>
                    </div>
                    </div>
            </div>
            
        )
    }
}
