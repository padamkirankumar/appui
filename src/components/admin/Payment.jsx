import React, { Component } from 'react'

export default class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      razorpayId: null,
      secretKey: null,
      razorpayList:[
        {"secretKey": "******2333","razorpayId": "********5677" },
        {"secretKey": "******2333","razorpayId": "********5677" },
        {"secretKey": "******2333","razorpayId": "********5677" },
      ]
    }
  }
  render() {
    return (
      <div>
      <div className="row m-0 p-0">
        <div className="col-sm-4 col-12">
          <div className="form-group">
            <label>Razorpay Id<span className="text-red font-bold">*</span></label>
            <input type="text" className="form-control" placeholder="" value={this.state.razorpayId}
              onChange={(e) => this.setState({ razorpayId: e.target.value })}
              autoComplete="off" />
          </div>
        </div>
        <div className="col-sm-4 col-12">
          <div className="form-group">
            <label>Secret Key<span className="text-red font-bold">*</span></label>
            <input type="text" className="form-control" placeholder="" value={this.state.secretKey}
              onChange={(e) => this.setState({ secretKey: e.target.value })}
              autoComplete="off" />
          </div>
        </div>
        <div className="col-4 mt-4">
          <button type="button" className="btn btn-bdr active fs-12"> Save </button>
        </div>
      </div>
      <div className="row">
          <table className="table table-borderless">
            <thead>
              <tr className="">
                <th className="col-3">Secret Key</th>
                <th className="col-5">Razorpay Id</th>
              </tr>
            </thead>
            <tbody>
            {
              this.state.razorpayList.map((items, index) => {
                const { secretKey, razorpayId } = items;
                return (
                    <tr className="">
                        <td className="col-3 geeks">{secretKey}</td>
                        <td className="col-5">{razorpayId}</td>
                    </tr>
                );
            })

            } 

             
            </tbody>
          </table>
      </div>
      </div>
    )
  }
}
