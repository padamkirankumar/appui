import React, { Component } from 'react';
import scan from '../../assets/images/scan.svg';
import InventoryService from "../../services/InventoryService";
import edit from "../../assets/images/edit.svg";
import checkin from "../../assets/images/check_in_01.svg";
import ReactPageNation from "../../commonUtils/Pagination";
import { toast } from 'react-toastify';
import { formatDate } from "../../commonUtils/FormatDate";
import confirm from '../../assets/images/conformation.svg';
import moment from "moment";



class ReceiveOrder extends Component {
  constructor(props){
    super(props);
    this.state={
      fromDate: moment(new Date()).format("YYYY-MM-DD").toString(),
      toDate: moment(new Date()).format("YYYY-MM-DD").toString(),
      status:"",
      pageNumber:0,
      totalPages:0,
      receiveOrderList:[],
      selectOption: [
        {
          name: "SELECT STATUS",
          id: "SELECT STATUS",
        },
        {
          name: "INITIATED",
          id: "INITIATED",
        },
        {
          name: "INTRANSIT",
          id: "INTRANSIT",
        },
        {
          name: "RECEIVED",
          id: "RECEIVED",
        },
        {
          name: "CANCELLED",
          id: "CANCELLED",
        },
      ],
    };
    this.receiveOrder=this.receiveOrder.bind(this);
    this.updateReceiveOrder=this.updateReceiveOrder.bind(this);
    this.changePage = this.changePage.bind(this);

  
  }


  handleSelect(e) {
    if (e.target.value != "SELECT STATUS") {
      this.setState({
        status: e.target.value,
      });
    }
  }

  clearSearch(){
    this.setState({
      status:"",
      barcode:"",
      fromDate:moment(new Date()).format("YYYY-MM-DD").toString(),
      toDate:moment(new Date()).format("YYYY-MM-DD").toString(),
      totalPages:"",
      receiveOrderList:[]
    }, () => {
    this.receiveOrder();
  });    

    
  }
  changePage(pageNumber) {
    console.log(">>>page", pageNumber);
    let pageNo = pageNumber + 1;
    this.setState({ pageNumber: pageNo });
    this.receiveOrder(pageNumber); 
  }
  
  componentWillMount(){
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.setState({
      selectedStoreId: JSON.parse(sessionStorage.getItem("storeId")),
    });
  
    if (user["custom:isSuperAdmin"] === "true") {
      this.setState(
        {
          clientId: user["custom:clientId1"],
        },
        () => {
         this.receiveOrder();
        }
      );
    }else {
      this.setState(
        {
          clientId: user["custom:clientId1"],
          // domainId: user["custom:domianId1"]
        },
        () => {
          this.receiveOrder();
        }
      );
    }
    // this.keyBinds();

  }
  


// keyBinds() {
//   window.addEventListener('keydown', (e) => { 
//     if(e.altKey && String.fromCharCode(e.keyCode).toLocaleLowerCase() === 'k') {
//       e.preventDefault()
//       e.stopPropagation()
//       if(this.state?.receiveOrderList?.content?.length === 1){
//          this.updateReceiveOrder(this.state.receiveOrderList.content[0]);
      
//       }
//     }
//   })
// }

receiveOrder(pageNumber){
  InventoryService.receiveOrder(this.state.barcode?this.state.barcode.trim():null,this.state.selectedStoreId,this.state.fromDate,this.state.toDate,this.state.status,pageNumber).then((res)=>{  if(res){
    this.setState({
    receiveOrderList:res.data,
    toStore:res.data.content.toStore,
    totalPages:res.data.totalPages

    });
    // console.log("tostore?????????????",this.state.toStore);
  }
});
}


renderTableData(){
  return this.state?.receiveOrderList?.content?.map((items,index)=>{
    let date = formatDate(items.createdDate)
const {barcode,fromStoreName,toStoreName,quantity,createdDate,status,description}=items;
return(
          <tr className="" key={index}>
           <td className='col-1'>{index+1}</td>
          <td className='col-2'>{barcode}</td>
          <td className='col-1'>{fromStoreName}</td>
           <td className='col-1'>{toStoreName}</td>
           <td className='col-1'>{quantity}</td>
          <td className='col-2'>{date}</td>
            <td className='col-1'>{status}</td>
           <td className='col-2'>{description}</td>
           {/* <td className='col-1'>
          <img src={checkin} className="w-12 pb-2"></img></td> */}
          <td className="col-1 text-center">
          {items.status=="INTRANSIT"?
      <img
        // src={edit} className="w-12 pb-2"
        src={checkin} className="w-12 pb-2" onClick={(e) => this.updateReceiveOrder(items)}
        />:null}
     </td>
</tr>   
)
})
}


updateReceiveOrder(items){
  let saveObj;
  saveObj={
    "id": items.id,
    "createdBy": null,
    "createdDate": items.createdBy,
    "modifiedBy": null,
    "lastModifiedDate": items.lastModifiedDate,
    "barcode": items.barcode,
    "quantity": items.quantity,
    "status": items.status,
    "decsription": items.decsription,
    "fromStore": items.fromStore,
    "toStore":items.toStore
  }
  InventoryService.updateReceiveOrder(saveObj).then((res)=>{
if(res){
  toast.success("Order Received");
  this.receiveOrder();
}
  });
}

    render() {
        return (
            <div className="maincontent">
            <div className="row m-0 p-0">
              
                <div className="col-12 col-sm-3 p-l-0">
                  <div className="form-group fm-height">
                  <label>Scan Barcode</label>
                <input
                  type="search"                  
                  className="form-control frm-pr"
                  placeholder="Scan Barcode"
                  value={this.state.barcode}
                  onKeyPress={(e)=>{this.receiveOrder(0)}} 
                  onChange={(e) => this.setState({ barcode: e.target.value })}
                />
                <button type="button" className="scan" onClick={()=>{this.receiveOrder(0);this.setState({pageNumber:0})}}>
                            <img src={scan} /> SCAN
                          </button>
                  </div>                   
                </div>
                <div className='col-12 col-sm-2'>
                    <div className="form-group ">
                        <label>Status</label>
                        <select className='form-control'
                         value={this.state.status}
                         onChange={(e) => {
                           this.handleSelect(e);
                         }}>
                            {/* <option>Select Status</option> */}
                            {this.state.selectOption.map((i) => {
                  return (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  );
                })}
                        </select>
                    </div>
                </div>
                <div className='col-12 col-sm-2'>
                  <div className="form-group ">
                    <label>From Date</label>
                    <input
                    type="date"
                    className="form-control"
                    placeholder="DD/MM/YYYY"
                       value={this.state.fromDate}
                    onChange={(e) => this.setState({ fromDate: e.target.value })}
                    ></input>
                 </div>
                </div>
                <div className='col-12 col-sm-2'>
                  <div className="form-group">
                    <label>To Date</label>
                    <input
                    type="date"
                    className="form-control"
                    placeholder="DD/MM/YYYY"
                       value={this.state.toDate}
                    // onChange={(e) => this.setState({ toDate: e.target.value })}
                    onChange={(e)=>{
                      var startDate=new Date(this.state.fromDate);
                      var endDate=new Date(e.target.value)
                      if(startDate<=endDate){
                        this.setState({toDate:e.target.value})
                      }else{
                        toast.error("To date should be greater than From date")
                      }
                    }}
                    ></input>
                 </div>
                </div>
                <div className='col-sm-3 mt-4'>
                <button className="btn-unic-search active"
                                onClick={() => {
                                  this.receiveOrder(0);
                                  this.setState({pageNumber:0})
                                }}
                >Search</button>
                <button
                className="btn-clear m-l-2"
                onClick={() => {
                  this.clearSearch();
                }}
              >
                Clear
              </button>
                </div>
                <div className="col-12 col-sm-4 scaling-center p-l-0">
                  <h5 className="fs-18 mt-3 mb-2">
                    Received Orders
                  </h5>
                </div>
                <div className='row'>
                <div className="table-responsive p-0">
                  <table className="table table-borderless mb-1">
                    <thead>
                      <tr className="">
                        <th className="col-1">S.NO</th>
                        <th className="col-2">BARCODE</th>
                        <th className="col-1">FROM STORE</th>
                        <th className="col-1">TO STORE</th>
                        <th className="col-1">QTY</th>
                        <th className="col-2">TRANSFERRED DATE</th>
                        <th className="col-1">STATUS</th>
                        <th className="col-2">DESCRIPTION</th>
                        <th className="col-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                          {this.state?.receiveOrderList?.content?.length > 0 && this.renderTableData()}
                    {this.state?.receiveOrderList?.content?.length === 0  && <div className='no_records'><img src={confirm}></img> <label>No records found</label> </div>}
                    </tbody>
                  </table>
                  <div className="row m-0 pb-3 mb-5 mt-3">

{this.state.totalPages > 1 ? (
  <div className="d-flex justify-content-center">
  <ReactPageNation
  {...this.state.receiveOrderList}
  changePage={(pageNumber) => {
  this.changePage(pageNumber);
   }}
   />
   </div>
 ) : null} 
   </div>
                </div>
                </div>
            </div>
        </div>
        );
    }
}


export default ReceiveOrder;