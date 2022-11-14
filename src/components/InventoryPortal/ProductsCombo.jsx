import React, { Component } from 'react';
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import close from '../../assets/images/cross.svg';
import scan from '../../assets/images/scan.svg';
import view from "../../assets/images/view.svg";
import confirm from '../../assets/images/conformation.svg';
import PrintBarcode from '../../commonUtils/checkPrinter';
import ReactPageNation from "../../commonUtils/Pagination";
import PrivilegesList from '../../commonUtils/PrivilegesList';
import InventoryService from '../../services/InventoryService';
// import { error } from  "error";

export default class ProductsCombo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddCombo: false,
      comboName: '',
      comboQuantity: '',
      id: '',
      qunatity: 1,
      dsNumber: '',
      domainDetails: {},
      selectedStoreId: '',
      errors: {},
      barList: [],
      listOfProducts: [],
      comboDescription: '',
      selectedDomainId: '',
      listOfProductBundle: [],
      commonFieldsErr: false,
      isEdit: false,
      deletFlag: true,
      fromDate: '',
      toDate: '',
      comboPrice: '',
      selectedProductCombo: '',
      pageNumber: 0,
      totalPages: 0,
      createproductcombo: '',
      editproductcombo: '',
      deleteproductcombo: '',
      viewproducts: ''
    }
    this.addCombo = this.addCombo.bind(this);
    this.closeCombo = this.closeCombo.bind(this);
    this.getBarcodeDetails = this.getBarcodeDetails.bind(this);
    this.saveProductBundle = this.saveProductBundle.bind(this);
    this.preventMinus = this.preventMinus.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.getProductBundleList = this.getProductBundleList.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changePage = this.changePage.bind(this);
  }
  componentWillMount() {
    const childPrivileges = PrivilegesList('Product Combo');
    childPrivileges.then((res) => {
      if (res) {
        console.log(res);
        const result = res.sort((a, b) => a.id - b.id);
        this.setState({
          createproductcombo: result[0],
          editproductcombo: result[1],
          deleteproductcombo: result[2],
          viewproducts: result[3]
        });

      }
    });
    const selectedDomain = JSON.parse(sessionStorage.getItem('selectedDomain'));
    if (this.state.isEdit) {
      this.setState({ deletFlag: false })
    }
    let domainId;
    // if(selectedDomain.label === 'Textile') {
    //   domainId = 1;
    // } else {
    //   domainId = 2;
    // }
    this.setState({
      domainDetails: JSON.parse(sessionStorage.getItem('selectedDomain')),
      selectedStoreId: JSON.parse(sessionStorage.getItem('storeId')),
      selectedDomainId: domainId

    }, () => this.getProductBundleList(this.state.selectedStoreId, 0));
    // this.loadErrorMsgs();

  }
  addCombo() {
    this.setState({ isAddCombo: true, isEdit: false });
    this.setState({
      comboQuantity: "",
      comboName: "", comboPrice: "", dsNumber: "",
    })

  }
  closeCombo() {
    this.setState({ isAddCombo: false, isEdit: false, listOfProducts: [], barList: [] });
    this.setState({
      comboQuantity: "",
      comboName: "", comboPrice: "", dsNumber: ""
    })

  }
  clear = () => {
    this.setState({
      ProductsCombo: [],
      fromDate: '',
      toDate: '',
    }, () => this.searchCombo(0));
  }

  getBarcodeDetails() {
    // let j = 0
    const { selectedStoreId, domainDetails, dsNumber } = this.state;
    InventoryService.getBarcodeDetails(dsNumber, domainDetails, selectedStoreId).then((res) => {

      if (res) {
        const { barcode, name, itemMrp, id } = res.data;
        const obj = { barcode, name, itemMrp, id, qty: 1 };
        if (res.data) {
          res.data.quantity = 1
          let count = false;
          if (this.state.listOfProducts.length === 0) {
            this.state.listOfProducts.push(res.data);
            //  this.state.listOfProducts[0].quantity=1;
          } else {
            for (let i = 0; i < this.state.listOfProducts.length; i++) {
              if (this.state.listOfProducts[i].barcode === res.data.barcode) {
                count = true
                var items = [...this.state.listOfProducts];
                if (items[i].quantity < items[i].qty) {
                  items[i].quantity = items[i].quantity + 1;
                  break;
                }
                else {
                  toast.info("Insufficient quntity");
                  break
                }

              }
            }
            if (count === false) {
              this.state.listOfProducts.push(res.data);
            }

            //   console.log("++++++++++++++++++"+"sucess")
            //   // this.setState({
            //   //   listOfProducts: [...this.state.listOfProducts, obj ]
            //   // });
            //   this.state.listOfProducts.push(res.data);



            //if(!count){
            //this.state.listOfProducts.push(res.data);
            //   console.log("++++++++++++++++++"+"sucess")
            //   // this.setState({
            //   //   listOfProducts: [...this.state.listOfProducts, obj ]
            //   // });
            //   this.state.listOfProducts.push(res.data);
            // 

          } this.setState({ listOfProducts: this.state.listOfProducts, dsNumber: '' }, () => {
            this.state.listOfProducts.forEach((element) => {
              if (element.quantity > 1) {
              } else {
                element.quantity = parseInt("1");
              }

            });
          });

        }
      }



    });
  }



  getProductBundleList(selectedStoreId, pageNumber) {
    InventoryService.getAllProductBundleList('', '', selectedStoreId, pageNumber).then((res) => {
      if (res) {
        this.setState({
          listOfProductBundle: res.data.result.content,
        });
      }
    });
  }

  saveProductBundle() {
    const { listOfProducts, barList, isEdit, comboName, comboQuantity, comboDescription, selectedDomainId, selectedStoreId, comboPrice, selectedProductCombo } = this.state;
    if (isEdit) {
      console.log('++++++++selectedProductCombo++++++++', selectedProductCombo);
      const updatedProductTextiles = selectedProductCombo.productTextiles.map((itm) => {
        const obj = {};
        obj.id = itm.id;
        obj.barcode = itm.barcode;
        obj.qty = itm.qty;
        obj.itemMrp = itm.itemMrp;
        return obj;
      });
      const updatedObjReq = {
        id: selectedProductCombo.id,
        bundleQuantity: selectedProductCombo.bundleQuantity,
        storeId: selectedProductCombo.storeId,
        description: selectedProductCombo.description,
        // domainId: selectedDomainId,
        name: selectedProductCombo.name,
        isEdit: true,
        productTextiles: updatedProductTextiles,
        itemMrp: selectedProductCombo.itemMrp
      }
      InventoryService.getProductBundleUpdate(updatedObjReq).then((res) => {
        if (res && res.data.isSuccess === "true") {
          toast.success(res.data.message);
          this.setState({
            isAddCombo: false,
            listOfProducts: [],
            comboName: '',
            comboQuantity: '',
            comboDescription: '',
            isEdit: false,
            comboPrice: '',
            selectedStoreId: selectedStoreId
          }, () => this.getProductBundleList(selectedStoreId, 0));
        }

      });

    } else {
      const comboProductList = listOfProducts.map((itm) => {
        const obj = {};
        obj.id = itm.id;
        obj.barcode = itm.barcode;
        obj.qty = itm.quantity;
        obj.itemMrp = itm.itemMrp;
        return obj;
      });

      const requestObj = {
        bundleQuantity: comboQuantity,
        storeId: selectedStoreId,
        description: comboDescription,
        domainId: selectedDomainId,
        name: comboName,
        isEdit: false,
        productTextiles: comboProductList,
        itemMrp: comboPrice
      }



      if (this.handleValidation()) {
        if (listOfProducts.length > 0) {
          InventoryService.addProductDundle(requestObj).then((res) => {
            if (res?.data) {
              // PrintBarcode('PRODUCTCOMBO', res.data)
              toast.success(res.data.message);
              this.setState({
                isAddCombo: false,
                listOfProducts: [],
                comboName: '',
                comboQuantity: '',
                comboDescription: '',
                isEdit: false,
                comboPrice: '',
                selectedStoreId: selectedStoreId
              }, () => this.getProductBundleList(selectedStoreId, 0));
            } else {
              toast.success(res.data.message);
            }
          });
        } else {
          toast.info("Please Add Atleast One Product");
        }
      }
    }
  }

  handleChange() {
    const comboQuantity = (Event.target.validity.valid) ?
      Event.target.value : this.state.comboQuantity;
  }


  // loadErrorMsgs() {
  //   this.state.error["comboName"] = "Please Enter Combo Name";
  //   this.state.error["ComboQuantity"] = "Please Enter Quantity";

  //   this.setState({ error: this.state.error});
  // }
  handleValidation() {
    let errors = {};
    let formIsValid = true;

    // combo name
    if (!this.state.comboName) {
      formIsValid = false;
      errors["comboName"] = 'Enter Combo Name';
    }
    if (!this.state.comboPrice) {
      formIsValid = false;
      errors["comboPrice"] = 'Enter Combo Price';
    }
    //combo quantity
    if (!this.state.comboQuantity) {
      formIsValid = false;
      errors["comboQuantity"] = 'Please Enter Quantity';
    }
    if (!this.state.listOfProducts) {
      formIsValid = false;
      errors["listOfProducts"] = 'Please Add Atleast One Product';
    }
    this.setState({ errors: errors });
    return formIsValid;
  }


  handleComboName = (e) => {
    this.state.errors["comboName"] = '';
    this.setState({ comboName: e.target.value });
  };

  handlecomboQuantity = (e) => {
    this.state.errors["comboQuantity"] = '';
    this.setState({ comboQuantity: e.target.value });
  };

  handlecomboPrice=(e) =>{
    this.state.errors["comboPrice"] = '';
    this.setState({ comboPrice: e.target.value });
  };

  handleRemoveSpecificRow = (idx) => {

    const listOfProducts = [...this.state.listOfProducts]
    listOfProducts.splice(idx, 1)
    this.setState({ listOfProducts })

  }
  editProductCombo = (item) => {
    console.log('++++++item+++++++++', item);
    this.setState({
      isEdit: true,
      isAddCombo: true,
      comboName: item.name,
      comboQuantity: item.bundleQuantity,
      listOfProducts: item.productTextiles,
      comboPrice: item.itemMrp,
      selectedProductCombo: item

    });
  }
  searchCombo = (pageNumber) => {
    const { toDate, fromDate, selectedStoreId } = this.state;
    InventoryService.getAllProductBundleList(fromDate, toDate, selectedStoreId, pageNumber).then((res) => {
      if (res) {
        this.setState({
          listOfProductBundle: res.data.result.content

        });
      }
    });
  }
  handleQtyChange = (idx, item, e) => {
    // let listOfProducts = this.state.listOfProducts;
    // listOfProducts[idx][e.target.value] = e.target.value;
    // this.setState({ listOfProducts });
    // this.setState({ isgetLineItems: true })
    if (e.target.value !== "") {
      item.quantity = parseInt(e.target.value);
      let qty = item.quantity;
      if (item.quantity <= item.qty) {
        this.setState({ qty: e.target.value });


        item.quantity = parseInt(e.target.value);
        //let totalcostMrp = item.itemMrp * parseInt(e.target.value);

        //item.totalMrp = totalcostMrp

      } else {
        //this.setState({ isgetLineItems: false })
        toast.info("Insufficient Quantity");
      }
    } else {
      item.quantity = parseInt(e.target.value);
    }

    let totalqty = 0;
    this.state.listOfProductBundle.forEach(bardata => {
      // grandTotal = grandTotal + bardata.totalMrp;
      // promoDiscount = promoDiscount + bardata?.itemDiscount;
      totalqty = totalqty + parseInt(bardata.quantity)
    });

    this.setState({ qty: totalqty });



  }
  preventMinus = (e) => {
    if (e.code === "Minus") {
      e.preventDefault();
    }
  };


  changePage(pageNumber) {
    console.log(">>>page", pageNumber);
    let pageNo = pageNumber + 1;
    this.setState({ pageNumber: pageNo });
    this.getProductBundleList(pageNumber);
  }

  render() {
    {/* {this.state.barList.map((items, index) => { */ }

    return (


      <div className="maincontent">
        {/* {this.state.barList.map((items, index) => { */}
        <Modal isOpen={this.state.isAddCombo} size="lg" style={{ maxWidth: '1000px', width: '100%' }}>
          {!this.state.isEdit &&
            <ModalHeader>Add Combo <button type='button' onClick={() => this.closeCombo()} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>
          }
          {this.state.isEdit &&
            <ModalHeader>View Combo  <button type='button' onClick={() => this.closeCombo()} className='btn search modal-close text-right'> <img src={close}></img></button> </ModalHeader>
          }

          <ModalBody>
            <div className="row">
              <div className="col-3">
                <div className="form-group">
                  <label>Combo Name <span className="text-red font-bold" name="bold">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.comboName}
                    disabled={this.state.isEdit}
                    placeholder="Name Of The Combo"
                    onChange={this.handleComboName}
                  />
                </div>
                <span style={{ color: "red" }}>{this.state.errors["comboName"]}</span>
              </div>
              <div className="col-2">
                <div className="form-group">
                  <label>Combo Quantity <span className="text-red font-bold" name="bold">*</span></label>
                  <input
                    className="form-control"
                    type="number" id="quantity" min="0" max="unlimit"
                    placeholder="Quantity"
                    disabled={this.state.isEdit}
                    value={this.state.comboQuantity}
                    onChange={this.handlecomboQuantity}
                  />
                </div>
                <span style={{ color: "red" }}>{this.state.errors["comboQuantity"]}</span>
              </div>
              <div className="col-2">
                <div className="form-group">
                  <label>Combo Price <span className="text-red font-bold" name="bold">*</span></label>
                  <input
                    className="form-control"
                    type="number" id="quantity" min="0" max="unlimit"
                    placeholder="Combo Price"
                    disabled={this.state.isEdit}
                    value={this.state.comboPrice}
                    onChange={this.handlecomboPrice}
                  />
                </div>
                <span style={{ color: "red" }}>{this.state.errors["comboPrice"]}</span>
                {/* })} */}
              </div>
              {!this.state.isEdit &&

                <div className="col-4">
                  <div className="form-group">
                    <label> Add Products By</label>
                    <input
                      type="text"
                      className="form-control"
                      disabled={this.state.isEdit}
                      value={this.state.dsNumber}
                      placeholder="ENTER BARCODE"
                      onChange={(e) => this.setState({ dsNumber: e.target.value })}
                    />

                    <button type="button" className="scan" onClick={this.getBarcodeDetails}>
                      <img src={scan} /> SCAN
                    </button>

                  </div>
                </div>

              }
            </div>
            <div className="maincontent m-t-2 p-0">
              <h3 className="mt-1 mb-2 fs-18 p-l-0">List Of Products</h3>
              <table className="table table-borderless">
                <thead>
                  <tr className="m-0 p-0">
                    <th className="col-1">S.No</th>
                    <th className="col-2">BARCODE</th>
                    <th className="col-3">PRODUCT NAME</th>
                    <th className="col-2">UNIT PRICE</th>
                    <th className="col-2">QTY</th>
                    <th className="col-2"></th>

                  </tr>
                </thead>
                <tbody>
                  {this.state.listOfProducts.length > 0 && this.state.listOfProducts.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="col-1"> {index + 1}</td>
                        <td className="col-2">{item.barcode}</td>
                        <td className="col-3">{item.name}</td>
                        <td className="col-2">{item.itemMrp}</td>
                        <td className="col-2">
                          <div className="form-group">
                            <input
                              type="number"
                              className="form-control"
                              name="qty"
                              min="1"
                              max={item.qty}
                              disabled={this.state.isEdit}
                              placeholder=""
                              value={!this.state.isEdit ? item.quantity : item.qty}
                              onChange={e => this.handleQtyChange(index, item, e)}
                            />

                          </div>
                          {/* <span style={{ color: "red" }}>{this.state.error["listOfProducts"]}</span> */}

                        </td>



                        {this.state.listOfProducts.length > 1 && !this.state.isEdit ? <td className="col-2 text-center">

                          <i onClick={() => this.handleRemoveSpecificRow(index)} className="icon-delete m-l-2 fs-16" ></i>

                        </td> : <td className="col-2 text-center">

                        </td>}
                      </tr>
                    )
                  })}
                </tbody>
              </table>

            </div>
          </ModalBody>
          {!this.state.isEdit &&
            <ModalFooter>

              <button className="btn-unic" onClick={this.closeCombo}>
                Cancel
              </button>
              <button
                //className="btn-unic active fs-12 + btn-disable"
                className={!this.state.isEdit ? "btn-unic active fs-12" : "btn-disable"}
                disabled={this.state.isEdit}
                onClick={this.saveProductBundle}
              >
                Save
              </button>


            </ModalFooter>
          }
          {this.state.isEdit &&
            <ModalFooter>

              <button className="btn-unic active fs-12" onClick={this.closeCombo}>
                Close
              </button>
            </ModalFooter>
          }
        </Modal>
        <div className="row">
          <div className="col-sm-3 col-12">
            <div className="form-group mt-2">
              <label>From Date</label>
              <input
                type="date"
                className="form-control"
                placeholder="FROM DATE"
                value={this.state.fromDate}
                onChange={(e) => this.setState({ fromDate: e.target.value })}
              />
            </div>
          </div>
          <div className="col-sm-3 col-12">
            <div className="form-group mt-2">
              <label>To Date</label>
              <input
                type="date"
                className="form-control"
                placeholder="TO DATE"
                value={this.state.toDate}
                onChange={(e) => {
                  var startDate = new Date(this.state.fromDate);
                  var endDate = new Date(e.target.value);
                  if (startDate <= endDate) {
                    this.setState({ toDate: e.target.value })
                  }
                  else {
                    toast.error("To date should be greater than From date");
                  }
                }

                }
              />
            </div>
          </div>
          {/* <div className="col-sm-3 col-12">
          <div className="form-group mt-2">
            <label>Inventory ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter ID"
            />
          </div>
        </div> */}
          <div className='col-sm-6 col-12 mt-3 pt-2 scaling-center scaling-mb scaling-mtop'>
            <button
              onClick={() => { this.searchCombo(0); this.setState({ pageNumber: 0 }); }}
              className="btn-unic-search active m-r-2 mt-1"
            >
              Search
            </button>
            <button className="btn-clear m-r-2 mt-2"
              onClick={this.clear}
            >
              Clear
            </button>


            <button
              // className="btn-unic-redbdr mt-2 m-r-2"
              className={this.state.createproductcombo?.isEnabeld ? "btn-unic-redbdr mt-2 m-r-2" : "btn-disable mt-2"}
              disabled={!this.state.createproductcombo?.isEnabeld}
              onClick={this.addCombo}
            >
              <i className="icon-product_combo fs-16"></i> Add Combo
            </button>
          </div>
        </div>
        <h5 className="mb-2 fs-18 p-l-0 mt-3">List of product  bundles</h5>
        <div className="table-responsive m-0 p-0">
          <table className="table table-borderless mb-1">
            <thead>
              <tr className="m-0 p-0">
                <th className="col-2"># Inventory-ID</th>
                <th className="col-2">BARCODE</th>
                <th className="col-1">STORE ID</th>
                <th className="col-2">Combo Name</th>
                <th className="col-2">No.of Items</th>
                <th className="col-2">Unit Price</th>
                <th className="col-1"></th>
              </tr>
            </thead>
            <tbody>
              {this.state.listOfProductBundle && this.state.listOfProductBundle.map((itm, ind) => {
                return (
                  <tr key={ind}>
                    <td className="col-2">{itm.id}</td>
                    <td className="col-2">{itm.barcode}</td>
                    <td className="col-1">{itm.storeId}</td>
                    <td className="col-2">{itm.name}</td>
                    <td className="col-2">{itm.bundleQuantity}</td>
                    <td className="col-2">{itm.itemMrp}</td>
                    <td className="col-1">
                      {this.state.viewproducts?.isEnabeld ? <td className="col-1">
                        <img src={view} onClick={() => this.editProductCombo(itm)} className="w-12 pb-2" />
                      </td> : <td className="col-1">
                        <img src={view} className="w-12 pb-2" />
                      </td>}
                    </td>
                  </tr>
                )
              })}
              {this.state.listOfProductBundle.length === 0 && <div className='no_records'><img src={confirm}></img> <label>No records found</label> </div>}
            </tbody>
          </table>
        </div>
        <div className="row m-0 mt-3">
          {this.state.totalPages > 1 ? (
            <div className="d-flex justify-content-center">
              <ReactPageNation
                {...this.state.listOfProductBundle}
                changePage={(pageNumber) => {
                  this.changePage(pageNumber);
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}
