import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React, { Component } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import c_portal_white from '../../assets/images/c_portal_white.svg';
import last_month_sale from '../../assets/images/last_month_sale.svg';
import monthly_sale from '../../assets/images/monthly_sale.svg';
import colors from '../../colors.json';
import MainDashboardService from '../../services/MainDashboardService';
import SalesByCategory from './charts/SalesByCategory';
import SalesByRepresentative from './charts/SalesByRepresentative';
import { chartColors} from "../../commonUtils/colors";


Chart.register(ChartDataLabels);
Chart.defaults.set('plugins.datalabels', {
    color: '#000000',
});
Chart.defaults.font.weight = 'italic';
Chart.defaults.font.size = 16;
Chart.defaults.plugins.legend = false;

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storeId: "",
            clientId: "",
            domainId: "",
            monthlySale: null,
            todaysSale: null,
            lastVsThisSales: null,
            topSales: [],
            salesCategory: [],
            topSalesChart: {},
            salesCategoryChart: {},
            monthlyDifference: '',
            monthlysale: '',
            todaysale: '',
            salesByCategoryData: {
                maintainAspectRatio: false,
                responsive: false,
                labels: [],
                datasets: [
                  {
                    data: [],
                    backgroundColor: chartColors,
                    hoverBackgroundColor: chartColors
                  }
                ]
              },
              getTopfiveSalesByStoreData: {
                labels: [],
                datasets: []
              },
              duration: 'LastOneMonth',
              selectedDuration: 'LastOneMonth',
              durationDetails: [
                  {value: 'LastOneMonth', label: 'Last One Month'},
                  {value: 'LastSixmonths', label: 'Last Six months'},
                  {value: 'ThisYear', label: 'This Year'},
                  {value: 'ThisMonth', label: 'This Month'},
                  {value: 'LastYear', label: 'Last Year'},
                  {value: 'Today', label: 'To Day'}
              ]
        };
    };

    componentDidMount() {        
        const user = JSON.parse(sessionStorage.getItem('user'));
        const storeId = sessionStorage.getItem("storeId");
        const domainData = JSON.parse(sessionStorage.getItem("selectedDomain"));

        // if (domainData.label == "Textile") {
        //     this.setState({ domainId: 1 });
        // } else if (domainData.label == "Retail") {
        //     this.setState({ domainId: 2 });
        // }
        this.setState({ domainId: 1 });
        if (user) {
            this.setState({
                storeId: storeId
            }, () => {
                this.getSalesByCategory();
            });
        }
    }

    getTodaysSale() {
        MainDashboardService.getTodaySale(this.state.storeId).then(response => {
            if (response) {
                if (response.data.result !== null) {
                    this.setState({ todaysSale: response.data.result.amount }, () => {this.getMonthlySale();});
                }
            }

        });
    }

    getMonthlySale() {
        MainDashboardService.getMonthlySale(this.state.storeId).then(response => {
            if (response) {
                if (response.data.result !== null) {
                    this.setState({ monthlySale: response.data.result.amount }, () => {this.getLastVsPresent();});
                }
            }
        });
    }

    getLastVsPresent() {
        MainDashboardService.getLastVsThisMonthSale(this.state.storeId).then(response => {
            if (response) {
                if (response.data.result !== null) {
                    this.setState({ lastVsThisSales: response.data.result.percentValue }, () => { this.getSalesByCategory();});
                }
            }
        });
    }

    getTopfiveSalesByStore() {    
        MainDashboardService.getTopfiveSalesByStore(this.state.selectedDuration, this.state.storeId).then(response => {
            if (response) {
                if (response.data.result !== null && response.data.result.length > 0) {
                    const result = [
                        {
                          "amount": 35500,
                          "storeId": 35,
                          "userId": null,
                          "name": "kylie_cosmetics",
                          "percentValue": 0,
                          "categeoryType": null,
                          "month": null
                        },
                        {
                            "amount": 27500,
                            "storeId": 35,
                            "userId": null,
                            "name": "kylie_cosmetics_1",
                            "percentValue": 0,
                            "categeoryType": null,
                            "month": null
                          },
                          {
                            "amount": 22600,
                            "storeId": 35,
                            "userId": null,
                            "name": "kylie_cosmetics_2",
                            "percentValue": 0,
                            "categeoryType": null,
                            "month": null
                          },
                          {
                            "amount": 20000,
                            "storeId": 35,
                            "userId": null,
                            "name": "kylie_cosmetics",
                            "percentValue": 0,
                            "categeoryType": null,
                            "month": null
                          },
                        {
                          "amount": 22200,
                          "storeId": 185,
                          "userId": null,
                          "name": "kylie_stores",
                          "percentValue": 0,
                          "categeoryType": null,
                          "month": null
                        }
                      ]
                    const vertical =  {
                        labels: result.map((item) => item.name.toString()),
                        datasets: [
                          {
                            label: '',
                            data: result.map((item) => item.amount),
                            backgroundColor: chartColors
                          }
                        ]
                      }
                      this.setState({
                        getTopfiveSalesByStoreData: vertical
                    });                    
                }
            }
        });
    }

    getSalesByCategory() {
        MainDashboardService.getSalesByCategory(this.state.duration, this.state.storeId).then(response => {
            if (response) {
                if (response.data.reportsVo !== null && response.data.reportsVo.length > 0) {
                    const doughtnutdata = {
                        maintainAspectRatio: false,
                        responsive: false,
                        labels:  response.data.reportsVo.map((item) =>  item.name.toString()),
                        datasets: [
                          {
                            data: response.data.reportsVo.map((item) =>  item.amount),
                            backgroundColor: chartColors,
                            hoverBackgroundColor: chartColors
                          }
                        ]
                      }
                      this.setState({
                        salesByCategoryData: doughtnutdata, 
                        monthlyDifference: response.data.difference,
                        monthlysale: response.data.monthlysale,
                        todaysale: response.data.todaysale,
                    });
                } else {
                    this.setState({
                        salesByCategoryData: {
                            labels: [],
                            datasets: [
                                {
                                    data: []
                                }
                            ]
                        }
                    });
                }
            }
        });
    }

    handleDuration = (saleType, e) => {
        if(saleType === 'byCategory') {
            this.setState({ duration: e.target.value }, () => {
                this.getSalesByCategory();
            });
        } 
        // else {
        //     this.setState({ selectedDuration: e.target.value }, () => {
        //         this.getTopSalesRepresentative();
        //     });
        // }
        
    }

    render() {
        return (
            <div className="maincontent">
                <div className="row">
                    <div className="col-12 scaling-center">
                        <h5 className="fs-25">Dashboard</h5>
                    </div>
                    <div className="col-sm-2 col-12">
                        <div className="rect-gradient1">
                            <div className="rect-gradient1-left">
                                <img src={c_portal_white} />
                            </div>
                            <div className="rect-gradient1-right">
                                <label>Today's Sale</label>
                                <h5>₹ {this.state.todaysale}</h5>
                            </div>
                        </div>
                        <div className="rect-gradient2 mt-2">
                            <div className="rect-gradient1-left">
                                <img src={monthly_sale} />
                            </div>
                            <div className="rect-gradient1-right">
                                <label>Monthly Sale</label>
                                <h5>₹ {this.state.monthlysale}</h5>
                            </div>
                        </div>
                        <div className="rect-gradient3 mt-2">
                            <div className="rect-gradient1-left">
                                <img src={last_month_sale} />
                            </div>
                            <div className="rect-gradient1-right">
                                <label>This month sales v/s Last month</label>
                                <h5>{this.state.monthlyDifference} %</h5>
                            </div>
                        </div>
                    </div>
                    <div  className="col-sm-5 col-12">
                        <div className="rect">
                            <div className="row">
                                <div className="col-sm-9 col-12 scaling-center">
                                    <h5 className="fs-20">Sales by category</h5>
                                </div>
                                <div className="col-sm-3 col-12">
                                    <select value={this.state.duration} onChange={(e) => this.handleDuration('byCategory', e)} className="form-control">                                    
                                    <option>Select Type</option>
                                    { 
                                    this.state.durationDetails &&
                                    this.state.durationDetails.map((item, i) => 
                                    (<option key={i} value={item.value}>{item.label}</option>))
                                    }
                                    </select>
                                </div>
                            </div>
                            <div className="rect-image">
                                {/* {Object.keys(this.state.salesCategoryChart).length &&
                                    <Doughnut
                                        data={this.state.salesCategoryChart}
                                        height={400}
                                        width={400}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                        }}
                                    />
                                } */}                                 
                                <SalesByCategory data={this.state.salesByCategoryData}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-5 col-12">
                        <div className="rect">
                            <div className="row">
                                <div className="col-sm-9 col-12 scaling-center">
                                    <h5 className="fs-20">Top 5 Stores By Sales</h5>
                                </div>
                                <div className="col-sm-3 col-12">
                                <select value={this.state.selectedDuration} onChange={(e) => this.handleDuration('bySalesRep', e)} className="form-control">                                    
                                    <option>Select Type</option>
                                        { 
                                            this.state.durationDetails &&
                                            this.state.durationDetails.map((item, i) => 
                                            (<option key={i} value={item.value}>{item.label}</option>))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="rect-image">
                                {/* {Object.keys(this.state.topSalesChart).length &&
                                    <Bar
                                        data={this.state.topSalesChart}
                                        height={400}
                                        width={400}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                        }}
                                    />
                                }  */}
                                <SalesByRepresentative data={this.state.getTopfiveSalesByStoreData}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


