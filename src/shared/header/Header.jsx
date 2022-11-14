import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { withRouter } from "react-router-dom";
import Select from 'react-select';
import logosm from '../../assets/images/easy_retail_logo.svg';
import eventBus from '../../commonUtils/eventBus';
import URMService from '../../services/URM/URMService';
import CountDownTimmer from './CountDownTimmer';




const data = [
  {
    value: 1,
    label: "TEXTILE"
  },
  {
    value: 2,
    label: "RETAIL"
  },
  {
    value: 3,
    label: "ELECTRONICS"
  },
  {
    value: 4,
    label: "LOGOUT"
  }
];
const data1 = [
  {
    value: 1,
    label: "TEXTILE"
  },
  {
    value: 4,
    label: "LOGOUT"
  }
];

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userData: {},
    //   selectedCategory: {
    //   "id": "2",
    //   "name": "Accounting Portal",
    //   "parentImage": "icon-r_brand fs-30 i_icon",
    //   "path": "/stores"
    // },
    selectedCategory: {},
      selectedImage: '',
      headerName: '',
      domainTitle: '',
      dropData: [],
      domainsList: [],
      headertype: "",
      storenameFlag : true,
      domainLists: [],
      planExpairyDate: '',
      isClientSupport : false,
      clientName:'',
      moduleNames: [
        {
          //   parentName: "Cash Memo & Delivery Slips",
          parentName: "Dashboard",
          path: "/dashboard",
          parentImage: "icon-cash_memo fs-30 i_icon",
          children: [
            {
              //   childName: "Create Delivery Slip",
              childName: "Dashboard",
              childImage: "icon-create_delivery_slip",
              childPath: "/createdeliveryslip",
            },

          ],
        },
        {
          //   parentName: "Cash Memo & Delivery Slips",
          parentName: "Customer Portal",
          path: "/createdeliveryslip",
          parentImage: "icon-cash_memo fs-30 i_icon",
          children: [
            {
              //   childName: "Create Delivery Slip",
              childName: " Generate Estimation Slip",
              childImage: "icon-create_delivery_slip",
              childPath: "/createdeliveryslip",
            },
            {
              //   childName: "New Sale",
              childName: "Generate Invoice",
              childImage: "icon-sale",
              childPath: "/newsale",
            },
            {
              //   childName: "Promo Item Exchange",
              childName: "Generate Return Slip",
              childImage: "icon-promo",
              childPath: "/generatereturnslip",
            },

            {
              childName: "Add Customer",
              childImage: "icon-create_customer",
              childPath: "/createcustomer",
            },
            {
              //   childName: "Tag Customer To GV",
              childName: "Gift Voucher",
              childImage: "icon-tag_customer",
              childPath: "/tagcustomer",
            },
            {
              //   childName: "Pos Day Close",
              childName: "Day Closure Activity",
              childImage: "icon-close",
              childPath: "/posdayclose",
            },
          ],
        },
        {
          parentName: "Inventory Portal",
          path: "/inventoryList",
          parentImage: "icon-notes fs-30 i_icon",
          children: [
            { childName: "Inventory List", childImage: "deliveryslip", childPath: "/inventoryList", },
            { childName: "Barcode List", childImage: "sale", childPath: "/barcodeList", },

          ],
        },
        {
          parentName: "Promotions & Loyalty",
          path: "/listOfPools",
          parentImage: "icon-notes_add fs-30 i_icon",
          children: [
            { childName: "List of Pools", childImage: "deliveryslip", childPath: "/listOfPools" },
            { childName: "Manage Promo", childImage: "sale", childPath: "/managePromo" },
            { childName: "Loyalty Points", childImage: "deliveryslip", childPath: "/loyaltyPoints" },
          ],
        },
        {
          parentName: "Accounting Portal",
          path: "/createNotes",
          parentImage: "icon-transfer fs-30 i_icon",
          children: [
            { childName: "Credit Notes", childImage: "deliveryslip", childPath: "/createNotes" },
            { childName: "Debit Notes", childImage: "sale", childPath: "/debitNotes" },
            { childName: "Create Tax Master", childImage: "deliveryslip", childPath: "/createTaxMaster" },
            { childName: "Create HSN Code", childImage: "deliveryslip", childPath: "/createHSN" },
          ],
        },

        {
          parentName: "Reports",
          path: "/salereport",
          parentImage: "icon-chart fs-30 i_icon",
          children: [
            {
              childName: "New Sale Report",
              childImage: "deliveryslip",
              childPath: "/salereport",
            },
            {
              childName: "Goods Return",
              childImage: "sale",
              childPath: "/listofsalebills",
            },
            {
              childName: "Sales Summary",
              childImage: "deliveryslip",
              childPath: "/listofdeliveryslips",
            },
            {
              childName: "List of Barcodes",
              childImage: "deliveryslip",
              childPath: "/listofreturnslips",
            },
            {
              childName: "List of promotions", childImage: "deliveryslip",
              childPath: "/listofPromotions"
            }
          ],
        },
        {
          parentName: "URM Portal",
          path: "/users",
          parentImage: "icon-r_brand fs-30 i_icon",
          children: [
            { childName: "Users", childImage: "deliveryslip", childPath: "/users" },
            { childName: "Roles", childImage: "sale", childPath: "/roles" },
            { childName: "Stores", childImage: "deliveryslip", childPath: "/stores" },
            { childName: "Domain", childImage: "deliveryslip", childPath: "/domain" },
          ],
        },
        {
          parentName: "HR Portal",
          path: "/hrPortal",
          parentImage: "icon-hsn fs-30 i_icon",
          children: [

          ],
        },
      ],
      moduleRetailNames: [
        {
          //   parentName: "Cash Memo & Delivery Slips",
          parentName: "Dashboard",
          path: "/dashboard",
          parentImage: "icon-cash_memo fs-30 i_icon",
          children: [
            {
              //   childName: "Create Delivery Slip",
              childName: "Dashboard",
              childImage: "icon-create_delivery_slip",
              childPath: "/createdeliveryslip",
            },

          ],
        },
        {
          //   parentName: "Cash Memo & Delivery Slips",
          parentName: "Customer Portal",
          path: "/newsale",
          parentImage: "icon-cash_memo fs-30 i_icon",
          children: [

            {
              //   childName: "New Sale",
              childName: "Generate Invoice",
              childImage: "icon-sale",
              childPath: "/newsale",
            },
            {
              //   childName: "Promo Item Exchange",
              childName: "Generate Return Slip",
              childImage: "icon-promo",
              childPath: "/generatereturnslip",
            },

            {
              childName: "Add Customer",
              childImage: "icon-create_customer",
              childPath: "/createcustomer",
            },
            {
              //   childName: "Tag Customer To GV",
              childName: "Gift Voucher",
              childImage: "icon-tag_customer",
              childPath: "/tagcustomer",
            },
            {
              //   childName: "Pos Day Close",
              childName: "Day Closure Activity",
              childImage: "icon-close",
              childPath: "/posdayclose",
            },
          ],
        },
        {
          parentName: "Inventory Portal",
          path: "/inventoryList",
          parentImage: "icon-notes fs-30 i_icon",
          children: [
            { childName: "Inventory List", childImage: "deliveryslip", childPath: "/inventoryList", },
            { childName: "Barcode List", childImage: "sale", childPath: "/barcodeList", },

          ],
        },
        {
          parentName: "Promotions & Loyalty",
          path: "/listOfPools",
          parentImage: "icon-notes_add fs-30 i_icon",
          children: [
            { childName: "List of Pools", childImage: "deliveryslip", childPath: "/listOfPools" },
            { childName: "Manage Promo", childImage: "sale", childPath: "/managePromo" },
            { childName: "Loyalty Points", childImage: "deliveryslip", childPath: "/loyaltyPoints" },
          ],
        },
        {
          parentName: "Accounting Portal",
          path: "/createNotes",
          parentImage: "icon-transfer fs-30 i_icon",
          children: [
            { childName: "Credit Notes", childImage: "deliveryslip", childPath: "/createNotes" },
            { childName: "Debit Notes", childImage: "sale", childPath: "/debitNotes" },
            { childName: "Create Tax Master", childImage: "deliveryslip", childPath: "/createTaxMaster" },
            { childName: "Create HSN Code", childImage: "deliveryslip", childPath: "/createHSN" },
          ],
        },

        {
          parentName: "Reports",
          path: "/salereport",
          parentImage: "icon-chart fs-30 i_icon",
          children: [
            {
              childName: "New Sale Report",
              childImage: "deliveryslip",
              childPath: "/salereport",
            },
            {
              childName: "Goods Return",
              childImage: "sale",
              childPath: "/listofsalebills",
            },
            {
              childName: "Sales Summary",
              childImage: "deliveryslip",
              childPath: "/listofdeliveryslips",
            },
            {
              childName: "List of Barcodes",
              childImage: "deliveryslip",
              childPath: "/listofreturnslips",
            },
            {
              childName: "List of promotions", childImage: "deliveryslip",
              childPath: "/listofPromotions"
            }
          ],
        },
        {
          parentName: "URM Portal",
          path: "/users",
          parentImage: "icon-r_brand fs-30 i_icon",
          children: [
            { childName: "Users", childImage: "deliveryslip", childPath: "/users" },
            { childName: "Roles", childImage: "sale", childPath: "/roles" },
            { childName: "Stores", childImage: "deliveryslip", childPath: "/stores" },
            { childName: "Domain", childImage: "deliveryslip", childPath: "/domain" },
          ],
        },
        {
          parentName: "HR Portal",
          path: "/hrPortal",
          parentImage: "icon-hsn fs-30 i_icon",
          children: [

          ],
        },
      ],
      iconsName:'icon-c_portal'
    }
  }


  componentWillMount() {
    const selectedDomain = sessionStorage.getItem("selectedDomain");
    const selectedStore = JSON.parse(sessionStorage.getItem("selectedstoreData"));
    const domainName = sessionStorage.getItem("domainName");
    const user = JSON.parse(sessionStorage.getItem("user"));
    const planExpiryDate = sessionStorage.getItem("planExpiryDate");
    const clientName = sessionStorage.getItem("clientName");
    this.setState({clientName : clientName})
    if(planExpiryDate !== '') {
      this.setState({
        planExpairyDate: planExpiryDate
      })
    }
   
    if(domainName === "client_support"){
      this.state.roleName = "client_support";
      this.state.user = user["name"];
      this.setState({isClientSupport : true});
     
    } else {
      this.state.user = user["cognito:username"];
      this.state.roleName = user["custom:roleName"];
    }
   
    this.state.storeName = selectedStore ? selectedStore.storeName : "";
    if(domainName === "config_user"){
      this.setState({storenameFlag:false})
    }
    if(domainName === "client_support" || domainName ==="ticketing_person" || domainName ==="captain"){
      this.setState({storenameFlag:false})
    }
    
    // window.location.reload();
    // const currentRoute = this.state.moduleNames.find(
    //   route => matchPath(this.props.location.pathname, route.)
    // )
    //console.log(`My current route key is : ${currentRoute.key}`)
   
    // console.log( this.state.headertype);
    
        if(domainName === "config_user") {
      let header;
       this.state.headertype = "Accounting Portal";
      
       eventBus.dispatch("subHeader", { message: this.state.headertype });
          header = [
            {
              name: "Accounting Portal",
              id:'2',
              path: "/stores",
              parentImage: "icon-r_brand fs-30 i_icon",
              children: [
                //  { childName: "Domain", childImage: "deliveryslip", childPath: "/domain" },
                { childName: "Stores", childImage: "deliveryslip", childPath: "/stores" },
               ],
            },
            {
              name: "URM Portal",
              id:'1',
              path: "/users",
              parentImage: "icon-r_brand fs-30 i_icon",
              children: [
                { childName: "Users", childImage: "deliveryslip", childPath: "/users" },
                { childName: "Roles", childImage: "sale", childPath: "/roles" },
                { childName: "Back Office", childImage: "sale", childPath: "/backOffice" },
                { childName: "Payment", childImage: "sale", childPath: "/payment" },
              ],
            },
            {
              name: "Back Office",
              id:'3',
              path: "/backOffice",
              parentImage: "icon-r_brand fs-30 i_icon",
              children: [
                { childName: "State & Districts", childImage: "sale", childPath: "/backOffice" },
                { childName: "Tax Master", childImage: "deliveryslip", childPath: "/taxMaster" },
                { childName: "HSN Codes", childImage: "sale", childPath: "/hsnDetails" },
              ],
            }
          
           
    
          ];
          const dropData = [
            {
              value: 4,
              label: "Logout"
            }
          ];

          this.setState({dropData:dropData})
         this.setState({moduleNames: header});
         this.setState({ selectedCategory: header[0]});
    } else if(user["custom:isSuperAdmin"] === "true") {
      const clientId =  user["custom:clientId1"];
    //   URMService.getMasterDomainsList().then((res) => {
    //     if(res) {
    //         this.setState({domainLists: res.data.result}, () => {
    //           this.getDomains();
    //         });
            
    //     } 
    // });


  //   URMService.getDomainsList(clientId).then((res) => { 
  //     if(res) {
  //      console.log(res.data.result);
  //       this.setState({domainLists: res.data.result}, () => {
  //                   this.getDomains();
  //                 });
  //     }
     
  // });
  this.getDomains();
    }
     else {
       if(user["cognito:groups"] && user["cognito:groups"][0] !== "config_user") {
        URMService.getSelectedPrivileges(user["custom:roleName"]).then(res => {
          if(res && res.data && res.data){
            let finalResult = this.groupByprivilegeType(res.data.parentPrivileges);
            this.setState({moduleNames: finalResult.web});
            this.setState({ selectedCategory: res.data.parentPrivileges[0]});
            eventBus.dispatch("subHeader", { message: (res.data && res.data.parentPrivileges.length>0)?res.data.parentPrivileges[0].id:"" });
          }
         
        });
      
       }
       else{
        URMService.getSelectedPrivileges("client_support").then(res => {
          if(res && res.data && res.data){
            let finalResult = this.groupByprivilegeType(res.data.parentPrivileges);
            this.setState({moduleNames: finalResult.web});
            this.setState({ selectedCategory: res.data.parentPrivileges[0]});
            eventBus.dispatch("subHeader", { message: (res.data && res.data.parentPrivileges.length>0)?res.data.parentPrivileges[0].id:"" });
          }
         
        });

       }
   
       this.getDomains();
    }
   console.log(this.state.moduleNames)
  
}
  groupByprivilegeType = (array) => {
    let initialValue = {
        mobile: [], 
        web: []
    }            
    return array.reduce((accumulator, current) => {
        (current.previlegeType === 'Mobile') ? accumulator.mobile.push(current) : accumulator.web.push(current);
        return accumulator;
    }, initialValue);
} 
  

  getDomains() {
    let dataDrop = [];
    const user = JSON.parse(sessionStorage.getItem("user"));
    const clientId =  user["custom:clientId1"];
    const domainId = JSON.parse(sessionStorage.getItem("selectedDomain"));
       
    if(user["custom:isSuperAdmin"] === "true") { 
      // this.state.domainLists.forEach((ele, index) => {
      //   const obj  = {
      //     value: ele.id,
      //     label: ele.domaiName
      //   }
      //   dataDrop.push(obj);
      // });
     
      // if(domainId && domainId.label === "Retail") {
      //   this.state.domainId = 2;
      // } else if(domainId && domainId.label === "Textile") {
      //   this.state.domainId = 1;
      // }
      this.setState( ()=>{
        this.setAdminHeader();
      });
    } 
    else if(user["cognito:groups"] && user["cognito:groups"][0] !== "config_user" && user["custom:clientDomians"]) {
     
      // const clientDomainId = user["custom:clientDomians"].split(",")[0];
      // URMService.getDomainName(clientDomainId).then(res => {
        
      //   if(res) {
      //     const obj  = {
      //       value: res.data.result.id,
      //       label: res.data.result.domaiName
      //     }
      //     dataDrop.push(obj);
      //     sessionStorage.setItem("selectedDomain", JSON.stringify(dataDrop[1]));
      //     const domainName = JSON.parse(sessionStorage.getItem("selectedDomain"));
      //     this.setState({ selectedOption: domainName });
      //   }
      // });
    }

    const dropLogout = 
    {
      value: 4,
      label: "Logout"
    };
  dataDrop.push(dropLogout);
  
  this.setState({dropData:dataDrop},()=> {
    console.log(this.state.dropData);
  //  sessionStorage.setItem("selectedDomain", JSON.stringify(dataDrop[1]));
  });
 
  const domainName = JSON.parse(sessionStorage.getItem("selectedDomain"));
  this.setState({ selectedOption: domainName });

  if(domainName === "config_user") {
  
     eventBus.dispatch("subHeader", { message: this.state.headertype });
  }
 
  } 
 
  removeDuplicates(array, key) {
    const lookup = new Set();
    return array.filter(obj => !lookup.has(obj[key]) && lookup.add(obj[key]));
  }


  logOut = () => {
    this.props.history.push("/");
    sessionStorage.removeItem("selectedDomain");
    sessionStorage.removeItem("clientId");
    window.location.reload();
  }

  handleChange = e => {
   
   
    sessionStorage.setItem("selectedDomain", JSON.stringify(e));
    if (e.label === 'Logout') {
      sessionStorage.removeItem("selectedDomain");
      sessionStorage.removeItem("clientId");
      this.props.history.push("/");
        sessionStorage.clear();
      window.location.reload();
    } else {
     
      if (e.label === 'Textile') {
       
       this.setState({domainId : 1}, () => {
        this.setAdminHeader();
      });
      this.state.headertype = "Dashboard";
      this.setAdminHeader();
      } else if (e.label === 'Retail') {
 
        this.setState({domainId : 2}, () => {
          this.setAdminHeader();
        });
        this.state.headertype = "Retail";
      
   
      } else if (e.label === 'Electronics') {
        this.props.history.push("electronics");
        window.location.reload();
      } else if (e.label === 'Admin') {
        this.state.headertype = "URM Portal";
       this.setAdminHeader();
      } else if(e.label === 'MultiDomain') {
        this.props.history.push("retail");
      }
      this.setState({ selectedOption: e });
     
     
    }
  }

  setAdminHeader() {
    
 
  const user = JSON.parse(sessionStorage.getItem("user"));
  if(this.state.user !== "config_user" && user["custom:isSuperAdmin"] === "true") { 

    URMService.getAllPrivileges().then(res => {
      console.log(res);
      if(res) {
       
        this.setState({moduleNames: res.data});
        console.log(this.state.moduleNames)
        this.props.history.push("/dashboard");
        eventBus.dispatch("subHeader", { message: (res.data && res.data.length>0)?res.data[0].id:"" });
      }
    });

  } else {
    URMService.getSelectedPrivileges(user["custom:roleName"]).then(res => {
      this.setState({moduleNames: res.data.parentPrivileges});
      eventBus.dispatch("subHeader", { message: (res.data && res.data.parentPrivileges.length>0)?res.data.parentPrivileges[0].id:"" }
      );
    });
  }
   
  
  }

  getChilds() {
    let parentPath;
  //  eventBus.dispatch("subHeader", { message: this.state.headertype });
    this.state.moduleNames.forEach(ele => {
      if (ele.parentName == this.state.headertype) {
        parentPath = ele.path
      }
      this.props.history.push(parentPath);
      

    }); 
    if(this.state.headertype === "Retail") {
      this.props.history.push("retail");
      window.location.reload();
    }
  }

  

  handleSelectChange = (e, item, image) => {
    console.log(e.target.value);
    const domainName = sessionStorage.getItem("domainName");
    let parentPath;
    this.setState({headertype: e.target.value, selectedCategory: item, selectedImage: image});
    eventBus.dispatch("subHeader", { message: item.id });
    console.log(this.state.moduleNames);
    this.state.moduleNames.forEach(ele => {
      if (ele.name == e.target.value) {
        if(ele.path) {
          parentPath = ele.path;
        } else {
          if(ele.subPrivillages) {
            parentPath = ele.subPrivillages[0].childPath;
          }
        }
       
       if(domainName === "config_user") {
        eventBus.dispatch("subHeader", { message: ele.name });
       }
       if(domainName === "client_support") {
        eventBus.dispatch("subHeader", { message: ele.id });
       }
        
      } 
      
      

    });
   
   
      // if(parentPath) {
      //   this.props.history.push(parentPath);
      // } else {
      //   this.props.history.push("/dashboard");
      // }

   

  }

  render() {
    let domainList;
    const modules = this.state.moduleNames;

    let modulesList = modules.length > 0
      && modules.map((item, i) => {
        {
          return item.name && (
            <option key={i} value={item.id}>{item.name}</option>
          )
        }
        // return (
          
        //   <option key={i} value={item.id}>{item.name}</option>
        //   // <option key={i} value={item.parentName}>{item.parentName}</option>
        // )
      }, this);

    //   if(this.state.domainsList && this.state.domainsList.length > 0) {
    //     const modules = this.state.domainsList;
    //   domainList = modules.length > 0
    //         && modules.map((item, i) => {
    //             return (

    //                 <option key={i} value={item.domain}>{item.domain}</option>
    //             )
    //         }, this);
    // }


    return (

      <div className="row">
        <div className="col-sm-4 col-xs-12">
          <div className="row">
            <div className="col-6 header-logo">
              <img src={logosm} />
            </div>
            <div className="col-6">
              <div className="module_select">
              <Dropdown>
                      {this.state.selectedCategory === ''? <Dropdown.Toggle className="drop-tog" variant="success">Select Module</Dropdown.Toggle>
                       : <Dropdown.Toggle className="drop-tog pt-0" variant="success"><i className={`fs-25 ${this.state.selectedCategory.parentImage}`}></i> {this.state.selectedCategory.name}</Dropdown.Toggle> }
                      <Dropdown.Menu>
                        {modules.map((item, i) => (                        
                          <Dropdown.Item
                            key={i}
                            as="button"
                            href={item.path}
                            value={item.name}
                            onClick={(e) => this.handleSelectChange(e, item, item.parentImage)}
                          >
                             {/* <img src={item.parentImage} />*/}
                             <i className=  {`fs-20 ${item.parentImage}`}></i> {item.name} 
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                {/* <img src={portal_icon} />
                <select value={this.state.headertype} onChange={this.handleSelectChange}>

                  {modulesList}
                </select > */}

                {/* <Dropdown>
                    <Dropdown.Toggle className="drop-tog" variant="success">
                      Select Category
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>
                      <img className="" src={portal_menu} /> Customer Portal
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <img src={Inventory_img} /> Inventory Portal
                      </Dropdown.Item>
                      <Dropdown.Item>
                      <img src={Promotions_img} /> Promotions & Loyalty
                      </Dropdown.Item>
                      <Dropdown.Item>
                      <img src={Accounting_img} /> Accounting Potal
                      </Dropdown.Item>
                      <Dropdown.Item>
                      <img src={Reports_img} /> Reports
                      </Dropdown.Item>
                      <Dropdown.Item>
                      <img src={URM_img} /> URM Portal
                      </Dropdown.Item>
                      <Dropdown.Item>
                      <img src={HR_img} /> HR Portal
                      </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown> */}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="text-left">
          <img src={logosm} />
        </div> */}
        {/* <select  onChange={this.handleSelectChange}>
            {modulesList}
          </select > */}
        <div className="col-sm-8 col-xs-12 text-right">
          {/* <div className="col-6">
                        <div className="header-left d-flex">
                        <img src={cashmemo} /> 
                        <h6>{this.props.headerTitle}</h6>

                        </div>
                    </div> */}
          <div className="row">
            <div className="col-sm-7">
              {this.state.planExpairyDate && <div className='head-text'>
                <CountDownTimmer dateToEndCountdownAt={this.state.planExpairyDate} />
              </div>}
              <div className='head-text'>
                  Role : <span> {this.state.roleName && this.state.roleName[0].toUpperCase()+this.state.roleName.substring(1)}</span>
              </div>
              {
            this.state.storenameFlag  && (<div className='head-text'>
                
                
                Store : <span> {this.state.storeName && this.state?.storeName[0].toUpperCase()+this.state?.storeName.substring(1)}</span>
              
              </div>)
           }
           { this.state.isClientSupport &&
            (<div className='head-text'>
            Client Name : <span> {this.state.clientName && this.state.clientName[0].toUpperCase()+this.state.clientName.substring(1)}</span>
      
        </div>)
           }
            </div>
            {/* <div className="col-5 search_bar">
              <form className="form-inline my-2 my-lg-0 ml-2">
                <input className="form-control" type="search" placeholder="Search by bill no, barcode etc..."
                  aria-label="Search" />
                <button className="search_head my-2 my-sm-0" type="submit"></button>
              </form>
            </div> */}
            <div className="col-sm-5 col-xs-12 text-right">
           
              
              <div className="header-right float-right">

              {/* <Dropdown>
                    <Dropdown.Toggle className="drop-tog" variant="success">
                      Select Category
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>
                      <img className="" src={portal_menu} /> Customer Portal
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <img src={Inventory_img} /> Inventory Portal
                      </Dropdown.Item>
                      <Dropdown.Item>
                      <img src={Promotions_img} /> Promotions & Loyalty
                      </Dropdown.Item>
                      <Dropdown.Item>
                      <img src={Accounting_img} /> Accounting Potal
                      </Dropdown.Item>
                      <Dropdown.Item>
                      <img src={Reports_img} /> Reports
                      </Dropdown.Item>
                      <Dropdown.Item>
                      <img src={URM_img} /> URM Portal
                      </Dropdown.Item>
                      <Dropdown.Item>
                      <img src={HR_img} /> HR Portal
                      </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown> */}
                <ul className="navbar-nav">
                  {/* <li className="nav-item upper-case">{this.props.user.name}</li> */}
                  {/* <li className="nav-item upper-case">Ashok</li>  */}
                  {/* <li className="nav-item">Help</li> */}
                  <li className="nav-item dropdown">
                    {/* <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> */}
                    {/* <img src={profile}  className="rounded-circle" />  */}
                    <div className="itemMain">
                      <div className="itemMain-left">
                        <i className="icon-tag_customer"></i>
                      </div>
                      <div className="itemMain-right text-left">
                        <div className='text_parent pt-2'>
                        <span className="text-left p-l-2 mb-0 ellipsis">{this.state.user[0].toUpperCase()+this.state.user.substring(1)}</span>
                        </div>
                        <Select className="align drop_select"
                          value={this.state.selectedOption} // set selected value
                          options={this.state.dropData} // set list of the data
                          onChange={this.handleChange} // assign onChange function
                        />

                        {/* <select className="form-control align" onChange={this.handleChange}>

                          {domainList}
                        </select > */}
                      </div>

                    </div>
                    {/* <span className="text-left mb-0 d-flex"><i className="icon-tag_customer fs-30 p-r-2"></i> Kevin Suda</span>
                        <Select 
        value={this.state.selectedOption}
        options={this.state.dropData} 
        onChange={this.handleChange} 
      /> */}
                    {/* </a> */}
                    {/* <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <a className="dropdown-item" href="#">Dashboard</a>
                        <a className="dropdown-item" href="#">Edit Profile</a>
                        <a className="dropdown-item" href="#">Log Out</a>
                        </div> */}

                  </li>
                </ul>
              </div>
              {/* <button className="logout" onClick={this.logOut}>logout</button> */}
            </div>
            {/* <h2>{this.props.user.firstName}</h2>   */}

          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Header)
