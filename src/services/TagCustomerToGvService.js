import axios from 'axios';
import { TAG_CUSTOMER_TO_GV_URL } from '../commonUtils/ApiConstants';
import { BASE_URL } from '../commonUtils/Base';



class TagCustomerToGvService {



    getMobileData(mobileNumber) {
        return axios.get(BASE_URL + TAG_CUSTOMER_TO_GV_URL.getMobileData + '?mobileNumber=' + mobileNumber);
    }

    getGvNumberData(gvNumber) {
        return axios.get(BASE_URL + TAG_CUSTOMER_TO_GV_URL.getGvNumberData + '?gvNumber=' + gvNumber);
    }


    createTagCustomerToGv(customerId, gvId) {


        return axios.post(BASE_URL + TAG_CUSTOMER_TO_GV_URL.createTagCustomerToGv + '/' + customerId + '/' + gvId);
    }

}


export default new TagCustomerToGvService()

