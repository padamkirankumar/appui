import axios from 'axios';
import { NEWSALE_REPORT_URL } from "../../commonUtils/ApiConstants";

import { BASE_URL } from '../../commonUtils/Base';

class ListOfSaleBillsService {
    getSaleBills(data, pageNumber = 0) {
        const param2 = '?page=' + pageNumber;
        return axios.post(BASE_URL + NEWSALE_REPORT_URL.listOfSaleBills + param2 + '&size=10', data);

    }
}
export default new ListOfSaleBillsService()