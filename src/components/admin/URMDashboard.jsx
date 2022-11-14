import { Chart } from 'chart.js';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import colors from "../../colors.json";
import URMService from '../../services/URM/URMService';


Chart.register(ChartDataLabels);
Chart.defaults.set('plugins.datalabels', {
    color: '#000000',
});
Chart.defaults.font.weight = 'italic';
Chart.defaults.font.size = 16;
Chart.defaults.plugins.legend = false;

export default class URMDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clientId: "",
            domainId: "",
            usersData: [],
            activeUsersData: [],
            storesData: [],
            usersByRoleChart: {},
            activeInactiveUsersChart: {},
            storesVsEmployeesChart: {},
        };
    }

    componentWillMount() {

        const user = JSON.parse(sessionStorage.getItem('user'));

        if (user) {
            this.setState({
                clientId: user["custom:clientId1"],
                domainId: user["custom:domianId1"]
            }, () => {
                this.getusersByRole();
                this.getActiveUsers();
                this.getStoresVsEmployees();
            });

        }
    }

    getActiveUsers() {
        URMService.getActiveUsers(this.state.clientId).then(response => {
            if (response) {
                if (response.data.result !== null && response.data.result.length > 0) {
                    this.setState({ activeUsersData: response.data.result },
                        () => {
                            console.log("ActiveUsersVSInactiveUser", this.state.activeUsersData);
                            let indexName = [];
                            let indexCount = [];
                            let indexColor = [];
                            let indexHoverColor = [];

                            this.state.activeUsersData.forEach(data => {
                                indexName.push(data.name);
                                indexCount.push(data.count);

                            });

                            colors.forEach(data => {
                                indexColor.push(data.normalColorCode);
                                // indexHoverColor.push(data.hoverColorCode);
                            });

                            this.setState({
                                activeInactiveUsersChart: {
                                    labels: indexName,
                                    datasets: [
                                        {
                                            label: "Active vs Inactive Users",
                                            data: indexCount,
                                            backgroundColor: indexColor,
                                            // hoverBackgroundColor: indexHoverColor,
                                            hoverBorderColor: '#282828',
                                            hoverBorderWidth: '3',
                                        }
                                    ]
                                }
                            });
                        }
                    );
                }
            }
        });
    }

    getStoresVsEmployees() {
        URMService.getStoresVsEmployees(this.state.clientId).then(response => {
            if (response) {
                if (response.data.result !== null && response.data.result.length > 0) {
                    this.setState({ storesData: response.data.result },
                        () => {
                            console.log("StoresVsEmployees", this.state.storesData);
                            let indexName = [];
                            let indexCount = [];
                            let indexColor = [];
                            let indexHoverColor = [];

                            this.state.storesData.forEach(data => {
                                indexName.push(data.name);
                                indexCount.push(data.count);
                            });

                            colors.forEach(data => {
                                indexColor.push(data.normalColorCode);
                                // indexHoverColor.push(data.hoverColorCode);
                            });

                            this.setState({
                                storesVsEmployeesChart: {
                                    labels: indexName,
                                    datasets: [{
                                        label: "Stores Vs Pos Employees",
                                        data: indexCount,
                                        backgroundColor: indexColor,
                                        // hoverBackgroundColor: indexHoverColor,
                                        hoverBorderColor: '#282828',
                                        hoverBorderWidth: '3',
                                    }],
                                    options: {
                                        legend: {
                                            display: false //This will do the task
                                        }
                                    }
                                }
                            });
                        }
                    );
                }
            }
        });
    }

    getusersByRole() {
        URMService.getusersByRole(this.state.clientId).then(res => {

            if (res) {
                if (res.data.result !== null && res.data.result.length > 0) {
                    this.setState({ usersData: res.data.result },
                        () => {
                            console.log("usersByRole", this.state.usersData);
                            let indexName = [];
                            let indexCount = [];
                            let indexColor = [];
                            let indexHoverColor = [];

                            this.state.usersData.forEach(data => {
                                indexName.push(data.name);
                                indexCount.push(data.count);
                            });

                            colors.forEach(data => {
                                indexColor.push(data.normalColorCode);
                                // indexHoverColor.push(data.hoverColorCode);
                            });


                            this.setState({
                                usersByRoleChart: {
                                    labels: indexName,
                                    datasets: [
                                        {
                                            label: "Users By Role",
                                            data: indexCount,
                                            backgroundColor: indexColor,
                                            // hoverBackgroundColor: indexHoverColor,
                                            hoverBorderColor: '#282828',
                                            hoverBorderWidth: '3',
                                        },
                                    ]
                                }
                            });
                        }
                    );
                }
            }
        });
    }


    render() {
        return (
            <div className="maincontent">
                <div className="row">
                    <div className="col-12 scaling-center">
                        <h5 className="fs-25">URM Dashboard</h5>
                    </div>
                    <div className="col-sm-4 col-12">
                        <div className="rect">
                            <div className="row">
                                <div className="col-12 scaling-center">
                                    <h5 className="fs-20 mt-2">Users by role</h5>
                                </div>

                            </div>
                            <div className="rect-image pb-3">
                                {Object.keys(this.state.usersByRoleChart).length &&
                                    <Doughnut
                                        data={this.state.usersByRoleChart}
                                        height={400}
                                        width={400}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                        }}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4 col-12">
                        <div className="rect">
                            <div className="row">
                                <div className="col-12 scaling-center">
                                    <h5 className="fs-20 mt-2">Active vs In-active users</h5>
                                </div>

                            </div>
                            <div className="rect-image pb-3">
                                {Object.keys(this.state.activeInactiveUsersChart).length &&
                                    <Doughnut
                                        data={this.state.activeInactiveUsersChart}
                                        height={400}
                                        width={400}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                        }}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4 col-12">
                        <div className="rect">
                            <div className="row">
                                <div className="col-12 scaling-center">
                                    <h5 className="fs-20 mt-2">Stores vs POS Employees</h5>
                                </div>

                            </div>
                            <div className="rect-image pb-3">
                                {Object.keys(this.state.storesVsEmployeesChart).length &&
                                    <Doughnut
                                        data={this.state.storesVsEmployeesChart}
                                        height={400}
                                        width={400}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                        }}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
