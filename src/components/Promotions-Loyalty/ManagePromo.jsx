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
import ReactPageNation from "../../commonUtils/Pagination";
import confirm from '../../assets/images/conformation.svg';

export default class ManagePromo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddPromo: false,
      pageNumber:0,
      totalPages:0,
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
          { value: 'XunitsFromBuyPool', label: 'X Uints from Buy Pool' },
          { value: 'XunitsFromGetPool', label: 'X Uints from Get Pool' }
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
        addToStorePrivilege: '',
        modifyValidityPrivilege: '',
        clonePrivilege: '',
        changePriorityPrivilege: '',
        viewPrivilege: ''
    };

    this.addPromo = this.addPromo.bind(this);
    this.closePromo = this.closePromo.bind(this);
    this.addStore = this.addStore.bind(this);
    this.closeStore = this.closeStore.bind(this);
    this.searchPromo = this.searchPromo.bind(this);
    this.promotionUpdate = this.promotionUpdate.bind(this);
    this.getPoolList = this.getPoolList.bind(this);
    this.cloneStore = this.cloneStore.bind(this);
    this.closeClonePopup = this.closeClonePopup.bind(this);
    this.addPromoToStore = this.addPromoToStore.bind(this);
    this.cloneStoreName = this.cloneStoreName.bind(this);
    this.savePriority = this.savePriority.bind(this);
    this.getAllStorePromos = this.getAllStorePromos.bind(this);
    this.updatePromotionStatus = this.updatePromotionStatus.bind(this); 
    this.handleStoreData = this.handleStoreData.bind(this);
    this.changePage = this.changePage.bind(this);
  }
  componentDidMount() {
    const childPrivileges =  PrivilegesList('Manage Promotions');
    childPrivileges.then((res) => {
      if(res) {
        const result = res.sort((a , b) => a.id - b.id);
        this.setState({
          addToStorePrivilege: result[0],
          modifyValidityPrivilege: result[1],
          clonePrivilege: result[2],
          changePriorityPrivilege: result[3],
          viewPrivilege: result[4]    
        });
      }
    });
    this.getPromoList();
    this.getAllStorePromos();
    this.getAllStoresList()
  }

   dateCompare = (endDate) => {
    let currentDate = new Date();
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    currentDate = yyyy+'-'+ mm + '-' + dd ;
    if(endDate < currentDate) {
       return true;
    }
  }
 
 getAllStoresList() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  let domainId =  user["custom:clientId1"];
  URMService.getStoresByDomainId(domainId).then((res) => {
      if(res) {
        const result = res.data.map((item) => {
          const obj = {};
            obj.value = item.id;
            obj.label = item.name;
            obj.location = item.address
          return obj;         
        });
        this.setState({storesList: result}, () => this.getPoolList());
      }
  }); 
  }
  updatePromoStartDate(e) {
    this.setState({ updatePromoStartDate: e.target.value });
  }
  updatePromoEndDate(e) {
    this.setState({ updatePromoEndDate: e.target.value });
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
      errors["searchStoreName"] = "Select Promotion Name";
    }
    this.setState({ storeErrors: errors });               
    return formIsValid;
  }
  addPromoToStore() {
    const { storeStartDate, storeEndDate, applicability, storeName, searchStoreName} = this.state;
    let promoIds = []; 
    let storeIds = [];
    const user = JSON.parse(sessionStorage.getItem("user"));    
    const createdBy = user['custom:userId'];
    const clientId = user['custom:clientId1'];
    const formDate = this.handleStoreData();
    if(formDate) {
    if(searchStoreName.length > 0) {
      promoIds = searchStoreName.map(item => {
        const obj = {};
        obj.promoId = item.value;
        obj.promotionName = item.label;
         return obj;
      });
    } else {
      let obj = {};
      obj.promoId = searchStoreName.value;
      obj.promotionName = searchStoreName.label;
      promoIds.push(obj);
    }
    
    if(storeName.length > 1) {
      storeIds =  storeName.map((item) => {
        const obj = {};
        obj.id = item.value;
        obj.name = item.label;
        return obj;
      });
     } else {
      const obj = {};
      obj.id = storeName.value;
      obj.name = storeName.label;
      storeIds.push(obj);
     }
    const requestObj = {
        promotions: promoIds,
        stores: storeIds,
        endDate: storeEndDate,
        promoApplicability: applicability,
        startDate: storeStartDate,
        priority: null,
        createdBy: createdBy,
        promotionStatus: true,
        clientId
    }
    PromotionsService.addPromoToStore(requestObj).then((res) => {
      if(res.data.isSuccess === 'true') {
        toast.success(res.data.message);
        this.setState({
          isAddStore: false,
          storeStartDate: '',
          storeEndDate: '',
          storePromoName: '', 
          storePromoType: '', 
          storeName: '',
          applicability: ''
        }, () => this.getAllStorePromos());
      } else {
        toast.success(res.data.message);
      }
    });
  } else {
    toast.info('Select All Mandatary Fields');
  }
  }
  cloneStoreName() {
    const { cloneStoreName, checkedItem } = this.state;
    const obj = {
      // promoToStoreId : checkedItem.id,
      id: checkedItem.id,
      storeName: cloneStoreName.label,
      storeId: cloneStoreName.value,
    }
    
    if(cloneStoreName !== '') {
      PromotionsService.clonePromotionByStore(obj).then((res) => {
        if(res.data.isSuccess === 'true') {
          toast.success(res.data.message);
          this.setState({
            isPramotionChecked: false,
            closeClone: false,
            cloneStoreName: '',
            checkedItem: ''
          }, () => this.getAllStorePromos());
        } else {
          toast.error(res.data.message);
        }
        // this.getPromoList();
      });
    } else {
      toast.info("Select Store Name");
    }    
  }
  savePriority() {
    const { checkedItem, priority } = this.state;
    const obj = {
        priority: priority,
        // promoToStoreId: checkedItem.id
        id: checkedItem.id
    }
    PromotionsService.updatePriority(obj).then((res) => {
      if(res.data.isSuccess === 'true') {
        toast.success(res.data.message);
        this.setState({
          isSavePriority: false,
          isPramotionChecked: false,
          priority: '',
          checkedItem: ''
        }, () => this.getAllStorePromos());
      } else {
        toast.error(res.data.message);
      }
    });
  }
  getPoolList() {
    const { clientId } = this.state;
    const user = JSON.parse(sessionStorage.getItem("user"));
    const selectedstoreData = JSON.parse(sessionStorage.getItem("selectedstoreData"));
    const storeId = selectedstoreData.storeId;
    const customClientId = user['custom:clientId1'];
    const domainId = clientId;
    PromotionsService.getPoolList(domainId, customClientId).then((res) => {
      if(res.data.isSuccess === 'true' && res.data.result['poolvo'] !== null) {
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

  addStore() {
    this.setState({ isAddStore: true });
  }
  closeStore() {
    this.setState({ isAddStore: false });
  }

  promotionUpdate() {
    const {checkedItem } = this.state;
    this.setState({
      updatePromoStartDate: checkedItem.startDate,
      updatePromoEndDate: checkedItem.endDate,
      updatePromoStatus: checkedItem.promotionStatus, 
      promotionUpdate: true 
    });
  }
  savePriorityPopUp = () =>  {
    this.setState({ isSavePriority: true });
  }
  savePriorityPopUpClose = () => {
    this.setState({ isSavePriority: false });
  }
  handlePriority = (e) => {
    this.setState({ priority: e.target.value });
  }
  getAllStorePromos() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const customClientId = user['custom:clientId1'];
    PromotionsService.getAllStorePromos(customClientId).then((res) => {
      if(res.data.isSuccess === 'true') { 
        res.data.result.forEach((item) => {
          if(this.dateCompare(item.endDate)){
           item.promotionStatus = false;
          }    
         });     
        this.setState({
          allStorePromos: res.data.result
        });
      }
    });
  }
  getPromoList() {
    const { clientId } = this.state;
    const user = JSON.parse(sessionStorage.getItem("user"));
    const selectedstoreData = JSON.parse(sessionStorage.getItem("selectedstoreData"));
    const storeId = selectedstoreData.storeId;
    const customClientId = user['custom:clientId1'];
   //  const domainId = clientId;
    PromotionsService.getPromoList(clientId, customClientId).then((res) => {
      if(res.data.isSuccess === 'true' && res.data.result['promovo'] !== null) {
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
 updatePromoDates = () => {
    const { updatePromoStartDate, updatePromoEndDate, updatePromoStatus, checkedItem } = this.state;   
    const obj = {
      startDate: updatePromoStartDate,
      endDate: updatePromoEndDate,
      // promotionStatus: updatePromoStatus,
      id: checkedItem.id
    }
      console.log(">>>", updatePromoStartDate, updatePromoEndDate);
      if (updatePromoStartDate <= updatePromoEndDate) {
      //  this.setState({ updatePromoEndDate: this.target.value });
      
      PromotionsService.updatePromotionDates(obj).then((res) => {
        if(res.data.isSuccess === 'true') {
          toast.success(res.data.message);
          this.setState({
            promotionUpdate: false,
            isPramotionChecked: false,
            updatePromoStartDate: '',
            checkedItem: ''
          });
          this.getAllStorePromos();
        } else {
          toast.success(res.data.message);
        }
      });
    // }
  }else {
    toast.error("To date should be greater than From date ");
    
  }

}
  closeUpdatePromotion = () => {
    const { checkedItem, allStorePromos } = this.state;
    allStorePromos.forEach((item) => {
      if(item.id === checkedItem.id) {
          item.isCheckBoxChecked = false;
      }
    });
    this.setState({
      promotionUpdate: false,
      isPramotionChecked: false,
      checkedItem: ''
    });
  }
  searchPromo(pageNumber) {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const customClientId = user['custom:clientId1'];
    const {promoStatus,searchByStoreName, startDate ,endDate,promotionName} = this.state;
    const obj = {
        startDate: startDate ? startDate : null,
        endDate: endDate ? endDate : null,
        promotionName: promotionName ? promotionName : null,
        promotionStatus: JSON.parse(promoStatus ? promoStatus : null),
        storeName: searchByStoreName ? searchByStoreName.label : null,
        clientId: customClientId ? customClientId  : null
       
    }
    // Need to handle search promotion
    PromotionsService.searchPromotion(obj,pageNumber).then((res) => {     
      if(res.data.isSuccess === 'true') {
        this.setState({
          allStorePromos: res.data.result.content,
          promoStatus: '', 
          searchByStoreName: '',
          endDate: '', 
          startDate: '', 
          promotionName: ''
        });        
      }     
    });
  }
  addPromo() {
    this.setState({ isAddPromo: true });
  }
  
  addStore() {
    this.setState({ isAddStore: true });
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
  handleChange(e, index, item) {
    if(e.target.checked) {
      this.state.allStorePromos?.forEach((itm, ind) => {
        if(index === ind){
          itm.isCheckBoxChecked = true;
        } else {
          itm.isCheckBoxChecked = false;
        }
      });
      this.setState({
        isPramotionChecked: true,
        checkedItem: item
      });
    } else {
      this.state.allStorePromos?.forEach((itm, ind) => {
        if(index === ind){
          itm.isCheckBoxChecked = false;
        }
      });
      this.setState({
        isPramotionChecked: false,
        checkedItem: ''
      });
    }
  }
  onChange = opt => {
    this.state.errors["selectedPools"] = '';
    this.setState({
      selectedPools: opt
    });
  };
  onStoreNameChange = selectedstore => {
    this.state.storeErrors["storeName"] = '';
    this.setState({
      storeName: selectedstore
    });
  }
  handelApplicability(e) {
    this.setState({ applicability: e.target.value });       
  }
  onSearchStoreNameChange = selectedSore => {
    this.setState({
      searchByStoreName: selectedSore
    });
  }
  onSearchStorePromoNameChange = selectedPromotions =>{
    this.state.storeErrors["searchStoreName"] = '';
    this.setState({
      searchStoreName: selectedPromotions
    });
  }
  oncloneStoreNameChange = selectedstore => {
    this.setState({
      cloneStoreName : selectedstore
    });
  }
  cloneStore() {
    this.setState({ closeClone: true });
  }
  dateFormat = (d) => {
    let date = new Date(d)
    return date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()
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
toggle = () => {
  this.setState({
    isAddStore: false,
    promotionUpdate:false,
    closeClone:false,
    isSavePriority:false,
  });
}

  closeClonePopup() {
    const { checkedItem, allStorePromos } = this.state;
    allStorePromos?.forEach((item) => {
       if(item.id === checkedItem.id) {
          item.isCheckBoxChecked = false;
       }
    });
    this.setState({ closeClone: false, cloneStoreName: '', isPramotionChecked: false,  checkedItem: ''});
  }  
  updatePromotionStatus(item) {
    const { allStorePromos } = this.state;
    let id = '';
    let isActive = '';
    allStorePromos?.forEach((itm) => {
      if(item.id === itm.id) {
        id = item.promoId;
        isActive = false;
      }
    });    
    PromotionsService.updatePromoStatus(id, isActive).then((res) => {
     if(res) {
        this.getAllStorePromos();
     }
    });
  }

  changePage(pageNumber) {
    console.log(">>>page", pageNumber);
    let pageNo = pageNumber + 1;
    this.setState({ pageNumber: pageNo });
    this.searchPromo(pageNumber); 
  }


  render() {
    return (
      <div className="maincontent">
           <Modal isOpen={this.state.isSavePriority} size="md">         
           <ModalHeader>Change Promo Priority <button type='button' onClick={() =>this.toggle()} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>
           <ModalBody>
           <div className="row">
              <div className="col-6">
              <div className="form-group">
                  <label>Priority</label>
                  <input type="text" value={this.state.priority} onChange={(e) => this.handlePriority(e)} className="form-control" placeholder="" />
                </div>
              </div>
             </div> 
           </ModalBody>
           <ModalFooter>
           <button className="btn-unic" onClick={this.savePriorityPopUpClose}>
              Cancel
            </button>
            <button className="btn-unic active fs-12" onClick={this.savePriority}>
              Save
            </button>
           </ModalFooter>
           </Modal>
        <Modal isOpen={this.state.closeClone} size="md">
          <ModalHeader>Clone Promo To Store <button type='button' onClick={() =>this.toggle()} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>
            <ModalBody>
              <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label>Store <span className="text-red font-bold" name="bold">*</span></label>
                      <Select
                        // isMulti
                        onChange={this.oncloneStoreNameChange}
                        options={this.state.storesList}
                        value={this.state.cloneStoreName}
                      />
                    </div>
                  </div>
                </div>
            </ModalBody>
            <ModalFooter>
              <button className="btn-unic" onClick={this.closeClonePopup}>
                Cancel
              </button>
              <button className="btn-unic active fs-12" onClick={this.cloneStoreName}>
                Save
              </button>
            </ModalFooter>
          </Modal>
        <Modal isOpen={this.state.isAddStore} size="md">
          <ModalHeader>Add Promo To Store <button type='button' onClick={() =>this.toggle()} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>

          <ModalBody>
            <div className="row">
              <div className="col-12">
                <h6 className="mb-2 fs-14">Please add promo codes to store</h6>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Promotion Type</label>
                  <select value={this.state.storePromoType} onChange={(e) => this.handleStorePromoType(e)}className="form-control">
                    <option>Select Type</option>
                    { 
                      this.state.storePromotypes &&
                      this.state.storePromotypes.map((item, i) => 
                      (<option key={i} value={item.value}>{item.label}</option>))
                    }
                  </select>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Promotion Name <span className="text-red font-bold" name="bold">*</span></label>
                  {this.state.storePromoType === 'By_Promotion' &&  this.state.storePromoType !== '' ? 
                    <Select
                        // isMulti
                        onChange={this.onSearchStorePromoNameChange}
                        options={this.state.storePromoList}
                        value={this.state.searchStoreName}
                    /> 
                    : 
                    <Select
                        isMulti
                        onChange={this.onSearchStorePromoNameChange}
                        options={this.state.storePromoList}
                        value={this.state.searchStoreName}
                    />}    
                </div>
                <span style={{ color: "red" }}>{this.state.storeErrors["searchStoreName"]}</span>
              </div>
              <div className="col-6 mt-3">
                <div className="form-group">
                  <label>Start Date <span className="text-red font-bold" name="bold">*</span></label>
                  <input type="date" value={this.state.storeStartDate}  onChange={(e) => this.handleStoreStartDate(e)} className="form-control" />
                </div>
                <span style={{ color: "red" }}>{this.state.storeErrors["storeStartDate"]}</span>
              </div>
              <div className="col-6 mt-3">
                <div className="form-group">
                  <label>End Date <span className="text-red font-bold" name="bold">*</span></label>
                  <input type="date" value={this.state.storeEndDate} onChange={(e) => this.handleStoreEndDate(e)} className="form-control" />
                </div>
                <span style={{ color: "red" }}>{this.state.storeErrors["storeEndDate"]}</span>
              </div>
              <div className="col-6 mt-3">
                <div className="form-group">
                  <label>Store <span className="text-red font-bold" name="bold">*</span></label>
                  {this.state.storePromoType === 'By_Promotion' && this.state.storePromoType !== '' ?
                    <Select
                      isMulti
                      onChange={this.onStoreNameChange}
                      options={this.state.storesList}
                      value={this.state.storeName}
                   /> 
                  :  
                    <Select
                      // isMulti
                      onChange={this.onStoreNameChange}
                      options={this.state.storesList}
                      value={this.state.storeName}
                    />                    
                  }
                </div>
                <span style={{ color: "red" }}>{this.state.storeErrors["storeName"]}</span>
              </div>              
              <div className="col-6 mt-3">
                <div className="form-group">
                  <label>Applicability <span className="text-red font-bold" name="bold">*</span></label>
                    <select value={this.state.applicability}
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
            </div>
            
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.closeStore}>
              Cancel
            </button>
            <button className="btn-unic active fs-12" onClick={this.addPromoToStore}>
              Save
            </button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.promotionUpdate} size="md">
          <ModalHeader>Modify Promo Validity<button type='button' onClick={() =>this.toggle()} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>

          <ModalBody>
          <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <label>Start Date <span className="text-red font-bold" name="bold">*</span></label>
                  <input value={this.state.updatePromoStartDate} onChange={(e) => this.updatePromoStartDate(e)} type="date" className="form-control" />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>End Date <span className="text-red font-bold" name="bold">*</span></label>
                  <input value={this.state.updatePromoEndDate}   onChange={(e) => this.updatePromoEndDate(e)} type="date" className="form-control"/> 
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.closeUpdatePromotion}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              onClick={this.updatePromoDates}>
              Save
            </button>
          </ModalFooter>
        </Modal>
        <div className="row">
          <div className="col-sm-2 col-6 sele">
            <div className="form-group mt-2 mb-1">
               <label>Store Name</label>
              <Select className="fs-14"
                // isMulti
                onChange={this.onSearchStoreNameChange}
                options={this.state.storesList}
                value={this.state.searchByStoreName}
              />
            </div>
          </div>

          <div className="col-sm-2 col-6 mt-2">
            <div className="form-group mb-1">
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
            <div className="form-group mb-1">
                <label>Start Date</label>
              <input type="date" className="form-control"
                  value={this.state.startDate}
                  onChange={ (e) => this.haandleStartdate(e)}
                  placeholder="START DATE" />
            </div>
          </div>
          <div className="col-sm-2 col-6 mt-2">
            <div className="form-group mb-1">
            <label>End Date</label>
            <input type="date" className="form-control"  
                value={this.state.endDate}
                onChange={(e) => this.haandleEnddate(e)}
                placeholder="END DATE" />
            </div>
          </div>
          <div className="col-sm-2 col-6 mt-2">
            <div className="form-group mb-1">
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
          <div className="col-sm-2 col-6 mt-2 pt-4 p-0">
          <button className="btn-unic-search active m-r-2 " onClick={()=>{this.searchPromo(0);this.setState({pageNumber:0})}}>Search</button>
          {this.state.addToStorePrivilege ? <button
              className="btn-unic-redbdr"
              onClick={this.addStore}
            >
              <i className="icon-store"></i> Add Store
            </button> : <button
              className="btn-disable"
            >
              <i className="icon-store"></i> Add Store
            </button>}
          </div>
          <div className="col-sm-4 col-12 pl-0 mb-3 scaling-center scaling-mb">
          </div> 
        </div>
        <div className="row m-0 p-0 scaling-center">  
          <div className="col-6 p-l-0">
          <h5 className="mt-1 mb-2 fs-18 p-l-0">List Of Promotions</h5>
            {this.state.modifyValidityPrivilege?.isEnabeld ? <button disabled={!this.state.isPramotionChecked} className={ this.state.isPramotionChecked ? 'btn-selection m-r-2 active' : 'btn-selection m-r-2' } type="button" onClick={this.promotionUpdate}>Modify Validity</button> : 
            <button className="btn-selection btn-disable m-r-2" type="button" >Modify Validity</button>}
            {this.state.clonePrivilege?.isEnabeld ? <button disabled={!this.state.isPramotionChecked} className={ this.state.isPramotionChecked ? 'btn-selection m-r-2 active' : 'btn-selection m-r-2' } type="button" onClick={this.cloneStore}>Clone</button> : 
            <button className="btn-selection btn-disable m-r-2" type="button">Clone</button>}
            {this.state.changePriorityPrivilege?.isEnabeld ? <button disabled={!this.state.isPramotionChecked} className={ this.state.isPramotionChecked ? 'btn-selection m-r-2 active' : 'btn-selection m-r-2' } type="button" onClick={this.savePriorityPopUp}>Change Promo Priority</button> : 
            <button className='btn-selection btn-disable m-r-2' type="button">Change Promo Priority</button>}
          </div>
          {/* <div className="col-6 text-right p-r-0 mt-4 align-self-center">
            <span className="mt-3 ">Show on page </span><span className="font-bold fs-14"> 1-10</span><span> out of 11</span><button className="btn-transparent" type="button"><img src={left} /></button><button className="btn-transparent" type="button"><img src={right} /></button>
          </div> */}
          <div className="table-responsive p-0">
            <table className="table table-borderless mb-1 mt-2">
            <thead>
              <tr className="m-0 p-0">
                <th className="col-1"># Mapping Id</th>
                <th className="col-2">Promotion</th>
                <th className="col-2">Store</th>
                <th className="col-2">Priority</th>
                <th className="col-2">Start Date</th>
                <th className="col-2">End Date</th>
                <th className="col-1">Status</th>
                <th className="col-1"></th>
              </tr>
            </thead>
            <tbody>
            {/* {this.state.allStorePromos.length > 0 && this.state.allStorePromos?.content?.map((item, index) => { */}
            {this.state.allStorePromos?.map((item, index) => {
            let date = this.dateFormat(item.startDate);
            let endDate = this.dateFormat(item.endDate);
            const {
              promotionName,
              storeName,
              priority,
              startDate,
              // endDate,
              promoStatus,
            } = item;
              return( 
              <tr key={index}>
                  <td className="col-1 underline geeks"> 
                  <div className="form-check checkbox-rounded checkbox-living-coral-filled fs-15">
                  <input type="checkbox" className="form-check-input filled-in"
                    checked={item.isCheckBoxChecked}  onChange={(e) => this.handleChange(e,index, item)}/>
                  <span className="pt-0 mt-0">{item.id}</span> 
                </div>

                  {/* <input type="checkbox" checked={item.isCheckBoxChecked}  onChange={(e) => this.handleChange(e,index, item)}/> 
                  <span className="pt-0 mt-0">{item.id}</span>  */}
                  
                  </td>
                  <td className="col-2">{item.promotionName}</td>
                  <td className="col-2">{item.storeName}</td>
                  <td className="col-2">{item.priority}</td>
                  <td className="col-2">{date}</td>
                  <td className="col-2">{endDate}</td>
                  <td className="col-1">
                    {item.promotionStatus ? 
                      <button onClick={() => this.updatePromotionStatus(item)} className="btn-active">Active</button> : 
                      <button className="btn-inactive">Inactive</button>}
                  </td>
                </tr> 
                )
              })}
               {this.state.allStorePromos.length == 0  && <div className='no_records'><img src={confirm}></img> <label>No records found</label></div>}               
            </tbody>
          </table>
          </div>
          <div className="row m-0 pb-3 mb-5 mt-3">
            {this.state.totalPages > 1 ? (
          <div className="d-flex justify-content-center">
                 <ReactPageNation
                  {...this.state.allStorePromos}
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