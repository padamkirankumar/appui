import React, { Component } from 'react';
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import close from '../../assets/images/cross.svg';
import view from "../../assets/images/view.svg";
import { errorLengthMin, ticketingErrorMessages } from "../../commonUtils/Errors";
import TicketingService from '../../services/TicketingService';

export default class Ticketing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status:'ALL',
            totalTicketList: [],
            updateStatus:'',
            ticketId: '',
            clientId:'',
            storeId:'',
            commentSection:'',
            iscommentSection:false,
            addComment: '',
            addedComments :[{comment:''}],
            dropModal:false,
             userFeedBackp:[],
             errors: {},
            workQuality: '',
            sendTicketId:'',
            responseTime : '',
            overallRating: '',
            issueResolutionTime :'',
            isView:false,
            checkStatus:'',
            uploadFileUser:'',
            isCreateTicket:false,
            isClose:false,
            issueType:'',
            selectModule:'',
            contactNum:'',
            useremail:'',
            priority:'',
            title:''

        }
        this.getTickets = this.getTickets.bind(this);
        this.saveTicket = this.saveTicket.bind(this);
        this.createTicket = this.createTicket.bind(this);
        this.inputReference = React.createRef();
        this.hidemodel = this.hidemodel.bind(this);
        this.searchTicket = this.searchTicket.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.hideFeedBackModel = this.hideFeedBackModel.bind(this);

    }

   
    componentDidMount(){
    const user = JSON.parse(sessionStorage.getItem('user'));
       if(user) {
        this.setState({ clientId: user["custom:clientId1"],storeId:sessionStorage.getItem('storeId')},()=>this.getTickets())
       } 
    }
    handleValidation(){
    let errors = {};
    let formIsValid = true;
    if (this.state.issueType.length === 0) {
        formIsValid = false;
        errors["issueType"] = ticketingErrorMessages.issueType;
  }
    if (this.state.selectModule.length === 0) {
    formIsValid = false;
    errors["selectModule"] = ticketingErrorMessages.selectModule;
  }    
    if (this.state.contactNum.length === 0 || this.state.contactNum.length < errorLengthMin.mobileNumber) {
        var pattern = new RegExp(/^[0-9\b]+$/);
    if (pattern.test(this.state.contactNum)) {
        formIsValid = false;
       errors["contactNum"] = ticketingErrorMessages.contactNum;
  }
 }
if (!this.state.useremail) {
        errors["useremail"] = ticketingErrorMessages.useremail;
      } else if (!/\S+@\S+\.\S+/.test(this.state.useremail)) {
        errors["useremail"] = ticketingErrorMessages.useremail;
}
if (this.state.priority.length === 0) {
    formIsValid = false;
    errors["priority"] = ticketingErrorMessages.priority;
  } 
if (this.state.title.length === 0) {
    formIsValid = false;
    errors["title"] = ticketingErrorMessages.title;
  } 
    
  
    this.setState({ errors: errors });               
    return formIsValid;


    }

    toggle = () => {
        this.setState({
            showModal: false,
          
        });
      }

    getTickets(){
        TicketingService.getAllTickets(this.state.status,this.state.clientId).then((res) =>{
            if(res){
                 this.setState({ totalTicketList: res.data.result });
               
            }
        });
    }
    commentTicket(items) {
        console.log("ird",items)
        this.setState({
            isView:true,
            showModal:true,
            iscommentSection:true,
            isClose:false,
            isCreateTicket:false,
            issueType:items.issueType,
            selectModule:items.moduleType,
            contactNum:items.contactNumber,
            useremail:items.emailId,
            priority:items.priority,
            title:items.title,
            description:items.description,
            addedComments:items.commentsVo,
            sendTicketId:items.ticketId,
            checkStatus:items.status


        });
    
        // if(this.state.checkStatus === 'CLOSED'){
        //     this.setState({isClose:true,iscommentSection:false})
        // }
      }
addedComments = () =>{
        const {addedComments} = this.state;
        let item = {
            comment: this.state.addComment}
        this.setState({
            addedComments : [...addedComments,item]
        })
}
handleComment = (e, idx) => {
        let addedComments = this.state.addedComments;
        addedComments[idx][e.target.name] = e.target.value;
        this.state.addedComments[idx][e.target.name]  = e.target.value;
        this.setState({ addedComments });
}
 userFeedBack(items) {
        this.setState({
        dropModal:true,
        sendTicketId:items.ticketId,
        });

      }
 handleExcelChange = (event) => {
        let uploadFile = event.target.files[0];
        this.setState({uploadFileUser:uploadFile})
        // if (uploadFile !== null) {
        //     this.inputReference.current.click();
        //     TicketingService.fileUpload(uploadFile).then((response) => {
        //          if (response) {
        //             toast.success(response.data.result);
        //         }
        //       });
        //     }
       
      }
     
 clear = () => {
        this.setState({
        serachTickedtId: '',
        statusType:''
        }, () => {
        this.getTickets();
        });
    
      }

      handleIssueType = (e) => {
        this.state.errors["issueType"] = '';
        this.setState({ issueType: e.target.value });
      };

      handleSelectModule = (e) => {
        this.state.errors["selectModule"] = '';
        this.setState({ selectModule: e.target.value });
      };

      handleUseremail = (e) => {
        this.state.errors["useremail"] = '';
        this.setState({ useremail: e.target.value });
      };

      handlePriority = (e) => {
        this.state.errors["priority"] = '';
        this.setState({ priority: e.target.value });
      };

      handleTitle = (e) => {
        this.state.errors["title"] = '';
        this.setState({ title: e.target.value });
      };
      
 hideFeedBackModel(){
    this.setState({
        userFeedBack:"",
        dropModal:false,
        workQuality:"",
        responseTime:'',
        overallRating:'',
        issueResolutionTime:''
    })
 }
 updateStatus(e) {
        this.setState({ updateStatus: e.target.value });
      }
saveTicket(){
    const formValid = this.handleValidation();
    if(formValid){
    if(this.state.iscommentSection){
    const obj ={
        "ticketId": this.state.sendTicketId,
        "commentsVo": this.state.addedComments.slice(-1),
            }
     TicketingService.saveTicket(obj).then((res) =>{
                if(res) {
                    // this.getAllTickets();         
                    this.hidemodel();
                    toast.success("Comment Added")
                    
                }
    
            })
        }else if(this.state.dropModal){
            const obj ={
             "ticketId": this.state.sendTicketId,
             "feedBackVo":  {
                     "issueResolutionTime": this.state.issueResolutionTime ,
                     "overallRating": this.state.overallRating,
                     "responseTime": this.state.responseTime,
                     "workQuality": this.state.workQuality,
                    }
            }
            TicketingService.saveTicket(obj).then((res) =>{
                if(res) {
                    // this.getAllTickets();
                                      
                    this.hideFeedBackModel();
                    toast.success("Thank for Your Feed Back");
                    
                }
    
            })

        }else{
            
        const obj = {
           
            "issueType":this.state.issueType,
            "moduleType": this.state.selectModule,
            "contactNumber":this.state.contactNum,
            "emailId": this.state.useremail,
            "priority": this.state.priority,
            "title": this.state.title,
            "description": this.state.description,
            "assignee": "abc@gmail.com",
            "clientId": this.state.clientId,
            "storeId": this.state.storeId,
            "commentsVo":[]
        

        }

        TicketingService.saveTicket(obj).then((res) =>{
             if(res) {
                this.hidemodel();
                if (this.state.uploadFileUser !== null) {
                    // this.inputReference.current.click();
                    TicketingService.fileUpload(this.state.uploadFileUser).then((response) => {
                         if (response) {
                            toast.success(response.data.result);
                            this.setState({uploadFileUser:''},()=>{
                                this.hidemodel();
                            })
                        }
                      });
                    } 
                toast.success("Ticket is Created Successfully");
                
                
                
             }

        })
    }
  }
}
    searchTicket() {
        const searchTic= {
            "ticketId": this.state.serachTickedtId ? this.state.serachTickedtId : null,
            "status":this.state.statusType ? this.state.statusType : null,
            "clientId": this.state.clientId
        }

        TicketingService.searchTicket(searchTic).then(res => {
            if (res) {
                this.setState({ totalTicketList: res.data.result, isRole: true });
            } else {
                this.setState({ totalTicketList: [] })
            }
        });
    }
    hidemodel(){
        this.setState({
            isView:false,
            showModal:false ,
            iscommentSection:false ,
            addedComments:[],
            issueType:'',
            selectModule:'',
            useremail:'',
            contactNum:'',
            priority:'',
            title:'',
            description:'',
        })
    }
    createTicket(){
        this.setState({showModal:true , iscommentSection:false ,isCreateTicket:true ,errors: {}})
    }
    getTableData() {
        
        return this.state?.totalTicketList.map((items, index) => {
            const {ticketId, moduleType, priority, closedBy, status,description } = items;
            return(

                <tr className="" key={index}>
                    <td className="col-2">{ticketId}</td>
                    <td className="col-2">{moduleType}</td>
                    {/* <td className="col-2">{email}</td> */}
                    <td className="col-1">{priority}</td>
                    <td className="col-2">{closedBy} </td>
                    <td className="col-1">{status} </td>
                    <td className="col-3">{description} </td>
                    <td className="col-1 p-l-0 p-r-0">
                    <img src={view}  onClick={() => this.commentTicket(items)} className="w-12 pb-2 m-r-2" /> 
                    <button className={"fs-12 btn-sm"} disabled={items.status === "OPEN"} onClick={(e) =>this.userFeedBack(items)}>
              Feed Back
            </button> 
            </td> 
                </tr>


            );
        });
    }
    render() {
        return (

            
            
            <div className='maincontent'>
                <Modal isOpen={this.state.dropModal} size="lg">
          <ModalHeader>Feed Back</ModalHeader>
          <ModalBody>
            <div className="row ">
              <div className="col-3">
                 <label>Issue Resolution Time</label>
                     <select className="form-control" name="Issue Resolution Time" value={this.state.issueResolutionTime}
                             onChange={(e) => this.setState({ issueResolutionTime: e.target.value })}>
                                <option>Select</option>
                                <option>VeryPoor</option>
                                <option>Poor</option>
                                <option>Average</option>
                                <option>Good</option>
                                <option>Excellent</option>
                    </select> 
              
            <div>
        </div>
</div>
                                            <div className="col-3">
                                                 <label>Over All Rating</label>
                                                <select className="form-control" name="Over All Rating" value={this.state.overallRating}
                                                onChange={(e) => this.setState({ overallRating: e.target.value })}>
                                                 <option>Select</option>
                                                <option>VeryPoor</option>
                                                <option>Poor</option>
                                                <option>Average</option>
                                                <option>Good</option>
                                                <option>Excellent</option>
                                            </select> 
              
            <div>
                
                
               
            </div>
</div>
<div className="col-3">
                                                <label>Response Time
                                             </label>
                                                <select className="form-control" name="Response Time" value={this.state.responseTime}
                                                onChange={(e) => this.setState({ responseTime: e.target.value })}>
                                                 <option>Select</option>
                                                <option>VeryPoor</option>
                                                <option>Poor</option>
                                                <option>Average</option>
                                                <option>Good</option>
                                                <option>Excellent</option>
                                            </select> 
              
            <div>
                
                
               
            </div>
</div>
<div className="col-3">
           
                                                <label>Work Quality
                                             </label>
                                                <select className="form-control" name="Work Quality" value={this.state.workQuality}
                                                onChange={(e) => this.setState({ workQuality: e.target.value })}>
                                                <option>Select</option>
                                                <option>VeryPoor</option>
                                                <option>Poor</option>
                                                <option>Average</option>
                                                <option>Good</option>
             <option>Excellent</option>
             </select> 
              
            <div>
                
                
               
            </div>
</div>
</div>
          </ModalBody>
          <ModalFooter>
            <button className="pt-2 btn-bdr" onClick={this.hideFeedBackModel}>
              Cancel
            </button>
            <button
              className="btn btn-bdr active fs-12"
              // onClick={this.handleSelect}
              onClick={this.saveTicket}
            >
              Confirm
            </button>
          </ModalFooter>
        </Modal>
                 <Modal isOpen={this.state.showModal} size="lg">
                 {!this.state.isView &&
                    <ModalHeader>   
                                <div>
                                     New Ticket
                                     <button type='button' onClick={() =>this.toggle()} className='btn search modal-close text-right'> <img src={close}></img></button> 

                                    </div>
                        </ModalHeader>
                     }
                        {this.state.iscommentSection && this.state.checkStatus === 'OPEN' &&
                        <ModalHeader>
                                <div>
                                     Add Comment
                                    </div>
                               
                        </ModalHeader>
                        }
                        {this.state.iscommentSection && this.state.checkStatus === 'CLOSED' &&
                        <ModalHeader>
                                <div>
                                 Ticket View
                                    </div>
                               
                        </ModalHeader>
                         }
                    <ModalBody>
                        <div className="p-3">
                            <h5 className="fs-14 text-red scaling-center scaling-mb">User Details</h5>
                            <div className="row">
                                <div className="col-12 col-sm-4 scaling-mb">
                                    <div className="form-group">
                                        <label>Issue Type <span className="text-red font-bold" name="bold">*</span></label>
                                               <select className="form-control" name="SELECT MODULE" value={this.state.issueType}
                                               disabled ={this.state.isView}
                                               onChange={this.handleIssueType}>
                                             <option>Select</option>
                                            <option>Developement</option>
                                        </select> 
                                        <div>
                                            <span style={{ color: "red" }}>{this.state.errors["issueType"]}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 scaling-mb">
                                    <div className="form-group">
                                        <label>Select Module<span className="text-red font-bold" name="bold">*</span></label>
                                               <select className="form-control" name="SELECT MODULE" value={this.state.selectModule}
                                               disabled ={this.state.isView}
                                               onChange={this.handleSelectModule}>
                                             <option>Select</option>
                                            <option>Promotions</option>
                                            <option>Billing </option>
                                            <option>Accounting </option>
                                        </select> 
                                        <div>
                                            <span style={{ color: "red" }}>{this.state.errors["selectModule"]}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 scaling-mb">
                                    <div className="form-group">
                                        <label>Email <span className="text-red font-bold" name="bold">*</span></label>
                                        <input type="text" className="form-control" name="EMAIL"
                                            value={this.state.useremail}
                                            disabled ={this.state.isView}
                                            onChange={this.handleUseremail}
                                            autoComplete="off"
                                            />
                                            <div>
                                            <span style={{ color: "red" }}>{this.state.errors["useremail"]}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 mt-3 scaling-mb">
                                    <div className="form-group">
                                        <label>Contact<span className="text-red font-bold" name="bold">*</span></label>
                                        <input type="text" className="form-control" name="Contact"
                                            value={this.state.contactNum} disabled ={this.state.isView}
                                            maxLength={10}
                                            onChange={(e) => this.setState({ contactNum: e.target.value })}
                                            autoComplete="off"
                                            />
                                             <div>
                                            <span style={{ color: "red" }}>{this.state.errors["contactNum"]}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 mt-3 scaling-mb">
                                    <div className="form-group">
                                        <label>Priority<span className="text-red font-bold" name="bold">*</span></label>
                                        <select className="form-control" name="gender" value={this.state.priority} disabled ={this.state.isView}
                                            onChange={this.handlePriority}
                                            >
                                            <option>Select</option>
                                            <option>P1</option>
                                            <option>P2</option>
                                            <option>P3</option>
                                            
                                        </select>
                                        <div>
                                            <span style={{ color: "red" }}>{this.state.errors["priority"]}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 mt-3">
                                    <div className="form-group">
                                        <label>Title<span className="text-red font-bold" name="bold">*</span></label>
                                        <input type="text" className="form-control" placeholder="" name="number"
                                            value={this.state.title}  disabled ={this.state.isView}
                                            onChange={this.handleTitle}
                                            autoComplete="off" />
                                            <div>
                                            <span style={{ color: "red" }}>{this.state.errors["title"]}</span>
                                        </div>
                                    </div>
                                </div>
                                
                             
                <div className="col-12 col-sm-4 mt-3">
                <div className="form-group">
                    <label>File</label>
                         <input
                            type="file"
                            ref={this.inputReference}
                            onChange={this.handleExcelChange}
              />
          </div>
            </div>
                                <div className="col-12 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label>Discription</label>
                                        <input type="text" className="form-control" placeholder="Enter Discription" name="Discription"
                                            value={this.state.description}
                                            onChange={(e) => this.setState({ description: e.target.value })} disabled ={this.state.isView}
                                            autoComplete="off" />
                                    </div>
                                </div>
                               { this.state.iscommentSection && this.state.checkStatus === 'OPEN' && <div className="col-12 col-sm-12 mt-3">
                                   

                                    {this.state.addedComments && this.state.addedComments.map((item, index) => {
                                        const { comment } = item;
                                        {console.log('gsfgshfgsjhsgfgfshgsjhgf', this.state.addedComments)}
                                       return <div key={index} className="form-group">
                                         <label>Comment</label>
                                        <input type="textarea" 
                                            className="form-control" 
                                            placeholder="Comment" 
                                            name="comment"
                                            value={ comment }
                                            // disabled ={this.state.isView}
                                            onChange={(e) => this.handleComment(e, index)}
                                            />
                                        </div>
                                    })}
                                    <button type="button" className="btn-unic-redbdr" onClick={this.addedComments}>Add comment</button>
                                </div> 
                                }

                            </div>
                        </div>
                    </ModalBody>
                    { ((this.state.iscommentSection && this.state.checkStatus === 'OPEN') || this.state.isCreateTicket) && 
            <ModalFooter>
              
            <button className="btn-unic" onClick={this.hidemodel}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12 "
            //   className={this.state.isView}
              onClick={this.saveTicket}
            >
              Save
            </button>
  
          
          </ModalFooter>
              }
               { (this.state.iscommentSection && this.state.checkStatus === 'CLOSED') &&
            <ModalFooter>
              
            <button className="btn-unic active fs-12" onClick={this.hidemodel}>
              Close
            </button>
          </ModalFooter>
    }
                </Modal>
                
            <div className='row'>
                <div className='col-3'>
                    <div className='form-group'>
                        <label>Search</label>
                        <input type='text' className='form-control' placeholder='Search Ticket ID'  value={this.state.serachTickedtId}
                         onChange={(e) => this.setState({ serachTickedtId: e.target.value })}/>  
                                               
                    </div>
                
                </div>
                <div className='col-3'>
                <label>Status</label>
                         <select className="form-control"  value={this.state.statusType}
                                            onChange={(e) => this.setState({ statusType: e.target.value })}>
                                             <option>Select</option>
                                            <option>OPEN</option>
                                            <option>CLOSED</option>
                                        </select> 
                    </div>
                <div className='col-4 mt-3'>
                <button className="btn-unic-search m-r-2"  name="search" onClick={this.searchTicket}>Search </button>
                <button className="btn-clear m-r-2 mt-2"
                onClick={this.clear}
              >
                Clear</button>
                <button className="btn-unic-search active  " name="createuser" onClick={this.createTicket}><i className="icon-create_customer"></i> Create New </button>
                </div>
            </div>
            
            <h5 className="pl-4 mt-3 fs-18 scaling-center scaling-mb">Total Tickets</h5>
        <div className='table-responsive p-0'>
        <table className="table table-borderless mb-1 mt-2">
        <thead>
            <tr className="m-0 p-0">
            {/* <th className="col-1"># Mapping Id</th> */}
                <th className="col-2">Ticket ID </th>
                <th className="col-2">Module Type</th>
                <th className="col-1">Priority</th>
                <th className="col-2">Created Date</th>
                <th className="col-1">Status</th>
                <th className="col-3 p-l-1">Description</th>
                <th className="col-1"></th>
                {/* <th className="col-2"></th> */}
            </tr>
        </thead>
       
         <tbody>
                        {this.getTableData()}

                    </tbody>
    </table>
    </div>

    </div>
        );
    }

}
