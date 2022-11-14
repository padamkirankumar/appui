import axios from 'axios';
import { CREATE_DELIVERY_SLIP_URL } from '../commonUtils/ApiConstants';
import { BASE_URL } from '../commonUtils/Base';

class CreateDeliveryService {

    getBarCodeList(barCode, smNumber,storeId) {
        const param = '?barcode=' + barCode+'&storeId='+storeId;
        return axios.get(BASE_URL + CREATE_DELIVERY_SLIP_URL.getDeliverySlip + param);
    }

    createDeliverySlip(list, type) {
        const param = '?enumName=' + type;
        return axios.post(BASE_URL + CREATE_DELIVERY_SLIP_URL.createDeliverySlip + param, list);
    }

    getLineItem(lineItem, domainId) {
        const param = '/' + domainId;
        return axios.post(BASE_URL + CREATE_DELIVERY_SLIP_URL.getLineItems + param, lineItem);
    }

    saveDelivery(createObj) {
        return axios.post(BASE_URL + CREATE_DELIVERY_SLIP_URL.saveDelivery, createObj);
    }

    getRetailBarcodeList(barCode, storeId) {
        const param = '?barcodeId=' + barCode + '&storeId='+ storeId;
        return axios.get(BASE_URL + CREATE_DELIVERY_SLIP_URL.getRetailBarcode + param);
    }

    addCustomer(addCustomerobj) {
        return axios.post(BASE_URL + CREATE_DELIVERY_SLIP_URL.addCustomer, addCustomerobj);
    }


    getMobileData(mobileNumber) {
        return axios.get(BASE_URL + CREATE_DELIVERY_SLIP_URL.getMobileData + '?mobileNumber=' + mobileNumber);
    }

    getGvNumberData(gvNumber) {
        return axios.get(BASE_URL + CREATE_DELIVERY_SLIP_URL.getGvNumberData + '?gvNumber=' + gvNumber);
    }


    createTagCustomerToGv(customerId, gvId) {
        return axios.post(BASE_URL + CREATE_DELIVERY_SLIP_URL.createTagCustomerToGv + '/' + customerId + '/' + gvId);
    }

    getReturnSlipDetails(obj) {
        return axios.post(BASE_URL + CREATE_DELIVERY_SLIP_URL.getReturnSlips, obj);
    }

    saveGenerateReturnSlip(saveobj) {
        return axios.post(BASE_URL + CREATE_DELIVERY_SLIP_URL.saveReturnSlip, saveobj);
    }

    getUserByMobile(mobileNumber) {
        const param = '/' + mobileNumber;
        return axios.get(BASE_URL + CREATE_DELIVERY_SLIP_URL.getCustomerMobile + param);
    }

    getGiftVochersList() {
        return axios.get(BASE_URL + CREATE_DELIVERY_SLIP_URL.getGiftVochers);
    }

    saveGiftVoucher(saveobj) {
        return axios.post(BASE_URL + CREATE_DELIVERY_SLIP_URL.saveGiftVoucher, saveobj);
    }
   // searchGiftVoucher(params){
    //    console.log(">>>params",params)
    //     return axios.get(BASE_URL+ CREATE_DELIVERY_SLIP_URL.searchGiftVoucher+"?"+params)

    // }

    searchGiftVoucher(obj){
        console.log(">>>data",obj)
         return axios.post(BASE_URL+ CREATE_DELIVERY_SLIP_URL.searchGiftVoucher,obj)
 
     }
    saveGVNumber(gvObj, status) {
        const param = '?flag=' + status;
        return axios.put(BASE_URL + CREATE_DELIVERY_SLIP_URL.changeGvFlag + param, gvObj);
    }
    getAllDayClosr(storeId ) {
        const param = '?storeId=' + storeId ;
        return axios.get(BASE_URL + CREATE_DELIVERY_SLIP_URL.getDayCloserSlips+param);
    }
    closeDayCloser(storeId) {
        const param = '?storeId=' + storeId ;
        return axios.put(BASE_URL + CREATE_DELIVERY_SLIP_URL.dayCloserPendingDeliverySlips+param);
    }
    getdayclosure(storeId,obj) {
        const param = '?storeId=' + storeId ;
        return axios.get(BASE_URL + CREATE_DELIVERY_SLIP_URL.getdayclosure+param ,obj);
    }
    saveDayCloser(obj) {
        //const param = '?storeId=' + storeId ;
        return axios.post(BASE_URL + CREATE_DELIVERY_SLIP_URL.saveDayCloser,obj);
    }
    getDates(storeId){
        const param = '?storeId=' + storeId ;
        return axios.get(BASE_URL + CREATE_DELIVERY_SLIP_URL.getDates+param);
    }
    deleteEstimationSlip(dsNumber) {
        const param2 = '?dsNumber=' + dsNumber;
        return axios.delete(BASE_URL + CREATE_DELIVERY_SLIP_URL.deleteDsNumber + param2);

    }
    getPendingDeliverySlips(fromDate,storeId ) {
        const param = '?fromDate='+ fromDate +'&storeId=' + storeId ;
        return axios.get(BASE_URL + CREATE_DELIVERY_SLIP_URL.getPendingDeliverySlips+param);
    }
    closePendingDeliverySlips(fromDate,storeId ) {
        const param = '?fromDate='+ fromDate +'&storeId=' + storeId ;
        return axios.put(BASE_URL + CREATE_DELIVERY_SLIP_URL.closePendingDeliverySlips+param);
    }


}

export default new CreateDeliveryService()