import moment from "moment";
import React, { Component } from "react";
import { withTranslation } from 'react-i18next';
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import add from "../../assets/images/add_btn.svg";
import { createDelivery_Err_Msg, errorLengthMax, errorLengthMin } from "../../commonUtils/Errors";
import eventBus from "../../commonUtils/eventBus";
import PrinterStatusBill from "../../commonUtils/PrintService";
import CreateDeliveryService from "../../services/CreateDeliveryService";
import NewSaleService from "../../services/NewSaleService";
import { getDataFromIndexDB } from '../../utility.js';
class CeateDeliverySlip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barCode: "",
      smNumber: "",
      dsNumber: "",
      qunatity: 1,
      itemsList: [],
      tempList: [],
      barList: [],
      isSMDisable: false,
      isDeliveryCreated: false,
      btnDisable: true,
      isRemember: true,
      isgetLineItems: false,
      mrpAmount: 0,
      promoDisc: 0,
      totalAmount: 0,
      totalQuantity: 0,
      ipAddress: "192.168.192.168",
      port: "8008",
      type: "",
      errors: {},
      dayCloseDates: [],
      showTable: false,
      isCheckPromo: false,
      isQuantity: true,
      selectedType: {
        value: "Pieces",
        label: "Pieces",
      },
      typesList: [
        {
          value: "Pieces",
          label: "Pieces",
        },
        {
          value: "Meters",
          label: "Meters",
        },
      ],
      dropValue: "",
      isGenerate: false,
      lineItemsList: [],
      printBtn: false,
      toDay: moment(new Date()).format("YYYY-MM-DD").toString(),
      checkToday: ""
    };
    //  this.getDeliverySlips();
    this.getDataFromDB();
    this.createDeliverySlip = this.createDeliverySlip.bind(this);
    this.remberSalesMan = this.remberSalesMan.bind(this);
    this.checkPromo = this.checkPromo.bind(this);
    this.generateEstimationSlip = this.generateEstimationSlip.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.generateNew = this.generateNew.bind(this);
    this.getLineItems = this.getLineItems.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.connectPrinter = this.connectPrinter.bind(this);
    this.openPrinterPopup = this.openPrinterPopup.bind(this);
    this.getallDates = this.getallDates.bind(this);
    //  this.deleteTableRow = this.deleteTableRow.bind(this);


  }
  getallDates () {
    CreateDeliveryService.getDates(sessionStorage.getItem('storeId')).then(res => {
      if (res) {
        if (res.data.length > 0) {
          this.setState({ dayCloseDates: res.data });
        }
      }
    });

  }



  componentWillMount () {
    this.getallDates();
    const storeId = sessionStorage.getItem("storeId");
    const user = JSON.parse(sessionStorage.getItem('user'));
    this.setState({ storeId: storeId, domainId: user[ "custom:clientId1" ] });
    // this.getHsnDetails();
    this.keyBinds();
    var item_value = sessionStorage.getItem("print_config");
    eventBus.on("printerStatus", (data) => {
      if (data.message === "OK") {
        document.body.classList.remove("connect-indicator");
        this.setState({ printBtn: true });
      } else {
        document.body.classList.remove("connect-indicator");
      }
    });
    if (item_value === "OK") {
      document.body.classList.remove("connect-indicator");
      this.setState({ printBtn: true });
    } else {
      document.body.classList.remove("connect-indicator");
    }
  }

  keyBinds () {
    window.addEventListener('keydown', (e) => { // For Generating Esslip
      if (e.altKey && String.fromCharCode(e.keyCode).toLocaleLowerCase() === 'n') {
        e.preventDefault();
        e.stopPropagation();
        if (this.state.barList.length > 0) {
          this.generateEstimationSlip();
        }
      }
    });
    window.addEventListener('keydown', (e) => { // For Check Promo Discount
      if (e.altKey && String.fromCharCode(e.keyCode).toLocaleLowerCase() === 'k') {
        e.preventDefault();
        e.stopPropagation();
        if (this.state.barList.length > 0) {
          this.checkPromo();
        }
      }
    });
    window.addEventListener('keydown', (e) => { // For Connecting Printer
      if (e.ctrlKey && String.fromCharCode(e.keyCode).toLocaleLowerCase() === 'p') {
        e.preventDefault();
        e.stopPropagation();
        this.openPrinterPopup();
      }
    });
    window.addEventListener('keydown', (e) => { // Hiding Printer
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        this.hideModal();
      }
    });
  }

  getHsnDetails () {
    NewSaleService.getHsnDetails().then(response => {
      if (response) {
        const details = response.data.result;
        let slabVos = [];
        details.forEach(detail => {
          if (detail.slabVos)
            slabVos.push(detail.slabVos);
        });

        sessionStorage.setItem("HsnDetails", JSON.stringify(slabVos));
      }
    });
  }

  getTaxAmount (lineItem) {
    const taxDetails = JSON.parse(sessionStorage.getItem("HsnDetails"));
    let slabCheck = false;
    let totalTax = 0;
    taxDetails.forEach(taxData => {
      if (lineItem.netValue >= taxData[ 0 ].priceFrom && lineItem.netValue <= taxData[ 0 ].priceTo) {
        const taxPer = taxData[ 0 ].taxVo.taxLabel.split(' ')[ 1 ].split('%')[ 0 ];
        const tax = parseInt(taxPer) / 100;
        totalTax = lineItem.netValue * tax;
        const central = totalTax / 2;
        // this.setState({ centralGST: Math.ceil(central) });
        lineItem.cgst = Math.ceil(central);
        lineItem.sgst = Math.ceil(central);
        lineItem.taxValue = totalTax;
        slabCheck = true;
      }
    });



    if (!slabCheck) {
      lineItem.cgst = 6;
      lineItem.sgst = 6;
      lineItem.taxValue = totalTax;
    }

  }

  getDataFromDB = async () => {
    let data = await getDataFromIndexDB();
  };

  getDeliverySlips = (e) => {

    const storeId = sessionStorage.getItem("storeId");
    this.setState({ type: this.state.selectedType.label });
    let mrp = 0;
    let promo = 0;
    let total = 0;
    if (e.key === "Enter") {
      const formValid = this.handleValidation();
      if (formValid) {

        this.setState({ copysmNumber: JSON.parse(JSON.stringify(this.state.smNumber)) });
        if (this.state.barCode && this.state.smNumber) {
          if (this.state.dayCloseDates.length !== 0) {
            if (this.state.dayCloseDates.length === 1 && this.state.dayCloseDates[ 0 ].dayClose.split("T")[ 0 ] === this.state.toDay) {
              CreateDeliveryService.getBarCodeList(
                this.state.barCode.trim(),
                this.state.smNumber,
                storeId
              ).then((res) => {

                if (res.data) {
                  // this.keyBinds()
                  let count = false;
                  // res.data.result.salesMan = this.state.copysmNumber;
                  if (this.state.itemsList.length === 0) {
                    this.state.itemsList.push(res.data);
                  }
                  else {

                    for (let i = 0; i < this.state.itemsList.length; i++) {
                      if (
                        this.state.itemsList[ i ].barcode ===
                        res.data.barcode
                      ) {
                        count = true;
                        var items = [ ...this.state.itemsList ];
                        if (parseInt(items[ i ].quantity) + 1 <= parseInt(items[ i ].qty)) {
                          let addItem = parseInt(items[ i ].quantity) + 1;
                          items[ i ].quantity = addItem.toString();
                          let totalcostMrp = items[ i ].itemMrp * parseInt(items[ i ].quantity);
                          items[ i ].totalMrp = totalcostMrp;
                          break;
                        } else {
                          // count = false
                          toast.info("Insufficient Quantity");
                          break;
                        }
                      }
                    }

                    if (!count) {
                      this.state.itemsList.push(res.data);
                    }


                  }


                  this.setState({ barList: this.state.itemsList, barCode: '' }, () => {
                    this.state.barList.forEach((element) => {
                      element.itemDiscount = 0;
                      if (element.taxValues) {
                        element.cgst = element.taxValues.cgstValue;
                        element.sgst = element.taxValues.sgstValue;
                        element.igst = element.taxValues.igstValue;
                        element.taxValue = element.taxValues.cgstValue + element.taxValues.sgstValue;
                      }
                      if (element.quantity > 1) {
                      } else {
                        element.totalMrp = element.itemMrp;
                        element.quantity = parseInt("1");
                      }

                    });
                    this.calculateTotal();
                  });
                  // this.setState({ barCode: "" });
                  // this.setState({ itemsList: items.data });
                  this.setState({ btnDisable: false });
                  this.setState({ isDeliveryCreated: false });
                  if (this.state.barList.length > 0) {
                    this.setState({ isgetLineItems: true });

                  }
                } else {
                  toast.error(res.data.body);
                }
              });



              this.setState({ showTable: true, isCheckPromo: true });
              if (!this.state.isRemember) {
                this.setState({ smNumber: "" });
              }
            } else {
              toast.error("Please Close Previous Days");
            }
          } else {
            toast.error("Unable To Generate Estimate Slip Today Daycloser Is Done");
          }


        } else {
          toast.info("Please enter Barcode / SM number");
        }
      }

    }
    // }else{
    //   toast.error("Unable To Generate Estimate Slip Today Dyacloser Is Done")
    // }
  };
  removeDuplicates (array, key) {
    const lookup = new Set();
    return array.filter(obj => !lookup.has(obj[ key ]) && lookup.add(obj[ key ]));
  }
  remberSalesMan (e) {
    if (e.target.checked) {
      if (this.state.smNumber) {
        //  this.setState({isSMDisable: true});
        this.setState({ isRemember: true });
      } else {
        toast.info("Please Enter SM number");
        this.setState({ isRemember: false });
      }
    } else {
      // this.setState({isSMDisable: false});
      this.setState({ isRemember: false, smNumber: "" });
    }
  }

  createDeliverySlip () {
    const storeId = sessionStorage.getItem("storeId");
    sessionStorage.removeItem("recentDS");
    const obj = {
      qty: this.state.qunatity,

      type: this.state.type,

      salesMan: this.state.smNumber,

      barcode: this.state.barList,

      storeId: parseInt(storeId)
    };
    CreateDeliveryService.createDeliverySlip(obj, this.state.type).then(
      (res) => {
        // if (res.data.statusCode === "OK") {
        this.setState({ dsNumber: res.data });
        this.setState({ isCheckPromo: false });
        toast.success("ES NUMBER:" + res.data);
        sessionStorage.setItem("recentDS", res.data);
        this.setState({
          barCode: "",
          smNumber: "",
          barList: [],
          itemsList: [],
          showTable: false

        });
        // } else {
        //   toast.error(res.data.body);
        // }
      }
    );
  }
  checkPromo () {
    this.setState({ isCheckPromo: false });
    this.setState({ isDeliveryCreated: true });
    NewSaleService.getCheckPromoAmount(this.state.storeId, this.state.domainId, this.state.barList).then(response => {
      if (response && response.data && response.data.result[ 0 ].calculatedDiscountsVo) {
        this.setState({ promoDiscount: response.data.result });
        this.state.barList.forEach(barCodeData => {
          this.state.promoDiscount.forEach(promo => {
            if (barCodeData.barcode === promo.barcode) {
              if (promo.calculatedDiscountsVo) {
                if (promo.calculatedDiscountsVo.discountAvailable) {
                  if (promo.calculatedDiscountsVo.thisFixedAmountDiscount) {
                    barCodeData.itemDiscount = parseInt(promo.calculatedDiscountsVo.calculatedDiscount);
                    barCodeData.totalMrp = barCodeData.itemDiscount;
                  }
                  else {
                    barCodeData.itemDiscount = parseInt(promo.calculatedDiscountsVo.calculatedDiscount);
                    barCodeData.totalMrp = barCodeData.totalMrp - barCodeData.itemDiscount;
                  }
                }

              } else {
                barCodeData.itemDiscount = "No discount";
              }
            }
          });
        });



        this.setState({ barList: this.state.barList });
        this.calculateTotal();

      } else {
        toast.error("No Promo applicable");
      }

    });
  }
  openPrinterPopup () {
    var item_value = sessionStorage.getItem("print_config");
    if (item_value !== "OK") {
      this.setState({ isGenerate: true });
    }
  }
  // generateEstimationSlip(){
  //   // this.setState({
  //   //   barCode: "",
  //   //   smNumber: "",
  //   //   barList: [],
  //   //   itemsList: [],
  //   //   showTable: false,
  //   // });
  //   // toast.success("Successfully generated estimation slip");
  //   this.setState({isGenerate: true})
  // }

  renderDeliveryNumber () {
    return (
      this.state.isDeliveryCreated && (
        <div className="rect-head">
          <div className="col p-l-3 pt-1 p-r-3 pb-3 text-right">
            {/* <button className="btn-unic m-r-2">Clear Promotion</button>
          <button className="btn-unic m-r-2">Hold Estimation Slip</button>
          <button className="btn-unic m-r-2">Generate Estimation Slip</button>  */}
            <button
              className="btn-nobdr"
              type="button"
              onClick={this.createDeliverySlip}
            >
              <img src={add} /> <span className="create">Create</span>
            </button>

          </div>
          {/* <ul>
                <li>DC Number  : <span className="font-bold pl-3">{this.state.dsNumber}</span></li>
                <li><img src={barcodebig} /></li>
                <li></li>
            </ul> */}
        </div>
      )
    );
  }

  renderTableDetails () {
    return (
      this.state.showTable && (
        <div className="row m-0 p-0 scaling-center">
          <div className="col-12 col-sm-6 p-l-0">
            <h5 className="mt-3 fs-18">
              Total Scanned Items: {this.state.barList.length}
            </h5>
          </div>
          <div className="col-12 col-sm-6 pt-1 p-r-0 text-right scaling-center">
            {/* <button className="btn-unic m-r-2 scaling-mb">Clear Promotion</button> */}
            {/* <button className="btn-unic m-r-2 scaling-mb">Hold Estimation Slip</button> */}
            {/* <button className="btn-unic m-r-2 scaling-mb active" onClick={this.getLineItems}>Generate Estimation Slip</button> */}
            <button
              className={"btn-unic scaling-ptop active" +
                "btn-login btn-create" +
                (!this.state.isgetLineItems ? " btn-disable" : "")
              }
              onClick={this.generateEstimationSlip}
              disabled={!this.state.isgetLineItems}
            >
              Generate Estimation Slip
              (Alt+n)
            </button>
          </div>

          <div className="p-0 pb-3 pt-2">
            {/* {this.renderDeliveryNumber()} */}
            {/* <div className="rect-head" >
                         <ul>
                             <li>DC Number  : <span className="font-bold pl-3">788 788 90123</span></li>
                             <li><img src={barcodebig} /></li>
                             <li><button className="btn-nobdr" type="button" onClick={this.createDeliverySlip}>
                                 <img src={add} /> <span>Create [Crl + 2]</span></button></li>
                         </ul>
                     </div> */}
            <div>{this.renderDivData()}</div>
            <div className="rect-red m-0">
              <div className="row">
                <div className="col-3"></div>
                <div className="col-2">
                  <label>TOTAL QTY</label>
                  <h6 className="pt-2">{this.state.totalQuantity}</h6>
                </div>

                {/* <div className="col-2">
                  <label>MRP</label>
                  <h6 className="pt-2">{this.state.mrpAmount} ₹</h6>
                </div> */}
                <div className="col-2"></div>
                <div className="col-2 p-l-0">
                  <label>PROMO DISCOUNT</label>
                  <h6 className="pt-2">{this.state.promoDisc} ₹</h6>
                </div>
                <div className="col-1"></div>
                <div className="col-2 pt-2 text-red p-r-4 p-l-0">
                  <label className="text-red">GRAND TOTAL</label>
                  <h6 className="fs-16 text-red ">{this.state.mrpAmount} ₹</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    );
  }



  renderDivData () {

    return (
      <div className="table-responsive t-scroll">
        <table className="table table-borderless mb-0">
          <thead>
            <tr>
              {/* <th className="col-1"> </th> */}
              <th className="col-3">ITEM</th>
              {/* <th className="col-1">DIVISION</th>
              <th className="col-1">Size</th> */}
              <th className="col-2">Qty</th>
              <th className="col-1">sm</th>
              <th className="col-1">mrp</th>
              <th className="col-2">Discount Type</th>
              <th className="col-">Discount</th>
              {/* <th className="col-4">Description</th> */}
              <th className="col-2">Total</th>
            </tr>
          </thead>

          <tbody>
            {this.state.barList.map((items, index) => {
              return (
                <tr key={index}>
                  <td className="col-3">
                    <div className="d-flex">
                      <div className="custom-control t_image custom-checkbox V1_checkbox-label mt-3">
                        {/* <input className="custom-control-input" type="checkbox" id="check1" /> */}
                        {/* <label className="custom-control-label V1_custom-control-label p-t-0 fs-14"
                      htmlFor="check1"></label> */}
                        {/* <img src={dress1} className="mt-2" /> */}
                      </div>
                      <div className="td_align pt-0 p-l-0">
                        {/* <label>{items.productTextile.itemCode}</label> */}
                        <label className="">{items.barcode}</label>
                      </div>

                    </div>
                  </td>
                  {/* <td className="col-1"></td>
              <td className="col-1"></td> */}
                  <td className="col-2 t-form"><input type="number"
                    value={items.quantity}
                    min="1"
                    max={items.qty}
                    onChange={(e) => this.checkQuantity(e, index, items)}
                    className="form-control" />
                  </td>
                  <td className="col-1">{this.state.smNumber}</td>
                  <td className="col-1">₹{items.itemMrp}</td>
                  <td className="col-2"></td>
                  <td className="col-1"> {items?.itemDiscount}</td>
                  <td className="col-2 pt-0 w-100">₹ {items.totalMrp}
                    <i className="icon-delete m-l-2"
                      onClick={(e) => {
                        this.state.itemsList.splice(index, 1);
                        this.setState({ barList: this.state.itemsList });
                        this.calculateTotal();
                      }}
                    >

                    </i>
                  </td>
                </tr>
              );
            })}


          </tbody>
        </table>

      </div>


    );

  }


  checkQuantity (e, index, item) {
    this.setState({ isgetLineItems: true });
    if (e.target.value !== "") {
      item.quantity = parseInt(e.target.value);
      let qty = item.quantity;
      if (item.quantity <= item.qty) {
        this.setState({ qty: e.target.value });


        item.quantity = parseInt(e.target.value);
        let totalcostMrp = item.itemMrp * parseInt(e.target.value);

        item.totalMrp = totalcostMrp;

      } else {
        this.setState({ isgetLineItems: false });
        toast.info("Insufficient Quantity");
      }
    } else {
      item.quantity = parseInt(e.target.value);
    }

    let grandTotal = 0;
    let totalqty = 0;
    let promoDiscount = 0;
    this.state.barList.forEach(bardata => {
      grandTotal = grandTotal + bardata.totalMrp;
      promoDiscount = promoDiscount + bardata?.itemDiscount;
      totalqty = totalqty + parseInt(bardata.quantity);
    });

    this.setState({ mrpAmount: grandTotal, totalQuantity: totalqty, promoDisc: promoDiscount });


  }
  handleValidation () {
    let errors = {};
    let formIsValid = true;
    //sm number

    if (this.state.smNumber.length !== errorLengthMin.smNumber) {
      formIsValid = false;
      errors[ "smNumber" ] = createDelivery_Err_Msg.smNumber;
    }


    this.setState({ errors: errors });
    return formIsValid;
  }

  // checkQuantity(e,index,item) {
  //   this.state.barList[index].quantity = parseInt(e.target.value);
  // }


  calculateTotal () {


    let totalAmount = 0;
    let totalqty = 0;
    let promoDiscount = 0;
    this.state.barList.forEach(barCode => {

      totalAmount = totalAmount + barCode.totalMrp;
      promoDiscount = promoDiscount + (isNaN(barCode.itemDiscount) ? 0 : (parseInt(barCode.itemDiscount)));
      totalqty = totalqty + parseInt(barCode.quantity);
    });

    this.setState({ mrpAmount: totalAmount, totalQuantity: totalqty, promoDisc: promoDiscount });



  }
  // handleValidation() {
  //   let errors = {};
  //   let formIsValid = false;
  //   //sm number
  // //   if (!this.state.smNumber) {
  // //     formIsValid = false;
  // //     errors["smNumber"] = "Please Enter SM Number";
  // // }
  // // if (this.state.smNumber) {
  // //     let input = this.state.smNumber;
  // //     const smnumValid = input.length === 4 ;
  // //     if (this.state.smNumber && !smnumValid) {
  // //       formIsValid = false;
  // //       errors["smNumber"] = "SM Number Must Have 4 Digits";
  // //     }
  // //   }

  //   this.setState({ errors: errors });
  //   return formIsValid;
  // }



  handleChange = (e) => {
    this.setState({ dropValue: e.label });
    this.setState({ selectedType: e });
    this.setState({ type: e.label });
    if (e.label == "Meters") {
      this.setState({ isQuantity: false });
    } else {
      this.setState({ isQuantity: true, qunatity: 1 });
    }
  };

  generateEstimationSlip () {
    // this.setState({ isGenerate: true });
    this.getLineItems();
  }

  getLineItems () {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const storeId = sessionStorage.getItem("storeId");
    let lineItem = [];
    this.state.barList.forEach((element, index) => {

      const obj = {
        "itemPrice": element.itemMrp,
        "quantity": parseInt(element.quantity),
        "discount": element?.discount,
        "netValue": element.totalMrp,
        "barCode": element.barcode,
        "domainId": 1,
        "manualDiscount": 0,
        "promoDiscount": (isNaN(element.itemDiscount) ? 0 : (parseInt(element.itemDiscount))),
        "storeId": parseInt(storeId),
        "section": element.section,
        "subSection": element.subSection,
        "division": element.division,
        "userId": parseInt(element.salesMan),
        "hsnCode": element.hsnCode,
        "actualValue": element.itemMrp,
        "taxValue": element.taxValue,
        "igst": parseInt(element.igst) * parseInt(element.quantity),
        "cgst": parseInt(element.cgst) * parseInt(element.quantity),
        "sgst": parseInt(element.sgst) * parseInt(element.quantity),
        "costPrice": element.costPrice,
        "batchNo": element.batchNo,
        "uom": element.uom,
        "originalBarcodeCreatedAt": element.createdDate,
        "discount": (isNaN(element.itemDiscount) ? 0 : (parseInt(element.itemDiscount)))

      };
      // this.getTaxAmount(obj);
      lineItem.push(obj);
    });

    CreateDeliveryService.getLineItem(lineItem, 1).then(res => {
      if (res) {
        let lineItemsList = [];
        let dataResult = JSON.parse(res.data.result);
        dataResult.forEach(element => {
          const obj = {
            "lineItemId": element
          };
          lineItemsList.push(obj);
        });




        this.setState({ lineItemsList: lineItemsList }, () => {
          this.generateNew();
        });
      }
    });
  }
  connectPrinter () {
    document.body.classList.add("connect-indicator");
    sessionStorage.setItem("printerIp", JSON.stringify(this.state.ipAddress));
    sessionStorage.setItem("printerPort", JSON.stringify(this.state.port));
    let print = "connected";
    PrinterStatusBill('start', print, null);
    this.hideModal();
  }
  generateNew () {
    const storeId = sessionStorage.getItem("storeId");
    const createObj = {
      "salesMan": parseInt(this.state.smNumber),
      "lineItems": this.state.lineItemsList,
      "storeId": parseInt(storeId)

    };

    CreateDeliveryService.saveDelivery(createObj).then(res => {
      if (res) {
        toast.success('ES NUMBER:' + res.data);
        // Printer Service used for Testing
        PrinterStatusBill('DSNUM', res.data, this.state.barList, null);
        this.setState({
          barCode: "",
          smNumber: "",
          barList: [],
          itemsList: [],
          isCheckPromo: false,
          showTable: false

        });

      }
    });

    this.hideModal();
  }


  hideModal () {
    this.setState({ isGenerate: false });
  }

  render () {
    return (

      <div className="maincontent">
        {/* <h5>Estimation Slip</h5> */}
        {/* <h5> {t("EstimationSlip")}</h5> */}
        <Modal isOpen={this.state.isGenerate} size="lg">
          <div className="modal-header">
            <div className="modal-title"><h5>Printer Settings</h5></div>
          </div>
          <ModalBody>
            <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <label>IP Address</label>
                  <input type="text" className="form-control" value={this.state.ipAddress}
                    onChange={(e) => this.setState({ ipAddress: e.target.value })}
                    placeholder="Enter IP"></input>
                </div>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <label>Port Number</label>
                  <input type="text" className="form-control" value={this.state.port}
                    onChange={(e) => this.setState({ port: e.target.value })}
                    placeholder="Enter Port"></input>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic fs-12" onClick={this.hideModal}>
              Close
            </button>
            <button
              className="btn btn-unic active fs-12"
              onClick={this.connectPrinter}
            >
              Connect
            </button>
          </ModalFooter>
        </Modal>
        <div className="">
          <div className="row">
            <div className="col-6 col-sm-2 sele">
              <label>Select Type</label>
              <div className="form-group">


                <Select
                  className="upper-case fs-14"
                  placeholder="Select"
                  value={this.state.selectedType} // set selected value
                  options={this.state.typesList} // set list of the data
                  onChange={this.handleChange} // assign onChange function
                  isDisabled={true}


                />
                {this.props.disabled}
              </div>
            </div>
            <div className="col-sm-2 col-6 scaling-mtop">
              <label>SM Number<span className="text-red font-bold">*</span></label>
              <div className="form-group">
                <input
                  type="text"
                  autoFocus
                  className="form-control"
                  value={this.state.smNumber}
                  // onKeyPress={this.getDeliverySlips}
                  placeholder="SM Number"
                  maxLength={errorLengthMax.smNumber}
                  onChange={(e) => this.setState({ smNumber: e.target.value })}
                />
              </div>
              <div>
                <span className="fs-12" style={{ color: "red" }}>{this.state.errors[ "smNumber" ]}</span>
              </div>
              {/* <div>
                <span style={{ color: "red" }}>{this.state.errors["smNumber"]}</span>
                                        </div> */}
            </div>
            <div className="col-6 col-sm-2">
              <label>Barcode</label>
              <div className="form-group">
                {/* <input type="text" className="form-control" name="barCode" value={this.state.barCode} onKeyPress={this.getDeliverySlips}
                                 placeholder="Barcode [Crtl + 1]"/> */}

                <input
                  type="text"
                  name="barCode"
                  className="form-control"
                  value={this.state.barCode}
                  onChange={(e) => this.setState({ barCode: e.target.value }, () => {
                    this.getDeliverySlips(e);
                  })}
                  autoComplete="off"
                  onKeyPress={this.getDeliverySlips}
                  placeholder="Enter Barcode"
                />
                {/* <button type="button"className="scan">
                               <img src={scan}/> SCAN
                </button> */}
              </div>
              {/* <div>
               <span style={{ color: "red" }}>{this.state.errors["barCode"]}</span>
                                        </div> */}
            </div>

            {/* <div className="col-sm-3 col-6 scaling-mtop">
              <div className="form-group">
                <input
                  type="number"
                  className="form-control"
                  // value={this.state.qunatity}
                  onChange={(e) => this.setState({ qunatity: e.target.value })}
                  disabled={this.state.isQuantity}
                  placeholder="Qty"
                />
              </div>
            </div> */}
            <div className="col-sm-2 scaling-ptop col-6 mt-4">
              <div className="form-group">

                {/* onClick={this.checkPromo} */}
                {/* <button
                  className={
                    "btn-login btn-create" +
                    (!this.state.isCheckPromo ? " btn-disable" : "")
                  }
                  onClick={this.checkPromo}
                >
                  Check Promo Discount
                </button> */}
                <button
                  className={
                    "btn-login btn-create fs-14" +
                    (!this.state.isCheckPromo ? " btn-disable" : "")
                  }
                  onClick={this.checkPromo}
                  disabled={!this.state.isCheckPromo}
                >
                  Check Promo Discount
                  <span className="fs-10"> (Alt+k)</span>
                </button>
              </div>
            </div>
            {this.state.printBtn ?
              <div className="col-sm-2 col-6 p-l-0 p-r-0 pt-4 cursor">
                <label className="d-flex"><i className="text-green font-bold fs-25 icon-printer_connected"></i> <span className="text-green  mt-1 fs-17 m-l-1">Printer Connected </span></label>
              </div>
              :
              <div className="col-sm-2 col-6 p-l-0 p-r-0 pt-4 cursor">
                <button type="button" className="btn-unic scaling-mb"
                  onClick={this.openPrinterPopup}
                ><i className="icon-print"></i> Connect To Printer <span className="fs-10">(Ctrl+p)</span> </button>
              </div>
            }
            <div className="col-sm-3 scaling-ptop col-6">
              <div className="form-check checkbox-rounded checkbox-living-coral-filled fs-15">
                <input type="checkbox" className="form-check-input filled-in"
                  checked={this.state.isRemember}
                  onChange={this.remberSalesMan} id="remember" />
                <label className="form-check-label" htmlFor="remember">Remember Sales Man</label>

              </div>
            </div>
          </div>
        </div>
        <div>
          {this.renderTableDetails()}
        </div>

        {/* <ToastContainer /> */}
      </div>
    );
  }
}
export default withTranslation()(CeateDeliverySlip);
