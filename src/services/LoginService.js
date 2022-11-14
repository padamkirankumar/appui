import axios from 'axios';
import { LOGIN_URL, USER_MANAGEMENT_URL} from '../commonUtils/ApiConstants';
import { BASE_URL } from '../commonUtils/Base';

class LoginService {
    getStores() {
        return axios.get(BASE_URL + LOGIN_URL.getStores);
    }
    getAuth(obj) {
        return axios.post(BASE_URL + LOGIN_URL.getToken, obj);
        // const headers = {
        //     'Content-Type':'application/json',
        //     'keepalive-time':330000
        // }
        // return axios.post(BASE_URL+LOGIN_URL.getToken,obj,{headers: headers});
    }
    saveData() {
        return axios.post(BASE_URL + LOGIN_URL.saveData, null);
    }

    registerUser(obj) {
        return axios.post(BASE_URL + LOGIN_URL.registerUser, obj);
    }

    changePassword(obj) {
        return axios.post(BASE_URL + LOGIN_URL.changePassword, obj);
    }

    getConfirmationCode(userName) {
        const param = '?userName=' + userName;
        return axios.get(BASE_URL + LOGIN_URL.sendVerificationCode + param);
    }

    changeForgotPassword(userName, confirmationCode, newForgotPassword) {
        const param = '?username=' + userName + '&confirmarionCode=' + confirmationCode + '&newPassword=' + newForgotPassword;
        return axios.post(BASE_URL + LOGIN_URL.forgotPassword + param, {});
    }
    getUsersByRollName(userId) {
        const param = '?userId=' + userId;
        return axios.get(BASE_URL + LOGIN_URL.getUsersByRollName + param);
    }
    getPlanDetails() {
        return axios.get(BASE_URL + LOGIN_URL.getPlanDetails);
    }
    getPlanDetailsByTenure(PlanName,Tenure){
        const param = '?PlanName=' + PlanName + '&Tenure=' + Tenure;
        return axios.get(BASE_URL + LOGIN_URL.getPlanDetailsByTenure + param);
  
    }
    getStoresByuserId(userId){
        const param = '?userId=' + userId+ '&isActive=true';
        return axios.get(BASE_URL + LOGIN_URL.getStoresByuserId + param);
    }
    getAllPlans(){
        return axios.get(BASE_URL + LOGIN_URL.getAllPlans);
    }
    checkPlanExpairy(clientId) {
        let param = `?clientId=${clientId}`
        return axios.post(BASE_URL + USER_MANAGEMENT_URL.checkPlanExpairy + param);        
    }

}
export default new LoginService()