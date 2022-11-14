import axios from 'axios';
import { TICKETING_PORTAL } from '../commonUtils/ApiConstants';
import { BASE_URL } from '../commonUtils/Base';
class TicketingService {
    getAllTickets(status) {
        const param = '?status=' + status;
        return axios.get(BASE_URL + TICKETING_PORTAL.getTickets + param);
    }
    saveTicket(obj) {
        // const param = '?status=' + status;
        return axios.post(BASE_URL + TICKETING_PORTAL.saveTicket ,obj);
    }
    fileUpload(uploadFile) {

        // const param = '?status=' + status;
        // return axios.post(BASE_URL + TICKETING_PORTAL.fileUpload ,obj);
        // const param2 = '?storeId=' + storeId;
        let token = JSON.parse(sessionStorage.getItem('token'));
        let formData = new FormData();
        formData.append('file', uploadFile)
        //     addBulkTextile   BASE_URL+INVENTORY_URLS.addBulkTextile     "storeId":store
        //   let commonUrl = "http://10.80.1.39:9097/inventory/inventoryTextile/add-bulk-products"
        const uninterceptedAxiosInstance = axios.create();
        return uninterceptedAxiosInstance.post(BASE_URL + TICKETING_PORTAL.fileUpload , formData,{
                headers: { 'content-type': 'multipart/form-data'}
        }
           )

    }
    updateStatus(obj) {
        //  const param ='?id=' + id + '&status=' + status;
        return axios.put(BASE_URL + TICKETING_PORTAL.updateStatus ,obj);
    }

    searchTicket(obj){
        return axios.post(BASE_URL + TICKETING_PORTAL.searchTicket ,obj);
    }
    ticketCount(){
        return axios.get(BASE_URL + TICKETING_PORTAL.ticketCount);
    }

}
export default new TicketingService()
