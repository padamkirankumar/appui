import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";


export default class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTerms: false
        }

        this.getTermsConditions = this.getTermsConditions.bind(this);
        this.hideTermsConditions = this.hideTermsConditions.bind(this);
    }

    getTermsConditions() {
        this.setState({showTerms: true});
    } 

    hideTermsConditions() {
        this.setState({showTerms: false});
    } 


    render() {
        return (
            <div>
                 <Modal isOpen={this.state.showTerms} size="xl">
                    <ModalHeader>Terms & Conditions </ModalHeader>
                    <ModalBody>
                        <h5>AGREEMENT TO TERMS</h5>
                        <p>These Terms and Conditions constitute a legally binding agreement made between you, 
                            whether personally or on behalf of an entity (“you”) and [business entity name] (“we,” “us” or “our”), 
                            concerning your access to and use of the [website name.com] website as well as any other media form, 
                            media channel, mobile website or mobile application related, linked, or otherwise connected thereto 
                            (collectively, the “Site”).
                            </p>
                            <p>You agree that by accessing the Site, you have read, understood, and agree to be bound by all of 
                                these Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you 
                                are expressly prohibited from using the Site and you must discontinue use immediately.
                                
                            </p>
                            <p>
                            Supplemental terms and conditions or documents that may be posted on the Site from time to time are hereby 
                            expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes 
                            or modifications to these Terms and Conditions at any time and for any reason.
                            </p>
                            <p>
                            We will alert you about any changes by updating the “Last updated” date of these Terms and Conditions, 
                            and you waive any right to receive specific notice of each such change.
                            </p>
                            <p>
                            It is your responsibility to periodically review these Terms and Conditions to stay informed of updates. You will be subject 
                            to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Terms and Conditions by 
                            your continued use of the Site after the date such revised Terms and Conditions are posted.
                            </p>
                            <p>
                            The information provided on the Site is not intended for distribution to or use by any person or entity in any jurisdiction or country 
                            where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement 
                            within such jurisdiction or country.
                            </p>
                            <p>
                            Accordingly, those persons who choose to access the Site from other locations do so on their own initiative and are solely 
                            responsible for compliance with local laws, if and to the extent local laws are applicable.
                            </p>

                            <h5 className="mt-3">INTELLECTUAL PROPERTY RIGHTS</h5>
                            <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website 
                                designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, 
                                and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark 
                                laws and various other intellectual property rights and unfair competition laws of the United States, foreign 
                                jurisdictions, and international conventions.
                                </p>
                               <p>
                               The Content and the Marks are provided on the Site “AS IS” for your information and personal use only. Except as 
                               expressly provided in these Terms and Conditions, no part of the Site and no Content or Marks may be copied, 
                               reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, 
                               distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express 
                               prior written permission.
                               </p> 
                               <p>
                               Provided that you are eligible to use the Site, you are granted a limited license to access and use the Site and to download or print a copy of any portion of the Content to which you have properly gained access solely for your personal, non-commercial use. We reserve all rights not expressly granted to you in and to the Site, the Content and the Marks.
                               </p>
                               <h5 className="mt-3">USER REPRESENTATIONS</h5>
                               <p>By using the Site, you represent and warrant that:</p>
                               <p className="text-blue">[(1) all registration information you submit will be true, accurate, current, and complete; <br /> 
                               (2) you will maintain the accuracy of such information and promptly update such registration information
                                as necessary;]</p>
                                <p>(3) you have the legal capacity and you agree to comply with these Terms and Conditions;</p>
                                <p>[(4) you are not under the age of 13;]</p>
                                <p>(5) not a minor in the jurisdiction in which you reside [, or if a minor, you have received parental permission to use the Site];</p>
                                <p>(6) you will not access the Site through automated or non-human means, whether through a bot, script, or otherwise;</p>
                                <p>(7) you will not use the Site for any illegal or unauthorized purpose;</p>
                                <p>(8) your use of the Site will not violate any applicable law or regulation.</p>
                                <p>If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Site (or any portion thereof).</p>
                                <h5 className="mt-3">USER REGISTRATION</h5>
                                <p>You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.</p>
                                <h5 className="mt-3">PROHIBITED ACTIVITIES</h5>
                                <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
                                <p>As a user of the Site, you agree not to: </p>
                                <p>1. systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</p>
                                <p>2. make any unauthorized use of the Site, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.</p>
                                <p>3. use a buying agent or purchasing agent to make purchases on the Site.</p>
                                <p>4. use the Site to advertise or offer to sell goods and services.</p>
                                <p>5. circumvent, disable, or otherwise interfere with security-related features of the Site, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Site and/or the Content contained therein.</p>
                                <h5 className="mt-3">USER GENERATED CONTRIBUTIONS</h5>
                                <p>The Site may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Site, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, “Contributions”).</p>
                                <p>Contributions may be viewable by other users of the Site and through third-party websites. As such, any Contributions you transmit may be treated as non-confidential and non-proprietary. When you create or make available any Contributions, you thereby represent and warrant that:</p>
                                <h5 className="mt-3">CONTRIBUTION LICENSE</h5>
                                <p>By posting your Contributions to any part of the Site <span className="text-blue">[or making Contributions accessible to the Site by linking your account from the Site to any of your social networking accounts],</span> you automatically grant, and you represent and warrant that you have the right to grant, to us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and license to host, use, copy, reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, cache, publicly perform, publicly display, reformat, translate, transmit, excerpt (in whole or in part), and distribute such Contributions (including, without limitation, your image and voice) for any purpose, commercial, advertising, or otherwise, and to prepare derivative works of, or incorporate into other works, such Contributions, and grant and authorize sublicenses of the foregoing. The use and distribution may occur in any media formats and through any media channels.</p>
                     </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-bdr active fs-12" onClick={this.hideTermsConditions}>Ok</button>
                    </ModalFooter>
                </Modal>
                <div className="row">
               <div className="col-6 text-left" onClick={this.getTermsConditions}>
                   <label>Terms & Conditions   |   Privacy Policy</label>
               </div>
               <div className="col-6 text-right">
                   <label>Designed & Developed by : Easy Retail</label>
               </div>
            </div>
            </div>
          
        )
    }
}
