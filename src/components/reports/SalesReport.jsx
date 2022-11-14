import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import print from "../../assets/images/print.svg";
import view from "../../assets/images/view.svg";
import ListOfSaleBillsService from "../../services/Reports/ListOfSaleBillsService";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import moment from "moment";
import ReactPageNation from "../../commonUtils/Pagination";
import { toast } from "react-toastify";
import { formatDate } from "../../commonUtils/FormatDate";

export default class SalesReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateFrom: moment(new Date()).format("YYYY-MM-DD").toString(),
      dateTo: moment(new Date()).format("YYYY-MM-DD").toString(),
      // dateFrom: "",
      // dateTo: "",
      pageNumber:0,
      totalPages:0,
      custMobileNumber: null,
      billStatus: null,
      invoiceNumber: null,
      empId: null,
      sbList: [],
      sbDetailsList: [],
      isView: false,
      domainId: "",
      storeId: "",
    };
    this.getSaleBills = this.getSaleBills.bind(this);
    this.viewReport = this.viewReport.bind(this);
    this.closeViewReport = this.closeViewReport.bind(this);
    this.validation = this.validation.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  componentWillMount() {
    const storeId = sessionStorage.getItem("storeId");
    const domainData = JSON.parse(sessionStorage.getItem("selectedDomain"));
    // if (domainData.label == "Textile") {
    //   this.setState({ domainId: 1 });
    // } else if (domainData.label == "Retail") {
    //   this.setState({ domainId: 2 });
    // }

    this.setState({ storeId: storeId });
  }

  // clear = () => {
  //   this.setState({
  //     dateFrom: '',
  //     dateTo: '',
  //     custMobileNumber: '',
  //     billStatus:'',
  //     invoiceNumber:'',
  //     empId:''
  //   }, () => {
  //     this.getSaleBills(0);
  //   });

  // }

 clearSearch() {
    this.setState({
      sbList:[],
      dateFrom:moment(new Date()).format("YYYY-MM-DD").toString(),
      dateTo:moment(new Date()).format("YYYY-MM-DD").toString(),
      custMobileNumber: '',
      billStatus:'',
      invoiceNumber:'',
      empId:''
    });
  }


  getSaleBills(pageNumber) {
    const obj = {
      dateFrom: this.state.dateFrom ? this.state.dateFrom : undefined,
      dateTo: this.state.dateTo ? this.state.dateTo : undefined,
      custMobileNumber: this.state.custMobileNumber
        ? "+91".concat(this.state.custMobileNumber)
        : undefined,
      billStatus: this.state.billStatus ? this.state.billStatus : undefined,
      invoiceNumber: this.state.invoiceNumber
        ? (this.state.invoiceNumber).trim()
        : undefined,
      empId: this.state.empId ? (this.state.empId).trim() : undefined,
      // domainId: this.state.domainId ? parseInt(this.state.domainId) : undefined,
      storeId: this.state.storeId ? parseInt(this.state.storeId) : undefined,
    };
    ListOfSaleBillsService.getSaleBills(obj,pageNumber).then((res) => {
      console.log(res.data.result);
      let data = res.data.result.newSale;
      this.setState({
        sbList: res.data.result.newSale,
        totalPages:res?.data?.result?.newSale?.totalPages
      });
    });
  }

  viewReport(invoiceNumber) {
      let filterData = this.state.sbList.content.filter(
      (x) => x.invoiceNumber == invoiceNumber
    );

    let obj = {
      barCode: "",
      section: "",
      empId: "",
      hsnCode: "",
      quantity: "",
      itemPrice: "",
      discount: "",
      manualDiscount:"",
      promoDiscount:"",
      taxLabel: "",
      // taxableAmount: "",
      taxValue: "",
      cgst: "",
      sgst: "",
      igst: "",
      netValue: "",
      totalManualDisc:"",
      totalPromoDisc:"",
      gvAppliedAmount:"",
      returnSlipAmount:""
    };
    let detailsArry = [];
    var combineList = {};
    filterData[0].lineItemsReVo.forEach((itm) => {
      var barCode = itm.barCode;
      itm.quantity = parseInt(itm.quantity)
      itm.netValue = parseInt(itm.netValue)
      itm.igst = parseInt(itm.igst)
      itm.sgst = parseInt(itm.sgst)
      itm.cgst = parseInt(itm.cgst)
      itm.taxValue = parseInt(itm.taxValue)
      
    if (!combineList[barCode]) {
      return combineList[barCode] = itm
    }
     return combineList[barCode].quantity = combineList[barCode].quantity + itm.quantity ,
     combineList[barCode].netValue = combineList[barCode].netValue + itm.netValue ,
     combineList[barCode].igst = combineList[barCode].igst + itm.igst ,
     combineList[barCode].sgst = combineList[barCode].sgst + itm.sgst ,
     combineList[barCode].cgst = combineList[barCode].igst + itm.cgst ,
     combineList[barCode].taxValue = combineList[barCode].taxValue + itm.taxValue 
     
})
var combineList2 = []
Object.keys(combineList).forEach((key) => {
combineList2.push(combineList[key])
})
const clearList = [...combineList2]
clearList.map((d) => {
      obj = {
        empId: filterData[0].empId,
        itemPrice: d.itemPrice,
        discount: filterData[0].discount,
        manualDiscount:d.manualDiscount,
        promoDiscount:d.promoDiscount,
        barCode: d.barCode,
        section: d.section,
        netValue: d.netValue,
        hsnCode: d.hsnCode,
        quantity: d.quantity,
        taxValue: d.taxValue,
        cgst: d.cgst,
        sgst: d.sgst,
        igst: d.igst,
      };
      detailsArry.push(obj);
    });
  // let date = formatDate (filterData[0].createdDate);
    this.setState({
      // mobileNumber:
      //   filterData[0].mobileNumber.length > 10
      //     ? filterData[0].mobileNumber.substring(7, 17)
      //     : filterData[0].mobileNumber,

      mobileNumber: filterData[0].mobileNumber,
      // filterData[0].mobileNumber.length > 10
      //   ? filterData[0].mobileNumber.substring(3, 14)
      //   : filterData[0].mobileNumber,

      customerName: filterData[0].customerName,
      createdDate:formatDate(filterData[0].createdDate),
      invoiceNumber: filterData[0].invoiceNumber,
      totalManualDisc:filterData[0].totalManualDisc,
      totalPromoDisc:filterData[0].totalPromoDisc,
      gvAppliedAmount:filterData[0].gvAppliedAmount,
      returnSlipAmount:filterData[0].returnSlipAmount,
      netPayableAmount:filterData[0].netPayableAmount,
      lineItemData: detailsArry,
      isView: true,
    });
  }

  closeViewReport() {
    this.setState({ isView: false });
  }

  renderTableData() {
    console.log("this.state.sbList?.content",this.state?.sbList?.content)
    return this.state.sbList?.content?.map((items, index) => {
      const {
        invoiceNumber,
        empId,
        netPayableAmount,
        discount,
        createdDate,
        status,
        billStatus,
        newsaleId,
        userId
      } = items;
      let date = formatDate (items.createdDate);
      return (
        <tr className="" key={index}>
          <td className="col-1">{index + 1}</td>
          <td className="col-2">{invoiceNumber}</td>
          <td className="col-1">{empId}</td>
          <td className="col-2">{netPayableAmount}</td>
          <td className="col-1">{discount}</td>
          <td className="col-2">{date}</td>
          <td className="col-2">{status}</td>
          <td className="col-2 text-center">
            <img src={print} className="w-12 m-r-2 pb-2" />
            <img
              src={view}
              className="w-12 pb-2"
              onClick={() => {
                this.viewReport(invoiceNumber);
              }}
            />
            <i className="icon-delete m-l-2 fs-16"></i>
          </td>
        </tr>
      );
    });
  }

  renderPopupTableData() {
    console.log("enter");
    if (this.state.lineItemData) {
      return this.state.lineItemData.map((items, index) => {
        const {
          barCode,
          section,
          empId,
          hsnCode,
          quantity,
          itemPrice,
          discount,
          approvedBy,
          reason,
          taxLabel,
          taxValue,
          // taxableAmount,
          cgst,
          sgst,
          igst,
          netValue,
          promoDiscount,
          manualDiscount
        } = items;
        return (
          <tr key={index}>
            <td width="10%">{barCode}</td>
            <td width="10%">{section}</td>
            <td width="5%">{empId}</td>
            <td width="10%">{hsnCode}</td>
            <td width="5%">{quantity}</td>
            <td width="5%">{itemPrice}</td>
            {/* <td width="5%">{discount}</td> */}
            {/* <td width="5%">{manualDiscount}</td> */}
            <td width="5%">{promoDiscount}</td>
            <td width="10%">{approvedBy}</td>
            <td width="5%">{reason}</td>
            <td width="10%">{taxValue}</td>
            <td width="5%">{cgst}</td>
            <td width="10%">{sgst}</td>
            <td width="5%">{igst}</td>
            <td width="10%">{netValue}</td>
          </tr>
        );
      });
    }
  }

  validation(e) {
    // this.setState({
    //   [e.target.id]: e.target.value,
    //   mobileNumber: e.target.value,
    // });

    const regex = /^[0-9\b]+$/;
    const value = e.target.value;
    if (value === "" || regex.test(value)) {
      this.setState({
        [e.target.id]: e.target.value,
        custMobileNumber: e.target.value,
      });
    } else {
      // toast.error("pls enter numbers");
    }
  }


  changePage(pageNumber) {
    console.log(">>>page", pageNumber);
    let pageNo = pageNumber + 1;
    this.setState({ pageNumber: pageNo });
    this.getSaleBills(pageNumber); 
  }

  render() {
    return (
      <div className="maincontent">
        <Modal isOpen={this.state.isView} className="modal-fullscreen">
          <ModalHeader>Sales Bill Details </ModalHeader>
          <ModalBody className="p-l-5 p-r-5 pt-4">
            <div className="row mb-3">
              <div className="col-3 p-l-0">
                <div className="">
                  <label>Memo No : </label>{" "}
                  <span className="font-bold fs-13">
                    {" "}
                    {this.state.invoiceNumber}
                  </span>
                </div>
              </div>
              <div className="col-3">
                <div className="">
                  <label>Customer : </label>{" "}
                  <span className="font-bold fs-13">
                    {this.state.customerName}
                  </span>
                </div>
              </div>

              <div className="col-3">
                <div className="">
                  <label>Mobile : </label>{" "}
                  <span className="font-bold fs-13">
                    {" "}
                    {this.state.mobileNumber}
                  </span>
                </div>
              </div>
              <div className="col-3">
                <div className="">
                  <label>Date : </label>{" "}
                  <span className="font-bold fs-13">
                    {" "}
                    {this.state.createdDate}
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
            <div className="table-responsive p-0">
              <table className="table table-borderless mb-1">
                <thead>
                  <tr className="m-0 p-0">
                    <th width="10%">Barcode</th>
                    <th width="10%">Section</th>
                    <th width="5%">EMPID</th>
                    <th width="10%">HSN Code</th>
                    <th width="5%">QTY</th>
                    <th width="5%">mrp</th>
                    <th width="5%">Promo Disc</th>
                    <th width="10%">APPROVED BY</th>
                    <th width="5%">REASON</th>
                    <th width="10%">Tax Amount</th>
                    <th width="5%">CGST</th>
                    <th width="10%">SGST</th>
                    <th width="5%">IGST</th>
                    <th width="10%">Net</th>
                  </tr>
                </thead>
                <tbody>{this.renderPopupTableData()}</tbody>
              </table>
              </div>




              <div className="rect-red m-0 m-0 mb-4">
            <div className="row">
              {/* <div className="col-1 col-sm-3 text-center"></div> */}
              <div className="col-2 col-sm-2 text-center"></div>

              {/* <div className="col-3 col-sm-2"> */}
             <div className="col-2 col-sm-2 p-l-1">
                <label>MANUAL DISCOUNT</label>
                {/* <h6 className="pt-2">₹ 7,500.00</h6> */}
                <h6 className="pt-2 mb-0">₹ {this.state.totalManualDisc}</h6>
              </div>
              {/* <div className="col-5 col-sm-4"> */}
              <div className="col-2 col-sm-2 p-l-1">
                <label>INVOICE PROMO DISCOUNT</label>
                <h6 className="pt-2 mb-0">₹ {this.state.totalPromoDisc}</h6>
              </div>
              {/* <div className="col-3 col-sm-2  pt-2 text-left text-red p-r-4"> */}
              <div className="col-2 col-sm-2 text-left text-red p-r-4 p-l-1">
                <label className="text-red">GV APPLIED AMOUNT</label>
                <h6 className="fs-16 text-red mb-0">₹ {this.state.gvAppliedAmount}</h6>
              </div>

              <div className="col-2 col-sm-2 text-left text-red p-r-4 p-l-1">
                <label className="text-red">RT CLAIM AMOUNT</label>
                <h6 className="fs-16 text-red mb-0">₹ {this.state.returnSlipAmount}</h6>
              </div>

              <div className="col-2 col-sm-2 text-left text-red p-r-4 p-l-1">
                <label className="text-red">TOTAL AMOUNT</label>
                <h6 className="fs-16 text-red mb-0">₹ {this.state.netPayableAmount}</h6>
              </div>
                  <div className="col-1"></div>
                  <div className="col-1"></div>
                  <div className="col-1"></div>
                  <div className="col-1"></div>
                  <div className="col-1"></div>
            </div>
          </div>








            </div>
          </ModalBody>
          <ModalFooter>
            <button className="pt-2 btn-bdr" onClick={this.closeViewReport}>
              CANCEL
            </button>
            {/* <button
              className="btn btn-bdr active fs-12"
              onClick={this.closeViewReport}
            >
              SAVE
            </button> */}
          </ModalFooter>
        </Modal>
        <div className="row">
          <div className="col-12 col-sm-2 mt-2">
            <div className="form-group">
              <label>From Date</label>
              <input
                type="date"
                className="form-control"
                placeholder="FROM DATE"
                value={this.state.dateFrom}
                onChange={(e) => this.setState({ dateFrom: e.target.value })}
              />
            </div>
          </div>
          <div className="col-12 col-sm-2 mt-2">
            <div className="form-group">
              <label>To Date</label>
              <input
                type="date"
                className="form-control"
                placeholder="TO DATE"
                value={this.state.dateTo}
                onChange={(e)=>{
                  var startDate=new Date(this.state.dateFrom);
                  var endDate=new Date(e.target.value);
                  if(startDate<=endDate){
                    this.setState({dateTo:e.target.value});
                  }else{
                    toast.error("To date should be greater than From date");
                  }
                }}
              />
            </div>
          </div>
          <div className="col-12 col-sm-2 mt-2">
            <div className="form-group">
              <label>Bill Status</label>
              <select
                className="form-control"
                value={this.state.billStatus}
                onChange={(e) => this.setState({ billStatus: e.target.value })}
              >
                <option>BILLPOSITION</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
          <div className="col-12 col-sm-2 mt-2">
            <div className="form-group">
              <label>Invoice / Bill No</label>
              <input
                type="text"
                className="form-control"
                placeholder="INVOICE/BILL NO"
                value={this.state.invoiceNumber}
                onChange={(e) =>
                  this.setState({ invoiceNumber: e.target.value })
                }
              />
            </div>
          </div>
          <div className="col-12 col-sm-2 mt-2">
            <div className="form-group">
              <label>Mobile</label>
              <input
                type="text"
                className="form-control"
                placeholder="MOBILE NUMBER"
                value={this.state.custMobileNumber}
                maxLength="10"
                minLength="10"
                onChange={this.validation}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="col-12 col-sm-2 mt-2">
            <div className="form-group">
              <label>EMP ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="EMP ID"
                value={this.state.empId}
                onChange={(e) => this.setState({ empId: e.target.value })}
              />
            </div>
          </div>
          <div className="col-sm-4 col-12 mt-2 scaling-mb scaling-center">
            <div className="form-group">
              <button
                className="btn-unic-search active"
                onClick={()=>{this.getSaleBills(0);this.setState({pageNumber:0})}}
              >
                Search
              </button>
              <button
                className="btn-clear m-l-2"
                onClick={() => {
                  this.clearSearch();
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        <h5 className="pl-4 mt-3 scaling-center fs-18 scaling-mb">
          New Sales Report
        </h5>
        <div className="row m-0 p-0 mb-3">
          <div className="table-responsive p-0">
            <table className="table table-borderless mb-1 mt-2">
              <thead>
                <tr className="m-0 p-0">
                  <th className="col-1">S.NO</th>
                  <th className="col-2">Invoice Number</th>
                  <th className="col-1">EMP ID</th>
                  <th className="col-2">TOTAL AMOUNT</th>
                  <th className="col-1">DISCOUNT</th>
                  <th className="col-2">INVOICE DATE</th>
                  <th className="col-2">Bill Position</th>
                  <th className="col-2"></th>
                </tr>
              </thead>
              <tbody>{this.renderTableData()}</tbody>
            </table>
            <div className="row m-0 mt-3">
            {this.state.totalPages > 1 ? (
            <div className="d-flex justify-content-center">
                 <ReactPageNation
                  {...this.state.sbList}
                  changePage={(pageNumber) => {
                    this.changePage(pageNumber);
                    }}
                   />
                  </div>
                   ):null}</div>
          </div>
        </div>
      </div>
    );
  }
}
