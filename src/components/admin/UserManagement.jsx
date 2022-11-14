import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import User from './User';
import Roles from './Roles';
import Stores from './Stores';
import Channels from './Channels';

export default class UserManagement extends Component {
    render() {
        return (
            <div className="maincontent">
                <h5>User Management</h5>

                <div className="rect p-l-0 p-r-0 pt-0">

                    <div className="navigation">
                        <div style={{ display: 'block', padding: 20 }}>
                            {/* <h4>React-Bootstrap Tab Component</h4> */}
                            <Tabs defaultActiveKey="first">
                                <Tab eventKey="first" title="USERS">
                                    <User />
                                </Tab>
                                <Tab eventKey="second" title="ROLES">
                                   <Roles />
                                </Tab>
                                <Tab eventKey="third" title="STORES">
                                   <Stores />
                                </Tab>
                                <Tab eventKey="fourth" title="CHANNELS">
                                   <Channels />
                                </Tab>
                                <Tab eventKey="fifth" title="BACKOFFICE">
                                   <backOffice/>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
