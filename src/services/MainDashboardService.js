import axios from "axios";
import { MAIN_DASHBOARD } from "../commonUtils/ApiConstants";
import { BASE_URL } from "../commonUtils/Base";

class MainDashboardService {
    getTodaySale(storeId) {
        const param = '?storeId=' + storeId;
        return axios.get(BASE_URL + MAIN_DASHBOARD.getTodaysSale + param);
    }

    getMonthlySale(storeId) {
        const param = '?storeId=' + storeId;
        return axios.get(BASE_URL + MAIN_DASHBOARD.getMonthlySale + param);
    }

    getLastVsThisMonthSale(storeId) {
        const param = '?storeId=' + storeId;
        return axios.get(BASE_URL + MAIN_DASHBOARD.getLastVsThisMonthSale + param);
    }

    getTopFiveSalesRepresentatives(tenure, storeId) {
        const param = `?name=${tenure}`+'&storeId=' + storeId;
        return axios.get(BASE_URL + MAIN_DASHBOARD.getTopFiveSalesRepresentative + param);
    }

    getSalesByCategory(tenure, storeId) {
        const param = `?name=${tenure}`+'&storeId=' + storeId;
        return axios.get(BASE_URL + MAIN_DASHBOARD.getSalesByCategory + param);
    }

    getTopfiveSalesByStore() {
        return axios.get(BASE_URL + MAIN_DASHBOARD.getTopfiveSalesByStore);
    }

}

export default new MainDashboardService();