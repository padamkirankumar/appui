import axios from 'axios';
import { DELIVERYSLIPS_LIST_URL } from '../../commonUtils/ApiConstants';
import { BASE_URL } from '../../commonUtils/Base';

class ListOfDeliverySlipsService {
    
    getDeliverySlips(data,storeId) {
     //   const param = '?storeId='+ storeId; 
        return axios.post(BASE_URL+ DELIVERYSLIPS_LIST_URL.deliveryslipsList,data);
    }


    getStoreNames(domainId){
        return axios.get(BASE_URL+DELIVERYSLIPS_LIST_URL.getStoresClientDomainId+ '?clientDomianId=' + domainId)
    }

}

export default new ListOfDeliverySlipsService()
