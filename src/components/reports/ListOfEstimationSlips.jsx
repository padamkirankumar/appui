import React, { Component } from "react";
import print from "../../assets/images/print.svg";
import view from "../../assets/images/view.svg";
import ListOfEstimationSlipsService from "../../services/Reports/ListOfEstimationSlipsService";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import { Toast } from "react-bootstrap";
import ReactPageNation from "../../commonUtils/Pagination";
import { formatDate } from "../../commonUtils/FormatDate";

export default class ListOfEstimationSlips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateFrom: moment(new Date()).format("YYYY-MM-DD").toString(),
      dateTo: moment(new Date()).format("YYYY-MM-DD").toString(),
      // dateFrom: "",
      // dateTo: "",
      pageNumber:0,
      totalPages:0,
      status: null,
      barcode: null,
      dsNumber: "",
      dsList: [],
      dsDetailsList: [],
      itemId: "",
      itemName: "",
      domainId: "",
      storeId: "",
      errors: {},
      selectOption: [
        {
          name: "ES STATUS",
          id: "DS STATUS",
        },
        {
          name: "Completed",
          id: "Completed",
        },
        {
          name: "Pending",
          id: "Pending",
        },
        {
          name: "Cancelled",
          id: "Cancelled",
        },
      ],
    };
    this.getEstimationSlip = this.getEstimationSlip.bind(this);
    this.viewReport = this.viewReport.bind(this);
    this.closeViewReport = this.closeViewReport.bind(this);
    this.changePage = this.changePage.bind(this);
    this.deleteEstimationSlip=this.deleteEstimationSlip.bind(this);
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


  clearSearch(){
    this.setState({
      dsList:[],
      dateFrom:moment(new Date()).format("YYYY-MM-DD").toString(),
      dateTo:moment(new Date()).format("YYYY-MM-DD").toString(),
      status:"",
      barcode:"",
      dsNumber:""
    });
  }

  getEstimationSlip(pageNumber) {
    console.log("pageNumber",pageNumber)
    const obj = {
      dateFrom: this.state.dateFrom ? this.state.dateFrom : "",
      dateTo: this.state.dateTo ? this.state.dateTo : "",
      status: this.state.status ? this.state.status : null,
      barcode: this.state.barcode ? (this.state.barcode).trim() : "",
      dsNumber: this.state.dsNumber ? (this.state.dsNumber).trim() : "",
      // domainId: this.state.domainId ? parseInt(this.state.domainId) : undefined,
      storeId: this.state.storeId ? parseInt(this.state.storeId) : "",
    };

    ListOfEstimationSlipsService.getEstimationSlips(obj,pageNumber).then((res) => {
      console.log("data", res.data.result);
      if (res.data.result.deliverySlipVo) {
        res.data.result.deliverySlipVo.map((prop, i) => {
          let grossValueData = "";
          let netValueData = "";

          if (prop.lineItems.length > 0) {
            grossValueData = Array.prototype.map
              .call(prop.lineItems, function (item) {
                return item.grossValue;
              })
              .join(",");
          }
          if (prop.lineItems.length > 0) {
            netValueData = Array.prototype.map
              .call(prop.lineItems, function (item) {
                return item.netValue;
              })
              .join(",");
          }
          prop.grossVal = grossValueData;
          prop.netVal = netValueData;
          prop.review = false;
        });
      }

      this.setState({
        dsList: res?.data?.result?.deliverySlip,
        dsDetailsList: res.data.result.deliverySlip,
        totalPages:res.data.result.deliverySlip.totalPages
      });
    });
  }

  deleteEstimationSlip(dsNumber){
     ListOfEstimationSlipsService.deleteEstimationSlip(dsNumber).then((res) => {
      console.log("dsnumber",dsNumber);
     if(res.data.result){
        toast.success(res.data.result);
        this.getEstimationSlip(0);
     }else{
      toast.error(res.data.message);
     }
      
    });
  }

  viewReport(dsNumber) {
    let filterData = this.state.dsDetailsList.content.filter(
      (x) => x.dsNumber == dsNumber
    );
    console.log("filterdata", filterData);

    let obj = {
      barCode: "",
      salesMan: "",
      userId: "",
      quantity: "",
      itemPrice: "",
      grossValue: "",
      discount: "",
      manualDiscount:"",
      netValue: "",
    };
    let detailsArray = [];
    filterData[0].lineItems.map((d) => {
      obj = {
        barCode: d.barCode,
        // salesMan: filterData[0].salesMan,
        userId: d.userId,
        quantity: d.quantity,
        itemPrice: d.itemPrice,
        grossValue: d.grossValue,
        // discount: d.discount,
        promoDiscount: d.promoDiscount,
        manualDiscount:d.manualDiscount,
        netValue: d.netValue,
      };
      detailsArray.push(obj);
    });

    console.log("detailsarr", detailsArray);
    this.setState({
      dsNumber: filterData[0].dsNumber,
      popupData: detailsArray,
      isView: true,
    });
  }

  closeViewReport() {
    this.setState({ isView: false });
  }

  renderTableData() {
    return this.state.dsList?.content?.map((items, index) => {
      const { dsNumber, createdDate, status, mrp,discount, netAmount} =
        items;
        let date = formatDate (items.createdDate);
      return (
        <tr className="m-0 p-0" key={index}>
          <td className="col-1">{index + 1}</td>
          <td className="col-1">{dsNumber}</td>
          <td className="col-2">{date}</td>
          <td className="col-1">{status}</td>
          {/* <td className="col-2">₹{mrp}</td> */}
          <td className="col-2">₹{netAmount}</td>
          <td className="col-1">{discount}</td>
          <td className="col-2">₹{netAmount}</td>
          <td className="col-2 text-center">
            <img src={print} className="w-12 m-r-2 pb-2" />
            <img
              src={view}
              className="w-12 pb-2"
              onClick={() => {
                this.viewReport(dsNumber);
              }}
            />
            <i className="icon-delete m-l-2 fs-16"
             onClick={() => this.deleteEstimationSlip(items?.dsNumber)}> 
           </i>
          </td>
        </tr>
      );
    });
  }

  renderpopupTableData() {
    if (this.state.popupData) {
      return this.state.popupData.map((items, index) => {
        const {
          barCode,
          salesman,
          userId,
          quantity,
          itemPrice,
          grossValue,
          promoDiscount,
          manualDiscount,
          netValue,
        } = items;
        return (
          <tr className="m-0 p-0">
            <td className="col-2">{barCode}</td>
            <td className="col-1">{userId}</td>
            <td className="col-1">{quantity}</td>
            <td className="col-1">{netValue}</td>
            <td className="col-2">{grossValue}</td>
            <td className="col-2">{promoDiscount}</td>
            {/* <td className="col-2">{manualDiscount}</td> */}
            <td className="col-2">{netValue}</td>
          </tr>
        );
      });
    }
  }

  handleSelect(e) {
    if (e.target.value != "DS STATUS") {
      this.setState({
        status: e.target.value,
      });
    }
  }

  changePage(pageNumber) {
    console.log(">>>page", pageNumber);
    let pageNo = pageNumber + 1;
    this.setState({ pageNumber: pageNo });
    // this.getUserBySearch(pageNumber);
    // this.searchUser(pageNumber);
    this.getEstimationSlip(pageNumber); 
  }


  render() {
    return (
      <div className="maincontent">
        <Modal isOpen={this.state.isView} className="modal-fullscreen">
          <ModalHeader>Estimation Slip Details </ModalHeader>
          <ModalBody className="pt-4">
            <div className="row mb-3">
              <div className="col-3 p-l-0">
                <div className="">
                  <label>Estimation Slip : </label>{" "}
                  <span className="font-bold fs-13">
                    {" "}
                    {this.state.dsNumber}
                  </span>
                </div>
              </div>
            </div>
            {/* <div className="table-responsive"> */}
            <div className="row mb-3">
              <div className="table-responsive p-0">
              <table className="table table-borderless mb-1 mt-2">
                <thead>
                  <tr className="m-0 p-0">
                    {/* <th className="col-1"> </th> */}
                    <th className="col-2">BARCODE</th>
                    <th className="col-1">SM</th>
                    <th className="col-1">QTY</th>
                    <th className="col-1">ITEM MRP</th>
                    <th className="col-2">GROSS AMOUNT</th>
                    <th className="col-2">PROMO DISCOUNT</th>
                    {/* <th className="col-2">MANUAL DISCOUNT</th> */}
                    <th className="col-2">NET AMOUNT</th>
                  </tr>
                </thead>
                <tbody>{this.renderpopupTableData()}</tbody>
              </table>
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
          <div className="col-2 mt-2">
            <label>From Date</label>
            <div className="form-group">
              <input
                type="date"
                className="form-control"
                placeholder="FROM DATE"
                value={this.state.dateFrom}
                onChange={(e) => this.setState({ dateFrom: e.target.value })}
              />
            </div>
          </div>
         
          <div className="col-2 mt-2">
            <label>To Date</label>
            <div className="form-group">
              <input
                type="date"
                className="form-control"
                placeholder="TO DATE"
                value={this.state.dateTo}
                onChange={(e) => {
                  var startDate = new Date(this.state.dateFrom);
                  var endDate = new Date(e.target.value);
                  console.log(">>>", startDate, endDate);
                  if (startDate <= endDate) {
                    this.setState({ dateTo: e.target.value });
                   } else {
                    toast.error("To date should be greater than From date ");
                  }
                }}
              />
            </div>
          </div>

          <div className="col-12 col-sm-2 mt-2">
            <label>ES Status</label>
            <div className="form-group">
              <select
                className="form-control"
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

          <div className="col-2 mt-2">
            <label>ES Number</label>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="ES NUMBER"
                value={this.state.dsNumber}
                onChange={(e) => this.setState({ dsNumber: e.target.value })}
              />
            </div>
          </div>
          <div className="col-2 mt-2">
            <label>Barcode</label>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="BARCODE"
                value={this.state.barcode}
                onChange={(e) => this.setState({ barcode: e.target.value })}
              />
            </div>
          </div>
          <div className="col-2 mt-4 pt-2">
            <div className="form-group">
              <button
                className="btn-unic-search active"
                onClick={()=>{this.getEstimationSlip(0);this.setState({ pageNumber: 0 });}}>Search</button>
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
        <h5 className="pl-4 mt-3 mb-1 fs-18">List Of Estimation Slips</h5>
        <div className="row m-0 p-0 mb-3">
        <div className="table-responsive p-0">
          <table className="table table-borderless mb-1 mt-2">
            <thead>
              <tr className="m-0 p-0">
                <th className="col-1">S.NO</th>
                <th className="col-1">ES Number</th>
                <th className="col-2">ES DATE</th>
                <th className="col-1">ES STATUS</th>
                <th className="col-2">GROSS AMOUNT</th>
                <th className="col-1">DISCOUNT</th>
                <th className="col-2">NET AMOUNT</th>
                <th className="col-2 text-center">ACTION</th>
              </tr>
              
            </thead>
          </table>
          <table className="table table-borderless gfg mb-0">
            <tbody>{this.renderTableData()}</tbody>
          </table>
          </div>
          <div className="row m-0 mt-3">
            {this.state.totalPages > 1 ? (
          <div className="d-flex justify-content-center">
                 <ReactPageNation
                  {...this.state.dsList}
                  changePage={(pageNumber) => {
                    this.changePage(pageNumber);
                    }}
                   />
                  </div>
            ):null}
            </div>
        </div>
      </div>
    );
  }
}
