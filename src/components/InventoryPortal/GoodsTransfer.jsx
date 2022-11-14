import React, { Component } from 'react';
import scan from '../../assets/images/scan.svg';
import edit from "../../assets/images/edit.svg";
import transfer from "../../assets/images/transfer_goods.svg";
import InventoryService from "../../services/InventoryService";
import { toast } from "react-toastify";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import close from '../../assets/images/cross.svg';
import URMService from "../../services/URM/URMService";
import ReactPageNation from "../../commonUtils/Pagination";
import { formatDate } from "../../commonUtils/FormatDate";
import confirm from '../../assets/images/conformation.svg';
import moment from "moment";

export default class GoodsTransfer extends Component {
constructor(props){
super(props);
this.state={
barcode:"",
fromDate: moment(new Date()).format("YYYY-MM-DD").toString(),
toDate: moment(new Date()).format("YYYY-MM-DD").toString(),
isDownload: false,
status:"",
barcodeSearchId:"",
barcodesList:[],
showModal:false,
storesList: [],
errors: {},
storeId:"",
isEdit:false,
pageNumber:0,
totalPages:0,
qty:"",
quantity:"",
tostoreId:"",
toStore:"",
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

this.getAllBarcodesList=this.getAllBarcodesList.bind(this);
this.listOfGoods=this.listOfGoods.bind(this);
this.saveTransfer=this.saveTransfer.bind(this);
this.goodsTransferCancel=this.goodsTransferCancel.bind(this);
this.changePage = this.changePage.bind(this);
this.changePage1 = this.changePage1.bind(this);
this.exportDownload = this.exportDownload.bind(this);
this.editGoodsTransfer=this.editGoodsTransfer.bind(this);
this.hideTransfer=this.hideTransfer.bind(this);
this.handleValidation = this.handleValidation.bind(this);
// this.editTransfer=this.editTransfer.bind(this);
this.openDownload=this.openDownload.bind(this);
this.closeDownload=this.closeDownload.bind(this);

}
hideTransfer=(e) =>{
  this.setState({ showModal: false,barcodesList:"",isEdit:false,quantity:"",description:"",tostoreId:""}
  ,()=>{
    this.listOfGoods();
  });
}

handleStoreChange = (e) => {
  if (e.target.value != "Select Store") {
  this.setState({ tostoreId: e.target.value });
  }
  this.state.errors["tostoreId"] = '';
};

handleQuantity = (e) => {
  this.state.errors["quantity"] = '';
  this.setState({ quantity: e.target.value });
};

handleSelect(e) {
  if (e.target.value != "SELECT STATUS") {
    this.setState({
      status: e.target.value,
    });
  }
}



handleValidation() {
  let errors = {};
  let formIsValid = true;

  if (!this.state.tostoreId) {
    formIsValid = false;
    errors["tostoreId"] = "Please Enter tostoreId";
  }
 

  if (!this.state.quantity) {
    formIsValid = false;
    errors["quantity"] = "Please Enter quantity";
  }

  this.setState({ errors: errors });
  return formIsValid;
}

openDownload(){
  this.setState({  isDownload:true,fromDate:moment(new Date()).format("YYYY-MM-DD").toString(),toDate:moment(new Date()).format("YYYY-MM-DD").toString()});
 
}

closeDownload() {
  this.setState({  isDownload: false });
}

clearSearch(){
  this.setState({
    status:"",
    barcodeSearchId:"",
    // fromDate:"",
    // toDate:"",
    fromDate:moment(new Date()).format("YYYY-MM-DD").toString(),
    toDate:moment(new Date()).format("YYYY-MM-DD").toString(),
    totalPages:"",
    barcodesList:[]
  },()=>{
    this.listOfGoods();
  });
}

componentDidMount(){
 
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
       this.getAllStoresList();
       this.listOfGoods();

      }
    );
  }else {
    this.setState(
      {
        clientId: user["custom:clientId1"],
        // domainId: user["custom:domianId1"]
      },
      () => {
        this.getAllStoresList();
        this.listOfGoods(0);
     
       
      }
    );
  }
}

getAllStoresList() {
  const parentStoreId = JSON.parse(sessionStorage.getItem('selectedstoreData'));
  URMService.getStoresByDomainId(this.state.clientId).then(
    (res) => {
      if (res) {
        res.data.forEach((ele, index) => {
          const obj = {
            id: ele.id,
            value: ele.name,
            label: ele.name,
          };
          this.state.storesList.push(obj);
        });
      }
      this.setState({ storesList: this.state.storesList });
    const storesList = this.state.storesList.filter(val => val.id !== parentStoreId.storeId);
    this.setState({ storesList: storesList });
     
    }
  );
}



getAllBarcodesList(pageNumber) {
  let saveJson = {};
  saveJson = {
    barcode: this.state.barcodeSearchId?this.state.barcodeSearchId.trim():null,
    storeId: this.state.selectedStoreId,
  };
  InventoryService.getAllBarcodesList(saveJson,pageNumber).then((res) => {
    if(saveJson.barcode&&saveJson.storeId){
      if (res.data.content.length !== 0) {
        this.state.barcodesList = res?.data;
        this.setState({
          barcodesList: this.state.barcodesList,
          totalPages: res.data.totalPages,
        });  
      }
      } else {
        this.setState({ barcodesList: [] });
       // toast.error("No Record Found");
      }
    })
}



changePage1(pageNumber) {
  let pageNo = pageNumber + 1;
  this.setState({ pageNumber: pageNo });
  this.getAllBarcodesList(pageNumber); 
}

listOfGoods(pageNumber){
  InventoryService.listOfGoods(this.state.barcodeSearchId,this.state.fromDate,this.state.status,this.state.toDate,this.state.selectedStoreId,pageNumber).then((res)=>{
    this.setState({
    goodsList:res.data,
    totalPages:res.data.totalPages
      });
   
     });
}


changePage(pageNumber) {
  let pageNo = pageNumber + 1;
  this.setState({ pageNumber: pageNo });
  this.listOfGoods(pageNumber); 
}


saveTransfer(){
  const formValid = this.handleValidation();
  if (formValid) {
let saveObj;
if(this.state.isEdit){
  saveObj={
            "id": this.state.id,
            "createdBy": null,
            "createdDate": this.state.createdDate,
            "modifiedBy": null,
            "lastModifiedDate": this.state.lastModifiedDate,
            "barcode": this.state.barcode,
            "quantity": this.state.quantity,
            "status":this.state.status,
            "description": this.state.description,
            "fromStore": this.state.selectedStoreId,
            "toStore": this.state.tostoreId,
            // "availableQuantity":this.state.qty
            "availableQuantity":this.state.availableQuantity
          }
    if(this.state.totalQty>=this.state.quantity){
    InventoryService.editGoodsTransfer(saveObj).then((res)=>{
    if(res){
      toast.success("Order Shipment is edited Successfully"); 
      this.hideTransfer();
    }
    });
  }else{
    toast.error("please enter correct quantity");
  }


}
else{
  saveObj={
    "barcode": this.state.barcode,
    "description": this.state.description,
    "fromStore": this.state.selectedStoreId,
    "quantity": this.state.quantity,
    "toStore": this.state.tostoreId,
  }
  if(this.state.qty>=this.state.quantity){
 InventoryService.saveTransfer(saveObj).then((res)=>{
    if(res){
      toast.success("Goods Transfer initiated"); 
      this.hideTransfer();
      this.listOfGoods();
     
    }  
  });
}
else{
  toast.error("please enter correct quntity");
}
}
}
else {
  toast.info("Please Enter all mandatory fields");
}

}



editGoodsTransfer(items){
this.setState({
  showModal: true,
  isEdit: true,
    id: items.id,
    createdBy: null,
    createdDate: items.createdDate,
    modifiedBy: null,
    lastModifiedDate: items.lastModifiedDate,
    barcode: items.barcode,
    quantity: items.quantity,
    status: items.status,
    description: items.description,
    storeName: items.fromStoreName,
    tostoreId: items.toStore,
    qty:items.availableQuantity,
    totalQty:items.quantity+items.availableQuantity 
});
}


goodsTransferCancel(items){
let saveObj;
saveObj={
  id:items.id
}
InventoryService.goodsTransferCancel(saveObj).then((res)=>{
if(res){
  toast.success("Selected Goods Transfer barcode details are canceled ");
}
this.listOfGoods();
});
}

renderGoodsTable(){
  return this.state?.goodsList?.content?.map((items, index) => {
    const {barcode,fromStoreName,toStoreName,quantity,createdDate,status,description} = items;
    let date = formatDate(items.lastModifiedDate);
    return (
      <tr className="" key={index}>
        <td className="col-1">{index + 1}</td>
        <td className="col-2">{barcode}</td>
        <td className="col-1">{fromStoreName}</td>
        <td className="col-1">{toStoreName}</td>
        <td className="col-1">{quantity}</td>
        {/* <td className="col-2">{date.substring(0,10)}</td> */}
        <td className="col-2">{date}</td>
        <td className="col-1">{status}</td>
        <td className="col-2">{description}</td>
        
        <td className="col-1 text-center">
        {items.status==="INITIATED"?
      <img
        src={edit}
        className="w-12 pb-3"
        onClick={(e) => {this.editGoodsTransfer(items)}}
      />:null}
  {items.status==="INITIATED"?
        <i className='icon-close fs-24 m-l-2 cursor text-red' onClick={(e)=>{this.goodsTransferCancel(items)}}></i>:null}
       {/* <button className="btn-unic-search active" onClick={(e)=>{this.goodsTransferCancel(items)}}>Cancel</button> */}
     </td>
    </tr>
    );
  });
}


exportDownload() {
  InventoryService.exportDownload(this.state.fromDate?this.state.fromDate:"", this.state.selectedStoreId,this.state.toDate?this.state.toDate:"")
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

renderTableData() {
  return this.state?.barcodesList?.content?.map((items, index) => {
    const {barcode,domainType,itemMrp,createdDate,qty} = items;
    let date = formatDate(items.createdDate);
    return (
      <tr className="" key={index}>
       <td className="col-1">{index + 1}</td>
        <td className="col-3">{barcode}</td>
        <td className="col-2">{domainType}</td>
        <td className="col-1">{itemMrp}</td>
        <td className="col-3">{date}</td>
        <td className="col-1">{qty}</td>
        <td className="col-1">
      <img
        src={transfer} className="w-12 pb-2" onClick={(e) => this.transfer(items)}
      />
     </td>
    </tr>
    );
  });
}

transfer(items){
  this.setState({
    showModal:true,
    // isEdit:false,
    barcode:items.barcode,
    storeName:items.storeName,
    qty:items.qty,
   
  });
}





    render() {
        return (
        <div className="maincontent">
            <div className="row m-0 p-0">
            <Modal isOpen={this.state.isDownload} size="sm">
                    <ModalHeader>
                         <div>
                           Goods Transfer Download
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
                        <button className="btn-unic active fs-12" onClick={this.exportDownload} name="save">Download file</button>
                    </ModalFooter>
                </Modal>

             <Modal isOpen={this.state.showModal} size="lg">
                    <ModalHeader>
                         {/* <div>
                           Goods Transfer
                         </div> */}
                           {
                            !this.state.isEdit && (
                                <div>
                                     Goods Transfer
                                  

                                    </div>
                               
                            )
                        }
                        {
                            this.state.isEdit && (
                                <div>
                                Edit transfer
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
                                        <label>Scan</label>
                                        <input type="text" className="form-control" name="barcode" 
                                         value={this.state.barcode}
                                         disabled={!this.state.isEdit || this.state.isEdit}
                                      //  onChange={(e) => this.setState({ barcodeSearchId: e.target.value })}
                                  
                                            autoComplete="off" />
                                             {/* <button type="button" className="scan">
                            <img src={scan} /> SCAN
                          </button> */}
                                             <div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 scaling-mb">
                                    <div className="form-group">
                                    <label>From Store</label>
                                        <input type="text" className="form-control" name="fromStore"
                                            value={this.state.storeName}
                                            disabled={!this.state.isEdit || this.state.isEdit}
                                            // onChange={(e) => this.setState({ fromStore: e.target.value })}
                                            autoComplete="off"
                                            />
                                    </div>
                                </div>

                            

                <div className="col-12 col-sm-4 scaling-mb">
                   <div className="form-group">
                   <label>
                    To Store
                    </label>
                     <select
                     className="form-control"
                     onChange={this.handleStoreChange}
                      value={this.state.tostoreId}
                    isOptionDisabled={(option) => option.isDisabled}
                    
                      
                     >
                      <option >
                        Select Store
                      </option>
                      {this.state.storesList.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.value}
                      </option>
                       ))}
                      </select>
                      <div>
                <span style={{ color: "red" }}>{this.state.errors["tostoreId"]}</span>
                </div>
                   </div>
                  </div>
                              <div className="col-12 col-sm-4 scaling-mb">
                                    <div className="form-group">
                                        <label>Available Quantity</label>
                                        <input type="text" className="form-control"
                                            value={this.state.qty} 
                                            disabled={!this.state.isEdit || this.state.isEdit}
                                            // onChange={this.validation}
                                            autoComplete="off" />
                                             <div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 scaling-mb">
                                    <div className="form-group">
                                        <label>Quantity</label>
                                        <input type="email" className="form-control" 
                                            value={this.state.quantity}
                                            //  disabled={this.state.isEdit}
                                            onChange={this.handleQuantity}

                                            autoComplete="off" />

<div>
                                             <span style={{ color: "red" }}>{this.state.errors["quantity"]}</span>

                                        </div>

                                             <div>
                                        </div>

                                    </div>
                                </div>
                              
                                <div className="col-12 col-sm-4 scaling-mb">
                                    <div className="form-group">
                                        <label>Description</label>
                                        <input type="text" className="form-control" placeholder="write Description" name="Description"
                                            value={this.state.description}
                                            // disabled={this.state.isEdit}
                                            onChange={(e) => this.setState({ description: e.target.value })}
                                            autoComplete="off" />
                                    </div>
                                </div>
                                </div>
                               
                        </div>
                      
                                                       
                        </ModalBody>
                    <ModalFooter>
                        <button className="btn-unic" onClick={this.hideTransfer} name="cancel">Cancel</button>
                        <button className="btn-unic active fs-12" onClick={this.saveTransfer} name="save">Transfer</button>
                    </ModalFooter>
                </Modal>

                <div className="col-12 col-sm-3 p-l-0">
                  <div className="form-group fm-height">
                  <label>Scan Barcode</label>
                <input
                  type="search"   
                  value={this.state.barcodeSearchId}
                  onKeyPress={this.getAllBarcodesList}               
                  className="form-control frm-pr"
                  placeholder="Scan Barcode"
                     onChange={(e) => this.setState({ barcodeSearchId: e.target.value })}
                />
                          <button type="button" className="scan" onClick={()=>{this.getAllBarcodesList(0);this.setState({pageNumber:0})}}>
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
                        }}
                      >
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
                    onChange={(e) => this.setState({ fromDate: e.target.value })}></input>
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
                        toast.error("To date should be greater than From date");
                      }
                    }}
                    ></input>
                 </div>
                </div>
                <div className='col-sm-3 mt-4'>
                <button className="btn-unic-search active" onClick={()=>{this.listOfGoods(0);this.setState({pageNumber:0});}}>Search</button>

                <button
                className="btn-clear m-l-2"
                onClick={() => {
                  this.clearSearch();
                }}
              >
                Clear
              </button>
                {/* <button className={"btn-unic active m-l-2" + (this.state.fromDate.length===0 && this.state.toDate.length===0 ? " btn-disable":"" )}
                onClick={() => { this.exportDownload() }}  name="file"
                disabled={this.state.fromDate.length===0 && this.state.toDate.length===0}                
                >Download</button> */}
                 <button className="btn-unic active m-l-2" onClick={this.openDownload}  name="file"
             
                >Download</button>
                
               </div>

               <div className="col-12 col-sm-4 scaling-center p-l-0">
                  <h5 className="fs-18 mt-3 mb-2">
                    Goods
                  </h5>
                </div>

                <div className='row'>
                <div className="table-responsive p-0">
                 {  this.state?.barcodesList && this.state?.barcodesList?.content?.length>0&& <table className="table table-borderless mb-1">
                    <thead>
                      <tr className="">
                        <th className="col-1">S.NO</th>
                        <th className="col-3">BARCODE</th>
                        <th className="col-2">Domain</th>
                        <th className="col-1">MRP</th>
                        <th className="col-3">CREATED DATE</th>
                        <th className="col-1">QTY</th>
                        <th className="col-1">ACTION</th>
                       </tr>
                    </thead>
                    <tbody>
                    {this.renderTableData()}
                       </tbody>
                  </table> }

                  <div>
                  {this.state.totalPages > 1 ? (
                    <div className="row m-0">
                  <div className="d-flex justify-content-center">
                 <ReactPageNation
                  {...this.state.barcodesList}
                  changePage1={(pageNumber) => {
                    this.changePage(pageNumber);
                    }}
                   />
                  </div>
                  </div>
                ) : null} 
                  </div>
                </div>
                </div>
                 <div className='row'>
                <div className="table-responsive p-0">
                  {this.state?.barcodesList.length ==0 && <table className="table table-borderless mb-1">
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
                         {this.state.goodsList?.content?.length > 0 && this.renderGoodsTable()}
                    {this.state.goodsList?.content?.length === 0  && <div className='no_records'><img src={confirm}></img> <label>No records found</label> </div>}
                       </tbody>
                  </table>
                   }

                  <div className="row m-0">

                  {this.state.totalPages > 1 ? (
                  <div className="d-flex justify-content-center">
                 <ReactPageNation
                  {...this.state.goodsList}
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

