import React, { Component } from "react";
import { renderIntoDocument } from "react-dom/test-utils";
import edit from "../../assets/images/edit.svg";
import view from "../../assets/images/view.svg";
import ListOfBarcodesService from "../../services/Reports/ListOfBarcodesService";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ReactPageNation from "../../commonUtils/Pagination";
import { TimeScale } from "chart.js";
import confirm from '../../assets/images/conformation.svg';
import { toast } from "react-toastify";
import moment from "moment";

export default class ListOfReturnSlips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: moment(new Date()).format("YYYY-MM-DD").toString(),
      toDate: moment(new Date()).format("YYYY-MM-DD").toString(),
      // startRecordNumber: 0,
      // numberOfRecords: 5,
      pageNumber:0,
      totalPages:0,
      barcodeTextileId: "",
      barcode: "",
      store: "",
      empId: "",
      id: "",
      itemMrpLessThan: "",
      itemMrpGreaterThan: "",
      isView: false,
      clientDomianId: "",
      storeList: [],
      bcDetailsList: [],
      itemId: "",
      itemName: "",
      domainId1: "",
      pageList: [],
      // selectOption: [
      //   {
      //     value: "select",
      //     label: "select",
      //     id: "select",
      //   },
      //   {
      //     value: "hyderabad",
      //     label: "hyderabad",
      //     id: "hyderabad",
      //   },
      //   {
      //     value: "guntur",
      //     label: "guntur",
      //     id: "guntur",
      //   },
      // ],
      bcList: [],
    };
    this.getBarcodes = this.getBarcodes.bind(this);
    this.changePage = this.changePage.bind(this);
    this.getStoreNames = this.getStoreNames.bind(this);
    this.viewReport = this.viewReport.bind(this);
    this.closeViewReport = this.closeViewReport.bind(this);
  }

clearSearch(){
  this.setState({
    bcList:[],
    pageList:[],
    fromDate:moment(new Date()).format("YYYY-MM-DD").toString(),
    toDate:moment(new Date()).format("YYYY-MM-DD").toString(),
    barcode:"",
    empId:"",
    itemMrpLessThan:"",
    itemMrpGreaterThan:""

  })
}


  getBarcodes(pageNumber) {
    const obj = {
      fromDate: this.state.fromDate ? this.state.fromDate : null,
      toDate: this.state.toDate ? this.state.toDate : null,
      // startRecordNumber: 0,
      // numberOfRecords: 5,
      barcodeTextileId: this.state.barcodeTextileId
        ? parseInt(this.state.barcodeTextileId)
        : undefined,
      barcode:this.state.barcode?(this.state.barcode).trim():null,
      // storeName: this.state.store ? this.state.store : undefined,
      storeId:
        this.state.storeId && this.state.storeId != 0
          ? this.state.storeId
          : "",
      empId:this.state.empId?(this.state.empId).trim():undefined,

      // empId: this.state.empId ? (this.state.empId).trim() : undefined,
      itemMrpLessThan: this.state.itemMrpLessThan
        ? this.state.itemMrpLessThan
        : undefined,
      itemMrpGreaterThan: this.state.itemMrpGreaterThan
        ? this.state.itemMrpGreaterThan
        : undefined,
    };

    ListOfBarcodesService.getBarcodes(obj, pageNumber).then((res) => {
      // console.log(res.data.result.content);
      console.log("............", pageNumber);
      console.log("storeList", this.state.storeList);

      let data = res.data.result;

      let obj = {
        barcode: "",
        storeId: "",
        storeName: "",
        empId: "",
        qty: "",
        itemMrp: "",
      };

      let a = [];
      data?.content?.map((d) => {
        const storeName = this.state.storeList.filter((item) => {
          console.log("storeid", d.storeId);

          return d.storeId == item.id;
        });
        obj = {
          barcode: d.barcode,
          hsnCode:d.hsnCode,
          costPrice:d.costPrice,
          batchNo:d.batchNo,
          category:d.category,
          division:d.division,
          name:d.name,
          domainType:d.domainType,
          originalBarcodeCreatedAt:d.originalBarcodeCreatedAt,
          storeId: d.storeId,
          empId: d.empId,
          qty: d.qty,
          itemMrp: d.itemMrp,
          storeName: storeName[0]?.name,
        };
        a.push(obj);
      });

      console.log("bcList", a);
      this.setState({
        pageList: data,
        // barcodeData: a,
        bcList: a,
        bcDetailsList: a,
        totalPages:res.data.result.totalPages
      });
    });
  }

  // changePage(pageNumber) {
  //   this.getBarcodes(pageNumber);
  // }

  viewReport(barcode) {
    let filterData = this.state.bcList.filter((x) => x.barcode == barcode);
    console.log("filterdata", filterData);
    let obj = {
      barcode: "",
      hsnCode:"",
      batchNo:"",
      category:"",
      division:"",
      domainType:"",
      name:"",
      empId:"",
      costPrice:"",
      itemMrp: "",
      originalBarcodeCreatedAt:"",
      // storeName: "",
      // qty: "",
    };

    obj = {
      barcode: filterData[0].barcode,
      hsnCode: filterData[0].hsnCode,
      batchNo: filterData[0].batchNo,
      category: filterData[0].category,
      division: filterData[0].division,
      domainType: filterData[0].domainType,
      name:filterData[0].name,
      empId:filterData[0].empId,
      costPrice: filterData[0].costPrice,
      itemMrp: filterData[0].itemMrp,
      originalBarcodeCreatedAt: filterData[0].originalBarcodeCreatedAt,
      // storeName: filterData[0].storeName,
      // qty: filterData[0].qty,
    };

    //console.log("after insert a", a);
    this.setState({ popupData: obj, isView: true });
  }

  closeViewReport() {
    this.setState({ isView: false });
  }
  componentDidMount() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const storeId = sessionStorage.getItem("storeId");
    this.setState({ storeId: storeId });
    console.log("user", user);
    const domainData = JSON.parse(sessionStorage.getItem("selectedDomain"));
    // if (domainData.label == "Textile") {
    //   this.setState({ domaindataId: 1 });
    // } else if (domainData.label == "Retail") {
    //   this.setState({ domaindataId: 2 });
    // }
    if (user["custom:isSuperAdmin"] === "true") {
      this.state.domainDetails = JSON.parse(
        sessionStorage.getItem("selectedDomain")
      );

      // const user = JSON.parse(sessionStorage.getItem("user"));
      // console.log("user", user);
      // if (user["custom:isSuperAdmin"] === "true") {
      //   this.state.domainDetails = JSON.parse(
      //     sessionStorage.getItem("selectedDomain")
      //   );

      //   console.log(
      //     ">>>>>>>doma",
      //     JSON.parse(sessionStorage.getItem("selectedDomain"))
      //   );
      let testData = [];
      testData.push(JSON.parse(sessionStorage.getItem("selectedDomain")));
      console.log(">>>>>>parse", testData);

      this.setState(
        {
          storeList: testData,
          clientId: user["custom:clientId1"],
          domainId1: testData[0].value,
          domainDetails: this.state.domainDetails,
        },
        () => {
          console.log(this.state);
          this.getStoreNames(user["custom:clientId1"]);
        }
      );
    } else {
      this.setState(
        {
          userName: user["cognito:username"],
          isEdit: false,
          clientId: user["custom:clientId1"],
          domainId1: user["custom:domianId1"],
        },
        () => {
          console.log(this.state);
          this.getStoreNames(user["custom:clientId1"]);
        }
      );
    }
  }

  componentWillMount() {}

  getStoreNames = (domainId) => {
    console.log("vgfgfhgfhgf", this.state.domainId1, domainId);
    if (domainId != undefined) {
      ListOfBarcodesService.getStoreNames(domainId).then((res) => {
        console.log("........", res);
        var optionList = [];
        if (res.data.result) {
          var obj = { id: "0", name: "SELECT STORE" };
          optionList.push(obj);
          res.data.result.map((data) => {
            obj = {
              id: data.id,
              name: data.name,
            };
            optionList.push(obj);
          });
        }

        this.setState({
          storeList: optionList,
        });
      });
    }
  };

  changePage(pageNumber) {
    this.getBarcodes(pageNumber);
  }

  renderTableData() {
    return this.state.bcList.map((items, index) => {
      const { barcode, storeName, empId, qty, itemMrp } = items;
      return (
        <tr className="" key={index}>
          <td className="col-1">{index + 1}</td>
          <td className="col-2">{barcode}</td>
          {/* <td className="col-2">{storeName}</td> */}
          <td className="col-2">{empId}</td>
          <td className="col-1">{qty}</td>
          <td className="col-2">₹ {itemMrp}</td>
          <td className="col-2 ">
            {/* <img src={edit} className="w-12 m-r-2 pb-2" /> */}
            <img
              src={view}
              className="w-12 pb-2"
              onClick={() => {
                this.viewReport(barcode);
              }}
            />
            {/* <i className="icon-delete fs-16"></i> */}
          </td>
        </tr>
      );
    });
  }

  // handleSelect(e) {
  //   let obj = this.state.selectOption.find((o) => o.label === e.target.value);
  //   this.setState({
  //     itemId: obj.id,
  //     itemName: e.target.value,
  //     store: e.target.value,
  //   });
  // }

  renderPopupTableData() {
    if (this.state.popupData) {
      // return this.state.popupData.map((items, index) => {
      const { barcode,hsnCode,batchNo,category,division,domainType,name,empId,costPrice,originalBarcodeCreatedAt,itemMrp, storeName, qty } = this.state.popupData;
      return (
        <tr>
          <td className="col-2">{barcode}</td>
          <td className="col-1">{hsnCode}</td>
          <td className="col-1">{batchNo}</td>
          <td className="col-1">{category}</td>
          <td className="col-1">{division}</td>
          <td className="col-1">{domainType}</td>
          <td className="col-1">{name}</td>
          <td className="col-1">{empId}</td>
          <td className="col-1">{costPrice}</td>
          <td className="col-1">{itemMrp}</td>
          <td className="col-2">{originalBarcodeCreatedAt}</td>
         </tr>
      );
    }
  }

  render() {
    return (
      <div className="maincontent">
        <Modal isOpen={this.state.isView} className="modal-fullscreen">
          <ModalHeader>BARCODE DETAILS </ModalHeader>
          <ModalBody className="p-l-5 p-r-5 pt-4">
            <div className="row">
            <div className="table-responsive p-0">
              <table className="table table-borderless mb-1">
                <thead>
                  <tr className="m-0 p-0">
                    <th className="col-2">BARCODE</th>
                    <th className="col-1">HSNCODE</th>
                    <th className="col-1">BATCH NO.</th>
                    <th className="col-1">CATEGORY</th>
                    <th className="col-1">DIVISION</th>
                    <th className="col-1">DOMAIN</th>
                    <th className="col-1">NAME</th>
                    <th className="col-1">EMP ID</th>
                    <th className="col-1">COST PRICE</th>
                    <th className="col-1">MRP</th>
                    <th className="col-2">CREATED DATE</th>
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
          <div className="col-6 col-sm-2 mt-2 mb-2">
            <div className="form-group">
              <label>From Date</label>
              <input
                type="date"
                className="form-control"
                placeholder="FROM DATE"
                value={this.state.fromDate}
                onChange={(e) => this.setState({ fromDate: e.target.value })}
              />
            </div>
          </div>
          <div className="col-6 col-sm-2 mt-2 mb-2">
            <div className="form-group">
              <label>To Date</label>
              <input
                type="date"
                className="form-control"
                placeholder="TO DATE"
                value={this.state.toDate}
                onChange={(e) => {
                  var startDate=new Date(this.state.fromDate);
                  var endDate=new Date(e.target.value);
                  if(startDate<=endDate){
                    this.setState({toDate:e.target.value})
                  }
                  else
                  {
                    toast.error("To date should be greater than From date");
                  }
                }}
              />
            </div>
          </div>
          <div className="col-6 col-sm-2 mt-2 mb-2">
            <div className="form-group">
              <label>Barcode</label>
              <input
                type="text"
                className="form-control"
                placeholder="Barcode Number"
                value={this.state.barcode}
                onChange={(e) => this.setState({ barcode: e.target.value })}
              />
            </div>
          </div>
          <div className="col-6 col-sm-2 mt-2">
            <div className="form-group">
              <label>EMP ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Emp ID"
                value={this.state.empId}
                onChange={(e) => this.setState({ empId: e.target.value })}
              />
            </div>
          </div>
          <div className="col-6 col-sm-2 mt-2">
            <div className="form-group">
              <label>Barcode MRP LessThan </label>
              <input
                type="text"
                className="form-control"
                placeholder="Barcode MRP <"
                value={this.state.itemMrpLessThan}
                onChange={(e) =>
                  this.setState({ itemMrpLessThan: e.target.value })
                }
              />
            </div>
          </div>

          <div className="col-6 col-sm-2 mt-2">
            <div className="form-group">
              <label>Barcode MRP GreaterThan </label>
              <input
                type="text"
                className="form-control"
                placeholder="Barcode MRP >"
                value={this.state.itemMrpGreaterThan}
                onChange={(e) =>
                  this.setState({ itemMrpGreaterThan: e.target.value })
                }
              />
            </div>
          </div>
          <div className="col-6 col-sm-2 scaling-mb mt-2">
            <div className="form-group">
              <button
                className="btn-unic-search active"
                onClick={() => {
                  this.getBarcodes(0);
                }}
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
        <h5 className="pl-4 mt-3  fs-18 scaling-center scaling-mb">
          List Of Barcodes
        </h5>
        <div className="row m-0 p-0 mb-3">
          <div className="table-responsive p-0">
            <table className="table table-borderless mb-1 mt-2">
              <thead>
                <tr className="m-0 p-0">
                  <th className="col-1">S.NO</th>
                  <th className="col-2">Barcode</th>
                  {/* <th className="col-2">Barcode Store</th> */}
                  <th className="col-2">EMP ID</th>
                  <th className="col-1">QTY</th>
                  <th className="col-2">BARCODE MRP</th>
                  <th className="col-2">VIEW</th>
                </tr>
              </thead>
              <tbody>{this.renderTableData()}
              {this.state.bcList.length === 0 && <div className='no_records'><img src={confirm}></img> <label>No records found</label> </div>}
 
              </tbody>
 
            </table>
            </div>
            <div className="row m-0 mt-3">
            {this.state.totalPages > 1 ? (
            <div className="d-flex justify-content-center">
            <ReactPageNation
                  {...this.state.pageList}
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
