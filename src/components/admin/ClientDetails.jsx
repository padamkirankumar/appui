import React, { Component } from 'react';
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import close from '../../assets/images/cross.svg';
import edit from '../../assets/images/edit.svg';
import ReactPageNation from "../../commonUtils/Pagination";
import URMService from '../../services/URM/URMService';
import view from "../../assets/images/view.svg";
import LoginService from "../../services/LoginService";
import ecommerce from "../../assets/images/ecommerce.svg";
import { formatDate } from "../../commonUtils/FormatDate";


class ClientDetails extends Component {
    constructor(props){
        super(props);
        this.state={
            name:"",
            isClient:false,
            clientData:[],
            clientId:"",
            planId:"",
            storeList:[],
            storeName:"",
            mobile: "",
            description:"",
            clientName:"",
            planDetails:"",
            address: "",
            planName: "",
            organisation: "",
            email: "",
            fromDate:"",
            toDate:"",
            showModal:false,
            selectOptionPlan: [
                {
                  name: "SELECT PLAN",
                  id:"SELECT PLAN",
                },
                {
                  name: "Basic",
                  id: "Basic",
                },
                {
                  name: "Standard",
                  id: "Standard",
                },
                {
                  name: "Premium",
                  id: "Premium",
                },
               
              ],
              selectOptionTenure: [
                {
                  name: "PLAN TENURE",
                  id: "PLAN TENURE",
                },
                {
                  name: "OneMonth",
                  id: "OneMonth",
                },
                {
                  name: "ThreeMonths",
                  id: "ThreeMonths",
                },
                {
                  name: "SixMonths",
                  id: "SixMonths",
                },
                {
                  name: "OneYear",
                  id: "OneYear",
                },
              ],
            toDate:"",
        clientstatus: [
                { value: true, label: 'Active' },
                { value:  false, label: 'Inactive' },
            ],
             status: true,
            pageNumber:0,
            totalPages:0,
            selectedClient: null,
            clientStoreList : [],
            listClientid:'',
            clientStorepop : false,
            updatePlan : false,
            changePlan : false,
            payButton : false,
            amount :"",
            id:"",
            name:'',
            organizationName:'',
            createdDate:'',
            lastModifiedDate:'',
            createdBy:'',
            isEsSlipEnabled:'',
            isTaxIncluded:'',
            allPlanDetails:'',
            getPlnId:'',
            planTenureDetails:[]
        };
      
        this.getAllClients=this.getAllClients.bind(this);
        this.getAllStoreList=this.getAllStoreList.bind(this);
        this.handleStoreChange=this.handleStoreChange.bind(this);
        this.getClientSearch=this.getClientSearch.bind(this);
        this.saveClient=this.saveClient.bind(this);
        this.handlePlanChange = this.handlePlanChange.bind(this);
        this.getClientStores = this.getClientStores.bind(this);
        this.clientStoreList = this.clientStoreList.bind(this);
        this.updateClientPln = this.updateClientPln.bind(this);
        




    }

handleStoreChange=(e)=>{
this.setState({clientName:e.target.value})
}

handlePlanChange(e) {
    if (e.target.value != "SELECT PLAN") {
      this.setState({
        planName: e.target.value,
      });
    }
  }



  handleSelect(e) {
    if (e.target.value != "PLAN TENURE") {
      this.setState({
        planTenure: e.target.value,
      });
    }
  }



    componentWillMount() {
       const user = JSON.parse(sessionStorage.getItem("user"));
        this.setState({
          selectedStoreId: JSON.parse(sessionStorage.getItem("storeId")),
        });

        
      
    

        if (user["custom:isSuperAdmin"] === "true") {
            this.setState(
                {
                    clientId: user["custom:clientId1"],loggedUserId: user["custom:userId"]
                  },
                () => {
                this.getAllClients();
                // this.getAllStoreList();

                }
              );
            } else {
              this.setState(
                {
                    clientId: user["custom:clientId1"],loggedUserId: user["custom:userId"]
                  },
                () => {
                 this.getAllClients();
                //  this.getAllStoreList();
                }
              );
            }
        }

        
    editClient(items) {           
    this.setState({
        showModal: true,
        id :items.id,
        name:items.name,
        selectedClient: items,
        amount: items.items,
        clientName: this.state.clientName,
        isEdit: true,
        organisation: items.organizationName,
        planName:items.planName,
        planId:items.planId,
        email: items.email,	
        mobile: items.mobile,
        name: items.name,
        address: items.address ,
       // role: items.role,
        description: items.description,
        selectPlan: items.planDetails,
        planTenure: items.planTenure,
        status:items.active,
        createdDate:items.createdDate,
        lastModifiedDate:items.lastModifiedDate,
        createdBy:items.createdBy,
        isEsSlipEnabled:items.isEsSlipEnabled,
        isTaxIncluded:items.isTaxIncluded
    });
}
updateClientPln(rayzorPayPaymentId, amount) {
  const obj ={
    id : this.state.id,
    name :this.state.name,
    organizationName :this.state.organisation,
    address:this.state.address,
    createdDate :this.state.createdDate,
    lastModifiedDate:this.state.lastModifiedDate,
    mobile :this.state.mobile,
    email:this.state.email,
    createdBy:this.state.createdBy,
    isEsSlipEnabled:this.state.isEsSlipEnabled,
    isTaxIncluded:this.state.isTaxIncluded,
    planName:this.state.planName,
    // planId:this.state.getPlnId,
    planId:this.state.planId,
    description:this.state.description,
    planTenure:this.state.planTenure,
    rayzorPayPaymentId,
    amount,
    plandetails:this.state.allPlanDetails,
    active:true,
   

  }
  URMService.updatePlan(obj).then((res)=>{
    this.setState({showModal:false , payButton :false ,updatePlan :false ,changePlan:false},()=>{
    this.getAllClients();
    // this.cancelPlanes();
     } )
     toast.success(res.data.result);
    
             
  })
}

hideClient=(e) =>{
    this.setState({ showModal: false});
}
getClientStores(id){
  let clientId = id
  URMService.getClientStores(clientId).then((res)=>{
    if(res){
      this.setState({clientStoreList : res.data})
      // const flatMap = this.state.clientStoreList.flatMap(name =>  name ); 
      // this.setState({clientStoreList : flatMap})
      
    
    }
  })
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


toggle = () => {
  this.setState({
      showModal: false , payButton :false ,updatePlan :false ,changePlan:false
    
  });
}

clear= ()=> {
  this.setState({ 
    clientData:[],
    clientName: "",
    fromDate: "",
    toDate: "" ,
}, () => this.getAllClients());
  
}

getClientSearch(){
const obj={
    clientName:this.state.clientName?this.state.clientName:null,
    fromDate:this.state.fromDate?this.state.fromDate:null,
    toDate:this.state.toDate?this.state.toDate:null
}
if(obj.clientName !== null && obj.clientName.length >=3){
    URMService.getClientSearch(obj).then((res)=>{
    // console.log(res.data.result)
    if(res.data.result){
        this.state.clientData=res?.data?.result;
        this.setState({ 
            clientData:this.state.clientData,
            totalPages:res?.data?.result?.totalPages
        });
     }
   
});
} else if(obj.fromDate!==null && obj.toDate!==0){
  URMService.getClientSearch(obj).then((res)=>{
    // console.log(res.data.result)
    if(res.data.result){
        this.state.clientData=res?.data?.result;
        this.setState({ 
            clientData:this.state.clientData,
            totalPages:res?.data?.result?.totalPages
        });
     }
   
});

}
else
  {
    toast.error("Please Enter Atleast 3 Letters");

}
}


saveClient() {
    const { selectedClient} = this.state;
    let saveObj;
    if (this.state.isEdit) {
        let plandetails = {};

        if(selectedClient.plandetails) {
            plandetails.id = selectedClient.plandetails.id;
            plandetails.planName = selectedClient.plandetails.planName;
            plandetails.description = selectedClient.plandetails.description;
            plandetails.maxUsers = selectedClient.plandetails.maxUsers
        }
        saveObj = {
            showModal: true,
            isEdit: true,
                   "planName":this.state.planName,
                    "id": selectedClient.id,
                    "email":this.state.email,	
                    "mobile":this.state.mobile,
                    "name":this.state.name,
                    "organizationName":this.state.organisation,
                    "address": this.state.address,
                    "isEsSlipEnabled": true,
                    "description": this.state.description,
                    "plandetails": plandetails,
                    "planTenure": this.state.planTenure,
                    "isTaxIncluded": true,
                    "planId":this.state.planId,
                    "createdBy" : this.state.loggedUserId,
                    "isActive": true
                }

        URMService.editClient(saveObj).then((response) =>{
            if (response) {
                toast.success(response.data.result); 
                this.hideClient();
                }
               

            });
            
    }
     else {
        saveObj = {
            showModal: true,
            isEdit: true,
            "planName":this.state.planName,
                    "id": this.state.userId,
                    "email":this.state.email,	
                    "mobile":this.state.mobile,
                    "name":this.state.name,
                    "organizationName":this.state.organizationName,
                    "address": this.state.address,        
                    "stores": this.state.storeName,
                    "planId":this.state.planId,
                    "clientId": this.state.clientId,
                    "description": this.state.description,
                    "planDetails": this.state.planDetails,
                    "isEsSlipEnabled": true,
                    "isTaxIncluded": true,
                    "createdBy" : this.state.loggedUserId,
                    "isActive": this.state.status
                }
            }

        }

getAllClients(pageNumber){
    // const obj={
    //     name:this.state.name
    // }

    URMService.getAllClients(pageNumber).then((response)=>{
        if(response){
         

         
           
            this.setState({
                clientData:response?.data?.result,
                totalPages:response?.data?.result?.totalPages
               });
              //  this.state.clientData.content[0].active= false
               
        }
        

    });

}


changePage(pageNumber){
    let pageNo=pageNumber+1;
this.setState({pageNumber:pageNo});
this.getAllClients(pageNumber);
}

clientStorePop = (id) =>{
  let selectId = id;
  this.setState({listClientid : id , clientStorepop : true} ,()=>{
    this.getClientStores(selectId);
  })

}
hideClient = () =>{
  this.setState({ clientStorepop : false})

}
handleStatus = (e) => {
  this.setState({
      status: e.target.value
  })
 }

rePay = (items) =>
{
  this.setState({updatePlan : true ,showModal :true});
  this.setState({
    showModal: true,
    id :items.id,
    name:items.name,
    selectedClient: items,
    amount: items.items,
    clientName: this.state.clientName,
    isEdit: true,
    organisation: items.organizationName,
    planName:items.planName,
    planId:items.planId,
    email: items.email,	
    mobile: items.mobile,
    name: items.name,
    address: items.address ,
   // role: items.role,
    description: items.description,
    selectPlan: items.planDetails,
    planTenure: items.planTenure,
    status:items.active,
    createdDate:items.createdDate,
    lastModifiedDate:items.lastModifiedDate,
    createdBy:items.createdBy,
    isEsSlipEnabled:items.isEsSlipEnabled,
    isTaxIncluded:items.isTaxIncluded
  })

}
changePlans = (e) =>{
  this.setState({
    changePlan:true,
    updatePlan : false,
    payButton : true
  })
}           
 
cancelPlanes = (e) => {
  this.setState({
    updatePlan : true,
    payButton : false,
    changePlan:false,
  })
}

pay = () => {
  console.log("planName",this.state.planName,this.state.planTenure)
  LoginService.getPlanDetailsByTenure(this.state.planName,this.state.planTenure).then((res) => {
    let amount = res.data.result.tenureDetails.filter((item) => item.planTenure === this.state.planTenure);
    console.log("+planName+++planTenure+",res.data);
  
    this.setState({allPlanDetails : res.data.result ,planId :res.data.result.planId})
    console.log("planId",this.state.planId)
    this.setState({
       price: amount[0].amount
     }, () => {
   const self = this;
   const reqObj = {
     amount: this.state.price,
   };
   URMService.clientOrder(reqObj).then((res) => {
    const options = {
      // process.env.RAZORPAY_KEY_ID
      key: "rzp_test_z8jVsg0bBgLQer",
      currency: "INR",
      amount: 2000,
      name: "OTSI",
      description: "Transaction",
      image: ecommerce,
      order_id: res.data.result.razorPayId,
      handler: function (response) {
        toast.success("Payment Done Successfully");
        self.updateClientPln(
          response.razorpay_payment_id,
          self.state.price
        );
       
      },
      prefill: {
        name: "Kadali",
        email: "kadali@gmail.com",
        contact: "9999999999",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  });
   })
   })
}
        
renderTableData(){
    return this.state?.clientData?.content?.map((items,index)=>{
      let activatedDate = formatDate(items.planActivatedDate);
      let expiryDate = formatDate(items.planExpiryDate);
      let createdDate = formatDate(items.createdDate)
        const {id,name,organizationName,planName,description,planActivatedDate,planExpiryDate}=items;
        return(
            <tr className="m-0 p-0" key={index}>
                            <td className="col-1">{index+1}</td>
                            <td className="col-1">{name}</td>
                            <td className="col-2">{organizationName}</td>
                            <td className="col-1">{planName}</td>
                            <td className="col-1">{createdDate.substring(0,10)}</td>
                            <td className="col-2">{activatedDate.substring(0,10)}</td>
                            <td className="col-2">{expiryDate.substring(0,10)}</td>
                            {/* <td className="col-1">{description}</td> */}
                            <td className="col-2">
                            <img src={edit} className="w-12 m-r-3 pb-2" onClick={(e) => this.editClient(items)} name="image" />
                            {/* <i className="icon-delete"></i> */}
                            {/* <img src={view}  onClick={() => this.clientStorePop(items.id)} className="w-12 pb-2 m-r-2" /> */}
                            <img src={view}  onClick={() => this.clientStorePop(items.id)} className="w-12 pb-2 m-r-3" />
                            <button className={ "btn btn-sm active fs-12"}  onClick={(e) =>this.rePay(items)}>
                                    {items.active && (
                                      <span>Update Plan</span>
                                    )}  
                                    {!items.active && (
                                      <span>Renewal Plan</span>
                                    )}  
                            </button> 
                            </td>
                    
                        </tr> 
        )
     });

}
clientStoreList(){
  if (this.state.clientStoreList) {
    return this.state.clientStoreList.map((items, index) => {
      const { name } = items;
      return (
        <tr key={index}>
          <td className="col-2 geeks">
            {index + 1}
          </td>
          <td className="col-3">
                     {
                      <div key={index}>{items.name}</div>
                     }
                    </td>
        </tr>
      );
    });
  }
}

    render() {
        return (
            <div className="maincontent">
            <div className="row">
              {/* <Modal isOpen={this.state.changePlan} size="lg">
              <ModalHeader>
                Change Plan Details
                </ModalHeader>
                <ModalBody className="pt-4">
            <div className="row mb-3">
              <div className="col-3">
                <div className="">
                  <label>Stores : </label>{" "}
                </div>
              </div>
            </div> */}
            {/* <div className="table-responsive"> */}
            {/* <div className="row mb-3">
            <div className="table-responsive">
        <table className="table table-borderless mb-1">
          <thead>
            <tr className="m-0 p-0">
            <th className="col-2">S.No</th>
              <th className="col-3">Stores</th> 
            </tr>
          </thead>
          <tbody>
          {this.clientStoreList()}
          </tbody>
        </table>
      </div>
            </div> */}
          
              <Modal isOpen={this.state.clientStorepop} size="lg">
              <ModalHeader>
                Client Stores
                </ModalHeader>
                
                <ModalBody className="pt-4">
            <div className="row mb-3">
              <div className="col-3">
                <div className="">
                  <label>Stores : </label>{" "}
                </div>
              </div>
            </div>
            {/* <div className="table-responsive"> */}
            <div className="row mb-3">
            <div className="table-responsive">
        <table className="table table-borderless mb-1">
          <thead>
            <tr className="m-0 p-0">
            <th className="col-2">S.No</th>
              <th className="col-3">Stores</th> 
            </tr>
          </thead>
          <tbody>
          {this.clientStoreList()}
          </tbody>
        </table>
      </div>
            </div>
          </ModalBody>
          <ModalFooter>
                        <button className="btn-unic" onClick={this.hideClient} name="cancel">Close</button>
                    </ModalFooter>

              </Modal>

               <Modal isOpen={this.state.showModal} size="lg">
                    <ModalHeader>
                        {
                            this.state.isEdit && !this.state.updatePlan && !this.state.payButton && (
                                <div>
                                Edit ClientDetails
                                <button type='button' onClick={() =>this.toggle()} className='btn search modal-close text-right'> <img src={close}></img></button> 

                                    </div>
                               
                            )
                        }
                        {
                            (this.state.updatePlan || this.state.payButton) && (
                                <div>
                                Update Plan Client Details
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
                                            value={this.state.name} 
                                            onChange={(e) => this.setState({ name: e.target.value })}
                                            autoComplete="off" />
                                             <div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 scaling-mb">
                                    <div className="form-group">
                                    <label>Organisation <span className="text-red font-bold" name="bold">*</span></label>
                                        <input type="text" className="form-control" name="organisation"placeholder="Enter organisation"
                                            value={this.state.organisation}
                                            disabled={this.state.isEdit}
                                            onChange={(e) => this.setState({ dob: e.target.value })}
                                            autoComplete="off"
                                            />

                                    </div>
                                </div>
                               
                                <div className="col-12 col-sm-4 scaling-mb">
                                    <div className="form-group">
                                        <label>Mobile <span className="text-red font-bold">*</span></label>
                                        <input type="text" className="form-control" placeholder="mobile" name="number"
                                            value={this.state.mobile} 
                                            disabled={this.state.isEdit}
                                            onChange={this.validation}
                                            autoComplete="off" />
                                             <div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 mt-3">
                                    <div className="form-group">
                                        <label>Email <span className="text-red font-bold">*</span></label>
                                        <input type="email" className="form-control" placeholder="sample@gmail.com" name="email"
                                            value={this.state.email} disabled={this.state.isEdit}
                                            // onChange={this.emailValidation}
                                            autoComplete="off" />
                                             <div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 mt-3">
                        <div className="form-group">
                          <label>
                            Select Plan
                          </label>
                          <select
                            className="form-control"
                            placeholder="Select Division"
                            value={this.state.planName}

                            onChange={(e) => {
                              this.handlePlanChange(e);
                            }}
                            disabled={this.state.isEdit &&!this.state.changePlan}
                          >
                           
                             {this.state.selectOptionPlan.map((i) => {
                              return (
                                <option key={i.id} value={i.id}>
                                  {i.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 mt-3">
                        <div className="form-group">
                          <label>
                            Select Plan Tenure
                            {/* <span className="text-red font-bold">*</span> */}
                          </label>
                          <select
                            className="form-control"
                            placeholder="Select Division"
                            value={this.state.planTenure}
                            onChange={(e) => {
                              this.handleSelect(e);
                            }}
                            disabled={this.state.isEdit &&!this.state.changePlan}
                          >
                            {this.state.selectOptionTenure.map((i) => {
                              return (
                                <option key={i.id} value={i.id}>
                                  {i.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                                <div className="col-12 col-sm-4 scaling-mb mt-3">
                                    <div className="form-group">
                                        <label>Address</label>
                                        <input type="text" className="form-control" placeholder="Enter Address" name="adress"
                                            value={this.state.address}
                                            disabled={this.state.isEdit}
                                            onChange={(e) => this.setState({ address: e.target.value })}
                                            autoComplete="off" />
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 scaling-mb mt-3">
                                    <div className="form-group">
                                        <label>Description</label>
                                        <input type="text" className="form-control" placeholder="Enter Description" name="Description"
                                            value={this.state.description}
                                            disabled={this.state.isEdit}
                                            onChange={(e) => this.setState({ address: e.target.value })}
                                            autoComplete="off" />
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 scaling-mb mt-3">
                                    <div className="form-group">
                                        <label>Status <span className="text-red font-bold">*</span></label>
                                            <select value={this.state.status} disable={this.state.updatePlan || this.state.payButton} onChange={(e) =>  this.handleStatus(e)} className="form-control">
                                                
                                                <option>Select Status</option>
                                                { 
                                                this.state.clientstatus &&
                                                this.state.clientstatus.map((item, i) => 
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
                        {/* <div className="col-12 col-sm-4 scaling-mb mt-3">
                                    <div className="form-group"></div>
                                    <button className="btn-unic" onClick={this.changePlans} name="cancel">Change Plans</button>
                                    </div> */}
                        
                      
                                                       
                        </ModalBody>
                 { this.state.isEdit && !this.state.updatePlan && !this.state.payButton && <ModalFooter>
                        <button className="btn-unic" onClick={this.hideClient} name="cancel">Cancel</button>
                        <button className="btn-unic active fs-12" onClick={this.saveClient} name="save">Save</button>
                    </ModalFooter>
    }
     { this.state.updatePlan &&   <ModalFooter>
                        <button className="btn-unic" onClick={this.changePlans} name="cancel">Change Plans</button>
                        {/* <button className="btn-unic active fs-12" onClick={this.saveClient} name="save">Save</button> */}
                    </ModalFooter>
    }
    {
      this.state.payButton
      &&   <ModalFooter>
                        <button className="btn-unic" onClick={this.cancelPlanes} name="cancel">Cancel</button>
                        <button className="btn-unic active fs-12" onClick={this.pay} name="cancel">pay</button>
                        
                    </ModalFooter>
    }
                </Modal>
                
                     <div className=" col-2">
                   <div className="form-group">
                   <label>
                    Client Name 
                    </label>
                    <input type="text" 
                     className="form-control"
                      placeholder="Enter Client Name"
                      value={this.state.clientName}
                    onChange= {this.handleStoreChange}
                    />
                     {/* <select className="form-control">
                     <option>Select Category</option>
                       </select> */}
                     {/* <select
                     className="form-control"
                     placeholder="Select Category"
                     onChange={this.handleStoreChange}
                      value={this.state.store}
                    //   disabled={this.state.isEdit}
                     >
                      <option >
                        Select
                      </option>
                      {this.state.storeList.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.value}
                      </option>
                       ))}
                      </select>
                    {/* {this.state.textileFieldsErr && !this.state.category
                     ? this.errorDiv("categoryErr")
                     : null} */} 
                   </div>
                  </div>


                    <div className="col-2">
                        <div className="form-group">
                        <label>From Date</label>
                            <input 
                            type="date" 
                            className="form-control"
                           value={this.state.fromDate}
                           onChange={(e)=>this.setState({fromDate:e.target.value})}
                            />
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

                    <div className="col-12 scaling-center scaling-mb col-sm-6 pt-3 mt-2 p-l-0">
                        <button 
                        className="btn-unic-search active m-r-2"
                         name="search" 
                         onClick={()=>{this.getClientSearch()}}>
                            Search 
                            </button>
                            <button className="btn-unic-search active m-r-2" onClick={() => {this.clear() }}>Clear </button>
                      

                        </div>
           
             </div>

        <div className="col-sm-12 col-12 scaling-center scaling-mb mt-3">
                    <h5 className='fs-18'>List Of Clients</h5>
                </div>
                <div className="table-responsive p-0">
                <table className="table table-borderless mb-1 mt-2">
                    <thead>
                        <tr className="m-0 p-0">
                            <th className="col-1">S.NO </th>
                            <th className="col-1">CLIENT NAME</th>
                            <th className="col-2">BUSINESS NAME</th>
                            <th className="col-1">PLAN</th>
                            <th className="col-1">Created DATE</th>
                            <th className="col-2">ACTIVATION DATE</th>
                            <th className="col-2">EXPIRY DATE</th>
                            {/* <th className="col-1">DESCRIPTION</th> */}
                            <th className="col-2"></th>
                            {/* <th className="col-1"></th> */}
                        </tr>
                    </thead>
                     <tbody>{this.renderTableData()}</tbody>
                </table>
                <div className="row m-0 pb-3 mb-5 mt-3">

                {this.state.totalPages > 1 ? (
                <div className="d-flex justify-content-center">
                 <ReactPageNation
                  {...this.state.clientData}
                  changePage={(pageNumber) => {
                    this.changePage(pageNumber);
                    }}
                   />
                  </div>
                ):null}
                </div>
                


                </div>
        </div>
        
    );}
}

export default ClientDetails;