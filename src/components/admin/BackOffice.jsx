import React, { Component } from 'react'
import edit from '../../assets/images/edit.svg';

export default class BackOffice extends Component {
    render() {
        return (
            <div className="maincontent">
                  <div className="row">
                    <div className="col-sm-2 col-12 mt-2">
                    <div className="form-group">
                        <label>State</label>
                            <select className='form-control'>
                               <option>Select State</option> 
                               <option>Andhra Pradesh</option> 
                               <option>Telangana</option> 
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-2 col-12 mt-2">
                        <div className="form-group">
                        <label>District</label>
                            <select className="form-control">
                            <option>Select District</option> 
                               <option>Guntur</option> 
                               <option>Krishna</option> 
                            </select >
                        </div>
                    </div>
                    <div className="col-sm-2 col-12 mt-2">
                        <div className="form-group">
                        <label>City</label>
                            <select className="form-control">
                            <option>Select City</option> 
                               <option>Guntur</option> 
                               <option>Narasaraopet</option> 
                            </select >
                        </div>
                    </div>
                    <div className="col-sm-2 col-12 mt-2">
                        <div className="form-group">
                        <label>Store Location</label>
                            <select className="form-control">
                            <option>Select Location</option> 
                               <option>Arundelpet</option> 
                               <option>Bradipet</option> 
                            </select >
                        </div>
                    </div>
                    {/* <div className="col-sm-2 col-12 mt-2">
                        <div className="form-group">
                            <input type="text" className="form-control"
                                placeholder="Store Name"/>
                        </div>
                    </div> */}
                    <div className="col-sm-4 col-12 scaling-center scaling-mb mt-4 pt-2 p-l-0">
                        <button className="btn-unic-search active m-r-2">SEARCH </button>
                        {/* <button className="btn-unic-search active m-r-2" onClick={this.getAllStores}>Clear </button> */}
                        <button className="btn-unic-search active"><i className="icon-retail mr-1"></i>  Add State </button>
                    </div>
                    <div>
                    </div>
                </div>

                <div className="col-sm-12 col-12 scaling-center scaling-mb mt-3">
                    <h5 className='fs-18'>List Of Stores</h5>
                </div>
                <div className="table-responsive p-0">
                <table className="table table-borderless mb-1 mt-2">
                    <thead>
                        <tr className="m-0 p-0">
                            <th className="col-1">S.NO </th>
                            <th className="col-2">State</th>
                            {/* <th className="col-2">Email</th> */}
                            <th className="col-2">District</th>
                            <th className="col-2">Store City</th>
                            <th className="col-2">Location</th>
                            <th className="col-2">Created Date</th>
                            {/* <th className="col-1">Store</th> */}
                            <th className="col-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="col-1">01</td>
                        <td className="col-2 underline">Andhra Pradesh</td>
                        <td className="col-2">Guntur</td>
                        <td className="col-2">Arundelpet</td>
                        <td className="col-2">First Line</td>
                        <td className="col-2">30 Sep 2021</td>
                        <td className="col-1 text-center">
                        <img src={edit} className="w-12 pb-2" />
                         <i className="icon-delete m-l-2 fs-16"></i>
                        </td>
                    </tr>
                    <tr>
                        <td className="col-1">02</td>
                        <td className="col-2 underline">Telangana</td>
                        <td className="col-2">Ranga Reddy</td>
                        <td className="col-2">Hyderabad</td>
                        <td className="col-2">Chandanagar</td>
                        <td className="col-2">30 Sep 2021</td>
                        <td className="col-1 text-center">
                        <img src={edit} className="w-12 pb-2" />
                         <i className="icon-delete m-l-2 fs-16"></i>
                        </td>
                    </tr>
                    <tr>
                        <td className="col-1">02</td>
                        <td className="col-2 underline">Telangana</td>
                        <td className="col-2">Ranga Reddy</td>
                        <td className="col-2">Hyderabad</td>
                        <td className="col-2">Chandanagar</td>
                        <td className="col-2">30 Sep 2021</td>
                        <td className="col-1 text-center">
                        <img src={edit} className="w-12 pb-2" />
                         <i className="icon-delete m-l-2 fs-16"></i>
                        </td>
                    </tr>
                    <tr>
                        <td className="col-1">02</td>
                        <td className="col-2 underline">Telangana</td>
                        <td className="col-2">Ranga Reddy</td>
                        <td className="col-2">Hyderabad</td>
                        <td className="col-2">Chandanagar</td>
                        <td className="col-2">30 Sep 2021</td>
                        <td className="col-1 text-center">
                        <img src={edit} className="w-12 pb-2" />
                         <i className="icon-delete m-l-2 fs-16"></i>
                        </td>
                    </tr>
                    <tr>
                        <td className="col-1">02</td>
                        <td className="col-2 underline">Telangana</td>
                        <td className="col-2">Ranga Reddy</td>
                        <td className="col-2">Hyderabad</td>
                        <td className="col-2">Chandanagar</td>
                        <td className="col-2">30 Sep 2021</td>
                        <td className="col-1 text-center">
                        <img src={edit} className="w-12 pb-2" />
                         <i className="icon-delete m-l-2 fs-16"></i>
                        </td>
                    </tr>

                    </tbody>
                </table>
                </div>

            </div>
        )
    }
}
