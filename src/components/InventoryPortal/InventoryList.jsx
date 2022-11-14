import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import InventoryService from '../../services/InventoryService';
import { ToastContainer, toast } from 'react-toastify';


export default class InventoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddInventory: false,
      barcodeId: "",
      stockValue: 0,
      fromDate: "",
      toDate: "",
      productItemId: "",
      inventoriesList: [],
      domainDetails: {},
      disableSavebtn: true,
      totalListPrice: 0,
      totalStock: 0,
      selectedStoreId: ""

    }
    this.addInventory = this.addInventory.bind(this);
    this.closeInventory = this.closeInventory.bind(this);
    this.saveInventory = this.saveInventory.bind(this);
    this.getAllInventories = this.getAllInventories.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  addInventory() {
    this.setState({ isAddInventory: true, disableSavebtn: true });
  }

  closeInventory() {
    this.setState({ isAddInventory: false });
    this.resetState();
  }

  componentWillMount() {
    this.state.domainDetails = JSON.parse(sessionStorage.getItem('selectedDomain'));
    this.setState({selectedStoreId:JSON.parse(sessionStorage.getItem('storeId'))});
    this.setState({ domainDetails: this.state.domainDetails })
    this.getAllInventories();
  }


  getAllInventories() {
    const saveJson = {
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      productItemId: this.state.productItemId
    }
    InventoryService.getAllInventories(saveJson).then((res) => {
      if (res.data && res.data.isSuccess === "true") {
        this.state.inventoriesList = res.data.result;
        this.setState({ inventoriesList: this.state.inventoriesList });
        this.calculateTotalAmount();
      } else {
        this.setState({ inventoriesList: [] })
      }
    }).catch(error => {
      if (error.response.data && error.response.data.isSuccess === "false") {
        this.setState({ inventoriesList: [] });
        this.calculateTotalAmount();
      }
    });
  }


  calculateTotalAmount() {
    let stock = 0;
    let totalPrice = 0;
    if (this.state.inventoriesList && this.state.inventoriesList.length > 0) {
      this.state.inventoriesList.forEach((element) => {
        stock = stock + element.stockValue;
        this.setState({ totalStock: stock });
        totalPrice = totalPrice + element.listPrice;
        this.setState({ totalListPrice: totalPrice });
      });
    } else {
      this.setState({ totalStock: 0 });
      this.setState({ totalListPrice: 0 });
    }

  }

  saveInventory() {
    const saveJson = {
      barcodeId: this.state.barcodeId,
      stockValue: this.state.stockValue
    }
    InventoryService.updateInventoryList(saveJson).then((res) => {
      if (res.data && res.data.isSuccess === "true") {
        toast.success(res.data.result);
        this.resetState();
        this.setState({ isAddInventory: false });
        this.state.barcodeId = "";
        this.state.stockValue = 0;
        this.props.history.push('/inventoryList');
        this.getAllInventories();
      } else {
        toast.error(res.data.message);
      }
    });
  }

  resetState() {
    this.setState({ barcodeId: "", stockValue: "" });
  }


  searchInventory() {
    const saveJson = {
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      productItemId: this.state.productItemId
    }
    InventoryService.searchForInventory(saveJson).then((res) => {
      if (res.data && res.data.isSuccess === "true") {
        this.setState({ inventoriesList: res.data.result })
        // this.state.inventoriesList = res.data.result;
      } else {
        toast.info(res.data.message);
        this.setState({ inventoriesList: [] })

      }
    });
  }

  getbarcodeDetails = (e) => {
    if (e.key === "Enter") {
      InventoryService.getBarcodeDetails(this.state.barcodeId, this.state.domainDetails,this.state.selectedStoreId).then((res) => {
        const barcode = res.data.result;
        if (res && res.data.isSuccess === "true") {
          this.setState({ stockValue: barcode.stockValue });
          this.setState({ disableSavebtn: false });
        } else {
          toast.error(res.data.message);
          this.setState({ disableSavebtn: true });
        }
      });
    }
  }

  invoicesListTable() {
    return this.state.inventoriesList.map((items, index) => {
      const { productItemId, barcodeId, costPrice, stockValue, uom, listPrice, discontinued } = items
      return (
        <tr key={index}>
          <td className="col-1 underline geeks">{productItemId}</td>
          <td className="col-1">{barcodeId}</td>
          <td className="col-2"></td>
          <td className="col-2">₹{costPrice} </td>
          <td className="col-1">{stockValue}</td>
          <td className="col-1">{uom}</td>
          <td className="col-2">₹{listPrice}</td>
          <td className="col-2">{discontinued}</td>
        </tr>

      )
    });
  }

  render() {
    return (
      <div className="maincontent">
        <Modal isOpen={this.state.isAddInventory} size="lg">
          <ModalHeader><h5>Add Inventory</h5></ModalHeader>
          <ModalBody>
            <div className="row p-3">
              <div className="col-12">
                <h6 className="text-red mb-3 scaling-center scaling-mb">Inventory Details</h6>
              </div>
              <div className="col-sm-4 col-12 mt-3">
                <div className="form-group">
                  <label>Barcode</label>
                  <input type="text" className="form-control" placeholder="" value={this.state.barcodeId}
                    onChange={(e) => this.setState({ barcodeId: e.target.value })} onKeyPress={this.getbarcodeDetails} />
                </div>
              </div>
           
              <div className="col-sm-4 col-12 mt-3">
                <div className="form-group">
                  <label>In Stock</label>
                  <input type="number" className="form-control" placeholder="" value={this.state.stockValue}
                    onChange={(e) =>
                      this.setState({ stockValue: e.target.value })} />
                </div>
              </div>

             

            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.closeInventory}>
              Cancel
            </button>
            <button
              className="btn-unic active"
              disabled={this.state.disableSavebtn && !this.state.stockValue}
              onClick={this.saveInventory}
            >
              Save
            </button>
          </ModalFooter>
        </Modal>
        <div className="row">
          <div className="col-sm-3 col-12">
            <div className="form-group mt-2 mb-3">
            <label>From Date</label>
              <input type="date" className="form-control"
                placeholder="FROM DATE" value={this.state.fromDate}
                onChange={(e) => this.setState({ fromDate: e.target.value })} />
            </div>
          </div>
          <div className="col-sm-3 col-12">
            <div className="form-group mt-2 mb-3">
            <label>To Date</label>
              <input type="date" className="form-control"
                placeholder="TO DATE" value={this.state.toDate}
                onChange={(e) => this.setState({ toDate: e.target.value })} />
            </div>
          </div>
          <div className="col-sm-3 col-12">
            <div className="form-group mt-2 mb-3">
            <label>Inventory ID</label>
              <input type="text" className="form-control"
                placeholder="INVENTORY ID" value={this.state.productItemId}
                onChange={(e) => this.setState({ productItemId: e.target.value })} />
            </div>
          </div>
          <div className="col-sm-3 col-12 mb-3 mt-3 pt-2 scaling-center">
            <button className="btn-unic-search active m-r-2 mt-2" onClick={this.getAllInventories}>SEARCH</button>
            <button className="btn-unic-redbdr mt-2" onClick={this.addInventory}>Add Inventory</button>
          </div>
        </div>
        <div className="row m-0 p-0 scaling-center">
          <h5 className="mt-1 mb-2 fs-18 p-l-0 scaling-mb">Inventory Details</h5>
          <div className="table-responsive p-0">
            <table className="table table-borderless mb-1 mt-2">
              <thead>
                <tr className="m-0 p-0">
                  <th className="col-1"># INV-ID</th>
                  <th className="col-1">BARCODE</th>
                  <th className="col-2">DESCRIPTION</th>
                  <th className="col-2">UNIT PRICE</th>
                  <th className="col-1">IN STOCK</th>
                  <th className="col-1">UOM</th>
                  <th className="col-2">VALUE</th>
                  <th className="col-2">DISCONTINUED</th>
                </tr>
              </thead>
              <tbody>
                {this.invoicesListTable()}
              </tbody>
            </table>
          </div>
          <div className="rect-cardred m-0 mb-4">
            <div className="row">
              <div className="col-sm-6 col-1 text-center">
              </div>
              <div className="col-sm-1 col-4">
                <label>TOTAL STOCK</label>
                <h6 className="pt-2">{this.state.totalStock}</h6>
              </div>
              <div className="col-1 col-sm-1"></div>
              <div className="col-sm-2 col-5 pt-2 text-left text-red p-r-4">
                <label className="text-red">TOTAL VALUE</label>
                <h6 className="fs-16 text-red ">₹ {this.state.totalListPrice}</h6>
              </div>
              <div className="col-sm-2 col-1"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
