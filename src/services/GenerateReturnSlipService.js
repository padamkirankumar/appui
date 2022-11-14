import axios from 'axios';
import { GENERATE_RETURN_SLIPS_URL } from '../commonUtils/ApiConstants';
import { BASE_URL } from '../commonUtils/Base';


class GenerateReturnSlipService {

    getReturnSlipsByFilter(list){
        return axios.post(BASE_URL+GENERATE_RETURN_SLIPS_URL.getInvoiceDetails,list);
    }

    getMobileData(mobileNumber) {
        return axios.get(BASE_URL+GENERATE_RETURN_SLIPS_URL.getMobileData+'/'+mobileNumber);
    }

    saveCustomer(list) {
        return axios.post(BASE_URL+GENERATE_RETURN_SLIPS_URL.saveCustomer, list);
    }
    generateReturnSlip(list) {
        return axios.post(BASE_URL+GENERATE_RETURN_SLIPS_URL.generateReturnSlip, list);
    }

    getListOfReturnslips(list) {
        return axios.get(BASE_URL+GENERATE_RETURN_SLIPS_URL.getListOfReturnslips, list);
    }

}

export default new GenerateReturnSlipService()