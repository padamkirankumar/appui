import React, { Component } from 'react';
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import view from "../../assets/images/view.svg";
import TicketingService from '../../services/TicketingService';

export default class TotalTickets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status:'ALL',
            totalTicketList: [],
            priorityUpdate:false,
            updateStatus:'',
            ticketId: '',
            closeTicketId:'',
            clientId:'',
            storeId:'',
            checkStatus:'',
            addedComments :[{comment:''}],

        }
        this.getTickets = this.getTickets.bind(this);
        this.saveTicket = this.saveTicket.bind(this);
        // this.createTicket = this.createTicket.bind(this);
        this.inputReference = React.createRef();
        this.hidemodel = this.hidemodel.bind(this);
        // this.priorityUpdate= this.priorityUpdate.bind(this);
         this.closepriorityStatus = this.closepriorityStatus.bind(this);
         this.updatepriorityStatus = this.updatepriorityStatus.bind(this);
        this.searchTicket = this.searchTicket.bind(this);
        this.ticketCount = this.ticketCount.bind(this);

    }

   
    componentDidMount(){
         this.getTickets();
         this.ticketCount();
         const user = JSON.parse(sessionStorage.getItem('user'));
         if(user) {
          this.setState({ clientId: user["custom:clientId1"],storeId:sessionStorage.getItem('storeId')})
         } 

    }
    getTickets(){
        TicketingService.getAllTickets(this.state.status).then((res) =>{
            if(res){
                 this.setState({ totalTicketList: res.data.result });
               
            }
        });
    }
    viewTicket(items) {
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
            // commentTicket:items.commentsVo,
            sendTicketId:items.ticketId,
            addedComments:items.commentsVo,
            checkStatus:items.status


        });
    }
    ticketCount(){
        TicketingService.ticketCount().then((res) =>{
            if(res){
                console.log(res.data)
            }
        })
    }
    // fileUploadAction = () => {
    //     this.inputReference.current.click();
    //   };
      handleExcelChange = (event) => {
        let uploadFile = event.target.files[0];
        if (uploadFile !== null) {
            this.inputReference.current.click();
          TicketingService.fileUpload(uploadFile).then((response) => {
            if (response) {
              toast.success(response.data.result);
            }
          });
        }
       
      }
updatepriorityStatus(){
        const obj = {
            status: "CLOSED",
            id: this.state.closeTicketId
          } 
        TicketingService.updateStatus(obj).then((res) => {
         if(res) {
            // this.getTickets();
            console.log(res)
         }
        });
        this.closepriorityStatus();
      }
closepriorityStatus(){
        this.setState({priorityUpdate:false})
      }
priorityUpdate(items) {
        const {checkedItem } = this.state;
        this.setState({
           closeTicketId: items.id, 
          priorityUpdate: true,
          
        });
      }
clear = () => {
        this.setState({
            serachTickedtId: '',
            statusType:''
        }, () => {
          this.getTickets();
        });
    
      }
updateStatus(e) {
        this.setState({ updateStatus: e.target.value });
      }
    saveTicket(){
       
        const obj ={
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
            "commentsVo": [
                {
                    "comment": "Hey Man"
                },
                {
                   "comment": "Hey Girl" 
                }
            ],
            "feedBackVo": { }
        

        }
        TicketingService.saveTicket(obj).then((res) =>{
            if(res) {
                toast.success("Tickte is Created Successfully");
                                  
                this.hidemodel();
                
            }

        })
    }
    commentTicket(items) {
        this.setState({
            isView:true,
            showModal:true,
            iscommentSection:true,
            issueType:items.issueType,
            selectModule:items.moduleType,
            contactNum:items.contactNumber,
            useremail:items.emailId,
            priority:items.priority,
            title:items.title,
            description:items.description,
            checkStatus:items.status,
            // commentTicket:items.commentsVo,
            addedComments:items.commentsVo,


        });
      }
    searchTicket() {
        const searchTic= {
            "ticketId": this.state.serachTickedtId ? this.state.serachTickedtId : null,
            "status":this.state.statusType ? this.state.statusType : null,
        }

        TicketingService.searchTicket(searchTic).then(res => {
            if (res) {
                this.setState({ totalTicketList: res.data.result, isRole: true });
            } else {
                this.setState({ totalTicketList: [] })
            }
        });
    }
    handleComment = (e, idx) => {
        let addedComments = this.state.addedComments;
        addedComments[idx][e.target.name] = e.target.value;
        this.state.addedComments[idx][e.target.name]  = e.target.value;
        this.setState({ addedComments });
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
            description:''
        })
    }
    getTableData() {
        
        return this.state?.totalTicketList.map((items, index) => {
            // let date = this.dateFormat(items.createdDate)
            const {ticketId, moduleType, priority, closedBy, status,description } = items;
            return (

                <tr className="" key={index}>
                    <td className="col-2">{ticketId}</td>
                    <td className="col-2">{moduleType}</td>
                    {/* <td className="col-2">{email}</td> */}
                    <td className="col-1">{priority}</td>
                    <td className="col-2">{closedBy} </td>
                    <td className="col-1">{status} </td>
                    <td className="col-2">{description} </td>
                    <td className="col-2">
                    <img src={view} disabled={items.status === "CLOSED"} onClick={() => this.viewTicket(items)} className="w-12 pb-2" /> 
                    <button className="fs-12 m-l-3 btn-sm" disabled={items.status === "CLOSED"} onClick={(e) =>this.priorityUpdate(items)}>
              Close Ticket
            </button> 
            </td>
                </tr>


            );
        });
    }
    render() {
        return (

            
            
            <div className='maincontent'>
                 <Modal isOpen={this.state.showModal} size="lg">
                    <ModalHeader>
                        {
                           
                                <div>
                                     Ticket View
                                    </div>
                               
                            
                        }
                        
                        </ModalHeader>
                    <ModalBody>
                        <div className="p-3">
                            <h5 className="fs-14 text-red scaling-center scaling-mb">User Details</h5>
                            <div className="row">
                                <div className="col-12 col-sm-4 scaling-mb">
                                    <div className="form-group">
                                        <label>Issue Type
                                             </label>
                                               <select className="form-control" name="SELECT MODULE" value={this.state.issueType}
                                               disabled ={this.state.isView}
                                            onChange={(e) => this.setState({ issueType: e.target.value })}>
                                             <option>Select</option>
                                            <option>Developement</option>
                                        </select> 
                                            
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 scaling-mb">
                                    <div className="form-group">
                                        <label>Select Module </label>
                                               <select className="form-control" name="SELECT MODULE" value={this.state.selectModule}
                                               disabled ={this.state.isView}
                                            onChange={(e) => this.setState({ selectModule: e.target.value })}>
                                             <option>Select</option>
                                            <option>Promotions</option>
                                            <option>Billing </option>
                                            <option>Accounting </option>
                                        </select> 
                                            
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 scaling-mb">
                                    <div className="form-group">
                                        <label>Email </label>
                                        <input type="text" className="form-control" name="EMAIL"
                                            value={this.state.useremail} disabled ={this.state.isView}
                                            onChange={(e) => this.setState({ useremail: e.target.value })}
                                            autoComplete="off"
                                            />
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 mt-3 scaling-mb">
                                    <div className="form-group">
                                        <label>Contact </label>
                                        <input type="text" className="form-control" name="Contact"
                                            value={this.state.contactNum} disabled ={this.state.isView}
                                            maxLength={10}
                                            onChange={(e) => this.setState({ contactNum: e.target.value })}
                                            autoComplete="off"
                                            />
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 mt-3 scaling-mb">
                                    <div className="form-group">
                                        <label>Priority </label>
                                        <select className="form-control" name="gender" value={this.state.priority}
                                        disabled ={this.state.isView}
                                            onChange={(e) => this.setState({ priority: e.target.value })}
                                        >
                                            <option>Select</option>
                                            <option>P1</option>
                                            <option>P2</option>
                                            <option>P3</option>
                                            
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 mt-3">
                                    <div className="form-group">
                                        <label>Title</label>
                                        <input type="text" className="form-control" placeholder="" name="number"
                                            value={this.state.title}  disabled ={this.state.isView}
                                            onChange={(e) => this.setState({ title: e.target.value })}
                                            autoComplete="off" />
                                             

                                    </div>
                                </div>
                            <div className="col-12 col-sm-4 mt-3">
                                    <div className="form-group">
                                        <label>File</label>
                                <input
                                          type="file"
                                          ref={this.inputReference}
                                          onChange={this.handleExcelChange}
                                          accept="image/png, image/jpeg"
                                        />
                                 </div>
                                </div>
                                <div className="col-12 col-sm-12 mt-3">
                                    <div className="form-group">
                                        <label>Description</label>
                                        <input type="text" className="form-control" placeholder="Enter Description" name="Description"
                                            value={this.state.description} disabled ={this.state.isView}
                                            onChange={(e) => this.setState({ description: e.target.value })}
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
                                           disabled ={this.state.isView}
                                           onChange={(e) => this.handleComment(e, index)}
                                           />
                                       </div>
                                   })}
                                   {/* <button type="button" className="btn-unic-redbdr" onClick={this.addedComments}>Add comment</button> */}
                               </div> 
                               }
                              

                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn-unic"  name="cancel" onClick={this.hidemodel}>Close</button>
                        {/* <button className="btn-unic active fs-12" name="save" onClick={this.saveTicket}>Save</button> */}
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.priorityUpdate} size="md">
          <ModalHeader>Close The Ticket</ModalHeader>
          <ModalBody>
          <div className="row ">
              <div className="col text-center">
            <h6 className="mt-2">Are you sure, you want to close the<br />
Ticket?</h6>
</div>
</div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.closepriorityStatus}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              onClick={this.updatepriorityStatus}>
              Save
            </button>
          </ModalFooter>
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
                <button className="btn-unic-search active m-r-2"  name="search" onClick={this.searchTicket}>Search </button>
                <button className="btn-clear m-r-2 mt-2"
                onClick={this.clear}
              >
                Clear</button>
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
                <th className="col-2">Description</th>
                <th className="col-2">Update Status</th>
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

// export default TotalTickets;