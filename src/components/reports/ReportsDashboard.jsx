import { Chart } from 'chart.js';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React, { Component } from 'react';
import { Bar, Doughnut } from "react-chartjs-2";
import colors from "../../colors.json";
import ListOfReportsGraphsService from '../../services/Reports/ListOfReportsGraphsService';


Chart.register(ChartDataLabels);
Chart.defaults.set('plugins.datalabels', {
    color: '#000000',
});
Chart.defaults.font.weight = 'italic';
Chart.defaults.font.size = 16;
Chart.defaults.plugins.legend = false;

export default class ReportsDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            invoicesGenerated: [],
            topSales: [],
            salesSummary: [],
            activeInactive: [],
            invoicesChart: {},
            activeInactiveChart: {},
            salesSummaryChart: {},
            topSalesChart: {},
            clientId: "",
            domainId: "",
            storeId: "",
            storeNames: [],
        };
    }

    componentWillMount() {

        const user = JSON.parse(sessionStorage.getItem('user'));
        const storeId = sessionStorage.getItem("storeId");

        if (user) {
            this.setState({
                clientId: user["custom:clientId1"],
                domainId: user["custom:domianId1"],
                storeId: storeId
            }, () => {
                this.getInvoicesGenerated();
                this.getTopFiveSales();
                this.getActiveInactivePromos();
                this.getSaleSummary();
            });

        }


    }

    getInvoicesGenerated() {
        console.log(this.state.storeId);
        ListOfReportsGraphsService.getInvoicesGenerated(this.state.storeId).then(response => {
            if (response) {
                if (response.data.result !== null && response.data.result.length > 0) {
                    this.setState({ invoicesGenerated: response.data.result },
                        () => {
                            console.log('Invoices Generated', response);
                            let indexName = [];
                            let indexCount = [];
                            let indexColor = [];
                            let indexHoverColor = [];

                            this.state.invoicesGenerated.forEach(data => {
                                indexName.push(data.month);
                                indexCount.push(data.amount);
                            });

                            colors.forEach(data => {
                                indexColor.push(data.normalColorCode);
                                indexHoverColor.push(data.hoverColorCode);
                            });
                            this.setState({
                                invoicesChart: {
                                    labels: indexName,
                                    datasets: [
                                        {
                                            label: "Invoices Generated",
                                            data: indexCount,
                                            backgroundColor: indexColor,
                                            // hoverBackgroundColor: indexHoverColor,
                                            hoverBorderColor: "#282828",
                                        }
                                    ]
                                }
                            });

                        });
                }
            }
        });
    }

    getTopFiveSales() {
        ListOfReportsGraphsService.getTopFiveSales().then(response => {
            console.log('Top Five Sales', response.data);
            if (response) {
                if (response.data.result !== null && response.data.result.length > 0) {
                    this.setState({ topSales: response.data.result },
                        () => {
                            let indexName = [];
                            let indexCount = [];
                            let indexColor = [];


                            if (this.state.topSales && this.state.topSales.length > 0) {
                                this.state.topSales.forEach(data => {
                                    indexName.push(data.name);
                                    indexCount.push(data.amount);
                                });

                                colors.forEach(data => {
                                    indexColor.push(data.normalColorCode);
                                    // indexHoverColor.push(data.hoverColorCode);
                                });


                                this.setState({
                                    topSalesChart: {
                                        labels: indexName,
                                        datasets: [
                                            {
                                                label: "Sales Summary",
                                                maxBarThickness: 20,
                                                data: indexCount,
                                                backgroundColor: indexColor,
                                                // hoverBackgroundColor: indexHoverColor,
                                                hoverBorderColor: '#282828',
                                            }
                                        ]
                                    }
                                });
                            }

                        });
                }
            }
        });
        console.log("Top", this.state.topSalesChart);
    }

    getActiveInactivePromos() {
        ListOfReportsGraphsService.getActiveInactive().then(response => {

            if (response) {
                if (response.data.result !== null && response.data.result.length > 0) {
                    console.log('Active Inactive Promos', response.data.result);
                    this.setState({ activeInactive: response.data.result },
                        () => {
                            let indexName = [];
                            let indexCount = [];
                            let indexColor = [];
                            let indexHoverColor = [];

                            this.state.activeInactive.forEach(data => {
                                indexName.push(data.name);
                                indexCount.push(data.count);
                            });

                            colors.forEach(data => {
                                indexColor.push(data.normalColorCode);
                                // indexHoverColor.push(data.hoverColorCode);
                            });

                            this.setState({
                                activeInactiveChart: {
                                    labels: indexName,
                                    datasets: [
                                        {
                                            label: "Sales Summary",
                                            data: indexCount,
                                            backgroundColor: indexColor,
                                            // hoverBackgroundColor: indexHoverColor,
                                            hoverBorderColor: '#282828',
                                        }
                                    ]
                                }
                            });
                        });
                }
            }
            console.log("hey", this.state.activeInactiveChart);
        });
    }

    getSaleSummary() {
        ListOfReportsGraphsService.getSaleSummary().then(response => {
            console.log('Sales Summary', response.data);
            if (response) {
                if (response.data.result !== null && response.data.result.length > 0) {
                    this.setState({ salesSummary: response.data.result },
                        () => {
                            let indexName = [];
                            let indexCount = [];
                            let indexColor = [];
                            let indexHoverColor = [];
                            if (this.state.salesSummary && this.state.salesSummary.length > 0) {
                                this.state.salesSummary.forEach(data => {

                                    indexName.push(data.name);
                                    indexCount.push(data.amount);
                                });


                            }


                            colors.forEach(data => {
                                indexColor.push(data.normalColorCode);
                                indexHoverColor.push(data.hoverColorCode);
                            });

                            this.setState({
                                salesSummaryChart: {
                                    labels: indexName,
                                    datasets: [
                                        {
                                            label: "Sales Summary",
                                            data: indexCount,
                                            backgroundColor: indexColor,
                                            // hoverBackgroundColor: indexHoverColor,
                                            hoverBorderColor: '#282828',
                                        }
                                    ]
                                }
                            });
                        });
                }
            }
        });
    }

    render() {
        return (
            <div className="maincontent">
                <div className="row">
                    <div className="col-12 scaling-center">
                        <h5 className="fs-25">Reports Dashboard</h5>
                    </div>
                    <div className="col-sm-4 col-12">
                        <div className="rect">
                            <div className="row">
                                <div className="col-12 scaling-center">
                                    <h5 className="fs-20 mt-2">Invoices Generated</h5>
                                </div>

                            </div>
                            <div className="rect-image pb-3">
                                {Object.keys(this.state.invoicesChart).length &&
                                    <Doughnut
                                        data={this.state.invoicesChart}
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
                                    <h5 className="fs-20 mt-2">Sales Summary</h5>
                                </div>

                            </div>
                            <div className="rect-image pb-3">
                                {Object.keys(this.state.salesSummaryChart).length &&
                                    <Doughnut
                                        data={this.state.salesSummaryChart}
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
                                    <h5 className="fs-20 mt-2">Top 5 Sales</h5>
                                </div>

                            </div>
                            <div className="rect-image pb-3">
                                {Object.keys(this.state.topSalesChart).length &&
                                    <Bar
                                        data={this.state.topSalesChart}
                                        height={400}
                                        width={400}
                                        options={{
                                            indexAxis: 'y',
                                            scales: {
                                                x: {
                                                    grid: {
                                                        display: false
                                                    }
                                                },
                                                y: {
                                                    grid: {
                                                        display: false
                                                    }
                                                }
                                            },
                                            responsive: true,
                                            maintainAspectRatio: false,
                                        }}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-sm-4 col-12">
                        <div className="rect">
                            <div className="row">
                                <div className="col-12 scaling-center">
                                    <h5 className="fs-20 mt-2">Active VS Inactive Promos</h5>
                                </div>

                            </div>
                            <div className="rect-image pb-3">
                                {Object.keys(this.state.activeInactiveChart).length &&
                                    <Doughnut
                                        data={this.state.activeInactiveChart}
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
