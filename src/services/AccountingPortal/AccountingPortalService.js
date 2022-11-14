import axios from 'axios';
import { ACCOUNTING_PORTAL } from '../../commonUtils/ApiConstants';
import { BASE_URL } from '../../commonUtils/Base';

class AccountingPortalService {

    saveCredit(saveCredit) {
        return axios.post(BASE_URL + ACCOUNTING_PORTAL.saveCredit, saveCredit);
    }

    saveDebit(saveCredit) {
        return axios.post(BASE_URL + ACCOUNTING_PORTAL.saveDebit, saveCredit);
    }

    // getCreditNotes(obj) {
    //     return axios.post(BASE_URL+ACCOUNTING_PORTAL.getCreditNotes, obj);
    // }
    getCreditNotes(obj, pageNumber = 0) {
        const param2 = '?page=' + pageNumber;
        return axios.post(BASE_URL + ACCOUNTING_PORTAL.getCreditNotes + param2 + '&size=10', obj);
    }
    getAllLedgerLogs(obj) {
        return axios.post(BASE_URL + ACCOUNTING_PORTAL.getAllLedgerLogs, obj);
    }
    // getDebitNotes(obj) {
    //     return axios.post(BASE_URL + ACCOUNTING_PORTAL.getCreditNotes, obj);
    // }
    getDebitNotes(obj, pageNumber = 0) {
        const param2 = '?page=' + pageNumber;
        return axios.post(BASE_URL + ACCOUNTING_PORTAL.getCreditNotes + param2 + '&size=10', obj);
    }
    saveMasterTax(saveTax) {
        return axios.post(BASE_URL + ACCOUNTING_PORTAL.saveMasterTax, saveTax);
    }
    updateMasterTax(obj) {
        return axios.put(BASE_URL + ACCOUNTING_PORTAL.updatetax, obj);
    }
    deleteTaxMaster(selectedTaxMasterId) {
        const id = `?id=${selectedTaxMasterId}`;
        return axios.delete(BASE_URL + ACCOUNTING_PORTAL.deleteTax + id);
    }
    updateHsn(domainType, obj) {
        let param = `?domainType=${domainType}`;
        return axios.put(BASE_URL + ACCOUNTING_PORTAL.updateHsn + param, obj);
    }
    deleteHsn(selectedHsnId) {
        const id = `?id=${selectedHsnId}`;
        return axios.delete(BASE_URL + ACCOUNTING_PORTAL.deleteHsn + id);
    }
    getAllMasterTax() {
        return axios.get(BASE_URL + ACCOUNTING_PORTAL.getAllTaxes);
    }
    getDescrition() {
        return axios.get(BASE_URL + ACCOUNTING_PORTAL.getDescritionData);
    }
    getTaxAppliesOn() {
        return axios.get(BASE_URL + ACCOUNTING_PORTAL.getTaxAppliesOnData);
    }
    getAllHsnCodes() {
        return axios.get(BASE_URL + ACCOUNTING_PORTAL.getAllHsnCodesData);
    }
    saveHsnCode(domainType, saveHsnObj) {
        let param = `?domainType=${domainType}`;
        return axios.post(BASE_URL + ACCOUNTING_PORTAL.saveHsnCode + param, saveHsnObj);
    }
    creditdebitOrder(reqObj) {
        const URL = process.env.REACT_APP_BASE_URL + '/paymentgateway/paymentgateway/create_creditdebit_order';
        return axios.post(URL, reqObj);
    }
}
export default new AccountingPortalService()
