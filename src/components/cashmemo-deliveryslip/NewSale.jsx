import axios from 'axios';
import React, { Component } from "react";
import Select from "react-select";
import moment from "moment";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import close from '../../assets/images/cross.svg';
import ecommerce from "../../assets/images/ecommerce.svg";
import scan from '../../assets/images/scan.svg';
import { NEW_SALE_URL } from "../../commonUtils/ApiConstants";
import { BASE_URL } from "../../commonUtils/Base";
import PrinterStatusBill from "../../commonUtils/PrintService";
import PrivilegesList from '../../commonUtils/PrivilegesList';
import CreateDeliveryService from "../../services/CreateDeliveryService";
import NewSaleService from "../../services/NewSaleService";



export default class NewSale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openn: false,
      isSubOpen: false,
      dsNumber: "",
      manualDisc: 0,
      rtAmount:0,
      isCash: false,
      isCard: false,
      btnDisabled: true,
      isCardSelected: false,
      isCashSelected: false,
      isCalculator: false,
      isPayment: true,
      isHold:false,
      cashAmount: 0.0,
      taxAmount: 0,
      cardAmount: 0.0,
      cardDigits: "",
      rBarCodeList: [],
      discReasons: [],
      selectedDisc: {},
      userId: null,
      deliverySlipData: {
        barcode: [],
        mrp: "",
        netAmount: 0.0,
        promoDisc: "",
        taxAmount: null,
      },
      dlslips: [],
      finalList: [],
      barCodeList: [],
      mobilenumber: "",
      rtNumber:"",
      customerName: "",
      gender: "",
      customerEmail: "",
      couponCode: "",
      ccCollectedCash: "",
      dob: "",
      customerGST: "",
      address: "",
      dropValue: "",
      grandNetAmount: 0,
      grandReceivedAmount: 0.0,
      payingAmount:0,
      grandBalance: 0,
      returnCash: 0,
      totalAmount:0,
      couponAmount: 0,
      input: {},
      isCheckPromo:false,
      isBillingDetails: false,
      errors: {},
      isBillingDisc: false,
      showDiscReason: false,
      discApprovedBy: "",
      showTable: false,
      dsNumberList: [],
      isCredit: false,
      isCreditAmount: false,
      paymentType: [],
      mobileData: {
        address: "",
        altMobileNo: "",
        dob: "",
        gender: "",
        gstNumber: "",
        mobileNumber: "",
        name: "",
        email: "",
        newSaleId: "",
      },
      grossAmount: 0,
      totalPromoDisc: 0,
      totalManualDisc: 0,
      netPayableAmount: 0,
      netCardPayment: 0,
      promoDiscount: 0,
      dayCloseDates:[],
      isBillingDiscount: false,
      retailBarCodeList: [],
      barCodeRetailList: [],
      barcodebarList:[],
      createdBy: null,
      enableCoupon:false,
      isEstimationEnable : false,
      genderList: [
        {
          value: "female",
          label: "Female",
        },
        {
          value: "male",
          label: "Male",
        },
      ],
      customerFullName: "",
      customerMobilenumber: "",
      isTextile: false,
      isRetail: false,
      lineItemsList: [],
      paymentOrderId: "",
      idClient: "",
      stateGST: 0,
      centralGST: 0,
      isCouponApplied: true,
      enablePayment: false,
      isCCModel: false,
      isCCPay: false,
      isCreditModel: false,
      isCreditConfirm: false,
      isUPIModel: false,
      upiMobilenumber: "",
      balanceCreditAmount: "",
      isreturnCreditCash: false,
      upiAmount:0,
      isCheckPromo:false,
      // open: false,
      cardPaymentType:"Manual",
      pathFlag:true,
      barcodeSlips :[],
      isEnableProccedtoCheck: false,
      isTagCustomer:false,
      isKathaModel:false,
      tagcustomerPrivilege: '',
      checkpromodiscountPrivilege: '',
      billleveldiscountPrivilege: '',
      isRTApplied:false,
      barcodeList:[],
      isCardAuto:false,
      listOfGiftcodes: [],
      isGvApplied: false,
      giftCouponsList: [],
      selectedPaymentMethod : '',
      rtListList:[],
      isRTnumAplied : true,
      // rtListList :[],
      listOfRtnum:[],
      isRTSlip:false,
      rtSlipList :[],
      holdRelaseButton: false,
       getDelivaryslipNo: '',
       compareRTList :[],
       compareList:[],
       dsCompareList : [],
       dsNumberList2 :[],
       listCoupons:[],
       isFound:"",
       numRtList:[],
       listOfGVs: [],
       objInvoice : [],
       toDay: moment(new Date()).format("YYYY-MM-DD").toString(),
       isTaxIncluded:'',
       itemgrossValue : '',
       proceedtoChcekOut:false,
       isTagCustomerpop : false,
       isProccedtoCheck: false

    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.savePayment = this.savePayment.bind(this);
    this.tagCustomer = this.tagCustomer.bind(this);
    this.showDiscount = this.showDiscount.bind(this);
    this.hideDiscount = this.hideDiscount.bind(this);
    this.showCalculator = this.showCalculator.bind(this);
    this.hideCal = this.hideCal.bind(this);
    this.saveDiscount = this.saveDiscount.bind(this);
    this.getDeliverySlipDetails = this.getDeliverySlipDetails.bind(this);
    this.getRetailBarcodeList = this.getRetailBarcodeList.bind(this);
    this.getGvModel = this.getGvModel.bind(this);
    this.hideGVModel = this.hideGVModel.bind(this);
    this.saveGVNumber = this.saveGVNumber.bind(this);
    this.onCouponCode = this.onCouponCode.bind(this);
    this.getHsnDetails = this.getHsnDetails.bind(this);
    this.getCCModel = this.getCCModel.bind(this);
    this.hideCCModel = this.hideCCModel.bind(this);
    this.saveCCAmount = this.saveCCAmount.bind(this);
    this.getCreditModel = this.getCreditModel.bind(this);
    this.hideCreditModel = this.hideCreditModel.bind(this);
    this.confirmCreditModel = this.confirmCreditModel.bind(this);
    this.getUPIModel = this.getUPIModel.bind(this);
    this.hideUPIModel = this.hideUPIModel.bind(this);
    this.getUPILink = this.getUPILink.bind(this);
    this.getinvoiceLevelCheckPromo=this.getinvoiceLevelCheckPromo.bind(this);
    this.invoiceLevelCheckPromo=this.invoiceLevelCheckPromo.bind(this);
    this.getKathaModel=this.getKathaModel.bind(this);
    this.hideKathaModel=this.hideKathaModel.bind(this);
    this.confirmKathaModel = this.confirmKathaModel.bind(this);
    // this.applyRt= this.applyRt.bind(this);
    this.getallDates = this.getallDates.bind(this);
    this.saveCard = this.saveCard.bind(this);
    this.getCardAutoModel = this.getCardAutoModel.bind(this);
    this.hideCardAutoModel = this.hideCardAutoModel.bind(this);
    this.onReturnSlip = this.onReturnSlip.bind(this);
    //this.handler = this.handler.bind(this);
    this.holdData = this.holdData.bind(this);
    this.releaseData=this.releaseData.bind(this);

  }


  componentWillMount() {
    const tax = JSON.parse(sessionStorage.getItem('user'));
    const isTaxIncluded = tax["custom:isTaxIncluded"]
    this.setState({isTaxIncluded : isTaxIncluded})
  this.getallDates();
  const holdData = JSON.parse(sessionStorage.getItem("holdData"));
  if(holdData!== null){
    this.setState({holdRelaseButton:true});
  }
// const releaseData = JSON.parse(sessionStorage.getItem("releaseData"));

    const user = JSON.parse(sessionStorage.getItem('user'));
    this.setState({ createdBy: parseInt(user["custom:userId"]), idClient: user["custom:clientId1"] });
    const childPrivileges =  PrivilegesList('Generate Invoice');
    childPrivileges.then((res) => {
      if(res) {
        const result = res.sort((a , b) => a.id - b.id);
        this.setState({
          tagcustomerPrivilege:  result[0],
          checkpromodiscountPrivilege: result[1],
          billleveldiscountPrivilege: result[2]           
        });
      }
    });
    this.keyBinds();
  }
  
  
  keyBinds() {
    window.addEventListener('keydown', (e) => { // For Check Promo Discount
      if(e.altKey && String.fromCharCode(e.keyCode).toLocaleLowerCase() === 'k') {
        e.preventDefault()
        e.stopPropagation()
        if(this.state.barCodeList.length > 0){
          this.invoiceLevelCheckPromo()
        }
      }
    })
    window.addEventListener('keydown', (e) => { // For Tag Customer
      if(e.altKey && String.fromCharCode(e.keyCode).toLocaleLowerCase() === 't') {
        e.preventDefault()
        e.stopPropagation()
        if(this.state.barCodeList.length > 0){
          this.toggleModal()
        }
      }
    })
    window.addEventListener('keydown', (e) => { // For Bill Level Discount
      if(e.altKey && String.fromCharCode(e.keyCode).toLocaleLowerCase() === 'b') {
        e.preventDefault()
        e.stopPropagation()
        if(this.state.barCodeList.length > 0){
          this.showDiscount()
        }
      }
    })


    window.addEventListener('keydown', (e) => { // For CARD Model Popup
      if(e.key === 'F1'){
        e.preventDefault()
        e.stopPropagation()
        if(this.state.barCodeList.length > 0){
          this.getCardModel()
        }
      }
    })
    window.addEventListener('keydown', (e) => { // For Cash Model Popup
      if(e.key === 'F2'){
        e.preventDefault()
        e.stopPropagation()
        if(this.state.barCodeList.length > 0){
          this.getCashModel()
        }
      }
    })
    window.addEventListener('keydown', (e) => { // For Applying all Popups
      if(e.ctrlKey && e.key === 'Enter'){
        e.preventDefault()
        e.stopPropagation()
        if(this.state.isCash){ // For cash model
          this.getReturnAmount()
        }else if(this.state.openn){ // For Tagging customer
          this.tagCustomer()
        }else if(this.state.isBillingDisc){ // For Bill level Disc
          this.saveDiscount()
        }
      }
    })
    window.addEventListener('keydown', (e) => { // For Closing all Model Popup
      if(e.code === 'Escape'){
        e.preventDefault()
        e.stopPropagation()
        if(this.state.isCash){ // For Cash model
          this.hideCashModal()
        }else if(this.state.openn){ // For Tagging customer
          this.hideModal()
        }else if(this.state.isBillingDisc){ // For Bill level Disc
          this.hideDiscount()
        }
      }
    })
    window.addEventListener('keydown', (e) => { // For Proceed to Checkout
        if(e.altKey && String.fromCharCode(e.keyCode).toLocaleLowerCase() === 'n') {
          e.preventDefault()
          e.stopPropagation()
          if(this.state.isEnableProccedtoCheck){
            this.savePayment()
          }
        }
      })
  }
  getHsnDetails() {
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

  openModal = () => {
    this.setState({
      openn: true,
    });
  };

  openSubModal = () => {
    this.setState({
      isSubOpen: true,
    });
  };

  hideModal = () => {
    this.setState({
      openn: false,
    });

    this.setState({
      customerName: "",
      gender: "",
      dob: "",
      customerGST: "",
      address: "",
      mobilenumber: "",
    });
  };

  hideCashModal = () => {
    this.setState({
      isCash: false,
      isCardAuto:false,
      cashAmount: 0,
      isEnableProccedtoCheck: false
    });
  };

 
  handleSubmit(e) {
    this.setState((state) => ({ open: !state.open }));
  }

  toggleModal = () => {
    this.setState({
      openn: true,
    });
  };

  getCashModel = () => {
    this.setState({
      isCash: true,
      selectedPaymentMethod: 'cash',
      cashAmount: 0,
      returnCash: 0
    }, () => {
      if (this.state.isreturnCreditCash) {
        this.setState({ grandNetAmount: this.state.balanceCreditAmount })
      }
    });
    this.setState({
      isCard: false,
    });
    this.setState({
      isCashSelected: true,
    });
  };

  hideCard = (e) => {
    this.setState({ showModal: false,isCard:false });
  }


  hideCardAutomatic = (e) =>{
    this.setState({ cardPaymentType: e.target.value});
  }

  getCCModel() {
    this.setState({ isCCModel: true },
      () => {
        if (this.state.isreturnCreditCash) {
          this.setState({ grandNetAmount: this.state.balanceCreditAmount })
        }
      });
      
  }


  getUPIModel() {
    this.setState({ isUPIModel: true });
  }

  hideUPIModel() {
    this.setState({ isUPIModel: false });
  }

  getUPILink() {
    this.savePayment();
    //     var instance = new Razorpay({ key_id: 'YOUR_KEY_ID', key_secret: 'YOUR_SECRET' })

    // instance.paymentLink.create({
    //   upi_link: true,
    //   amount: 500,
    //   currency: "INR",
    //   accept_partial: true,
    //   first_min_partial_amount: 100,
    //   description: "For XYZ purpose",
    //   customer: {
    //     name: "Gaurav Kumar",
    //     email: "gaurav.kumar@example.com",
    //     contact: 919999999999
    //   },
    //   notify: {
    //     sms: true,
    //     email: true
    //   },
    //   reminder_enable: true,
    //   notes: {
    //     policy_name: "Jeevan Bima"
    //   }
    // })
  }
  getCardAutoModel(){
    this.setState({ isCardAuto: true });
  }
  hideCardAutoModel(){
    this.setState({ isCardAuto: false });
  }
  getKathaModel() {
    this.setState({ isKathaModel: true });
  }

  hideKathaModel() {
    this.setState({ isKathaModel: false });
  }
  getCreditModel() {
    this.setState({ isCreditModel: true, payCreditAmount: this.state.grandNetAmount });
  }

  hideCreditModel() {
    this.setState({ isCreditModel: false });
  }
  confirmKathaModel(){
  //    this.setState({ isPayment: false })
  //   const obj = {

  //     "paymentType": "PKTPENDING",
  //     "paymentAmount": this.state.grandNetAmount
  //   }
  //   this.state.paymentType.push(obj);
  //   this.setState({ isKathaModel: false });
  //   this.createInvoice()
  // }
  const obj = {
    "paymentType": "PKTPENDING",
    "paymentAmount": this.state.khataAmount
  }
  this.state.paymentType.push(obj);
  if(this.state.isRTApplied){
    this.setState({payingAmount: this.state.grandNetAmount+this.state.rtAmount})
  }   

if(this.state.khataAmount < this.state.grandNetAmount||this.state.khataAmount == this.state.grandNetAmount) {
  this.setState({
    isPayment: false,
    isProccedtoCheck : true,
    payingAmount: this.state.khataAmount,
    enableCoupon:false,
    isProccedtoCheck :this.state.grandNetAmount==0 || this.state.khataAmount == this.state.grandNetAmount,grandNetAmount:this.state.grandNetAmount-this.state.khataAmount,enablePayment: this.state.grandNetAmount>0 ,isCheckPromo:true ,isBillLevel:true ,isTagCustomer:true,  
    
  }, () => {
    this.hideKathaModel();
  });
}

  }
  confirmCreditModel() {

    if (this.state.creditAmount < this.state.grandNetAmount) {
      const amount = this.state.grandNetAmount - this.state.creditAmount;
      this.setState({ isPayment: true, isreturnCreditCash: true, balanceCreditAmount: amount, grandNetAmount: amount }, () => {
        const obj = {

          "paymentType": "PKTADVANCE",
          "paymentAmount": this.state.creditAmount
        }

        this.state.paymentType.push(obj);
        if(this.state.isRTApplied){
          this.setState({payingAmount: this.state.creditAmount+this.state.rtAmount})
        } 
      })
    } else {
      this.setState({ isPayment: false })
      const obj = {

        "paymentType": "PKTADVANCE",
        "paymentAmount": this.state.grandNetAmount
      }

      this.state.paymentType.push(obj);
    }
    this.setState({cashAmount:this.state.grandNetAmount , payingAmount:this.state.grandNetAmount})
    const grandAmount = this.state.grandNetAmount >= this.state.payCreditAmount ? this.state.grandNetAmount - this.state.payCreditAmount : 0
    this.setState({isCreditAmount: true, grandNetAmount:grandAmount});
    if(this.state.isRTApplied){
      this.setState({payingAmount: this.state.grandNetAmount+this.state.rtAmount})
    } 
    if(this.state.totalAmount === 0){
    this.setState({ enableCoupon:false,
      isProccedtoCheck : true ,enablePayment: false ,isCheckPromo:true ,isBillLevel:true ,isTagCustomer:true})  
    } 

    this.hideCreditModel();

  }

  hideCCModel() {
    this.setState({ isCCModel: false });
  }
  saveCCAmount() {
    this.state.discType = this.state.dropValue;
    this.state.dsNumberList = this.removeDuplicates(this.state.dsNumberList, "dsNumber");
    sessionStorage.removeItem("recentSale");
    const storeId = sessionStorage.getItem("storeId");
    let obj;
    //if (this.state.isTextile) {
      obj = {

        "natureOfSale": "InStore",

        "domainId": 1,

        "storeId": parseInt(storeId),

        "grossAmount": this.state.grossAmount,

        "totalPromoDisc": this.state.totalPromoDisc,

        "totalManualDisc": parseInt(this.state.manualDisc),

        "taxAmount": this.state.taxAmount,

        "discApprovedBy": this.state.discApprovedBy,

        "discType": this.state.discType,

        "approvedBy": null,
        "mobileNumber": this.state.mobileData.mobileNumber,
        "customerFullName":this.state.customerFullName,
        "customerName": this.state.mobileData.userName,
       

        "netPayableAmount": this.state.netPayableAmount,
        "gvAppliedAmount" :(this.state.couponAmount===null?0:this.state.couponAmount),
        "returnSlipAmount" : (this.state.rtAmount===null?0:this.state.rtAmount),

        "offlineNumber": null,
        "totalAmount" : this.state.grandNetAmount ,

        "userId": this.state.userId ? this.state.userId : null,
        "createdBy": this.state.createdBy,
        "sgst": this.state.stateGST,
        "cgst": this.state.centralGST,
        "dlSlip": this.state.dsNumberList,
        "recievedAmount":parseInt(this.state.grandNetAmount),
        "returnAmount": this.state.returnCash,
        "lineItemsReVo": this.state.barCodeList,
        "paymentAmountType": [
          {
            "paymentType": "Cash",
            "paymentAmount": this.state.ccCollectedCash
          },
          {
            "paymentType": "Card",
            "paymentAmount": this.state.ccCardCash
          }
      
        ]
        // "paymentAmountType": this.state.paymentType,

      }


      if (this.state.ccCollectedCash < this.state.grandNetAmount) {
        NewSaleService.saveSale(obj).then((res) => {
          if (res) {
            // Printer Service used for Testing
            PrinterStatusBill('INVOICE',res.data.result,this.state.barCodeList,obj)
            this.setState({ isBillingDetails: false, dsNumber: "", finalList: [] });
            this.setState({
              customerName: " ",
              gender: " ",
              dob: " ",
              customerGST: " ",
              address: " ",
              manualDisc: 0,
              customerEmail: "",
              netPayableAmount: 0.0,
              // barCodeList: [],
              grossAmount: 0.0,
              promoDiscount: 0.0,
              cashAmount: 0,
              taxAmount: 0.0,
              grandNetAmount: 0,
              returnCash: 0,
              stateGST: 0,
              rtAmount:0,
              centralGST: 0,
              isPayment: true,
              isCCPay: true,
              isCCModel: false,
              totalAmount:0,
              couponAmount:0,
              isCredit: false,
  
  
            });
            this.setState({ showDiscReason: false, isPayment: true });
            this.setState({ showTable: false });
            sessionStorage.setItem("recentSale", res.data.result);
            toast.success(res.data.result);
            this.setState({ newSaleId: res.data.result });
            // this.pay()
  
            this.pay()
  
          } else {
            toast.error(res.data.result);
          }
        });
  
      }else{
          // alert("Net Payable Amount should be greater than From CollectedCash ");
               toast.error(" CollectedCash Should be less than payable amount when it comes to CC")
             }

      


      
    // }

  }

  getGvModel() {
    this.setState({ isgvModel: true });
  }

  hideGVModel() {
    this.setState({ isgvModel: false });
  }
  saveCard() {
    if(this.state.cardPaymentType === "Automatic") {
      this.getCardModel()
      this.hideCardAutoModel()
    }else {
      this.setState({cashAmount:this.state.grandNetAmount})
   this.manualCardPayment()
    }
  
    // this.setState({isCard: false});
}

  saveGVNumber() {
    const obj = [this.state.gvNumber];
    CreateDeliveryService.saveGVNumber(obj, true).then(resposne => {
      if (resposne) {
        toast.success(resposne.data.message);
      }
    })
    this.hideGVModel();
  }

  getCardModel = () => {
    this.setState({payingAmount: this.state.grandNetAmount})
    this.setState({
      isCard: true,
      selectedPaymentMethod: 'card',
    },
      () => {
        if (this.state.isreturnCreditCash) {
          this.setState({ grandNetAmount: this.state.balanceCreditAmount })
        }
      });
      if(this.state.isRTApplied){
        this.setState({payingAmount: this.state.grandNetAmount + this.state.rtAmount});
      }


     this.savePayment();
    // this.setState({
    //   isCardSelected: true,
    // });
  };

  applyGv = () => {
    this.setState({
      isGvApplied: true
    })
  }
  
  closeGvPopup = () => {
    this.setState({
      isGvApplied: false,
      giftCouponsList: [],
      couponCode: '',
      listOfGiftcodes: []
    })
  }
  applyRt = () =>{
    this.setState({isRTSlip : true})
  }

closeRtPopup = () => {
  this.setState({
    isRTSlip: false,
    rtSlipList: [],
    rtNumber: '',
    listOfRtnum: '',
    compareList : []
  })
}
  couponsAccumulation = () => {
   const { giftCouponsList } = this.state;  
   if(giftCouponsList.length > 0) {
    let listOfGVs = giftCouponsList.map((item) => item.gvNumber);
      let sum =  giftCouponsList.reduce((accumulator, current) => {       
        return accumulator += current.value;
        }, 0);
          this.setState({}, () => {
        if (this.state.grandNetAmount > sum) {
              this.setState({ isCouponApplied: false, couponAmount: sum, isGvApplied: false, grandNetAmount: this.state.grandNetAmount - sum , compareList : [],listOfGiftcodes:[], listOfGVs:  listOfGVs ,isCheckPromo:true });
            } 
            else if(this.state.grandNetAmount  === sum) {
              this.setState({ isCouponApplied: false, couponAmount: sum, isGvApplied: false , grandNetAmount: this.state.grandNetAmount - sum , compareList : [],listOfGiftcodes:[], listOfGVs:  listOfGVs ,enableCoupon:false },()=>{
               
                  this.setState({isProccedtoCheck : true ,enablePayment: false ,isCheckPromo:true ,isBillLevel:true ,isTagCustomer:true})
                
              });
            }else{
              toast.error("Please purchase greater than coupon amount")
            }
        });
   } else {
    toast.error("Please Enter Gift Voucher");
   }  
  }
  
  onCouponCode() {
    let obj = {
      gvNumber: this.state.couponCode
    }
    
    this.setState({
     listOfGiftcodes: [...this.state.listOfGiftcodes, obj]
    } , () => {
      if(this.state.couponCode.length > 0){
        NewSaleService.getCoupons(this.state.idClient, [{gvNumber: this.state.couponCode}]).then(res => {
          if (Array.isArray( res.data.result)) {     
            const couponsListList = res.data.result.map((itm) => {
             let obj = {};
             obj.gvNumber = itm.gvNumber;
             obj.value = itm.value;
             return obj;
           });
           this.setState({
             giftCouponsList: [...this.state.giftCouponsList, couponsListList[0]],
             couponCode: '',
             listOfGiftcodes: []
           }, () => {
             this.setState({
              giftCouponsList: [...new Map(this.state.giftCouponsList.map((m) => [m.gvNumber, m])).values()]
             })
           })  
         } else {
           toast.error(res.data.message);
           this.setState({
             listOfGiftcodes: [],
             couponCode: ''
           })
         }
       // }
       });       
     }else{
      toast.error("Please Enter GV Number");
     }
    })
    }

    setProceedToCheckout = (isProccedtoCheck) =>{
      this.setState({isProccedtoCheck : isProccedtoCheck})

    }
  
  rtAccumulation = () => {
    const { rtSlipList } = this.state; 
    if(this.state.rtListList.length > 0) {
      let sumreturnedAmout = this.state.rtListList.reduce((accumulator, curValue)=>{
        if(curValue.returnQty){
          accumulator = accumulator + curValue.returnAmount;
        }
        return accumulator;
    
    }, 0);
          //  this.setState({ isRTSlip:}, () => {
      //       let grandTotal = this.state.grandNetAmount;
      // if (grandTotal >= this.state.rtAmount) {
      //   grandTotal = grandTotal - this.state.rtAmount;
      //   this.setState({ grandNetAmount: grandTotal }, () => {
      //     this.setState({ isRTApplied: true , compareRTList :[]});
      //     });
      //   }
      let grandTotal = this.state.grandNetAmount;
         if (this.state.grandNetAmount > sumreturnedAmout) {
        //           let grandTotal = this.state.grandNetAmount;
        //               grandTotal = grandTotal - this.state.rtAmount;
        // this.setState({ grandNetAmount: grandTotal })
               this.setState({ isRTnumAplied: false, rtAmount: sumreturnedAmout, isRTSlip: false ,isRTApplied: true,compareRTList :[]},()=> this.setState({payingAmount:this.state.rtAmount - grandTotal,grandNetAmount:this.state.grandNetAmount-sumreturnedAmout ,isCheckPromo : true}));
             } else if(this.state.grandNetAmount === sumreturnedAmout){
              this.setState({ isRTnumAplied: false, rtAmount: sumreturnedAmout, isRTSlip: false ,isRTApplied: true,compareRTList :[]},()=> this.setState({payingAmount:this.state.rtAmount - grandTotal,grandNetAmount:this.state.grandNetAmount-sumreturnedAmout},()=>{
                this.setState({isProccedtoCheck : true ,enablePayment: false ,isCheckPromo:true ,isBillLevel:true ,isTagCustomer:true})
              }));
             }else {
               toast.error("Please purchase greater than return amount")
             }
       
    } else {
     toast.error("Please Enter RT Number");
    }  
   }
   onReturnSlip(){
    
    const obj = this.state.rtNumber
    // const storeId = sessionStorage.getItem("storeId");
  if (this.state.compareRTList.length === 0) {
    // this.state.listOfRtnum.push(obj)
 this.setState({
  compareRTList : [...this.state.listOfRtnum, obj],

 })
}else{
 const isFound = this.state.rtListList.find(element => {
   if (element.rtNumber === obj) {
     toast.error("RT Number Alredy Exist ");
     this.setState({
      rtNumber: '',
   });
     return true;
   }
     return false;


 });
 if(!isFound){
   // this.state.listOfRtnum.push(obj);
   this.setState({
    compareRTList: [...this.state.compareRTList, obj],
     // listOfGiftcodes : this.state.compareList
   })
 }

}
const storeId = sessionStorage.getItem("storeId");
// this.state.listOfRtnum.push(obj)
if(this.state.rtNumber.length>0){
NewSaleService.getRTDetails([obj], storeId).then(res => {
  if (res.data.result.length > 0) {   
       res.data.result.forEach((ele,index)=>{
       ele.barcodes.forEach((item,idx)=>{
       item.rtNumber= ele.returnReference;
     })
    })
   
    this.setState({
      rtListList: [...this.state.rtListList, res.data.result[0].barcodes]
    }, () => {      
      const flattened1 = this.state.rtListList.flatMap(rtNumber =>  rtNumber ); 
      const unique = [...new Map(flattened1.map((m) => [m.taggedItemId, m])).values()];
      let listofRTNum = unique.map((itm)=>itm.rtNumber);
      this.setState({
        rtSlipList: unique,
        rtListList: unique,
        rtNumber: '',
        listOfRtnum: [],
        numRtList : listofRTNum
      }); 
    })
  } else {
    toast.error("Invalid RT Slip Number ");
  }

})
}else{
  toast.error("Please Enter RT Slip Number");
}
   }
  getPaymentResposne() {
  let  timer = 0
  let time=  setInterval(function() {
    // alert("5 seconds are up");
    timer = timer+5
    if(timer=== 20){
      clearInterval(time);
    }
}, 5000);

  }

//   startTimer() {
//     timer = setInterval(function() {
//         alert("5 seconds are up");
//     }, 5000);
// }

//  stopTimer() {
//     alert("Timer stopped");
//     clearInterval(timer);
// }

clearStateFields = () => {
  this.setState({
    customerName: " ",
    gender: " ",
    dob: " ",
    customerGST: " ",
    address: " ",
    manualDisc: 0,
    customerEmail: "",
    netPayableAmount: 0.0,
    barCodeList: [],
    grossAmount: 0.0,
    promoDiscount: 0.0,
    cashAmount: 0,
    taxAmount: 0.0,
    grandNetAmount: 0,
    payingAmount:0,
    returnCash: 0,
    stateGST: 0,
    centralGST: 0,
    isPayment: true,
    isCreditAmount: false,
    creditAmount:0,
    payCreditAmount:0,
    totalAmount:0,
    couponAmount:0,
    isCredit: false,
    isTagCustomer:false,
    rtAmount:0,
    enablePayment: false,
    totalPromoDisc:0,
    showTable: false,
    numRtList :[],
    objInvoice:[],
    enableCoupon:false
  });
}

  pay = () => {
    if (this.state.isUPIModel) {
      // this.getPaymentResposne()
      const obj = {
        "amount": this.state.upiAmount,
        "description":"payment description",
        "customerDetails":{
          "name":"kadali",
          "contact":this.state.upiMobilenumber,
          "email":"kadali7799@gmail.com"
          }
      }

      const token = JSON.parse(sessionStorage.getItem('token'));
          const uninterceptedAxiosInstance = axios.create();
      uninterceptedAxiosInstance.post('http://14.98.164.17:9097/paymentgateway/razorpay/create-payment-link', obj,{
        headers: {
          'Authorization': 'Bearer' + ' ' + token,
        }}).then(response => {
        if(response.data) {
          this.setState({isUPIModel: false});
        }
      });



      // NewSaleService.payment(this.state.grandNetAmount, this.state.newSaleId).then((res) => {
      //   this.setState({ isUPIModel: false });
      //   const data = JSON.parse(res.data.result);
      //   if (res.data.result) {
      //   }
      // var instance = new Razorpay({ key_id: data.id, key_secret: 'rzp_test_z8jVsg0bBgLQer' })
      // instance.paymentLink.create({
      //   upi_link: true,
      //   amount: this.state.grandNetAmount,
      //   currency: "INR",
      //   accept_partial: true,
      //   first_min_partial_amount: 100,
      //   description: "For XYZ purpose",
      //   customer: {
      //     name: "Neelu",
      //     email: "Neelu@gmail.com",
      //     contact: this.state.upiMobilenumber
      //   },
      //   notify: {
      //     sms: true,
      //     email: true
      //   },
      //   reminder_enable: true,
      //   notes: {
      //     policy_name: "Jeevan Bima"
      //   }
      // });
      // });

    } else {
      const cardAmount = this.state.isCCPay ? Math.round(this.state.ccCardCash) : Math.round(this.state.netCardPayment)
      NewSaleService.payment(cardAmount, this.state.newSaleId).then((res) => {
        this.setState({ isPayment: false }, () => {
          const self = this;
          const data = JSON.parse(res.data.result);
        const options = {
          // process.env.RAZORPAY_KEY_ID
          key: "rzp_test_z8jVsg0bBgLQer",
          currency: data.currency,
          amount: data.amount,
          name: "OTSI",
          description: "Transaction",
          image: ecommerce,
          order_id: data.id,
          handler: function (response) {
            console.log("response",response);
            // Printer Service used for Testing
          //  PrinterStatusBill('INVOICE',self.state.newSaleId,self.state.barCodeList,self.state.objInvoice);
            toast.success("Payment Done Successfully");
            self.clearStateFields();
            let status = true
            const param = '?razorPayId=' + response.razorpay_order_id + '&payStatus=' + status;
            const result = axios.post(BASE_URL + NEW_SALE_URL.saveSale + param, {});
            // if(response.razorpay_order_id && response.razorpay_payment_id &&response.razorpay_signature ){
            //   let isProccedtoCheck = true
            //   if(isProccedtoCheck){
            //     self.setProceedToCheckout(isProccedtoCheck);
            //   }
            // }
          },
          prefill: {
            name: "Kadali",
            email: "kadali@gmail.com",
            contact: "9999999999",
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        this.setState({ isCCPay: false });
        });        
      });
    }
  };

  postPaymentData(paymentOrderId) {

    NewSaleService.postPaymentData(paymentOrderId, true).then(res => {
      if (res) {
        this.setState({
          showTable: false,
          paymentOrderId: "",
          newSaleId: "",
          netPayableAmount: 0.0
        })
      }
    });
  }


   holdData() {
    sessionStorage.setItem("holdData",JSON.stringify(this.state.barCodeList));
    sessionStorage.setItem("getDelivaryslipNo",JSON.stringify(this.state.getDelivaryslipNo)); 
    this.setState({barCodeList: [], dlslips: [] })
    this.clearStateFields();
    }

 releaseData() {
  const holdData = JSON.parse(sessionStorage.getItem("holdData"));
  const getDelivaryslipNo =sessionStorage.getItem("getDelivaryslipNo");

  this.setState({isEstimationEnable: true, dsNumber: JSON.parse(getDelivaryslipNo)}, () =>{
    this.setState({
    }, () => {
      this.setState({holdRelaseButton:false});
      sessionStorage.removeItem("holdData")
    })
  })
  
  
  
  
  }
  
  getRetailBarcodeList() {
    const storeId = sessionStorage.getItem("storeId");
    let costPrice = 0;
    let discount = 0;
    let total = 0;
    CreateDeliveryService.getRetailBarcodeList(
      this.state.retailBarCode,
      storeId
    ).then((res) => {
      if (res) {
        this.setState({ showTable: true, enablePayment: true });
        this.state.retailBarCodeList.push(res.data.result);
        if (this.state.retailBarCodeList.length > 1) {
          const barList = this.state.retailBarCodeList.filter(
            (test, index, array) =>
              index ===
              array.findIndex((findTest) => findTest.barcodeId === test.barcodeId)
          );

          if (barList.length > 1) {
            this.setState({ barCodeRetailList: barList });

          } else {
            this.setState({ barCodeRetailList: this.state.retailBarCodeList });
          }

        } else {
          this.setState({ barCodeRetailList: this.state.retailBarCodeList });
          // this.state.barCodeList = this.state.dlslips.lineItems;
        }

        this.state.barCodeRetailList.forEach((barCode, index) => {
          costPrice = costPrice + barCode.listPrice;
          discount = discount + barCode.promoDisc;
          total = total + barCode.listPrice;
        });

        //      discount = discount + this.state.manualDisc;

        this.setState({
          netPayableAmount: total,
          totalPromoDisc: discount,
          grossAmount: costPrice,
        });

        // this.getTaxAmount();
      }

    });
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


  getDeliverySlipDetails= (e) => {

    // this.setState({ showTable: false });
    let costPrice = 0;
    let discount = 0;
    let total = 0;
    let netTotal=0;
    let promoDiscValue=0;
    let scgtTotal =0;
    let cgstTotal=0;
    let isEstimationEnable = '';
    this.state.barCodeList = [];
    this.state.finalList = [];
    this.state.rBarCodeList = [];
    const obj = {
      "dsNumber": this.state.dsNumber.trim(),
    }
    this.state.dsNumberList.push(obj);
    this.state.getDelivaryslipNo = this.state.dsNumber;
    const storeId = sessionStorage.getItem("storeId");
    
    if (e.key === "Enter") {
      if(this.state.dayCloseDates.length !== 0){
        if(this.state.dayCloseDates.length === 1 && this.state.dayCloseDates[0].dayClose.split("T")[0]  === this.state.toDay){
        const user = JSON.parse(sessionStorage.getItem('user'));
      if(user["custom:isEsSlipEnabled"] === "true") {
          isEstimationEnable =true ;
          this.setState({isEstimationEnable:true})  
          if(this.state.dsCompareList.length  === 0){
            this.state.dsNumberList2.push(obj);
            this.setState({
              dsCompareList: [...this.state.dsNumberList2],
              dsNumber : this.state.dsNumberList2
            })
      
          }else{
            const isFound = this.state.dsCompareList.find(element => {
              if (element.dsNumber === obj.dsNumber) {
                toast.error("DS Number Alredy Exist");
                this.setState({
                  dsNumber: '',
              });
                return true;
              }
                return false;
        
        
            });
            if(!isFound){
              this.state.dsNumberList2.push(obj);
              this.state.dsCompareList.push(this.state.dsNumberList2);
              const flattened = this.state.dsCompareList.flatMap(dsNumber => dsNumber);
              this.setState({
                 dsCompareList: flattened,
                dsNumber : this.state.dsNumberList2
              })
            }
          }
      } else {
          isEstimationEnable =  false;
          this.setState({isEstimationEnable:false})
      }
    NewSaleService.getDeliverySlipDetails(this.state.dsNumber.trim(),isEstimationEnable,storeId).then((res) => {
      this.setState({ showTable: true ,enableCoupon : true});
      if(isEstimationEnable){
        this.state.dlslips.push(res.data.lineItems);
        const flattened = this.state.dlslips.flatMap(barCode => barCode);
        if (this.state.dlslips.length > 1) {
          const barList = flattened.filter(
            (test, index, array) =>
              index ===
              array.findIndex((findTest) => findTest.lineItemId === test.lineItemId)
          );
          var combineList = {};

        barList.forEach((itm) => {
        var barCode = itm.barCode;
        itm.quantity = parseInt(itm.quantity)
        itm.netValue = parseInt(itm.netValue)
        itm.grossValue = parseInt(itm.grossValue)
      if (!combineList[barCode]) {
        return combineList[barCode] = itm
      }
       return combineList[barCode].quantity = combineList[barCode].quantity + itm.quantity ,
       combineList[barCode].netValue = combineList[barCode].netValue + itm.netValue ,
       combineList[barCode].grossValue = combineList[barCode].grossValue + itm.grossValue
})

      var combineList2 = []
    Object.keys(combineList).forEach((key) => {
    combineList2.push(combineList[key])
})
    const clearList = [...combineList2]
          if (barList.length > 1) {

            this.setState({ barCodeList:  clearList,dsNumber: '' , dsNumberList2:[]});

          } else {
            this.setState({ barCodeList: clearList, dsNumber: '',dsNumberList2 :[]  });
          }

        } else {
          if(isEstimationEnable) {
             this.setState({ barCodeList:res.data.lineItems , dsNumber: '',dsNumberList2:[]});
          } else {
            this.setState({ barCodeList:res.data.barcode , dsNumber: '',dsNumberList2 :[]});
          }  


          // this.state.barCodeList = this.state.dlslips.lineItems;
        }
      this.state.barCodeList.forEach((barCode, index) => {
        costPrice = costPrice + barCode.itemPrice;
        promoDiscValue = promoDiscValue+barCode.promoDiscount
        total = total + barCode.grossValue;
        netTotal= netTotal+barCode.grossValue;
        // scgtTotal = total + barCode.sgst + barCode.cgst;
        scgtTotal = Math.round(barCode.sgst);
        cgstTotal = Math.round(barCode.cgst);
        

      });
      this.state.barCodeList.forEach((element ,ind) => {
        if(element.sgst  && element.sgst !== 0 && element.sgst !== 'null' && element.cgst  && element.cgst !== 0 && element.cgst !== 'null'){
                    element.sgsttotal =  (parseInt(element.sgst) * element.quantity)
                    element.cgsttotal = (parseInt(element.cgst) * element.quantity)
                }else{
                  // element.returnedAmout = parseInt(element.returnQty) * element.netValue
                }
        element.returnedAmout = (parseInt(element.returnQty) * element.netValue)/element.quantity
      });
      let stateGST = this.state.barCodeList.reduce((accumulator, curValue)=>{
        if(curValue.sgst && curValue.sgst !== 0 && curValue.sgst !== 'null'){
          accumulator = accumulator + curValue.sgsttotal;
        }
        return accumulator;
    
    }, 0);
    let centralGST = this.state.barCodeList.reduce((accumulator, curValue)=>{
      if(curValue.cgst && curValue.cgst !== 0 && curValue.cgst !== 'null' ){
        accumulator = accumulator + curValue.cgsttotal;
      }
      return accumulator;
    
    }, 0);
      discount = discount + this.state.manualDisc;
      const user = JSON.parse(sessionStorage.getItem('user'));
      if((user["custom:isTaxIncluded"] === "true")&& (user["custom:isTaxIncluded"] !== "null")){
        this.setState({
          netPayableAmount: total,
          grandNetAmount: netTotal,
          totalPromoDisc: promoDiscValue,
          grossAmount: costPrice,
           totalAmount :total,
           stateGST :Math.round(stateGST) ,
           centralGST :Math.round(centralGST),
        });

      }else{
        this.setState({
          netPayableAmount: total,
          grandNetAmount: total+Math.round(stateGST)+ Math.round(centralGST),
          totalPromoDisc: promoDiscValue,
          grossAmount: total+scgtTotal + cgstTotal,
           totalAmount :total+Math.round(stateGST)+ Math.round(centralGST),
           stateGST :Math.round(stateGST) ,
           centralGST :Math.round(centralGST),
        });

      }



      // this.setState({
      //   netPayableAmount: total,
      //   grandNetAmount: netTotal,
      //   totalPromoDisc: promoDiscValue,
      //   grossAmount: costPrice,
      //   // totalAmount :scgtTotal
      // });
      if (this.state.barCodeList.length > 0) {
        this.setState({ enablePayment: true });
      }
      // if(isEstimationEnable) {
      //   this.setState({barCodeList:res.data.lineItems , dsNumber:''});
      // }

      } else {
            let count = false;
            if (this.state.dlslips.length === 0) {
              this.state.dlslips.push(res.data.lineItems);
              const flattened = this.state.dlslips.flatMap(barCode => barCode);
              this.setState({barcodeList :flattened})
            }
            
            else {
              for (let i = 0; i < this.state.barcodeList.length; i++) {
                if (
                  this.state.barcodeList[i].barCode ===
                  res.data.lineItems[0].barCode
                ) {
                  count = true;
                 // count = true;
                  var items = [...this.state.barcodeList]
                  if (parseInt(items[i].qty) + 1 <= parseInt(items[i].quantity)) {
                    let addItem = parseInt(items[i].qty) + 1;
                     items[i].qty = addItem.toString()
                     let totalcostMrp = items[i].itemPrice * parseInt(items[i].qty)
                     items[i].totalMrp = totalcostMrp
                    break;
                } else{
                  toast.info("Insufficient Quantity");
                  break;
                }
                  } 
                 
                }
                if (!count) {
                  this.state.dlslips.push(res.data.lineItems);
                    const flattened = this.state.dlslips.flatMap(barCode => barCode);
                    this.setState({barcodeList :flattened})
                    const barList = this.state.barcodeList.filter(
                      (test, index, array) =>
                        index ===
                        array.findIndex((findTest) => findTest.barCode === test.barCode)
                    );
                    this.setState({barcodeList :barList})
                }

              }


          this.setState({ barCodeList: this.state.barcodeList , dsNumber: ''  });
          // this.state.barCodeList = this.state.dlslips.lineItems;
          this.state.barCodeList.forEach((barCode, index) => {
            if (barCode.qty > 1) {
              //  barCode.grossValue = barCode.itemPrice * barCode.qty;
                
             } else {
               // barCode.grossValue = barCode.itemPrice;
               barCode.qty = parseInt("1");
              // total = total + barCode.grossValue;
             }
            costPrice = costPrice + barCode.itemPrice;
            promoDiscValue = promoDiscValue+barCode.promoDiscount
            total = total + barCode.itemPrice *barCode.qty;
            netTotal= netTotal+barCode.itemPrice*barCode.qty ;
            // scgtTotal = total + barCode.sgst + barCode.cgst;
            scgtTotal = Math.round(barCode.sgst);
            cgstTotal = Math.round(barCode.cgst);
            
   });
  
   this.state.barCodeList.forEach((element ,ind) => {
    if(element.sgst  && element.sgst !== 0 && element.sgst !== 'null' && element.cgst  && element.cgst !== 0 && element.cgst !== 'null'){
                element.sgsttotal =  (parseInt(element.sgst) * element.qty)
                element.cgsttotal = (parseInt(element.cgst) * element.qty)
            }else{
              // element.returnedAmout = parseInt(element.returnQty) * element.netValue
            }
    element.returnedAmout = (parseInt(element.returnQty) * element.netValue)/element.quantity
  });
  let stateGST = this.state.barCodeList.reduce((accumulator, curValue)=>{
    if(curValue.sgst && curValue.sgst !== 0 && curValue.sgst !== 'null'){
      accumulator = accumulator + curValue.sgsttotal;
    }
    return accumulator;

}, 0);
let centralGST = this.state.barCodeList.reduce((accumulator, curValue)=>{
  if(curValue.cgst && curValue.cgst !== 0 && curValue.cgst !== 'null' ){
    accumulator = accumulator + curValue.cgsttotal;
  }
  return accumulator;

}, 0);
// this.setState({stateGST :Math.round(stateGST) , centralGST :Math.round(centralGST)});

    // this.setState({ returnSlipTotal: returnSlipTotal })
  // });

  
   discount = discount + this.state.manualDisc;
   const user = JSON.parse(sessionStorage.getItem('user'));
   if((user["custom:isTaxIncluded"] === "true")&& (user["custom:isTaxIncluded"] !== "null")){
     this.setState({
       netPayableAmount: total,
       grandNetAmount: netTotal,
       totalPromoDisc: promoDiscValue,
       grossAmount: costPrice,
        totalAmount :total,
        enableCoupon:true
     
     });

   }else{
     this.setState({
      netPayableAmount: total,
      grandNetAmount: total+Math.round(stateGST)+ Math.round(centralGST),
      totalPromoDisc: promoDiscValue,
      stateGST :Math.round(stateGST) ,
      centralGST :Math.round(centralGST),
      grossAmount: costPrice,
       totalAmount :total+Math.round(stateGST)+ Math.round(centralGST),
       enableCoupon:true
        
        
     });
     console.log("enableCoupon",this.state.enableCoupon)

   }
        // const grandTotal = this.state.netPayableAmount;
        // this.setState({ grandNetAmount: grandTotal, totalAmount: grandTotal });

        if (this.state.barCodeList.length > 0) {
          this.setState({ enablePayment: true });
        }

      }


      sessionStorage.setItem("holdData",JSON.stringify(null));
      sessionStorage.removeItem("holdData");


      // this.getTaxAmount();
    });
  }else{
    toast.error("Please Close Previous Days");
  }
  
}else{
  toast.error("Unable To Sale Today Daycloser Is Done")
}
    }

  }

  getTaxAmount() {
    const taxDetails = JSON.parse(sessionStorage.getItem("HsnDetails"));
    let slabCheck = false;
    let totalTax = 0
    let sgst =0
    let cgst =0
    this.state.barCodeList.forEach(barData => {
      // if (this.state.netPayableAmount >= taxData[0].priceFrom && this.state.netPayableAmount <= taxData[0].priceTo) {
      //   const taxPer = taxData[0].taxVo.taxLabel.split(' ')[1].split('%')[0];
      //   const tax = parseInt(taxPer) / 100;

      //   const totalTax = this.state.netPayableAmount * tax

      //   const central = totalTax / 2;
      //   this.setState({ centralGST: Math.ceil(central) });
      //   slabCheck = true;

      // }

       sgst= sgst+barData.sgst
       cgst= cgst+barData.cgst
       totalTax = sgst+cgst

    });

    this.setState({ centralGST:Math.round(cgst) });
    this.setState({ stateGST:Math.round(sgst )});
     const grandTotal = this.state.netPayableAmount;
    // // const grandscgst = this.state.totalAmount;
     this.setState({ grandNetAmount: grandTotal  });
     const user = JSON.parse(sessionStorage.getItem('user'));
     if((user["custom:isTaxIncluded"] === "true") && (user["custom:isTaxIncluded"] !== "null")){
     
        const grandTotal = this.state.netPayableAmount;
        this.setState({ grandNetAmount: grandTotal ,totalAmount :grandTotal});
    

    }else{
      const grandTotal = this.state.netPayableAmount;
      const grandscgst = this.state.netPayableAmount + this.state.centralGST + this.state.stateGST  ;
      this.setState({

        grandNetAmount: grandTotal,
        totalAmount : grandscgst
      });
      

    }

  }

  getMobileDetails = (e) => {
    if (e.key === "Enter") {
      NewSaleService.getMobileData(this.state.mobilenumber).then((res) => {
        if (res && res.data.isSuccess === "true" && res.data.result) {
          this.state.mobileData = res.data.result;
          this.setState({
            customerName: res.data.result.name,
            gender: res.data.result.gender,
            dob: res.data.result.dob,
            customerEmail: res.data.result.email,
            customerGST: res.data.result.gstNumber,
            address: res.data.result.address,
          });



        }
      });
    }
  };
  invoiceLevelCheckPromo(){
    this.getinvoiceLevelCheckPromo();


  }
  getinvoiceLevelCheckPromo()  {
    let costPrice = 0;
    let discount = 0;
    let total = 0;
    let discAppliedTotal=0;
    const storeId = sessionStorage.getItem("storeId");

    const requestObj = this.state.barCodeList.map((item) => {
      let obj = {};
      obj.actualValue = item.actualValue;
      obj.barCode=item.barCode;
      obj.cgst=item.cgst;
      obj.discount=item.promoDiscount;
      obj.division=item.division;
      obj.domainId=item.domainId;
      obj.grossValue=item.grossValue;
      obj.hsnCode=item.hsnCode;
      obj.itemPrice=item.itemPrice;
      obj.lineItemId=item.lineItemId;
      obj.netValue=item.netValue;
      obj.quantity=item.quantity;
      obj.section=item.section;
      obj.sgst=item.sgst;
      obj.storeId=item.storeId;
      obj.subSection=item.subSection;
      obj.taxValue=item.taxValue;
      obj.userId=item.userId;
      obj.costPrice=item.costPrice;
      obj.uom=item.uom;
      obj.originalBarcodeCreatedAt=item.createdDate;
      obj.batchNo=item.batchNo;
      obj.promoDiscount= 0;
     return obj;
    });
    const user = JSON.parse(sessionStorage.getItem('user'));
    if(user["custom:isEsSlipEnabled"] === "true") {
      console.log("custom:isEsSlipEnabled",user["custom:isEsSlipEnabled"])
    NewSaleService.getinvoiceLevelCheckPro(1,storeId,requestObj,).then((res) => {
      if (res.status === 200) {
        this.setState({
          barCodeList: res.data.result,
           isCheckPromo:true,
        });

        this.state.barCodeList.forEach((barCode, index) => {
          costPrice = costPrice + barCode.itemPrice;
          discount = discount + barCode.promoDiscount;
          total = total + barCode.netValue;
        });

        discount = discount + this.state.manualDisc;
        discAppliedTotal = this.state.grandNetAmount-discount;
        this.setState({
          netPayableAmount: total,
          totalPromoDisc: discount,
          grossAmount: costPrice,
          grandNetAmount:discAppliedTotal
        });
        if (this.state.barCodeList.length > 0) {
          this.setState({ enablePayment: true });
        }

        // this.getTaxAmount();
      }else {
        toast.error("no Promo Available");
        this.setState({isCheckPromo:true});
      }
    });
  }else{
   
    console.log("custom:isEsSlipEnabled",user["custom:isEsSlipEnabled"])
    NewSaleService.getCheckPromoAmount(storeId,1,requestObj).then(response => {
      if (response.status === 200) {
        this.setState({
         
           isCheckPromo:true, 
        
        });
      }
      if (response && response.data && response.data.result[ 0 ].calculatedDiscountsVo) {
        this.setState({ promoDiscount: response.data.result },()=>{
         
        });
        this.state.barCodeList.forEach(barCodeData => {
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



        // this.setState({ barList: this.state.barList });
        this.calculateTotal();

      } else {
        toast.error("No Promo applicable");
      }

    });
  }
  }

  showDiscount() {
    this.state.totalManualDisc = 0;
    this.setState({ isBillingDisc: true, isBillLevel: false, returnCash: 0 }, () => {
      this.getDiscountReasons();
    });


  }

  hideDiscount() {
    this.setState({ isBillingDisc: false,  returnCash: 0, selectedDisc: {} });
  }
  showCalculator() {

    this.setState({ isCalculator: true });
  }

  hideCal() {
    this.setState({ isCalculator: false });
  }
  handleReasonChange = (e) => {
    this.setState({ dropValue: e.label });
  }

  saveDiscount() {
    if (this.state.manualDisc < this.state.grandNetAmount) {

      if (Object.keys(this.state.selectedDisc).length !== 0 && this.state.manualDisc !== 0 && this.state.discApprovedBy !== '') {
        // this.state.netPayableAmount = 0;
        const totalDisc = parseInt(this.state.manualDisc);
        if (totalDisc < this.state.grandNetAmount) {
          const netPayableAmount = this.state.grandNetAmount - totalDisc;
          this.state.grandNetAmount = netPayableAmount;

         // this.getTaxAmount();
        }
        const promDisc = parseInt(this.state.manualDisc) + this.state.totalPromoDisc;
        this.setState({ showDiscReason: true, promoDiscount: promDisc, isBillingDiscount: true, isBillLevel: true , enableCoupon:false
        ,isCheckPromo:true  , });

        this.hideDiscount();
      } else {
        toast.info("Please Enter all fields");
        this.setState({isBillLevel: false})
      }
    } else {
      toast.error("Bill level discount should be less than Payable Amount");
      this.setState({isBillLevel: false})
    }


  }
  
  getDiscountReasons() {
    NewSaleService.getDiscountReasons().then((res) => {
      if (res.status === 200) {
        //this.setState({discReasons: res.data});
        const discount = res.data.result;
        discount.forEach((dis, index) => {
          const obj = {
            value: dis,
            label: dis,
          };
          this.state.discReasons.push(obj);
        });
    } else {
        toast.error(res.data);
      }
    })
  }
  
  
   


  handleChange(e) {
    const regex = /^[0-9\b]+$/;
    const value = e.target.value;
    if (value === "" || regex.test(value)) {
      this.setState({
        [e.target.id]: e.target.value,
        mobilenumber: e.target.value,
      });
    } else {
      this.setState({ registerMobile: "" });
      // toast.error("pls enter numbers")
    }
    // this.setState({ mobilenumber: event.target.value });
  }


  manualCardPayment=()=>{
    // const collectedCash = parseInt(this.state.cashAmount);
    const obj = {

      "paymentType": "Card",
      "paymentAmount": this.state.grandNetAmount
    }
    this.state.paymentType.push(obj);
    this.hideCardAutoModel();
    this.savePayment();

  }

  getReturnAmount = () => {
    this.setState({isEnableProccedtoCheck: true ,enableCoupon:false})
    if (this.state.barCodeList.length > 0 || this.state.barCodeRetailList.length > 0) {
      this.setState({ isPayment: false });
    }
    

    this.state.grandReceivedAmount =
      this.state.netPayableAmount + this.state.taxAmount;
    const collectedCash = parseInt(this.state.cashAmount);

    if (collectedCash > this.state.grandNetAmount) {
      this.state.returnCash = collectedCash - this.state.grandNetAmount;
      this.state.returnCash = Math.round(this.state.returnCash);
      this.setState({payingAmount: this.state.grandNetAmount}, () => {
        this.setState({grandNetAmount: 0})
      } );
      this.setState({isCash: false});
    } else if (collectedCash == Math.round(this.state.grandNetAmount)) {
      this.setState({ isPayment: false,payingAmount: this.state.grandNetAmount, grandNetAmount: 0,});
      this.setState({ isPayment: false,payingAmount: this.state.grandNetAmount}, () => {
        this.setState({grandNetAmount: 0})
      } );
      this.setState({isCash: false});

    } else if(collectedCash < this.state.grandNetAmount ||collectedCash!=="" ) {
     // this.state.grandNetAmount = this.state.grandNetAmount - collectedCash;
     toast.error("Please collect suffient amount");
    } else {
      this.state.cashAmount = 0;
      this.state.returnCash = 0;
      this.state.grandNetAmount = 0;
      this.state.grandReceivedAmount = 0;
      this.setState({ isPayment: true});
      this.setState({isCash: false});
    }
    if(this.state.isRTApplied){
      this.setState({payingAmount: this.state.grandNetAmount+this.state.rtAmount})
    }
    // if (this.state.returnCash >= 1 || this.state.returnCash === 0) {
    //   this.setState({isCash: false});
    // } else {
    //   toast.error("Please collect suffient amount");
    // }
   
    
   
    const obj = {

      "paymentType": "Cash",
      "paymentAmount": this.state.grandNetAmount
    }
    this.state.paymentType.push(obj);

    // }
    //  this.hideCashModal();
    if(this.state.grandNetAmount !== 0 || this.state.totalAmount === 0){
      this.setState({isProccedtoCheck : true ,enablePayment: false ,isCheckPromo:true ,isBillLevel:true})
      console.log("sra",this.state.isEnableProccedtoCheck)
    }
  };

  removeDuplicates(array, key) {
    const lookup = new Set();
    return array.filter(obj => !lookup.has(obj[key]) && lookup.add(obj[key]));
  }

  savePayment() {
    this.setState({isEnableProccedtoCheck: false })
    this.state.discType = this.state.dropValue;
    this.state.dsNumberList = this.removeDuplicates(this.state.dsNumberList, "dsNumber");
    if (this.state.showDiscReason) {
      if (this.state.discApprovedBy && this.state.discType) {
        this.createInvoice();
      } else {
        toast.info("Please select discount type/ discount reason");
      }
    } else {
       this.createInvoice();   
    }
  }

  createInvoice() {
    if(this.state.isRTApplied){
      
      this.setState({payingAmount: this.state.grandNetAmount+this.state.rtAmount})
      const obj = {

        "paymentType": "RTSlip",
        "paymentAmount": this.state.rtAmount
      }
      this.state.paymentType.push(obj);
      
      if(this.state.rtAmount < this.state.grandNetAmount){

      
      if(this.state.isCash){
        
        const obj ={ "paymentAmountType": [
          {
            "paymentType": "RTSlip",
            "paymentAmount": this.state.rtAmount
          },
                      {
                        "paymentType": "Cash",
                        "paymentAmount": this.state.cashAmount
                      }
                    ]
        }
      
        this.state.paymentType.push(obj);
       

      }
      if(this.state.isKathaModel){
        const obj ={ "paymentAmountType": [
          {
            "paymentType": "RTSlip",
            "paymentAmount": this.state.rtAmount
          },
          {
            "paymentType": "PKTPENDING",
            "paymentAmount": this.state.grandNetAmount
            }
                    ]
        }
      
       
        this.state.paymentType.push(obj);
        
        
      }
      if(this.state.isCreditModel){
        const obj ={ "paymentAmountType": [
          {
            "paymentType": "RTSlip",
            "paymentAmount": this.state.rtAmount
          },
          {
            "paymentType": "PKTADVANCE",
            "paymentAmount": this.state.grandNetAmount
            }
                    ]
        }
      
       
        this.state.paymentType.push(obj);
       
      }
    }
    }
     if(this.state.giftCouponsList.length>=1){
            const obj = {
              "paymentType": "GIFTVOUCHER",
              "paymentAmount": this.state.couponAmount
            }
            this.state.paymentType.push(obj);
        }
    this.setState({ netCardPayment: this.state.grandNetAmount })
    this.state.dsNumberList = this.removeDuplicates(this.state.dsNumberList, "dsNumber");
    sessionStorage.removeItem("recentSale");
    const storeId = sessionStorage.getItem("storeId");

    let obj;
    //  if (this.state.isTextile) {
      obj = {

        "natureOfSale": "InStore",

        "domainId": 1,

        "storeId": parseInt(storeId),

        "grossAmount": this.state.grossAmount,

        "totalPromoDisc": this.state.totalPromoDisc,

        "totalManualDisc": parseInt(this.state.manualDisc),

        "taxAmount": this.state.taxAmount,

        "discApprovedBy": this.state.discApprovedBy,

        "discType": this.state.discType,

        "approvedBy": null,

        "netPayableAmount": this.state.payingAmount,

        "offlineNumber": null,

        "mobileNumber": this.state.mobileData.mobileNumber,
        "customerFullName":this.state.customerFullName,
        "customerName": this.state.mobileData.userName,

        "userId": this.state.userId ? this.state.userId : null,

        "sgst": this.state.stateGST,
        "cgst": this.state.centralGST,
        "dlSlip": this.state.dsNumberList,
        "lineItemsReVo": this.state.barCodeList,
        "createdBy": this.state.createdBy,
        "recievedAmount": parseInt(this.state.cashAmount),
        "returnAmount": this.state.returnCash,
        "paymentAmountType": this.state.paymentType,
        "returnSlipNumbers" : this.state.numRtList,
        "gvAppliedAmount" :(this.state.couponAmount===null?0:this.state.couponAmount),
         "returnSlipAmount" : (this.state.rtAmount===null?0:this.state.rtAmount),
        "totalAmount":this.state.grandNetAmount,
        "gvNumber": this.state.listOfGVs
      }

      if (this.state.isCard) {
        delete obj.paymentAmountType
      }
      NewSaleService.saveSale(obj).then((res) => {
        if (res) {
          if(this.state.selectedPaymentMethod === 'cash'){
            // Printer Service used for Testing
            PrinterStatusBill('INVOICE',res.data.result,this.state.barCodeList,obj)

          }
          this.setState({ isBillingDetails: false, dsNumber: "",upiAmount: this.state.grandNetAmount, finalList: [] , objInvoice:[...this.state.objInvoice,obj] });
          this.setState({ showDiscReason: false, isPayment: true ,dsCompareList : [] ,barCodeList :[],dlslips :[],barcodeList:[],isProccedtoCheck:false ,isTagCustomerpop:false
            ,isCheckPromo:false ,isBillLevel:false ,isTagCustomer:false ,isRTnumAplied : true ,isCouponApplied  : true ,enableCoupon:false
          
          });
          sessionStorage.setItem("recentSale", res.data.result);
          toast.success(res.data.result);
          this.setState({ newSaleId: res.data.result },()=>{
            if(this.state.selectedPaymentMethod !== 'card'){
                this.clearStateFields();
            }
          }
          );
          if (this.state.isCard || this.state.isUPIModel) {
            this.pay()
          }
        } else {
          toast.error(res.data.result);
        }
      });

    // }

    // else if (this.state.isRetail) {
    //   let lineItems = [];
    //   this.state.retailBarCodeList.forEach((barCode, index) => {
    //     const obj = {
    //       "barCode": barCode.barcodeId,
    //       "domainId": 2,
    //       "itemPrice": barCode.listPrice,
    //       "netValue": barCode.listPrice,
    //       "quantity": 1
    //     }
    //     lineItems.push(obj);
    //   });
    //   CreateDeliveryService.getLineItem(lineItems, 2).then(res => {
    //     if (res) {
    //       let lineItemsList = [];
    //       let dataResult = JSON.parse(res.data.result);
    //       dataResult.forEach(element => {
    //         const obj = {
    //           "lineItemId": element
    //         }
    //         lineItemsList.push(obj);
    //       });




    //       this.setState({ lineItemsList: lineItemsList }, () => {


    //         obj = {

    //           "natureOfSale": "InStore",

    //           "domainId": 2,

    //           "storeId": parseInt(storeId),

    //           "grossAmount": this.state.grossAmount,

    //           "totalPromoDisc": this.state.totalPromoDisc,

    //           "totalManualDisc": parseInt(this.state.manualDisc),

    //           "taxAmount": this.state.taxAmount,

    //           "discApprovedBy": this.state.discApprovedBy,

    //           "discType": this.state.discType,

    //           "approvedBy": null,

    //           "netPayableAmount": this.state.netPayableAmount,

    //           "offlineNumber": null,

    //           "userId": this.state.userId ? this.state.userId : null,

    //           "dlSlip": null,
    //           "lineItemsReVo": this.state.lineItemsList,
    //           "sgst": this.state.centralGST,
    //           "cgst": this.state.centralGST,
    //           "createdBy": this.state.createdBy,
    //           "recievedAmount": this.state.cashAmount,
    //           "returnAmount": this.state.returnCash,
    //           "paymentAmountType": [
    //             {
    //               "paymentType": "Cash",
    //               "paymentAmount": this.state.cashAmount
    //             },
    //             {
    //               "paymentType": "PKTADVANCE",
    //               "paymentAmount": "2200"
    //             }
    //           ]

    //         }


    //         NewSaleService.saveSale(obj).then((res) => {
    //           if (res) {
    //             this.setState({ isBillingDetails: false, dsNumber: "", finalList: [] });
    //             this.setState({
    //               customerName: " ",
    //               gender: " ",
    //               dob: " ",
    //               customerGST: " ",
    //               address: " ",
    //               manualDisc: "",
    //               customerEmail: "",
    //               dsNumber: "",
    //               barcode: "",
    //               showTable: false,
    //               cashAmount: 0,
    //               stateGST: 0,
    //               centralGST: 0,
    //               barCodeRetailList: [],
    //               returnCash: 0,
    //               grandNetAmount: 0,
    //               totalAmount: 0,
    //               isCredit: false

    //             });
    //             this.setState({ showDiscReason: false, isPayment: true });
    //             sessionStorage.setItem("recentSale", res.data.result);
    //             toast.success(res.data.result);
    //             this.setState({ newSaleId: res.data.result });

    //             if (this.state.isCard) {
    //               this.pay();
    //             }
    //           } else {
    //             toast.error(res.data.result);
    //           }
    //         });
    //       });
    //     }
    //   });

    // }





  }

  tagCustomer() {
    const selectedMobile = JSON.parse(JSON.stringify(this.state.mobilenumber));
    const obj = {
      "id": "",
      "phoneNo": "+91" + this.state.mobilenumber,
      "name": "",
      "active": false,
      "inActive": false,
      "roleId": "",
      "storeId": ""
    }

    CreateDeliveryService.getUserByMobile("+91" + this.state.mobilenumber).then(res => {
      if (res) {
        const mobileData = res.data.result;
        this.setState({
          userId: res.data.result.userId,
          customerFullName: res.data.result.userName,
          isTagCustomerpop:true,
          isTagCustomer: true,
       
        });

        this.state.mobileData = {
          address: this.state.address,
          altMobileNo: "",
          dob: this.state.dob,
          gender: mobileData.gender,
          gstNumber: this.state.gstNumber,
          mobileNumber: mobileData.phoneNumber,
          name: mobileData.userName,
          email: this.state.customerEmail,
        };

        this.setState({
          isBillingDetails: true,
          customerMobilenumber: mobileData.phoneNumber,
        });

        NewSaleService.getCreditNotes(selectedMobile, res.data.result.userId).then(response => {
          if (response) {
            if (response.data.result && response.data.result.length > 0) {
              this.setState({ isCredit: true, creditAmount: response.data.result[0].amount });
            }
          }
        });

      } else {

      }
    });


    this.hideModal();
  }



  handleCallback = (childData) => {
  };

  handleDiscountChange = (e) => {
    this.setState({ dropValue: e.label });
    this.setState({ discType: e.label });
    this.setState({ selectedDisc: e });
    //  this.setState({discType: e.label}); this.state.isCardSelected &&
  };
  renderPayment() {
    if (this.state.isCashSelected) {
      return (
        <tr className="row m-0 p-0">
          <td className="col-6">Collected Cash</td>
          <td className="col-6 text-right font-bold">
            ₹ {this.state.cashAmount}
          </td>
        </tr>
      );
    } else if (this.state.isCardSelected) {
      return (
        <tr className="row m-0 p-0">
          <td className="col-6">Card Payment</td>
          <td className="col-6 text-right font-bold">
            ₹ {this.state.cardAmount}
          </td>
        </tr>
      );
    }
  }
checkQuantity(e, index, item) {
    this.setState({ isgetLineItems: true })
    if (e.target.value !== "") {
      item.qty = parseInt(e.target.value);
      let quantity = item.qty;
      if (item.qty <= item.quantity) {
        this.setState({ qty: e.target.value });
        item.qty = parseInt(e.target.value);
        let totalcostMrp = item.itemPrice * parseInt(e.target.value);

      } else {
        this.setState({ isgetLineItems: false })
        toast.info("Insufficient Quantity");
      }
    } else {
      item.qty = parseInt(e.target.value);
    }
    let total = 0;
    let costPrice =0;
    let  promoDiscValue = 0;
    let  discount = 0;
    let netTotal = 0;
    let sgst = 0;
    let cgst = 0;
    let scgtTotal = 0;
    this.state.barCodeList.forEach((barCode, index) => {
      costPrice = costPrice + barCode.itemPrice;
      promoDiscValue = promoDiscValue+barCode.promoDiscount
      total = total + barCode.itemPrice * barCode.qty ;
      netTotal= netTotal+barCode.itemPrice *  barCode.qty;
      // scgtTotal = total + barCode.sgst + barCode.cgst;
      scgtTotal = Math.round(barCode.sgst)*barCode.qty+Math.round(barCode.cgst)*barCode.qty;
      sgst = Math.round(barCode.sgst)* barCode.qty;
      cgst = Math.round(barCode.cgst)* barCode.qty;

            
if (barCode.qty > 1) {
  

} else {
//barCode.grossValue = barCode.itemPrice;
barCode.qty = parseInt("1");

}
});
console.log("barCodeList",this.state.barCodeList)
this.state.barCodeList.forEach((element ,ind) => {
  if(element.sgst  && element.sgst !== 0 && element.sgst !== 'null' && element.cgst  && element.cgst !== 0 && element.cgst !== 'null'){
              element.sgsttotal =  (parseInt(element.sgst) * element.qty)
              element.cgsttotal = (parseInt(element.cgst) * element.qty)
          }else{
            // element.returnedAmout = parseInt(element.returnQty) * element.netValue
          }
  element.returnedAmout = (parseInt(element.returnQty) * element.netValue)/element.quantity
});
let stateGST = this.state.barCodeList.reduce((accumulator, curValue)=>{
  if(curValue.sgst && curValue.sgst !== 0 && curValue.sgst !== 'null'){
    accumulator = accumulator + curValue.sgsttotal;
  }
  return accumulator;

}, 0);
let centralGST = this.state.barCodeList.reduce((accumulator, curValue)=>{
if(curValue.cgst && curValue.cgst !== 0 && curValue.cgst !== 'null' ){
  accumulator = accumulator + curValue.cgsttotal;
}
return accumulator;

}, 0);
// this.setState({stateGST :Math.round(stateGST) , centralGST :Math.round(centralGST)});

  // this.setState({ returnSlipTotal: returnSlipTotal }),
// });


 discount = discount + this.state.manualDisc;
 const user = JSON.parse(sessionStorage.getItem('user'));
 if((user["custom:isTaxIncluded"] === "true")&& (user["custom:isTaxIncluded"] !== "null")){
   this.setState({
     netPayableAmount: total,
     grandNetAmount: netTotal,
     totalPromoDisc: promoDiscValue,
     grossAmount: costPrice,
      totalAmount :total,
   
   });

 }else{
   this.setState({
     netPayableAmount: total,
     grandNetAmount: total+Math.round(stateGST)+ Math.round(centralGST),
     totalPromoDisc: promoDiscValue,
     stateGST :Math.round(stateGST) ,
     centralGST :Math.round(centralGST),
     grossAmount: costPrice,
      totalAmount :total+Math.round(stateGST)+ Math.round(centralGST),
      
      
   });
   
}

  }



  showOrderDetails() {



    return this.state.showTable && (
      <div className="p-l-0 t-scroll">
        {/* {
          this.state.isTextile && ( */}
            <div className="table-responsive">

              <table className="table table-borderless mb-1">
                <thead>
                  <tr className="m-0 p-0">
                    <th className="col-1">S.NO</th>
                    <th className="col-2">Item</th>
                    {this.state.isEstimationEnable &&<th className="col-1">Qty</th>}
                    {!this.state.isEstimationEnable && <th className="col-1">Qty</th> }
                    <th className="col-2">MRP</th>
                    <th className="col-1">Discount</th>
                    { this.state.isTaxIncluded !== 'null' &&   <th className="col-2">Sgst</th>}
                    { this.state.isTaxIncluded !== 'null' &&   <th className="col-2">Cgst</th>}
                    <th className="col-1">Gross</th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.barCodeList.map((items, index) => {
                    return (
                      <tr className="m-0 p-0" key={index}>
                        <td className="col-1">
                          {index + 1}
                        </td>
                        <td className="col-2 content_w"><p>#{items.barCode}</p></td>
                        {this.state.isEstimationEnable && <td className="col-1">{items.quantity}</td>}
                        {!this.state.isEstimationEnable &&  
                        <td className="col-1 t-form"><input type="number"
                        value={items.qty}
                        min="1"
                        disabled = {this.state.isBillLevel || this.state.isCheckPromo||this.state.isProccedtoCheck  || !this.state.isRTnumAplied || !this.state.isCouponApplied } 
                        max={items.quantity}
                        onChange={(e) => this.checkQuantity(e, index, items)}
                        className="form-control" />
                      </td> }
                        <td className="col-2">₹ {items.itemPrice}</td>
                        <td className="col-1">₹ {items.discount}</td>
                        { this.state.isTaxIncluded !== 'null' &&   <td className="col-2">₹ {Math.round(items.sgst)}</td>}
                        { this.state.isTaxIncluded !== 'null' &&   <td className="col-2">₹ {Math.round(items.cgst)}</td>}
                        {this.state.isEstimationEnable && <td className="col-1">₹{items.grossValue}</td>}
                        {!this.state.isEstimationEnable && <td className="col-1">₹ {items.itemPrice*items.qty}</td>} 
                        {/* <td className="col-1">₹ {items.itemPrice*items.qty}</td> */}
                      </tr>
                    );
                  })}


                </tbody>
              </table>

            </div>
          {/* )
        } */}

        {
          this.state.isRetail && (
            <div className="table-responsive p-l-0">
              <table className="table table-borderless mb-1">
                <thead>
                  <tr className="m-0 p-0">
                    <th className="col-1">S.NO</th>
                    <th className="col-3">Item</th>
                    <th className="col-2">Qty</th>
                    <th className="col-2">Gross Amount</th>
                    <th className="col-2">Discount</th>
                    <th className="col-2">Net Value</th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.barCodeRetailList.map((items, index) => {
                    return (
                      <tr key={index}>
                        <td className="col-1 geeks">
                          {index + 1}
                        </td>
                        <td className="col-3"><p>#{items.barcodeId}</p></td>
                        <td className="col-2">{items.quantity}</td>
                        <td className="col-2">₹ {items.netValue}</td>
                        <td className="col-2">₹ {items.discount}</td>
                        <td className="col-2">₹ {items.listPrice}</td>
                      </tr>
                    );
                  })}


                </tbody>
              </table>

            </div>
          )
        }
      </div>




    );

  }

 


  render() {
    const {card} = this.state
    let subModalDialogStyles = {
      base: {
        bottom: -600,
        transition: "bottom 0.4s"
      },
      open: {
        bottom: 0,
      },
    };
    

    return (


      <div className="maincontent pt-0 o-flow">


        <Modal isOpen={this.state.isUPIModel} size="sm">
          <ModalHeader>
            UPI <button type='button' onClick={() =>this.hideUPIModel()} className='btn search modal-close text-right'> <img src={close}></img></button>
          </ModalHeader>
          <ModalBody className="p-3">
            <div className="row mt-2 mb-3">
              <div className="form-group">
                <label>Net Payable Amount: </label>
                <input
                  type="text"
                  name="cash"
                  className="form-control"
                  value={this.state.grandNetAmount}
                  disabled
                />
              </div>
              {/* <div className="col-8">
                <input
                  type="text"
                  name="cash"
                  className="form-control"
                  value={this.state.grandNetAmount}
                  disabled
                />
              </div> */}
            </div>
            <div className="row mb-2">
              <div className="form-group">
                <label>Mobile Number: </label>
                <input
                  type="text"
                  name="cash"
                  className="form-control"
                  minLength="10"
                  maxlength="10"
                  value={this.state.upiMobilenumber}
                  autoComplete="off"
                  onChange={(e) =>
                    this.setState({ upiMobilenumber: e.target.value })
                  }

                />
              </div>
              {/* <div className="col-8">
                <input
                  type="text"
                  name="cash"
                  className="form-control"
                  minLength="10"
                  maxlength="10"
                  value={this.state.upiMobilenumber}
                  autoComplete="off"
                  onChange={(e) =>
                    this.setState({ upiMobilenumber: e.target.value })
                  }

                />
              </div> */}
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.hideUPIModel}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              onClick={this.getUPILink}
            >
              Confirm
            </button>
          </ModalFooter>

        </Modal>


        <Modal isOpen={this.state.isCCModel} size="sm">
          <ModalHeader>
            Cash & Card Payment <button type='button' onClick={() =>this.hideCCModel()} className='btn search modal-close text-right'> <img src={close}></img></button>
          </ModalHeader>
          <ModalBody className="p-3">
            <div className="row mt-2 mb-3">
              <div className="form-group">
                <label>Net Payable Amount: </label>
                <input
                  type="text"
                  name="cash"
                  className="form-control"
                  value={this.state.grandNetAmount}
                  disabled
                />
              </div>
              {/* <div className="col-8">
                <input
                  type="text"
                  name="cash"
                  className="form-control"
                  value={this.state.grandNetAmount}
                  disabled
                />
              </div> */}
            </div>
            <div className="row mb-2">
              <div className="form-group">
                <label>Collected Cash: </label>
                <input
                  type="text"
                  name="cash"
                  className="form-control"
                  value={this.state.ccCollectedCash}
                  onChange={(e) =>
                    this.setState({ ccCollectedCash: e.target.value }, () => {
                      if (this.state.ccCollectedCash < this.state.grandNetAmount) {
                        let ccReturn = this.state.grandNetAmount - this.state.ccCollectedCash;
                        this.setState({ ccCardCash: ccReturn });

                      }
                    })
                  }

                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.hideCCModel}>
              Cancel
            </button>
            <button
              //className="btn-unic active fs-12"
              className={this.state.ccCollectedCash> 0 ? "btn-unic active fs-12" : "btn-selection fs-12"}
              disabled={!(this.state.ccCollectedCash>0)}
              onClick={this.saveCCAmount}
            >
              Confirm
            </button>
          </ModalFooter>

        </Modal>
        <Modal isOpen={this.state.isGvApplied} size="md">
          <ModalHeader>APPLY COUPON<button type='button' onClick={this.closeGvPopup} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>

          <ModalBody>
          <div className="row">
              <div className="col-9 p-r-1 mt-2">
                  <div className="form-group apply_btn mb-2">                    
                    <input type="text" className="form-control" placeholder="Coupon Code" value={this.state.couponCode}
                        onChange={(e) => this.setState({ couponCode: e.target.value })}
                      />                  
                  </div>                
              </div>
              <div className="col-3 p-l-1 mt-2">
                     <button type="button" className="btn-unic active fs-12" onClick={this.onCouponCode}>Apply</button>
                  </div> 
              <div className="col-12 mb-3 mt-3">
                <h6 className="text-secondary font-bold fs-14">Coupon Details</h6>
                    <div className="table-responsive">
                            <table className="table table-borderless mb-1">
                              <thead>
                                <tr className="">
                                  <th className="col-3">S.No</th>
                                  <th className="col-5">COUPON</th>
                                  <th className="col-4">VALUE</th>                               
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.giftCouponsList.length > 0 && this.state.giftCouponsList.map((item, ind) => {
                                 return (<tr key={ind}>
                                    <td className="col-3">{ ind + 1}</td>
                                    <td className="col-5">{item.gvNumber}</td>
                                    <td className="col-4">{item.value}</td>
                                 </tr>)
                                })}
                              </tbody>
                            </table>
                    </div>
                  </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.closeGvPopup}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              onClick={this.couponsAccumulation}
             >
              Submit
            </button>
          </ModalFooter>
          </Modal>
          <Modal isOpen={this.state.isRTSlip} size="md">
          <ModalHeader>APPLY RETURN SLIP<button type='button' onClick={this.closeRtPopup} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>

          <ModalBody>
          <div className="row">
              <div className="col-8">
                  <div style={{ display: 'block', float: 'left'}} className="form-group apply_btn mb-2">                    
                    <input type="text" className="form-control" placeholder="RT SLIP NUMBER" value={this.state.rtNumber}
                        onChange={(e) => this.setState({ rtNumber: e.target.value })}
                      />                  
                  </div>
                  <div style={{float: 'right'}}>
                     <button type="button" className="btn-unic active fs-12" onClick={this.onReturnSlip}> Apply</button>
                  </div>                 
              </div>
              <div className="row mb-3">
                    <div className="table-responsive">
                            <table className="table table-borderless mb-1">
                              <thead>
                                <tr className="m-0 p-0">
                                  <th className="col-1">S.No</th>
                                  <th className="col-3">RT NUMBER</th>
                                  <th className="col-3">BARCODE</th>
                                  <th className="col-1">QTY</th>
                                  <th className="col-4">RETURN AMOUNT</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.rtSlipList.length > 0 && this.state.rtSlipList.map((item, ind) => {
                                 return (<tr key={ind}>
                                    <td className="col-1">{ ind + 1}</td>
                                    <td className="col-3">{item.rtNumber}</td>
                                    <td className="col-3">{item.barCode}</td>
                                    <td className="col-1">{item.returnQty}</td>
                                    <td className="col-4">{item.returnAmount}</td>
                                 </tr>)
                                })}
                              </tbody>
                            </table>
                    </div>
                  </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.closeRtPopup}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              onClick={this.rtAccumulation}
             >
              Submit
            </button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.isKathaModel} size="sm">
          <ModalHeader>
            Katha Payment
            <button type='button' onClick={() =>this.hideKathaModel()} className='btn search modal-close text-right'> <img src={close}></img></button>
          </ModalHeader>
          <ModalBody className="p-3">
          <div className="row mt-2 mb-3">
              <div className="form-group">
                {/* <label> Cash: </label> */}
                <span>Adding Payment Details on Katha</span>
              </div>
              {/* <div className="col-8"> */}
                {/* <input
                  type="text"
                  name="cash"
                  className="form-control"
                  value={this.state.payCreditAmount}
                  onChange={(e) =>
                    this.setState({ payCreditAmount: e.target.value })
                  }
                /> */}
                {/* <span>Adding Payment Details on Katha</span> */}
              {/* </div> */}
            </div>
            <div className="row mb-2">
              <div className="form-group">
                <label>Katha Amount: </label>
                <input
                  type="text"
                  name="cash"
                  className="form-control"
                  // value={this.state.grandNetAmount}
                  // disabled

                  value={this.state.khataAmount}
                  // onChange={(e) =>
                  //   this.setState({ khataAmount: e.target.value })
                  // }
                  onChange={(e) =>
                    this.setState({ khataAmount: e.target.value },() => {
                      if (this.state.khataAmount < this.state.grandNetAmount||this.state.khataAmount==this.state.grandNetAmount ) {
                      this.setState({khataAmount:e.target.value})

                      }
                    })
                  }

                />
              </div>
              {/* <div className="col-8">
                <input
                  type="text"
                  name="cash"
                  className="form-control"
                  value={this.state.grandNetAmount}
                  disabled
                />
              </div> */}
            </div>
          

          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.hideKathaModel}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              // className={"fs-12" + (this.state.isCreditConfirm ? "btn-unic btn-disable" : "btn-unic active")}
               onClick={this.confirmKathaModel}
            >
              Confirm
            </button>
          </ModalFooter>

        </Modal>




        <Modal isOpen={this.state.isCreditModel} size="sm">
          <ModalHeader>
            Credit Payment
            <button type='button' onClick={() =>this.hideCreditModel()} className='btn search modal-close text-right'> <img src={close}></img></button>
          </ModalHeader>
          <ModalBody className="p-3">
            <div className="row mt-2 mb-3">
              <div className="form-group">
                <label>Credit Amount: </label>
                <input
                  type="text"
                  name="cash"
                  className="form-control"
                  value={this.state.creditAmount}
                  disabled
                />
              </div>
              {/* <div className="col-8">
                <input
                  type="text"
                  name="cash"
                  className="form-control"
                  value={this.state.creditAmount}
                  disabled
                />
              </div> */}
            </div>
            <div className="row mb-2">
              <div className="form-group">
                <label> Cash: </label>
                <input
                  type="text"
                  name="cash"
                  className="form-control"
                  value={this.state.payCreditAmount}
                  onChange={(e) =>
                    this.setState({ payCreditAmount: e.target.value })
                  }
                />
              </div>
              {/* <div className="col-8">
                <input
                  type="text"
                  name="cash"
                  className="form-control"
                  value={this.state.payCreditAmount}
                  onChange={(e) =>
                    this.setState({ payCreditAmount: e.target.value })
                  }
                />
              </div> */}
            </div>

          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.hideCreditModel}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              // className={"fs-12" + (this.state.isCreditConfirm ? "btn-unic btn-disable" : "btn-unic active")}
              onClick={this.confirmCreditModel}
            >
              Confirm
            </button>
          </ModalFooter>

        </Modal>




        <Modal
          isOpen={this.state.isgvModel}
          size="sm"
          onRequestHide={this.hideGVModel}
        >
          <ModalHeader>Issue GV Number<button type='button' onClick={() =>this.hideGVModel()} className='btn search modal-close text-right'> <img src={close}></img></button></ModalHeader>
          <ModalBody className="p-3">
            <div className="row mt-2 mb-3">
              <div className="form-group">
                <label> GV Number: </label>
                <input
                  type="Numeric"
                  name="cash"
                  className="form-control"
                  value={this.state.gvNumber}
                  onChange={(e) =>
                    this.setState({ gvNumber: e.target.value })
                  }
                  maxLength ="8"

                  autoComplete="off"
                />
              </div>
              {/* <div className="col-8">
                <input
                  type="text"
                  name="cash"
                  className="form-control"
                  value={this.state.gvNumber}
                  onChange={(e) =>
                    this.setState({ gvNumber: e.target.value })
                  }
                  autoComplete="off"
                />
              </div> */}
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="pt-2 btn-bdr" onClick={this.hideGVModel}>
              CANCEL
            </button>
            <button
              className="btn btn-bdr active fs-12"
              onClick={this.saveGVNumber}
            >
              SAVE
            </button>
          </ModalFooter>
        </Modal>





        <Modal isOpen={this.state.isBillingDisc} size="sm">
          <ModalHeader>Bill Level Discount<button type='button' onClick={() =>this.hideDiscount()} className='btn search modal-close text-right'> <img src={close}></img></button></ModalHeader>
          <ModalBody>
            <div className="row p-3">
              <div className="col-12">
                <h6 className="fs-14">Please provide below details</h6>
              </div>
              <div className="col-12">
                <label>Amount</label>
                <span className="text-red font-bold">*</span>
                <input
                  type="text"
                  name="amount"
                  value={this.state.manualDisc}
                  onChange={(e) => this.setState({ manualDisc: e.target.value.replace(/[^0-9\.,]/g, "") })}
                  placeholder="₹"
                  className="form-control" />
              </div>
              <div className="col-12 mt-3">
                <label>Discount Approved By</label> <span className="text-red font-bold">*</span>
                <input
                  type="text"
                  name="discount"
                  value={this.state.discApprovedBy}
                  onChange={(e) => this.setState({ discApprovedBy: e.target.value })}
                  placeholder=""
                  autoComplete="off"
                  className="form-control" />
              </div>
              <div className="col-12 mt-3">
                <label>Reason</label> <span className="text-red font-bold">*</span>
                <Select className="m-t-3 upper-case select_control" placeholder="Select Reason"
                  value={this.state.selectedDisc} // set selected value
                  options={this.state.discReasons} // set list of the data
                  onChange={this.handleDiscountChange} // assign onChange function
                />
              </div>

            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.hideDiscount}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              onClick={this.saveDiscount}
            >
              Confirm
            </button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.isCalculator} size="sm">
          <ModalHeader>Calculator</ModalHeader>
          <ModalBody>
            <div className="row p-3">
              <div className="col-12">
                <h6 className="fs-14">Please provide below details</h6>
              </div>



            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.hideCal}>
              Cancel
            </button>

          </ModalFooter>
        </Modal>


        <Modal
          isOpen={this.state.isCardAuto}
          size="sm"
          onRequestHide={this.hideCardAutoModel}
        >
          <ModalHeader>Card Payment <button type='button' onClick={() =>this.hideCashModal()} className='btn search modal-close text-right'> <img src={close}></img></button></ModalHeader>
          <ModalBody className="p-3 ">
          <div className="row mt-2 mb-3">
              <div className="form-group">
                <label>Net Payable Amount: </label>
                <input
                  type="text"
                  name="cash"
                  className="form-control"
                  value={this.state.grandNetAmount}
                  disabled
                />
              </div>
            <div className="row mt-4 mb-3">
              <div className="form-group">
               
      <input type="radio" id="specifyColor" checked={this.state.cardPaymentType === "Automatic"} 
onClick={this.hideCardAutomatic.bind(this)} value="Automatic" /> <label className="fs-14">Automatic</label>
            
            <input type="radio" id="specifyColor" className="m-l-3" checked={this.state.cardPaymentType === "Manual"} 
onClick={this.hideCardAutomatic.bind(this)} value="Manual" /> <label className="fs-14">Manual</label>
</div>
             
            </div>
            </div>
            {/* <br></br> */}
          </ModalBody>
          <ModalFooter>
            <button className="pt-2 btn-bdr" onClick={this.hideCardAutoModel}>
              CANCEL
            </button>
            <button
                            className="btn-unic active fs-12" name="click"
                            onClick={this.saveCard}
                        >
                            Save
                        </button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.isCash}
          size="sm"
          onRequestHide={this.hideCashModal}
        >
          <ModalHeader>Cash Payment <button type='button' onClick={() =>this.hideCashModal()} className='btn search modal-close text-right'> <img src={close}></img></button></ModalHeader>
          <ModalBody className="p-3 ">
            <div className="row mt-2 mb-3">
              <div className="form-group">
                <label>Net Payable Amount: </label>
                <input
                  type="text"
                  name="cash"
                  className="form-control"
                  value={this.state.grandNetAmount}
                  disabled
                />
              </div>
              {/* <div className="col-8">
                <input
                  type="text"
                  name="cash"
                  className="form-control"
                  value={this.state.grandNetAmount}
                  disabled
                />
              </div> */}
            </div>
            <div className="row mb-2">
              <div className="form-group">
                <label>Collected Cash: </label>
                <input
                  type="text"
                  name="cash"
                  id="collectedCash"
                  className="form-control"
                  value={this.state.cashAmount}
                  onChange={(e) =>
                    this.setState({ cashAmount: e.target.value })
                  }
                />
              </div>
              {/* <div className="col-8">
                <input
                  type="text"
                  name="cash"
                  id="collectedCash"
                  className="form-control"
                  value={this.state.cashAmount}
                  onChange={(e) =>
                    this.setState({ cashAmount: e.target.value })
                  }
                />
              </div> */}
            </div>
            {/* <br></br> */}
          </ModalBody>
          <ModalFooter>
            <button className="pt-2 btn-bdr" onClick={this.hideCashModal}>
              CANCEL
            </button>
            <button
              //className="btn btn-bdr active fs-12"
              className={this.state.cashAmount>=this.state.grandNetAmount ? "btn btn-bdr active fs-12" : "btn-selection fs-12"}
              disabled={!(this.state.cashAmount>=this.state.grandNetAmount)}
              onClick={this.getReturnAmount}
            >
              SAVE CASH PAYMENT
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.openn} size="sm">
          <ModalHeader>

            <h5>Tag customer<button type='button' onClick={() =>this.hideModal()} className='btn search modal-close text-right'> <img src={close}></img></button></h5>
          </ModalHeader>
          <ModalBody>
            <div className="row p-3">

              <div className="col-12">
                <h6 className="fs-14 mb-4 mt-1">Please provide customer phone number </h6>
                <label>Phone Number</label>
                <input
                  type="text"
                  name="mobile"
                  className="form-control"
                  value={this.state.mobilenumber}
                  onChange={this.handleChange}
                  minLength="10"
                  maxLength="10"
                  onKeyPress={this.getMobileDetails}
                  autoComplete="off"
                />
                <div className="text-danger">{this.state.errors.phone}</div>
              </div>

              <div className="col-12">
                <div className="d-flex mt-3 pointer">
                  {/* <div className="form-check checkbox-rounded checkbox-living-coral-filled fs-15">
                    <input type="checkbox" className="form-check-input filled-in" id="roundedExample2" />
                    <label className="form-check-label" htmlFor="roundedExample2">Confirming me to receive promotional messages.</label>
                  </div> */}

                </div>
              </div>

            </div>
          </ModalBody>
          <ModalFooter>
            <button className="pt-2 btn-bdr" onClick={this.hideModal}>
              Cancel
            </button>
            <button
              className="btn btn-bdr active fs-12"
              onClick={this.tagCustomer}
            >
              Confirm
            </button>
          </ModalFooter>
        </Modal>
          <div className="row">
            <div className="newsale-body p-r-1">
                   <div className="newsale-body-left">
                   <div className="">
              <div className="row m-r-0">
                <div className="col-12 col-sm-3 p-r-0 mt-4">
                  <div className="form-group fm-height">

                    {/* {
                      this.state.isTextile && ( */}
                        <div>
                           {/* <label>ES Number</label> */}
                          {/* <input type="text" className="form-control frm-pr"
                            value={this.state.dsNumber}
                            onKeyPress={this.getDeliverySlipDetails}
                            // onChange={(e) => this.setState({ dsNumber: e.target.value })}
                            placeholder="Enter ES Number" /> */}
                                            <input
                  type="text"
                  autoFocus
                  className="form-control"
                  value={this.state.dsNumber}
                  disabled = {this.state.isBillLevel || this.state.isCheckPromo ||this.state.isProccedtoCheck  ||! this.state.isRTnumAplied || !this.state.isCouponApplied }
                  onKeyPress={this.getDeliverySlipDetails}
                  placeholder="ES Number"
                  // onChange={(e) => this.setState({ dsNumber: e.target.value })}
                  onChange={(e) => this.setState({ dsNumber: e.target.value }, () => {
                    this.getDeliverySlipDetails(e)
                  })}
                />
                          <button type="button" className="scan scan_p" onClick={this.getDeliverySlipDetails}>
                            <img src={scan} /> SCAN
                          </button>

                        </div>
                      {/* )
                    } */}

                    {/* {
                      this.state.isRetail && (
                        <div>
                           <label>Barcode</label>
                          <input type="search" className="form-control frm-pr"
                            value={this.state.retailBarCode}
                            onChange={(e) => this.setState({ retailBarCode: e.target.value })}

                            placeholder="Enter Barcode" />
                          <button type="button" className="scan" onClick={this.getRetailBarcodeList}>
                            <img src={scan} /> SCAN
                          </button>
                        </div>
                      )
                    } */}
                  </div>                   
                </div>
               {/* <div className="col-1 p-l-0 p-r-0 ">
               {this.state.holdRelaseButton &&(
                   <button className="btn-unic active " onClick={this.releaseData} type="button">Release</button>  
               )
               }   
                </div>  */}
                {this.state.holdRelaseButton &&(
                <div className="col-12 col-sm-2 scaling-center m-l-2 mt-4 text-right">
                   <button className="btn-unic active " onClick={this.releaseData} type="button">Release Invoice</button>  
                  </div> 
               )
               }   
                {
                  this.state.showTable && (
                    <div className="col-12 col-sm-9 scaling-center mt-4 text-right">
                    <button className="btn-unic active m-r-1" onClick={this.holdData} type="button" >
                      Hold Invoice
                    </button>               
                      <button className={"m-r-1  scaling-mb" +((this.state.isTagCustomer || !this.state.tagcustomerPrivilege?.isEnabeld) ? " btn-unic btn-disable" : " btn-unic active")} 
                      disabled={!this.state.tagcustomerPrivilege?.isEnabeld ||this.state.isTagCustomer} onClick={this.toggleModal}
                       >Tag Customer <span className="fs-10">(Alt+t)</span></button>
                      <button className={"m-r-1  scaling-mb" +((this.state.isBillLevel || !this.state.checkpromodiscountPrivilege?.isEnabeld) ? " btn-unic btn-disable" : " btn-unic active")}
                       disabled={!this.state.checkpromodiscountPrivilege?.isEnabeld || this.state.isBillLevel } onClick={this.showDiscount}
                         >Bill Level Discount <span className="fs-10">(Alt+b)</span></button>
                        
                         <button className={"m-r-0  scaling-mb"+ ((this.state.isCheckPromo || !this.state.billleveldiscountPrivilege?.isEnabeld) ? " btn-unic btn-disable" : " btn-unic active")}
                          disabled={!this.state.billleveldiscountPrivilege?.isEnabeld ||this.state.isCheckPromo } onClick={this.invoiceLevelCheckPromo}  
                          >Check Promo Discount <span className="fs-10">(Alt+k)</span></button>

                    </div>

                  )
                }

              </div>
              <div className="row m-0 p-0">
                <div className="col-12 col-sm-4 scaling-center p-l-0">
                  <h5 className="fs-14">
                    Order Details
                  </h5>
                </div>



                <div className="p-l-0">{this.showOrderDetails()}</div>
                {
                  this.state.showTable && (

                    <div className="p-l-0">
                      <div className="rect-red m-0">
                        <div className="row">
                          <div className="col-2 text-center">
                            <label>Items : <span className="font-bold"> {this.state.barCodeList.length}</span></label>

                          </div>


                          <div className="col-2">


                          </div>
                          <div className="col-3">
                            <label>Discount : <span className="font-bold"> ₹
                              {this.state.totalPromoDisc}
                            </span> </label>

                          </div>
                          <div className="col-2">
                            <label>Total : <span className="font-bold"> ₹ {this.state.netPayableAmount}</span> </label>

                          </div>

                        </div>
                      </div>
                      </div>

)
}

<div className="row p-0 m-0 mt-2">
{
                  this.state.isTagCustomerpop && (

                    <div className="col-6 p-l-0 t-scroll">
                    <h5 className="mb-0 mt-2 fs-14">
                      Customer Details
                    </h5>
                    <table className="table table-borderless mb-0 mt-2 p-l-0 p-r-0">
                    <thead>
                      <tr className="m-0 p-0">
                        <th className="col-3">NAME</th>
                        <th className="col-3">MOBILE</th>
                        <th className="col-3">REWARDS</th>
                        <th className="col-3">EXPIRY</th>

                      </tr>
                    </thead>
                  </table>
                  <table className="table table-borderless mb-0 p-l-0 p-r-0">
                    <tbody>
                      <tr>
                        <td className="col-3 geeks">
                          {/* John Peter */}
                          {this.state.customerFullName}
                        </td>
                        <td className="col-3"> {this.state.customerMobilenumber}</td>
                        <td className="col-3">
                          <div className="form-check checkbox-rounded checkbox-living-coral-filled fs-15">
                            {/* <input type="checkbox" className="form-check-input filled-in" id="roundedExample2" /> */}
                            <label className="form-check-label" htmlFor="roundedExample2"> </label>


                          </div>
                        </td>
                        <td className="col-3"></td>

                      </tr>

                    </tbody>
                  </table>
                  </div>

                  )}
                  <div className="col-6 p-l-0">
                        {
                  this.state.enablePayment && (
                    <div className="pay p-l-0">
                      <h5 className="fs-14 font-bold pt-3">Payment Type</h5>
                        <ul>
                          <li>
                            <span>
                              {/* <img src={card} onClick={this.getCardModel} /> */}
                              <i className="icon-card" onClick={this.getCardAutoModel}></i>
                              <label>CARD <div className="key">(F1)</div></label>
                            </span>

                          </li>
                          <li>
                            <span>
                              {/* <img src={cash} onClick={this.getCashModel} /> */}
                              <i className="icon-cash" onClick={this.getCashModel}></i>
                              <label>CASH <div className="key">(F2)</div></label>
                            </span>

                          </li>
                          <li>
                            <span className="">
                              {/* <img src={upi} onClick={this.getUPIModel} /> */}
                              <i className="icon-upi" onClick={this.getUPIModel}></i>
                              <label>UPI</label>
                            </span>

                          </li>
                          <li>
                            <span>
                              {/* <img src={qr} onClick={this.getCCModel} /> */}
                              <i className="icon-qr_new" onClick={this.getCCModel}></i>
                              <label>CC</label>
                            </span>

                          </li>
                          {
                            this.state.isCredit && (
                              <li>
                                <span className="">
                                  {/* <img src={upi} onClick={this.getCreditModel} /> */}
                                  <i className="icon-card" onClick={this.getCreditModel}></i>
                                  <label>CREDIT</label>
                                </span>

                              </li>
                            )
                          }

                          {
                            this.state.isTagCustomer && (
                              <li>
                                <span className="">
                                  {/* <img src={upi} onClick={this.getCreditModel} /> */}
                                  <i className="icon-khata" onClick={this.getKathaModel}></i>
                                  <label>KHATA</label>
                                </span>

                              </li>
                            )
                          }
                          {/* <li>
                            <span>
                             
                              <i className="icon-khata"></i>
                              <label>KHATA</label>
                            </span>

                          </li> */}
                          {/* <li>
                            <span>
                             
                              <i className="icon-khata" onClick={this.getGvModel}></i>
                              <label>GV</label>
                            </span>

                          </li> */}


                        </ul>
                    </div>
                  )
                }
                        </div>

</div>


    
              </div>
            </div>
                  </div>
                  <div className="newsale-body-right">
                  <div className="">
              <div className="billing pb-3">
                <h5 className="">Billing summary</h5>
                <div className="row">
                  <div className="col-5">
                    <label>Total Amount</label>
                  </div>
                  <div className="col-7 text-right">
                    <label className="font-bold">₹ {this.state.netPayableAmount}</label>
                  </div>
                </div>
                { this.state.isTaxIncluded !== 'null' &&    <div className="row">
                  <div className="col-5">
                    <label>CGST</label>
                  </div>
                  <div className="col-7 text-right">
                    <label className="font-bold">₹ {this.state.centralGST}</label>
                  </div>
                </div>}
                { this.state.isTaxIncluded !== 'null' &&   <div className="row">
                  <div className="col-5">
                    <label>SGST</label>
                  </div>
                  <div className="col-7 text-right">
                    <label className="font-bold">₹ {this.state.stateGST}</label>
                  </div>
                </div>}



                <div className="payment">
                <div className="row">
                    <div className="col-5 p-r-0 pt-1">
                      <label className="text-secondary">Total Amount</label>
                    </div>
                    <div className="col-7 p-l-0 pt-1 text-right">
                      <label className="font-bold text-secondary">₹ {this.state.totalAmount}</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-5 p-r-0 pt-1">
                      <label className="text-green">Promo Discount</label>
                    </div>
                    <div className="col-7 p-l-0 pt-1 text-right">
                      <label className="font-bold text-green">₹ {this.state.totalPromoDisc}</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-5 p-r-0 pt-1">
                      <label className="text-secondary">Payable Amount</label>
                    </div>
                    <div className="col-7 p-l-0 pt-1 text-right">
                      <label className="font-bold text-secondary">₹ {this.state.grandNetAmount}</label>
                    </div>
                  </div>


                {
                  this.state.isBillingDiscount && (
                    <div className="row">
                    <div className="col-5">
                      <label className="text-secondary">Billing Discount</label>
                    </div>
                    <div className="col-7 text-right">
                      <label className="font-bold text-secondary">₹ {this.state.manualDisc}</label>
                    </div>
                  </div>
                  )
                }

                  {
                    this.state.isCreditAmount && (
                      <div>
                            <div className="row">
                      <div className="col-5">
                        <label className="text-secondary">Credit Amount</label>
                      </div>
                      <div className="col-7 text-right">
                        <label className="font-bold text-secondary">₹ {this.state.creditAmount}</label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-5">
                        <label className="text-secondary">Payed Amount</label>
                      </div>
                      <div className="col-7 text-right">
                        <label className="font-bold text-secondary">₹ {this.state.payCreditAmount}</label>
                      </div>
                    </div>
                      </div>



                    )
                  }



                  {
                    this.state.isreturnCreditCash && (
                      <div className="row">
                        <div className="col-5 p-r-0 pt-1">
                          <label className="text-secondary">Balance Amount</label>
                        </div>
                        <div className="col-7 p-l-0 pt-1 text-right">
                          <label className="font-bold text-secondary">₹ {this.state.balanceCreditAmount}</label>
                        </div>
                      </div>
                    )
                  }


                  {
                    this.state.returnCash >= 0  && (
                      <div>
                        <div className="row">
                        <div className="col-5 p-r-0 pt-1">
                          <label className="text-secondary">Collected Amount</label>
                        </div>
                        <div className="col-7 p-l-0 pt-1 text-right">
                          <label className="font-bold text-secondary">₹ {this.state.cashAmount}</label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5 p-r-0 pt-1">
                          <label className="text-orange">Return Amount</label>
                        </div>
                        <div className="col-7 p-l-0 pt-1 text-right">
                          <label className="font-bold text-orange">₹ {this.state.returnCash}</label>
                        </div>
                      </div>
                    
                      </div>

                    )
                  }

{
                    this.state.couponAmount > 0 && (
                      <div className="row">
                      <div className="col-5">
                        <label className="text-green">Coupon Applied</label>
                      </div>
                      <div className="col-7 text-right">
                        <label className="font-bold text-green">₹ {this.state.couponAmount}</label>
                      </div>
                    </div>
                    )
                  }
                  {
                    this.state.rtAmount > 0 && (
                      <div className="row">
                      <div className="col-5">
                        <label className="text-green">RT AMOUNT</label>
                      </div>
                      <div className="col-7 text-right">
                        <label className="font-bold text-green">₹ {this.state.rtAmount}</label>
                      </div>
                    </div>
                    )
                  }




                </div>
                {console.log("enableCoupon",this.state.enableCoupon)}
                {
                 
                  this.state.enableCoupon && (
                    
                    <div>
                      {
                        this.state.isCouponApplied && (
                          <div className="p-t-3">
                          <button
                            className={"mt-1 w-100 btn-secondary"}
                            onClick={this.applyGv}
                          >APPLY COUPON CODE</button>
                        </div>
                        )
                      }
                      {
                        this.state.isRTnumAplied && (
                          <div className="p-t-3">
                          <button
                            className={"mt-1 w-100 btn-unic active"}
                            onClick={this.applyRt}
                          >APPLY RETURN SLIP</button>
                        </div>
                        )
                      }

                    </div>
                  )
                }



                <div className="p-t-3">
                  <button
                    className={"mt-1 w-100 " + (!this.state.isProccedtoCheck ? "btn-unic btn-disable" : "btn-unic active")}
                    onClick={this.savePayment}
                    disabled={(!this.state.isProccedtoCheck )}
                  >PROCEED TO CHECKOUT (Alt+n)</button>
                  {/* <button className="btn-unic p-2 w-100">HOLD PAYMENT</button> */}
                </div>
              </div>
            </div>
                  </div>
            </div>
        </div>



      </div>

    );
  }
}