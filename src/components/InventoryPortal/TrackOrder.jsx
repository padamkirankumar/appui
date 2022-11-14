import React, { Component } from 'react';
import scan from '../../assets/images/scan.svg';
import InventoryService from "../../services/InventoryService";
import edit from "../../assets/images/edit.svg";
import checkin from "../../assets/images/check_in_01.svg";
import ReactPageNation from "../../commonUtils/Pagination";
import { formatDate } from "../../commonUtils/FormatDate";
import { toast } from 'react-toastify';



class TrackOrder extends Component {
  constructor(props){
    super(props);
    this.state={
      pageNumber:0,
      totalPages:0,
      trackOrderList:[],
    };
    this.trackOrder=this.trackOrder.bind(this);
 
  }


  clearSearch(){
    this.setState({
      barcode:"",
      totalPages:"",
      designCode:"",
        trackOrderList:[]
    }, () => {
    this.trackOrder();
  });    

    
  }

  componentWillMount(){
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.setState({
      selectedStoreId: JSON.parse(sessionStorage.getItem("storeId")),
    });
  
    if (user["custom:isSuperAdmin"] === "true") {
      this.setState(
        {
          clientId: user["custom:clientId1"],
        },
        () => {
         this.trackOrder();
        }
      );
    }else {
      this.setState(
        {
          clientId: user["custom:clientId1"],
        },
        () => {
          this.trackOrder();
        }
      );
    }

  }
  


  trackOrder(pageNumber){
  InventoryService.trackOrder(this.state.barcode?this.state.barcode.trim():null,this.state.selectedStoreId,this.state.designCode?this.state.designCode.trim():null,pageNumber).then((res)=>{  if(res){
    this.setState({
      trackOrderList:res.data,
    toStore:res.data.content.toStore,
    totalPages:res.data.totalPages

    });
  }
});
}


renderTableData(){
  return this.state?.trackOrderList?.content?.map((items,index)=>{
    let date = formatDate(items.createdDate);
const {barcode,fromStoreName,toStoreName,quantity,createdDate,status,description}=items;
return(
          <tr className="" key={index}>
           <td className='col-1'>{index+1}</td>
          <td className='col-2'>{barcode}</td>
          <td className='col-1'>{fromStoreName}</td>
           <td className='col-1'>{toStoreName}</td>
           <td className='col-1'>{quantity}</td>
          <td className='col-2'>{date}</td>
            <td className='col-1'>{status}</td>
           <td className='col-2'>{description}</td>
          <td className="col-1 text-center">
      
     </td>
</tr>   
)
})
}





    render() {
        return (
            <div className="maincontent">
            <div className="row m-0 p-0">
            <div className="col-12 col-sm-6 scaling-center p-l-0">
                  <h5 className="fs-18 mt-3 pt-3">
                    Track Orders
                  </h5>
                </div>
            <div className="col-12 col-sm-2 p-l-0">
            <div className="form-group">
              <label>Barcode</label>
              <input
                type="text"
                className="form-control"
                placeholder="Barcode"
                value={this.state.barcode}
                onChange={(e) => this.setState({ barcode: e.target.value })}
              />
            </div>
          </div>
          <div className="col-12 col-sm-2">
            <div className="form-group">
              <label>Design Code</label>
              <input
                type="text"
                className="form-control"
                placeholder="Design"
                value={this.state.designCode}
                onChange={(e) => this.setState({ designCode: e.target.value })}
              />
            </div>
          </div>
              
                <div className='col-sm-2 mt-4'>
                <button className="btn-unic-search active"
                                onClick={() => {
                                  this.trackOrder();
                                }}
                >Search</button>
                <button
                className="btn-clear m-l-2"
                onClick={() => {
                  this.clearSearch();
                }}
              >
                Clear
              </button>
                </div>
              
                <div className='row mt-2'>
                <div className="table-responsive p-0">
                  <table className="table table-borderless mb-1">
                    <thead>
                      <tr className="">
                        <th className="col-1">S.NO</th>
                        <th className="col-2">BARCODE</th>
                        <th className="col-1">FROM STORE</th>
                        <th className="col-1">TO STORE</th>
                        <th className="col-1">QTY</th>
                        <th className="col-2">TRANSFERRED DATE</th>
                        <th className="col-1">STATUS</th>
                        <th className="col-2">DESCRIPTION</th>
                        <th className="col-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                       
                          {this.renderTableData()}
                    </tbody>
                  </table>

                </div>
                </div>
            </div>
        </div>
        );
    }
}


export default TrackOrder;