import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from '../../commonUtils/PrivateRoute';
import AccountingDashboard from '../../components/AccountingPortal/AccountingDashboard';
import CreateHSNCode from '../../components/AccountingPortal/CreateHSNCode';
import CreateNotes from '../../components/AccountingPortal/CreateNotes';
import CreateTaxMaster from '../../components/AccountingPortal/CreateTaxMaster';
import DebitNotes from '../../components/AccountingPortal/DebitNotes';
import Channels from '../../components/admin/Channels';
import Roles from '../../components/admin/Roles';
import Stores from '../../components/admin/Stores';
import URMDashboard from '../../components/admin/URMDashboard';
import User from '../../components/admin/User';
import UserManagement from '../../components/admin/UserManagement';
import CreateCustomer from '../../components/cashmemo-deliveryslip/CreateCustomer';
import CreateDeliverySlip from '../../components/cashmemo-deliveryslip/CreateDeliverySlip';
import GenerateReturnSlip from '../../components/cashmemo-deliveryslip/GenerateReturnSlip';
import NewSale from '../../components/cashmemo-deliveryslip/NewSale';
import PosDayClose from '../../components/cashmemo-deliveryslip/PosDayClose';
import PromoItemExchange from '../../components/cashmemo-deliveryslip/PromoItemExchange';
import TagCustomer from '../../components/cashmemo-deliveryslip/TagCustomer';
import Dashboard from '../../components/cashmemo-deliveryslip/Dashboard';
// import Dashboard from '../../components/dashboard/Dashboard';
import HRPortal from '../../components/HRPortal/HRPortal';
import BarcodeList from '../../components/InventoryPortal/BarcodeList';
import InventoryList from '../../components/InventoryPortal/InventoryList';
import ListOfPools from '../../components/Promotions-Loyalty/ListOfPools';
import LoyaltyPoints from '../../components/Promotions-Loyalty/LoyaltyPoints';
import ManagePromo from '../../components/Promotions-Loyalty/ManagePromo';
import ListOfPromos from '../../components/Promotions-Loyalty/ListOfPromos';
import ListOfDeliverySlips from '../../components/reports/ListOfDeliverySlips';
import ListOfPromotions from '../../components/reports/ListOfPromotions';
import ListOfReturnSlips from '../../components/reports/ListOfReturnSlips';
import ListOfSaleBills from '../../components/reports/ListOfSaleBills';
import ReportsDashboard from '../../components/reports/ReportsDashboard';
import SalesReport from '../../components/reports/SalesReport';
import Retail from '../../retail-components/Retail';
import Header from '../header/Header';
import SubHeader from '../header/SubHeader';
import Sidebar1 from '../sidebar/Sidebar1';

export default class RetailLayout extends Component {
    constructor(props) {
        super(props)
        //console.log("parent",props);
        this.state = {
            styles: {
                contentDiv: {
                    display: "flex",
                },
                headerTitle: 'Cash Memo & Delivery Slips ',
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

    render() {
        return (
            <Router>
                <div className="w-100">
                    {/* <div className="sidebar">
                        <div className="row">

                            <div className="sidebarBackground">
                                <Sidebar1 headerTitle={this.state.headerTitle} parentCallback={this.handleCallback} />
                            </div>
                        </div>
                    </div>
                    <div className="header">
                        <div className="row">
                            <Header user={this.state.userData} headerTitle={this.state.headerTitle} parentCallback={this.handleCallback} />
                        </div>
                    </div> */}
                       <div className="header">
                        <div className="w-100">
                            <Header user={this.state.userData} headerTitle={this.state.headerTitle} parentCallback={this.handleCallback} />
                        </div>
                        <div className="w-100">
                            <SubHeader parentCallback={this.handleCallback} />
                        </div>
                    </div>
                    <div className="mainbody">
                        <div style={this.state.styles.contentMargin}>
                            <Switch>
                                <PrivateRoute
                                    path='/retail'
                                    exact={true}
                                    component={Retail}
                                />
                                
                                <PrivateRoute
                                    path='/createdeliveryslip'
                                    exact={true}
                                    component={CreateDeliverySlip}
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
                            </Switch>
                        </div>
                    </div>
                </div>
            </Router>
        )

    }
}
