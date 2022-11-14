import axios from "axios";
import { TAXREPORT_LIST_URL } from "../../commonUtils/ApiConstants";
import { BASE_URL } from "../../commonUtils/Base";

class ListOfTaxreportService {
    taxreportList(fromDate, storeId, toDate, pageNumber = 0) {
        let param = '';
        if (fromDate && storeId && !toDate) {
            param = `?fromDate=${fromDate ? fromDate : null}&storeId=${storeId}`;
        } else if (fromDate && storeId && toDate) {
            param = `?fromDate=${fromDate ? fromDate : null}&storeId=${storeId}&toDate=${toDate ? toDate : null}`;
        }
        return axios.post(BASE_URL + TAXREPORT_LIST_URL.taxreportList + param + '&page=' + pageNumber + '&size=20')
    }
}

export default new ListOfTaxreportService()