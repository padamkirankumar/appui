import React, { Component } from 'react';
import edit from '../../assets/images/edit.svg';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import URMService from '../../services/URM/URMService';


export default class Channels extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showChannel: false,
            domainName: {},
            description: "",
            channlesList: [],
            domainLists: [],
            isTable: false,
            clientId: "",
            isMultiDomain: false,
            userName: "",
            isAddDomain: false,
            loggedUser:null
        }

        this.showChannels = this.showChannels.bind(this);
        this.hideChannels = this.hideChannels.bind(this);
        this.createChannel = this.createChannel.bind(this);
        this.hide = this.hide.bind(this);
        this.saveChannels = this.saveChannels.bind(this);
    }

    componentWillMount() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        this.setState({userName : user["cognito:username"], isEdit: false ,loggedUser:user["custom:userId"]});
        if (user) {
            this.setState({ clientId: user["custom:clientId1"],
             userName : user["cognito:username"] }, () => { this.getDomainsList(); });
        }


    }

    getDomainsList() {
        URMService.getDomainsList(this.state.clientId).then((res) => {
            if (res) {
                this.setState({ channlesList: res.data.result, isTable: true });
            }

        });
        this.getMasterDomainsList();
    }

    getMasterDomainsList() {
        URMService.getMasterDomainsList().then((res) => {
            if (res) {
                this.setState({ domainLists: res.data.result });
            }

            if(this.state.domainLists.length === this.state.channlesList.length) {
                this.setState({isAddDomain: true});
            }
            console.log(this.state.isAddDomain);
        });
    }


    showChannels() {
        this.setState({ showModal: true, domainName: this.state.domainLists[0], description: "" });
    }

    hideChannels() {
        this.setState({ showModal: false });
    }

    createChannel() {
        this.setState({ showChannel: true });
    }

    hide() {
        this.setState({ showChannel: false });
    }

    saveChannels() {

        const obj = {

            "name": this.state.domainName.channelName,
            "discription": this.state.description,
            "masterDomianId": this.state.domainName.id,
            "clientId": this.state.clientId,
            "createdBy": parseInt(this.state.loggedUser)
        }
        URMService.saveDomains(obj).then((res) => {
            if (res) {
                toast.success("Domain Saved Successfully");
                this.getDomainsList();
                this.hideChannels();
            }

        });



    }

    getTables() {
        return this.state.isTable && (
            <div className="table-responsive p-0">
                <table className="table table-borderless">
                    <thead>
                        <tr className="">
                            <th className="col-1">S.No </th>
                            <th className="col-2">Domain</th>
                            <th className="col-2">Created By</th>
                            <th className="col-2">Created Date</th>
                            <th className="col-4">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getTableData()}
                    </tbody>
                </table>
                <div>
                    {this.state.isAddDomain &&(
                          <div>
                                            <span style={{ color: "red" }}>User already have all the domains</span>
                                        </div> 
                    )}
                </div>
            </div>
        )
    }

    getTableData() {
        return this.state.channlesList.map((items, index) => {
            const { domaiName, discription, createdDate, createdBy } = items;
            return (
                <tr key={index}>

                    <td className="col-1">{index + 1}</td>
                    <td className="col-2 underline geeks">{domaiName}</td>
                    <td className="col-2">{createdBy}</td>
                    <td className="col-2">{createdDate}</td>
                    <td className="col-4">{discription}</td>

                </tr>
            );
        });
        
        
    }

    handleSelectChange = (e) => {
        let obj;
        this.state.domainLists.forEach(ele => {
            if (ele.id == e.target.value) {
                obj = ele;
            }
        });
        this.setState({ domainName: obj }, () => { this.getDoamin(); });
    }

    getDoamin() {
        if (this.state.domainName == "MultiDomain") {
            this.setState({ isMultiDomain: true });

        } else {
            this.setState({ isMultiDomain: false });
        }
    }

    setDomains() {
        return this.state.isMultiDomain && (
            <div>
                <input type="checkbox" className="form-check-input filled-in"
                    id="textile" />
                <label className="form-check-label" htmlFor="textile">Textile</label>

                <input type="checkbox" className="form-check-input filled-in"
                    id="retail" />
                <label className="form-check-label" htmlFor="retail">Retail</label>

                <input type="checkbox" className="form-check-input filled-in"
                    id="jew" />
                <label className="form-check-label" htmlFor="jew">Jewellery</label>

            </div>
        )
    }

    render() {

        const modules = this.state.domainLists;

        let modulesList = modules.length > 0
            && modules.map((item, i) => {
                return (
                    <option key={i} value={item.id}>{item.channelName}</option>
                )
            }, this);

        return (
            <div className="maincontent">


                <Modal isOpen={this.state.showModal} size="md">
                    <ModalHeader>Create Domain</ModalHeader>
                    <ModalBody>
                        <div className="p-3">
                            <div className="row">
                                <div className="col-12">
                                    <h6 className="fs-14">Please add your new domain name</h6>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <label>Domain</label>

                                        <select className="form-control" onChange={this.handleSelectChange}>

                                            {modulesList}
                                        </select >
                                    </div>
                                </div>
                                <div className="col-12">
                                    {this.setDomains()}
                                </div>

                                <div className="col-12 mt-2">
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea id="des" name="des" rows="4" cols="55" placeholder=" Enter Description Here" value={this.state.description}
                                            onChange={(e) => this.setState({ description: e.target.value })}
                                            autoComplete="off">

                                        </textarea>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn-unic m-r-2" onClick={this.hideChannels}>Cancel</button>
                        <button className="btn-unic active fs-12" onClick={this.saveChannels}>Save</button>


                    </ModalFooter>
                </Modal>

                <div className="row">
                    <div className="col-sm-6 col-12 scaling-center scaling-mb">
                        <h5>List Of Domains</h5>
                    </div>
                    <div className="col-sm-6 col-12 scaling-center scaling-mb text-right mb-1">
                        <button 
                          className={
                            "btn-unic-search active" +
                            (this.state.isAddDomain ? " btn-disable" : "")
                          }
                        
                        onClick={this.showChannels}><i className="icon-retail mr-1"></i>  Add Domain To Client </button>

                    </div>
                </div>
                <div>
                    {this.getTables()}
                </div>
            </div>
        )
    }
}
