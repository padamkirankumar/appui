import axios from 'axios';
import { CREATE_CUSTOMER_URL, NEW_SALE_URL, TAG_CUSTOMER_URL } from '../commonUtils/ApiConstants';
import { BASE_URL } from '../commonUtils/Base';

class CreateCustomerService {
    createCustomer(list) {
        return axios.post(BASE_URL+CREATE_CUSTOMER_URL.createCustomer, list);
    }
    posClose(val){
         const param = '?posclose='+ val; 
        return axios.get(BASE_URL+CREATE_CUSTOMER_URL.posClose+param);
    }

// TAG CUSTOMER TO GV
getMobileData(mobileNumber) {
    const param = '?mobileNumber='+ mobileNumber;
    return axios.get(BASE_URL+NEW_SALE_URL.getMobileData+param);
}
getGiftData(gvNumber){
    const param = '?gvNumber='+ gvNumber;
    return axios.get(BASE_URL+TAG_CUSTOMER_URL.getGiftData+param);
}
createTag(custId,gvId){
    return axios.post(BASE_URL+TAG_CUSTOMER_URL.tagCustomer+'/'+custId+'/'+gvId);
}
}

export default new CreateCustomerService()
