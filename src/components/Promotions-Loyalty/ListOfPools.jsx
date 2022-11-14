import React, { Component } from 'react';
import edit from '../../assets/images/edit.svg';
import uparrow from '../../assets/images/up_arrow.svg';
import downarrow from '../../assets/images/down_arrow.svg';
import '../../assets/nav.scss';
import { Collapse } from "react-collapse";
import close from '../../assets/images/cross.svg';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import PromotionsService from "../../services/PromotionsService";
import  PrivilegesList  from '../../commonUtils/PrivilegesList';
import URMService from '../../services/URM/URMService';
import { render } from "react-dom";
import DisplayPools from './DisplayPools'
import Pagination from './Pagination';
import Select from 'react-select';

export default class ListOfPools extends Component {

  constructor(props){
    super(props);
    this.state  = {
      isAddPool: false,
      deletePoolConformation: false,
      listOfPools: [],
      poolName: '',
      poolType: '',
      poolRule: '',
      addNewRule: [{ columnName: '', givenValue: '', operatorSymbol : '', valueList: []}],
      isUpdatable: false,
      updatedRuleVO: [],
      // addNewRule: [{ }],
      poolRuleList: [
        {
            Privilege: "Generate Estimation slip",
            description: "Generating estimation slip in Cash memo",
            path:"/createdeliveryslip",
            isCheck: false,
        },
        {
            Privilege: "Generate Invoice",
            description: "Generating Invoice in Cash memo",
            path:"/newsale",
            isCheck: false,
        },
        {
            Privilege: "Generate Return Slip",
            description: "Generating return slip in Cash memo",
            path:"/createdeliveryslip",
            isCheck: false,
        },
        {
            Privilege: "Add Customer",
            description: "Add customer in Cash memo",
            path:"/createcustomer",
            isCheck: false,
        },
        {
            Privilege: "Gift Vocher",
            description: "Gift Vocher in Cash memo",
            path:"/tagcustomer",
            isCheck: false,
        },
        {
            Privilege: "Day Close Activity",
            description: "Day Close Activity in Cash memo",
            path:"/posdayclose",
            isCheck: false,
        },
        {
            Privilege: "Admin",
            description: "Admin rights",
            path:"/createdeliveryslip",
            isCheck: false,
        },
        {
            Privilege: "Super Admin",
            description: "Super Admin Rights",
            path:"/createdeliveryslip",
            isCheck: false,
        }

    ],
    updatedColumns: [
      // { value: 'CostPrice', label: 'Cost_Price' },
      // { value: 'Section', label: 'Section' },
      // { value: 'SubSection', label: 'Sub_Section' },
      // { value: 'Dcode', label: 'Dcode' },
      // { value: 'Mrp', label: 'Mrp' },      
      // { value: 'BarcodeCreatedOn', label: 'Barcode_Created_On' },
      // { value: 'Style Code', label: 'Style_Code' },
      // { value: 'SubSectionId', label: 'SubSectionId' },
      // { value: 'Uom', label: 'Uom' },
      // { value: 'BatchNo', label: 'Batch_No' },
      // { value: 'DiscountType', label: 'Discount Type' },
      // { value: 'Division', label: 'Division' }
    ],
    options: [
      // { value: 'Equals', label: 'Equals' },
      // { value: 'NotEquals', label: 'Not Equals' },
      // { value: 'GreaterThan', label: 'Greater Than' },
      // { value: 'LessThan', label: 'Less Than' },
      // { value: 'GreaterThanAndEquals', label: 'Greater Than And Equals' },      
      // { value: 'LessThanAndEquals', label: 'Less Than And Equals' },
      // { value: 'In', label: 'IN' }
    ],
    columns: [],
    poolTypes: [
      { value: 'Buy', label: 'BUY' },
      { value: 'Get', label: 'GET' },
      { value: 'Both', label: 'BOTH' },    
    ],
    poolStatuses: [
      { value: true, label: 'Active' },
      { value:  false, label: 'Inactive' },
    ],
    poolStatus: true,
    createdByList: [],
    createdBy: '',
    selectedItem: '',
    clientId: '',
    currentPage: 1,
    poolsPerPage: 10,
    currentPools: [],
    listOfPoolCount: '',
    columnType: '',
    selectedPoolValues: [],
    activeTab: 'INCLUDED',
    isAddRule: false,
    addedIncludedPoolRules: [],
    addedExcludedPoolRules: [],
    // ruleNumber: 0,
    isPoolRuleUpdated: false,
    editedRuleNumber: '',
    activeIndex: null,
    selectedOption: '',
    errors: [],
    poolError: {},
    isPoolEdited: false,
    addPoolPrivilege: '',
    viewPoolPrivilege: '',
    editPoolPrivilege: ''
    };

    this.addPool = this.addPool.bind(this);
    this.closePool = this.closePool.bind(this);
    this.addPoolRule = this.addPoolRule.bind(this);
    this.closePoolRule = this.closePoolRule.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addPoolDetails = this.addPoolDetails.bind(this);
    this.handlePoolRule = this.handlePoolRule.bind(this);
    this.handlePoolType = this.handlePoolType.bind(this);
    this.handlePoolStatus = this.handlePoolStatus.bind(this);
    this.searchPool = this.searchPool.bind(this);
    this.handleCreatedBy = this.handleCreatedBy.bind(this);
    this.handleConfirmation = this.handleConfirmation.bind(this);
    this.handleDeleteConfirmation = this.handleDeleteConfirmation.bind(this);
    this.getPoolList = this.getPoolList.bind(this);
    // this.getDomainsList = this.getDomainsList.bind(this);
    this.handleRemovePool = this.handleRemovePool.bind(this);
    this.modifyPool = this.modifyPool.bind(this);
    this.paginate = this.paginate.bind(this);
    this.getAllColumns = this.getAllColumns.bind(this);
    this.handlePoolRuleConfirmation = this.handlePoolRuleConfirmation.bind(this);
    this.toggleClass = this.toggleClass.bind(this);
  }  
  componentDidMount() {
    const childPrivileges =  PrivilegesList('List of Pools');
    childPrivileges.then((res) => {
      if(res) {
        const result = res.sort((a , b) => a.id - b.id);
        this.setState({
          addPoolPrivilege:  result[0],
          editPoolPrivilege: result[1],
          viewPoolPrivilege: result[2]           
        });
      }
    });
      this.getPoolList();
      // this.getDomainsList();
  }
  getAllColumns() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    PromotionsService.getAllColumns(user['custom:clientId1']).then((res) => {
      let columnsObj = {}
     //  const result =  res.data['result'].reduce((a, v) => ({ ...a, [v]: v}), {});
      const result =  [...new Set(res.data['result'].map((itm) => itm.columnName))];
      columnsObj.Mrp = result.Mrp;
      columnsObj.CostPrice = result.CostPrice;
      columnsObj.Section = result.Section;
      columnsObj.SubSection = result.SubSection;
      // columnsObj.Dcode = result.Dcode;
      columnsObj.BarcodeCreatedOn = result.BarcodeCreatedOn;
     
      columnsObj.Division = result.Division;
      const propertyNames = Object.keys(columnsObj);
      const columnNames = propertyNames.map((item) => {
        const obj = {};
          obj.label = item.toUpperCase();
          obj.value = item;
          return obj;
      });
      this.setState({
        columns: columnNames
      });
    });
  }
  
  getPoolList() {
    const { clientId } = this.state;
    this.getAllColumns();
    const user = JSON.parse(sessionStorage.getItem("user"));
    const selectedstoreData = JSON.parse(sessionStorage.getItem("selectedstoreData"));
    const storeId = selectedstoreData.storeId;
    const customClientId = user['custom:clientId1'];
    const domainId = clientId;
    PromotionsService.getPoolList(domainId, customClientId).then((res) => {
      if(res.data.result['poolvo'] !== null) {   
            var elements = res.data.result['poolvo'].reduce( (previous, current) => {
            var object = previous.filter(object => object.createdBy === current.createdBy);
            if (object.length == 0) {
              previous.push(current);
            }
            return previous;
          }, []);
          const finalResult = elements.filter((item) => item.createdBy !== null);
          this.setState({ 
            listOfPools: res.data.result['poolvo'],
            createdByList: finalResult
            });    
       } else {
          //  toast.error(res.data.message);
       }    
    });
  }
  
  handleChange(e) {
  this.state.poolError["poolName"] = '';
   this.setState({poolName: e.target.value});
  }

  handlePoolRule(e) {
    this.setState({poolRule: e.target.value});
  }

  handlePoolType(e){
    this.state.poolError["poolType"] = '';
    this.setState({poolType: e.target.value});
  }

  handlePoolStatus(e){
    this.setState({poolStatus: e.target.value});
  }

  addPool() {
    this.setState({
          isAddPool: true,
          addedExcludedPoolRules: [],
          addedIncludedPoolRules: []
       });
  }
  handlePoolData = () => {
    const {poolName, poolType } = this.state;
    let errors = {};
    let formIsValid = true;
    if (!poolName) {
      formIsValid = false;
      errors["poolName"] = "Enter Pool Name";
    }
    if (!poolType) {
      formIsValid = false;
      errors["poolType"] = "Select Pool Type";
    }
    this.setState({ poolError: errors });               
    return formIsValid;
  }
  addPoolDetails() {
    const { addedIncludedPoolRules, addedExcludedPoolRules, activeTab, ruleNumber, isUpdatable} = this.state;
    let poolConditions = [];
    const user = JSON.parse(sessionStorage.getItem("user"));
    const selectedstoreData = JSON.parse(sessionStorage.getItem("selectedstoreData"));     
    const createdBy = user['custom:userId'];
    delete this.state.addNewRule['valueList']
    if(this.state.isUpdatable) {
      const { poolId, updatedRuleVO, addedExcludedPoolRules, addedIncludedPoolRules } = this.state;
      const updatedPoolRules = [...addedExcludedPoolRules, ...addedIncludedPoolRules];
      let updatedConditionArray = [];
      updatedPoolRules.forEach((rule) => {
        rule.rules.forEach((itm) => {
          if(itm.isForEdit) {
            itm.isForEdit = true;
          } else {
            itm.isForEdit = true;
          }
          updatedConditionArray.push(itm)
        }); 
      });
      const updateObj = {
                  isActive: true,
                  isForEdit: true,
                  poolName: this.state.poolName,
                  poolType: this.state.poolType,
                  storeId: selectedstoreData.storeId,
                  clientId: user['custom:clientId1'],
                  createdBy: createdBy,
                  domainId: this.state.clientId,
                   pool_RuleVo: this.groupByMultiplePropertiesEdit(updatedConditionArray),
                  isForEdit: true,
                  poolId: poolId
                };
        PromotionsService.modifyPool(updateObj).then((res) => {
          if (res.data.isSuccess === 'true') {
              toast.success(res.data.message);
              this.setState({ 
                isAddPool: false,
                isUpdatable: false,
                poolName: '',
                poolType: '',
                addNewRule: [],
                addedExcludedPoolRules: [],
                addedIncludedPoolRules: []
              });
              this.getPoolList();
          } else {
              toast.error(res.data.message);
          }
      });
    } else {
    const finalAddedRules = [...addedIncludedPoolRules, ...addedExcludedPoolRules];
    finalAddedRules.forEach(item => {    
    item.ruleNumber = item.ruleNumber;
      item.rules.forEach((itm) => {
        itm.ruleNumber = item.ruleNumber;
        delete itm.oparatorsList;
        delete itm.selectedPoolValues;
        poolConditions.push(itm);
      });
    });
    const obj = {
      isActive: true,
      isForEdit: false,
      poolName: this.state.poolName,
      poolType: this.state.poolType,
      storeId: selectedstoreData.storeId,
      clientId: user['custom:clientId1'],
      createdBy: createdBy,
      domainId: this.state.clientId,
      pool_RuleVo: this.groupByMultipleProperties(poolConditions)
    }
    if(poolConditions.length === 0) {
      this.handlePoolData();
      toast.info('Add Pool Rule');
    } else if(this.handlePoolData()) {
      PromotionsService.addPool(obj).then((res) => {
        if (res.data.isSuccess === 'true') {
            toast.success(res.data.message);
            this.setState({ 
              isAddPool: false,
              isUpdatable: false,
              poolName: '',
              poolType: '',
              addNewRule: [],
              updatedRuleVO: [],
              activeIndex: null
            });
            this.getPoolList();
        } else {
          toast.error(res.data.message);
        }
     });
    }
  }
  }
  handleAddRow = () => {
    const { ruleNumber, activeTab, addNewRule } = this.state;     
      this.setState({
        isPoolRuleUpdated: false,
        isAddRule: true,
        addNewRule: [],
      
      });
  };
  conditionValidation = () => {
    const { addNewRule } = this.state;
    const membersArrayErrors = []
    addNewRule.forEach((member, memberIndex) => {
      const memberErrors = {}
      if (!member || !member.columnName) {
        memberErrors.columnName = 'Required'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (!member || !member.operatorSymbol) {
        memberErrors.operatorSymbol = 'Required'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (!member || !member.givenValue) {
        memberErrors.givenValue = 'Required'
        membersArrayErrors[memberIndex] = memberErrors
      }      
    });
    return membersArrayErrors;
  } 
  handleAddRuleRow = () => { 
    const conditionErrors = this.conditionValidation();
    if(conditionErrors.length === 0) {
      const item = {
        columnName: '',
        givenValue: '',
        operatorSymbol: '',
        selectedPoolValues: []
      };
      this.setState({
        addNewRule: [...this.state.addNewRule, item]     
      });
    } else {
      toast.info('Select All Mandatary Fields Of The Condition');
    }
    
  };
  onColumnValueChange = idx => (opt) => {
    const { addNewRule } = this.state;
    const values =  opt.map( itm => itm.value);
    this.state.addNewRule[idx].selectedPoolValues=opt;
    this.state.addNewRule[idx].givenValue = values.join(", ");
    this.setState({
      // selectedPoolValues: opt,
      addNewRule
    });
  };
  handleTextChange = (idx, e) => {
    let addNewRule = this.state.addNewRule;
    addNewRule[idx][e.target.name] = e.target.value;
    this.setState({ addNewRule });
  };

  handleOperatorSymbolChange = (idx, e) => {
    let addNewRule = this.state.addNewRule;
    addNewRule[idx][e.target.name] = e.target.value;    
    this.setState({ addNewRule});
  }
  getValuesForAllColumns = (columnType, idx) => {
    let addNewRule = this.state.addNewRule;
    PromotionsService.getValuesFromProductTextileColumns(columnType).then((res) => {
      if (res.data.isSuccess === 'true') {
        const columnNames = res.data['result'].map((item) => {
          const obj = {};
            obj.label = item.name;
            obj.value = item.id;
            return obj;
        });
        this.state.addNewRule[idx].valueList = columnNames;
      
       
      } else {
        toast.error(res.data.message);
      }
    });
  }
  

  toggle = () => {
    this.setState({
      isAddPool: false,
      isAddRule:false,
    });
  }
  
  handleRoleChange = (idx, e) => {
    let addNewRule = this.state.addNewRule;
    addNewRule[idx][e.target.name] = e.target.value;
    let columnType = addNewRule[idx][e.target.name];
    this.getOperatorForEachColumn(columnType, idx);
    this.setState({ addNewRule, columnType:  e.target.name}, () => {      
    if(columnType  === 'BatchNo' || columnType  === 'StyleCode' || 
               columnType  === 'Division' || columnType  === 'SubSection' ||  
               columnType  === 'Section' || columnType  === 'Uom') {
       this.getValuesForAllColumns(columnType, idx);
     }
    });
  }
  paginate(e, number) {    
    const { poolsPerPage } = this.state;
    this.setState({
        currentPage: number,
        listOfPoolCount: number * poolsPerPage
    });
  }
  handleRemovePool(item) {
    this.setState({
      deletePoolConformation: true,
      selectedItem: item
    });
  }
  conditionsList = (ruleList) => {
    let conditionsList = [];
    ruleList.forEach((itm) => {
      return itm.conditionVos.map((item) => {
        const obj =  { columnName: item.columnName, operatorSymbol: item.operatorSymbol, givenValue: item.givenValues.toString(), id: item.id, ruleId: itm.id, ruleType: itm.ruleType, ruleNumber: itm.ruleNumber}
        return conditionsList.push(obj);
      });
    });
    return conditionsList;
  }
  modifyPool(item) {
    const { listOfPools } = this.state;
    const user = JSON.parse(sessionStorage.getItem("user"));
    const createdBy = user['cognito:groups'][0];
    const pool =  listOfPools.find(pool => pool.poolId === item.poolId);
    const conditionsList = this.conditionsList(pool.pool_RuleVo);
    conditionsList.forEach((item, idx) => {
      if(item.columnName  === 'BatchNo' || item.columnName  === 'Division' || item.columnName  === 'SubSection' ||  
      item.columnName  === 'Section' || item.columnName  === 'Uom') {
          this.getValuesForAllColumns(item.columnName, idx);
      }
    });
    this.setState({
         isUpdatable: true,
         isPoolEdited: true,
         activeIndex: null,
         isAddPool: true,
         poolId: pool.poolId,
         poolName: pool.poolName,
         poolType: pool.poolType,
         addNewRule: conditionsList,
         addedIncludedPoolRules: this.groupByRuleNumber(conditionsList.filter(item =>  item.ruleType === 'Include')),
         addedExcludedPoolRules: this.groupByRuleNumber(conditionsList.filter(item =>  item.ruleType === 'Exclude'))
      // updatedRuleVO: pool.ruleVo
    });
  }

  handleRemoveSpecificRow = (idx) => () => {    
    const addNewRule = [...this.state.addNewRule]
    addNewRule.splice(idx, 1)
    this.setState({ addNewRule})
  }
  handleRemoveSpecificRule = (idx) => {
    if(this.state.activeTab === 'INCLUDED') {
      const addedIncludedPoolRules = [...this.state.addedIncludedPoolRules]
      addedIncludedPoolRules.splice(idx, 1)
      this.setState({ addedIncludedPoolRules })
    } else {
      const addedExcludedPoolRules = [...this.state.addedExcludedPoolRules]
      addedExcludedPoolRules.splice(idx, 1)
      this.setState({ addedExcludedPoolRules })
    }
    
  }
  closePool() {
    this.setState({ 
      isAddPool: false,
      isUpdatable: false,
      poolName: '',
      poolType: '',
      ruleNumber: '',
      addNewRule: [],
      updatedRuleVO: [],
      addedExcludedPoolRules: [],
      addedIncludedPoolRules: [],
      addNewRule: [{ columnName: '', givenValue: '', operatorSymbol : '' }]
    });
  }

  addPoolRule() {
    this.setState({isAddPoolRule : true});
  } 

  closePoolRule() {
    this.setState({ isAddPoolRule : false,  isPoolEdited: false, activeIndex: null, });
  }
  handleCreatedBy(e) {
    this.setState({ createdBy: e.target.value });
  }
  clearPool = () => {
    this.setState({ 
      listOfPools: [],
      createdBy: '',
      poolType: ''     
     }, () => this.getPoolList());
  }
  searchPool() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const customClientId = user['custom:clientId1'];
    const { createdBy, poolType, poolStatus, createdByList} = this.state;
    const obj = {       
        createdBy: createdBy,
        poolType: poolType,
        isActive: poolStatus,
        clientId: customClientId
    }   
    this.setState({ 
      listOfPools: []
      // createdByList: []
     });
     if(obj.isActive!="" && obj.poolType!=""){
    PromotionsService.searchPool(obj).then((res) => {
      if(res.data.isSuccess === 'true') {
       this.setState({ 
         listOfPools: res.data.result,
         addNewRule: [{ columnName: '', givenValue: '', operatorSymbol : '' }]
        });     
      } else {
        toast.error(res.data.message);
      }  
     });
    }else{
      toast.error("please select CreatedBy and Pool Type");
    }
  }

  handleDeleteConfirmation() {
    this.setState({ deletePoolConformation: false });
  }
  handleConfirmation() {
    const { selectedItem } = this.state;
    PromotionsService.deletePool(selectedItem.poolId).then((res) => {
      if(res.data.isSuccess === 'true') {
        this.setState({ deletePoolConformation: false });
        toast.success(res.data.message);
        this.getPoolList();
      } else {
        toast.error(res.data.message);
      }    
    });
  }

  handlePoolRuleConfirmation() {
    this.setState({
      isAddRule: false,
      addedNewRules: []
    });
  }
  getOperatorList = () => {
    const { addNewRule } = this.state;
    //For In Operator start
    addNewRule.forEach((val) => {
    val.selectedPoolValues= {};
    const givenValues  = val.givenValue.split(", ");
    const givenValuesList = givenValues.map((itm) => {
         const obj = {};
         obj.label = itm;
         obj.value = itm;
         return obj;
    });
    val.selectedPoolValues = givenValuesList;
    });
    this.setState({ 
      addNewRule 
    });
    //For In Operator end
    addNewRule.forEach((itm, idx) => {
      itm.oparatorsList = [];
      this.getOperatorForEachColumn(itm.columnName, idx);
      if(itm.columnName  === 'BatchNo' || itm.columnName  === 'StyleCode' || itm.columnName  === 'Division' 
        || itm.columnName  === 'SubSection' ||  itm.columnName  === 'Section' || itm.columnName === 'Uom') {
        this.getValuesForAllColumns(itm.columnName, idx);
      }
    });
  }
  getOperatorForEachColumn = (column, idx) => {
    const { addNewRule } = this.state;
    PromotionsService.anyMatchingData(column).then((res) => {
      let opetators;
      if (res.data.isSuccess === 'true') {          
          opetators = res.data.result.map((item) => {
          let obj = {};
          obj.label = item.operator.trim();
          obj.value = item.operator.trim();
          return obj;
        });
      }
      this.state.addNewRule[idx].oparatorsList = opetators;
      this.setState({ addNewRule });
    });
  }
  editPoolRule(item, index) {
    const { activeTab, addedExcludedPoolRules, addedIncludedPoolRules, isUpdatable } = this.state;
    if(isUpdatable) {
      if(activeTab === 'INCLUDED') {
        let includeConditions = [];
        addedIncludedPoolRules.forEach(item => {
          // delete item.ruleNumber;
          item.rules.forEach(itm => {
            includeConditions.push(itm);
          });
        });
        this.setState({
          editedRuleNumber: item,
          isAddRule: true,
          isPoolRuleUpdated: true,
          addedIncludedPoolRules: this.groupByRuleNumber(includeConditions.filter(item =>  item.ruleType === 'Include')),
          addNewRule: includeConditions.filter(itm => itm.ruleType === 'Include' && itm.ruleNumber == item)
        }, () => this.getOperatorList());
      } else {
        let excludeConditions = [];
        addedExcludedPoolRules.forEach(item => {
          // delete item.ruleNumber;
          item.rules.forEach(itm => {
            excludeConditions.push(itm);
          });
        })
        this.setState({
          isAddRule: true,
          isPoolRuleUpdated: true,
          addedExcludedPoolRules: this.groupByRuleNumber(excludeConditions.filter(item =>  item.ruleType === 'Exclude')),
          addNewRule: excludeConditions.filter(itm => itm.ruleType === 'Exclude' && itm.ruleNumber == item)
        }, () => this.getOperatorList());
      }      
    }
  }
  groupByRuleNumber = (conditions) => {
    let obj = {};
    obj.columnName = '';
    obj.createdBy = '';
    obj.givenValue = '';
    obj.id = '';
    obj.isForEdit = '';
    obj.lastModified = '';
    obj.modifiedBy = '';
    obj.operatorSymbol = '';
    obj.ruleNumber = '';
    obj.ruleType = '';
    const  group_to_values = conditions.reduce((obj, item) => {
      obj[item.ruleNumber] = obj[item.ruleNumber] || [];
      obj[item.ruleNumber].push(item);
      return obj;
    }, {});
    const groups = Object.keys(group_to_values).map(function (key) {
      return {ruleNumber: key, rules: group_to_values[key]};
    });
    return groups;
  }
  groupByMultipleProperties = (array) => {
    let hash = Object.create(null);
    let grouped = [];
    array.forEach(function (o) {
    var key = ['ruleNumber', 'ruleType', 'isForEdit'].map(function (k) { return o[k]; });//.join('|');

    if (!hash[key]) {
    hash[key] = { ruleNumber: o.ruleNumber, ruleType: o.ruleType, isForEdit: o.isForEdit, conditionVos : [] };
    grouped.push(hash[key]);
    }
    let value ;
    if(typeof o['givenValue'] === 'object') {
      value = o['givenValue'].value;
      } else {
        value = o['givenValue'];
    }
    ['used'].forEach(function (k) { hash[key]['conditionVos'].push({ columnName : o['columnName'], givenValues : [value], operatorSymbol: o['operatorSymbol']}) });
    });
    return grouped;
  }
  groupByMultiplePropertiesEdit = (array) => {
    let hash = Object.create(null);
    let grouped = [];
    array.forEach(function (o) {
    var key = ['ruleNumber', 'ruleType', 'isForEdit'].map(function (k) { return o[k]; });//.join('|');

    if (!hash[key]) {
    hash[key] = { ruleNumber: o.ruleNumber, ruleType: o.ruleType, isForEdit: o.isForEdit, id: o.ruleId, conditionVos : [] };
    grouped.push(hash[key]);
    }
    ['used'].forEach(function (k) { hash[key]['conditionVos'].push({ columnName : o['columnName'], givenValues : [o['givenValue']], operatorSymbol: o['operatorSymbol'], id: o['id']}) });
    });
    return grouped;
  }
  addRule = () => {
    const { addNewRule, editedRuleNumber, activeTab, addedExcludedPoolRules, addedIncludedPoolRules, isUpdatable, isPoolRuleUpdated } = this.state;
  
    const conditionErrors = this.conditionValidation();
    if(addNewRule.length === 0) {
      toast.info('Add At Least One Condition');
    } else if(conditionErrors.length === 0 && addNewRule.length > 0){
      if(isUpdatable) {
            // if pool condition edit
            const addedNewRules = addNewRule.map((item) => {
              // item.ruleNumber = this.state.ruleNumber;
              if(isUpdatable) {
                item.isForEdit = true;
              } else {
                item.isForEdit = false;
              }
              return item;
            });
          if(activeTab === 'INCLUDED') {
            let  addedIncludedPoolRules1 = [];
            if(isPoolRuleUpdated) {
                addedIncludedPoolRules1 = [...addedIncludedPoolRules];
            } else {
              const finalIncludedRules = addedNewRules.map((item) => { 
                item.ruleType = 'Include';
                // item.ruleNumber = this.state.ruleNumber
                return item; 
              });
              const groupedRules = this.groupByRuleNumber(finalIncludedRules);
              addedIncludedPoolRules1 = [...addedIncludedPoolRules, ...groupedRules];
            }
            let includeConditions = [];
            addedIncludedPoolRules1.forEach(item => {
              // delete item.ruleNumber;
              item.rules.forEach(itm => {
                includeConditions.push(itm);
              });
            });
            this.setState({
              isPoolRuleUpdated: false,
              // ruleNumber: this.state.ruleNumber,
              isAddRule: false,
              addedIncludedPoolRules: this.groupByRuleNumber(includeConditions),
              addNewRule: []
            });
          } else {
              let  addedExcludedPoolRules1 = [];
              if(isPoolRuleUpdated) {
                addedExcludedPoolRules1 = [...addedExcludedPoolRules];
              } else {
                const finalExcludedRules = addedNewRules.map((item) => { 
                  item.ruleType = 'Include';
                  // item.ruleNumber = this.state.ruleNumber
                  return item; 
                });
                const groupedRules = this.groupByRuleNumber(finalExcludedRules);
                addedExcludedPoolRules1 = [...addedExcludedPoolRules, ...groupedRules];
              }
              let updateExConditions = [];
              addedExcludedPoolRules1.forEach(item => {
                item.rules.forEach(itm => {
                  updateExConditions.push(itm);
                });
              });
              this.setState({
                isPoolRuleUpdated: false,
                isAddRule: false,
                addedExcludedPoolRules: this.groupByRuleNumber(updateExConditions),
                addNewRule: []
              });
          }
      } else {
          const addedNewRules = addNewRule.map((item) => {
            // item.ruleNumber = this.state.ruleNumber;
            if(isUpdatable) {
              item.isForEdit = true;
            } else {
              item.isForEdit = false;
            }
            return item;
          });
        if(activeTab === 'INCLUDED') {      
          // const includeRules = [...addedIncludedPoolRules, ...addedNewRules];
          const finalIncludedRules = addedNewRules.map((item) => {
            let itm = '';
            item.ruleType = 'Include';
            var date = Date.parse(item.givenValue);
            if(isNaN(date)) {
              itm = JSON.parse(item.givenValue);
            } else {
              itm = JSON.parse(JSON.stringify(item.givenValue)); 
            }           
            delete item.givenValue; 
            item.givenValue = itm;
            return item;  
          });         
         const groupedRules = this.groupByRuleNumber(finalIncludedRules);
         const includeRules = [...addedIncludedPoolRules, ...groupedRules];
         includeRules.forEach((item, index) => {
            item.ruleNumber = index + 1;
          });
         this.setState({
            isAddRule: false,
          // addedIncludedPoolRules: finalIncludedRules,
            addedIncludedPoolRules: includeRules,
            addNewRule: []
          });
        } else {
          // const excludeRules = [...addedExcludedPoolRules, ...addedNewRules];
          const finalExcludedRules = addedNewRules.map((item) => {
            let itm = '';
            item.ruleType = 'Exclude';
            var date = Date.parse(item.givenValue);
            if(isNaN(date)) {
              itm = JSON.parse(item.givenValue);
            } else {
              itm = JSON.parse(JSON.stringify(item.givenValue)); 
            }
            delete item.givenValue;
            item.givenValue = itm;
            return item; 
          });
          const groupedRules = this.groupByRuleNumber(finalExcludedRules);
          const excludeRules = [...addedExcludedPoolRules, ...groupedRules];
          excludeRules.forEach((item, index) => {
            item.ruleNumber = index + 1;
          });
          this.setState({
            isAddRule: false,
            addedExcludedPoolRules: excludeRules,
            addNewRule: []
          });
        }
      }
    } else {
      toast.info('Select All Mandatary Fields Of The Condition');
    }     
  }

  getPrivilegesList() {
    return this.state.poolRuleList.map((items, index) => {
        const { Privilege, description, isCheck } = items;
        return (
            <tr className="row m-0 p-0" key={index}>
                <td className="col-1">{index + 1}</td>
                <td className="col-4">{Privilege}</td>
                <td className="col-6">{description}</td>
                <td className="col-1">
                    <div className="form-check checkbox-rounded checkbox-living-coral-filled pointer fs-15">
                      <input type="checkbox" className="form-check-input filled-in mt-1" id="remember{{index}}"  
                        name="barcodes{{index}}" checked={isCheck}
                        onChange={(e) => this.setPrivileges(e, index, Privilege)}/>
                      <label className="form-check-label" htmlFor="remember"></label>
                    </div>
                </td>
            </tr>
        );
    });
}
toggleClass(index, e) {
  this.setState({
    activeIndex: this.state.activeIndex === index ? null : index
  });
}
moreLess(index) {
  if (this.state.activeIndex === index) {
    return (
      <span>
        <img src={uparrow} className="w-12 pb-2" />
      </span>
    );
  } else {
    return (
      <span>
        <img src={downarrow} className="w-12 pb-2" />
      </span>
    );
  }
}
FirstTab = () => {
  return (
    <div className="FirstTab">
      <div className="table-responsive m-0 p-0">
              {this.state.addedIncludedPoolRules.length > 0 && this.state.addedIncludedPoolRules.map((item, index) => {
                return (
                    <div>
                      <table className="table table-borderless mb-1 mt-2">
                      <thead>
                          <tr key={index}> 
                            <td className="col-10"><h6>Rule - {index + 1}</h6></td>
                            <td><img onClick={() => this.editPoolRule(index + 1, index)} src={edit} className="w-12 pb-2" /> </td>
                            <td> <i onClick= {() => this.handleRemoveSpecificRule(index)} className="icon-delete m-l-2 fs-16"></i></td>
                            <td><i onClick={this.toggleClass.bind(this, index)}>{this.moreLess(index)}</i></td>
                          </tr>
                        </thead>
                      </table>
                      <Collapse isOpened={this.state.activeIndex === index}>
                        <table className="table table-borderless mb-1 mt-2">
                          <thead>
                            <tr className="mt-1 p-0">
                              <th className="col-3">COLUMN NAME</th>
                              <th className="col-3">OPERATOR</th>
                              <th className="col-3">VALUES</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.rules.map((itm, ind) => {
                                return (
                                  <tr key={ind}>
                                  <td className="col-3">{itm.columnName}</td>
                                  <td className="col-3">{itm.operatorSymbol}</td>
                                  <td  className="col-3">                                    
                                    {this.state.isPoolEdited ? this.state.addedIncludedPoolRules[index].rules[ind].valueList ? <select
                                      value={this.state.addedIncludedPoolRules[index].rules[ind].givenValue} 
                                      disabled                       
                                      name="givenValue"
                                      className="form-control">
                                      {
                                          this.state.addedIncludedPoolRules[index].rules[ind].valueList &&
                                          this.state.addedIncludedPoolRules[index].rules[ind].valueList.map((item, i) => 
                                          (<option key={i} value={item.value}>{item.label}</option>))
                                      }
                                      </select> : <input 
                                        type="text" 
                                        name="givenValue"
                                        value={this.state.addedIncludedPoolRules[index].rules[ind].givenValue}
                                        disabled
                                        className="form-control"
                                      /> :
                                      this.state.addedIncludedPoolRules[index].rules[ind].valueList ? <select
                                      value={this.state.addedIncludedPoolRules[index].rules[ind].givenValue.value} 
                                      disabled                       
                                      name="givenValue"
                                      className="form-control">
                                      {
                                          this.state.addedIncludedPoolRules[index].rules[ind].valueList &&
                                          this.state.addedIncludedPoolRules[index].rules[ind].valueList.map((item, i) => 
                                          (<option key={i} value={item.value}>{item.label}</option>))
                                      }
                                      </select> : <input 
                                        type="text" 
                                        name="givenValue"
                                        value={this.state.addedIncludedPoolRules[index].rules[ind].givenValue}
                                        disabled
                                        className="form-control"
                                      />
                                      }
                                  </td>                             
                                </tr>
                                  )
                            })}
                            </tbody>
                          </table>
                        </Collapse>
                    </div>
                  )
              })}
      </div>
    </div>
  );
};

SecondTab = () => {
  return (
    <div className="SecondTab">
      <div className="table-responsive m-0 p-0">
              {this.state.addedExcludedPoolRules.length > 0 && this.state.addedExcludedPoolRules.map((item, index) => {
                return (
                  <div>
                  <table className="table table-borderless mb-1 mt-2">
                    <thead>
                        <tr key={index}> 
                        <td className="col-10"><h6>Rule - {index + 1}</h6></td>
                        <td><img onClick={() => this.editPoolRule(index + 1, index)} src={edit} className="w-12 pb-2" /> </td>
                        <td> <i onClick= {() => this.handleRemoveSpecificRule(index)} className="icon-delete m-l-2 fs-16"></i></td>
                        <td><i onClick={this.toggleClass.bind(this, index)}>{this.moreLess(index)}</i></td>
                        </tr>
                      </thead>
                    </table>
                    <Collapse isOpened={this.state.activeIndex === index}>
                      <table className="table table-borderless mb-1 mt-2">
                        <thead>
                          <tr className="mt-1 p-0">
                            <th className="col-3">COLUMN NAME</th>
                            <th className="col-3">OPERATOR</th>
                            <th className="col-3">VALUES</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.rules.map((itm, ind) => {
                              return (
                                <tr className="m-0 p-0" key={ind}>
                                  <td className="col-3">{itm.columnName}</td>
                                  <td className="col-3">{itm.operatorSymbol}</td>
                                  <td  className="col-3">                                    
                                    {this.state.isPoolEdited ? this.state.addedExcludedPoolRules[index].rules[ind].valueList ? <select
                                      value={this.state.addedExcludedPoolRules[index].rules[ind].givenValue} 
                                      disabled                       
                                      name="givenValue"
                                      className="form-control">
                                      {
                                          this.state.addedExcludedPoolRules[index].rules[ind].valueList &&
                                          this.state.addedExcludedPoolRules[index].rules[ind].valueList.map((item, i) => 
                                          (<option key={i} value={item.value}>{item.label}</option>))
                                      }
                                      </select> : <input 
                                        type="text" 
                                        name="givenValue"
                                        value={this.state.addedExcludedPoolRules[index].rules[ind].givenValue}
                                        disabled
                                        className="form-control"
                                      /> :
                                      this.state.addedExcludedPoolRules[index].rules[ind].valueList ? <select
                                      value={this.state.addedExcludedPoolRules[index].rules[ind].givenValue.value} 
                                      disabled                       
                                      name="givenValue"
                                      className="form-control">
                                      {
                                          this.state.addedExcludedPoolRules[index].rules[ind].valueList &&
                                          this.state.addedExcludedPoolRules[index].rules[ind].valueList.map((item, i) => 
                                          (<option key={i} value={item.value}>{item.label}</option>))
                                      }
                                      </select> : <input 
                                        type="text" 
                                        name="givenValue"
                                        value={this.state.addedExcludedPoolRules[index].rules[ind].givenValue}
                                        disabled
                                        className="form-control"
                                      />
                                      }
                                  </td>  
                                </tr>
                                )
                          })}
                        </tbody>
                      </table>
                    </Collapse>
                  </div>  
                )
              })}
      </div>
    </div>
  );
};

handleInclude = () => {
  this.setState({
    activeTab: 'INCLUDED',
    activeIndex: null,
    // ruleNumber: this.state.ruleNumber,
    addNewRule: []
  });
};
handleExclude = () => {
  this.setState({
    activeTab: 'EXCLUDED',
    activeIndex: null,
    // ruleNumber: this.state.ruleNumber,
    addNewRule: []
  });
};

Tabs = () => {
  return (
    <div className="Tabs">
      {/* Tab nav */}
      <ul className="nav mt-4">
        <li
        className={this.state.activeTab === "INCLUDED" ? "active" : ""}
        onClick={this.handleInclude}
        >INCLUDED</li>
        <li
        className={this.state.activeTab === "EXCLUDED" ? "active" : ""}
        onClick={this.handleExclude}
         >EXCLUDED</li>
      </ul>
      <div>
     
        {this.state.activeTab === "INCLUDED" ? this.FirstTab() : this.SecondTab()}
        <button type="button" className="btn-unic-redbdr mt-4" onClick={this.handleAddRow}>Add Pool Rule</button>
      </div>
    </div>
  );
};

  render() {
    const indexOfLastPost = this.state.currentPage * this.state.poolsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.poolsPerPage;
    this.state. currentPools = this.state.listOfPools.slice(indexOfFirstPost, indexOfLastPost);  
    return (
      <div className="maincontent">
        <Modal isOpen={this.state.isAddPoolRule} size="lg">
        <ModalHeader>Add Pool Rule</ModalHeader>
          <ModalBody>
          <div className="maincontent p-0">
                            <table className="table table-borderless">
                                <thead>
                                    <tr className="row m-0 p-0">
                                        <th className="col-1 pt-1">S.No</th>
                                        <th className="col-4 pt-1">Pool Rules</th>
                                        <th className="col-6 pt-1">Description</th>
                                        <th className="col-1 pt-1"></th>

                                    </tr>
                                </thead>
                                <tbody>
                                   
                                    {this.getPrivilegesList()}
                                </tbody>
                            </table>
                        </div>
            </ModalBody>
            <ModalFooter>
            <button className="btn-unic" onClick={this.closePoolRule}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              onClick={this.closePoolRule}
            >
              Save
            </button>
          </ModalFooter>
          </Modal>
        <Modal isOpen={this.state.deletePoolConformation} size="lg">
        <ModalHeader>Delete Pool Rule</ModalHeader>
          <ModalBody>
                <div className="maincontent p-0">
                    <h6>Are you sure want to delete pool?</h6>        
                </div>
            </ModalBody>
            <ModalFooter>
            <button className="btn-unic" onClick={this.handleDeleteConfirmation}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              onClick={this.handleConfirmation}
            >
              Delete
            </button>
          </ModalFooter>
          </Modal>
          <Modal isOpen={this.state.isAddRule} size="lg">
              <ModalHeader>Add Pool Rule <button type='button' onClick={() =>this.toggle()} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>
                <ModalBody>
                <div className="col-12">
                  <table className="table table-borderless mb-1 mt-2">
                    <thead>
                      <tr className="m-0 p-0">
                        <th className="col-4 text-center">Column Name</th>
                        <th className="col-3 text-center">Operator</th>
                        <th className="col-4 text-center">Values</th>
                        <th className="col-1"></th>
                      </tr>
                    </thead>
                </table>
                <table className="table-borderless V1_table gfg mb-0 w-100">
                  <tbody>
                      {this.state.addNewRule.map((item, idx) => (
                        
                        <tr id="addr0" key={idx}>
                          <td className='col-4 t-form'>
                          <select 
                              value={this.state.addNewRule[idx].columnName} 
                              onChange={e => this.handleRoleChange(idx, e)} 
                              name="columnName"
                              className="form-control">
                              <option>Select Name</option>
                              {
                                  this.state.columns &&
                                  this.state.columns.map((item, i) => 
                                  (<option key={i} value={item.value}>{item.label.toUpperCase()}</option>))
                                }
                            </select>
                          </td>
                          <td className='col-3 t-form'>
                            <select 
                              value={this.state.addNewRule[idx].operatorSymbol}
                              onChange={ e => this.handleOperatorSymbolChange(idx, e)}                          
                              name="operatorSymbol"
                              className="form-control">
                                <option>Select Operator</option>
                                {
                                  this.state.addNewRule[idx].oparatorsList &&
                                  this.state.addNewRule[idx].oparatorsList.map((item, i) => 
                                  (<option key={i} value={item.value}>{item.label}</option>))
                                }
                            </select>
                          </td>
                          {(this.state.addNewRule[idx].columnName === 'CostPrice'  || this.state.addNewRule[idx].columnName === 'Mrp' || this.state.addNewRule[idx].columnName === 'BarcodeCreatedOn') ? 
                          <td className='col-4 t-form'> <input
                             type={this.state.addNewRule[idx].columnName === 'BarcodeCreatedOn' ? 'date' : 'text'}
                              name="givenValue"
                              value={this.state.addNewRule[idx].givenValue}
                              onChange={e => this.handleTextChange(idx, e)}
                              className="form-control"
                            /> </td> :  
                            <td  className='col-4 t-form'>
                            <div className="sele-height">
                              {(this.state.addNewRule[idx].operatorSymbol === 'In' ) ? 
                                <Select className="w-100"
                                  isMulti
                                  onChange={this.onColumnValueChange(idx)}
                                  options={this.state.addNewRule[idx].valueList}
                                  value={this.state.addNewRule[idx].selectedPoolValues}
                                  // value={this.state.addNewRule[idx].givenValue}
                                />
                               :     
                                                         
                                <select
                                  value={this.state.addNewRule[idx].givenValue} 
                                  onChange={ e => this.handleTextChange(idx, e)}                          
                                  name="givenValue"
                                  className="form-control">
                                    <option>Select Column Values</option>
                                    {
                                      this.state.addNewRule[idx].valueList &&
                                      this.state.addNewRule[idx].valueList.map((item, i) => 
                                      (<option key={i} value={this.state.isPoolRuleUpdated ? item.value : JSON.stringify(item)}>{item.label}</option>))
                                  }
                                </select>
                          
                              }
                            </div>
                            </td>
                          }
                          {
                            this.state.addNewRule.length > 1 && 
                            <td className="col-1 text-center">
                              <i onClick={this.handleRemoveSpecificRow(idx)} className="icon-delete m-l-2 fs-16"></i>
                            </td>
                          }
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>  
                </div>
                {!this.state.isPoolRuleUpdated && <div className="col-12 text-right mt-3">
                    <button type="button" className="btn-unic-redbdr" onClick={this.handleAddRuleRow}>Add New Condition</button>
                </div>}
                </ModalBody>
              <ModalFooter>
              <button className="btn-unic" onClick={this.handlePoolRuleConfirmation}>
                Cancel
              </button>
              <button
                className="btn-unic active fs-12"
                onClick={this.addRule}
              >
                Add Rule
              </button>
            </ModalFooter>
          </Modal>

        <Modal isOpen={this.state.isAddPool} size="lg">
          <ModalHeader>Add Pool <button type='button' onClick={() =>this.toggle()} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>
          <ModalBody>
          <div className="row">
              <div className="col-12">
              <h6 className="text-red mb-2">Pool Details</h6>
                </div>
                <div className="col-4">
                <div className="form-group">
                  <label>Pool Name <span className="text-red font-bold" name="bold">*</span></label>
                  <input type="text" value={this.state.poolName}  onChange={this.handleChange} className="form-control" placeholder="" />
                </div>
                <span style={{ color: "red" }}>{this.state.poolError["poolName"]}</span>
                </div>
                <div className="col-4">
                <div className="form-group">
                  <label>Pool Type <span className="text-red font-bold" name="bold">*</span></label>
                  <select value={this.state.poolType} onChange={this.handlePoolType} className="form-control">
                    <option>Select Pool Type</option>
                       { 
                          this.state.poolTypes &&
                          this.state.poolTypes.map((item, i) => 
                          (<option key={i} value={item.value}>{item.label}</option>))
                        }
                  </select>
                </div>
                <span style={{ color: "red" }}>{this.state.poolError["poolType"]}</span>
                </div>
                <div className="col-4 outlet">
                
                    {/* <button type="button" className="btn-unic-redbdr mt-4" onClick={this.handleAddRow}>Add Pool Rule</button> */}
                
                </div>
                <div className="App">
                  {this.Tabs()}
                </div>
           </div>     
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.closePool}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              onClick={this.addPoolDetails}
            >
              Save
            </button>
          </ModalFooter>
        </Modal>
        <div className="row">
          <div className="col-sm-3 col-12">
            <div className="form-group mt-2 mb-3">
            <label>Created By</label>
              <select value={this.state.createdBy}  onChange={this.handleCreatedBy} className="form-control">
                <option>Select Created By</option>
                { 
                  this.state.createdByList &&
                  this.state.createdByList.map((item, i) => 
                  (<option key={i} value={item.createdBy}>{item.createdBy}</option>))
                }
                
              </select>
            </div>
          </div>
          <div className="col-sm-3 col-12">
            <div className="form-group mt-2 mb-3">
            <label>Pool Type</label>
              <select value={this.state.poolType} onChange={this.handlePoolType} className="form-control">
                <option>Select Pool Type</option>
                { 
                  this.state.poolTypes &&
                  this.state.poolTypes.map((item, i) => 
                  (<option key={i} value={item.value}>{item.label}</option>))
                }
              </select>
            </div>
          </div>
          <div className="col-sm-4 col-12 pt-4 scaling-center scaling-mb">
            <button className="btn-unic-search active m-r-2 mt-2" onClick={this.searchPool}>Search</button>
            <button className="btn-clear m-r-2 mt-2" onClick={this.clearPool}>Clear</button>
            <button className={this.state.addPoolPrivilege?.isEnabeld ? "btn-unic-redbdr mt-2 active" : "btn-unic-redbdr mt-2 btn-disable"} disabled={!this.state.addPoolPrivilege?.isEnabeld} onClick={this.addPool}><i className='icon-sale'></i> Add Pool</button>
          </div>
          {/* <div className="col-sm-3 col-12 text-right pt-4 scaling-center scaling-mb">
            <button className="btn-unic-search active m-r-2 mt-2" onClick={this.searchPool}>SEARCH</button>
            <button className="btn-unic-redbdr mt-2" onClick={this.addPool}>Add Pool</button>
          </div> */}
        </div>
        <div className="row m-0 p-0 scaling-center">
          <h5 className="mt-1 mb-2 fs-18 p-l-0">List Of Pools</h5>
          <DisplayPools 
              listOfPools={this.state.currentPools}
              handleRemovePool={this.handleRemovePool}
              modifyPool={this.modifyPool}
              viewPoolPrivilege = {this.state.viewPoolPrivilege}
          />
    </div>
  </div>
    )
  }
}