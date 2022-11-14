import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';




export default class CustomerData extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
           mobileNumber: '',

        }
        console.log(props);
    }

    close = () => {
      this.props.parentCallback("MODAL");
    }

    render() {
        return  this.props.opened &&   (  
        <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
      
        <Modal.Body>
        <div className="row">
                        <div className="col-4">
                        <label>Phone Number</label>
                        </div>
                        <div className="col-8">
                        <input type="text" name="mobile"
                         />
                        </div>           
                    </div>
                      <br></br>
                    <div className="row">
                        <div className="col-4">
                        <label>Customer Name</label>
                        </div>
                        <div className="col-8">
                        <input type="text" name="customer" />
                        </div>           
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-4">
                        <label>Gender</label>
                        </div>
                        <div className="col-8">
                        <input type="text"  name="gender" />
                        </div>           
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-4">
                        <label>Customer Email </label>
                        </div>
                        <div className="col-8">
                        <input type="text" name="email" />
                        </div>           
                    </div>
      
                    <br></br>
                    <div className="row">
                        <div className="col-4">
                        <label>Date of Birth</label>
                        </div>
                        <div className="col-8">
                        <input type="text" name="dob" />
                        </div>           
                    </div>
                    
                    <br></br>
                    <div className="row">
                        <div className="col-4">
                        <label>Customer GST Number</label>
                        </div>
                        <div className="col-8">
                        <input type="text" name="gst" />
                        </div>           
                    </div>
      
                    <br></br>
                    <div className="row">
                        <div className="col-4">
                        <label>Address</label>
                        </div>
                        <div className="col-8">
                       <textarea rows="3" name="address" />
                        </div>           
                    </div>
                    <br></br>
                    <div className="row">
                        <input type="checkbox" name="check" />    
                    </div>
        </Modal.Body>
      
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.toggleModal}>Close</Button>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal.Dialog>
   
        )
    }
}
