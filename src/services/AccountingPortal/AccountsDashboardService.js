import axios from "axios";
import { ACCOUNTS_DASHBOARD } from "../../commonUtils/ApiConstants";
import { BASE_URL } from "../../commonUtils/Base";

class AccountsDashboardService {

    getDebitNotes() {
        return axios.get(BASE_URL + ACCOUNTS_DASHBOARD.debitNotesByStores);
    }

    getUsedBalanced() {
        return axios.get(BASE_URL + ACCOUNTS_DASHBOARD.usedBalancedAmounts);
    }

}

export default new AccountsDashboardService();