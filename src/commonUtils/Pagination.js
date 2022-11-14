import React, { Component } from "react";
import ReactDOM from "react-dom";
// import Pagination from "react-js-pagination";
import DataTable from 'react-data-table-component';
import Pagination from 'react-bootstrap/Pagination'


class ReactPageNation extends React.Component {
    constructor(props) {
      super(props);
      console.log(">>>>",this.props)
      this.state = {
        pageLimit: 10,
        items:[],
        totalRows:0,
        perPage:10,
        pageDistance:5
        };
    }
   
    render() {

console.log("....Length",this.props?.content,this.props?.content?.length);

if(!this.props || !this.props.totalPages) return null;

return(

 <div>
   
  <Pagination>
    {
    this.props.number+1 == this.props.totalPages && this.props?.content?.length >10 ?null:
    this.props.number+1 > 1 ?<Pagination.First onClick={()=>this.props.changePage(0)}/>:''
 }
 {/* {console.log(">>length con",this.props?.content?.length >=10,this.props?.content?.length)} */}
    {
    this.props.number+1 == this.props.totalPages && this.props?.content?.length >10 ? null :
    this.props.number+1 > 1 ? <Pagination.Prev onClick={()=>this.props.changePage(this.props.number-1)}/> : ''
  }
 
 {
    this.props.number+1  == this.props.totalPages && this.props?.content?.length >10 ?null:
    <>
  
    {Array.from({length:this.props.totalPages}).map((item,index)=>(
     
      <Pagination.Item key={item} active={this.props.number==index} onClick={()=>this.props.changePage(index)}>{index+1}</Pagination.Item>
    ))}
    </>
  }
  

 {
    this.props.number+1 == this.props.totalPages ?null:
  <Pagination.Next onClick={()=>this.props.changePage(this.props.number+1)}/>

 }
 {
    this.props.number+1 == this.props.totalPages?null:
  <Pagination.Last onClick={()=>this.props.changePage(this.props.totalPages-1)}/>

 }
   

</Pagination>
</div>
    );
        }
  }

  export default ReactPageNation;