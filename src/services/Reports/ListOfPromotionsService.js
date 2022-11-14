import axios from "axios";
import { BASE_URL } from "../../commonUtils/Base";
import { PROMOTIONS_LIST_URL } from "../../commonUtils/ApiConstants";

class ListOfPromotionsService {
    getPromotions(data, pageNumber = 0) {
        const param2 = '?page=' + pageNumber;
        return axios.post(BASE_URL + PROMOTIONS_LIST_URL.promotionsList + param2 + '&size=10', data);
    }

    getStoreNames(domainId) {
        return axios.get(BASE_URL + PROMOTIONS_LIST_URL.getStoresClientDomainId + '?clientDomianId=' + domainId)
    }


}



export default new ListOfPromotionsService()