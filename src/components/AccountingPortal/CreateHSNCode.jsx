import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import close from '../../assets/images/cross.svg';
import edit from '../../assets/images/edit.svg';
import PrivilegesList from '../../commonUtils/PrivilegesList';
import AccountingPortalService from '../../services/AccountingPortal/AccountingPortalService';
import confirm from '../../assets/images/conformation.svg';
export default class CreateHSNCode extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isaddHSNCode: false,
      HsnCodeList:[],
      allTaxList:[],
      descrptionList:[],
      taxsAppliesOnList:[],
      hsnCode:"",
      descprition:"",
      taxAppliesOn:"",
      taxId:"",
      priceFrom:"",
      priceTo:"",
      slabBased:"",
      isHSNCodeEdited: false,
      isSlabBased: false,
      addHsnCodePrevilige:'',
      taxAppliedTypes: [
      {label: 'Hsn Code', value: 'Hsncode'},
      {label: 'Price Slab', value: 'Priceslab'}
      ],
      taxAppliedType: '',
      selectedTaxLabel: '',
      slabValues: [],
      isHSNCodeUpdateted: false,
      hsnErrors: {},
      domainTypes: [
        {label: 'Textile', value: 'Textile'}, 
        { label: "Retail", value: 'Retail'}, 
        {label: "Fruits And Vegetables", value: 'FruitsAndVegetables'},
        {label: "Sanitary", value: 'Sanitary'}
      ], 
      domainType: ''
    };

    this.addHSNCode = this.addHSNCode.bind(this);
    this.closeHSNCode = this.closeHSNCode.bind(this);
    this.getDescriptionData = this.getDescriptionData.bind(this);
    this.getTaxAppliesOn = this.getTaxAppliesOn.bind(this);
    this.getAllTaxes = this.getAllTaxes.bind(this);
    this.saveHSNCode = this.saveHSNCode.bind(this);
    this.getAllHsnCodes = this.getAllHsnCodes.bind(this);
    this.handleHsnFormData = this.handleHsnFormData.bind(this);
    this.slabValidation = this.slabValidation.bind(this);
    this.avoidSpace=this.avoidSpace.bind(this);
  }
  componentWillMount() {
    const childPrivileges =PrivilegesList('Create HSN Code');
    childPrivileges.then((res) => {
      if(res) {
        const result = res.sort((a , b) => a.id - b.id);
        this.setState({
            addHsnCodePrevilige: result[0],    

        });
      }
    });     
  this. getAllHsnCodes();
  }

  addHSNCode() {
    this.getDescriptionData();
    this.getTaxAppliesOn();
    this.getAllTaxes();
    this.setState({ isaddHSNCode: true });
  }
  avoidSpace(e) {
    if (e.key === " ") {
        e.preventDefault();
      }
 }

  closeHSNCode() {
    this.setState({ isHSNCodeEdited: false, isaddHSNCode: false, slabValues: [], taxAppliedType: '', hsnCode: '', taxId: '', descprition: '', taxAppliesOn: '', hsnErrors: {} });
  }
  getAllHsnCodes(){
    AccountingPortalService.getAllHsnCodes().then(response => {
      if (response) {
        this.setState({ HsnCodeList: response.data.result });
      }
    }); 
  }
  saveHSNCode(){
    const { hsnCode, descprition, taxAppliesOn, taxAppliedType, slabValues, taxId, selectedHSNCode, hsnErrors, domainType} = this.state;
    let obj = {
      description: descprition,
      hsnCode: hsnCode,
      taxAppliedType: taxAppliedType,
      taxAppliesOn: taxAppliesOn,
      taxId: taxAppliedType === 'Hsncode' ? taxId : null,
      slabs: taxAppliedType === 'Priceslab' ? slabValues : [],
    }
    const slabErrors = this.slabValidation();    
    if(taxAppliedType === 'Priceslab' && slabValues.length === 0) {
      toast.info('Add atleast one slab for the HSN Code');
    } else if (slabErrors.length > 0){
      toast.info('Add slab details');
    } else if(!this.state.isHSNCodeEdited && this.handleHsnFormData()) {
        AccountingPortalService.saveHsnCode(domainType, obj).then(response => {
          if (response) {
          toast.success(response.data.message);
          toast.success("HSN code added sucessfully");
          this.closeHSNCode()
          this.getAllHsnCodes()
          }
        });       
    } else if(this.handleHsnFormData()){
        obj = {...obj, id: selectedHSNCode.id};
        AccountingPortalService.updateHsn(domainType, obj).then(response => {
          if (response) {
            toast.success(response.data.message);
            this.setState({
              selectedHSNCode: '',
              isaddHSNCode: false,
              isHSNCodeEdited: false
            }, () => {this.getAllHsnCodes(); this.closeHSNCode()});      
          } else {
            toast.warn(response.data.message);
          }
        });
      }
  }
  getAllTaxes(){
    AccountingPortalService.getAllMasterTax().then(response => {
      if (response) {        
       const result = response.data.result.map((item) => {
          let obj = {};
          obj.id = item.id;
          obj.label = item.taxLabel;
          return obj;
        });
        this.setState({ allTaxList: result });
      }
    });
  }

  handleRoleChange = (idx, e) => {
    const { allTaxList } = this.state;
    let slabValues = this.state.slabValues;
    slabValues[idx][e.target.name] = e.target.value;  
    this.setState({
      slabValues
    });  
  }
  getDescriptionData(){
    AccountingPortalService.getDescrition().then(response => {
      if (response) {
        this.setState({ descrptionList: response.data.result });
      }
    });
  }
getTaxAppliesOn(){
  AccountingPortalService.getTaxAppliesOn().then(response => {
    if (response) {
      this.setState({ taxsAppliesOnList: response.data.result });
    }
  });
}
handleSelectChangeDesc = (e) => {
  this.state.hsnErrors['descprition'] = '';
   let obj;
  obj = e.target.value;
   this.setState({ descprition: obj });
}

handleSelectChangeTaxList = (e) => {
  this.state.hsnErrors['taxAppliesOn'] = '';
  let obj;
 obj = e.target.value;
  this.setState({ taxAppliesOn: obj });
}
handleSelectChangeAllTax = (e) => {
  this.state.hsnErrors['taxId'] = '';
  this.setState({ taxId: e.target.value });
}
handleSelectDomain= (e) => {
  this.setState({ domainType: e.target.value });
}
editHSNCode = (items) => {
  this.setState({
    selectedHSNCode: items,
    isHSNCodeEdited: true,
    isaddHSNCode: true,
    hsnCode: items.hsnCode,
    slabValues: items.slabs,
    descprition: items.description, 
    taxAppliesOn: items.taxAppliesOn,
    taxAppliedType: items.taxAppliedType,
    domainType: items.domainType,
    taxId: items.taxId,

  }, () => {
    this.getDescriptionData();
  this.getTaxAppliesOn();
  this.getAllTaxes();
  });
}
deleteHSNCode = (items) => {
this.setState({
  isHSNCodeDelete: true,
  selectedHSNCode: items
});
}
handleDeleteHSNCode = () => {
 const { selectedHSNCode } = this.state;
  AccountingPortalService.deleteHsn(selectedHSNCode.id).then(response => {
    if (response.data.isSuccess === 'true') {
        toast.success(response.data.message);
        this.setState({
          isHSNCodeDelete: false,
          selectedHSNCode: ''
        }, () => this.getAllHsnCodes());
    }
  });
}
handleChange(e) {
  if(e.target.checked) {
    this.setState({
      isSlabBased: true
    });
  } else {
    this.setState({
      isSlabBased: false,
      slabValues: []
    });
  }
}

handleRemoveSlab = (idx) =>  {
  const slabValues = [...this.state.slabValues]
  slabValues.splice(idx, 1)
  this.setState({ slabValues }) 
}
handelTaxAppliedType = (e) => {
  this.state.hsnErrors['taxAppliedType'] = '';
  this.setState({ taxAppliedType: e.target.value });
}
handleAddRuleRow = () => { 
  const errors = this.slabValidation();
  if(errors.length == 0) {
    const item = {
      priceFrom: '',
      priceTo: '',
      taxId: ''
    };
    this.setState({
      slabValues: [...this.state.slabValues, item]     
    });
 } else {
   toast.info('Enter slab dtails');
 }  
}
deleteSlab(idx){
  const slabValues = [...this.state.slabValues]
  slabValues.splice(idx, 1)
  this.setState({ slabValues})
}

handleTextChange = (idx, e) => {
  let slabValues = this.state.slabValues;
  slabValues[idx][e.target.name] = e.target.value;
  this.setState({ slabValues });
};
handleHsnFormData() {
  const { hsnCode, descprition, taxAppliedType, taxAppliesOn, taxId} = this.state;
  let error = {};
  let isFormValid = true;
  
  if(!hsnCode || hsnCode.length < 4) {
    error['hsnCode'] = 'Please Enter Atleast  4 Numbers';
    isFormValid = false;
  }
  if(!descprition) {
    error['descprition'] = 'Select Description';
    isFormValid = false;
  }
  if(!taxAppliesOn) {
    error['taxAppliesOn'] = 'Select Tax Applies On';
    isFormValid = false;
  }
  if(!taxAppliedType) {
    error['taxAppliedType'] = 'Select Tax Apply Type';
    isFormValid = false;
  }
  if((taxAppliedType === '' || taxAppliedType === 'Hsncode') && !taxId) {
    error['taxId'] = 'Select Tax';
    isFormValid = false;
  }
  this.setState({
    hsnErrors: error
  }); 

  return isFormValid;
}

slabValidation() {  
  let slabErrorsArray = [];
  const { slabValues } = this.state;
  slabValues.forEach((item, index) => {
    const slabErrors = {}
    if(!item || !item.priceFrom) {
      slabErrors.priceFrom = 'Enter From Price';
      slabErrorsArray[index] = slabErrors;
    }
    if(!item || !item.priceTo) {
     slabErrors.priceTo = 'Enter To Price';
     slabErrorsArray[index] = slabErrors;
    }
    if(!item || !item.taxId) {
      slabErrors.taxId = 'Select Tax';
      slabErrorsArray[index] = slabErrors;
     }
  });
 return slabErrorsArray;
}
  render() {
    const description = this.state.descrptionList;
    let descDataList = description.length > 0
        && description.map((item, i) => {
            return (
                <option key={i} value={item.name}>{item.name}</option>
            )
        }, this);
        // const taxApplyType = this.state.taxApplyTypeList;
        // let taxApplyList = taxApplyType.length > 0
        //     && taxApplyType.map((item, i) => {
        //         return (
        //             <option key={i} value={item.name}>{item.name}</option>
        //         )
        //     }, this);
        const taxApplies = this.state.taxsAppliesOnList;
        let taxAppliesList = taxApplies.length > 0
            && taxApplies.map((items, k) => {
                return (
                   
                    <option key={k} value={items.name}>{items.name}</option>
                )
            }, this);
            const allTaxApplies = this.state.allTaxList;
            let allTaxList = allTaxApplies.length > 0
                && allTaxApplies.map((items, k) => {
                    return (
                       
                        <option key={k} value={items}>{items.taxLabel}</option>
                    )
                }, this);
    return (
      <div className="maincontent">
        <Modal isOpen={this.state.isHSNCodeDelete} size="md">
          <ModalHeader>Delete HSN Code</ModalHeader>
          <ModalBody>
            <div className="maincontent p-0">
              <h6>Are you sure want to delete HSN code?</h6>        
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.closeHSNCode}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              onClick={this.handleDeleteHSNCode}
            >
              Delete
            </button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.isaddHSNCode} size="lg">
        {!this.state.isHSNCodeEdited && <ModalHeader>Add HSN Code <button type='button' onClick={() =>this.closeHSNCode()} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>}
        {this.state.isHSNCodeEdited && <ModalHeader>Edit HSN Code <button type='button' onClick={() =>this.closeHSNCode()} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>}
          <ModalBody>
          <div className="row">
              <div className="col-12">
              {/* <h6 className="text-red mb-2 fs-14">HSN information</h6> */}
                </div>
                <div className="col-4">
                <div className="form-group">
                  <label>HSN Code <span className="text-red font-bold" name="bold">*</span></label>
                  <input type="text" pattern="^[0-9]*$" className="form-control" placeholder="" value={this.state.hsnCode}
                  disabled ={this.state.isHSNCodeEdited}
                  maxLength = "6"
                    onChange={(e) => {
                      this.state.hsnErrors['hsnCode'] = '';
                      this.setState({
                        hsnCode: e.target.value.replace(/[^\0-9]/ig, ""),
                        // function numericFilter(txb) {
                        //   txb.value = txb.value.replace(/[^\0-9]/ig, "");
                      // }

                      });
                    }} 
                    onKeyDown={this.avoidSpace}/>
                        <span style={{ color: "red" }}>{this.state.hsnErrors["hsnCode"]}</span>
                </div>
            
                </div>
                <div className="col-4">
                <div className="form-group">
                  <label>Description <span className="text-red font-bold" name="bold">*</span></label>
                  <select value={this.state.descprition} disabled ={this.state.isHSNCodeEdited} className="form-control" onChange={this.handleSelectChangeDesc}>
                  <option value="" disabled>Select Description</option>
                   {descDataList}
                  </select >
                  <span style={{ color: "red" }}>{this.state.hsnErrors["descprition"]}</span>
                </div>
                
                </div>
                <div className="col-4">
                <div className="form-group">
                  <label>Tax Applies ON <span className="text-red font-bold" name="bold">*</span></label>                
                  <select value={this.state.taxAppliesOn} disabled ={this.state.isHSNCodeEdited} className="form-control" onChange={this.handleSelectChangeTaxList}>
                  <option value="" disabled>Select Tax Applies ON</option>
                    {taxAppliesList}
                  </select >   
                  <span style={{ color: "red" }}>{this.state.hsnErrors["taxAppliesOn"]}</span>             
                </div>
                
                </div>
                <div className="col-4 mt-3">
                <div className="form-group">
                    <label>Tax Apply Type <span className="text-red font-bold" name="bold">*</span></label>
                    <select value={this.state.taxAppliedType} disabled ={this.state.isHSNCodeEdited} onChange={(e) => this.handelTaxAppliedType(e)} className="form-control">
                      <option>Select Tax Apply Type</option>
                      {/* {taxApplyList} */}
                        { 
                            this.state.taxAppliedTypes &&
                            this.state.taxAppliedTypes.map((item, i) => 
                            (<option key={i} value={item.value}>{item.label}</option>))
                          }
                    </select>
                    <span style={{ color: "red" }}>{this.state.hsnErrors["taxAppliedType"]}</span>
                </div>
                
                </div>             
                {(this.state.taxAppliedType  === '' || this.state.taxAppliedType  === 'Hsncode') && <div className="col-4 mt-3">
                <div className="form-group">
                  <label> Label <span className="text-red font-bold" name="bold">*</span></label>
                  <select value={this.state.taxId} disabled ={this.state.isHSNCodeEdited} onChange={(e) => this.handleSelectChangeAllTax(e)} className="form-control">
                      <option>Select Tax Label</option>
                        { 
                            this.state.allTaxList &&
                            this.state.allTaxList.map((item, i) => 
                            (<option key={i} value={item.id}>{item.label}</option>))
                          }
                    </select>
                  {/* <Select
                    onChange={this.handleSelectChangeAllTax}
                    options={this.state.allTaxList}
                    value={this.state.selectedTaxLabel}
                  /> */}
                  <span style={{ color: "red" }}>{this.state.hsnErrors["taxId"]}</span>
                </div>
                
                </div>}
                <div className="col-4 mt-3">
                <div className="form-group"> 
                <label> Domain <span className="text-red font-bold" name="bold">*</span></label>
                  <select value={this.state.domainType} onChange={(e) => this.handleSelectDomain(e)} disabled={this.state.isHSNCodeEdited} className="form-control">
                      <option>Select Domain</option>
                        { 
                            this.state.domainTypes &&
                            this.state.domainTypes.map((item, i) => 
                            (<option key={i} value={item.value}>{item.label}</option>))
                          }
                    </select>                
                </div>
                </div>
                <div className="col-3 mt-3">
                <div className="form-group">                 
                </div>
                </div>
                </div>
                
               {this.state.taxAppliedType  === 'Priceslab' && <div className="col-12 mt-3">
                  <table className="table table-borderless mb-1 mt-2">
                    <thead>
                      <tr className="m-0 p-0">
                        <th className="col-3 text-center">Price From</th>
                        <th className="col-3 text-center">Price To</th>
                        <th className="col-3 text-center">Tax</th>
                        <th className="col-1"></th>
                      </tr>
                    </thead>
                </table>
                <table className="table-borderless V1_table gfg mb-0 w-100">
                  <tbody>
                      {this.state.slabValues.map((item, idx) => (
                        
                        <tr id="addr0" key={idx}>
                          <td className='col-3 t-form'>
                            <input
                              type="text"
                              name="priceFrom"
                              value={this.state.slabValues[idx].priceFrom}
                              onChange={e => this.handleTextChange(idx, e)}
                              className="form-control"
                            />
                          </td>
                          <td className='col-3 t-form'>
                            <input
                                type="text"
                                name="priceTo"
                                value={this.state.slabValues[idx].priceTo}
                                onChange={e => this.handleTextChange(idx, e)}
                                className="form-control"
                              />
                          </td>  
                            <td  className='col-3 t-form'>
                            <div className="sele-height">                              
                                <select
                                  value={this.state.slabValues[idx].taxId} 
                                  onChange={ e => this.handleRoleChange(idx, e)}                          
                                  name="taxId"
                                  className="form-control">
                                    <option>Select Tax Label</option>
                                    {
                                      this.state.allTaxList &&
                                      this.state.allTaxList.map((item, i) => 
                                      (<option key={i} value={item.id}>{item.label}</option>))
                                    }
                                </select>
                            </div>
                            </td>
                          {
                            this.state.slabValues.length > 1 && 
                            <td className="col-1 text-center">
                              <i onClick={() => this.deleteSlab(idx)} className="icon-delete m-l-2 fs-16"></i>
                            </td>
                          }                        
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="col-12 text-right mt-3">
                    <button type="button" className="btn-unic-redbdr" onClick={this.handleAddRuleRow}>Add Slab</button>
                </div>  
                </div> }
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.closeHSNCode}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              onClick={this.saveHSNCode}
            >
              Save
            </button>
          </ModalFooter>
        </Modal>
        <div className="row scaling-mb">
          <div className="col-sm-5 col-6 mt-2">
            <h5 className="mt-1 mb-2 fs-18 p-l-0 mt-3">List Of HSN Codes</h5>
          </div>
          <div className="col-sm-7 col-6 text-right">
            <button className={this.state.addHsnCodePrevilige?.isEnabeld ? "btn-unic-search active mt-3 m-r-2" : "btn-unic-search btn-disable mt-1 m-r-2"}
             disabled={!this.state.addHsnCodePrevilige?.isEnabeld}
             onClick={this.addHSNCode}>
                <i className='icon-credit_notes'></i> Add HSN Code</button>
          </div>
        </div>
        <div className="table-responsive">
        <table className="table table-borderless mb-1 mt-2">
          <thead>
            <tr className="m-0 p-0">
              <th className="col-3">HSN Code </th>
              <th className="col-3">GOODS/SERVICES</th>
              <th className="col-2">Tax Applicable</th>
              <th className="col-2">Slab</th>
              <th className="col-1">EMP Name</th>
              <th className="col-2"></th>
            </tr>
          </thead>
          <tbody>
         {this.state.HsnCodeList.length > 0 &&<div> {this.state.HsnCodeList.map((items, index) => {
                  return (
            <tr>
              <td className="col-3">{items.hsnCode}</td>
              <td className="col-3">{items.description}</td>
              <td className="col-2">{items.taxAppliesOn}</td>
              <td className="col-2">{items.taxAppliedType === 'Priceslab' ? 'Yes' : 'No'}</td>
              <td className="col-1">{items.empName}</td>
              <td className="col-2 text-center">       
                  <img src={edit} onClick={() => this.editHSNCode(items)} className="w-12 pb-2" />
                {/* <i onClick={() => this.deleteHSNCode(items)}className="icon-delete m-l-2 fs-16"></i> */}
              </td>
            </tr>
                        );
                      })}
                      </div>}
                       {this.state.HsnCodeList.length === 0  && <div className='no_records'><img src={confirm}></img> <label>No records found</label> </div>}

          </tbody>
        </table>
        </div>

      </div>
    )
  }
}
