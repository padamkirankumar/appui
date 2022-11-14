import React, { Component, useEffect } from 'react'
import { withRouter } from "react-router-dom";
import logosm from "../../assets/images/logo_01.svg";
import list from "../../assets/images/all_modules.svg";
import arrow from "../../assets/images/circle_arrow.svg";
import deliveryslip from "../../assets/images/create_delivery_slip.svg";
import sale from "../../assets/images/sale.svg";
import promo from "../../assets/images/promo.svg";
import returnslip from "../../assets/images/return_slip.svg";
import addcustomer from "../../assets/images/create_customer.svg";
import tagcustomer from "../../assets/images/tag_customer.svg";
import dayclose from "../../assets/images/close.svg";
import cashmemo from "../../assets/images/cash_memo.svg";
import bigarrow from "../../assets/images/arrow_big_left.svg";
import arrow_sm from "../../assets/images/arrow_sm.svg";
import notes from "../../assets/images/notes.svg";
import notesadd from "../../assets/images/notes_add.svg";
import Transfers from "../../assets/images/transfer.svg";
import stock from "../../assets/images/stock.svg";
import Rebarcoading from "../../assets/images/rebarcoading.svg";
import audits from "../../assets/images/audit.svg";
import ecommerce from "../../assets/images/ecommerce.svg";
import masters from "../../assets/images/management.svg";
import pramotions from "../../assets/images/pramotions.svg";
import loyalty from "../../assets/images/loyalty_promo.svg";
import users from "../../assets/images/user_privileges.svg";
import reports from "../../assets/images/chart.svg";
import r_brand from "../../assets/images/r_brand.svg";
import Hsn from "../../assets/images/hsn.svg";
import Header from '../header/Header';
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom';

class Sidebar1 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            slideValue: "slide-in",
            isSlide: false,
            userData: {},
            count:0,
            headerName: 'Cash Memo & Delivery Slips',
            childrenNames:[],
            selectedChildName:'',
            data: JSON.parse(sessionStorage.getItem('user')),
            moduleNames: [
                {
                    parentName: 'Cash Memo & Delivery Slips',path:'/createdeliveryslip', parentImage: 'icon-cash_memo fs-30 i_icon', children: [
                        // { childName: 'Create Delivery Slip', childImage: 'icon-create_delivery_slip',childPath:'/createdeliveryslip' },
                        { childName: 'New Sale', childImage: 'icon-sale',childPath:'/newsale' },
                        // { childName: 'Promo Item Exchange', childImage: 'icon-promo' ,childPath:'/promoitemexchange'},
                        // { childName: 'Generate Return Slip', childImage: 'icon-return_slip',childPath:'/generatereturnslip'},
                        { childName: 'Create Customer', childImage: 'icon-create_customer' ,childPath:'/createcustomer'},
                        { childName: 'Tag Customer To GV', childImage:'icon-tag_customer'  ,childPath:'/tagcustomer'},
                        { childName: 'Pos Day Close', childImage: 'icon-close' ,childPath:'/posdayclose'},
                    ]
                },
                {
                    parentName: 'Customer Credit Notes', path:'/listofpendingnotes',parentImage: 'icon-notes fs-30 i_icon', children: [
                        { childName: 'Create 111111 Slip', childImage: 'deliveryslip' },
                        { childName: 'New Sale', childImage: 'sale' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                    ]
                },
                {
                    parentName: 'Customer Debit Notes', parentImage: 'icon-notes_add fs-30 i_icon', children: [
                        { childName: 'Create 222222 Slip', childImage: 'deliveryslip' },
                        { childName: 'New Sale', childImage: 'sale' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                    ]
                },
                {
                    parentName: 'Transfers', parentImage: 'icon-transfer fs-30 i_icon', children: [
                        { childName: 'Create 33333 Slip', childImage: 'deliveryslip' },
                        { childName: 'New Sale', childImage: 'sale' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                    ]
                },
                {
                    parentName: 'Stock', parentImage:'icon-stock fs-30 i_icon', children: [
                        { childName: 'Create 4444444 Slip', childImage: 'deliveryslip' },
                        { childName: 'New Sale', childImage: 'sale' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                    ]
                },
                {
                    parentName: 'Rebarcoading', parentImage: 'icon-rebarcoading fs-30 i_icon', children: [
                        { childName: 'Create 555555 Slip', childImage: 'deliveryslip' },
                        { childName: 'New Sale', childImage: 'sale' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                    ]
                },
                {
                    parentName: 'Stock audits', parentImage: 'icon-audit fs-30 i_icon', children: [
                        { childName: 'Create 666666 Slip', childImage: 'deliveryslip' },
                        { childName: 'New Sale', childImage: 'sale' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                    ]
                },
                {
                    parentName: 'Ecommerce', parentImage: 'icon-ecommerce fs-30 i_icon', children: [
                        { childName: 'Create 7777777 Slip', childImage: 'deliveryslip' },
                        { childName: 'New Sale', childImage: 'sale' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                    ]
                },
                {
                    parentName: 'Users & privileges', parentImage: 'icon-user_privileges fs-30 i_icon', children: [
                        { childName: 'Create 8888 Slip', childImage: 'deliveryslip' },
                        { childName: 'New Sale', childImage: 'sale' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                    ]
                },
                {
                    parentName: 'Manage Masters', parentImage: 'icon-management fs-30 i_icon', children: [
                        { childName: 'Create 989898 Slip', childImage: 'deliveryslip' },
                        { childName: 'New Sale', childImage: 'sale' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                    ]
                },
                { 
                    parentName: 'Manage Promotions', parentImage: 'icon-pramotions fs-30 i_icon', children: [
                        { childName: 'Create 121313131 Slip', childImage: 'deliveryslip' },
                        { childName: 'New Sale', childImage: 'sale' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                    ]
                },
                {
                    parentName: 'Loyalty promo Settings', parentImage: 'icon-loyalty_promo fs-30 i_icon', children: [
                        { childName: 'Create 223343422222 Slip', childImage: 'deliveryslip' },
                        { childName: 'New Sale', childImage: 'sale' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                    ]
                },
                {
                    parentName: 'Reports',path:'/salereport', parentImage: 'icon-chart fs-30 i_icon', children: [
                        { childName: 'Sale Report', childImage: 'deliveryslip',childPath:'/salereport' },
                        { childName: 'List Of Sale Bills', childImage: 'sale' ,childPath:'/listofsalebills' },
                        { childName: 'List Of Delivery Slips', childImage: 'deliveryslip',childPath:'/listofdeliveryslips'  },
                        { childName: 'List Of Return Slips', childImage: 'deliveryslip',childPath:'/listofreturnslips'  },
                        { childName: 'Live Show Orders', childImage: 'deliveryslip',  },
                    ]
                },
                {
                    parentName: 'R - Brand', parentImage: 'icon-r_brand fs-30 i_icon', children: [
                        { childName: 'Create 676543 Slip', childImage: 'deliveryslip' },
                        { childName: 'New Sale', childImage: 'sale' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                    ]
                },
                {
                    parentName: 'Text & HSN Master', parentImage: 'icon-hsn fs-30 i_icon', children: [
                        { childName: 'Create 76677666776 Slip', childImage: 'deliveryslip' },
                        { childName: 'New Sale', childImage: 'sale' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                        { childName: 'Create Delivery Slip', childImage: 'deliveryslip' },
                    ]
                },


            ]
        }
        
        this.handleClick = this.handleClick.bind(this);
    }
    newSale = () => {
        this.state.slideValue = "slide-out";
        this.props.history.push("newsale");
    }
    createDeliverySlip = () => {
        this.state.slideValue = "slide-out";

        this.props.history.push("createdeliveryslip");
    }
    promoExchange = () => {
        this.state.slideValue = "slide-out";

        this.props.history.push("promoitemexchange");
    }
    generateReturnSlip = () => {
        this.state.slideValue = "slide-out";

        this.props.history.push("generatereturnslip");
    }

    createCustomer = () => {
        this.state.slideValue = "slide-out";

        this.props.history.push("createcustomer");
    }
    handleCheck(e) {
        //   console.log(e.currentTarget.dataset);

        console.log(e);
    }
    handleClick = (item, event) => {
        this.state.count++;
        console.log(item);
        this.state.childrenNames=item.children;
        this.setState({ headerName: item.parentName });
        sessionStorage.setItem('headerName', item.parentName);
        this.setState({ slideValue: "slide-out" });
        const domainName =  JSON.parse(sessionStorage.getItem('domainName'));
       
        if(domainName.label ==='TEXTILE'){
            if (item.parentName === "Cash Memo & Delivery Slips") {
                this.setState({selectedChildName:'Create Delivery Slip'})
                this.props.history.push("createdeliveryslip", { name: "cashmemocreateeeee" })
            } else if (item.parentName === "Customer Credit Notes") {
                this.props.history.push("newsale", { name: "promooooooooooooo" });
            } else if (item.parentName === "Customer Debit Notes") {
                this.props.history.push("promoitemexchange", { name: "promooooooooooooo" });
            } else if (item.parentName === "Transfers") {
                this.props.history.push("generatereturnslip", { name: "returnslip" });
            } else if (item.parentName === "Reports") {
                this.props.history.push("salereport", { name: "returnslip" });
            } 
        } else if(domainName.label ==='RETAIL'){
            this.props.history.push("retail")
        }else if(domainName.label ==='ELECTRONICS'){
            this.props.history.push("electronics")
        }
    
        this.props.parentCallback(item.parentName);
        event.preventDefault();

        //do what you want to do with the parameter
    }
    clickChild=(val)=>{
        this.setState({selectedChildName:val.childName})
        const domainName =  JSON.parse(sessionStorage.getItem('domainName'));
        if(domainName.label ==='TEXTILE'){
            const path = val.childPath.split("/");
            this.props.history.push(path[1])
        } else if(domainName.label ==='RETAIL'){
            this.props.history.push("retail")
        }else if(domainName.label ==='ELECTRONICS'){
            this.props.history.push("electronics")
        }
    }
     slideArrow(){
     return this.state.count>0 &&(
        <button className="btn-transparent" onClick={() => this.setState({ slideValue: "slide-out" })} type="button"><img src={bigarrow} /></button>
     )
     }
componentWillMount(){
    this.state.moduleNames.forEach((ele,index)=>{
        if(this.props.location.pathname===ele.path){
            this.state.childrenNames = this.state.moduleNames[index].children;
        }
       }); 
}


    render() {
        return (
            <div className="">
                <div className="sidebar-logo text-center">
                    <img src={logosm} />
                </div>
                <div className="sidebar-menu">
                    <ul className="">
                        <li className="module" onClick={() => this.setState({ slideValue: "slide-in" })}>
                           <i className="icon-all_modules"></i> <span>All Modules</span> <i className="icon-circle_arrow m-l-2"></i>
                        
                        </li>
                        </ul>
                        {/* <li className="active" onClick={this.createDeliverySlip}>
                            <img src={deliveryslip} /><span>Create Delivery Slip</span>
                        </li>
                        <li className="" onClick={this.newSale}>
                            <img src={sale} /><span>New Sale</span>
                        </li>
                        <li className="" onClick={this.promoExchange}>
                            <img src={promo} /><span>Promo Item Exchange</span>
                        </li>
                        <li className="" onClick={this.generateReturnSlip}>
                            <img src={returnslip} /><span>Generate Return Slip</span>
                        </li>
                        <li className="" onClick={this.createCustomer}>
                            <img src={addcustomer} /><span>Create Customer</span>
                        </li>
                        <li className="">
                            <img src={tagcustomer} /><span>Tag Customer to GV</span>
                        </li>
                        <li className="">
                            <img src={dayclose} /><span>POS Day Close</span>
                        </li> */}
                        <ul>
                        {this.state.childrenNames.map((element, index) => {
                                return <li key={index} className={(this.state.selectedChildName=== element.childName)?"active":''}  onClick={e => this.clickChild(element, e)}>
                                    {/*  (this.state.btnDisable? ' btn-disable': '')
                                    <img className="arrow-align" src={arrow_sm} />
                                    <img src={element.parentImage} /> */}
                                    {/* <img  className="arrow-align" src={element.childImage} />  */}
                                    <i className={element.childImage}></i>
                                    <span>{element.childName}</span>


                                </li>;
                            })}   
                    </ul>
                </div>
                <div className={this.state.slideValue}>
                    <div className="row">
                        <div className="col-6 slide-head">
                            <h6 className="text-blue fs-20 font-bold">List Of Modules</h6>
                        </div>
                        <div className="col-6 text-right slide-head">
                            {/* <button className="btn-transparent" onClick={() => this.setState({ slideValue: "slide-out" })} type="button"><img src={bigarrow} /></button> */}
                       {this.slideArrow()}
                        </div>
                    </div>
                    <div className="slide-body">
                        {/* <ul>
                        <li>
                                <img className="arrow-align"src={arrow_sm}/>                           
                                <img src={cashmemo} />
                                <h6>Cash Memo & Delivery Slips</h6>
                        </li>
               
                        <li>
                                <img className="arrow-align"src={arrow_sm}/>  
                                <img src={notes} />
                                <h6>Customer Credit Notes</h6>
                        </li>
                        <li>
                                <img className="arrow-align"src={arrow_sm}/>  
                                <img src={notesadd} />
                                <h6>Customer Debit Notes</h6>
                        </li>
                        <li>
                                <img className="arrow-align"src={arrow_sm}/>  
                                <img src={Transfers} />
                                <h6>Transfers</h6>
                        </li>
                        <li>
                                <img className="arrow-align"src={arrow_sm}/>                           
                                <img src={stock} />
                                <h6>Stock</h6>
                        </li>
               
                        <li>
                                <img className="arrow-align"src={arrow_sm}/>  
                                <img src={Rebarcoading} />
                                <h6>Rebarcoading</h6>
                        </li>
                        <li>
                                <img className="arrow-align"src={arrow_sm}/>  
                                <img src={audits} />
                                <h6>Stock audits</h6>
                        </li>
                        <li>
                                <img className="arrow-align"src={arrow_sm}/>  
                                <img src={ecommerce} />
                                <h6>Ecommerce</h6>
                        </li>
                        <li>
                                <img className="arrow-align"src={arrow_sm}/>  
                                <img src={users} />
                                <h6>Users & privileges</h6>
                        </li>
                        <li>
                                <img className="arrow-align"src={arrow_sm}/>                           
                                <img src={masters} />
                                <h6>Manage Masters</h6>
                        </li>
               
                        <li>
                                <img className="arrow-align"src={arrow_sm}/>  
                                <img src={pramotions} />
                                <h6>Manage Pramotions</h6>
                        </li>
                        <li>
                                <img className="arrow-align"src={arrow_sm}/>  
                                <img src={loyalty} />
                                <h6>Loyalty promo Settings</h6>
                        </li>
                        <li>
                                <img className="arrow-align"src={arrow_sm}/>  
                                <img src={reports} />
                                <h6>Reports</h6>
                        </li>
                        <li>
                                <img className="arrow-align"src={arrow_sm}/>  
                                <img src={r_brand} />
                                <h6>R - Brand</h6>
                        </li>
                        <li>
                                <img className="arrow-align"src={arrow_sm}/>  
                                <img src={Hsn} />
                                <h6>Text & HSN Master</h6>
                        </li>
                    </ul> */}
                        <ul>
                            {this.state.moduleNames.map((element, index) => {
                                if(this.state.data["cognito:groups"][0]==="super_admin" || this.state.data["cognito:groups"][0]==="admin" )
                                {
                                    return <li key={index} onClick={e => this.handleClick(element, e)}>
                                        <i className="arrow-align icon-arrow_sm fs-18"></i>
                                    {/* <img className="arrow-align" src={arrow_sm} /> */}
                                    <i className={element.parentImage}></i>
                                    {/* <img src={element.parentImage} /> */}
                                    <h6>{element.parentName}</h6>
                                </li>;
                                } else if(this.state.data["cognito:groups"][0]==="cashier"){
                                    return <li key={index} className={index<3?'':'card-disable'} onClick={e => this.handleClick(element, e)} >
                                    {/* <img className="arrow-align" src={arrow_sm} /> */}
                           
                                    <i className="arrow-align icon-arrow_sm fs-18"></i>
                                    <i className={element.parentImage}></i>
                                    <h6>{element.parentName}</h6>
                                </li>;
                                }
                              
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Sidebar1);
