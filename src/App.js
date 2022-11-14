import React, { useEffect } from "react";
import './App.scss';
import Login from './components/login/Login';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout from './shared/layout/Layout';
import RetailLayout from "./shared/retail-layout/RetailLayout";
import ElectronicsLayout from "./shared/electronics-layout/ElectronicsLayout";
// import { withTranslation } from 'react-i18next';
import { saveDataInIndexDB } from './utility.js';
import PrivateRoute from "./commonUtils/PrivateRoute";
const App = () => {
  const sampleJSONdata = [{
    type: 'codes',
    id: '1'
  }, {
    type: 'cdsfsdss',
    id: '2',

  }];

  saveDataInIndexDB(sampleJSONdata);



  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  });
  return (
    <Router>
      <Route exact path="/">
        <Login />
      </Route>
      {/* <PrivateRoute
                                    path='/'

                                    component={Login}
                                /> */}
      <Switch>

        {/* <Route path="/createdeliveryslip">
         <Layout  />
       </Route> */}
        <PrivateRoute
          path='/createdeliveryslip'
          exact={true}
          component={Layout}
        />

        {/* <Route path="/newsale">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/newsale'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/promoitemexchange">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/promoitemexchange'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/generatereturnslip">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/generatereturnslip'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/createcustomer">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/createcustomer'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/tagcustomer">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/tagcustomer'
          exact={true}
          component={Layout}
        />

        {/* <Route path="/posdayclose">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/posdayclose'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/salereport">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/salereport'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/listofsalebills">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/listofsalebills'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/listofdeliveryslips">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/listofdeliveryslips'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/listofreturnslips">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/listofreturnslips'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/usermanagement">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/usermanagement'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/listofPromotions">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/listofPromotions'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/inventoryList">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/inventoryList'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/barcodeList">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/barcodeList'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/users">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/users'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/roles">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/roles'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/stores">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/stores'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/domain">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/domain'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/createHSN">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/createHSN'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/createNotes">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/createNotes'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/createTaxMaster">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/createTaxMaster'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/debitNotes">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/debitNotes'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/listOfPools">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/listOfPools'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/loyaltyPoints">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/loyaltyPoints'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/managePromo">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/managePromo'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/hrPortal">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/hrPortal'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/accountingDashboard">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/accountingDashboard'
          exact={true}
          component={Layout}
        />

        {/* <Route path="/reportsDashboard">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/reportsDashboard'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/urmDashboard">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/urmDashboard'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/listOfEstimationSlips">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/listOfEstimationSlips'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/rebarcoding">
         <Layout />
       </Route> */}
        <PrivateRoute
          path='/rebarcoding'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/retail">
         <RetailLayout />
       </Route> */}
        <PrivateRoute
          path='/retail'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/electronics">
         <ElectronicsLayout />
       </Route> */}
        <PrivateRoute
          path='/electronics'
          exact={true}
          component={Layout}
        />
        {/* <Route path="/dashboard">
         <Layout />
       </Route> */}


        <PrivateRoute
          path='/goodstransfer'
          exact={true}
          component={Layout}
        />
        <PrivateRoute
          path='/ordershipment'
          exact={true}
          component={Layout}
        />

        <PrivateRoute
          path='/receiveorder'
          exact={true}
          component={Layout}
        />
 <PrivateRoute
          path='/trackorder'
          exact={true}
          component={Layout}
        />
        <PrivateRoute
          path='/dashboard'
          exact={true}
          component={Layout}
        />

        <PrivateRoute
          path='/backOffice'
          exact={true}
          component={Layout}
        />

        <PrivateRoute
          path='/taxMaster'
          exact={true}
          component={Layout}
        />

        <PrivateRoute
          path='/hsnDetails'
          exact={true}
          component={Layout}
        />


        <PrivateRoute
          path='/payment'
          exact={true}
          component={Layout}
        />

        <PrivateRoute
          path='/productsCombo'
          exact={true}
          component={Layout}
        />
        <Route
          path='/adminDetails'
          exact={true}
          component={Layout}
        />
        <Route
          path='/clientDetails'
          exact={true}
          component={Layout}
        />
        <Route
          path='/clientSupportDetails'
          exact={true}
          component={Layout}
        />
        <Route
          path='/clientMapping'
          exact={true}
          component={Layout}
        />
        <Route
          path='/openTickets'
          exact={true}
          component={Layout}
        />
        <Route
          path='/totalTickets'
          exact={true}
          component={Layout}
        />
        <Route
          path='/closedTickets'
          exact={true}
          component={Layout}
        />
        <Route
          path='/ticketDetails'
          exact={true}
          component={Layout}
        />
      </Switch>
    </Router>
  );
}

export default App;
