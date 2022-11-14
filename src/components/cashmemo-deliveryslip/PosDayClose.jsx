import moment from "moment";
import React, { Component } from 'react';
import Select from "react-select";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import close from '../../assets/images/cross.svg';
import confirm from '../../assets/images/conformation.svg';
import error from '../../assets/images/error.svg';
import eventBus from '../../commonUtils/eventBus';
import { formatDate } from "../../commonUtils/FormatDate";
import CreateDeliveryService from '../../services/CreateDeliveryService';
export default class PosDayClose extends Component {

  constructor(props){
    super(props);
    this.state  = {
      isCloseDay: false,
      mobileData: {
        dsNumber:"",
        mrp:"",
        dsId:"",
        salesMan:"",
        toDay: moment(new Date()).format("YYYY-MM-DD").toString(),
        dayCloserList: [],
        closerDayList: [],
        storeId:"",
        length:"",
        enableButton:false,
        isDates:false,
        dateClose:false,
        dayCloseDates: [],
        applicability:"",
        dayClose:"",
        date:"",
        daycheckCloseDates:[],
        selectedDate:"",
        isEnabeldDayCloser:false,
        indexDate : "",
        datesDay:[],
        isdayCloser:false,
        ystDayCloser:false,
        toadayValue:'',
        toadaydeskValue:'',
        penlitydeskValue:0

        

      }
    };
    

        this.closeDay = this.closeDay.bind(this);
        this.getAllDayCloser = this.getAllDayCloser.bind(this);
        this.closeDayCloser = this.closeDayCloser.bind(this);
        this.getDayCloserTable = this.getDayCloserTable.bind(this);
        this.pendingDayCloserTable = this.pendingDayCloserTable.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.getdayclosure=this.getdayclosure.bind(this);
        this.saveDayCloser = this.saveDayCloser.bind(this);
        this.getallPendingDate =this.getallPendingDate.bind(this);
        this.deleteEstimationSlip = this.deleteEstimationSlip.bind(this);
        this.hidedayModel = this.hidedayModel.bind(this);
        this.getPendingDeliverySlips  = this.getPendingDeliverySlips.bind(this);
        this.closePendingDeliverySlips = this.closePendingDeliverySlips.bind(this);
        this.saveDay = this.saveDay.bind(this);
        this.getalltoDates = this.getalltoDates.bind(this);
        this.confirmDayCloser = this.confirmDayCloser.bind(this);
        this.pendingConfirmDayCloser = this.pendingConfirmDayCloser.bind(this);
        this.hideClosePop = this.hideClosePop.bind(this);
        this.avoidSpace=this.avoidSpace.bind(this);
    // this.confirmDayClose = this.confirmDayClose.bind(this);
    // this.handleSelect =  this.handleSelect.bind(this);
  }
  
  componentWillMount() {
    const storeId = sessionStorage.getItem("storeId");
    this.setState({ storeId: storeId});
    this.getAllDayCloser();
    this.getallPendingDate();
    this.getalltoDates();
    this.getPendingDeliverySlips(moment(new Date()).format("YYYY-MM-DD").toString())
    
    
  }

  closePendingDeliverySlips(){
    const date =this.state.applicability ? this.state.applicability.value.split("T")[0]:this.state.toDay;
    CreateDeliveryService.closePendingDeliverySlips(date,sessionStorage.getItem('storeId')).then(res => {
      if (res) {
        this.props.history.push("/posdayclose");
             this.setState({isView:false,applicability:""},()=>
             this.getallPendingDate(),
            this.getAllDayCloser(),
            
            )
            
            }

    });
  }
  getalltoDates(){
    CreateDeliveryService.getDates(sessionStorage.getItem('storeId')).then(res => {
        if(res.data.length > 0){    
          this.setState({ daycheckCloseDates:res.data}); 
          if(this.state.daycheckCloseDates.length === 0){
              this.setState({isdayCloser:true});
          }else if(this.state.daycheckCloseDates.length > 1 && this.state.daycheckCloseDates[0].dayClose.split("T")[0] !== this.state.toDay){
            this.setState({ystDayCloser: true});

          }         
        }
        
      
    }); 

  }
  pendingConfirmDayCloser(){
    this.setState({isView:true},()=>this.getPendingDeliverySlips(this.state.applicability.value));
  }

  closeDay() {
    this.setState({ isCloseDay: true});
    if(this.state.daycheckCloseDates.length === 1){
      this.setState({isDayClose:true , ystDayCloser:false})
    }
    else if(this.state.daycheckCloseDates.length > 1){
      this.setState({isDates:true})
    }
  }
  
  handleSelect = selecteddate => {
    this.setState({applicability: selecteddate}    
  )
    }
  closeDayCloser() {
    CreateDeliveryService.closeDayCloser(sessionStorage.getItem('storeId')).then(res => {
      if (res) {
        toast.success(res.data.result);
        this.getAllDayCloser();
        
      }
    }); 
  }
  hideClosePop(){
    this.setState({isView:false})
  }

  getdayclosure(){
    const storeId = sessionStorage.getItem("storeId");
    const obj ={
      "storeId":  storeId
    }
    CreateDeliveryService.getdayclosure(sessionStorage.getItem('storeId',obj)).then(res => {
      if (res) {
            }

    });
  }
  saveDayCloser(){
   const storeId = sessionStorage.getItem("storeId");
   const obj ={
      storeId:  storeId,
      dayClose : this.state.applicability.value,
      startedBy :this.state.startedBy,
      closedBy : this.state.closeBy,
      collectedAmount :this.state.toadaydeskValue,
      saleAmount : this.state.toadayValue,
      penality : this.state.penlitydeskValue,

    }
    
    if(this.state.daycheckCloseDates.length > 1){
    CreateDeliveryService.saveDayCloser(obj).then(res => {
      
      if(res){
             this.getalltoDates();
            this.closePendingDeliverySlips();   
        toast.success("DayClosed Successfully");
        this.setState({isView:false ,
          isEnabeldDayCloser:false ,
          ystDayCloser : false ,
          startedBy : '',
          closeBy:'',
          toadaydeskValue:'',
          toadayValue:'',
          penlitydeskValue:'',});
      }
    
            

    });
  }else if(this.state.daycheckCloseDates.length <=1){
     this.hidedayModel();
  }
    
  }
confirmDayCloser(){
  this.setState({isView:true},()=>this.getPendingDeliverySlips(moment(new Date()).format("YYYY-MM-DD").toString()));
}

  saveDay(){
    const storeId = sessionStorage.getItem("storeId");
     const obj ={
       storeId:  storeId,
       dayClose : this.state.toDay,
       startedBy :this.state.startedBy,
       closedBy : this.state.closeBy,
       collectedAmount :this.state.toadaydeskValue,
       saleAmount : this.state.toadayValue,
       penality : this.state.penlitydeskValue,
 
     }
     CreateDeliveryService.saveDayCloser(obj).then(res => {
       
       if(res){
              this.getalltoDates();
              this.closePendingDeliverySlips();
           
       }
       
       toast.success("Today closed Successfully"); 
       this.setState({
        startedBy : '',
        closeBy:'',
           toadaydeskValue:'',
            toadayValue:'',
           penlitydeskValue:'',});
              
     });
     this.hideModal();
    

   }
  
   getallPendingDate(){
    CreateDeliveryService.getDates(sessionStorage.getItem('storeId')).then(res => {
      
      if (res && res.data.length > 1 ) {
        if(res.data.length > 1){
          this.setState({datesDaycloser:res.data })
          console.log("sale",this.state.datesDaycloser)
          this.state.datesDaycloser.pop();
          this.setState({dateClose:true,isEnabeldDayCloser:true})
         const dayCloseRes = this.state.datesDaycloser.map((item)=>{  
           const obj ={};
           obj.label = item.dayClose;
           obj.value = item.dayClose;
           return obj;
          });
          dayCloseRes.forEach((item, index) => {
            if(index === 0) {
              item.isDisabled = false;
            } else {
              item.isDisabled = true;
            }
          });
          eventBus.dispatch("dayClose", { message: res.data });
          this.setState({isDayClose:false, dayCloseDates:(dayCloseRes)},()=>this.setState({indexDate:this.state.datesDaycloser[0]}));

          
        }else{
          this.hidedayModel();
        }
        
      }
      
    }); 
    this.hideModal();

  }
  deleteEstimationSlip(dsNumber){
    CreateDeliveryService.deleteEstimationSlip(dsNumber).then((res) => {
     if(res.data.result){
        toast.success(res.data.result);
        this.getAllDayCloser(0);
     }else{
      toast.error(res.data.message);
     }
      
    });
  }
  

  
  hideModal() {
    this.setState({ isCloseDay: false ,isDayClose:false});
  }
  hidedayModel(){
      this.setState({isDates:false})
  }
  getAllDayCloser() {
    CreateDeliveryService.getAllDayClosr(sessionStorage.getItem('storeId')).then(res => {
      if (res.data.result.length > 0) {
        this.setState({ dayCloserList: res.data.result.deliverySlips });
        console.log("res ",res.data.result.deliverySlips )
        if(this.state.dayCloserList.length>0){
          this.setState({enableButton:true})
        }
        
      }
    }); 
  }
 

   getPendingDeliverySlips(selectedDate) {
    console.log("selectedDate",selectedDate,this.state.toDay)
    const selectdate = selectedDate.split("T")[0];
    CreateDeliveryService.getPendingDeliverySlips(selectdate,sessionStorage.getItem('storeId')).then(res => {
      if (res) {
        this.setState({ pendingDayCloserList: res.data.result.deliverySlips,toadayValue :res.data.result.saleValue ,dayCloserList :res.data.result.deliverySlips  });
        console.log(res.data.result.deliverySlips )
        // if(this.state.pendingDayCloserList){
        //   this.setState({isView:true})
        // } 
      }
    }); 
  }
  getDayCloserTable() {
    if (this.state.dayCloserList && this.state.dayCloserList.length > 0) {
      {console.log("dayCloserList2222 ",this.state.dayCloserList)}
      return this.state.dayCloserList.map((items, index) => {
        const { dsNumber ,mrp, salesMan,createdDate } = items;
        return (
          <tr key={index}>
            <td className="col-2 geeks">
              {index + 1}
            </td>
            <td className="col-3">{dsNumber}</td>
            <td className="col-2">{salesMan}</td>
            <td className="col-2">{formatDate(createdDate)}</td>
            <td className="col-2 text-center">
          <i className="icon-delete m-l-2 fs-16"
           onClick={() => this.deleteEstimationSlip(items?.dsNumber)}> 
         </i>
         </td>
          </tr>
        );
      });
    }
  
  }

pendingDayCloserTable(){
  if (this.state.pendingDayCloserList) {
    {console.log("this.state.pendingDayCloserList",this.state.pendingDayCloserList)}
    return this.state.pendingDayCloserList.map((items, index) => {
      const { dsNumber ,mrp, salesMan } = items;
      return (
        <tr key={index}>
          <td className="col-2 geeks">
            {index + 1}
          </td>
          <td className="col-3">{dsNumber}</td>
          <td className="col-1">{mrp}</td>
          <td className="col-2">{salesMan}</td>
        </tr>
      );
    });
  }

}
avoidSpace(e) {
  if (e.key === " ") {
      e.preventDefault();
    }
}



  render() {
    return (
      <div className="maincontent">
          <Modal isOpen={this.state.isDates} size="md">
          <ModalHeader>Pending Dates <button type='button' onClick={() =>this.hidedayModel()} className='btn search modal-close text-right'> <img src={close}></img></button></ModalHeader>
          <ModalBody>
            <div className="row ">
              <div className="col text-center">
              
            <div>
               <Select
                  
                       onChange={this.handleSelect}
                      options={this.state.dayCloseDates}
                      value={this.state.applicability}
                      isOptionDisabled={(option) => option.isDisabled}
                      />
            </div>
</div>
</div>
          </ModalBody>
          <ModalFooter>
            <button className="pt-2 btn-bdr" onClick={this.hidedayModel}>
              Cancel
            </button>
            <button
              className="btn btn-bdr active fs-12"
              // onClick={this.handleSelect}
              onClick={this.pendingConfirmDayCloser}
            >
              Confirm
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.isDayClose} size="md">
          <ModalHeader>Confirm Activity <button type='button' onClick={() =>this.hideModal()} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>
          <ModalBody>
            <div className="row ">
              <div className="col text-center">
              <img src={error}/>
            <h6 className="mt-2">"Are you sure you want to close for the day"
</h6>
</div>
 
</div>
          </ModalBody>
          <ModalFooter>
            <button className="pt-2 btn-bdr" onClick={this.hideModal}>
              Cancel
            </button>
            <button
              className="btn btn-bdr active fs-12"
              onClick={this.confirmDayCloser}
            >
              Confirm
            </button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.isView} className="modal-lg">
          <ModalHeader>Day Close <button type='button' onClick={() =>this.hideClosePop()} className='btn search modal-close text-right'> <img src={close}></img></button></ModalHeader>
          <ModalBody className="pt-4">
          <div className="row mb-3">
              <div className="col-12">
                <div className="head-text p-l-0 p-b-0 p-t-0">
                  Previous Day Close : <span className="fs-18">₹2000</span>
                </div>
              </div>
              <div className="col-sm-4 col-12">
                <div className="form-group">
                  <label>Started By</label>
                  <input type="text" className="form-control" name="entername"
                                            value={this.state.startedBy} 
                                            // maxLength={errorLengthMax.name}
                                             onChange={(e) => this.setState({ startedBy: e.target.value })}
                                            //onChange={ (e) => this.haandlename(e)}
                                            autoComplete="off" />
                </div>
              </div> 

              <div className="col-sm-4 col-12">
                <div className="form-group">
                  <label>Today Value</label>
                  <input type="text" className="form-control" name="entername" placeholder="Enter Name"
                                            value={this.state.toadayValue} disabled={this.state.isView}
                                            // maxLength={errorLengthMax.name}
                                            //  onChange={(e) => this.setState({ name: e.target.value })}
                                            //onChange={ (e) => this.haandlename(e)}
                                            autoComplete="off" />
                  
                </div>
              </div> 
              <div className="col-sm-4 col-12">
                <div className="form-group">
                  <label>Desk Value</label>
                  <input type="text" className="form-control" name="entername" 
                                            value={this.state.toadaydeskValue} 
                                            // maxLength={errorLengthMax.name}
                                             onChange={(e) => this.setState({toadaydeskValue: e.target.value.replace(/[^\0-9]/ig, "") })}
                                             onKeyDown={this.avoidSpace}
                                            //onChange={ (e) => this.haandlename(e)}
                                            autoComplete="off" />
                  
                </div>
              </div> 
              <div className="col-sm-4 col-12">
                <div className="form-group">
                  <label>Manager Value</label>
                  <input type="text" className="form-control" name="entername"
                                            value={this.state.penlitydeskValue} 
                                            // maxLength={errorLengthMax.name}
                                             onChange={(e) => this.setState({ penlitydeskValue: e.target.value })}
                                            //onChange={ (e) => this.haandlename(e)}
                                            autoComplete="off" />
                  
                </div>
              </div> 
              <div className="col-sm-4 col-12">
                <div className="form-group">
                  <label>Closed By</label>
                  <input type="text" className="form-control" name="entername"
                                            value={this.state.closeBy} 
                                            // maxLength={errorLengthMax.name}
                                             onChange={(e) => this.setState({ closeBy: e.target.value })}
                                            //onChange={ (e) => this.haandlename(e)}
                                            autoComplete="off" />
                </div>
              </div> 
              <div className="col-4 mt-3">
                <div className="">
                  <label>Estimation Slips : </label>{" "}
                  <span className="font-bold fs-13">
                    {" "}
                    {this.state.dsNumber}
                  </span>
                </div>
              </div>
            </div>
            {/* <div className="row mb-3">
              <div className="col-3">
                <div className="">
                  <label>Estimation Slips : </label>{" "}
                  <span className="font-bold fs-13">
                    {" "}
                    {this.state.dsNumber}
                  </span>
                </div>
              </div>
            </div> */}
            {/* <div className="table-responsive"> */}
            <div className="row mb-3">
            <div className="table-responsive">
        <table className="table table-borderless mb-1">
          <thead>
            <tr className="m-0 p-0">
            <th className="col-2">S.No</th>
              <th className="col-3">ESNumber</th>
              <th className="col-1">MRP</th>
              <th className="col-2">SALESMan</th>
              {/* <th className="col-2 text-center">ACTION</th> */}
              
            </tr>
          </thead>
          <tbody>
          {this.pendingDayCloserTable()}
          </tbody>
        </table>
      </div>
            </div>
          </ModalBody>
          <ModalFooter>
            {/* <button className="pt-2 btn-bdr" onClick={this.saveDayCloser}>
              Day Close
            </button> */}
            {this.state.isEnabeldDayCloser ? 
            <button className="pt-2 btn-bdr"
            onClick={this.saveDayCloser}> Day Close</button> :                    
            <button 
            className="pt-2 btn-bdr"
                 onClick={this.saveDay}>
                Day Close</button>}
           
          </ModalFooter>
        </Modal>

        <div className="row mb-2 scaling-center">
          <div className="col-sm-6 mt-2 col-12 scaling-mb"><h5 className='mt-1 fs-18'>List Of Pending Delivery Slips</h5></div>
          <div className="col-sm-6 col-12 text-right scaling-mb"> 
  <button
                  // className=
                  //   "btn-unic-search mt-2" 
                  className={"btn-unic scaling-ptop active" +
                "btn-unic-search mt-2" +
                (this.state.isdayCloser ? " btn-disable" : "")
              }
                  
                  onClick={this.closeDay}
                  disabled={this.state.isdayCloser}
                
                >
                 Day closure
                </button>

          </div>
          </div>
          <div className="table-responsive">
        <table className="table table-borderless mb-1">
          <thead>
            <tr className="m-0 p-0">
            <th className="col-2">S.No</th>
              <th className="col-3">ESNumber</th>
              {/* <th className="col-1">MRP</th> */}
              <th className="col-2">SALESMan</th>
              <th className="col-2">CREATED DATE</th>
              <td className="col-2 text-center"></td>
            </tr>
          </thead>
          <tbody>
          {this.getDayCloserTable()}
          {this.state.isdayCloser && <tr>Day Alreday Closed</tr>}
          {this.state.ystDayCloser && <div className='no_records'><img src={confirm}></img> <label>Yester Day Day Closer Not Done</label> </div>}
          </tbody>
        </table>
      </div>
      </div>

  
    )
    }
  }