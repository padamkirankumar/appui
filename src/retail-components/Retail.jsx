import React, { Component } from 'react';
import dress1 from '../assets/images/midi_blue.svg';
import scan from '../assets/images/scan.svg';
import card from "../assets/images/card.svg";
import cash from "../assets/images/cash.svg";
import upi from "../assets/images/upi.svg";
import qr from "../assets/images/qr_new.svg";
import khata from "../assets/images/khata.svg";
import ecommerce from "../assets/images/ecommerce.svg";
import NewSaleService from "../services/NewSaleService";

export default class Retail extends Component {
    constructor(props) {
        super(props);
        this.state = {
    showTable: false,
        };
    }
    showOrderDetails() {
        return this.state.showTable && (
          <div>
            
            <table className="table table-borderless mb-1 mt-2">
                      <thead>
                        <tr className="m-0 p-0">
                          <th className="col-1">S.NO</th>
                          <th className="col-3">ITEM</th>
                          <th className="col-2">QTY</th>
                          <th className="col-2">N/Rate</th>
                          <th className="col-2">Discount</th>
                          <th className="col-2">VALUE</th>
                        </tr>
                      </thead>
                    </table>
                    <table className="table table-borderless gfg mb-0">
                      <tbody>
    
                        {/* {this.renderTableData()} */}
                        <tr>
                            <td className="col-1 geeks">
                              01
                            </td>
                            <td className="col-3">Antheaa <p>#123456789</p></td>
                            <td className="col-2">01</td>
                            <td className="col-2">₹ 1,499.00</td>
                            <td className="col-2">₹ 499.00</td>
                            <td className="col-2">₹ 1,000.00</td>  
                      </tr>
                      <tr>
                            <td className="col-1 geeks">
                              02
                            </td>
                            <td className="col-3">Antheaa <p>#123456789</p></td>
                            <td className="col-2">01</td>
                            <td className="col-2">₹ 1,499.00</td>
                            <td className="col-2">₹ 499.00</td>
                            <td className="col-2">₹ 1,000.00</td>  
                      </tr>
    
                      </tbody>
                    </table>
          </div>
        )
      }
    
    render() {
        return (
            <div className="maincontent">
            <div className="row">
            <div className="col-8">
              <div className="row">
                <div className="col-4">
                  <div className="form-group">
                 
                    <input type="search" className="form-control frm-pr"
                      placeholder="ENTER BARCODE" />
 <button type="button"className="scan">
                               <img src={scan}/> SCAN  
                </button>
                  </div>
                </div>
                <div className="col-8">
                  <button className="btn-unic m-r-2">Find Item</button>
                  <button className="btn-unic">Calculator</button>
                </div>
              </div>
              <div className="row m-0 p-0">
                <div className="col-4 p-l-0">
                  <h5 className="mt-1 mb-3">
                    Order Details
                  </h5>
                </div>
                <div className="col-8 text-right p-r-0">
                  {/* <button className="btn-unic m-r-2">Tag Customer</button>  */}
                  <button
                    type="button"
                    className="btn-unic m-r-2 active"
                    onClick={this.toggleModal}
                  >Tag Customer </button>
                  <button className="btn-unic m-r-2" onClick={this.showDiscount} >Bill Level Discount</button>
                  <button
                    type="button"
                    className="btn-unic mt-0"
                  >
                    Save Payment
                  </button>
                  {/* <button className="btn-unic active">Save Payment</button>  */}
                </div>
                    <div>{this.showOrderDetails()}</div>
                <div className="rect-cardred m-0">
                  <div className="row">
                    <div className="col-2 text-center">
                      <label>Items : <span className="font-bold"> 02</span></label>
                      {/* <h6 className="pt-2">02</h6> */}
                    </div>

                    <div className="col-2">
                      <label>Qty : <span className="font-bold"> 01</span></label>
                      {/* <h6 className="pt-2">{this.state.mrpAmount} ₹</h6> */}
                    </div>
                    <div className="col-2">
                      <label>N/Rate : <span className="font-bold"> ₹ 2,998</span> </label>
                      {/* <h6 className="pt-2">{this.state.promoDisc} ₹</h6> */}
                    </div>
                    <div className="col-3">
                      <label>Discount : <span className="font-bold"> ₹ 998</span> </label>
                      {/* <h6 className="pt-2">{this.state.promoDisc} ₹</h6> */}
                    </div>
                    <div className="col-2">
                      <label>Value : <span className="font-bold"> ₹ 2,000</span> </label>
                      {/* <h6 className="pt-2">{this.state.promoDisc} ₹</h6> */}
                    </div>

                  </div>
                </div>
                <div className="row p-0 m-0 mt-2">
                  <div className="col-6 p-l-0">
                    <h5 className="mt-2">
                      Customer Details
                    </h5>
                  </div>
                  <div className="col-6"></div>
                  <table className="table table-borderless mb-1 mt-2">
                    <thead>
                      <tr className="m-0 p-0">
                        <th className="col-3">NAME</th>
                        <th className="col-3">MOBILE NUMBER</th>
                        <th className="col-3">LOYALTY POINTS</th>
                        <th className="col-3">EXPAIRY DATE</th>

                      </tr>
                    </thead>
                  </table>
                  <table className="table table-borderless gfg mb-0">
                    <tbody>
                      <tr>
                        <td className="col-3 geeks">
                          {/* John Peter */}
                          {this.state.customerFullName}
                        </td>
                        <td className="col-3">+91  {this.state.customerMobilenumber}</td>
                        <td className="col-3">
                        <div className="form-check checkbox-rounded checkbox-living-coral-filled fs-15">
      <input type="checkbox" className="form-check-input filled-in" id="roundedExample2"  />
      <label className="form-check-label" htmlFor="roundedExample2">526</label>
                          {/* <div className="custom-control t_image custom-checkbox V1_checkbox-label">
                            <input className="custom-control-input" type="checkbox" id="check1" />
                            <label className="custom-control-label V1_custom-control-label p-l-1 p-t-0 fs-14"
                              htmlFor="check1">526</label> */}

                          </div>
                        </td>
                        <td className="col-3">31 Dec 2021</td>

                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row mt-3">
                  <div className="col-12">
                      <button type="button" className="btn-unic m-r-2 mb-2">New Trans</button>
                      <button type="button" className="btn-unic m-r-2 mb-2">Save Point</button>
                      <button type="button" className="btn-unic active mb-2 m-r-2">Get Cash</button>
                      <button type="button" className="btn-unic m-r-2 mb-2">Lock Trans</button>
                      <button type="button" className="btn-unic m-r-2 mb-2">Scan Items</button>
                      <button type="button" className="btn-unic active mb-2 m-r-2">Delete Row</button>
                      <button type="button" className="btn-unic">Find Item</button>
                      <button type="button" className="btn-unic m-r-2">Bill Discount</button>
                      <button type="button" className="btn-unic m-r-2">Change Qty</button>
                    
                      <button type="button" className="btn-unic active">Hold Trans</button>
                  </div>
              </div>
            </div>
          <div className="col-4">
              <div className="rect-grey pb-3">
                <h5 className="m-b-5">Billing summary</h5>
                <div className="row">
                  <div className="col-5">
                    <label>Total Amount</label>
                  </div>
                  <div className="col-7 text-right">
                    <label className="font-bold">₹ 1,500.00</label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-5">
                    <label>CGST</label>
                  </div>
                  <div className="col-7 text-right">
                    <label className="font-bold">₹ 75.00</label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-5">
                    <label>SGST</label>
                  </div>
                  <div className="col-7 text-right">
                    <label className="font-bold">₹ 75.00</label>
                  </div>
                </div>


                <div className="payment">
                  <div className="row">
                    <div className="col-5 p-r-0 pt-1">
                      <label>Payable Amount</label>
                    </div>
                    <div className="col-7 p-l-0 pt-1 text-right">
                      <label className="font-bold">₹ 1,650.00</label>
                    </div>
                  </div>

                </div>
                <div className="form-group apply_btn">
                  <button type="button" className=""> Apply</button>
                  <input type="text" className="form-control" placeholder="ENTER RT NUMBER" />
                </div>
                <div className="form-group apply_btn mb-2">
                  <button type="button" className=""> Apply</button>
                  <input type="text" className="form-control" placeholder="COUPON CODE" />
                </div>
                <label className="fs-18 pt-3">Payment Type</label>
                <div className="list row">
                  <ul>
                    <li>
                      <span>
                        <img src={card} />
                        <label>CARD</label>
                      </span>

                    </li>
                    <li>
                      <span>
                        <img src={cash} onClick={this.getCashModel} />
                        <label>CASH</label>
                      </span>

                    </li>
                    <li>
                      <span>
                        <img src={qr} />
                        <label>QR</label>
                      </span>

                    </li>
                    <li>
                      <span className="">
                        <img src={upi} />
                        <label>UPI</label>
                      </span>

                    </li>
                    <li>
                      <span>
                        <img src={khata} />
                        <label>KHATA</label>
                      </span>

                    </li>

                  </ul>
                </div>
                <div className="mt-3">
                  <button className="btn-login_v1 mt-3 mb-3">PROCEED TO CHECKOUT</button>
                  <button className="btn-unic p-2 w-100">HOLD PAYMENT</button>
                </div>
              </div>
            </div>

        </div>
{/*             
                <div className="row">
                    <div className="col-6">
                    <h5>Retail New Sale</h5>
                    <div className="rect">
                            <div className="row m-0 p-0">
                                <div className="col-6">
                                    <div className="form-group">
                                        <label>Invoice Number</label>
                                        <input type="text" className="form-control" placeholder="Enter Invoice Number"/>
                                    </div>   
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label>Invoice Date</label>
                                        <input type="date" className="form-control" placeholder="DD/MM/YY"/>
                                    </div>   
                                </div>
                                <div className="col-6 mt-2">
                                    <div className="form-group">
                                        <label>Till ID</label>
                                        <input type="text" className="form-control" placeholder="Enter ID"/>
                                    </div>   
                                </div>
                                <div className="col-6 mt-2">
                                    <div className="form-group">
                                        <label>Payment Type</label>
                                        <input type="text" className="form-control" placeholder="Enter Payment Type"/>
                                    </div>   
                                </div>
                                <div className="col-6 mt-2">
                                    <div className="form-group">
                                        <label>User ID</label>
                                        <input type="text" className="form-control" placeholder="Enter ID"/>
                                    </div>   
                                </div>
                                <hr className="mt-3 mb-2"/>
                                <div className="col-12 row pb-3">
                                <div className="col-6 mt-2 p-r-0">
                                    <div className="form-group">
                                        <label>Barcode</label>
                                        <input type="text" className="form-control" placeholder="Enter Barcode"/>
                                    </div>   
                                </div>
                                <div className="col-6 mt-4 pt-2 p-l-4">
                                    <button type="button" className="btn-login btn-create">SALES RETURN</button>
                                </div>
                                </div>
                            </div>
                     </div>   
                </div>
                <div className="col-6">
                <h5>Add Item </h5>
                    <div className="rect-blue">
                            <div className="row m-0 p-0">
                                <div className="col-6">
                                    <div className="form-group">
                                        <label>No.of Items</label>
                                        <input type="text" className="form-control" placeholder="Enter No.of Items"/>
                                    </div>   
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label>Barcode</label>
                                        <input type="text" className="form-control" placeholder="Etner Barcode"/>
                                    </div>   
                                </div>
                                <div className="col-6 mt-3">
                                    <div className="form-group">
                                        <label>Till ID</label>
                                        <input type="text" className="form-control" placeholder="Enter ID"/>
                                    </div>   
                                </div>
                                <div className="col-6 mt-3">
                                    <div className="form-group">
                                        <label>Product</label>
                                        <input type="text" className="form-control" placeholder="Enter Product"/>
                                    </div>   
                                </div>
                                <div className="col-6 mt-3">
                                    <div className="form-group">
                                        <label>Price Per Qty</label>
                                        <input type="number" className="form-control" placeholder="Enter Price"/>
                                    </div>   
                                </div>
                                <div className="col-6 mt-3">
                                    <div className="form-group">
                                        <label>Discount</label>
                                        <input type="number" className="form-control" placeholder="%"/>
                                    </div>   
                                </div>
                                <div className="col-6 mt-3 pb-3">
                                    <div className="form-group">
                                        <label>Sales Rate  (Inclusive of Taxes)</label>
                                        <input type="number" className="form-control" placeholder="Enter Sales Rate"/>
                                    </div>   
                                </div>
                                <div className="col-6 mt-3 pt-4">
                                <button type="button" className="btn-bdr w-100 bg-white">ADD ITEM</button>
                                </div>
                              </div>  
                     </div>   
                </div>
            </div>
            <div className="row m-0 p-0 mt-3 mb-2">
                <div className="col-4 p-l-0">
                    <h5 className="mt-3">Item Details</h5>
                </div>
                <div className="col-8 text-right pt-2 p-r-0">
                      <button type="button" className="btn-bdr bg-white m-l-2">CASH <p className="mb-0">CTL+1</p></button>
                      <button type="button" className="btn-bdr bg-white m-l-2">CREDIT CARD <p className="mb-0">CTL+2</p></button>
                      <button type="button" className="btn-bdr bg-white m-l-2">DEBIT CARD <p className="mb-0">CTL+3</p></button>
                      <button type="button" className="btn-bdr bg-white m-l-2 active">WALLET <p className="mb-0">CTL+4</p></button>
                      <button type="button" className="btn-grey active m-l-2">CREDIT CUSTOMER <p className="mb-0">CTL+5</p></button>
                </div>
            </div>

            <div className="rect p-0 pb-3">
                            <div className="p-2">
                            <table className="table table-borderless">
                                    <thead>
                                        <tr className="row m-0 p-0">
                                            <th className="col-1">S.No</th>
                                            <th className="col-2">Barcode</th>
                                            <th className="col-2">Product</th>
                                            <th className="col-2">Price Per Qty</th>
                                            <th className="col-2">Discount</th>
                                            <th className="col-1">GST</th>
                                            <th className="col-2">Sales Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="row m-0 p-0">
                                        <td className="col-1">01</td>
                                          <td className="col-2">COA238106</td>
                                          <td className="col-2">Dairy Milk Chocolate</td>
                                          <td className="col-2">₹ 200:00 </td>
                                          <td className="col-2">10 % </td>
                                          <td className="col-1">14:40 </td>
                                          <td className="col-2">₹ 300:00 </td>
                                        </tr>
                                        <tr className="row m-0 p-0">
                                        <td className="col-1">02</td>
                                          <td className="col-2">COA238106</td>
                                          <td className="col-2">Dairy Milk Chocolate</td>
                                          <td className="col-2">₹ 200:00 </td>
                                          <td className="col-2">10 % </td>
                                          <td className="col-1">14:40 </td>
                                          <td className="col-2">₹ 300:00 </td>
                                        </tr>
                                        <tr className="row m-0 p-0">
                                        <td className="col-1">02</td>
                                          <td className="col-2">COA238106</td>
                                          <td className="col-2">Dairy Milk Chocolate</td>
                                          <td className="col-2">₹ 200:00 </td>
                                          <td className="col-2">10 % </td>
                                          <td className="col-1">14:40 </td>
                                          <td className="col-2">₹ 300:00 </td>
                                        </tr>
                                                             
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    <div className="rect-features mt-3">

                        <ul className="mb-0">
                            <li className="p-l-0">
                            <button type="button" className="btn-grey active m-r-3 w-100">New Trans <p className="mb-0">F1</p></button>
                            </li>
                        
                            <li>
                            <button type="button" className="btn-lock_trans active m-r-3 m-l-3 w-100">Lock Trans<p className="mb-0">F4</p></button>
                            </li>
                         
                            <li>
                            <button type="button" className="btn-dark_blue active m-r-3 m-l-3 w-100">Scan Items<p className="mb-0">F6</p></button>
                            </li>
                            <li className="p-r-0">
                            <button type="button" className="btn-dark_blue active m-l-3 w-100">Delete Row<p className="mb-0">F7</p></button>
                            </li>
                            <li className="p-l-0">
                            <button type="button" className="btn-active m-r-3 m-l-5  w-100">Bill Discount <p className="mb-0">F8</p></button>
                            </li>

                        </ul>
                        
                       
                             <ul>
                      
                            <li> <button type="button" className="btn-bdr active m-r-3 m-l-3 w-100">Change Qty <p className="mb-0">F9</p></button></li>
                            <li>
                            <button type="button" className="btn-dark_blue active m-r-3 m-l-3 w-100">Find Item<p className="mb-0">F10</p></button>
                            </li>
                     
                            <li>
                            <button type="button" className="btn-dark_blue active m-r-3 m-l-3 w-100">Hold Trans<p className="mb-0">F12</p></button>
                            </li>
                            <li>
                            <button type="button" className="btn-dark_blue active m-r-3 m-l-3 w-100">Load Trans<p className="mb-0">F6</p></button>
                            </li>
                            <li className="p-r-0">
                            <button type="button" className="btn-dark_blue active m-l-3 w-100">Billing rate<p className="mb-0">F7</p></button>
                            </li>

                        </ul>
                        
                      
                    
                       
                        </div>
                       */}
                
            </div>
        )
    }
}
