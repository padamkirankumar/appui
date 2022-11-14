import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import colors from '../../colors.json';
import AccountsDashboardService from '../../services/AccountingPortal/AccountsDashboardService';

export default class AccountingDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            storeId: null,
            debitNotesByStore: [],
            debitNotesByStoreGraph: {},
            usedBalancedAmount: [],
            usedBalancedAmountChart: {},
        };
    }

    componentWillMount() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const storeId = sessionStorage.getItem("storeId");
        if (user) {
            this.setState({
                storeId: storeId,
            }, () => {
                this.debitNotesStore();
                this.usedBalanced();
            });
        }
    }

    debitNotesStore() {
        AccountsDashboardService.getDebitNotes().then(res => {
            console.log("Debit Notes", res.data.result);
            if (res) {
                if (res.data.result !== null && res.data.result.length > 0) {
                    this.setState({ debitNotesByStore: res.data.result },
                        () => {
                            let indexName = [];
                            let indexCount = [];
                            let indexColor = [];
                            let indexHoverColor = [];
                            let indexLabels = [];

                            this.state.debitNotesByStore.forEach(data => {
                                indexName.push(data.name);
                                indexCount.push(data.damount);
                            });


                            colors.forEach(data => {
                                indexColor.push(data.normalColorCode);
                                indexHoverColor.push(data.hoverColorCode);
                            });
                            this.setState({
                                debitNotesByStoreGraph: {
                                    labels: indexName,
                                    datasets: [
                                        {
                                            label: "Debit Amount",
                                            data: indexCount,
                                            backgroundColor: indexColor,
                                            hoverBorderColor: "#282828",
                                            maxBarThickness: 40,
                                        }
                                    ]
                                }
                            });

                        });
                }
            }
        });
    }

    usedBalanced() {
        AccountsDashboardService.getUsedBalanced().then(res => {
            console.log("Used Balanced", res.data.result);
            if (res) {
                if (res.data.result !== null && res.data.result.length > 0) {
                    this.setState({ usedBalancedAmount: res.data.result },
                        () => {
                            let indexName = [];
                            let indexCount = [];
                            let indexCount2 = [];
                            let indexColor = [];
                            let indexHoverColor = [];
                            let indexLabels = [];


                            this.state.usedBalancedAmount.forEach(data => {
                                indexName.push(data.name);
                                indexCount.push(data.actualAmount);
                                indexCount2.push(data.transactionAmount);
                            });

                            colors.forEach(data => {
                                indexColor.push(data.normalColorCode);
                                indexHoverColor.push(data.hoverColorCode);
                            });

                            this.setState({
                                usedBalancedAmountChart: {
                                    labels: indexName,
                                    datasets: [
                                        {
                                            label: "Used Amount",
                                            data: indexCount,
                                            backgroundColor: '#ffb93f',
                                            hoverBorderColor: "#282828",
                                            maxBarThickness: 40,
                                        },
                                        {
                                            label: "Balanced Amount",
                                            backgroundColor: '#25f1d5',
                                            data: indexCount2,
                                            hoverBorderColor: "#282828",
                                            maxBarThickness: 40,
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
                    <div className="col-sm-6 col-12 scaling-center mb-3">
                        <h5 className="mb-2 fs-18 p-l-0">Accounting Dashboard</h5>
                    </div>
                    <div className="col-sm-2 col-12 mb-3">
                        <div className="form-group">
                        <label>From Date</label>
                            <input type="text" className="form-control" placeholder="FROM DATE" />
                        </div>
                    </div>
                    <div className="col-sm-2 col-12 mb-3">
                        <div className="form-group">
                        <label>To Date</label>
                            <input type="text" className="form-control" placeholder="TO DATE" />
                        </div>
                    </div>
                    <div className="col-sm-2 col-12 scaling-center p-l-0 mb-3 pt-4">
                        <button type="button" className="btn-unic-search active">SEARCH</button>
                    </div>
                    <div className="col-sm-6 col-12">
                        <div className="rect">
                            <div className="row">
                                <div className="col-12 scaling-center">
                                    <h5 className="fs-16">Debit Notes by stores</h5>
                                </div>
                                {/* <div className="col-3">
                                <select class="form-control">
                                    <option>Today</option>
                                    <option>Last One Month</option>
                                    <option>Last 6 Months</option>
                                    <option>Last Year</option>
                                </select>
                            </div> */}
                            </div>
                            <div className="rect-image">
                                {Object.keys(this.state.debitNotesByStoreGraph).length &&
                                    <Bar
                                        data={this.state.debitNotesByStoreGraph}
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
                    <div className="col-sm-6 col-12">
                        <div className="rect">
                            <div className="row">
                                <div className="col-12 scaling-center">
                                    <h5 className="fs-16">Used & balanced amounts by stores</h5>
                                </div>
                                {/* <div className="col-3">
                                <select class="form-control">
                                    <option>Today</option>
                                    <option>Last One Month</option>
                                    <option>Last 6 Months</option>
                                    <option>Last Year</option>
                                </select>
                            </div> */}
                            </div>
                            <div className="rect-image">
                                {/* <img src={graph2} /> */}
                                {Object.keys(this.state.usedBalancedAmountChart).length &&
                                    <Bar
                                        data={this.state.usedBalancedAmountChart}
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
