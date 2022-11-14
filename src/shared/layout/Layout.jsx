import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from '../../commonUtils/PrivateRoute';
import CeateDeliverySlip from '../../components/cashmemo-deliveryslip/CreateDeliverySlip';
import NewSale from '../../components/cashmemo-deliveryslip/NewSale';
import PromoItemExchange from '../../components/cashmemo-deliveryslip/PromoItemExchange';
import GenerateReturnSlip from '../../components/cashmemo-deliveryslip/GenerateReturnSlip';
import Login from '../../components/login/Login';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import CreateCustomer from '../../components/cashmemo-deliveryslip/CreateCustomer';
import TagCustomer from '../../components/cashmemo-deliveryslip/TagCustomer';
import SalesReport from '../../components/reports/SalesReport';
import ListOfSaleBills from '../../components/reports/ListOfSaleBills';
import ListOfDeliverySlips from '../../components/reports/ListOfDeliverySlips';
import PosDayClose from '../../components/cashmemo-deliveryslip/PosDayClose';
import ListOfReturnSlips from '../../components/reports/ListOfReturnSlips';
import UserManagement from '../../components/admin/UserManagement';
import SubHeader from '../header/SubHeader';
import Dashboard from '../../components/cashmemo-deliveryslip/Dashboard';
// import Dashboard from '../../components/dashboard/Dashboard';
import ListOfPromotions from '../../components/reports/ListOfPromotions';
import TaxReport from '../../components/reports/TaxReport';
import InventoryList from '../../components/InventoryPortal/InventoryList';
import BarcodeList from '../../components/InventoryPortal/BarcodeList';
import User from '../../components/admin/User';
import Roles from '../../components/admin/Roles';
import Stores from '../../components/admin/Stores';
import Channels from '../../components/admin/Channels';
import CreateHSNCode from '../../components/AccountingPortal/CreateHSNCode';
import CreateNotes from '../../components/AccountingPortal/CreateNotes';
import CreateTaxMaster from '../../components/AccountingPortal/CreateTaxMaster';
import DebitNotes from '../../components/AccountingPortal/DebitNotes';
import ListOfPools from '../../components/Promotions-Loyalty/ListOfPools';
import LoyaltyPoints from '../../components/Promotions-Loyalty/LoyaltyPoints';
import ManagePromo from '../../components/Promotions-Loyalty/ManagePromo';
import ListOfPromos from '../../components/Promotions-Loyalty/ListOfPromos';
import HRPortal from '../../components/HRPortal/HRPortal';
import Footer from '../footer/Footer';
import AccountingDashboard from '../../components/AccountingPortal/AccountingDashboard';
import ReportsDashboard from '../../components/reports/ReportsDashboard';
import URMDashboard from '../../components/admin/URMDashboard';
import ListOfEstimationSlips from '../../components/reports/ListOfEstimationSlips';
import Rebarcoding from '../../components/InventoryPortal/Rebarcoding';
import OrderShipment from '../../components/InventoryPortal/OrderShipment';
import GoodsTransfer from '../../components/InventoryPortal/GoodsTransfer';
import ReceiveOrder from '../../components/InventoryPortal/ReceiveOrder';
import TrackOrder from '../../components/InventoryPortal/TrackOrder';
import BackOffice from '../../components/admin/BackOffice';
import TaxMaster from '../../components/BackOfficePortal/TaxMaster';
import HsnDetails from '../../components/BackOfficePortal/HsnDetails';
import Payment from '../../components/admin/Payment';
import ProductsCombo from '../../components/InventoryPortal/ProductsCombo';
import CaptainDashboard from '../../components/admin/CaptainDashboard';
import ClientDetails from '../../components/admin/ClientDetails';
import ClientSupportingDetails from '../../components/admin/ClientSupportingDetails';
import ClientMapping from '../../components/admin/ClientMapping';
import OpenTickets from '../../components/admin/OpenTickets';
import TotalTickets from '../../components/admin/TotalTickets';
import ClosedTickets from '../../components/admin/ClosedTickets';
import Ticketing from '../../components/admin/Ticketing';



export default class Layout extends Component {
    constructor(props) {
        super(props)
        //console.log("parent",props);
        this.state = {
            styles: {
                contentDiv: {
                    display: "flex",
                },
                headerTitle: 'Cash Memo & Delivery Slips ',
                subHeaderList: "",
                // contentMargin: {
                //     marginLeft: "10px",
                //     width: "100%",
                //     innerHeight: "100%",
                //     marginTop: "10px"
                // },



            }
        }

    }
    componentWillMount() {
        this.state.userData = JSON.parse(sessionStorage.getItem('user'));
        //        console.log("USER",JSON.parse(sessionStorage.getItem('user')));
        this.setState({ headerTitle: 'Cash Memo & Delivery Slips' });
    }

    handleCallback = (childData) => {
        this.setState({ headerTitle: childData });
    }

    handleHeaderCallback = (childData) => {
        this.setState({ subHeaderList: childData });
        console.log(this.state.subHeaderList);
    }

    render() {
        return (
            <Router>
                <div className="w-100">
                    {/* <div className="sidebar">
                        <div className="row">
                      
                                <div className="sidebarBackground">
                                    <Sidebar headerTitle={this.state.headerTitle}  parentCallback = {this.handleCallback} />
                                </div>
                    </div>
                     </div> */}
                    <div className="header">
                        <div className="w-100">
                            <Header user={this.state.userData} headerTitle={this.state.headerTitle} parentCallback={this.handleHeaderCallback} />

                    
                        </div>
                        <div className="w-100">
                            <SubHeader parentCallback={this.handleHeaderCallback} />
                        </div>
                    </div>
                    <div className="mainbody">
                        <div style={this.state.styles.contentMargin}>
                            <Switch>
                                <PrivateRoute
                                    path='/createdeliveryslip'
                                    exact={true}
                                    component={CeateDeliverySlip}
                                />
                                <PrivateRoute
                                    path='/newSale'
                                    exact={true}
                                    component={NewSale}
                                />

                                <PrivateRoute
                                    path='/promoitemexchange'
                                    exact={true}
                                    component={PromoItemExchange}

                                />
                                <PrivateRoute
                                    path='/generatereturnslip'
                                    exact={true}
                                    component={GenerateReturnSlip}

                                />
                                <PrivateRoute
                                    path='/createcustomer'
                                    exact={true}
                                    component={CreateCustomer}

                                />
                                <PrivateRoute
                                    path='/tagcustomer'
                                    exact={true}
                                    component={TagCustomer}

                                />
                                <PrivateRoute
                                    path='/posdayclose'
                                    exact={true}
                                    component={PosDayClose}

                                />
                                <PrivateRoute
                                    path='/salereport'
                                    exact={true}
                                    component={SalesReport}
                                />
                                <PrivateRoute
                                    path='/listofsalebills'
                                    exact={true}
                                    component={ListOfSaleBills}
                                />
                                <PrivateRoute
                                    path='/listofdeliveryslips'
                                    exact={true}
                                    component={ListOfDeliverySlips}
                                />
                                <PrivateRoute
                                    path='/listofreturnslips'
                                    exact={true}
                                    component={ListOfReturnSlips}
                                />
                                <PrivateRoute
                                    path='/usermanagement'
                                    exact={true}
                                    component={UserManagement}
                                />
                                <PrivateRoute
                                    path='/listofPromotions'
                                    exact={true}
                                    component={ListOfPromotions}
                                />
                                 <PrivateRoute
                                    path='/taxreport'
                                    exact={true}
                                    component={TaxReport}
                                />
                                <PrivateRoute
                                    path='/dashboard'
                                    exact={true}
                                    component={Dashboard}
                                />
                                <PrivateRoute
                                    path='/inventoryList'
                                    exact={true}
                                    component={InventoryList}
                                />
                                <PrivateRoute
                                    path='/barcodeList'
                                    exact={true}
                                    component={BarcodeList}
                                />
                                <PrivateRoute
                                    path='/users'
                                    exact={true}
                                    component={User}
                                />
                                <PrivateRoute
                                    path='/roles'
                                    exact={true}
                                    component={Roles}
                                />
                                <PrivateRoute
                                    path='/stores'
                                    exact={true}
                                    component={Stores}
                                />
                                <PrivateRoute
                                    path='/domain'
                                    exact={true}
                                    component={Channels}
                                />

                                <PrivateRoute
                                    path='/createHSN'
                                    exact={true}
                                    component={CreateHSNCode}
                                />

                                <PrivateRoute
                                    path='/createNotes'
                                    exact={true}
                                    component={CreateNotes}
                                />

                                <PrivateRoute
                                    path='/createTaxMaster'
                                    exact={true}
                                    component={CreateTaxMaster}
                                />

                                <PrivateRoute
                                    path='/debitNotes'
                                    exact={true}
                                    component={DebitNotes}
                                />

                                <PrivateRoute
                                    path='/listOfPools'
                                    exact={true}
                                    component={ListOfPools}
                                />
                                <PrivateRoute
                                    path='/loyaltyPoints'
                                    exact={true}
                                    component={LoyaltyPoints}
                                />
                                <PrivateRoute
                                    path='/managePromo'
                                    exact={true}
                                    component={ManagePromo}
                                />
                                 <PrivateRoute
                                    path='/listOfPromos'
                                    exact={true}
                                    component={ListOfPromos}
                                />                                

                                <PrivateRoute
                                    path='/hrPortal'
                                    exact={true}
                                    component={HRPortal}
                                />
                                <PrivateRoute
                                    path='/accountingDashboard'
                                    exact={true}
                                    component={AccountingDashboard}
                                />

                            <PrivateRoute
                                    path='/reportsDashboard'
                                    exact={true}
                                    component={ReportsDashboard}
                                />

                                <PrivateRoute
                                    path='/urmDashboard'
                                    exact={true}
                                    component={URMDashboard}
                                />
                                 <PrivateRoute
                                    path='/listOfEstimationSlips'
                                    exact={true}
                                    component={ListOfEstimationSlips}
                                />
                                 
                                 <PrivateRoute
                                    path='/rebarcoding'
                                    exact={true}
                                    component={Rebarcoding}
                                />

                                <PrivateRoute
                                    path='/goodstransfer'
                                    exact={true}
                                    component={GoodsTransfer}
                                />

                                <PrivateRoute
                                    path='/ordershipment'
                                    exact={true}
                                    component={OrderShipment}
                                />

                                <PrivateRoute
                                    path='/receiveorder'
                                    exact={true}
                                    component={ReceiveOrder}
                                />
  <PrivateRoute
                                    path='/trackorder'
                                    exact={true}
                                    component={TrackOrder}
                                />


                                <PrivateRoute
                                      path='/backOffice'
                                    exact={true}
                                    component={BackOffice}
                                />
                                 <PrivateRoute
                                    path='/taxMaster'
                                    exact={true}
                                    component={TaxMaster}
                                />
                                 <PrivateRoute
                                    path='/hsnDetails'
                                    exact={true}
                                    component={HsnDetails}
                                />
                                 <PrivateRoute
                                    path='/payment'
                                    exact={true}
                                    component={Payment}
                                />
                                  <PrivateRoute
                                    path='/productsCombo'
                                    exact={true}
                                    component={ProductsCombo}
                                />
                                 <PrivateRoute
                                    path='/adminDetails'
                                    exact={true}
                                    component={CaptainDashboard}
                                />
                                   <PrivateRoute
                                    path='/clientDetails'
                                    exact={true}
                                    component={ClientDetails}
                                />
                                 <PrivateRoute
                                    path='/clientSupportDetails'
                                    exact={true}
                                    component={ClientSupportingDetails}
                                />
                                 <PrivateRoute
                                    path='/clientMapping'
                                    exact={true}
                                    component={ClientMapping}
                                />
                                 <PrivateRoute
          path='/totalTickets'
          exact={true}
          component={TotalTickets}
        />
                                 <PrivateRoute
          path='/openTickets'
          exact={true}
          component={OpenTickets}
        />
        
         <PrivateRoute
          path='/closedTickets'
          exact={true}
          component={ClosedTickets}
        />
         <PrivateRoute
          path='/ticketDetails'
          exact={true}
          component={Ticketing}
        />
                            </Switch>
                        </div>
                    </div>

                 
                </div>

                <div className="footer">
                        <Footer />
                        </div>




            </Router>
        )

    }
}
