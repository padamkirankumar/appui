import React, { Component } from "react";
import print from "../../assets/images/print.svg";
import view from "../../assets/images/view.svg";
import ListOfReturnSlipsService from "../../services/Reports/ListOfReturnSlipsService";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import moment from "moment";
import confirm from '../../assets/images/conformation.svg';
import { toast } from "react-toastify";
import ReactPageNation from "../../commonUtils/Pagination";
import { formatDate } from "../../commonUtils/FormatDate";
export default class ListOfSaleBills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      RecentSaleNumber: sessionStorage.getItem("recentSale"),
      dateFrom: moment(new Date()).format("YYYY-MM-DD").toString(),
      dateTo: moment(new Date()).format("YYYY-MM-DD").toString(),
      // dateFrom: "",
      // dateTo: "",
      pageNumber:0,
      totalPages:0,
      createdBy: null,
      rtNumber: null,
      rtNo: null,
      barcode: null,
      rsList: [],
      rsDetailsList: [],
      detailsArr:[],
      rsData: [],
      isView: false,
      domainId: "",
      storeId: "",
      rtStatus: null,
      selectOption: [
        {
          name: "RT Status",
          id: "RT STATUS",
        },
        {
          name: "Pending",
          id: "PENDING",
        },
        {
          name: "Completed",
          id: "COMPLETED",
        },
      ],
    };
    this.getReturnSlips = this.getReturnSlips.bind(this);
    this.changePage = this.changePage.bind(this);
    // this.viewReport = this.viewReport.bind(this);
    this.closeViewReport = this.closeViewReport.bind(this);
    this.getReturnslipDetails = this.getReturnslipDetails.bind(this);
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
    rsList:[],
    dateFrom:moment(new Date()).format("YYYY-MM-DD").toString(),
    dateTo:moment(new Date()).format("YYYY-MM-DD").toString(),
    status:"",
    rtNumber:"",
    barcode:"",
  });
}



  getReturnSlips(pageNumber) {
    console.log("pageNumber",pageNumber);
    const obj = {
      dateFrom: this.state.dateFrom ? this.state.dateFrom : undefined,
      dateTo: this.state.dateTo ? this.state.dateTo : undefined,
      rtStatus: this.state.rtStatus ? this.state.rtStatus : null,
      // createdBy: this.state.createdBy ? this.state.createdBy : undefined,
      rtNumber: this.state.rtNumber ? (this.state.rtNumber).trim() : null,
      barcode: this.state.barcode ? (this.state.barcode).trim() : null,
      // domainId: this.state.domainId ? parseInt(this.state.domainId) : undefined,
      storeId: this.state.storeId ? parseInt(this.state.storeId) : null,
    };

    ListOfReturnSlipsService.getReturnSlips(obj,pageNumber).then((res) => {
      console.log("....>>>", res);
      if (res.data.result) {
        res.data.result.content.map((prop, i) => {
          let barcodeData = "";
          if (prop.barcodes.length > 0) {
            barcodeData = Array.prototype.map
              .call(prop.barcodes, function (item) {
                return item.barCode;
              })
              .join(",");
          }
          prop.barcodeVal = barcodeData;
          prop.review = false;
        });
      }

      this.setState({
        rsList: res.data.result,
        // rsDetailsList: res.data.result.content,
        totalPages:res.data.result.totalPages
      });
    });
  }

  getReturnslipDetails(rtNumber) {
    ListOfReturnSlipsService.getReturnslipDetails(rtNumber).then((res) => {
      // console.log("..........", res.data.result);
      if(res?.data?.result){
        let data = res?.data?.result;
      // console.log("dataaaa", data);
      let obj = {
        rtNo:"",
        createdDate:"",
        createdBy:"",
        amount:"",
        returnAmount:"",
        barCode: "",
        customerName:"",
        mobileNumber:"",
      };
     let detailsArr = [];
     data?.taggedItems?.map((d) => {
         obj = {
        rtNo:data.rtNo,
        createdDate:data.createdDate,
        createdBy:data.createdBy,
        amount:d.returnAmount,
        barCode: d.barCode,
        customerName:data.customerName,
        mobileNumber:data.mobileNumber
        };
        console.log(">>>>>>obj",obj)
        detailsArr.push(obj);
      });
     
      console.log("?>>>>popup",detailsArr);
      this.setState({
        customerName:data.customerName,
        rtNo: data.rtNo,
        mobileNumber: data.mobileNumber,
        createdDate: formatDate(data.createdDate),
        rsDetailsList: detailsArr,
        isView: true,
      });
    }
    });
  
  }

  closeViewReport() {
    this.setState({ isView: false });
  }

  renderTableData() {
    return this.state.rsList?.content?.map((items, index) => {
      const { rtNumber, barcodeVal, createdBy, createdInfo, amount } = items;
      let date = formatDate (items.createdInfo);
      return (
        <tr className="m-0 p-0" key={index}>
          <td className="col-1">{index + 1}</td>
          <td className="col-1">{rtNumber}</td>
          <td className="col-2">{barcodeVal}</td>
          <td className="col-1">{createdBy}</td>
          <td className="col-2">{date}</td>
          <td className="col-1">₹{amount}</td>
          <td className="col-1 text-center">
            <img src={print} className="w-12 m-r-2 pb-2 pointer" />
            <img
              src={view}
              className="w-12 pb-2 pointer"
              // onClick={() => this.viewReport(rtNumber)}
              onClick={() => this.getReturnslipDetails(rtNumber)}
            />
            <i className="icon-delete m-l-2 fs-16 pointer"></i>
          </td>
        </tr>
      );
    });
  }

  //   validation(e) {
  //     // const regex = /(\d{4})-(\d{2})-(\d{2})/;
  //     const regex = /^\d{4}-\d{2}-\d{2}$/;
  //     const value = e.target.value;
  //     if (value === "" || regex.test(value))
  //       this.setState({
  //         [e.target.id]: e.target.value,
  //       });
  //   }

  renderPopupTableData() {
    console.log("this.state.rsDetailsList",this.state.rsDetailsList);
    // if (this.state.rsDetailsList) {
      return this.state?.rsDetailsList?.map((items, index) => {
        const {
          rtNo,
          createdDate,
          createdBy,
          amount,
          barCode,
          customerName,
          mobileNumber,
          } = items;
          let date = formatDate (items.createdDate);
        return (
          <tr key={index}>
            <td className="col-2">{rtNo}</td>
            <td className="col-2">{date}</td>
            <td className="col-1">{createdBy}</td>
            <td className="col-1">{amount}</td>
            <td className="col-2">{barCode}</td>
            <td className="col-2">{customerName}</td>
            <td className="col-2">{mobileNumber}</td>
          </tr>
        );
      });
    
  }

  handleSelect(e) {
    if (e.target.value != "RT STATUS") {
      this.setState({
        status: e.target.value,
      });
    }
  }

  changePage(pageNumber) {
    console.log(">>>page", pageNumber);
    let pageNo = pageNumber + 1;
    this.setState({ pageNumber: pageNo });
    this.getReturnSlips(pageNumber); 
  }

  render() {
    return (
      <div className="maincontent">
        <Modal isOpen={this.state.isView} className="modal-fullscreen">
          <ModalHeader>Returns Slip Details </ModalHeader>
          <ModalBody className="p-l-5 p-r-5 pt-4">
            <div className="row mb-3">
              <div className="col-3 p-l-0">
                <div className="">
                  <label>Return Memo No : </label>{" "}
                  <span className="font-bold fs-13">
                    {" "}
                    {this.state.rtNo}
                  </span>
                </div>
              </div>
              <div className="col-3">
                <div className="">
                  <label>Customer : </label>{" "}
                  <span className="font-bold fs-13">
                    {" "}
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
                    <th className="col-2">RTNo</th>
                    <th className="col-2">RT Date & Time</th>
                    <th className="col-1">Emp ID</th>
                    <th className="col-1">Amount</th>
                    <th className="col-2">Barcode</th>
                    <th className="col-2">Customer Name</th>
                    <th className="col-2">cust Mobile No.</th>
                  </tr>
                </thead>
                {/* <tbody>
            <tr>
              <td>BAR001</td>
              <td>Western Wear</td>
              <td>001</td>
              <td>4699</td>
              <td>01</td>
              <td>1,120</td>
              <td>800</td>
              <td>5.00</td>
              <td>333.33</td>
              <td>8.33</td>
              <td>8.33</td>
              <td>0.00</td>
              <td>350</td>
            </tr>
          </tbody> */}
                {console.log(
                  "?>>>>>>>>>>>>>>>>>table",
                  this.renderPopupTableData()
                )}

                <tbody>{this.renderPopupTableData()}</tbody>
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
          <div className="col-12 col-sm-2 mt-2">
            <div className="form-group">
              <label>From Date</label>
              <input
                type="date"
                className="form-control"
                placeholder="FROM DATE"
                value={this.state.dateFrom}
                onChange={(e) => this.setState({ dateFrom: e.target.value })}
                // onChange={(e) => this.validation(e)}
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
                onChange={(e) => {
                  var startDate=new Date(this.state.dateFrom);
                  var endDate=new Date(e.target.value);
                  if(startDate<=endDate){
                    this.setState({dateTo:e.target.value});
                  }
                  else
                  {
                    toast.error("To date should be greater than From date")
                  }
                }}
              />
            </div>
          </div>

          <div className="col-12 col-sm-2 mt-2">
            <label>RT Status</label>
            <div className="form-group">
              <select
                className="form-control"
                value={this.state.rtStatus}
                // onChange={(e) => {
                //   this.handleSelect(e);
                // }}
                onChange={(e) => this.setState({ rtStatus: e.target.value })}
                // onChange={(e) => this.setState({ status: e.target.value })}
              >
                {this.state.selectOption.map((i) => {
                  return (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  );
                })}
                {/* <option>DS STATUS</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Cancelled</option> */}
              </select>
            </div>
          </div>

          <div className="col-12 col-sm-2 mt-2">
            <div className="form-group">
              <label>RT Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="RT Number"
                value={this.state.rtNumber}
                onChange={(e) => this.setState({ rtNumber: e.target.value })}
              />
            </div>
          </div>
          
          <div className="col-12 col-sm-2 mt-2">
            <div className="form-group">
              <label>Barcode</label>
              <input
                type="text"
                className="form-control"
                placeholder="Barcode"
                value={this.state.barcode}
                onChange={(e) => this.setState({ barcode: e.target.value })}
              />
            </div>
          </div>
          <div className="col-12 col-sm-2  scaling-center scaling-mb mt-2">
            <div className="form-group pt-4">
              <button
                className="btn-unic-search active"
                onClick={()=>{this.getReturnSlips(0);this.setState({pageNumber:0});}}>
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
        <h5 className="pl-4 mt-3 fs-18 scaling-center scaling-mb">
          Goods Return Slips
        </h5>
        <div className="row m-0 p-0 mb-3">
          <div className="table-responsive p-0">
            <table className="table table-borderless mb-1 mt-2">
              <thead>
                <tr className="m-0 p-0">
                  <th className="col-1">S.NO</th>
                  <th className="col-1">RT Number</th>
                  <th className="col-2">BARCODE</th>
                  <th className="col-1">EMP ID</th>
                  <th className="col-2">RT DATE & TIME</th>
                  <th className="col-1">AMOUNT</th>
                  <th className="col-1 text-center">ACTIONS</th>
                </tr>
              </thead>
              {/* <tbody>
              <tr className="m-0 p-0">
                <td className="col-1">01</td>
                <td className="col-2">RTS00001</td>
                <td className="col-2">BAR00001</td>
                <td className="col-2">EMP123</td>
                <td className="col-2">30 Dec 2021</td>
                <td className="col-2">₹ 2,000.00</td>
                <td className="col-1 text-center">
                  <img src={print} className="w-12 m-r-2 pb-2" />
                  <img src={view} className="w-12 pb-2" />
                  <i className="icon-delete m-l-2 fs-16"></i>
                </td>
              </tr>
             </tbody> */}

              <tbody>{this.renderTableData()}
            {this.state.rsList?.content?.length === 0 && <div className='no_records'><img src={confirm}></img> <label>No records found</label> </div>}
              </tbody>
            </table>
          </div>
          <div className="row m-0 mt-3">
            {this.state.totalPages > 1 ? (
          <div className="d-flex justify-content-center">
                 <ReactPageNation
                  {...this.state.rsList}
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
