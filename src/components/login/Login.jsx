import jwt_decode from "jwt-decode";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import active from "../../assets/images/active_package.svg";
import adminImg from "../../assets/images/adminIMG1.svg";
import close from '../../assets/images/cross.svg';
// import Logo from "../../assets/images/retail_logo.svg";
import ecommerce from "../../assets/images/ecommerce.svg";
import electronics from "../../assets/images/electrical_electronics.svg";
import inactive from "../../assets/images/inactive_package.svg";
import retailIcon from "../../assets/images/logo_icon.svg";
import plans from "../../assets/images/price_plans.svg";
import Logo from "../../assets/images/R_logo.svg";
import sanitary from "../../assets/images/sanitary.svg";
// import { LogoNew } from "../../assets/images/R_logo.svg";
import textile from "../../assets/images/textile.svg";
import eventBus from '../../commonUtils/eventBus';
import {
  errorLengthMin, forgot_err_msg, login_err_msg, update_Pass_Err_Msg
} from "../../commonUtils/Errors";
import LoginService from "../../services/LoginService";
import URMService from "../../services/URM/URMService";
// import font from "../../assets/fonticons"
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      isEstimationSlip: false,
      isTaxIncluded: false,
      isAuth: false,
      userName: "",
      password: "",
      dropValue: "",
      value: "en",
      user: {
        name: "",
      },
      storeNames: [],
      domainsList: [],
      isModel: false,
      showModal:false,
      isRegister: false,
      isCheckBox:false,
      isLogin: true,
      isStores: false,
      isForgot: false,
      showViewModal:false,
      showModalview: false,
      isconfirmPassword: false,
      errors: {},
      roleName: "",
      confirmationCode: "",
      newForgotPassword: "",
      storeId: "",
      domainId: "",
      planName: "",
      roleList: [],
      roleDataList: [],
      userId: "",
      clientList: [],
      isTaxApplied:'',
      plan: "",
      planList: [],
      expairyModal: false,
      renewalModal: false,
      systemTime: '',
      planExpiryDate: '',
      planExpairyMessage: '',
      plansList:[],
      planId: 0,
      planTenure: "",
      price: "",
      modelList: [],
      selectOptionPlan: [
        {
          name: "SELECT",
          id:"SELECT",
        },
        {
          name: "Basic",
          id: "Basic",
        },
        {
          name: "Standard",
          id: "Standard",
        },
        {
          name: "Premium",
          id: "Premium",
        },
       
      ],
      selectOptionTenure: [
        {
          name: "SELECT",
          id: "SELECT",
        },
        {
          name: "OneMonth",
          id: "OneMonth",
        },
        {
          name: "ThreeMonths",
          id: "ThreeMonths",
        },
        {
          name: "SixMonths",
          id: "SixMonths",
        },
        {
          name: "OneYear",
          id: "OneYear",
        },
      ],
    };

    sessionStorage.setItem("lang", this.state.value);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.hideRegister = this.hideRegister.bind(this);
    this.showRegister = this.showRegister.bind(this);
    this.registerClient = this.registerClient.bind(this);
    this.hideChangePassword = this.hideChangePassword.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.validation = this.validation.bind(this);
    this.emailValidation = this.emailValidation.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.saveForgotPassword = this.saveForgotPassword.bind(this);
    this.getConfirmationCode = this.getConfirmationCode.bind(this);
    this.getStoreDetails = this.getStoreDetails.bind(this);
    this.forgotPasswordValidations = this.forgotPasswordValidations.bind(this);
    this.changePasswordValidation = this.changePasswordValidation.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleCheckBox = this.handleCheckBox.bind(this);
    this.getUsersByRollName = this.getUsersByRollName.bind(this);
    this.hideCreateUser = this.hideCreateUser.bind(this);
    this.addView = this.addView.bind(this);
    this.showCreateRole = this.showCreateRole.bind(this);
    this.showPlan = this.showPlan.bind(this);
    this.addClient = this.addClient.bind(this);
    this.getPlanDetails = this.getPlanDetails.bind(this);
    this.handlePlanChange = this.handlePlanChange.bind(this);
    this.navBasedOnRle = this.navBasedOnRle.bind(this);
    this.viewPlans = this.viewPlans.bind(this);
    this.handleCheckAplicable = this.handleCheckAplicable.bind(this);
  }

  componentWillMount() {
    sessionStorage.removeItem("selectedDomain");
    // this.getUsersByRollName();
    //this.state.storeNames = data
    // this.viewPlans();
  }

  componentDidMount() {
    if(localStorage.isCheckBoxChecked === 'true') {
      this.setState({
        userName:  localStorage.username,
        password:  localStorage.password,
        isCheckBox: true
      });
    }
  }
  handlePlanChange(e) {
    let selectedPlan = this.state.planList.filter((plan) => plan.value === e.target.value); 
    if (e.target.value != "SELECT") {
      this.setState({
        planName: e.target.value,
        planId: selectedPlan[0].id
      });
    }
  }
  handleChangeVal = (e) => {
    this.setState({ role: e.target.value }, () => {
      if(this.state.role !== 'ticketing_person' && this.state.role !== 'client_support') {
        LoginService.checkPlanExpairy(this.state.role).then((res) => {
          if(res.data.result !== null) {
              let expairyDate = new Date(res.data.result['planExpiryDate'].split('T')[0]);
              // let stimeStamp = '2022-11-01T12:59:13.801';
              // let expairyDate = new Date(stimeStamp.split('T')[0]);
              let systemDate = new Date(res.data.result['systemTime'].split('T')[0]);

              const oneDay = 24 * 60 * 60 * 1000;
              const currentDateFormat = new Date(systemDate.getFullYear(), systemDate.getMonth(), systemDate.getDate());
              const expairyDateFormat = new Date(expairyDate.getFullYear(), expairyDate.getMonth(), expairyDate.getDate());
              const diffDays = Math.round((expairyDateFormat - currentDateFormat) / oneDay);
              if(diffDays > 14) {
                sessionStorage.setItem("planExpiryDate", '');
                this.setState({expairyModal: false}, () => {
                  URMService.getSubPrivilegesbyRoleId(this.state.role).then((res) => {
                    if (res) {
                      if(res.data.parentPrivileges !== null){
                      const subPrivilegesList = res.data.parentPrivileges;
                      this.props.history.push(
                        subPrivilegesList[0].subPrivileges[0].childPath
                      );
                      }
                    }
                  });
                });
              } else if(diffDays <= 14 && diffDays > 0) {
                sessionStorage.setItem("planExpiryDate", res.data.result['planExpiryDate']);
                
                this.setState({
                  expairyModal: true, 
                  diffDays: diffDays,
                  planExpairyMessage: `Your plan is going to be expaired in ${diffDays} days`
                });  
              } else if(diffDays < 0) {
                sessionStorage.setItem("planExpiryDate", res.data.result['planExpiryDate']);
                
                this.setState({
                  isStores: false, 
                  expairyModal: false,
                  renewalModal: true,
                  diffDays: '', 
                  planExpairyMessage: `Your plan is going to be expaired.`
                });
              } else if(diffDays === 0) {
                sessionStorage.setItem("planExpiryDate", res.data.result['planExpiryDate']);
                
                this.setState({
                  isStores: false, 
                  expairyModal: true, 
                  diffDays: diffDays,
                  planExpairyMessage: `Your plan is going to be expaired today.`
                }); 
              }
          }
        }); 
      }      
    });
  };
  hideCreateUser() {
    this.setState({ showModal: false });
  }

  addView() {
    this.setState({ showModal: true });
  }

  showCreateRole() {
    this.setState({ showModal: true });
    // this.getUsersByRollName();
  }
  hidePlan= (e) =>{
    this.setState({ showModalview: false});
  }
  
  showPlan() {
    this.setState({ showModalview: true});
    this.viewPlans();
    
     }
  handleSelect(e) {
    if (e.target.value != "SELECT") {
      this.setState({
        planTenure: e.target.value,
      });
    }
  }
  navBasedOnRle() {
    if (this.state.role === "client_support") {
      this.addClient();
    } else {
      const role = JSON.parse(sessionStorage.getItem("user"));
      role["cognito:groups"][0] = "ticketing_person";
      role["custom:assignedStores"] = "ticket:2276";
      role["custom:roleName"] = "ticketing_person";
      sessionStorage.setItem("user", JSON.stringify(role));
      sessionStorage.setItem("domainName", role["cognito:groups"][0]);
      //  this.props.history.push('/openTickets')
      this.getPath();
    }
  }

  addClient() {
    const { clientList, role } = this.state;
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.setState({ showModal: false }, () => {
      if (this.state.role === "client_support") {
        this.getUsersByRollName();
        return;
      }

      user["custom:clientId1"] = this.state.role;
      user["custom:isConfigUser"] = "true";
      sessionStorage.removeItem("user");
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("clientId", this.state.role);
      // URMService.getSubPrivilegesbyRoleId(user["custom:roleName"]).then(
      //   (res) => {
      //     if (res) {
      //       //  this.setState({buttonsList: res.data.result});
      //       const parentPrivileges = res.data.parentPrivileges;
      //       this.props.history.push(parentPrivileges[0].childPath);
      //     }
      //   }
      // );
      // this.getPath();

      this.props.history.push("/stores");
    });
  }

  getPlanDetails() {
    this.setState({ planList: [] });
    LoginService.getPlanDetails().then((res) => {
      if (res) {
        res?.data?.result?.forEach((ele, index) => {
          const obj = {
            id: ele.id,
            // value:ele.planName.concat(" ").concat(ele.planTenure),
            // lable:ele.planName.concat(" ").concat(ele.planTenure)
            value: ele.planName,
            lable: ele.planName,
            price: ele.price,
          };
          this.state.planList.push(obj);
        });
        this.setState({ planList: this.state.planList });
      } else {
        this.setState({ planList: [] });
      }
    });
  }

  removeDuplicates(array, key) {
    const lookup = new Set();
    return array.filter((obj) => !lookup.has(obj[key]) && lookup.add(obj[key]));
  }

  handleRadioChange(event) {
    // set the new value of checked radion button to state using setState function which is async funtion
    this.setState({
      value: event.target.value,
    });
    const newLang = event.target.value;
    this.props.i18n.changeLanguage(newLang);
    sessionStorage.setItem("lang", newLang);
  }

  handleChange = (e) => {
    this.setState({ dropValue: e.label });
  };
  handleUserName = (e) => {
    this.setState({ userName: e.target.value })
  }
                          
handleCheckBox = (e) => {  
  if(e.target.checked){
     this.setState({ isCheckBox: e.target.checked });
  } else{
      this.setState({ isCheckBox: false , userName: '', password: ''}, () => {     
      localStorage.clear();
    });

  }
}
viewPlans(){
  LoginService.getAllPlans().then((res)=>{
    this.setState({plansList : res.data})
  })
}
  login = () => {
    if (this.state.userName && this.state.password) {
      const obj = {
        email: this.state.userName,
        password: this.state.password,
      };
  

      LoginService.getAuth(obj).then((res) => {
        if (res && res.data && res.status === 200) {
          localStorage.username = this.state.userName;
          localStorage.password = this.state.password;
          localStorage.isCheckBoxChecked = this.state.isCheckBox;
          if (res.data.authenticationResult) {
            const token = res.data.authenticationResult.idToken;
            sessionStorage.setItem("user", JSON.stringify(jwt_decode(token)));
            sessionStorage.setItem("token", JSON.stringify(token));
            // this.getDropdownList();
            const role = JSON.parse(sessionStorage.getItem("user"));
            if (role["cognito:groups"][0] === "captain") {
              role["custom:assignedStores"] = "captain:2266";
              sessionStorage.setItem("clientId", "0");
              sessionStorage.setItem("user", JSON.stringify(role));
            }
            if (
              role["cognito:groups"][0] === "captain" ||
              role["cognito:groups"][0] === "ticketing_person"
            ) {
              role["custom:assignedStores"] = "captain:2266";
              sessionStorage.setItem("user", JSON.stringify(role));
            }
            if (role["cognito:groups"]) {
              if (role["cognito:groups"][0] === "super_admin") {
                // this.getModel();
                this.getStores();
              } else if (role["cognito:groups"][0] === "config_user") {
                sessionStorage.setItem("domainName", role["cognito:groups"][0]);
                this.props.history.push("/stores");
              } else if (role["cognito:groups"][0] === "client_support") {
                const user = JSON.parse(sessionStorage.getItem("user"));

                sessionStorage.setItem("domainName", role["cognito:groups"][0]);
                 sessionStorage.setItem("clientId",user["custom:clientId1"]);
                this.setState({
                  userName: user["cognito:username"],
                  isEdit: false,
                  loggedUserId: user["custom:userId"],
                  clientId: user["custom:clientId1"],
                });
                this.getUsersByClient();
              } else {
                const user = JSON.parse(sessionStorage.getItem("user"));
                if( role["cognito:groups"][0] !== "captain"){
                    sessionStorage.setItem("clientId",user["custom:clientId1"]);
                }
                sessionStorage.setItem("domainName", role["cognito:groups"][0]);
                // sessionStorage.setItem("clientId",user["custom:clientId"]);
                this.getStores();
              }
            } else {
              this.getStores();
            }

            // if(role["custom:assignedStores"]){
            //   const table = role["custom:assignedStores"].split(",").map(pair => pair.split(":"));
            //   sessionStorage.setItem("storeId", table[0][1]);
            //   console.log(table[0][1]);
            // }

            //     const table1 = table.split(",").map(pair => pair.split(":")); //[["key","value"],["key","value"]]
            //     console.log(table1);
            //     const result = Object.values(table1);
            //     console.log(result);
          } else {
            if (res.data.challengeName === "NEW_PASSWORD_REQUIRED") {
              const roleData = res.data
                ? JSON.parse(res.data.challengeParameters.userAttributes)
                : "";
              this.setState({
                isChangePassword: true,
                isRegister: false,
                isForgot: false,
                isLogin: false,
                sessionData: res.data.session,
                roleName: roleData["custom:roleName"],
              });
            }
          }
        } else {
          // toast.error('Invalid Credentials');
          this.setState({ userName: "", password: "", selectedOption: null });
          sessionStorage.removeItem("user");

          //  window.location.reload();
        }
      });

      //  this.props.history.push("/domain");
    } else {
      toast.error("Please Enter UserName and Password");
    }
  };

  getStores() {
    const role = JSON.parse(sessionStorage.getItem("user"));
    if (role["custom:isSuperAdmin"] === "true") {
      // const domain = JSON.parse(sessionStorage.getItem('selectedDomain'));
      URMService.getStoresByDomainId(role["custom:clientId1"]).then((res) => {
        if (res) {
          let store = [];
          const storeData = res.data;
          storeData.forEach((storeData) => {
            const obj = {
              storeName: storeData.name,
              storeId: storeData.id,
            };
            store.push(obj);
          });
          this.setState({ storesName: store }, () => {
            sessionStorage.setItem("storeId", this.state.storesName[0].storeId);
            sessionStorage.setItem(
              "selectedstoreData",
              JSON.stringify(this.state.storesName[0])
            );
          });

          if (store && store.length > 1) {
            this.setState({ isStores: true });
          } else {
            sessionStorage.setItem("storeId", this.state.storesName[0].storeId);
            sessionStorage.setItem(
              "selectedstoreData",
              JSON.stringify(this.state.storesName[0])
            );
            this.props.history.push("/dashboard");
          }
        }
      });
    } else if (role["custom:assignedStores"]) {
   
    if(role["cognito:groups"][0] !== "captain"){
      const store = [];
      LoginService.getStoresByuserId(role["custom:userId"]).then((res)=>{
        res.data.forEach((element, index) => {
           const obj = {
             storeName: element.name,
             storeId: element.id
           };
           store.push(obj);
         });
         this.setState({ storesName: store }, () => {
          sessionStorage.setItem("storeId", this.state.storesName[0]?.storeId);
          sessionStorage.setItem(
            "selectedstoreData",
            JSON.stringify(this.state.storesName[0])
          );
        });
  
        if (store && store.length > 1) {
          this.setState({ isStores: true });
        } else {
          sessionStorage.setItem("storeId", this.state.storesName[0]?.storeId);
          sessionStorage.setItem(
            "selectedstoreData",
            JSON.stringify(this.state.storesName[0])
          );
          this.getDashboard();
        }
       });
    }else {
         const table = role["custom:assignedStores"]
        .split(",")
        .map((pair) => pair.split(":"));
        const store = [];
      table.forEach((element, index) => {
        if (element[0] && element[1]) {
          const obj = {
            storeName: element[0],
            storeId: element[1],
          };
          store.push(obj);
        }
      });
      this.setState({ storesName: store }, () => {
        sessionStorage.setItem("storeId", this.state.storesName[0]?.storeId);
        sessionStorage.setItem(
          "selectedstoreData",
          JSON.stringify(this.state.storesName[0])
        );
      });
      sessionStorage.setItem("storeId", this.state.storesName[0]?.storeId);
      sessionStorage.setItem(
        "selectedstoreData",
        JSON.stringify(this.state.storesName[0])
      );
      this.getDashboard();
    }

    } else {
      this.props.history.push("/dashboard");
    }
  }

  getUsersByClient() {
    this.setState({ roleList: [] });
    this.setState({
      showModal: true,
      modelId: 1,
      modelTitle: "Please select role",
      modelListTitle: "Select Role",
      modelList: [
        { id: "ticketing_person", value: "Ticketing Person" },
        { id: "client_support", value: "Client Support" },
      ],
    });
  }

  getUsersByRollName() {
    // this.setState({roleList: []})
    this.setState({
      modelId: 2,
      modelTitle: "Select Client",
      modelListTitle: "Select Client",
      modelList: [],
    });
    let clients = [];
    LoginService.getUsersByRollName(this.state.loggedUserId).then(
      (response) => {
        // this.setState({ showModal: true });
        response?.data?.result?.forEach((ele, index) => {
          const obj = {
            id: ele.id,
            value: ele.name,
            label: ele.name,
          };
          clients.push(obj);
          // this.props.history.push("/stores");
          this.setState({ clientList: response?.data?.result });
        });

        if (clients?.length == 0) {
        } else if (clients?.length == 1) {
          const user = JSON.parse(sessionStorage.getItem("user"));
          this.setState({ role: this.state.clientList[0].id });
          user["custom:clientId1"] = this.state.role.toString();
          user["custom:isConfigUser"] = "true";
          sessionStorage.removeItem("user");
          sessionStorage.setItem("user", JSON.stringify(user));
          sessionStorage.setItem("clientId", this.state.role);
          URMService.getSubPrivilegesbyRoleId(user["custom:roleName"]).then(
            (res) => {
              if (res) {
                //  this.setState({buttonsList: res.data.result});
                const parentPrivileges = res.data.parentPrivileges;
                this.props.history.push(parentPrivileges[0].childPath);
              }
            }
          );
          // temp(clients?.id).then(()=>{
          //   navigate()
          // })
          this.props.history.push("/stores");
        } else if (clients?.length > 1) {
          this.setState({ showModal: true });
          // this.props.history.push("/stores");
        }
        sessionStorage.setItem("clientId", this.state.clientList[0]?.id);
        // this.setState({ roleList: clients });
        this.setState({ modelList: clients });
      }
    );
  }

  getDashboard() {
    const role = JSON.parse(sessionStorage.getItem("user"));
    if (role["cognito:groups"]) {
      if (role["cognito:groups"][0] === "super_admin") {
        this.getModel();
      } else if (role["cognito:groups"][0] === "config_user") {
        sessionStorage.setItem("domainName", role["cognito:groups"][0]);
        // sessionStorage.setItem('selectedDomain', JSON.stringify(data2[0]));
        this.props.history.push("/stores");
      } else if (role["cognito:groups"][0] === "client_support") {
        sessionStorage.setItem("domainName", role["cognito:groups"][0]);
        // sessionStorage.setItem('selectedDomain', JSON.stringify(data2[0]));
        this.props.history.push("/stores");
      } else {
        sessionStorage.setItem("domainName", role["cognito:groups"][0]);
        //  sessionStorage.setItem('selectedDomain', JSON.stringify(data2[0]));
        // this.props.history.push("/dashboard");
        this.getPath();
      }
    } else if (role["custom:isSuperAdmin"] === "true") {
      // sessionStorage.setItem('selectedDomain', JSON.stringify(data2[0]));
      this.props.history.push("/dashboard");
    } else {
      toast.error("No Role Available");
      // sessionStorage.removeItem('user')
      // window.location.reload();
    }
  }
  validatePlanExpairy = () => {
    const role = JSON.parse(sessionStorage.getItem("user"));
    URMService.getSubPrivilegesbyRoleId(role["custom:roleName"]).then((res) => {
      if (res) {
        if(res.data.parentPrivileges !== null){
        const subPrivilegesList = res.data.parentPrivileges;
        this.props.history.push(
          subPrivilegesList[0].subPrivileges[0].childPath
        );
        }
      }
    });
  }

  renewalPlan = () => {
    this.setState({ isCheckBox: false , userName: '', password: '', showModal: false}, () => {     
      localStorage.clear();
    });
  }
  
  getPath() {    
        const role = JSON.parse(sessionStorage.getItem("user"));
        if( role["cognito:groups"][0] === "captain") {
          URMService.getSubPrivilegesbyRoleId(role["custom:roleName"]).then((res) => {
            if (res) {
              if(res.data.parentPrivileges !== null){
              const subPrivilegesList = res.data.parentPrivileges;
              this.props.history.push(
                subPrivilegesList[0].subPrivileges[0].childPath
              );
              }
            }
          });
        } else {
        LoginService.checkPlanExpairy(role["custom:clientId1"]).then((res) => {
          if(res.data.result !== null) {
            console.log("clientId",res.data.result)
           this.setState({
            systemTime: res.data.result['systemTime'],
            planExpiryDate: res.data.result['planExpiryDate']
           }, () => {
            sessionStorage.setItem("clientName",res.data.result.name);
             // static data to test senario plan expaired
              // const oneDay = 24 * 60 * 60 * 1000;
              // let stimeStamp = '2022-11-07T12:59:13.801';
              // let systemDate = new Date(stimeStamp.split('T')[0]);
              // const currDate = new Date();        
              // const currentDate = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate());
              // const expairyDate = new Date(systemDate.getFullYear(), systemDate.getMonth(), systemDate.getDate());
              // const diffDays = Math.round((expairyDate - currentDate) / oneDay);
            // static data to test senario

              let expairyDate = new Date(this.state.planExpiryDate.split('T')[0]);
              let systemDate = new Date(this.state.systemTime.split('T')[0]);
              const oneDay = 24 * 60 * 60 * 1000;
              const currentDateFormat = new Date(systemDate.getFullYear(), systemDate.getMonth(), systemDate.getDate());
              const expairyDateFormat = new Date(expairyDate.getFullYear(), expairyDate.getMonth(), expairyDate.getDate());
              const diffDays = Math.round((expairyDateFormat - currentDateFormat) / oneDay);
              if(diffDays > 14) {
                this.setState({expairyModal: false}, () => {
                  sessionStorage.setItem("planExpiryDate", '');
                  URMService.getSubPrivilegesbyRoleId(role["custom:roleName"]).then((res) => {
                    if (res) {
                      if(res.data.parentPrivileges !== null){
                      const subPrivilegesList = res.data.parentPrivileges;
                      this.props.history.push(
                        subPrivilegesList[0].subPrivileges[0].childPath
                      );
                      }
                    }
                  });
                });
              } else if(diffDays <= 7 && diffDays > 0) {
                sessionStorage.setItem("planExpiryDate", res.data.result['planExpiryDate']);
                this.setState({
                  expairyModal: true, 
                  diffDays: diffDays,
                  planExpairyMessage: `Your plan is going to be expaired in ${this.state.diffDays} days`
                });  
              } else if(diffDays < 0) {
                sessionStorage.setItem("planExpiryDate", res.data.result['planExpiryDate']);
                this.setState({
                  isStores: false, 
                  expairyModal: false,
                  renewalModal: true,
                  diffDays: '', 
                  planExpairyMessage: `Your plan is going to be expaired.`
                });
              } else if(diffDays === 0) {
                sessionStorage.setItem("planExpiryDate", res.data.result['planExpiryDate']);
                this.setState({
                  isStores: false, 
                  expairyModal: true, 
                  diffDays: diffDays,
                  planExpairyMessage: `Your plan is going to be expaired today.`
                }); 
              }
           });
          }
        });      
      }
  }

  changePasswordValidation() {
    let errors = {};
    let formIsValid = true;

    // new password

    // if(!this.state.newPassword) {
    //   errors["newpassword"] = 'Please Enter Password';
    // }
    if (this.state.newPassword.length < errorLengthMin.newPassword) {
      formIsValid = false;
      errors["newpassword"] = update_Pass_Err_Msg.newPassword;
    }

    // confirm password
    if (this.state.confirmPassword.length < errorLengthMin.confirmPassword) {
      formIsValid = false;
      errors["currentpassword"] = update_Pass_Err_Msg.confirmPassword;
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  changePassword() {
    if (this.state.newPassword && this.state.confirmPassword) {
      const formValid = this.changePasswordValidation();
      if (formValid) {
      if (this.state.newPassword == this.state.confirmPassword) {
          const obj = {
            userName: this.state.userName,
            password: this.state.password,
            newPassword: this.state.newPassword,
            session: this.state.sessionData,
            roleName: this.state.roleName,
          };

          LoginService.changePassword(obj).then((res) => {
            if (res) {
              toast.success("Password Changed Successfully");
              //    window.location.reload();
            }
            this.hideChangePassword();
          });
        } else {
          toast.error("New Passsword And Confirm Password  Doesn't Match");
        }
      }
    } else {
      toast.error("Please Enter Passsword And Confirm Password");
    }
  }

  hideChangePassword() {
    this.setState({
      isChangePassword: false,
      isLogin: true,
      userName: "",
      password: "",
      newPassword: "",
    });
    //  window.location.reload();
  }

  getModel() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const clientId = user["custom:clientId1"];
    URMService.getDomainsList(clientId).then((res) => {
      if (res) {
        this.state.domainsList = res.data.result;
        this.getDomains();
      }
    });

    // this.setState({
    //     isModel: true
    // });
  }

  getDomains() {
    this.state.domainsList.forEach((ele) => {
      if (ele.domaiName === "Textile") {
        ele.src = textile;
      } else if (ele.domaiName === "Retail") {
        ele.src = sanitary;
      } else if (ele.domaiName === "Electronics") {
        ele.src = electronics;
      } else if (ele.domaiName === "MultiDomain") {
        ele.src = adminImg;
      }
    });

    this.setState({ isModel: true });
  }

  hideModal() {
    this.setState({
      isModel: false,
    });
  }
  // handleDrop =  (e) => {
  //   this.setState({ showModal: true }, () => {
     
  //   })    
  // };
  handleClick(val, domainName, domainId) {
    this.setState({ domainId: domainId });
    // data1.forEach((ele, index) => {
    //     if (domainName === ele.label) {

    //         sessionStorage.setItem('selectedDomain', JSON.stringify(ele));
    //     }
    // });
    const obj = {
      value: domainId,
      label: domainName,
    };
    sessionStorage.setItem("selectedDomain", JSON.stringify(obj));
    this.getStores();
    // if (domainName === "Textile") {
    //   this.props.history.push("dashboard");
    // } else if (domainName === "Retail") {
    //   this.props.history.push("dashboard");
    // } else if (domainName === "Electronics") {
    //   this.props.history.push("electronics");
    // } else if (domainName === "Admin") {
    //   this.props.history.push("/domain");
    // } else if (domainName === "MultiDomain") {
    //   this.props.history.push("/retail");
    // }
  }

  // getStoresDropdown() {
  //   return (
  //     this.state.isStores && (
  //       <div>
  //         <Select
  //           className="m-t-3 upper-case select_control"
  //           placeholder="Select Store"
  //           value={this.state.selectedOption} // set selected value
  //           options={this.state.storeNames} // set list of the data
  //           onChange={this.handleChange} // assign onChange function
  //         />
  //       </div>
  //     )
  //   );
  // }

  showRegister() {
    this.setState({
      isRegister: true,
      isForgot: false,
      isLogin: false,
      isChangePassword: false,
      isconfirmPassword: false,
      userName: "",
      password: "",
    }, () => { this.getPlanDetails() });
  }

  forgotPassword() {
    this.setState({
      isForgot: true,
      isLogin: false,
      isRegister: false,
      userName: "",
      password: "",
      isChangePassword: false,
      isconfirmPassword: false,
    });
  }

  getConfirmationCode() {
    if (this.state.userName) {
      LoginService.getConfirmationCode(this.state.userName).then((res) => {
        if (res) {
          toast.success("Confirmation Code Sent To Mail");
          this.setState({
            isForgot: false,
            isLogin: false,

            password: "",
            confirmationCode: "",
            newForgotPassword: "",
            isRegister: false,
            isChangePassword: false,
            isconfirmPassword: true,
          });
        }
      });
    } else {
      toast.info("Please Enter UserName");
    }
  }

  forgotPasswordValidations() {
    let errors = {};
    let formIsValid = true;

    //newForgotPassword

    if (
      this.state.newForgotPassword.length < errorLengthMin.newForgotPassword
    ) {
      formIsValid = false;
      errors["newforgotpassword"] = forgot_err_msg.newForgotPassword;
    }

    //confirmationCode

    if (
      this.state.confirmationCode.length !== errorLengthMin.confirmationCode
    ) {
      formIsValid = false;
      errors["confirmationcode"] = forgot_err_msg.confirmationCode;
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  saveForgotPassword() {
    if (this.state.confirmationCode && this.state.newForgotPassword) {
      // const formValid = this.handleValidation();
      const formValid = this.forgotPasswordValidations();
      if (formValid) {
        this.setState({
          isForgot: false,
          isLogin: true,
          userName: "",
          password: "",
          isRegister: false,
          isChangePassword: false,
          isconfirmPassword: false,
          confirmationCode: "",
        });

        LoginService.changeForgotPassword(
          this.state.userName,
          this.state.confirmationCode,
          this.state.newForgotPassword
        ).then((res) => {
          if (res) {
            toast.success("Password Changed Successfully");
            // window.location.reload();
          }
          //  this.hideChangePassword();
        });
      }
    } else {
      toast.info("Please Enter Confirmation Code And New Password");
    }
  }

  hideRegister() {
    this.setState({
      isRegister: false,
      isForgot: false,
      isLogin: true,
      isChangePassword: false,
      isconfirmPassword: false,
    });
    this.setState({
      registerName: "",
      registerEmail: "",
      userName: "",
      password: "",
      registerOrganisation: "",
      registerMobile: "",
      registerAddress: "",
      registerDescription:""
    });
  }

  handleValidation() {
    let errors = {};
    let formIsValid = true;

    //Name
    if (this.state.registerName.length < errorLengthMin.registerName) {
      formIsValid = false;
      errors["registerName"] = login_err_msg.registerName;
    }

    // Organisation

    if (
      this.state.registerOrganisation.length <
      errorLengthMin.registerOrganisation
    ) {
      formIsValid = false;
      errors["registerOrganisation"] = login_err_msg.registerOrganisation;
    }

    // Mobile
    const patternRegExp = /^[0-9\b]+$/;
    let input = this.state.registerMobile;
    if (
      input.length !== errorLengthMin.registerMobile ||
      patternRegExp.test(this.state.registerMobile) === false
    ) {
      formIsValid = false;
      errors["registermobile"] = login_err_msg.registerMobile;
    }

    // if (this.state.registerMobile) {
    //  var pattern = new RegExp(/^[0-9\b]+$/);
    //     if (pattern.test(this.state.registerMobile)) {
    //        let input = this.state.registerMobile;
    //       const mobValid= input.length === 10;
    //           if(this.state.registerMobile && !mobValid){
    //                formIsValid = false;
    //                   errors["registermobile"] = "Please Enter Valid Mobile Number.";
    //  }

    //  }
    // }

    const emailReg = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    if (emailReg.test(this.state.registerEmail) === false) {
      formIsValid = false;
      errors["registeremail"] = login_err_msg.registeremail;
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  handleCheckChange(e, value) {
    if (value === "ESLIP") {
      if (e.target.value === "false") {
        this.setState({ isEstimationSlip: true });
      } else {
        this.setState({ isEstimationSlip: false });
      }
    } else {
      if (e.target.value === "false") {
        this.setState({ isTaxIncluded: true });
      } else {
        this.setState({ isTaxIncluded: false });
      }
    }
  }

  handleCheckAplicable(e , val){
    if(val === "TAXAPP"){
      if (e.target.value === "false") {
        this.setState({ isTaxApplied: true });
      } else {
        this.setState({ isTaxApplied: false });
      }

    }

  }
  registerClient(rayzorPayPaymentId, amount) {
    if (
      this.state.registerName &&
      this.state.registerOrganisation &&
      this.state.registerMobile &&
      this.state.registerEmail
    ) {
      const formValid = this.handleValidation();
      if (formValid) {
        // let input = this.state.registerName;
        // const nameVal =input.length > 6;
        // let mob=this.state.registerMobile;
        // const mobVal =mob.length === 10;
        // if(this.state.registerName && this.state.registerOrganisation && this.state.registerMobile && this.state.registerEmail){
        const obj = {
          name: this.state.registerName,
          organizationName: this.state.registerOrganisation,
          address: this.state.registerAddress,
          description:this.state.registerDescription,
          isEsSlipEnabled: this.state.isEstimationSlip,
          isTaxIncluded: this.state.isTaxIncluded,
          mobile: "+91".concat(this.state.registerMobile),
          email: this.state.registerEmail,
          planId: this.state.planId,
          planTenure: this.state.planTenure,
          rayzorPayPaymentId,
          amount,
        };

        LoginService.registerUser(obj).then((res) => {
          if (res) {
            toast.success("client created successfully");
            const clientId = res.data.id;
            const clientObj = {
              email: this.state.registerEmail,
              phoneNumber: "+91".concat(this.state.registerMobile),
              name: this.state.registerName,
              username: this.state.registerName.concat("_config_user"),
              tempPassword: "Otsi@1234",
              parentId: "",
              domianId: "",
              address: "",
              description:"",
              role: {
                roleName: "config_user",
              },
              roleName: "config_user",
              stores: [],
              clientId: clientId,
              isConfigUser: true,
              clientDomain: [],
              isSuperAdmin: false,
              createdBy: "",
              gender: "",
              birthDate: "",
            };

            this.setState({
              registerName: "",
              registerEmail: "",
              registerOrganisation: "",
              registerMobile: "",
              registerAddress: "",
              registerDescription:"",
              isEstimationSlip: false,
              isTaxIncluded: false,
              isTaxApplied :''
            });
            this.hideRegister();
            // URMService.saveUser(clientObj).then((response) => {
            //   console.log(response);
            //   if (response) {
            //     toast.success(
            //       "Username and Password are sent to  respective mailId"
            //     );
            //     this.setState({
            //       registerName: "",
            //       registerEmail: "",
            //       registerOrganisation: "",
            //       registerMobile: "",
            //       registerAddress: "",
            //       isEstimationSlip: false,
            //       isTaxIncluded: false,
            //     });
            //     this.hideRegister();
            //   }
            // });
          }
        });
      }
    } else {
      toast.info("Please Enter All Mandatory Fields");
    }

    // }else{
    //   toast.info("Please Enter All Mandatory Fields")
    // }
  }

  showDomains() {
    return (
      this.state.domainsList &&
      this.state.domainsList.length > 0 && (
        <div>
          {this.state.domainsList.map((element, index) => {
            return (
              <li
                key={index}
                onClick={(e) =>
                  this.handleClick(index + 1, element.domaiName, element.id)
                }
              >
                <a>
                  <img src={element.src} />
                </a>
                <h6>{element.domaiName} </h6>
              </li>
            );
          })}
        </div>
      )
    );
  }

  // validation(e) {

  //     const regex = /^[0-9\b]+$/;
  //     const value = e.target.value;
  //     if (value === '' || regex.test(value)) {
  //         this.setState({
  //             [e.target.id]: e.target.value, registerMobile: e.target.value
  //         });
  //     } else {
  //         // toast.error("pls enter numbers")
  //     }

  // }

  validation(e) {
    const regex = /^[0-9\b]+$/;
    const value = e.target.value;
    if (value === "" || regex.test(value)) {
      this.setState({
        [e.target.id]: e.target.value,
        registerMobile: e.target.value,
      });
    } else {
      this.setState({ registerMobile: "" });
      // toast.error("pls enter numbers")
    }
  }

  emailValidation(e) {
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{4,})$/i;
    const value = e.target.value;
    if (!value || regex.test(value) === false) {
      this.setState({
        [e.target.id]: e.target.value,
        registerEmail: e.target.value,
      });
    } else {
      // toast.error("pls enter numbers")
    }
  }

  getStoreDetails() {
    this.state.storesName.forEach((element) => {
      if (parseInt(element.storeId) === parseInt(this.state.storeId)) {
        sessionStorage.setItem("selectedstoreData", JSON.stringify(element));
      }
    });
  }

  taxSelect= (e) =>{
    this.setState({ isTaxIncluded: e.target.value});
  }

  pay = () => {
    if(!this.state.isTaxApplied){
      this.setState({isTaxIncluded : null})
    }
    LoginService.getPlanDetailsByTenure(this.state.planName,this.state.planTenure).then((res) => {
      let amount = res.data.result.tenureDetails.filter((item) => item.planTenure === this.state.planTenure);
      this.setState({
       price: amount[0].amount
      }, () => {
    const self = this;
    const reqObj = {
      amount: this.state.price,
    };
    if (
      this.state.registerName &&
      this.state.registerOrganisation &&
      this.state.registerMobile &&
      this.state.registerEmail
    ) {
      const formValid = this.handleValidation();
      if (formValid) {
        URMService.clientOrder(reqObj).then((res) => {
          const options = {
            // process.env.RAZORPAY_KEY_ID
            key: "rzp_test_z8jVsg0bBgLQer",
            currency: "INR",
            amount: 2000,
            name: "OTSI",
            description: "Transaction",
            image: ecommerce,
            order_id: res.data.result.razorPayId,
            handler: function (response) {
              toast.success("Payment Done Successfully");
              self.registerClient(
                response.razorpay_payment_id,
                self.state.price
              );
              // let status = true
              // const param = '?razorPayId=' + response.razorpay_order_id + '&payStatus=' + status;
              // const result = axios.post(BASE_URL + ACCOUNTING_PORTAL.payconfirmation + param, {
              //   headers: {
              //     'Authorization': 'eyJraWQiOiJqY0syR3RZcTFzMmFWXC8yUitrR1lLVnhMQ2VoUkdiRk9lZmQ4ZDYyazVaMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxN2MxOGRjNy04NDUwLTQ2YzAtYTYyYy04NWFhNDgzMGI2Y2QiLCJjb2duaXRvOmdyb3VwcyI6WyJkZXZfYWRtaW4iXSwiZ2VuZGVyIjoiTWFsZSIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoLTFfZ3R0ZDZBNHRUIiwiY3VzdG9tOmlzU3VwZXJBZG1pbiI6ImZhbHNlIiwiY3VzdG9tOnJvbGVOYW1lIjoidGVtcF9kZXYiLCJjdXN0b206aXNDb25maWdVc2VyIjoiZmFsc2UiLCJhdXRoX3RpbWUiOjE2NjAwNDAxODYsImV4cCI6MTY2MDEyNjU4NiwiaWF0IjoxNjYwMDQwMTg2LCJjdXN0b206Y2xpZW50SWQxIjoiMjMiLCJqdGkiOiI2ODg2OTQyZC0wZTRkLTQ2YTEtOTI2Zi02MTdlOWU1OWJlYjAiLCJlbWFpbCI6ImRldnVzZXIxQG1haWxpbmF0b3IuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImN1c3RvbTppc0VzU2xpcEVuYWJsZWQiOiJmYWxzZSIsImN1c3RvbTphc3NpZ25lZFN0b3JlcyI6ImRldl9zdG9yZTozMSwiLCJjb2duaXRvOnVzZXJuYW1lIjoiZGV2dXNlcjEiLCJjdXN0b206aXNUYXhJbmNsdWRlZCI6ImZhbHNlIiwiY3VzdG9tOnVzZXJJZCI6IjMzIiwib3JpZ2luX2p0aSI6IjUzODkzYzk2LWNhNzgtNDJmYi04Y2JiLWFlMTdmZjFkMWViYiIsImF1ZCI6IjF0azZubjY2bWxsNXRodm1nZGxudW81NGZpIiwiY3VzdG9tOmNyZWF0ZWRCeSI6IjI0IiwiY3VzdG9tOmNsaWVudERvbWlhbnMiOiIyMywiLCJldmVudF9pZCI6IjE0NjU2YTY2LTc0Y2EtNDFkNC1iZWI0LWE1YzY4Zjc0ZjQ2YSIsInRva2VuX3VzZSI6ImlkIiwibmFtZSI6ImRldnVzZXIxIiwicGhvbmVfbnVtYmVyIjoiKzkxNTY2NTY3Njc2OSJ9.eBMvCWBDE2TbEA4E2I4lvLF4S17iGelKR1IYi65X3KKXfxzSt62y49IfBGpFcvJKH4yhhkrB2m7NDDrAQOa57EfsO7N7TJzSWQb9bW4ay6Ui9OAaua2HJZt9v_3xol_bULiZCgOC62P3ppDlpSKJi4RAU8U4LuwZZKGsNxo_S2roQqj7HjNW-emlo0FvdAm8hM-esOselM7Lijw5sKLAiJUzUntLlRYH-PYfxhODoj8bi6b-8APsBEL_tBO-Tz-lXJz9phhYR11ucL-Nr25n-Y1aXKzOuHExZqzIiYx2FLlcYqO3EMAVbdt4c6r6ON0H5NUjTE4Grq2whiN17ZXEnA',
              //     'Content-Type': 'application/json',
              // }
              // });
            },
            prefill: {
              name: "Kadali",
              email: "kadali@gmail.com",
              contact: "9999999999",
            },
          };
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        });
      } else {
        toast.info("Please Enter All Mandatory Fields");
      }
    } else {
      toast.info("Please Enter All Mandatory Fields");
    }
  });
});
  };

  render() {
    const { t, i18n } = this.props;
    let storeList;
    if (this.state.storesName && this.state.storesName.length > 0) {
      const modules = this.state.storesName;
      storeList =
        modules.length > 0 &&
        modules.map((item, i) => {
          return (
            <option key={i} value={item.storeId}>
              {item.storeName}
            </option>
          );
        }, this);
    }
    return (
      <div className="login">
        <Modal className="" isOpen={this.state.isStores} size="">
          <ModalHeader>Select Store</ModalHeader>
          <ModalBody>
            <div className="p-4">
              <select
                className="form-control"
                value={this.state.storeId}
                onChange={(e) => {
                  this.setState({ storeId: e.target.value }, () => {
                    sessionStorage.removeItem("storeId");
                    sessionStorage.setItem("storeId", this.state.storeId);
                    this.getStoreDetails();
                  });
                }}
              >
                {storeList}
              </select>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn-unic fs-12 mt-3"
              onClick={(e) => {
                this.setState({
                  isStores: false,
                  isModel: false,
                  userName: "",
                  password: "",
                });
              }}
            >
              Cancel
            </button>
            <button
              className="btn-unic active fs-12 mt-3"
              onClick={(e) => {
                // this.props.history.push("/dashboard");
                this.getPath();
              }}
            >
              OK
            </button>
          </ModalFooter>
        </Modal>
        <Modal className="" isOpen={this.state.expairyModal} size="">
          <ModalBody>
            <div className="p-4">
            <h6>{this.state.planExpairyMessage}</h6>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn-unic active fs-12 mt-3"
              onClick={() => {
                this.setState({
                  expairyModal: false
                }, () => {
                  this.validatePlanExpairy();
                })
              }}
            >
              OK
            </button>
          </ModalFooter>
        </Modal>
        <Modal className="" isOpen={this.state.renewalModal} size="">
          <ModalBody>
            <div className="p-4">
            <h6>{this.state.planExpairyMessage}</h6>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn-unic active fs-12 mt-3"
              onClick={() => {
                this.setState({
                  renewalModal: false
                }, () => {
                  this.renewalPlan();
                })
              }}
            >
              OK
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.showModal} size="md">
          <ModalHeader>
            <div>{this.state.modelTitle}</div>
          </ModalHeader>
          <ModalBody>
            <div className="p-3">
              {/* <h5 className="fs-14 text-red scaling-center scaling-mb">User Details</h5> */}
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <div className="form-group">
                      <label>
                        {this.state.modelListTitle}
                        <span className="text-red font-bold">*</span>
                      </label>
                      <select
                        className="form-control"
                        placeholder="Select Store"
                        onChange={this.handleChangeVal}
                        value={this.state.role}
                        //   disabled={this.state.isEdit}
                      >
                        <option>Select</option>
                        {this.state.modelList.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn-unic"
              onClick={this.hideCreateUser}
              name="cancel"
            >
              Cancel
            </button>
            <button
              className="btn-unic active fs-12"
              onClick={
                this.state.modelId === 1 ? this.navBasedOnRle : this.addClient
              }
              name="save"
            >
              Go
            </button>
          </ModalFooter>
        </Modal>

        <Modal className="fullModal" isOpen={this.state.isModel} size="xl">
          <div className="">
            <ModalBody>
              <div className="domain pb-5 pt-5 mb-5 text-center">
                <img src={retailIcon} />
                <h5 className="text-secondary">Select Domain Type</h5>
                {/* <ul>
                                                 <li  onClick={e => this.handleClick(1)} >
                                                     <a>
                                                     <img src={textile} /></a>
                                                  
                                                     <h6> {t("TEXTILE")}</h6>
                                                    
                                                 </li>
                                                 <li  onClick={e => this.handleClick(2)}>
                                                     <a>
                                                     <img src={electrical} /></a>
                                                     <h6>ELECTRONICS</h6>
                                                 </li>
                                                 <li  onClick={e => this.handleClick(3)}>
                                                 <a>
                                                 <img src={sanitary}/></a>
                                                    <h6>SANITARY </h6>
                                                 </li>
                                                
                                             </ul> */}

                <ul>{this.showDomains()}</ul>
              </div>
            </ModalBody>
          </div>
        </Modal>

        <div className="login">
          <div className="row m-0 p-0">
            <div className="col-sm-6 col-xs-12">
              <div className="login-left">
                <div className="easytxt">
                  <img className="pic" src={Logo} />
                  <span class="">
                    EASY RETAIL
                    <b>In-Store & Online</b>
                  </span>
                </div>
                <div className="login-left-radio">
                  <input
                    type="radio"
                    value="en" // this is te value which will be picked up after radio button change
                    checked={this.state.value === "en"} // when this is true it show the male radio button in checked
                    onChange={this.handleRadioChange} // whenever it changes from checked to uncheck or via-versa it goes to the handleRadioChange function
                  />{" "}
                  <span
                    style={{ marginLeft: "5px" }} // inline style in reactjs
                  >
                    English
                  </span>
                  <input
                    className="leftmove"
                    type="radio"
                    value="tel" // this is te value which will be picked up after radio button change
                    checked={this.state.value === "tel"} // when this is true it show the male radio button in checked
                    onChange={this.handleRadioChange} // whenever it changes from checked to uncheck or via-versa it goes to the handleRadioChange function
                  />
                  <span
                    style={{ marginLeft: "5px" }} // inline style in reactjs
                  >
                    తెలుగు
                  </span>
                  <input
                    className="leftmove"
                    type="radio"
                    value="hin" // this is te value which will be picked up after radio button change
                    checked={this.state.value === "hin"} // when this is true it show the male radio button in checked
                    onChange={this.handleRadioChange} // whenever it changes from checked to uncheck or via-versa it goes to the handleRadioChange function
                  />
                  <span
                    style={{ marginLeft: "5px" }} // inline style in reactjs
                  >
                    हिंदी
                  </span>
                </div>

                <label>
                  {" "}
                  {t("Let's explore")} <br /> {t("the world's best")}
                </label>
                <p>
                  {" "}
                  {t("Powerful Cloud")} <br /> {t("Retail POS System")}
                </p>
                {/* <div className="retail">
            <img src={Retail}/>
            </div> */}
                <div className="login-footer fs-12">
                  {/* © 2021 OTSI - POS Portal | All rights reserved. */}
                  <label> {t("copyRight")}</label>
                </div>
              </div>
              {/* <div className="login-left-bgbottom"></div> */}
            </div>

            {/* LOGIN PAGE */}
            {this.state.isLogin && (
              <div className="col-sm-6 col-xs-12 p-0 m-0">
                <div className="login-right">
                  <div className="login-right-form select_control">
                    {/* <h5>MEMBER LOGIN</h5> */}
                    <h5 className=""> {t("Login")} </h5>
                    <div className="form-group m-t-2">
                      <input
                        type="text"
                        className="mt-3 mb-3 form-control"
                        value={this.state.userName}
                        name="userName"
                        onChange={(e) =>
                          this.setState({ userName: e.target.value })
                        }
                        autoComplete="off"
                        // onKeyPress={this.getDropdownList}
                        placeholder={t("Username")}
                      />
                      <input
                        type="password"
                        className="form-control"
                        value={this.state.password}
                        name="password"
                        onChange={(e) =>
                          this.setState({ password: e.target.value })
                        }
                        placeholder={t("Password")}
                      />
                    </div>

                    <div className="form-check checkbox-rounded checkbox-living-coral-filled pt-1 mt-3">
                      <input
                        type="checkbox"
                        className="form-check-input filled-in mt-1"
                        id="remember"
                        checked={this.state.isCheckBox}
                        onChange={this.handleCheckBox}
                      />
                      <div className="row">
                        <div className="col-6">
                        <label className="form-check-label" htmlFor="remember">
                          {t("RememberMe")}
                        </label>
                        </div>
                        <div className="col-6">
                        <button 
                      className="btn-forget cursor fs-14"
                      htmlFor="remember" type="button"
                      onClick={this.forgotPassword}
                    >
                      {t("Forgot Password")}
                    </button>
                        </div>
                      </div>
                      
                    </div>
                    <button className="btn-login_v1 mt-4" onClick={this.login}>
                      {/* <button className="btn-login_v1 mt-3" onClick={this.showCreateRole}> */}
                      {t("LOGIN")}
                    </button>
                        <div className="col-12 mt-4">
                        <button className="btn-register text-secondary" type="button"  htmlFor="remember"
                      onClick={this.showRegister}>{t("Register")}</button>
                          </div>
                       
                    {/* <p
                      className="text-center cursor pt-3 fs-14"
                      htmlFor="remember"
                      onClick={this.showRegister}
                    >
                      {t("Register")}
                    </p> */}
                    {/* <i className="icon-add_course fs-20 text-green"></i> */}
                  </div>
                </div>
              </div>
            )}

            {/* SEND VERIFICATION CODE */}

            {this.state.isForgot && (
              <div className="col-sm-6 col-xs-12 p-0 m-0">
                <div className="login-right">
                  <div className="login-right-form select_control p-5">
                  <span className="text-red cursor" onClick={this.hideRegister}> <i className="icon-arrow_big_left text-red fs-15 cursor"></i> Back to Login</span>
                    <h5 className="mt-3">
                      {" "}
                      Verification Code <br />{" "}
                    </h5>
                    <div className="form-group mt-4">
                      <input
                        type="text"
                        className="mt-3 mb-3 form-control"
                        autoComplete="off"
                        value={this.state.userName}
                        name="confirmuserName"
                        onChange={(e) => this.handleUserName(e)}
                        placeholder="UserName"
                      />
                    </div>
                    <button
                      className="btn-login_v1 mt-3"
                      onClick={this.getConfirmationCode}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* FORGOT PASSWORD */}

            {this.state.isconfirmPassword && (
              <div className="col-sm-6 col-xs-12 p-0 m-0">
                <div className="login-right">
                  <div className="login-right-form select_control">
                    <h5 className="">
                      Update New <br /> Password{" "}
                    </h5>
                    <div className="form-group m-t-2">
                      <input
                        type="text"
                        className="mt-3 mb-3 form-control"
                        autoComplete="off"
                        value={this.state.confirmationCode}
                        name="confirmationCode"
                        onChange={(e) =>
                          this.setState({ confirmationCode: e.target.value })
                        }
                        placeholder="Confirmation Code"
                      />
                      <div>
                        <span style={{ color: "red" }}>
                          {this.state.errors["confirmationcode"]}
                        </span>
                      </div>

                      <input
                        type="password"
                        className="form-control"
                        value={this.state.newForgotPassword}
                        name="newForgotPassword"
                        onChange={(e) =>
                          this.setState({ newForgotPassword: e.target.value })
                        }
                        placeholder="New Password"
                      />
                      <div>
                        <span style={{ color: "red" }}>
                          {this.state.errors["newforgotpassword"]}
                        </span>
                      </div>
                    </div>
                    <button
                      className="btn-login_v1 mt-3"
                      onClick={this.saveForgotPassword}
                    >
                      Save Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reset Password */}
            {this.state.isChangePassword && (
              <div className="col-sm-6 col-xs-12 p-0 m-0">
                <div className="login-right">
                  <div className="login-right-form select_control">
                    <h5 className="">
                      Update New <br /> Password{" "}
                    </h5>
                    <div className="form-group m-t-2">
                      {/* <input
                        type="text"
                        className="mt-3 mb-3 form-control"
                        value={this.state.currentPassword}
                        name="currentPassword"
                        onChange={(e) =>
                          this.setState({ currentPassword: e.target.value })
                        }
                        autoComplete="off"
                        placeholder="Current Password"
                      /> */}
                      <input
                        type="password"
                        className="form-control"
                        value={this.state.newPassword}
                        name="newPassword"
                        onChange={(e) =>
                          this.setState({ newPassword: e.target.value })
                        }
                        placeholder="New Password"
                      />
                      <div>
                        <span style={{ color: "red" }}>
                          {this.state.errors["newpassword"]}
                        </span>
                      </div>

                      <input
                        type="password"
                        className="mt-3 mb-3 form-control"
                        value={this.state.currentPassword}
                        name="confirmPassword"
                        onChange={(e) =>
                          this.setState({ confirmPassword: e.target.value })
                        }
                        autoComplete="off"
                        placeholder="Confirm Password"
                      />
                      <div>
                        <span style={{ color: "red" }}>
                          {this.state.errors["currentpassword"]}
                        </span>
                      </div>
                    </div>
                    <button
                      className="btn-login_v1 mt-3"
                      onClick={this.changePassword}
                    >
                      Save
                    </button>
                    <button
                      className="btn-login_v1 mt-3"
                      onClick={this.hideChangePassword}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Register Client */}

            {this.state.isRegister && (
              <div className="col-sm-6 col-xs-12 p-0 m-0">
                <div className="login-right">
                  <div className="login-right-formreg select_control">
                    <div className="row p-3 pt-0">
                      <h5 className="">
                        Register <br /> New Client{" "}
                      </h5>
                      <div className="col-6 col-sm-6">
                        <div className="form-group">
                        <label>
                          Name <span className="text-red font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={this.state.registerName}
                          onChange={(e) =>
                            this.setState({ registerName: e.target.value })
                          }
                          autoComplete="off"
                        />
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["registerName"]}
                          </span>
                        </div>
                      </div>
                      </div>
                      <div className="col-6">
                        <label>
                          Organisation{" "}
                          <span className="text-red font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={this.state.registerOrganisation}
                          onChange={(e) =>
                            this.setState({
                              registerOrganisation: e.target.value,
                            })
                          }
                          autoComplete="off"
                        />
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["registerOrganisation"]}
                          </span>
                        </div>
                      </div>

                      <div className="col-6">
                        <label>
                          Mobile <span className="text-red font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          name="mobile"
                          className="form-control"
                          maxLength="10"
                          minLength="10"
                          value={this.state.registerMobile}
                          onChange={this.validation}
                          autoComplete="off"
                        />
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["registermobile"]}
                          </span>
                        </div>
                      </div>

                      <div className="col-6">
                        <label>
                          Email <span className="text-red font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          name="email"
                          className="form-control"
                          value={this.state.registerEmail}
                          onChange={this.emailValidation}
                          autoComplete="off"
                        />
                        <div>
                          <span style={{ color: "red" }}>
                            {this.state.errors["registeremail"]}
                          </span>
                        </div>
                      </div>

                      <div className="col-sm-6 col-6">
                        <div className="form-group">
                          <label>
                            Plan
                            {/* <span className="text-red font-bold">*</span> */}
                          </label>
                          <select
                            className="form-control"
                            placeholder="Select Division"
                            value={this.state.planName}

                            // onChange={this.handlePlanChange}
                            onChange={(e) => {
                              this.handlePlanChange(e);
                            }}
                            // disabled={this.state.isEdit}
                          >
                           
                             {this.state.selectOptionPlan.map((i) => {
                              return (
                                <option key={i.id} value={i.id}>
                                  {i.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      <div className="col-sm-6 col-6">
                        <div className="form-group">
                          <label>
                            Plan Tenure
                            {/* <span className="text-red font-bold">*</span> */}
                          </label>
                          <select
                            className="form-control"
                            placeholder="Select Division"
                            //  onChange={this.handlePlanChange}
                            value={this.state.planTenure}
                            onChange={(e) => {
                              this.handleSelect(e);
                            }}
                            // disabled={this.state.isEdit}
                          >
                            {/* <option value="" disabled>
                          Select
                         </option>
                          {this.state.planList.map((item) => (
                           <option key={item.id} value={item.id}>
                              {item.value}
                            </option>
                           ))}
                           </select> */}

                            {this.state.selectOptionTenure.map((i) => {
                              return (
                                <option key={i.id} value={i.id}>
                                  {i.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                            <div className="col-sm-4 col-6 p-l-1">
                              <button className="btn-nobdr text-red p-t-3" type="button" 
                              onClick={this.showPlan}><img className="img-fluid w-20" src={plans}></img> View Plans</button>
                            </div>
                            <Modal isOpen={this.state.showModalview} className="fullModal">
                    {/* <ModalHeader>
                                  View Plans
                        </ModalHeader> */}
                        <ModalBody className="pt-3 pb-3 overflow-auto">
                          <div className="col-12 mb-2">
                              	   <h6 className="text-center font-bold fs-20">Packages</h6>
                            <button type="button" class="btn search modal-close text-right" onClick={this.hidePlan} name="cancel"> <img src={close}></img></button>
                          </div>
                          <div className="plans">
                          <div className="row">
                            {this.state.plansList.map((item, index) => {
return (
  <div kwy={index} className="col-4">
  <div className="prices">
    <div  className={(item.planType === "Standard" && "prices-red")|| (item.planType ==="Premium" && "prices-yellow")||(item.planType ==="Basic" && "prices-green")} >
     {item.planType} 
      </div>
       {/* "prices-green" */}
      {/* <div className="prices-green-g1">
          <h5>₹99</h5>
          <h6>20GB</h6>        
    </div> */}
    {item.parentPrivileges.map((itm, idx) => {
    return(  <div key={idx} className="prices-sections">
      <h6>{itm.name} 
      {itm.isEnabeld && <img src={active}></img>}
      {!itm.isEnabeld &&<img src={inactive}></img>}
       </h6>
      
      {/* <label>Tax master</label>
      <label>Create HSN code</label> */}
       {itm.subPrivileges.map((iem ,ind)=>{
        return(
        <label  key={ind}>{iem.name}</label>)
      })}
     
    </div>
    
    )
    })}
  </div>
</div>
)
                            })}
                            {/* <div className="col-4">
                              <div className="prices">
                                <div className="prices-red">
                                STANDARD
                                  </div>
                                  <div className="prices-red-r1">
                                      <h5>₹499</h5>
                                      <h6>100GB</h6>
                                    
                                </div>
                                <div className="prices-sections">
                                  <h6>Accounting portal <img src={active}></img> </h6>
                                  <label>Tax master</label>
                                  <label>Create HSN code</label>
                                </div>
                                <div className="prices-sections">
                                  <h6>Inventory portal  <img src={active}></img></h6>
                                  <label>Barcode list</label>
                                  <label>Add, Edit, Delete Barcode</label>
                                </div>
                                <div className="prices-sections">
                                  <h6>Billing portal  <img src={active}></img></h6>
                                  <label>Generate estimation slip(If required)</label>
                                  <label>Generate invoice ( Payment methods-Cash, Card, CC )</label>
                                </div>
                                <div className="prices-sections">
                                  <h6>Reports  <img src={inactive}></img></h6>
                                  <label>List of barcodes</label>
                                  <label>Estimation slip report</label>
                                  <label>Invoice report</label>
                                  <label>Goods return</label>
                                  <label>Sales summary</label>
                                </div>
                                <div className="prices-sections">
                                  <h6>Promotions  <img src={inactive}></img></h6>
                                  <label>List of pools</label>
                                  <label>List of promotions</label>
                                  <label>Manage promotions</label>
                                </div>
                              </div>
                            </div>
                            <div className="col-4">
                            <div className="prices">
                                <div className="prices-yellow">
                                PREMIUM
                                  </div>
                                  <div className="prices-yellow-y1">
                                      <h5>₹999</h5>
                                      <h6>500GB</h6>
                                    
                                </div>
                                <div className="prices-sections">
                                  <h6>Accounting portal <img src={active}></img> </h6>
                                  <label>Tax master</label>
                                  <label>Create HSN code</label>
                                </div>
                                <div className="prices-sections">
                                  <h6>Inventory portal  <img src={active}></img></h6>
                                  <label>Barcode list</label>
                                  <label>Add, Edit, Delete Barcode</label>
                                </div>
                                <div className="prices-sections">
                                  <h6>Billing portal  <img src={active}></img></h6>
                                  <label>Generate estimation slip(If required)</label>
                                  <label>Generate invoice ( Payment methods-Cash, Card, CC )</label>
                                </div>
                                <div className="prices-sections">
                                  <h6>Reports  <img src={active}></img></h6>
                                  <label>List of barcodes</label>
                                  <label>Estimation slip report</label>
                                  <label>Invoice report</label>
                                  <label>Goods return</label>
                                  <label>Sales summary</label>
                                </div>
                                <div className="prices-sections">
                                  <h6>Promotions  <img src={active}></img></h6>
                                  <label>List of pools</label>
                                  <label>List of promotions</label>
                                  <label>Manage promotions</label>
                                </div>
                              </div>
                            </div> */}
                          </div>
                          </div>
                        </ModalBody>
                   
                    {/* <ModalFooter> */}
                        {/* <button className="btn-unic" onClick={this.hidePlan} name="cancel">Cancel</button> */}
                        {/* <button className="btn-unic active fs-12" onClick={this.showPlan} name="save">Save</button> */}
                    {/* </ModalFooter> */}
                </Modal> 
          
                      <div className="col-sm-4 p-l-0 col-6">
                        <div className="form-check checkbox-rounded checkbox-living-coral-filled pt-1 mt-2">
                          <input
                            type="checkbox"
                            className="form-check-input filled-in mt-1"
                            name="Eslip"
                            id="estimation"
                            value={this.state.isEstimationSlip}
                            checked={this.state.isEstimationSlip}
                            onChange={(e) => this.handleCheckChange(e, "ESLIP")}
                            required="required"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="estimation"
                          >
                            Estimation Slip{" "}
                          </label>
                          <div>
                          
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4 p-l-0 col-6">
                        <div className="form-check checkbox-rounded checkbox-living-coral-filled pt-1 mt-2">
                          <input
                            type="checkbox"
                            name="taxInclude"
                            className="form-check-input filled-in mt-1"
                            id="tax"
                            value={this.state.isTaxApplied}
                            checked={this.state.isTaxApplied}
                            onChange={(e) =>
                            //  this.setState({isTaxApplied : e.target.value}) 
                            this.handleCheckAplicable(e, "TAXAPP")
                            }
                            required="required"
                          />
                          <label className="form-check-label" htmlFor="tax">
                            Tax Applied{" "}
                           
                          </label>
                          <div>
                          </div>
                        </div>
                      </div>
                    { this.state.isTaxApplied && <div className="row">
                    <div className="col-4 mt-2 mb-2">

                 <div className="form-group">
                  
         <input type="radio" id="specifyColor" checked={this.state.isTaxIncluded === "true"} 
   onClick={this.taxSelect.bind(this)} value="true" /> <label className="fs-14">TaxInclude</label>
               
            
   </div>
                
               </div>
               <div className="col-4 mt-2 mb-2">
               <div className="form-group">
               <input type="radio" id="specifyColor" className="" checked={this.state.isTaxIncluded === "false"} 
   onClick={this.taxSelect.bind(this)} value="false" /> <label className="fs-14">Tax Exclude</label>
   </div>
               </div>
               </div>
                         
                            
                        
               
                        
  }


                      <div className="col-12">
                        <label>Address</label>
                        <input type="text" className="form-control"  
                        value={this.state.registerAddress}
                           onChange={(e) =>
                            this.setState({ registerAddress: e.target.value })
                          }
                         autoComplete="off"></input>
                        {/* <textarea
                          rows="2"
                          cols="5"
                          className="form-control"
                          value={this.state.registerAddress}
                           onChange={(e) =>
                            this.setState({ registerAddress: e.target.value })
                          }
                         autoComplete="off"
                        ></textarea> */}
                        </div>


                      <div className="col-12">
                        {/* <label>Address</label> */}
                        <label>Description</label>
                        <input type="text" className="form-control"    
                        value={this.state.registerDescription}
                          // onChange={(e) =>
                          //   this.setState({ registerAddress: e.target.value })
                          // }
                          onChange={(e)=>this.setState({registerDescription:e.target.value})}
                          autoComplete="off"></input>
                        {/* <textarea
                          rows="2"
                          cols="5"
                          className="form-control"
                          // value={this.state.registerAddress}
                          value={this.state.registerDescription}
                          // onChange={(e) =>
                          //   this.setState({ registerAddress: e.target.value })
                          // }
                          onChange={(e)=>this.setState({registerDescription:e.target.value})}
                          autoComplete="off"
                        ></textarea> */}
                        </div>
                        </div>

                      <div className="row p-l-3 p-r-3">
                        <div className="d-flex">
                        <button
                          className="btn-login_v1 mt-1 m-r-2"
                          onClick={this.pay}
                        >
                          Pay
                        </button>
                        <button
                          className="btn-login_v1 mt-1"
                          onClick={this.hideRegister}
                        >
                          Cancel
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </div>
          {/* <ToastContainer /> */}
        </div>
      </div>
    );
  }
}
export default withRouter(withTranslation()(Login));
