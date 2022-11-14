import React, { Component } from "react";
import print from "../../assets/images/print.svg";
import view from "../../assets/images/view.svg";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import InventoryService from "../../services/InventoryService";
import URMService from "../../services/URM/URMService";
import confirm from '../../assets/images/conformation.svg';
import { toast } from "react-toastify";
import  PrivilegesList  from '../../commonUtils/PrivilegesList';
import { number } from "prop-types";
import { stringify } from "querystring";
import ReactPageNation from "../../commonUtils/Pagination";
import { formatDate } from "../../commonUtils/FormatDate";
const data1 = [
  "Textile",

 "Retail",

 "Electronics"

];
export default class Rebarcoding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddBarcode: false,
      uomsList: [],
      hsnList: [],
      storeIds: [],
      sortedStoreIds: [],
      uom: "",
      barcodeId: "",
      stock: "",
      costPrice: "",
      listPrice: "",
      empId: "",
      isLoggedUser: false,
      clientId: "",
      storesList: [],
      domainsList: [],
      domain: "",
      storeId: "",
      status: "",
      productValidity: "",
      fromDate: "",
      toDate: "",
      barcodeSearchId: "",
      selectedStoreId: "",
      barcodesList: [],
      pageNumber: 0,
      domainDetails: {},
      isEdit: false,
      domainId: "",
      qty: null,
      stockValue: "",
      productItemId: "",
      name: "",
      productTextile: "",
      barcodeTextileId: "",
      divisionsList: [],
      sectionsList: [],
      subSectionsList: [],
      categoriesList: [],
      aList: [],
      subSection: "",
      section: "",
      division: "",
      category: "",
      batchNo: "",
      colour: "",
      hsnCode: "",
      viewrebarcode: '', 
      print:'',
      domainDetailsObj:"",
      commonFieldsErr: false,
      retailFieldsErr: false,
      textileFieldsErr: false,
      isTaxIncluded : '',
      vendorTax : '',
      errors: {},
      statusTypeList: [
        { id: 1, label: "YES", value: "YES" },
        { id: 0, label: "NO", value: "NO" },
      ],
    };
    // this.addBarcode = this.addBarcode.bind(this);
    this.getAllBarcodes = this.getAllBarcodes.bind(this);
    this.openEditBarcode = this.openEditBarcode.bind(this);
    this.closeBarcode = this.closeBarcode.bind(this);
    this.getDomainsList = this.getDomainsList.bind(this);
    this.setDropdowns = this.setDropdowns.bind(this);
    this.setEmployeeNames = this.setEmployeeNames.bind(this);
    this.storeNameMap = this.storeNameMap.bind(this);
    this.changePage = this.changePage.bind(this);
    this.handleDomainChange = this.handleDomainChange.bind(this);
  }

  closeBarcode() {
    this.setState({ isAddBarcode: false });
    this.stateReset();
  }
  
 

  openEditBarcode(barcodeId) {
    this.setState({ isAddBarcode: true });
    this.setState({ isEdit: true });
    this.setDropdowns(false);
    this.stateReset();
    this.getbarcodeDetails(barcodeId);
   
  }
  clearBar = () => {
    this.setState({ 
      Rebarcoding: [],
      fromDate: '',
      toDate: '' ,
      barcodeSearchId:''    
     }, () => { 
      this.getAllBarcodes();
    });
    }
    
  componentWillMount() {
    // this.state.domainDetails = JSON.parse(
    //   sessionStorage.getItem("selectedDomain")
    // );
    // this.setState({ domainDetails: this.state.domainDetails });
    const tax = JSON.parse(sessionStorage.getItem('user'));
    const isTaxIncluded = tax["custom:isTaxIncluded"]
    this.setState({isTaxIncluded : isTaxIncluded})
    const childPrivileges =  PrivilegesList('Re-Barcode List');
    childPrivileges.then((res) => {
      if(res) {
        const result = res.sort((a , b) => a.id - b.id);
        this.setState({
          
          viewrebarcode: result[0], 
          print:result[1]  
        });
        
      }
    });
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.setState({
      selectedStoreId: JSON.parse(sessionStorage.getItem("storeId")),
    });
    if (user["custom:isSuperAdmin"] === "true") {
      this.setState(
        {
          clientId: user["custom:clientId1"],
        },
        () => {
          this.getAllBarcodes();
           this.getAllStoresList();
          this.getAllUoms();
          this.getAllDivisions();
          this.getHsnDetails();
          this.getAllCategories();
        }
      );
    } else {
      this.setState(
        {
          clientId: user["custom:clientId1"],
          // domainId: user["custom:domianId1"]
        },
        () => {
           this.getAllStoresList();
          this.getAllBarcodes();
          // this.getAllUoms();
          // this.getAllDivisions();
          // this.getHsnDetails();
          // this.getAllCategories();
        }
      );
    }
  }

  handleDomainChange = (event) => {
    this.stateReset();
    // this.setState({ selectedDomain: event.target.value, domainDetailsObj: event.target.value, divisionsList: [] }, () =>
    // this.getAllUoms();
    // this.getHsnDetails(event.target.value);
    // //  this.getHeaders(e.target.value)
    // if (event.target.value === "Textile") {

    //   this.getAllDivisions(event.target.value);

    //   this.getAllCategories(event.target.value);
    //   //  this.loadErrorMsgs();
    // }
    InventoryService.getDomainAttributes(event.target.value).then((res) => {
      // res.data.forEach((ele, index) => {
      //   // const obj = {
      //   //   id: ele.id,
      //   //   value: ele.uomName,
      //   //   label: ele.uomName,
      //   // };
      if (res.data) {
        this.setState({ showAttributes: true, aList: res.data });
      }

      // });
    });
    this.setState(
      {
        selectedDomain: event.target.value,
        domainDetailsObj: event.target.value,
      }
    );
    //  this.getHeaders(e.target.value)
    this.getAllUoms(event.target.value);
    this.getAllDivisions(event.target.value);
    this.getHsnDetails(event.target.value);
    this.getAllCategories(event.target.value);
    //  this.loadErrorMsgs();

  }
  
  getAllBarcodes(pageNumber) {
    // let saveJson = {};

    // if (
    //   this.state.domainDetails &&
    //   this.state.domainDetails.label === "Retail"
    // ) {
    //   saveJson = {
    //     fromDate: this.state.fromDate,
    //     toDate: this.state.toDate,
    //     currentBarcodeId: this.state.barcodeSearchId,
    //   };
    // } else {
    let  saveJson = {
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
        currentBarcodeId: this.state.barcodeSearchId.trim(),
        storeId: this.state.selectedStoreId,
        
      };
    // }

    InventoryService.getReBarcodeDetails(
      saveJson,
      this.state.domainDetails,
      pageNumber
    )
      .then((res) => {
        if (res.data.content.length !== 0) {
          this.setState({barcodesList :res.data.content})
          this.setState({
            totalPages: res.data.result.totalPages,
          });
          // this.setEmployeeNames();
        } else {
          this.setState({ barcodesList: [] });
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.isSuccess === "false") {
          this.setState({ barcodesList: [] });
        }
      });
  }

  changePage(pageNumber) {
    let pageNo = pageNumber + 1;
    this.setState({ pageNumber: pageNo });
    this.getAllBarcodes(pageNumber);
  }

  setEmployeeNames() {
    this.state.barcodesList.forEach((ele, index) => {
      // if (
      //   this.state.domainDetails &&
      //   this.state.domainDetails.label === "Retail"
      // ) {
      //   if (ele.createdBy) {
      //     this.state.sortedStoreIds.push(JSON.stringify(ele.createdBy));
      //   }
      // } else {
        if (ele.createdBy) {
          this.state.sortedStoreIds.push(JSON.stringify(ele.createdBy));
        }
      // }
    });
    this.setState({ sortedStoreIds: this.state.sortedStoreIds });
    this.setState({ storeIds: this.uniq() });
    this.getStoreNamesById();
  }
  
  uniq() {
    return Array.from(new Set(this.state.sortedStoreIds));
  }

  getStoreNamesById() {
    let obj = {};
    this.setState({ sortedStoreIds: [] });
    if (this.state.storeIds && this.state.storeIds.length > 0) {
      InventoryService.getEmpNamesByIds(this.state.storeIds).then((res) => {
        if (res && res.data && res.data.result && res.data.result.length > 0) {
          res.data.result.forEach((ele, index) => {
            obj = {
              id: ele.id,
              value: ele.name,
            };
            this.state.sortedStoreIds.push(obj);
          });
          this.setState({ sortedStoreIds: this.state.sortedStoreIds });
          this.storeNameMap();
        }
      });
    }
  }

  storeNameMap() {
    if (this.state.barcodesList && this.state.barcodesList.length > 0) {
      this.state.barcodesList.forEach((ele, index) => {
        this.state.sortedStoreIds.forEach((ele1, index1) => {
          if (
                 this.state.domainDetailsObj === "Retail"
          ) {
            if (ele.storeId === ele1.id) {
              this.state.barcodesList[index].storeName = ele1.value;
              // this.setState({ barcodesList: this.state.barcodesList });
            }
          } else if (ele.productTextile.storeId === ele1.id) {
            this.state.barcodesList[index].productTextile.storeName =
              ele1.value;
            // this.setState({ barcodesList: this.state.barcodesList });
          }
        });
        this.setState({ barcodesList: this.state.barcodesList });
      });
    }
  }

  getAllUoms() {
    InventoryService.getUOMs().then((res) => {
      res.data.forEach((ele, index) => {
        const obj = {
          id: ele.id,
          value: ele.uomName,
          label: ele.uomName,
        };
        this.state.uomsList.push(obj);
      });
    });
  }

  getHsnDetails() {
    InventoryService.getAllHsnList().then((res) => {
      res.data.result.forEach((ele, index) => {
        const obj = {
          id: ele.id,
          value: ele.hsnCode,
          label: ele.hsnCode,
        };
        this.state.hsnList.push(obj);
      });

      this.setState({ hsnList: this.state.hsnList });
    });
  }

  getAllDivisions(value) {
    InventoryService.getAllDivisions(value).then((res) => {
      res.data.forEach((ele, index) => {
        const obj = {
          id: ele.id,
          value: ele.name,
          label: ele.name,
        };
        this.state.divisionsList.push(obj);
      });
      this.setState({ divisionsList: this.state.divisionsList });
    });
  }

  // getAllSections(id) {
  //   this.setState({ sectionsList: [] });
  //   InventoryService.getAllSections(id).then((res) => {
  //     if (res.data && res.data.isSuccess === "true") {
  //       res.data.result.forEach((ele, index) => {
  //         const obj = {
  //           id: ele.id,
  //           value: ele.name,
  //           label: ele.name,
  //         };
  //         this.state.sectionsList.push(obj);
  //       });
  //       this.setState({ sectionsList: this.state.sectionsList });
  //     } else {
  //       this.setState({ sectionsList: [] });
  //     }
  //   });
  // }

  getAllSections(id,value) {
    InventoryService.getAllSections(id,value).then((res) => {
      res.data.forEach((ele, index) => {
        const obj = {
          id: ele.id,
          value: ele.name,
          label: ele.name,
        };
        this.state.sectionsList.push(obj);
      });
      this.setState({ sectionsList: this.state.sectionsList });
    });
  }

  getAllSubsections(id,value) {
    InventoryService.getAllSections(id,value).then((res) => {
      res.data.forEach((ele, index) => {
        const obj = {
          id: ele.id,
          value: ele.name,
          label: ele.name,
        };
        this.state.subSectionsList.push(obj);
      });
      this.setState({ subSectionsList: this.state.subSectionsList });
    });
  }

  getAllCategories(value) {
    InventoryService.getAllCategories(value).then((res) => {
      res.data.forEach((ele, index) => {
        const obj = {
          id: ele.id,
          value: ele.name,
          label: ele.name,
        };
        this.state.categoriesList.push(obj);
      });
      this.setState({ categoriesList: this.state.categoriesList });
    });
  }
 
  getAllStoresList() {
    URMService.getStoresByDomainId(this.state.clientId).then(
      (res) => {
        if (res) {
          res.data.forEach((ele, index) => {
            const obj = {
              id: ele.id,
              value: ele.name,
              label: ele.name,
            };
            this.state.storesList.push(obj);
          });
        }
        this.setState({ storesList: this.state.storesList });
      }
    );
  }

  getDomainsList() {
    URMService.getDomainsList(this.state.clientId).then((res) => {
      if (res) {
        this.setState({
          domainsList: res.data.result,
          domainId: res.data.result[0].clientDomainaId,
        });
        this.getAllStoresList();
      }
    });
  }

  getbarcodeDetails(barcodeId) {
    InventoryService.getBarcodeDetails(
      barcodeId,
      this.state.domainDetails,
      this.state.selectedStoreId
    ).then((res) => {
      const barcode = res.data;
      if (res && res.data) {
        // if (
        //   this.state.domainDetails &&
        //   this.state.domainDetails.label === "Retail"
        // ) {
        //   this.setState({
        //     status: barcode.status,
        //     stockValue: barcode.stockValue ? barcode.stockValue : "",
        //     qty: barcode.qty ? barcode.qty : 0,
        //     barcodeId: barcode.barcodeId,
        //     name: barcode.name,
        //     colour: barcode.colour,
        //     costPrice: barcode.costPrice,
        //     listPrice: barcode.listPrice,
        //     productValidity: barcode.productValidity,
        //     storeId: barcode.storeId,
        //     empId: barcode.empId,
        //     uom: barcode.uom,
        //     productItemId: barcode.productItemId,
        //     hsnCode: barcode.hsnCode,
        //     batchNo: barcode.batchNo,
        //   });
        // } else {
          this.setState({
            domainDetailsObj:barcode.domainType,
            status: barcode.status,
            stockValue: barcode.stockValue ? barcode.stockValue : "",
            // qty: barcode.productTextile.qty ? barcode.productTextile.qty : 0,
            qty: barcode.qty ? barcode.qty : 0,
            barcodeId: barcode.barcodeId,
            productTextileId: barcode.productTextileId,
            barcodeTextileId: barcode.barcodeTextileId,
            costPrice: barcode.costPrice,
            storeId: barcode.storeId,
            empId: barcode.empId,
            uom: barcode.uom,
            division: barcode.division,
            section: barcode.section,
            listPrice: barcode.itemMrp,
            subSection: barcode.subSection,
            category: barcode.category,
            batchNo: barcode.batchNo,
            colour: barcode.colour,
            // hsnCode: barcode.hsnMasterId,
            hsnCode: barcode.hsnCode,
            name: barcode.name,
            vendorTax : barcode.vendorTax,
            aList: barcode.metadata,
          });
          this.getAllCategories(this.state.domainDetailsObj);
        // }
     
          this.getAllSections(this.state.division,this.state.domainDetailsObj);
          this.getAllSubsections(this.state.section,this.state.domainDetailsObj);
          this.getAllDivisions(this.state.domainDetailsObj)
          this.getAllUoms(this.state.domainDetailsObj);
        
      } else {
        toast.error(res.data.message);
      }
    });
  }

  setDropdowns(isEdit) {
    this.getAllUoms();
    if (isEdit) {
      this.getAllSections(this.state.division);
      this.getAllSubsections(this.state.section);
    }
  }

  // addBarcode() {
  //   let domainInfo = this.state.domainDetails;
  //   let saveJson = {};
  //   if (domainInfo && domainInfo.label === "Retail") {
  //     saveJson = {
  //       status: this.state.status,
  //       stockValue: this.state.stockValue,
  //       costPrice: this.state.costPrice,
  //       listPrice: this.state.listPrice,
  //       productValidity: this.state.productValidity,
  //       storeId: this.state.storeId,
  //       empId: this.state.empId,
  //       uom: this.state.uom,
  //       isBarcode: false,
  //       domainDataId: this.state.domainId,
  //       name: this.state.name,
  //       hsnCode: this.state.hsnCode,
  //       batchNo: this.state.batchNo,
  //       colour: this.state.colour,
  //     };
  //   } else {
  //     saveJson = {
  //       division: parseInt(this.state.division),
  //       section: parseInt(this.state.section),
  //       subSection: parseInt(this.state.subSection),
  //       category: parseInt(this.state.category),
  //       name: this.state.name,
  //       batchNo: this.state.batchNo,
  //       colour: this.state.colour,
  //       // productTextile: {
  //       //   qty: this.state.qty,
  //       //   costPrice: this.state.costPrice,
  //       //   itemMrp: this.state.listPrice,
  //       //   storeId: this.state.storeId,
  //       //   empId: this.state.empId,
  //       //   uom: this.state.uom,
  //       //   // hsnMasterId: parseInt(this.state.hsnCode),
  //       //   hsnCode: parseInt(this.state.hsnCode),
  //       // },
  //       qty: this.state.qty,
  //       costPrice: this.state.costPrice,
  //       itemMrp: this.state.listPrice,
  //       storeId: this.state.storeId,
  //       empId: this.state.empId,
  //       uom: this.state.uom,
  //       domainDataId: parseInt(this.state.domainDetails.value),
  //       // hsnMasterId: parseInt(this.state.hsnCode),
  //       hsnCode: parseInt(this.state.hsnCode),
  //     };
  //   }

  //   InventoryService.addBarcode(
  //     saveJson,
  //     this.state.domainDetails,
  //     this.state.isEdit
  //   ).then((res) => {
  //     if (res.data && res.data.isSuccess === "true") {
  //       toast.success(res.data.result);
  //       this.setState({ isAddBarcode: false });
  //       this.props.history.push("/barcodeList");
  //       this.getAllBarcodes();
  //       this.stateReset();
  //     } else {
  //       toast.error(res.data.message);
  //     }
  //   });
  // }

  stateReset() {
    this.setState({
      status: "",
      stockValue: "",
      costPrice: "",
      productValidity: "",
      storeId: "",
      empId: "",
      uom: "",
      domainId: "",
      name: "",
      listPrice: "",
      division: "",
      section: "",
      subSection: "",
      category: "",
      batchNo: "",
      hsnCode: "",
      colour: "",
      barcodeSearchId:"",
      domainDetailsObj:"",
      qty: null,
      retailFieldsErr: false,
      textileFieldsErr: false,
      commonFieldsErr: false,
      sortedStoreIds: [],
    });
  }

  barcodesRetailHeader() {
    return (
      <tr className="m-0 p-0">
        {/* <th className="col-1">S.NO</th>
        <th className="col-3">BARCODE</th>
        <th className="col-1">LIST PRICE</th>
        <th className="col-3">STORE</th>
        <th className="col-1">QTY</th>
        <th className="col-1">VALUE</th>
        <th className="col-2">View / Delete</th> */}
      </tr>
    );
  }

  // barcodesListTable() {
  //   return this.state.barcodesList.map((items, index) => {
  //     const { barcodeId, listPrice, storeId, storeName, stockValue, value } =
  //       items;
  //     return (
  //       <tr key={index}>
  //         {/* 
  //         <td className="col-3 underline">{barcodeId}</td>
  //         <td className="col-3 underline">{barcodeId}</td>
  //         <td className="col-2">₹ {listPrice}</td>
  //         <td className="col-3">{storeName}</td>
  //         <td className="col-1">{stockValue}</td>
  //         <td className="col-2 text-center">
  //           <img src={edit} className="w-12 pb-2" onClick={() => this.openEditBarcode(barcodeId)} />
  //           <i className="icon-delete m-l-2 fs-16" onClick={() => this.deleteBarcode(barcodeId)}></i>
  //         </td> */}
  //       </tr>
  //     );
  //   });
  // }

  barcodesTextileHeader() {
    return (
      <tr className="m-0 p-0">
        {/* <th className="col-1">S.NO</th> */}
        <th className="col-2">PARENT BARCODE ID</th>
        <th className="col-2">CHILD BARCODE ID</th>
        <th className="col-2">EMPLOYEE ID</th>
        {/* <th className="col-2">APPROVED BY</th> */}
        <th className="col-2">DATE</th>
        <th className="col-2 text-center">Actions</th>
      </tr>
    );
  }

  barcodesListTableTextile() {
    return this.state.barcodesList.map((items, index) => {
      let date = formatDate(items.createdDate)
      const {
        currentBarcodeId,
        toBeBarcodeId,
        createdBy,
        fromDate,
        createdDate,
      } = items;
      return (
        <tr key={index}>
          <td className="col-2 ">{toBeBarcodeId}</td>
          <td className="col-2 ">{currentBarcodeId}</td>
          <td className="col-2">{createdBy}</td>
          {/* <td className="col-2">-</td> */}
          <td className="col-2">{date.substring(0,10)}</td>
           <td className="col-2 text-center">
            {/* <img src={print} className="w-12 pb-2 m-r-2" />
            <img
              src={view}
              className="w-12 pb-2"
              disabled={this.state.viewproducts?.isEnabeld}
              onClick={() => this.openEditBarcode(currentBarcodeId)}
            />
            <i className="icon-edit m-l-2 fs-16" onClick={() => this.deleteBarcode(barcodeTextileId)}></i> */}
             {this.state.viewrebarcode?.isEnabeld ? <td className="col-1">
                    <img src={view}  onClick={() => this.openEditBarcode(currentBarcodeId)} className="w-12 pb-2" />
                    {/* <i onClick={this.handleRemovePromo(item)} className="icon-delete m-l-2 fs-16"></i> */}
                  </td> : <td className="col-1">
                    <img src={view}  className="w-12 pb-2" />
                    {/* <i onClick={this.handleRemovePromo(item)} className="icon-delete m-l-2 fs-16"></i> */}
                  </td>}
          </td> 

        
        </tr>
      );
    });
  }
  categoriesDiv1() {

    if (this.state.aList && this.state.aList !== null && this.state.aList.length > 0) {

      return this.state.aList.map((items, index) => {
        // const { storeManager, createdDate,clientDomianlId["domaiName"], createdBy, cityId, name, domain } = items;
        return (
          // <div className="row">

          <div className="in-block mt-3">


            {items.type === "select" && (
              <li>
                <div className="form-group">
                  <label>
                    {items.name}
                     <span className="text-red font-bold">*</span> 
                  </label>
                  <select
                    className="form-control"
                    placeholder="Select Sub Section"
                    onChange={(e) => this.handleSelectChange(e, items)}
                    value={items.selectedValue}
                    disabled={this.state.isEdit}
                  >
                    <option value="">Select</option>
                    {items.values.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </li>
            )}




            {/* <div className="col-sm-4"> */}
            {items.type === "input" && (
              <li>
                <div className="form-group" key={items.name}>
                  <label>
                    {items.name}
                     <span className="text-red font-bold">*</span> 
                  </label>
                  <input
                    type={items.name === "expiry date" ? "date" : "text"}
                    className="form-control"
                    placeholder=""
                    value={items.selectedValue}
                    disabled={this.state.isEdit}
                    onChange={(e) => this.handleSelectChange(e, items)}
                  />
                </div>
              </li>
            )}
            {/* </div> */}

          </div>



        );
      });
    }
   
  }

  statusDiv() {
    const { options, id } = this.state;
    return (
      <div className="col-sm-4 col-12 mt-3">
        <div className="form-group">
          <label>
            Status Type
            <span className="text-red font-bold">*</span>
          </label>
          <select
            className="form-control"
            placeholder="Select Store"
            value={this.state.status}
            disabled={true}
          >
            <option value="" disabled>
              Select
            </option>
            {this.state.statusTypeList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.value}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  stockDate() {
    return (
      <div className="col-sm-4 col-12 mt-3">
        <div className="form-group">
          <label>
            Stock date
            <span className="text-red font-bold">*</span>
          </label>
          <input
            type="date"
            className="form-control"
            placeholder=""
            value={this.state.productValidity}
            disabled={true}
          />
        </div>
      </div>
    );
  }

  stockDiv() {
    return (
      <div className="col-sm-4 col-12 mt-3">
        <div className="form-group">
          <label>
            QTY
            <span className="text-red font-bold">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            placeholder=""
            value={this.state.stockValue}
            disabled={true}
          />
        </div>
      </div>
    );
  }

  qtyDiv() {
    return (
      <div className="col-sm-4 col-12 mt-3">
        <div className="form-group">
          <label>
            QTY
            <span className="text-red font-bold">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            placeholder=""
            value={this.state.qty}
            disabled={true}
          />
        </div>
      </div>
    );
  }

  nameDiv() {
    return (
      <div className="col-sm-4 col-12 mt-3">
        <div className="form-group">
          <label>
            Name
            <span className="text-red font-bold">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            value={this.state.name}
            disabled={true}
          />
        </div>
      </div>
    );
  }

  categoriesDiv() {
    const { options, id, value } = this.state;
    return (
      <div className="row">
        <div className="col-sm-4 col-12">
          <div className="form-group">
            <label>
              Division
              <span className="text-red font-bold">*</span>
            </label>
            <select
              className="form-control"
              placeholder="Select Division"
              value={this.state.division}
              disabled={true}
            >
              <option value="" disabled>
                Select
              </option>
              {this.state.divisionsList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-sm-4 col-12">
          <div className="form-group">
            <label>
              Section
              <span className="text-red font-bold">*</span>
            </label>
            <select
              className="form-control"
              placeholder="Select Section"
              value={this.state.section}
              disabled={true}
            >
              <option value="" disabled>
                Select
              </option>
              {this.state.sectionsList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-sm-4 col-12">
          <div className="form-group">
            <label>
              Sub Section
              <span className="text-red font-bold">*</span>
            </label>
            <select
              className="form-control"
              placeholder="Select Sub Section"
              value={this.state.subSection}
              disabled={true}
            >
              <option value="" disabled>
                Select
              </option>
              {this.state.subSectionsList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-sm-4 col-12 mt-3">
          <div className="form-group">
            <label>
              Category
              <span className="text-red font-bold">*</span>
            </label>
            <select
              className="form-control"
              placeholder="Select Category"
              value={this.state.category}
              disabled={true}
            >
              <option value="" disabled>
                Select
              </option>
              {this.state.categoriesList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-sm-4 col-12 mt-3">
          <div className="form-group">
            <label>
              Name
              <span className="text-red font-bold">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              value={this.state.name}
              disabled={true}
            />
          </div>
        </div>
        {this.state.aList && this.state.aList.length > 0 && this.categoriesDiv1()}
      </div>
    );
  }

  render() {
    const { options, id, value } = this.state;
    return (
      <div className="">
        <Modal isOpen={this.state.isAddBarcode} size="lg">
          <ModalHeader>
            <h5>Re-Barcode</h5>
          </ModalHeader>
          <ModalBody>
            <div className="p-3">
              <div className="col-12 scaling-center scaling-mb">
                <h6 className="text-red mb-3">Re-Barcode Details</h6>
              </div>
              <div className="row">
                <div className="col-sm-4 col-12">
                  <div className="form-group">
                    <label>
                      Domain
                      <span className="text-red font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={this.state.domainDetailsObj}
                      onChange={this.handleDomainChange}
                      disabled={true}
                    />
                    {/* {this.state.commonFieldsErr && !this.state.colour
                      ? this.errorDiv("colourErr")
                      : null} */}
                       
                
                  </div>
                </div>
              </div>
              {/* {this.categoriesDiv1()} */}
              {/* <div className="col-4">
                <div className="form-group">
                  <label>Barcode</label>
                  <input type="text" className="form-control" placeholder="" />
                </div>
              </div> 
               <div className="col-4">
                <div className="form-group">
                  <label>Description</label>
                  <input type="text" className="form-control" placeholder="" />
                </div>
              </div> */}

             { this.categoriesDiv()}
              {this.state.domainDetailsObj  === "Retail"
                ? this.nameDiv()
                : null}
              <div className="row">
                <div className="col-sm-4 col-12 mt-3">
                  <div className="form-group">
                    <label>
                      Colour
                      <span className="text-red font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={this.state.colour}
                      disabled={true}
                    />
                  </div>
                </div>
                
                {/* <div className="col-4 mt-3">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" className="form-control" placeholder="" value={this.state.name}
                    onChange={(e) =>
                      this.setState({ name: e.target.value })} />
                </div>
              </div> */}

                <div className="col-sm-4 col-12 mt-3">
                  <div className="form-group">
                    <label>
                      Batch No
                      <span className="text-red font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={this.state.batchNo}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="col-sm-4 col-12 mt-3">
                  <div className="form-group">
                    <label>
                      Cost Price
                      <span className="text-red font-bold">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="₹ 00"
                      value={this.state.costPrice}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="col-sm-4 col-12 mt-3">
                  <div className="form-group">
                    <label>
                      List Price
                      <span className="text-red font-bold">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="₹ 00"
                      value={this.state.listPrice}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="col-sm-4 col-12 mt-3">
                  <div className="form-group">
                    <label>
                      UOM
                      <span className="text-red font-bold">*</span>
                    </label>
                    <select
                      className="form-control"
                      placeholder="Select Store"
                      value={this.state.uom}
                      disabled={true}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {this.state.uomsList.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.value}
                        </option>
                      ))}
                    </select>
                    {/* 
                  <div className="form-group sele">
                    <Select className="upper-case" placeholder="Select Store"
                      value={this.state.selectedOption} // set selected value
                      options={this.state.uomsList} // set list of the data
                      onChange={this.handleChange} // assign onChange function
                    />
                  </div> */}
                  </div>
                </div>
                <div className="col-sm-4 col-12 mt-3">
                  <div className="form-group">
                    <label>
                      HSN Code
                      <span className="text-red font-bold">*</span>
                    </label>
                    <input
                      className="form-control"
                      placeholder="Select Store"
                      value={this.state.hsnCode}
                      disabled={true}
                    >
                    
                    </input>
                  </div>
                </div>
                <div className="col-sm-4 col-12 mt-3">
                  <div className="form-group">
                    <label>
                      Vendor Tax
                      <span className="text-red font-bold">*</span>
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      onKeyPress={this.preventMinus}
                      placeholder="₹ 00"
                      value={this.state.vendorTax}
                      disabled={this.state.isEdit}
                      onChange={(e) =>
                        this.setState({ vendorTax: e.target.value })
                      }
                    />

                    {this.state.commonFieldsErr && !this.state.vendorTax
                      ? this.errorDiv("vendorTaxErr")
                      : null}
                  </div>
                </div>
                

                <div className="col-sm-4 col-12 mt-3">
                  <div className="form-group">
                    <label>
                      EMP ID
                      <span className="text-red font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={this.state.empId}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="col-sm-4 col-12 mt-3">
                  <div className="form-group">
                    <label>
                      Store
                      <span className="text-red font-bold">*</span>
                    </label>
                    <select
                      className="form-control"
                      placeholder="Select Store"
                      value={this.state.storeId}
                      disabled={true}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {this.state.storesList.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {this.state.domainDetailsObj === "Retail"
                  ? this.stockDiv()
                  : this.qtyDiv()}
                {this.state.domainDetailsObj === "Retail"
                  ? this.statusDiv()
                  : null}
                {this.state.domainDetailsObj === "Retail"
                  ? this.stockDate()
                  : null}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn-unic" onClick={this.closeBarcode}>
              Close
            </button>
            {/* <button
              className="btn-unic active fs-12"
              // onClick={this.state.isEdit ? this.editBarcode : this.addBarcode}
              onClick={this.checkForMandatory}
            >
              Save
            </button> */}
          </ModalFooter>
        </Modal>
        <div className="maincontent">
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
                  // onChange={(e) => this.setState({ toDate: e.target.value })}
                  onChange={(e) => {
                    var startDate = new Date(this.state.fromDate);
                    var endDate = new Date(e.target.value);
                    if (startDate <= endDate) {
                      this.setState({ toDate: e.target.value });
                      
                    } 
                    else
                     {
                      toast.error("Please select from date");
                      
                    }
                  }}
                />
              </div>
            </div>
            <div className="col-sm-2 col-12">
              <div className="form-group mt-2">
                <label>Re-Barcode ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Re-Barcode ID"
                  value={this.state.barcodeSearchId}
                  onChange={(e) =>
                    this.setState({ barcodeSearchId: e.target.value })
                  }
                />

                {/* <button type="button" className="scan">
                <img src={scan} /> 
                SCAN
                </button> */}
              </div>
            </div>
            <div className="col-3 col-sm-3 col-12 mt-3 pt-2 scaling-center scaling-mb scaling-mtop">
              <button
                className="btn-unic-search active m-r-2 mt-2"
                onClick={() => {
                  this.getAllBarcodes(0);
                  this.setState({ pageNumber: 0 });
                }}
              >
                Search
              </button>
              <button
                className="btn-clear m-r-2 mt-2"
                onClick={this.clearBar}
                >
                Clear
              </button>
            </div>
           
          </div>
          <div className="row m-0 p-0 scaling-center">
            <h5 className="mb-2 fs-18 p-l-0 mt-3">List of Re-Barcodings</h5>
            <div className="table-responsive p-0">
              <table className="table table-borderless mb-1">
                <thead>
                 {this.barcodesTextileHeader()}
                </thead>
                <tbody>
                 
                  {this.barcodesListTableTextile()}
                  {/* </tr> */}
                  {this.state.barcodesList.length === 0 && <div className='no_records'><img src={confirm}></img> <label>No records found</label> </div>}
                </tbody>

                <div className="row m-0 mt-3">
                  {this.state.totalPages > 1 ? (
                    <div className="d-flex justify-content-center">
                      <ReactPageNation
                        {...this.state.barcodesList}
                        changePage={(pageNumber) => {
                          this.changePage(pageNumber);
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
