import React, { Component } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import scan from "../../assets/images/scan.svg";
import moment from "moment";
import PrinterStatusBill from "../../commonUtils/PrintService";
import CreateDeliveryService from "../../services/CreateDeliveryService";

export default class GenerateReturnSlip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTagCustomer: false,
      isGenerateSlip: false,
      invoiceNo: "",
      userId: "NA",
      mobileNo: "",
      rtStatus: "",
      returnslipsList: [],
      reason: "",
      netValue: 0,
      quantity: 0,
      netValueList: [],
      slectedItems:[],
      netValueSum:[],
      dayCloseDates:[],
      returnSlipTotal: 0,
      isgenerateReturnSlip: false,
      mobileNumber: null,
      createdBy: 0,
      comments: null,
      selectedNetVal:0,
      returnedAmout:0,
      enableReturnSlip:false,
      returnQty:0,
      // isCheck:false
      checked:"",
      retBarList:[],
      toDay: moment(new Date()).format("YYYY-MM-DD").toString(),
    };
    this.tagCustomer = this.tagCustomer.bind(this);
    this.closeTagCustomer = this.closeTagCustomer.bind(this);
    this.generateReturn = this.generateReturn.bind(this);
    this.closegenerateReturn = this.closegenerateReturn.bind(this);
    this.getReturnSlipDetails = this.getReturnSlipDetails.bind(this);
    this.saveGenerateReturnSlip = this.saveGenerateReturnSlip.bind(this);
    this.getCustomer = this.getCustomer.bind(this);
    this.validation=this.validation.bind(this);
    this.getallDates = this.getallDates.bind(this);
  }

  componentWillMount() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const storeId = sessionStorage.getItem("storeId");
    this.setState({ userId: parseInt(user["custom:userId"]) ,loggedUserId: user["custom:userId"],storeId:storeId});
    this.getallDates();
  }
  getallDates(){
    CreateDeliveryService.getDates(sessionStorage.getItem('storeId')).then(res => {
      if (res) {
        if(res.data.length > 0){   
          this.setState({ dayCloseDates:res.data});
        }
        
      }
    }); 

  }

  tagCustomer() {
    this.setState({ isTagCustomer: true });
  }

  getCustomer() {
    CreateDeliveryService.getUserByMobile("+91" + this.state.mobileNumber).then(
      (res) => {
        if (res) {
          this.setState({
            isgenerateReturnSlip: false,
            userId: res.data.result.userId,
            mobileNumber: res.data.result.phoneNumber,
          });
        }
      }
    );
    this.closeTagCustomer();
  }

  closeTagCustomer() {
    this.setState({ isTagCustomer: false });
  }

  generateReturn() {
    this.setState({ isGenerateSlip: true });

  }

  closegenerateReturn() {
    this.setState({ isGenerateSlip: false });
  }

  saveGenerateReturnSlip() {
    const storeId = sessionStorage.getItem("storeId");
    let barList = [];
    if(this.state.returnslipsList.length >= 1 && this.state.quantity > 1){
    this.state.returnslipsList.forEach((element) => {
      const obj = {
        amount: element.netValue,
        barCode: element.barcode,
        qty: element.quantity,
        returnQty : element.returnQty ? parseInt(element.returnQty) : 0,
        returnAmount : element.returnedAmout ? parseInt(element.returnedAmout) : 0
      };
      barList.push(obj);
    });
  } 
  else if (this.state.returnslipsList.length === 1 && this.state.quantity === 1){
    this.state.returnslipsList.forEach((element) => {
      const obj = {
        amount: element.netValue,
        barCode: element.barcode,
        qty: element.quantity,
        returnQty : element.quantity ? parseInt(element.quantity) : 0,
        returnAmount : element.mrp ? parseInt(element.mrp) : 0
      };
      barList.push(obj);
      this.setState({retBarList : barList})
    });
  
  }

    const saveobj = {
      barcodes: barList.filter((it) => it.returnQty && it.returnQty !== '0'),
      // mobileNumber: this.state.mobileNo,
      createdBy: parseInt(this.state.loggedUserId),
      // mobileNumber: this.state.mobileNumber.substring(3, 14),
      mobileNumber: this.state.mobileNumber,
      // rtStatus: this.state.rtStatus,
      storeId: parseInt(storeId),
      totalAmount: parseInt(this.state.returnSlipTotal),
      reason: this.state.reason,
      comments: this.state.comments,
      customerId: parseInt(this.state.userId),
      invoiceNumber:this.state.invoiceNo,
      returnQty : this.state.returnQty,
      // returnAmount : this.state.returnedAmout
      // invoiceNo: this.state.invoiceNo,

      // userId: this.state.userId,

      // iSReviewed: false,
      // customerName: "",

      // domianId: 1,
    };

    CreateDeliveryService.saveGenerateReturnSlip(saveobj).then((res) => {
      if (res) {
        // Printer Service used for Testing
        PrinterStatusBill('RETURNSLIP',res.data.result.returnReference,saveobj.barcodes,saveobj)
        toast.success("ReturnSlip Created Successfully");
        this.setState({
          isTagCustomer: false,
          isGenerateSlip: false,
          invoiceNo: "",
          mobileNo: null,
          mobileNumber: null,
           returnslipsList: [],
          reason: "",
          netValue: 0,
          quantity: 0,
          netValueList: [],
          // returnSlipTotal: 0,
          isgenerateReturnSlip: true,
          rtStatus: "",
          createdBy: null,
          comments: "",
          enableReturnSlip:false,
          returnSlipTotal :0
        });
      }
    });
  }

  getReturnSlipDetails() {
    const obj = {
      invoiceNo: this.state.invoiceNo.trim(),
      // mobileNo: this.state.mobileNo,
      mobileNumber: this.state.mobileNumber,
      domianId: 1, //this feild is mandatory
      storeId:this.state.storeId?parseInt(this.state.storeId):null
    };
     if(this.state.dayCloseDates.length !== 0){
      if(this.state.dayCloseDates.length === 1 && this.state.dayCloseDates[0].dayClose.split("T")[0] === this.state.toDay){
    CreateDeliveryService.getReturnSlipDetails(obj).then((res) => {
      if (res) {
        const allreturnslipsList = res.data.result
        this.setState(
          {
            // returnslipsList: res.data.result,
          },
          () => {
            let costprice = 0;
            let quantity = 0;
            var combineList = {};
            allreturnslipsList.forEach((itm) => {
              var barcode = itm.barcode;
              itm.quantity = parseInt(itm.quantity)
              itm.netValue = parseInt(itm.netValue)
              itm.manualDiscount = parseInt(itm.manualDiscount)
              itm.promoDiscount = parseInt(itm.promoDiscount)
              itm.gvAppiled = parseInt(itm.gvAppiled)
              
            if (!combineList[barcode]) {
              return combineList[barcode] = itm
            }
             return combineList[barcode].quantity = combineList[barcode].quantity + itm.quantity ,
             combineList[barcode].netValue = combineList[barcode].netValue + itm.netValue ,
             combineList[barcode].grossValue = combineList[barcode].grossValue + itm.grossValue,
             combineList[barcode].manualDiscount = combineList[barcode].manualDiscount + itm.manualDiscount,
             combineList[barcode].promoDiscount = combineList[barcode].manualDiscount + itm.promoDiscount,
             combineList[barcode].gvAppiled = combineList[barcode].gvAppiled + itm.gvAppiled

            
        })
        console.log("combineList",combineList)
        var combineList2 = []
        Object.keys(combineList).forEach((key) => {
        combineList2.push(combineList[key])
        })
        const clearList = [...combineList2]
        console.log("clearList",clearList)
        this.state.returnslipsList = clearList
          console.log("returnslipsList",this.state.returnslipsList)
       
            this.state.returnslipsList.forEach((element) => {
              costprice = costprice + element.mrp;
              quantity = quantity + element.quantity;
              if(element.quantity >= 1){
                element.returnQty = parseInt("0");
                element.returnedAmout = parseInt("0")
              }
              console.log("+quantity+++",quantity,element.quantity)
              

              element.isChecked = false;
            });
            if(this.state.returnslipsList.length === 1 && quantity === 1){
              this.setState({returnSlipTotal:costprice});
            }
            
            this.setState({
              netValue: costprice,
              quantity: quantity,
              amount: costprice,
            });
            console.log("+res+++",this.state.returnslipsList,quantity,this.state.quantity) 
            }
      
        );
          

      }
    });
    this.setState({returnedAmout:""});
  }else{
    toast.error("Please Close Previous Days");
  }
  }else{
    toast.error("Unable To Return Today Daycloser Is Done");

  }
  }
 

  getReturnslipTotal(e, index, selectedElement) {
    
      selectedElement.isChecked = e.target.checked;

    if (e.target.checked) {
      if(selectedElement.quantity === 1){
        selectedElement.returnQty = selectedElement.quantity;
        selectedElement.returnedAmout = selectedElement.netValue
      }
      console.log("+++++++++++",this.state.returnslipsList)
      const obj = {
        
        netValue: selectedElement.netValue,
        barCode: selectedElement.barcode,
        quantity:selectedElement.quantity,
        mrp:selectedElement.mrp,
        returnQty :selectedElement.returnQty,
        
      };
      this.state.netValueList.push(obj);
    }
     else {
      // let index = this.state.netValueList.findIndex(
      //   (ele) => ele.barCode === selectedElement.barcode
      // );
      // this.state.netValueList.splice(index, 1);
      console.log("+++++++netValueList++++++++",this.state.netValueList)
      selectedElement.returnQty = 0;
      selectedElement.returnedAmout = 0;
    }

    // const netValueList = this.removeDuplicates(
    //   this.state.netValueList,
    //   "barcode"
    // );
    
    this.state.returnslipsList.forEach((element ,ind) => {
      if(element.returnQty  && element.returnQty !== 0 && ind == index ){
                  element.returnedAmout = (parseInt(element.returnQty) * element.netValue)/element.quantity
              }else{
                element.returnedAmout = parseInt(element.returnQty) * element.netValue
              }
      element.returnedAmout = (parseInt(element.returnQty) * element.netValue)/element.quantity
    });
    let sumreturnedAmout = this.state.returnslipsList.reduce((accumulator, curValue)=>{
      if(curValue.returnQty && curValue.returnQty !== '0' ){
        accumulator = accumulator + curValue.returnedAmout;
      }
      return accumulator;
  
  }, 0);
  this.setState({returnSlipTotal :Math.round(sumreturnedAmout)});

      // this.setState({ returnSlipTotal: returnSlipTotal })
    // });
  }

  removeDuplicates = (array, key) => {
    const lookup = new Set();
    return array.filter((obj) => !lookup.has(obj[key]) && lookup.add(obj[key]));
  }
 
handleQuntity(e , index, item){
  this.setState({ isgetLineItems: true })
  if (e.target.value !== "") {
    item.returnQty = parseInt(e.target.value);
    let qty = item.quantity;
    if (item.returnQty <= item.quantity) {
      this.setState({ returnQty: e.target.value });


      item.returnQty = parseInt(e.target.value);
      let totalcostMrp = item.itemMrp * parseInt(e.target.value);

      item.totalMrp = totalcostMrp

    } else {
      // this.setState({ isgetLineItems: false })
      // toast.info("Insufficient Quantity");
    }
  } else {
    item.returnQty = parseInt(e.target.value);
  }

  this.state.returnslipsList.forEach((element ,ind) => {
    if(element.returnQty  && element.returnQty !== 0 && ind == index ){
                element.returnedAmout = (parseInt(element.returnQty) * element.netValue)/element.quantity
            }else if(element.returnQty === '' && element.returnQty === 0 && ind == index){
              element.returnedAmout = 0
              element.isChecked = false;
            }
    element.returnedAmout = parseInt(element.returnQty) * element.netValue/element.quantity
  });
  let sumreturnedAmout = this.state.returnslipsList.reduce((accumulator, curValue)=>{
    if(curValue.returnQty && curValue.returnQty !== '0' ){
      accumulator = accumulator + curValue.returnedAmout;
    }
    return accumulator;

}, 0);
this.setState({returnSlipTotal : Math.round(sumreturnedAmout)});

  // console.log("+++++++++++sra+++++++++++++",this.state.returnslipsList)


}





//  if(this.state.returnslipsList.length > 1){
//   if(itm.isChecked){
//   const {returnslipsList} = this.state;
//   returnslipsList[index][e.target.name] = e.target.value;
//   this.setState({returnslipsList},() =>{
//   this.state.returnslipsList.forEach((element ,ind) => {
//         if(element.returnQty !== '' && element.returnQty !== 0 && ind == index ){
//           element.returnedAmout = parseInt(element.returnQty) * element.netValue
//         }
//       });
//       var filtered = this.state.returnslipsList.filter((it) => it.returnQty && it.returnQty !== '0');
  // let sumreturnedAmout = this.state.returnslipsList.reduce((accumulator, curValue)=>{
  //       if(curValue.returnQty && curValue.returnQty !== '0' ){
  //         accumulator = accumulator + curValue.returnedAmout;
  //       }
  //       return accumulator;
    
  //   }, 0);
  // this.setState({returnSlipTotal : sumreturnedAmout ,retBarList:filtered})
    
 // })
// } else{
//   // toast.error("please select the check box")
// }
//   }else{
//     let returnSlipTotal = 0;
//     const {returnslipsList} = this.state;
//     returnslipsList[index][e.target.name] = e.target.value;
//     this.state.returnslipsList.forEach((element ,ind) => {
//       if(element.returnQty !== '' && ind == index ){
//         element.returnedAmout = parseInt(element.returnQty) * element.netValue
//         returnSlipTotal = element.returnedAmout
//       }
//     });
//     // var filtered = this.state.returnslipsList.filter((it) => it.returnQty && it.returnQty !== '0');
//     this.setState({returnSlipTotal :  returnSlipTotal});
//     // this.setState({retBarList:filtered})
//   }
// }
  


  renderTableData() {
    return (
      this.state.returnslipsList.length > 0 &&
      this.state.returnslipsList.map((items, index) => {
        const { barcode, quantity, netValue, isChecked , mrp ,promoDiscount , manualDiscount , gvAppiled ,returnQty} = items;
        return (
          <tr>
           <td className="col-1">{index + 1}</td>
             <td className="col-1">
              <div className="d-flex">
             <div className="form-check checkbox-rounded checkbox-living-coral-filled fs-15">
              { this.state.returnslipsList.length > 1 && quantity >= 1 &&  
             <input
                    type="checkbox"
                    className="form-check-input filled-in mt-1"
                    id="roundedExample2"
                    value={isChecked}
                    onChange={(e) => this.getReturnslipTotal(e, index, items)}
                    //onChange={(e) => this.handleCheckboxChild(e, index, items)}
                  />
             }
                  {/* <label
                    className="form-check-label"
                    htmlFor="roundedExample2"
                  ></label> */}
                  
                </div> 
              </div>{" "}
            </td>
      
            <td className="col-2 p-r-0">{barcode}</td>
            <td className="col-1">{mrp}</td>
            <td className="col-1">{quantity}</td>
            { this.state.returnslipsList.length > 1 && quantity >= 1 &&
          <td className="col-1 t-form"><input type="number"
            value={returnQty}
          disabled = {!isChecked }
              min="0"
              name= "returnQty"
           max={quantity}
           onChange={(e) => this.handleQuntity(e, index, items)}
          className="form-control" />.
            </td>
      }
       { this.state.returnslipsList.length === 1 && quantity > 1 &&
          <td className="col-1 t-form"><input type="number"
            value={returnQty}
              min="0"
              name= "returnQty"
           max={quantity}
           onChange={(e) => this.handleQuntity(e, index, items)}
          className="form-control" />.
            </td>
      }
             {this.state.returnslipsList.length === 1 && (quantity === 1) && this.state.quantity ===1 &&
            <td className="col-1">{quantity}</td>} 
              <td className="col-1">₹{promoDiscount}</td>
              <td className="col-1">₹{manualDiscount}</td>
              <td className="col-1">₹{gvAppiled}</td>
            <td className="col-2 p-r-0">₹{netValue}</td>
          </tr>
        );
      })
    );
  }

  getTableData() {
    // return this.state.returnslipsList.map((items, index) => {
      return this.state.netValueList.map((items, index) => {
      const { barCode, quantity,returnQty, netValue } = items;
      return (
        <div>
          <tr>
            <td className="col-4 geeks">{barCode}</td>
            <td className="col-4">{quantity}</td>
            <td className="col-4">{returnQty}</td>
            <td className="col-4">₹ {netValue}</td>
          </tr>
        </div>
      );
    });
  }

  validation(e) {
    const regex = /^[0-9\b]+$/;
    const value = e.target.value;
    if (value === "" || regex.test(value)) {
      this.setState({
        [e.target.id]: e.target.value,
        mobileNumber: e.target.value,
      });
    } else {
      this.setState({mobileNumber: ""});
      // toast.error("pls enter numbers")
    }
  }
  

  render() {
    return (
      <div className="maincontent">
        <Modal isOpen={this.state.isGenerateSlip} size="lg">
          <div className="headerGreen">
            <h5>List of Return Items</h5>
          </div>
          <ModalBody>
            <div className="row">
              <div className="col-12 mb-2">
                <label className="text-green fs-14"></label>
              </div>
              <div className="col-12 mt-3">
                <table className="table table-borderless mb-1">
                  <thead>
                    <tr className="m-0 p-0">
                      {/* <th className="col-1"> </th> */}
                      <th className="col-4">SLIP NO.</th>
                      <th className="col-4">ITEMS</th>
                      <th className="col-4">Return Slip Value</th>
                    </tr>
                  </thead>
                </table>
                <table className="table table-borderless gfg">
                  <tbody>{this.getTableData()}</tbody>
                </table>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn-bdrG pt-2 m-r-2"
              onClick={this.closegenerateReturn}
            >
              BACK TO DASHBOARD
            </button>
            <button
              className="btn-bdrG pt-2 active fs-12"
              onClick={this.saveGenerateReturnSlip}
            >
              GENERATE NEW
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.isTagCustomer} size="sm">
          <ModalHeader>
            <h5>Tag customer</h5>
          </ModalHeader>
          <ModalBody>
            <div className="row p-3">
              <div className="col-12">
                <h6 className="fs-14 mb-4 mt-1">
                  Please provide customer phone number{" "}
                </h6>
                <label>Phone Number</label>
                <input
                  type="text"
                  name="mobile"
                  className="form-control"
                  value={this.state.mobileNumber}
                  minLength="10"
                  maxLength="10"
                  onChange={(e) =>
                    this.setState({ mobileNumber: e.target.value })
                  }
                />
              </div>

              <div className="col-12">
                <div className="d-flex mt-3 pointer">
                  <div className="form-check checkbox-rounded checkbox-living-coral-filled fs-15">
                    <input
                      type="checkbox"
                      className="form-check-input filled-in"
                      id="roundedExample2"
                      checked
                    />
                    <label
                      className="form-check-label"
                      htmlFor="roundedExample2"
                    >
                      Confirming me to receive promotional messages.
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="pt-2 btn-bdr" onClick={this.closeTagCustomer}>
              Cancel
            </button>
            <button
              className="btn btn-bdr active fs-12"
              onClick={this.getCustomer}
            >
              Confirm
            </button>
          </ModalFooter>
        </Modal>
        <div className="row">
          <div className="col-12 col-sm-8">
            <div className="row">
              <div className="col-12 col-sm-4">
                <label>Invoice Number</label>
                <div className="form-group fm-height">
                  <input
                    type="search"
                    className="form-control frm-pr"
                    placeholder="Enter Invoice Number"
                    value={this.state.invoiceNo}
                    onChange={(e) =>
                      this.setState({ invoiceNo: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="scan"
                    onClick={this.getReturnSlipDetails}
                  >
                    <img src={scan} /> SCAN
                  </button>
                </div>
              </div>
              {/* <div className="col-12 col-sm-4">
                <label>Customer Phone Number</label>
                <div className="form-group scaling-mb">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Customer Phone Number"
                    maxLength="10"
                    // value={this.state.mobileNo}
                    value={this.state.mobileNumber}
                    // onChange={(e) =>
                    //   // this.setState({ mobileNo: e.target.value })
                    //   this.setState({ mobileNumber: e.target.value })
                    // }
                    onChange={this.validation}
                  />
                </div>
              </div> */}
              {/* <div className="col-12 col-sm-4 p-r-0 p-l-0 scaling-center mt-4">
                <button
                  className="btn-unic-search active m-r-2 scaling-mb"
                  onClick={this.getReturnSlipDetails}
                >
                  SEARCH
                </button>
                <button
                  className="btn-unic scaling-mb"
                  onClick={this.tagCustomer}
                >
                  Customer Tagging
                </button>
              </div> */}
            </div>
            {this.state.returnslipsList.length > 0 && (
              <div className="row m-0 p-0">
                <div className="col-12 col-sm-4 p-l-0">
                  <h5 className="mt-0 mb-1 fs-18">List Of Items For Return</h5>
                </div>
                <div className="col-sm-8 col-12 text-right p-r-0"></div>
                <div className="table-responsive p-0 t-scroll">
                  <table className="table table-borderless mb-1 mt-1">
                    <thead>
                      <tr className="">
                        <th className="col-1">S.NO</th>
                        <th className="col-1">ITEM</th>
                        <th className="col-2 p-r-0">BARCODE</th>
                        <th className="col-1">MRP</th>
                        <th className="col-1">QTY</th>
                       { this.state.returnslipsList.length >= 1 && this.state.quantity >= 1 && 
                       <th className="col-1">RETURN QTY</th>}
                        <th className="col-1">PROMO</th>
                        <th className="col-1">MANUAL</th>
                        <th className="col-1">GV APPLIED</th>
                        <th className="col-2 p-r-0">VALUE</th>
                      </tr>
                    </thead>
                    <tbody>{this.renderTableData()}</tbody>
                  </table>
                </div>

                <div className="rect-cardred m-0">
                  <div className="row">
                    <div className="col-2 text-center">
                      <label>
                        Items :{" "}
                        <span className="font-bold">
                          {" "}
                          {this.state.returnslipsList.length}
                        </span>
                      </label>
                    </div>

                    <div className="col-2">
                      <label>
                        Qty :{" "}
                        <span className="font-bold">
                          {" "}
                          {this.state.quantity}
                        </span>
                      </label>
                    </div>
                    <div className="col-2">
                      <label>
                        N/Rate :{" "}
                        <span className="font-bold">
                          {" "}
                          ₹ {this.state.netValue}
                        </span>{" "}
                      </label>
                    </div>
                    <div className="col-3">
                      <label>
                        Discount : <span className="font-bold"> ₹ 0</span>{" "}
                      </label>
                    </div>
                    <div className="col-2">
                      <label>
                        Value :{" "}
                        <span className="font-bold">
                          {" "}
                          ₹ {this.state.netValue}
                        </span>{" "}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {this.state.returnslipsList.length > 0 && (
            <div className="col-12 col-sm-4">
              <div className="rect-grey pb-3">
                <h5 className="m-b-5">Return summary</h5>

                <div className="payment">
                  <div className="row">
                    <div className="col-5 p-r-0 pt-1">
                      <label style={{ padding: "0 0 3.5% 0" }}>Return Amount</label>
                    </div>
                    <div className="col-7 p-l-0 pt-1 text-right">
                      <label className="font-bold">
                      ₹ {this.state.returnSlipTotal}
                      </label>
                    </div>
                  </div>
                </div>
                <h5 className="m-b-3 m-t-5 p-t-4">
                  Return for reason{" "}
                  <span className="text-red float-none fs-18">*</span>
                </h5>

                <select
                  className="form-control"
                  value={this.state.reason}
                  onChange={(e) => this.setState({ reason: e.target.value })} 
                >
                  <option>Not fitting</option>
                  <option>Damaged Piece</option>
                  <option>Quality Is Not Good</option>
                  <option>Other</option>
                </select>
                <textarea
                  rows="4"
                  cols="46"
                  className="form-control mt-3"
                  placeholder="Write Comments"
                  value={this.state.comments}
                  onChange={(e) => this.setState({ comments: e.target.value })}
                ></textarea>
                
                <div className="mt-3">
                  <button
                className={
                "mt-1 w-100 " +
                  (this.state.returnSlipTotal === 0 
                   ? "btn-unic btn-disable"
                    : "btn-unic active")
                                  }
        //  onClick={this.generateReturn}
         onClick={this.saveGenerateReturnSlip}
         disabled={this.state.returnSlipTotal === 0 }
          >
         GENERATE RETURN SLIP
            </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              }
              