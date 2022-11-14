import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from '../../commonUtils/PrivateRoute';
import Electronics from '../../electronics-components/Electronics';

import Header from '../header/Header';
import SubHeader from '../header/SubHeader';
import Sidebar1 from '../sidebar/Sidebar1';
export default class ElectronicsLayout extends Component {
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
    componentWillMount(){
        this.state.userData=JSON.parse(sessionStorage.getItem('user'));
//        console.log("USER",JSON.parse(sessionStorage.getItem('user')));
        this.setState({headerTitle: 'Cash Memo & Delivery Slips'});
    }

    handleCallback = (childData) =>{
        this.setState({headerTitle: childData});
    }

    render() {
        return (
            <Router>
                  <div className="w-100">
                      {/* <div className="sidebar">
                        <div className="row">
                      
                                <div className="sidebarBackground">
                                    <Sidebar1 headerTitle={this.state.headerTitle}  parentCallback = {this.handleCallback} />
                                </div>
                    </div>
                     </div>
                     <div className="header">
                    <div className="row">
                        <Header user = {this.state.userData} headerTitle={this.state.headerTitle} parentCallback = {this.handleCallback} />
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
                                    path='/electronics'
                                    exact={true}
                                    component={Electronics}
                                />
                            </Switch>
                        </div>
                    </div>
                    </div>
            
          
                         
              
            </Router>
        )

    }
}
