import React, { Component } from 'react';
import { toast } from "react-toastify";
import moment from "moment";
import print from "../../assets/images/print.svg";
import ListOfTaxreportService from '../../services/Reports/ListOfTaxreportService';
import view from "../../assets/images/view.svg";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { relativeTimeRounding } from 'moment/moment';
import confirm from '../../assets/images/conformation.svg';
import ReactPageNation from "../../commonUtils/Pagination";

export default class TaxReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
          fromDate: moment(new Date()).format("YYYY-MM-DD").toString(),
          toDate: moment(new Date()).format("YYYY-MM-DD").toString(),
          storeId:"",
          vendorTax: "" ,
          saleTax: "",
          value: "",
          pageNumber:0,
          totalPages:0,
          taxList:[],
          taxDetalisList:[],
          popupData:[]
        };
        this.taxreportList = this.taxreportList.bind(this);
        this.closeViewReport = this.closeViewReport.bind(this);
        this.viewTaxDetails=this.viewTaxDetails.bind(this);
        this.changePage = this.changePage.bind(this);
        this.changePage2 = this.changePage2.bind(this);

      }
      componentWillMount() {
        const storeId = sessionStorage.getItem("storeId");
        this.setState({ storeId:storeId });
      }
     
          
      clearSearch(){
        this.setState({
         fromDate: moment(new Date()).format("YYYY-MM-DD").toString(),
         toDate: moment(new Date()).format("YYYY-MM-DD").toString(),
          vendorTax: "" ,
          saleTax: "",
          value: "",
          taxList:"",
          taxDetalisList:"",
          popupData:"",totalPages:""
      
        })
      }


      changePage(pageNumber) {
        let pageNo = pageNumber + 1;
        this.setState({ pageNumber: pageNo });
        this.taxreportList( pageNumber); 
      }

      changePage2(pageNumber) {
        let pageNo = pageNumber + 1;
        this.setState({ pageNumber: pageNo });
        this.viewTaxDetails(this.state.fromDate,pageNumber); 
      }


taxreportList(pageNumber){
    ListOfTaxreportService.taxreportList(this.state.fromDate,this.state.storeId?parseInt(this.state.storeId):null,this.state.toDate,pageNumber).then((res)=>{
      let data = res.data;
      this.setState({
      taxList:res.data[0].data,
      totalPages:data[0].data.totalPages
        });
        console.log("totpages????????????",this.state.totalPages);
       });
     }


  viewTaxDetails(fromDate,pageNumber){
    ListOfTaxreportService.taxreportList(fromDate,this.state.storeId?parseInt(this.state.storeId):null,this.state.toDate="",pageNumber).then((res)=>{
      let data = res.data;
      this.setState({
        popupData:res.data[0].data,
        fromDate:fromDate,
        totalPages:data[0].data.totalPages,
        isView: true
          });
          console.log("viewtotpages????????????",this.state.totalPages);
    })
  }

closeViewReport() {
    this.setState({ isView: false });
  }

     
  renderTableData() {
        return this.state?.taxList?.content?.map((items, index) => {
          const {fromDate,vendorTax,saleTax,value
          } = items;
          return (
            <tr className="" key={index}>
              <td className="col-1">{index + 1}</td>
              <td className="col-2">{fromDate}</td>
              <td className="col-2">₹ {vendorTax}</td>
              <td className="col-2">₹ {saleTax}</td>
              <td className="col-2">₹ {value}</td>
              <td className="col-2 text-center">
            <img
              src={view}
              className="w-12 pb-2"
              onClick={() => {this.viewTaxDetails(items?.fromDate ,0);this.setState({pageNumber:0})}}
            />
           </td>
          </tr>
          );
        });
      }


renderpopupTableData(){  
   return this.state?.popupData?.content?.map((items,index)=>{
   const{vendorTax,saleTax,value,barcode}=items;
     return(
      <tr className="" key={index}>
      <td className="col-1">{index + 1}</td> 
      <td className="col-2">{barcode}</td>
      <td className="col-2">{vendorTax}</td>
      <td className="col-1">{saleTax}</td>
      <td className="col-1">{value}</td>
     
      </tr>
       );
   });
}

render() {
        return (
          <div className="maincontent">
          <Modal isOpen={this.state.isView} className="modal-fullscreen">
          <ModalHeader>Tax Details </ModalHeader>
          <ModalBody className="pt-4">
            <div className="row mb-3">
            </div>
            <div className="row mb-3">
              <div className="table-responsive p-0">
              <table className="table table-borderless mb-1 mt-2">
                <thead>
                  <tr className="m-0 p-0">
                   <th className="col-1">S.NO</th>
                   <th className="col-2">BARCODE</th>
                    <th className="col-2">VENDOR TAX</th>
                    <th className="col-1">SALE TAX</th>
                    <th className="col-1">VALUE</th>
                  </tr>
                </thead>
                <tbody>{this.renderpopupTableData()}</tbody>
              </table>
              </div>

              <div className="row m-0 mt-3">
                {this.state.totalPages>1?(
              <div className="d-flex justify-content-center">
                 <ReactPageNation
                  {...this.state.popupData}
                  changePage={(pageNumber) => {
                    this.changePage2(pageNumber);
                    }}
                   />
                  </div>
                ):null}
                  </div>

            </div>
          </ModalBody>
          <ModalFooter>
            <button className="pt-2 btn-bdr" onClick={this.closeViewReport}>
              CANCEL
            </button>
          </ModalFooter>
        </Modal>

        <div className="row">
              <div className="col-12 col-sm-2 mt-2">
                <label>From Date</label>
                <div className="form-group">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="FROM DATE"
                    value={this.state.fromDate}
                    onChange={(e) => this.setState({ fromDate: e.target.value })}
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
                    value={this.state.toDate}
                    onChange={(e)=>{
                      var startDate=new Date(this.state.fromDate);
                      var endDate=new Date(e.target.value);
                      if(startDate<=endDate){
                        this.setState({toDate:e.target.value});
                      }
                      else
                      {
                       toast.error("To date should be greater than From date") 
                      }
                      
                    }}
                  />
                </div>
              </div>
    
    
              <div className="col-12 col-sm-2 scaling-center scaling-mb mt-2 pt-4">
                <div className="form-group">
                  <button
                    className="btn-unic-search active"
                    onClick={()=>{this.taxreportList(0);this.setState({pageNumber:0});}}
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
            <div className="row m-0 p-0 mt-3">
              <div className="col-12 col-sm-6 scaling-mb scaling-center p-l-0">
                <h5 className="mt-2 fs-18">
                 Tax Report
                </h5>
              </div>
             </div>
            <div className="row m-0 p-0 mb-3">
              <div className="table-responsive p-0">
                <table className="table table-borderless mb-1 mt-2">
                  <thead>
                    <tr className="m-0 p-0">
                    <th className="col-1">S.NO</th>
                     <th className="col-2">CREATED DATE</th>
                      <th className="col-2">VENDOR TAX</th>
                      <th className="col-2">SALE TAX</th>
                      <th className="col-2">VALUE</th>
                      <th className="col-2"></th>
                      </tr>
                  </thead>
                <tbody>{this.renderTableData()}
                {this.state?.taxList?.content?.length === 0 && <div className='no_records'><img src={confirm}></img> <label>No records found</label> </div>}
                </tbody>
                </table>
              </div>

              <div className="row m-0 mt-3">
            {this.state.totalPages > 1 && this.state.taxList.length>10? (
              <div className="d-flex justify-content-center">
                 <ReactPageNation
                  {...this.state.taxList}
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
    