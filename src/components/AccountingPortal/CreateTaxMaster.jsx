import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import close from '../../assets/images/cross.svg';
import PrivilegesList from '../../commonUtils/PrivilegesList';
import AccountingPortalService from '../../services/AccountingPortal/AccountingPortalService';
import confirm from '../../assets/images/conformation.svg';
export default class CreateTaxMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTaxMaster: false,
      cess: "",
      cgst: "",
      igst: "",
      sgst: "",
      taxLabel: "",
      storeName: "",
      userName: "",
      userId: "",
      storeId: "",
      taxList:[],
      isTaxMasterEdited: false,
      selectedTaxMaster: '', 
      isDeleteTaxMaster: false
    };

    this.addTaxMaster = this.addTaxMaster.bind(this);
    this.saveTaxMaster = this.saveTaxMaster.bind(this);
    this.closeTaxMaster = this.closeTaxMaster.bind(this);
    this.editTaxMaster = this.editTaxMaster.bind(this);
    this.handleDeleteTaxMaster = this.handleDeleteTaxMaster.bind(this);
  }


  addTaxMaster() {
    this.setState({ isTaxMaster: true });
  }

  closeTaxMaster() {
    this.setState({ 
    isTaxMaster: false, 
    isDeleteTaxMaster: false, 
    cess: "",
    cgst: "",
    igst: "",
    sgst: "",
    taxLabel: ""
  });
  }
  saveTaxMaster(){
    let obj = {
      "cess": this.state.cess,
      "cgst": this.state.cgst,
      "igst": this.state.igst,
      "sgst": this.state.sgst,
      "taxLabel":  this.state.taxLabel
      // "customerName": this.state.customerData?.userName,
      // "mobileNumber": this.state.mobileNumber,
      // "storeId": this.state.storeId
    };
    if(!this.state.isTaxMasterEdited) {
      AccountingPortalService.saveMasterTax(obj).then(response => {        
        if (response.status == 200) {
          toast.success('Tax Master added successfully');
          this.getTaxDataList();
          this.closeTaxMaster();
        }
      });
    } else {
      obj = {...obj, id: this.state.selectedTaxMaster.id};
      AccountingPortalService.updateMasterTax(obj).then(response => {
        if (response.data.isSuccess === 'true') {
          toast.success(response.data.message);
          this.setState({
           selectedTaxMaster: '',
           isTaxMasterEdited: false,
           isTaxMaster: false,
           cess: "",
            cgst: "",
            igst: "",
            sgst: "",
            taxLabel: ""
          }, () => this.getTaxDataList());
        } else {
          toast.warn(response.data.message);
        }
      });
    }
  }
  componentWillMount() {
    const childPrivileges =PrivilegesList('Create Tax Master');
    childPrivileges.then((res) => {
      if(res) {
        const result = res.sort((a , b) => a.id - b.id);
        this.setState({
          addTaxMaster: result[0],  
        });
      }
    });
    const user = JSON.parse(sessionStorage.getItem('user'));
    const selectedStore = JSON.parse(sessionStorage.getItem('selectedstoreData'));
    this.setState({ storeName: selectedStore.storeName, storeId: selectedStore.storeId, userName: user["cognito:username"], userId: user["custom:userId"] });
     this.getTaxDataList();
  }
  getTaxDataList(){
    AccountingPortalService.getAllMasterTax().then(response => {
      if (response) {
        this.setState({ taxList: response.data.result });
      }
    });
  }
  editTaxMaster(items) {
    this.setState({ 
      isTaxMaster: true,
      isTaxMasterEdited: true,
      taxLabel: items.taxLabel,
      cgst: items.cgst,
      sgst: items.sgst,
      igst: items.igst,
      cess: items.cess,
      selectedTaxMaster: items
    });
  }
  deleteTaxMaster = (items) => {
    this.setState({
      isDeleteTaxMaster: true,
      selectedTaxMaster: items
    });
  }
  handleDeleteTaxMaster() {
    const { selectedTaxMaster } = this.state;
    AccountingPortalService.deleteTaxMaster(selectedTaxMaster.id).then(response => {
      if (response.data.isSuccess === 'true') {
        toast.success(response.data.message);
        this.setState({
         selectedTaxMaster: '',
         isDeleteTaxMaster: false
        }, () => this.getTaxDataList());
      }
    });
  }
  render() {
    return (
      <div className="maincontent">
        <Modal isOpen={this.state.isTaxMaster} size="md">
          <ModalHeader>Add Tax Master <button type='button' onClick={() =>this.closeTaxMaster()} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>
          <ModalBody>
          <div className="row">
                <div className="col-6">
                <div className="form-group">
                  <label>TAX Rate %</label>
                  <input type="text" className="form-control" placeholder="%" value={this.state.taxLabel}
                    onChange={(e) => {
                      this.setState({
                        taxLabel: e.target.value,

                      });
                    }}
                  
                  />
                </div>
                </div>
                <div className="col-6">
                <div className="form-group">
                  <label>CGST %</label>
                  <input type="text" className="form-control" placeholder="0" value={this.state.cgst} 
                    onChange={(e) => {
                      this.setState({
                        cgst: e.target.value,

                      });
                    }}
                  />
                </div>
                </div>
                <div className="col-6 mt-3">
                <div className="form-group">
                  <label>SGST %</label>
                  <input type="text" className="form-control" placeholder="%" value={this.state.sgst} 
                    onChange={(e) => {
                      this.setState({
                        sgst: e.target.value,

                      });
                    }}
                  />
                </div>
                </div>
                <div className="col-6 mt-3">
                <div className="form-group">
                  <label>IGST %</label>
                  <input type="text" className="form-control" placeholder="%"  value={this.state.igst}
                    onChange={(e) => {
                      this.setState({
                        igst: e.target.value,

                      });
                    }}
                  />
                </div>
                </div>
                <div className="col-6 mt-3">
                <div className="form-group">
                  <label>CESS %</label>
                  <input type="text" className="form-control" placeholder="%" value={this.state.cess} 
                    onChange={(e) => {
                      this.setState({
                        cess: e.target.value,

                      });
                    }}
                  />
                </div>
                </div>
                {/* <div className="col-6 mt-3">
                <div className="form-group">
                  <label>Priority</label>
                      <select className="form-control">
                          <option>Select Priority</option>
                      </select>
                </div>
                </div> */}
         
                </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.closeTaxMaster}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              onClick={this.saveTaxMaster}
            >
              Save
            </button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.isDeleteTaxMaster} size="md">
          <ModalHeader>Delete Tax Master</ModalHeader>
          <ModalBody>
            <div className="maincontent p-0">
              <h6>Are you sure want to delete tax master?</h6>        
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.closeTaxMaster}>
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              onClick={this.handleDeleteTaxMaster}
            >
              Delete
            </button>
          </ModalFooter>
        </Modal>
        <div className="row">
          <div className="col-sm-5 col-6 mt-2">
            <h5 className="mt-1 mb-2 fs-18 p-l-0 mt-3">List Of Taxes</h5>
          </div>
          <div className="col-sm-7 col-6 scaling-mb text-right">
            <button className={this.state.addTaxMaster?.isEnabeld ? "btn-unic-search active mt-3 m-r-2" : "btn-unic-search btn-disable mt-1 m-r-2"} 
                   disabled={!this.state.addTaxMaster?.isEnabeld}
                   onClick={this.addTaxMaster}><i className='icon-credit_notes'></i> Add Tax Master</button>
          </div>
        </div>
        <div className="table-responsive">
        <table className="table table-borderless mb-1 mt-2">
          <thead>
            <tr className="m-0 p-0">
              <th className="col-2">Tax Label</th>
              <th className="col-2">CGST</th>
              <th className="col-1">SGST</th>
              <th className="col-1">IGST</th>
              <th className="col-2">CESS</th>
              {/* <th className="col-2">Priority</th> */}
              <th className="col-2"></th>
            </tr>
          </thead>
          <tbody>
          {this.state.taxList.length > 0 &&<div>  {this.state.taxList.map((items, index) => {
                  return (
            <tr>
              <td className="col-2">{items.taxLabel}</td>
              <td className="col-2">{items.cgst}</td>
              <td className="col-1">{items.sgst}</td>
              <td className="col-1">{items.igst}</td>
              <td className="col-2">{items.cess}</td>
              {/* <td className="col-2"><button className="btn-active">Default</button></td> */}
              <td className="col-2 text-center">
                {/* <img src={edit} onClick={() => this.editTaxMaster(items)} className="w-12 pb-2" />
                <i onClick={() => this.deleteTaxMaster(items)} className="icon-delete m-l-2 fs-16"></i> */}
              </td>
            </tr>
            );
          })}
            </div>}
            {this.state.taxList.length === 0  && <div className='no_records'><img src={confirm}></img> <label>No records found</label> </div>}

          </tbody>
        </table>
        </div>

      </div>
    )
  }
}
