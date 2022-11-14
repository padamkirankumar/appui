import axios from 'axios';
import { PROMO_ITEM_EXCHANGE_URL } from '../commonUtils/ApiConstants';
import { BASE_URL } from '../commonUtils/Base';

class PromoItemExchangeService { 
    
    getRTSlips(){ 
        return axios.get(BASE_URL+PROMO_ITEM_EXCHANGE_URL.getRTSlips);
    }
    getMobileData(mobileNumber) {
        const param = '?mobileNumber='+ mobileNumber;
        return axios.get(BASE_URL+PROMO_ITEM_EXCHANGE_URL.getMobileData+param);
    }

    getDSNumber(dsNumber) {
        const param = '?dsNumber='+ dsNumber;
        return axios.get(BASE_URL+PROMO_ITEM_EXCHANGE_URL.getDsNumber+param);
    }

    savePromoItemExchange(obj) {
        return axios.post(BASE_URL+PROMO_ITEM_EXCHANGE_URL.savePromo, obj);
    }

}
export default new PromoItemExchangeService()