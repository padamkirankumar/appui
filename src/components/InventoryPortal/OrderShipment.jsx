import React, { Component } from 'react';
import scan from '../../assets/images/scan.svg';
import edit from "../../assets/images/edit.svg";

import checkin from "../../assets/images/check_in_01.svg";
import InventoryService from "../../services/InventoryService";
import { toast } from "react-toastify";
import ReactPageNation from "../../commonUtils/Pagination";
import  PrivilegesList  from '../../commonUtils/PrivilegesList';
import { formatDate } from "../../commonUtils/FormatDate";
import confirm from '../../assets/images/conformation.svg';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import moment from "moment";


class OrderShipment extends Component {
  constructor(props){
    super(props);
    this.state={
      isDownload: false,
      showModal:false,
      fromDate: moment(new Date()).format("YYYY-MM-DD").toString(),
      toDate: moment(new Date()).format("YYYY-MM-DD").toString(),
      orderList:[],
      barcodeList:[],
      showModal:false,
      pageNumber:0,
      totalPages:0,
    };
    this.orderShipment=this.orderShipment.bind(this);
    this.updateOrderShipment=this.updateOrderShipment.bind(this);
    // this.getAllBarcodesList=this.getAllBarcodesList.bind(this);
    this.changePage = this.changePage.bind(this);
    this.orderExportDownload = this.orderExportDownload.bind(this);
    this.openDownload=this.openDownload.bind(this);
    this.closeDownload=this.closeDownload.bind(this);
  }


  componentWillMount(){
    const childPrivileges =  PrivilegesList('Order Shipment');
    childPrivileges.then((res) => {
      if(res) {
        console.log(res);
        const result = res.sort((a , b) => a.id - b.id);
        // this.setState({
          
        //   viewrebarcode: result[0], 
        //   print:result[1]  
        // });
        
      }
    });



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
         this.orderShipment();
        }
      );
    }else {
      this.setState(
        {
          clientId: user["custom:clientId1"],
          // domainId: user["custom:domianId1"]
        },
        () => {
          this.orderShipment();
        }
      );
    }
    // this.keyBinds();
  }

  openDownload(){
    this.setState({  isDownload:true,fromDate:moment(new Date()).format("YYYY-MM-DD").toString(),toDate:moment(new Date()).format("YYYY-MM-DD").toString()});
   
  }

  closeDownload() {
    this.setState({  isDownload: false });
  }

  clearSearch(){
    this.setState({
      orderList:[],
      barcodeSearchId:"",
      fromDate:moment(new Date()).format("YYYY-MM-DD").toString(),
      toDate:moment(new Date()).format("YYYY-MM-DD").toString(),
    },()=>{
      this.orderShipment();
    });
  }


  // keyBinds() {
  //   window.addEventListener('keydown', (e) => { 
  //     if(e.altKey && String.fromCharCode(e.keyCode).toLocaleLowerCase() === 'k') {
  //       e.preventDefault()
  //       e.stopPropagation()
  //       if(this.state?.orderList?.content?.length === 1){
  //         console.log("sra",this.state.orderList.content[0])
  //          this.updateOrderShipment(this.state.orderList.content[0]);       
  //       }
  //       // }else{
  //       //   this.updateOrderShipment(this.state.orderList.content[0]);  
  //       // }
  //     }
  //   })
  // }


orderShipment(pageNumber){
InventoryService.orderShipment(this.state.barcodeSearchId,this.state.selectedStoreId,this.state.fromDate,this.state.toDate,pageNumber).then((res)=>{
this.setState({
      orderList:res.data,
      totalPages:res.data.totalPages
  });

});
}



changePage(pageNumber) {
  console.log(">>>page", pageNumber);
  let pageNo = pageNumber + 1;
  this.setState({ pageNumber: pageNo });
  this.orderShipment(pageNumber); 
}

getAllBarcodesList() {
  let saveJson = {};
  saveJson = {
    barcode: this.state.barcodeSearchId?this.state.barcodeSearchId.trim():null,
    storeId: this.state.selectedStoreId,
  };
  InventoryService.getAllBarcodesList(saveJson).then((res) => {
      if (res.data.content.length !== 0) {
        this.state.barcodesList = res?.data;
        this.setState({
          barcodesList: this.state.barcodesList,
          totalPages: res.data.totalPages,
        });
      } else {
        this.setState({ barcodesList: [] });
        toast.error("No Record Found");
      }
    }); 
}



renderTableData(){
    return this.state?.orderList?.content?.map((items,index)=>{
    const {barcode,fromStoreName,toStoreName,quantity,createdDate,status,description}=items;
    let date = formatDate(items.lastModifiedDate)
    return(
      <tr className="" key={index}>
      <td className="col-1">{index+1}</td>
      <td className="col-2">{barcode}</td>
      <td className="col-1">{fromStoreName}</td>
      <td className="col-1">{toStoreName}</td>
      <td className="col-1">{quantity}</td>
      {/* <td className="col-2">{date.substring(0,10)}</td> */}
      <td className="col-2">{date}</td>
      <td className="col-1">{status}</td>
      <td className="col-3">{description}</td>
      <td className="col-1 text-center">
        {items.status=="INITIATED"?
      <img
        src={checkin} className="w-12 pb-2" onClick={(e) => this.updateOrderShipment(items)}
      />:null}
     </td>
    </tr>
    )
  })
}



updateOrderShipment(items){
  let saveObj;
  saveObj={
    "id": items.id,
    "createdBy": null,
    "createdDate": items.createdDate,
    "modifiedBy": null,
    "lastModifiedDate": items.lastModifiedDate,
    "barcode": items.barcode,
    "quantity": items.quantity,
    "status": items.status,
    "decsription": items.decsription,
    "fromStore": items.fromStore,
    "toStore": items.toStore
  }

InventoryService.updateOrderShipment(saveObj).then((res)=>{
  console.log(">>>???????????",res.data)
if(res){
  toast.success("Order Shipment is Updated Successfully");
  this.orderShipment();
}
});
}



orderExportDownload() {
  InventoryService.orderExportDownload(this.state.fromDate?this.state.fromDate:"", this.state.selectedStoreId,this.state.toDate?this.state.toDate:"")
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file.xlsx'); 
      document.body.appendChild(link);
      link.click();
      this.closeDownload();
    });
}


    render() {
        return (
            <div className="maincontent">
            <div className="row m-0 p-0">
            <Modal isOpen={this.state.isDownload} size="sm">
                    <ModalHeader>
                         <div>
                           Order Shipment Download
                         </div>
                        </ModalHeader>
                        <ModalBody>
                        <div className="p-3">
                            <div className="row">
                  <div className='col-12'>
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

                <div className='col-12 mt-3'>
                  <div className="form-group ">
                    <label>To Date</label>
                    <input
                    type="date"
                    className="form-control"
                    placeholder="DD/MM/YYYY"
                    value={this.state.toDate}
                    // onChange={(e) => this.setState({ toDate: e.target.value })}
                    onChange={(e)=>{
                      var startDate=new Date(this.state.fromDate);
                      var endDate=new Date(e.target.value);
                      if(startDate<=endDate){
                        this.setState({toDate:e.target.value})
                      }else{
                        toast.error("To date should be greater than From date ");
                      }
                    }}
                    ></input>
                 </div>
                </div>
                    </div>
                     </div>
                     </ModalBody>
                    <ModalFooter>
                        <button className="btn-unic" onClick={this.closeDownload} name="cancel">Cancel</button>
                        <button className="btn-unic active fs-12" onClick={this.orderExportDownload} name="save">Download file</button>
                    </ModalFooter>
                </Modal>

              <div className="col-12 col-sm-3 p-l-0">
                  <div className="form-group fm-height">
                  <label>Scan Barcode</label>
                <input
                  type="search"   
                  value={this.state.barcodeSearchId}
                  onKeyPress={()=>{this.orderShipment(0);this.setState({pageNumber:0});}}               
                  className="form-control frm-pr"
                  placeholder="Scan Barcode"
                     onChange={(e) => this.setState({ barcodeSearchId: e.target.value })}
                />
                          <button type="button" className="scan" onClick={()=>{this.orderShipment(0);this.setState({pageNumber:0});}}>
                            <img src={scan} /> SCAN
                          </button>
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
                  <div className="form-group ">
                    <label>To Date</label>
                    <input
                    type="date"
                    className="form-control"
                    placeholder="DD/MM/YYYY"
                    value={this.state.toDate}
                    // onChange={(e) => this.setState({ toDate: e.target.value })}
                    onChange={(e)=>{
                      var startDate=new Date(this.state.fromDate);
                      var endDate=new Date(e.target.value);
                      if(startDate<=endDate){
                        this.setState({toDate:e.target.value})
                      }else{
                        toast.error("To date should be greater than From date ");
                      }
                    }}
                    ></input>
                 </div>
                </div>
                <div className='col-sm-3 mt-4'>
                {/* <button className="btn-unic-search active">Search</button> */}
                <button className="btn-unic-search active" onClick={()=>{this.orderShipment(0);this.setState({pageNumber:0});}}>Search</button>
                <button
                className="btn-clear m-l-2"
                onClick={() => {
                  this.clearSearch();
                }}
              >
                Clear
              </button>
              {/* <button className={"btn-unic active m-l-2" + (this.state.fromDate.length===0 && this.state.toDate.length===0 ? " btn-disable":"" )}
                onClick={() => { this.orderExportDownload() }}  name="file"
                disabled={this.state.fromDate.length===0 && this.state.toDate.length===0}                
                >Download</button> */}

                <button className="btn-unic active m-l-2"
                onClick={this.openDownload}  name="file"
                             
                >Download</button>
                
               </div>

                <div className="col-12 col-sm-4 scaling-center p-l-0">
                  <h5 className="fs-18 mt-3 mb-2">
                    Order Shipments
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
                        <th className="col-3">DESCRIPTION</th>
                        <th className="col-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                         {/* {this.renderTableData()} */}
                         {/* this.state?.orderList?.content? */}
                         {this.state?.orderList?.content?.length > 0 && this.renderTableData()}
                    {this.state?.orderList?.content?.length === 0  && <div className='no_records'><img src={confirm}></img> <label>No records found</label> </div>}
                         
                    </tbody>
                  </table>

                  <div className="row m-0 pb-3 mb-5 mt-3">

                   {this.state.totalPages > 1 ? (
                     <div className="d-flex justify-content-center">
                     <ReactPageNation
                     {...this.state.orderList}
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

export default OrderShipment;