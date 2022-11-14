import React, { Component } from 'react';
import TicketingService from '../../services/TicketingService';

class ClosedTickets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status:'CLOSED',
            closedTicketList:[]
        }
        this.getTickets = this.getTickets.bind(this);
        this.searchTicket = this.searchTicket.bind(this);

    }


    componentDidMount(){
       this.getTickets();

    }
    searchTicket() {
        const searchTic= {
            "ticketId": this.state.serachTickedtId ? this.state.serachTickedtId : null,
            "status":this.state.status ? this.state.status : null,
        }

        TicketingService.searchTicket(searchTic).then(res => {
            if (res) {
                this.setState({ closedTicketList: res.data.result, isRole: true });
            } else {
                this.setState({ closedTicketList: [] })
            }
        });
    }
    getTickets(){
        //  this.setState({status:'OPEN'})
        TicketingService.getAllTickets(this.state.status).then((res) =>{
            if(res){
             this.setState({
                 closedTicketList:  res.data.result,
             })
            }
        });
    }
    clear = () => {
        this.setState({
            serachTickedtId: ''
        }, () => {
          this.getTickets();
        });
    
      }
    getTableData() {
        
        return this.state?.closedTicketList.map((items, index) => {
            // let date = this.dateFormat(items.createdDate)
            const {ticketId, moduleType, priority, closedBy, status,description } = items;
            return (

                <tr className="" key={index}>
                    <td className="col-1">{ticketId}</td>
                    <td className="col-2">{moduleType}</td>
                    <td className="col-1">{priority}</td>
                    <td className="col-2">{closedBy} </td>
                    <td className="col-5">{description} </td>

                </tr>


            );
        });
    }
    render() {
        return (
            <div className='maincontent'>
            <div className='row'>
                <div className='col-3'>
                    <div className='form-group'>
                        <label>Search</label>
                        <input type='text' className='form-control' placeholder='Search Ticket ID' value={this.state.serachTickedtId}
                         onChange={(e) => this.setState({ serachTickedtId: e.target.value })}/>                        
                    </div>
                </div>
                <div className='col-4 mt-4'>
                <button className="btn-unic-search active m-r-2"  name="search" onClick={this.searchTicket}>Search </button>
                <button className="btn-clear m-r-2"
                onClick={this.clear}
              >
                Clear</button>
                </div>
            </div>
            <h5 className="pl-4 mt-3 fs-18 scaling-center scaling-mb">List of Closed</h5>
        <div className='table-responsive p-0'>
        <table className="table table-borderless mb-1 mt-2">
        <thead>
            <tr className="m-0 p-0">
                <th className="col-1">Ticket ID </th>
                <th className="col-2">Module Type</th>
                <th className="col-1">Priority</th>
                <th className="col-2">Created Date</th>
                <th className="col-5">Description</th>
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

export default ClosedTickets;