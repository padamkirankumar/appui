import React, { Component } from "react";
import edit from "../../assets/images/edit.svg";
import left from "../../assets/images/table_arrow_left.svg";
import right from "../../assets/images/table_arrow_right.svg";
import close from '../../assets/images/cross.svg';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";
import PromotionsService from "../../services/PromotionsService";
import  PrivilegesList  from '../../commonUtils/PrivilegesList';
import URMService from '../../services/URM/URMService';
import Select from "react-select";
import confirm from '../../assets/images/conformation.svg';

export default class ListOfPromos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddPromo: false,
      isAddStore: false,
      isAddBenefits: false,
      listOfPromos: [],
      deletePromoConformation: false,
      selectedItem: '',
      isItemChecked: '',
      promoStatuses: [
        { value: true, label: 'Active' },
        { value:  false, label: 'Inactive' },
      ],
      promoStatus: '',
      store: '',
      startDate: '',
      endDate: '',
      promotionName: '',
      promoType: '',
      // storePromoName: '',
      storeStartDate: '',
      storeEndDate: '',
      isPramotionChecked: false,
      checkedItem: '',
      promotionUpdate: false,
      updatePromoStartDate: '',
      updatePromoEndDate: '',
      updatePromoStatus: '',
      // add promo
      listOfPools: [],
      listOfGetPools: [],
      selectedPools: [],
      applicability: '',
      isApplicability: false,
      isPromoApplyType:false,
      description: '',
      printNameOnBill: '',
      promoName: '',
      promoApplyType: '',
      isTaxExtra: '',
      promoType: '',
      clientId: '',
      isPromoEdit: false,
      editedPromo: '',
      isTaxesExtra: [
        { value: true, label: 'Yes' },
        { value:  false, label: 'No' },
      ],
      applicabilies: [
        { value: 'promotionForEachBarcode', label: 'Promotion On Estimation Slip' },
        { value: 'promotionForWholeBill', label: 'Promotion On Invoice Level' }
      ],
      promotypes: [
        { value: 'By_Store', label: 'By Store' },
        { value: 'By_Promotion', label: 'By Promotion' }
      ],
      // map to Store Related
        storePromoType: '',
        storePromoName: '',
        storeStartDate: '',
        storeEndDate: '',
        storeVo: {},
        promoApplyTypesForWholeBill: [
          { value: 'QuantitySlab', label: 'Quantity Slab' },
          { value: 'ValueSlab', label: 'Value Slab' }
        ],
        promoApplyTypes: [
          { value: 'FixedQuantity', label: 'Fixed Quantity' },
          { value: 'AnyQuantity', label: 'Any Quantity' },
          { value: 'QuantitySlab', label: 'Quantity Slab' },
          { value: 'ValueSlab', label: 'Value Slab' }
        ],
        storePromotypes: [
          { value: 'By_Store', label: 'By Store' },
          { value: 'By_Promotion', label: 'By Promotion' }
        ],
        storePromoNames: [],
        // clonning 
        closeClone: false,
        promoId: '',
        isSavePriority: false,
        clientDomainaId: '',
        storesList: [],
        cloneStoreName: '',
        promotionNames: [],
        searchStoreName: '',
        activePromos: '',
        inactivePromos: '',
        totalPromos: '',
        // benfits
        benfitType: '',
        benfitTypes: [
          { value: 'FlatDiscount', label: 'Flat Discount' },
          { value: 'XunitsFromBuyPool', label: 'X Units from Buy Pool' },
          { value: 'XunitsFromGetPool', label: 'X Units from Get Pool' }
        ],
        benfitTypesForEachBarcode: [
          { value: 'FlatDiscount', label: 'Flat Discount' }
        ],
        discountType: '',
        discountTypes: [
          { value: 'PercentageDiscountOn', label: '% Discount on' },
          { value: 'RupeesDiscountOn', label: 'Rs. Discount on' },
          { value: 'FixedAmountOn', label: 'Fixed Amount on' }
        ],
        item: '',
        itemLabels: [
          { value: 'ItemMRP', label: 'Item MRP' },
          // { value: 'ItemRSP', label: 'Item RSP' }
        ],
        fixedAmoutItemLabels: [
          { value: 'EachItem', label: 'Each Item' },
          { value: 'AllItems', label: 'All Items' }
        ],
        discountOn: '',
        buyPoolValue: '',
        numOfItemsFromBuyPool: '',
        buyPoolValues: [
          { value: 'MinValue', label: 'Min Valued' },
          { value: 'MaxValue', label: 'Max Valued' }
        ],
        getPoolValue: '',
        numOfItemsFromGetPool: '',
        getPoolValues: [
          { value: 'MinValue', label: 'Min Valued' },
          { value: 'MaxValue', label: 'Max Valued' }
        ],
        toSlabValue: '',
        fromSlabValue: '',
        slabValues: [],
        slabValuesArray: [],
        benfitObj: {},
        buyAny: '',
        promoBenfitId: '',
        benfitIndex: '',
        benfitsPayload: [],
        benfitVoArray: [],
        editedBenfit: {},
        updatedBenfitVos: [],
        storePromoList: [],
        selectedPromolist: [],
        displayPromotions: false,
        allStorePromos: [],
        promotionTypes: [
          { value: 'promotionForEachBarcode', label: 'On Barcode' },
          { value: 'promotionForWholeBill', label: 'On Bill Value' },
          { value: 'All', label: 'All' }
        ],
        searchPromotionType: '',
        // searchPromoStatus: '',
        searchByStoreName: '',
        selectedOption: '',
        errors: {},
        benfitErrors: {},
        slabErrors: {},
        storeErrors: {},
        addPromoPrivilege: '',
        editPromoPrivilege: '',
        viewPromoPrivilege: ''
    };

    this.addPromo = this.addPromo.bind(this);
    this.closePromo = this.closePromo.bind(this);
    this.addBenefits = this.addBenefits.bind(this);
    this.editBenefits = this.editBenefits.bind(this);
    this.closeBenefits = this.closeBenefits.bind(this);
    this.closePromotionPopup = this.closePromotionPopup.bind(this);
    this.handleDeletPromo = this.handleDeletPromo.bind(this);
    this.handleStore = this.handleStore.bind(this);    
    this.getPoolList = this.getPoolList.bind(this);
    this.savePromotion = this.savePromotion.bind(this);      
    this.addSlab = this.addSlab.bind(this);
    this.addBenfit = this.addBenfit.bind(this);
    this.addBenefitsList = this.addBenefitsList.bind(this);
    this.getEditBenfitByIndex = this.getEditBenfitByIndex.bind(this);    
    this.handleValidation = this.handleValidation.bind(this);
    this.handleBenefitFormData = this.handleBenefitFormData.bind(this);
    this.slabData = this.slabData.bind(this);
    this.handleStoreData = this.handleStoreData.bind(this);
    this.updatePromotionStatus = this.updatePromotionStatus.bind(this); 
  }
  componentDidMount() {

    const user = JSON.parse(sessionStorage.getItem("user"));
    const clientId = user['custom:clientId1'];
this.setState({clientId:clientId})

    const childPrivileges =  PrivilegesList('List Of Promotions');
    childPrivileges.then((res) => {
      if(res) {
        const result = res.sort((a , b) => a.id - b.id);
        this.setState({
          addPromoPrivilege: result[0],
          editPromoPrivilege: result[1],
          viewPromoPrivilege: result[2]     
        });
      }
    });
    this.getPromoList();
    this.getPoolList();
  }

  getPoolList() {
    const { clientId } = this.state;
    const user = JSON.parse(sessionStorage.getItem("user"));
    const selectedstoreData = JSON.parse(sessionStorage.getItem("selectedstoreData"));
    const storeId = selectedstoreData.storeId;
    const customClientId = user['custom:clientId1'];
    const domainId = clientId;
    PromotionsService.getPoolList(domainId, customClientId).then((res) => {
      if(res.data.result['poolvo'] !== null) {
        const result = res.data.result['poolvo'].filter((item) => item.poolType === 'Buy').map((item) => {
          const obj = {};
            obj.value = item.poolId;
            obj.label = item.poolName;
          return obj;         
        });
        const listOfGetPools = res.data.result['poolvo'].filter((item) => item.poolType === 'Get').map((item) => {
          const obj = {};
            obj.value = item.poolId;
            obj.label = item.poolName;
          return obj;         
        });
       this.setState({ 
         listOfPools: result,
         listOfGetPools: listOfGetPools,
         isApplicability:false,
         isPromoApplyType:false,

        });    
      }     
     });
     
  }

  addPromo() {
    this.setState({ isAddPromo: true });
  }

  closePromo() {
    this.setState({ 
          isAddPromo: false,
          isPromoEdit: false,
          promoId: '',
          applicability: '',
          isApplicability:false,
          isPromoApplyType:false,
          buyAny: '',
          description: '',
          createdBy: '',
          isActive: '',
          isForEdit: false,
          isTaxExtra: '',
          selectedPools: '',
          printNameOnBill: '',
          priority: null,
          domainId: '',
          promoApplyType: '',
          promoName: '',
          promoType: '',
          benfitType: '',
          discountType: '',
          discountOn: '',
          item: '',
          benfitsPayload: [],
          slabValues: []
    });
  }

  addBenefits() {
    const formData = this.handleValidation();
    if(formData) {
      this.setState({ 
        isAddBenefits: true,
        benfitsPayload: []
      });
    }    
  }
  getEditBenfitByIndex(index) {
    const { benfitVoArray } = this.state;
    let obj = {};
    benfitVoArray.forEach((item, ind) => {
      if(index == ind) {
        obj = item;
      }      
    });
    const poolObj =    { value: obj.benfitVo.poolId, label: obj.benfitVo.poolName };
    const editedBenfit = {
      benfitId: obj.benfitVo.benfitId,
      benfitType: obj.benfitVo.benfitType,
      discountType: obj.benfitVo.discountType,
      discountOn: obj.benfitVo.discount,
      item: obj.benfitVo.discountSubType,
      getPoolValue: obj.itemValue,
      selectedPoolValue: poolObj,
      promoBenfitId: obj.benfitVo.benfitId,
      numOfItemsFromGetPool: obj.benfitVo.numOfItemsFromGetPool,
      numOfItemsFromBuyPool: obj.benfitVo.numOfItemsFromBuyPool
    };
    this.setState({
      isAddBenefits: true,
      benfitType: obj.benfitVo.benfitType,
      discountType: obj.benfitVo.discountType,
      discountOn: obj.benfitVo.discount,
      item: obj.benfitVo.discountSubType,
      getPoolValue: obj.benfitVo.itemValue,
      buyPoolValue: obj.benfitVo.itemValue,
      selectedPoolValue: poolObj,
      promoBenfitId: obj.benfitVo.benfitId,
      numOfItemsFromGetPool: obj.benfitVo.numOfItemsFromGetPool,
      numOfItemsFromBuyPool: obj.benfitVo.numOfItemsFromBuyPool,
      editedBenfit: obj,
      benfitIndex: index
    });
  }
  addBenefitsList(index) {
    const { benfitsPayload } = this.state;
    const benfitObj = benfitsPayload[index];
    if(benfitObj) {
    const poolObj =    { value: benfitObj.benfitVo.poolId ? benfitObj.benfitVo.poolId :  '' , label: benfitObj.benfitVo.poolName ? benfitObj.benfitVo.poolName : '' };
    this.setState({
      isAddBenefits: true,
      benfitType: benfitObj.benfitVo.benfitType,
      discountType: benfitObj.benfitVo.discountType,
      discountOn: benfitObj.benfitVo.discount,
      item: benfitObj.benfitVo.discountSubType,
      getPoolValue: benfitObj.benfitVo.itemValue,
      selectedPoolValue: poolObj,
      promoBenfitId: benfitObj.benfitVo.benfitId,
      numOfItemsFromGetPool: benfitObj.benfitVo.numOfItemsFromGetPool,
      numOfItemsFromBuyPool: benfitObj.benfitVo.numOfItemsFromBuyPool,
      toSlabValue: '',
      fromSlabValue: '',
    });
   } else {
    this.setState({ 
      isAddBenefits: true,
      benfitIndex: index,
      benfitType: '',
      discountType: '',
      discountOn: '',
      item: '',
      getPoolValue: '',
      selectedPoolValue: '',
      promoBenfitId: '',
      numOfItemsFromGetPool: '',
      numOfItemsFromBuyPool: ''
    });
   }
  }

  closeBenefits() {
    this.setState({ isAddBenefits: false });
  }
  addBenfit() {
    const formData = this.handleBenefitFormData();
    if(formData) {
        let index = this.state.benfitIndex;
        let updatedBenfitObjs = [];  
        const { benfitVoArray, editedBenfit, promoApplyType, benfitType, discountOn, discountType, item, benfitObj, buyPoolValue, getPoolValue, numOfItemsFromGetPool, numOfItemsFromBuyPool, selectedPoolValue, toSlabValue, fromSlabValue} = this.state;
        let obj = {
          benfitType: benfitType,
          discountType: discountType,
          discount: discountOn,
          discountSubType: item
        }
        if(benfitType === 'XunitsFromBuyPool') {
          obj = {...obj, poolVo: [], numOfItemsFromBuyPool, itemValue: buyPoolValue}
        }
        if(benfitType === 'XunitsFromGetPool') {
          let resultObj = {
            poolId : selectedPoolValue.value,
            poolName: selectedPoolValue.label
          }
          obj = {...obj, numOfItemsFromGetPool, itemValue: getPoolValue, poolVo: [resultObj]}
        }
        if (promoApplyType === 'QuantitySlab' || promoApplyType === 'ValueSlab') {
            this.state.slabValues.map((item, ind) => {
              if(index == ind) {
                if(this.state.isPromoEdit) {
                  obj.benfitId = editedBenfit.benfitVo.benfitId;
                  obj = { benfitVo: obj, toSlab: item.toSlab, fromSlab: item.fromSlab, id: editedBenfit.id, updatedat: null  }
                } else {
                  delete obj['benfitId'];
                  obj = { benfitVo: obj, toSlab: item.toSlab, fromSlab: item.fromSlab }
                }
              }
            });
        }else if(promoApplyType === 'FixedQuantity' || promoApplyType === 'AnyQuantity') {
            delete obj['toSlab'];
            delete obj['fromSlab'];
            if(!this.state.isPromoEdit) {
              delete obj['benfitId'];
            } else {
              obj.benfitId = editedBenfit.benfitId;
            }
        }
        if(this.state.isPromoEdit) {     
          obj = {...obj, /* benfitId: editedBenfit.benfitId */};
          if(benfitVoArray.length > 0) {
              updatedBenfitObjs = benfitVoArray.map(b => b.id !== obj.id ? b : obj);
          } else {
            updatedBenfitObjs = [obj];
          }
        }
        this.setState({
          benfitsPayload: [...this.state.benfitsPayload, obj],
          isAddBenefits: false,
          benfitIndex: '',
          updatedBenfitVos: updatedBenfitObjs
        });
  } else {
    toast.warning("Enter All Mandatary fields");
  }   
}
  
  getPromoList() {
    const { clientId } = this.state;
    const user = JSON.parse(sessionStorage.getItem("user"));
    const selectedstoreData = JSON.parse(sessionStorage.getItem("selectedstoreData"));
    const storeId = selectedstoreData.storeId;
    const customClientId = user['custom:clientId1'];
   //  const domainId = clientId;
    PromotionsService.getPromoList(clientId, customClientId).then((res) => {
      if(res.data.result['promovo'] !== null && res.data.result['promovo'].length > 0) {
        var elements = res.data.result['promovo'].reduce( (previous, current) => {
          var object = previous.filter(object => object.promotionName === current.promotionName);
          if (object.length == 0) {
            previous.push(current);
          }
          return previous;
        }, []);
        const totalPromos = res.data.result['promovo'].length;        
        const active = res.data.result['promovo'].filter(item => item.isActive == true).length;
        const inactive = res.data.result['promovo'].filter(item => item.isActive == false).length;
        const finalResult = elements.filter((item) => item.promotionName !== null);
        const promoNamesList = res.data.result['promovo'].map((item) => {
          const obj = {};
          obj.value = item.promoId;
          obj.label = item.promotionName;
          return obj;
        });
        this.setState({
          storePromoList: promoNamesList,
          listOfPromos: res.data.result['promovo'],
          promotionNames: finalResult,
          totalPromos: totalPromos,
          activePromos: active,
          inactivePromos: inactive
        });
      }     
     });
  }
  handleRemovePromo = (item) => () => {
    this.setState({
      deletePromoConformation: true,
      selectedItem: item
    });
  }  
  haandleSearchPromotionType = (e) => {
    this.setState({searchPromotionType: e.target.value});
  }
  handleSearchPromotionStatus = (e) => {
    this.setState({searchPromoStatus: e.target.value});
  }
  searchPromotion = () => {
    const { searchPromotionType, searchPromoStatus} = this.state;
   

    const requestObj = {
      applicability : searchPromotionType,
      clientId:this.state.clientId,
      isActive:true
    }
    if(requestObj.applicability){
    PromotionsService.promotionsSearching(requestObj).then((res) => {
      if(res.data.isSuccess === 'true') {
        toast.success(res.data.message);
        this.setState({
          listOfPromos: res.data.result.content,
          searchPromotionType: ''
        });
      } else {
        toast.success(res.data.message);
      }
    });
  }else{
    toast.error("Please Select Promo Type");
  }
  }
  handlePromoStatus(e){
    this.setState({promoStatus: e.target.value});
  }
  handleStore(e){
    this.setState({store: e.target.value});
  }
  haandlePromoname(e) {
    this.setState({
      promotionName: e.target.value,
    });
  }
  haandleEnddate(e) {
    this.setState({
      endDate: e.target.value
    });
  }
  haandleStartdate(e) {
    this.setState({
      startDate: e.target.value
    });
  }

  closePromotionPopup() {
    this.setState({ deletePromoConformation: false });
    // this.setState({ ispromoApplyType: false });

  }
  handleDeletPromo() {
    const { selectedItem } = this.state;
    PromotionsService.deletePromo(selectedItem.promoId).then((res) => {
      if(res.data.isSuccess === 'true') {
        this.setState({ deletePromoConformation: false });
        toast.success(res.data.message);
        this.getPromoList();
      } else {
        toast.success(res.data.message);
      }    
    });
  }
  
  addPromo() {
    this.setState({ isAddPromo: true });
  }
  
  handelPromoType(e) {
    this.setState({ promoType: e.target.value });
  }
  handelApplicability(e) {
    this.state.errors["applicability"] = '';
    this.setState({ applicability: e.target.value });
       
  }
  handelIsTaxExtra(e) {
    this.state.errors["isTaxExtra"] = '';
    this.setState({ isTaxExtra: e.target.value });
  }
  handlePromoApplyType(e) {
    this.state.errors["promoApplyType"] = '';
    this.setState({ promoApplyType: e.target.value });
    // this.setState({ isPromoApplyType: false });
  }
  handlePrintNameOnBill(e) {
    this.state.errors["printNameOnBill"] = '';
    this.setState({ printNameOnBill: e.target.value });
  }
  handleDescription(e) {
    this.setState({ description: e.target.value });
  }
  handlePromoName(e) {
    this.state.errors["promoName"] = '';
    this.setState({ promoName: e.target.value });
  }
  handleStorePromoType(e) {
    this.setState({ storePromoType: e.target.value });
  }
  handleStorePromoName(e) {
    this.state.storeErrors["storePromoName"] = '';
    this.setState({ storePromoName: e.target.value });
  }
  handleStoreName(e) {
    this.state.storeErrors["storeName"] = '';
    this.setState({ storeName: e.target.value });
  }
  handleStoreStartDate(e) {
    this.state.storeErrors["storeStartDate"] = '';
    this.setState({ storeStartDate: e.target.value });
  }
  handleStoreEndDate(e) {
    this.state.storeErrors["storeEndDate"] = '';
    this.setState({ storeEndDate: e.target.value });
  }
  onChange = opt => {
    this.state.errors["selectedPools"] = '';
    this.setState({
      selectedPools: opt
    });
  };
 
  selectedPoolValueChange = selectedstore => {
    this.state.benfitErrors["selectedPoolValue"] = '';
    this.setState({
      selectedPoolValue : selectedstore
    });
  }
  editBenefits() {
    this.setState({
      isAddBenefits: true
    });
  }
  getBenfitByIndex(index) {
    const { benfitVoArray } = this.state;
    const benfitObj = benfitVoArray[index]; 
    const poolObj =    { value: benfitObj.poolId, label: benfitObj.poolName };
    this.setState({
      isAddBenefits: true,
      benfitType: benfitObj.benfitType,
      discountType: benfitObj.discountType,
      discountOn: benfitObj.discount,
      item: benfitObj.percentageDiscountOn,
      getPoolValue: benfitObj.itemValue,
      selectedPoolValue: poolObj,
      promoBenfitId: benfitObj.benfitId,
      numOfItemsFromGetPool: benfitObj.numOfItemsFromGetPool,
      numOfItemsFromBuyPool: benfitObj.numOfItemsFromBuyPool
    }); 
  }

  editPramotion = (item) => () => {
    const { listOfPromos } = this.state;
    const promo =  listOfPromos.find(promo => promo.promoId === item.promoId);
    const data = promo.poolVo;
    let benfitVo = [];
    let benfitObj = '';
    if(promo.promotionSlabVo.length > 0) {
     // benfitObj = promo.benfitVo[0];
      benfitVo = promo.promotionSlabVo;        
      const slabValueRes = benfitVo.map((item) => {
        const obj = {};
          obj.toSlab = item.toSlab;
          obj.fromSlab = item.fromSlab;
          return obj;
      });
      this.setState({
        slabValues: slabValueRes,
        benfitVoArray: benfitVo
      });
    } else if(promo.benfitVo.length > 0){
      benfitVo = promo.benfitVo[0];
      const poolObj =    { value: benfitVo.poolId, label: benfitVo.poolName };
      this.setState({
          editedBenfit: benfitVo,
          benfitType: benfitVo.benfitType,
         // item: benfitVo.discountSubType,
          discountType: benfitVo.discountType,
          discountOn: benfitVo.discount,
          item: benfitVo.discountSubType,
          getPoolValue: benfitVo.itemValue,
          buyPoolValue: benfitVo.itemValue,
          promoApplyType: benfitVo.promoApplyType,
          selectedPoolValue: poolObj,
          promoBenfitId: benfitVo.benfitId,
          numOfItemsFromGetPool: benfitVo.numOfItemsFromGetPool,
          numOfItemsFromBuyPool: benfitVo.numOfItemsFromBuyPool
      });
    }    
    const result = data.map((item) => {
      const obj = {};
        obj.value = item.poolId;
        obj.label = item.poolName;
      return obj;         
    });

    this.setState({
      promoId: promo.promoId,
      isAddPromo: true,
      isPromoEdit: true,
      isApplicability:true,
      isPromoApplyType:true,
      // editedPromo: promo
        applicability: promo.applicability,
        buyAny: promo.buyItemsFromPool,
        description: promo.description,
        createdBy: promo.createdBy,
        isActive: true,
        isForEdit: false,
        isTaxExtra: promo.isTaxExtra,
        selectedPools: result,
        printNameOnBill: promo.printNameOnBill,
        priority: null,
        // domainId: promo.clientId,
        promoApplyType: promo.promoApplyType,
        promoName: promo.promotionName,
        promoType: promo.promoType
    });
  }
  handleValidation() {
    const { selectedPools,
      applicability,
      printNameOnBill,
      promoName,
      promoApplyType,
      isTaxExtra,      
      buyAny
      } = this.state;
    let errors = {};
    let formIsValid = true;

    // promoName
    if (!promoName) {
        formIsValid = false;
        errors["promoName"] = "Enter Promotion Name";
    }
    // printNameOnBill
    if (!printNameOnBill) {
      formIsValid = false;
      errors["printNameOnBill"] = "Enter Name On Bill";
    }
    // printNameOnBill
    if (!applicability) {
      formIsValid = false;
      errors["applicability"] = "Select Applicability";
    }
    // promoApplyType
    if (!promoApplyType) {
      formIsValid = false;
      errors["promoApplyType"] = "Select Promotion Apply Type";
    }
    // isTaxExtra
    if (!isTaxExtra) {
      formIsValid = false;
      errors["isTaxExtra"] = "Select Charge Tax Extra";
    }
    // selectedPools
    if (selectedPools.length === 0) {
      formIsValid = false;
      errors["selectedPools"] = "Select At Least One Buy Pool";
    }

    // buyAny
    if (!buyAny && promoApplyType === 'FixedQuantity') {
      formIsValid = false;
      errors["buyAny"] = "Enter Any Quantity";
    }
    this.setState({ errors: errors });               
    return formIsValid;

}
handleBenefitFormData() {
  const { benfitType,
    discountType,
    discountOn,
    item,
    getPoolValue,
    buyPoolValue,
    numOfItemsFromBuyPool,
    numOfItemsFromGetPool,
    selectedPoolValue
    } = this.state;
    
  let errors = {};
  let formIsValid = true;
  if (!benfitType) {
    formIsValid = false;
    errors["benfitType"] = "Select Benefit Type";
  }
  if (!discountType) {
    formIsValid = false;
    errors["discountType"] = "Select Discount Type";
  }
  if (!discountOn) {
    formIsValid = false;
    errors["discountOn"] = "Enter Discount";
  }
  if (!item) {
    formIsValid = false;
    errors["item"] = "Discount Sub Type";
  }
  if (!buyPoolValue && benfitType === 'XunitsFromBuyPool') {
    formIsValid = false;
    errors["buyPoolValue"] = "Select Item Value";
  }
  if (!numOfItemsFromBuyPool && benfitType === 'XunitsFromBuyPool') {
    formIsValid = false;
    errors["numOfItemsFromBuyPool"] = "Enter No Of Items From BuyPool";
  }
  if (!numOfItemsFromGetPool && benfitType === 'XunitsFromGetPool') {
    formIsValid = false;
    errors["numOfItemsFromGetPool"] = "Enter No Of Items From GetPool";
  }
  if (!getPoolValue && benfitType === 'XunitsFromGetPool') {
    formIsValid = false;
    errors["getPoolValue"] = "Select Item Value";
  }
  if (!selectedPoolValue && benfitType === 'XunitsFromGetPool') {
    formIsValid = false;
    errors["selectedPoolValue"] = "Select Get Pool";
  }  
  this.setState({ benfitErrors: errors });               
  return formIsValid;
}
  savePromotion() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const selectedstoreData = JSON.parse(sessionStorage.getItem("selectedstoreData"));    
    const createdBy = user['custom:userId'];
    const { selectedPools,
      applicability,
      description,
      printNameOnBill,
      promoName,
      promoApplyType,
      isTaxExtra,
      promoType,
      clientId,
      benfitObj,
      buyAny,
      benfitsPayload,
      editedBenfit,
      updatedBenfitVos,
      benfitIndex
     } = this.state;
      const result = selectedPools.map((item) => {
        const obj = {};
          obj.poolId = item.value;
          obj.poolName = item.label;
        return obj;         
      });
    const obj = {
        applicability: applicability,
        benfitVo: (promoApplyType === 'QuantitySlab' || promoApplyType === 'ValueSlab') ? [] : benfitsPayload,
        buyItemsFromPool: buyAny,
        description: description,
        createdBy: createdBy,
        isActive: true,
        isForEdit: false,
        storeId: selectedstoreData.storeId,
        clientId: user['custom:clientId1'],
        isTaxExtra: isTaxExtra,
        poolVo: result,
        promotionSlabVo:( promoApplyType === 'FixedQuantity' || promoApplyType === 'AnyQuantity') ? [] : benfitsPayload,
        printNameOnBill: printNameOnBill,
        priority: null,
        // domainId: clientId,
        promoApplyType: promoApplyType,
        promotionName: promoName
      //  promoType: promoType
    }
    if(this.state.isPromoEdit) {
      const { promoId, selectedPools} = this.state;
      const result = selectedPools.map((item) => {
        const obj = {};
          obj.poolId = item.value;
          obj.poolName = item.label;
        return obj;         
      });
      const obj = {
        promoId: promoId,
        applicability: applicability,
        buyItemsFromPool: buyAny,
        description: description,
        createdBy: createdBy,
        isActive: true,
        isForEdit: true,
        isTaxExtra: isTaxExtra,
        poolVo: result,
        printNameOnBill: printNameOnBill,
        // priority: null,
        // domainId: clientId,
        storeId: selectedstoreData.storeId,
        clientId: user['custom:clientId1'],
        promoApplyType: promoApplyType,
        promotionName: promoName,
        promoType: promoType,
        benfitVo: (promoApplyType === 'QuantitySlab' || promoApplyType === 'ValueSlab') ? [] : updatedBenfitVos,
        promotionSlabVo:( promoApplyType === 'FixedQuantity' || promoApplyType === 'AnyQuantity') ? [] : updatedBenfitVos,
        // benfitVo: updatedBenfitVos
    }
      PromotionsService.updatePromotion(obj).then((res) => {
        if(res.data.isSuccess === 'true') {
          toast.success(res.data.message);
          this.setState({
            selectedPools: [],
            applicability: '',
            description: '',
            printNameOnBill: '',
            promoName: '',
            promoApplyType: '',
            isTaxExtra: '',
            promoType: '',
            clientId: '',
            isAddPromo: false,
            isForEdit: false,
            benfitsPayload: [], 
          });
          this.getPromoList();
        } else {
          toast.success(res.data.message);
        }
    });
    } else {
      const formData = this.handleValidation();
      if(obj.benfitVo.length > 0 && formData|| formData && obj.promotionSlabVo.length > 0) {
        PromotionsService.addPromo(obj).then((res) => {
          if(res.data.isSuccess === 'true') {
            toast.success(res.data.message);
            this.setState({
              selectedPools: [],
              applicability: '',
              isApplicability:true,
              isPromoApplyType:true,
              description: '',
              printNameOnBill: '',
              promoName: '',
              promoApplyType: '',
              isTaxExtra: '',
              promoType: '',
              clientId: '',
              isAddPromo: false,
              buyAny: '',
              benfitsPayload: [],
              slabValues: []
            });
            this.getPromoList();
          } else {
            toast.success(res.data.message);
          }
        });
      } else {
        toast.info('Add atleast one benefit');
      }
    }
      
  }
  handleItemValue(e) {
    this.state.benfitErrors["item"] = '';
    this.setState({ item: e.target.value });
  }
  handleDiscount(e) {
    this.state.benfitErrors["discountOn"] = '';
    this.setState({ discountOn: e.target.value });
  }
  handleDiscountType(e) {
    this.state.benfitErrors["discountType"] = '';
    this.setState({ discountType: e.target.value });
  }
  handleBenfitType(e) {
    this.state.benfitErrors["benfitType"] = '';
    this.setState({ benfitType: e.target.value });
  }
  handleNumOfItemsFromBuyPool(e) {
    this.state.benfitErrors["numOfItemsFromBuyPool"] = '';
    this.setState({ numOfItemsFromBuyPool: e.target.value });
  }
  handleBuyPoolValue(e) {
    this.state.benfitErrors["buyPoolValue"] = '';
    this.setState({ buyPoolValue: e.target.value });
  }
  handleNumOfItemsFromGetPool(e) {
    this.state.benfitErrors["numOfItemsFromGetPool"] = '';
    this.setState({ numOfItemsFromGetPool: e.target.value });
  }
  handleGetPoolValue(e) {
    this.state.benfitErrors["getPoolValue"] = '';
    this.setState({ getPoolValue: e.target.value });
  }
  handleSelectedPoolValue(e) {
    this.setState({ selectedPoolValue: e.target.value });
  }
  handleToSlab(e) {
    this.state.slabErrors["toSlabValue"] = '';
    this.setState({ toSlabValue: e.target.value });
  }
  handlefromSlab(e) {
    this.state.slabErrors["fromSlabValue"] = '';
    this.setState({ fromSlabValue: e.target.value });
  }
  handleBuyAny(e) {
    this.state.errors["buyAny"] = '';
    this.setState({ buyAny: e.target.value });
  }

  toggle = () => {
    this.setState({
      isAddPromo: false,
      isAddBenefits: false,

     
    });
  }


  addSlab() {
    const slabData = this.slabData();
    if(slabData) {
      const toSlab = this.state.toSlabValue;
      const fromSlab = this.state.fromSlabValue;
      const obj = {
        toSlab,
        fromSlab
      };
      this.setState({
        slabValues: [...this.state.slabValues, obj],
        toSlabValue: '',
        fromSlabValue: ''
      });
    }
  }
  handleRemoveSlab = (idx) => {
      const slabValues = [...this.state.slabValues]
      slabValues.splice(idx, 1)
      this.setState({ slabValues })    
  }
  slabData() {
    const { toSlabValue, fromSlabValue } = this.state;
    let errors = {};
    let formIsValid = true;
    if (!toSlabValue) {
      formIsValid = false;
      errors["toSlabValue"] = "Enter To Slab";
    }
    if (!fromSlabValue) {
      formIsValid = false;
      errors["fromSlabValue"] = "Enter From Slab";
    }
    this.setState({ slabErrors: errors });               
    return formIsValid;
  }
  handleStoreData() {
    const {storeName, storeEndDate, storeStartDate, searchStoreName} = this.state;
    let errors = {};
    let formIsValid = true;
    if (!storeName || storeName.length === 0) {
      formIsValid = false;
      errors["storeName"] = "Select Store Name ";
    }
    if (!storeEndDate) {
      formIsValid = false;
      errors["storeEndDate"] = "Select End Date";
    }
    if (!storeStartDate) {
      formIsValid = false;
      errors["storeStartDate"] = "Select Start Date";
    }
    if (!searchStoreName || searchStoreName.length === 0) {
      formIsValid = false;
      errors["searchStoreName"] = "Select Start Date";
    }
    this.setState({ storeErrors: errors });               
    return formIsValid;
  }
  updatePromotionStatus(item) {
    const { allStorePromos } = this.state;
    allStorePromos.forEach((itm) => {
      if(item.id === itm.id) {
         itm.promotionStatus = false;
      }
    });
    this.setState({
      allStorePromos
    });
  }

  render() {
    return (
      <div className="maincontent">
         <Modal isOpen={this.state.isAddBenefits} size="md">
         <ModalHeader>Add Benefits <button type='button' onClick={() =>this.toggle()} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>
           <ModalBody>
           <div className="row">
              <div className="col-12">
                <h6 className="mb-2 fs-14">Please add benefits & discount types</h6>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Benefit Type <span className="text-red font-bold" name="bold">*</span></label>
                  <select value={this.state.benfitType} onChange={(e) => this.handleBenfitType(e)} className="form-control">
                    <option>Select Types of Benefit</option>
                        {this.state.applicability === 'promotionForEachBarcode' ? 
                          this.state.benfitTypesForEachBarcode &&
                          this.state.benfitTypesForEachBarcode.map((item, i) => 
                          (<option key={i} value={item.value}>{item.label}</option>))
                        : 
                          this.state.benfitTypes &&
                          this.state.benfitTypes.map((item, i) => 
                          (<option key={i} value={item.value}>{item.label}</option>))
                        }
                  </select>
                </div>
                <span style={{ color: "red" }}>{this.state.benfitErrors["benfitType"]}</span>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Discount Type <span className="text-red font-bold" name="bold">*</span></label>
                  <select value={this.state.discountType} onChange={(e) => this.handleDiscountType(e)} className="form-control">
                    <option>Select Types of Discount</option>
                        {   
                          this.state.discountTypes &&
                          this.state.discountTypes.map((item, i) => 
                          (<option key={i} value={item.value}>{item.label}</option>))
                        }
                  </select>
                </div>
                <span style={{ color: "red" }}>{this.state.benfitErrors["discountType"]}</span>
              </div>
             { this.state.benfitType === 'XunitsFromBuyPool' &&  <React.Fragment> 
               <div className="col-6 mt-3">
                <div className="form-group">
                  <label>Number of Items from Buy pool <span className="text-red font-bold" name="bold">*</span></label>
                  <input type="text" value={this.state.numOfItemsFromBuyPool} onChange={(e) => this.handleNumOfItemsFromBuyPool(e)} className="form-control" />
                </div>
                <span style={{ color: "red" }}>{this.state.benfitErrors["numOfItemsFromBuyPool"]}</span>
              </div>
              <div className="col-6 mt-3">
                <div className="form-group">
                  <label></label>
                  <select value={this.state.buyPoolValue} onChange={(e) => this.handleBuyPoolValue(e)} className="form-control">
                    <option>Item Value</option>
                        {   
                          this.state.buyPoolValues &&
                          this.state.buyPoolValues.map((item, i) => 
                          (<option key={i} value={item.value}>{item.label}</option>))
                        }
                  </select>
                </div>
                <span style={{ color: "red" }}>{this.state.benfitErrors["buyPoolValue"]}</span>
              </div> 
              </React.Fragment>
              }

              { this.state.benfitType === 'XunitsFromGetPool' && <div className="col-12">
                <div className="form-group">
                  <label>Select Get Pool <span className="text-red font-bold" name="bold">*</span></label>
                     <Select
                        // isMulti
                        onChange={this.selectedPoolValueChange}
                        options={this.state.listOfGetPools}
                        value={this.state.selectedPoolValue}
                      />
                </div>
                <span style={{ color: "red" }}>{this.state.benfitErrors["selectedPoolValue"]}</span>
              </div> }
              
              { this.state.benfitType === 'XunitsFromGetPool' &&  <React.Fragment>
               <div className="col-6 mt-3">
                <div className="form-group">
                  <label>Number of Items from Get pool <span className="text-red font-bold" name="bold">*</span></label>
                  <input type="text" value={this.state.numOfItemsFromGetPool} onChange={(e) => this.handleNumOfItemsFromGetPool(e)} className="form-control"/>
                </div>
                <span style={{ color: "red" }}>{this.state.benfitErrors["numOfItemsFromGetPool"]}</span>
              </div>
              <div className="col-6 mt-3">
                <div className="form-group">
                  <label></label>
                  <select value={this.state.getPoolValue} onChange={(e) => this.handleGetPoolValue(e)} className="form-control">
                    <option>Item Value</option>
                        {   
                          this.state.getPoolValues &&
                          this.state.getPoolValues.map((item, i) => 
                          (<option key={i} value={item.value}>{item.label}</option>))
                        }
                  </select>
                </div>
                <span style={{ color: "red" }}>{this.state.benfitErrors["getPoolValue"]}</span>
              </div> 
              </React.Fragment>
              }              
              { this.state.discountType === 'PercentageDiscountOn' ? <div className="col-6 mt-3">
                <div className="form-group">
                  <label>Discount ON</label>
                   <input type="text" value={this.state.discountOn} onChange={(e) => this.handleDiscount(e)} className="form-control" placeholder="Enter % Discount On" />
                </div>
              </div> : <div className="col-6 mt-3">
                <div className="form-group">
                  <label>Discount ON <span className="text-red font-bold" name="bold">*</span></label>
                  <input type="text" value={this.state.discountOn} onChange={(e) => this.handleDiscount(e)} className="form-control" placeholder="Enter Discount" />
                </div>
                <span style={{ color: "red" }}>{this.state.benfitErrors["discountOn"]}</span>
              </div> }
              <div className="col-6 mt-3">
                <div className="form-group">
                  <label>Discount Sub Type <span className="text-red font-bold" name="bold">*</span></label>
                  {(this.state.discountType === 'PercentageDiscountOn' || this.state.discountType === 'RupeesDiscountOn') ? <select value={this.state.item} onChange={(e) => this.handleItemValue(e)} className="form-control">
                    <option>Select Discount Subtype</option>
                        {   
                          this.state.itemLabels &&
                          this.state.itemLabels.map((item, i) => 
                          (<option key={i} value={item.value}>{item.label}</option>))
                        }
                  </select> : 
                  <select value={this.state.item} onChange={(e) => this.handleItemValue(e)} className="form-control">
                  <option>Select Discount Subtype</option>
                      {   
                        this.state.fixedAmoutItemLabels &&
                        this.state.fixedAmoutItemLabels.map((item, i) => 
                        (<option key={i} value={item.value}>{item.label}</option>))
                      }
                </select>}
                </div>
                <span style={{ color: "red" }}>{this.state.benfitErrors["item"]}</span>
              </div>
             </div> 
           </ModalBody>
           <ModalFooter>
           <button className="btn-unic" onClick={this.closeBenefits}>
              Cancel
            </button>
            <button className="btn-unic active fs-12" onClick={this.addBenfit}>
              Save
            </button>
           </ModalFooter>
           </Modal>
        <Modal isOpen={this.state.isAddPromo} size="xl">
          <ModalHeader>Add Promo <button type='button' onClick={() =>this.toggle()} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-12">
                <h6 className="mb-2 fs-14 text-red">Please add promo code Details</h6>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <label>Promotion Name <span className="text-red font-bold" name="bold">*</span></label>
                  <input type="text" value={this.state.promoName} onChange={(e) => this.handlePromoName(e)} className="form-control" placeholder="" />
                </div>
                <span style={{ color: "red" }}>{this.state.errors["promoName"]}</span>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <label>Description</label>
                  <input type="text" value={this.state.description} onChange={(e) => this.handleDescription(e)} className="form-control" placeholder="" />
                </div>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <label>Print Name On Sale Bill <span className="text-red font-bold" name="bold">*</span></label>
                  <input type="text" value={this.state.printNameOnBill} onChange={(e) => this.handlePrintNameOnBill(e)} className="form-control" placeholder="" />
                </div>
                <span style={{ color: "red" }}>{this.state.errors["printNameOnBill"]}</span>
              </div>
              <div className="col-3">
                <div className="form-group">
                </div>
              </div>
              <div className="col-3 mt-3">
                <div className="form-group">
                  <label>Applicability <span className="text-red font-bold" name="bold">*</span></label>
                    <select value={this.state.applicability}
                    disabled={this.state.isApplicability}
                    onChange={(e) => this.handelApplicability(e)}
                  
                     className="form-control">
                      <option>Select</option>
                        { 
                            this.state.applicabilies &&
                            this.state.applicabilies.map((item, i) => 
                            (<option key={i} value={item.value}>{item.label}</option>))
                          }
                    </select>
                </div>
                <span style={{ color: "red" }}>{this.state.errors["applicability"]}</span>
              </div>
              <div className="col-3 mt-3">
                <div className="form-group">
                  <label className="">Promotion Apply Type <span className="text-red font-bold" name="bold">*</span></label>
                  {this.state.applicability === 'promotionForWholeBill' ?  
                  <select value={this.state.promoApplyType} 
                  disabled={this.state.isPromoApplyType}
                  onChange={(e) => this.handlePromoApplyType(e)} className="form-control">
                    
                    <option>Select</option>
                        { 
                          this.state.promoApplyTypesForWholeBill &&
                          this.state.promoApplyTypesForWholeBill.map((item, i) => 
                          (<option key={i} value={item.value}>{item.label}</option>))
                        }
                  </select>
                  : 
                  <select value={this.state.promoApplyType} 
                  disabled={this.state.isPromoApplyType} 
                  onChange={(e) => this.handlePromoApplyType(e)} className="form-control">
                    <option>Select</option>
                        { 
                          this.state.promoApplyTypes &&
                          this.state.promoApplyTypes.map((item, i) => 
                          (<option key={i} value={item.value}>{item.label}</option>))
                        }
                  </select>}
                </div>
                <span style={{ color: "red" }}>{this.state.errors["promoApplyType"]}</span>
              </div>
              <div className="col-3 mt-3">
              <div className="form-group">
                 <label className="">Charge Tax Extra <span className="text-red font-bold" name="bold">*</span></label>
                  <select value={this.state.isTaxExtra} onChange={(e) => this.handelIsTaxExtra(e)} className="form-control">
                    <option>Select</option>
                        { 
                          this.state.isTaxesExtra &&
                          this.state.isTaxesExtra.map((item, i) => 
                          (<option key={i} value={item.value}>{item.label}</option>))
                        }
                  </select>
                </div>                
                <span style={{ color: "red" }}>{this.state.errors["isTaxExtra"]}</span>
              </div>
              { this.state.promoApplyType === 'FixedQuantity' ? <React.Fragment>
              <div className="col-12 mt-4">
                <h6 className="mb-2 fs-14 text-red">Buy pool definition</h6>
              </div>
              <div className="col-3 mt-3">
                <div className="form-group">
                  <label>Buy Any <span className="text-red font-bold" name="bold">*</span></label>
                  <input type="text" value={this.state.buyAny} onChange={(e) => this.handleBuyAny(e)} className="form-control" placeholder="" />
                </div>
                <span style={{ color: "red" }}>{this.state.errors["buyAny"]}</span>
              </div>
              <div className="col-3 mt-3">
              <div className="form-group">
                 <label className="">Add Buy Pools <span className="text-red font-bold" name="bold">*</span></label> 
                    <Select
                      isMulti
                      onChange={this.onChange}
                      options={this.state.listOfPools}
                      value={this.state.selectedPools}
                    />                  
                </div>
                <span style={{ color: "red" }}>{this.state.errors["selectedPools"]}</span>
                </div>
              </React.Fragment> : 
              <React.Fragment>
              <div className="col-3 mt-3">
                <div className="form-group">
                </div>
              </div>
              <div className="col-3 mt-3">
              <div className="form-group sele">
                 <label className="">Add Buy Pools <span className="text-red font-bold" name="bold">*</span></label> 
                    <Select
                      isMulti
                      onChange={this.onChange}
                      options={this.state.listOfPools}
                      value={this.state.selectedPools}
                    />                  
                </div>
                <span style={{ color: "red" }}>{this.state.errors["selectedPools"]}</span>
                </div>
             </React.Fragment>}
              
              { (this.state.promoApplyType === '' || this.state.promoApplyType === 'FixedQuantity' || this.state.promoApplyType === 'AnyQuantity') && <React.Fragment>
                <div className="col-3 mt-4 pt-2">                   
                  {this.state.isPromoEdit === true ? <button className="btn-nobdr text-green p-t-3" type="button" onClick={this.editBenefits}>+ Add Benefits</button> : 
                  <button className="btn-nobdr text-red p-t-3" type="button" onClick={this.addBenefits}>+ Add Benefits</button> }
                </div> </React.Fragment>}
             { (this.state.promoApplyType === 'ValueSlab' || this.state.promoApplyType === 'QuantitySlab') && <React.Fragment>
                <div className="col-12 mt-4">
                  <h6 className="mb-2 fs-14 text-red"></h6>
                </div>
                <div className="col-3 mt-3">
                  <div className="form-group">
                    <label>From <span className="text-red font-bold" name="bold">*</span></label>
                    <input type="text" className="form-control" value={this.state.fromSlabValue} onChange={(e) => this.handlefromSlab(e)} placeholder="" />
                  </div>
                  <span style={{ color: "red" }}>{this.state.slabErrors["fromSlabValue"]}</span>
                </div>
                <div className="col-3 mt-3">
                  <div className="form-group">
                    <label className="">To <span className="text-red font-bold" name="bold">*</span></label> 
                      <input type="text" value={this.state.toSlabValue} onChange={(e) => this.handleToSlab(e)} className="form-control" placeholder="" />
                  </div>
                  <span style={{ color: "red" }}>{this.state.slabErrors["toSlabValue"]}</span>
                </div>
                <div className="col-3 mt-4 pt-2 p-l-0">
                  <button className="btn-nobdr text-red p-t-3" type="button" onClick={this.addSlab}>+ Add Slab</button>
                </div>
                <div className="col-12">
                  <div className="table-responsive">
                    {this.state.slabValues.length > 0 && <table className="table table-borderless  justify-content-center mb-1 mt-2">
                      <thead>
                        <tr className="m-0 p-0">
                          <th className="col-3">From</th>
                          <th className="col-3">To</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                           this.state.slabValues && this.state.slabValues.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className="col-3">{item.fromSlab}</td>
                                <td className="col-3">{item.toSlab}</td>
                                <td>
                                  {this.state.isPromoEdit === true ? <button className="btn-nobdr text-green p-t-2 p-b-3" type="button" onClick={() => this.getEditBenfitByIndex(index)}>+ Add Benefits</button> : 
                                      <a style={{  textDecoration: 'none' }} className="btn-nobdr text-red p-t-2 p-b-3" type="button" onClick={() => this.addBenefitsList(index)}>+ Add Benefits</a> }
                                      <i onClick={() => this.handleRemoveSlab(index)} className="icon-delete m-l-2 fs-16"></i>
                                </td>
                                {/* <td className="col-1"><button onClick={() => this.addBenefitsList(index)} className="btn-unic active fs-12">BENFIT</button></td> */}
                                
                              </tr>
                            )
                          })
                        }              
                      </tbody>
                    </table> }
                  </div>
              </div> 
            </React.Fragment>}
           </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.closePromo}>
              Cancel
            </button>
            <button className="btn-unic active fs-12" onClick={this.savePromotion}>
              Save
            </button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.deletePromoConformation} size="md">
          <ModalHeader>Delete Promo</ModalHeader>
          <ModalBody>
            <div className="maincontent p-0">
              <h6>Are you sure want to delete promotion?</h6>        
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.closePromotionPopup}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              onClick={this.handleDeletPromo}
            >
              Delete
            </button>
          </ModalFooter>
        </Modal>
        {this.state.displayPromotions && <div className="row">
          <div className="col-sm-2 col-6">
            <div className="form-group mt-2 mb-3">
               <label>Store Name</label>
              <Select
                // isMulti
                onChange={this.onSearchStoreNameChange}
                options={this.state.storesList}
                value={this.state.searchByStoreName}
              />
            </div>
          </div>

          <div className="col-sm-2 col-6 mt-2">
            <div className="form-group mb-3">
            <label>Promotion Name</label>
              <select value={this.state.promotionName} onChange={ (e) => this.haandlePromoname(e)} className="form-control">
                <option>Select Promotion</option>
                { 
                  this.state.promotionNames &&
                  this.state.promotionNames.map((item, i) => 
                  (<option key={i} value={item.promotionName}>{item.promotionName}</option>))
                }                
                </select>
            </div>
          </div>
          <div className="col-sm-2 col-6 mt-2">
            <div className="form-group mb-3">
                <label>Start Date</label>
              <input type="date" className="form-control"
                  value={this.state.startDate}
                  onChange={ (e) => this.haandleStartdate(e)}
                  placeholder="START DATE" />
            </div>
          </div>
          <div className="col-sm-2 col-6 mt-2">
            <div className="form-group mb-3">
            <label>End Date</label>
            <input type="date" className="form-control"  
                value={this.state.endDate}
                onChange={(e) => this.haandleEnddate(e)}
                placeholder="END DATE" />
            </div>
          </div>
          <div className="col-sm-2 col-6 mt-2">
            <div className="form-group mb-3">
            <label>Status</label>
            <select value={this.state.promoStatus} onChange={(e) =>  this.handlePromoStatus(e)} className="form-control">
                <option>Select Status</option>
                { 
                  this.state.promoStatuses &&
                  this.state.promoStatuses.map((item, i) => 
                  (<option key={i} value={item.value}>{item.label}</option>))
              }
              </select>
            </div>
          </div>
          <div className="col-sm-2 col-6 mt-2 pt-4">
          <button className="btn-unic-redbdr" onClick={this.searchPromo}>SEARCH</button>
          </div>
          <div className="col-sm-4 col-12 pl-0 mb-3 scaling-center scaling-mb">
          </div> 
        </div>}

        {!this.state.displayPromotions && <div className="row">
          <div className="col-sm-3 col-6 mt-2">
            <div className="form-group mb-3">
            <label>Promo Type</label>
              <select value={this.state.searchPromotionType} onChange={ (e) => this.haandleSearchPromotionType(e)} className="form-control">
                <option>Select Promo Type</option>
                { 
                  this.state.promotionTypes &&
                  this.state.promotionTypes.map((item, i) => 
                  (<option key={i} value={item.value}>{item.label}</option>))
                }                
                </select>
            </div>
          </div>
          <div className="col-sm-4 col-6 mt-2 pt-3">
          <button className="btn-unic-search active m-r-2 " onClick={this.searchPromotion}>Search</button>
          <button
              className={this.state.addPromoPrivilege?.isEnabeld ? "mt-2 btn-unic-redbdr" : "btn-disable mt-2"}
              disabled={!this.state.addPromoPrivilege?.isEnabeld}
              onClick={this.addPromo}
            >
              <i className="icon-sale"></i> Add Promo
              {/* <i className="icon-sale p-r-1"></i>Add Promo */}
            </button>
          </div>
        </div>}
        <div className="row m-0 p-0 scaling-center">  
          <div className="col-6 p-l-0">
            <h5 className="mt-1 mb-2 fs-18 p-l-0">List Of Promotions</h5>
          </div>
          <div className="table-responsive p-0">
            <table className="table table-borderless mb-1 mt-2">
              <thead>
                <tr className="m-0 p-0">
                  <th className="col-1"># Promo-ID</th>
                  <th className="col-2">Promo Name</th>
                  <th className="col-2">DESCRIPTION</th>
                  <th className="col-2">Type</th>
                  <th className="col-2">Apply On	</th>
                  <th className="col-2">Promo Print Name</th>
                  <th className="col-1"></th>
                </tr>
              </thead>
              <tbody>
              {this.state.listOfPromos.length > 0 && this.state.listOfPromos.map((item, index) => {
                return( 
                <tr key={index}>
                  <td className="col-1 underline geeks"> {/* <input type="checkbox" onChange={(e) => this.handleChange(e, item)}/> */}<span className="pt-0 mt-0">{item.promoId}</span> </td>
                  <td className="col-2">{item.promotionName}</td>
                  <td className="col-2">{item.description}</td>
                  <td className="col-2">{item.applicability}</td>
                  <td className="col-2">{item.promoApplyType}</td>
                  <td className="col-2">{item.printNameOnBill}</td>
                  {/* <td className="col-1">
                    {item.isActive ? 
                      <button className="btn-active">Active</button> : 
                      <button className="btn-inactive">Inactive</button>}
                  </td> */}
                  {this.state.editPromoPrivilege?.isEnabeld ? <td className="col-1">
                    <img src={edit}  onClick={this.editPramotion(item)} className="w-12 pb-2" />
                    {/* <i onClick={this.handleRemovePromo(item)} className="icon-delete m-l-2 fs-16"></i> */}
                  </td> : <td className="col-1">
                    <img src={edit}  className="w-12 pb-2" />
                    {/* <i onClick={this.handleRemovePromo(item)} className="icon-delete m-l-2 fs-16"></i> */}
                  </td>}
                  </tr> 
                  )
                })}
                {this.state.listOfPromos.length == 0  && <div className='no_records'><img src={confirm}></img> <label>No records found</label></div>}              
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}