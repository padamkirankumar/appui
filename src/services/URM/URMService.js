import axios from 'axios';
import { USER_MANAGEMENT_URL } from '../../commonUtils/ApiConstants';
import { BASE_URL } from '../../commonUtils/Base';


class URMService {

    getDomainsList(clientId) {
        const param = '/' + clientId;
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getDomains + param);
    }

    getMasterDomainsList() {
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getMasterDomains);
    }

    saveDomains(saveObj) {
        return axios.post(BASE_URL + USER_MANAGEMENT_URL.saveDomain, saveObj);
    }

    saveStore(saveObj) {
        return axios.post(BASE_URL + USER_MANAGEMENT_URL.saveStore, saveObj);
    }

    editStore(saveObj) {
        return axios.put(BASE_URL + USER_MANAGEMENT_URL.editStore, saveObj);
    }
    deleteStore(id) {
        const param = '?id=' + id;
        return axios.delete(BASE_URL + USER_MANAGEMENT_URL.deleteStore + param);
    }





    getAllPrivileges() {
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getAllPrivileges);
    }

    getAllStores(clientId) {
        const param = '?clientId=' + clientId + '&isActive=false';
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getAllStores + param);
    }

    getAllRoles(clientId) {
        const param = '/' + clientId;
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getAllRoles + param);
    }

    getStoresByDomainId(clientId) {
        const param = '?clientId=' + clientId + '&isActive=true';
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getAllStores + param);
    }

    getRolesByDomainId(clientId) {
        const param = '/' + clientId;
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getAllRoles + param);
    }

    saveUser(saveObj) {
        return axios.post(BASE_URL + USER_MANAGEMENT_URL.saveUser, saveObj);
    }

    editUser(saveObj) {
        return axios.put(BASE_URL + USER_MANAGEMENT_URL.editUser, saveObj);
    }
    deleteUser(id) {
        const param = '?id=' + id;
        return axios.delete(BASE_URL + USER_MANAGEMENT_URL.deleteUser + param);
    }

    saveRole(saveObj) {
        return axios.post(BASE_URL + USER_MANAGEMENT_URL.saveRole, saveObj);
    }

    editRole(saveObj) {
        return axios.put(BASE_URL + USER_MANAGEMENT_URL.editRole, saveObj);
    }

    getStates() {
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getStates);
    }

    getDistricts(stateId) {
        const param = '?stateCode=' + stateId;
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getDistricts + param);
    }

    getGSTDetails(stateId, clientId) {
        const param = '?clientId=' + clientId + '&stateCode=' + stateId;
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getGSTNumber + param);
    }

    // getUsers(clientId) {
    //     const param = '/'+ clientId; 
    //     return axios.get(BASE_URL+USER_MANAGEMENT_URL.getAllUsers+param);
    // }

    getUsers(clientId, pageNumber = 0) {
        const param = '/' + clientId;
        const param2 = '?page=' + pageNumber;
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getAllUsers + param + param2 + '&size=10');
    }

    getSelectedPrivileges(domainName) {
        const param = '/' + domainName;
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getPrivilegesByName + param);
    }

    getSubPrivileges(parentId) {
        const param = '/' + parentId;
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getSubPrivilege + param);
    }

    getSubPrivilegesbyRoleId(roleId) {
        const param = '/' + roleId;
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getPrivilegesByName + param);
    }

    getDomainName(clientDomainId) {
        const param = '/' + clientDomainId;
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getDomainName + param);
    }

    getAllPrivileges(domainId) {
        // const param = '/'+ domainId; 
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getPrivileges);
    }

    getStoresBySearch(searchStore) {

        return axios.post(BASE_URL + USER_MANAGEMENT_URL.getStoresBySearch, searchStore);
    }

    getRolesBySearch(searchRole) {

        return axios.post(BASE_URL + USER_MANAGEMENT_URL.getRolesBySearch, searchRole);
    }

    // getUserBySearch(searchUser) {
    //     return axios.post(BASE_URL+USER_MANAGEMENT_URL.getUserBySearch, searchUser);

    // }

    getUserBySearch(searchUser, pageNumber = 0) {
        const param2 = '?page=' + pageNumber;
        return axios.post(BASE_URL + USER_MANAGEMENT_URL.getUserBySearch + param2 + '&size=10', searchUser);

    }

    getusersByRole(clientId) {
        const param = '?clientId=' + clientId;
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getusersByRole + param);

    }

    getActiveUsers(clientId) {
        const param = '?clientId=' + clientId;
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getActiveUsers + param);
    }

    getStoresVsEmployees(clientId) {
        const param = '?clientId=' + clientId;
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getStoresVsEmployee + param);
    }
    getAllClients(pageNumber) {
        const param2 = '?page=' + pageNumber;
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getAllClients + param2 + '&size=10');
    }
    getClientSupporters(role, pageNumber = 0, obj) {
        const param = '?roleName=' + role;
        const param2 = '&page=' + pageNumber;
        return axios.post(BASE_URL + USER_MANAGEMENT_URL.getClientSupporters + param + param2 + '&size=10', obj);
    }
    addClient(obj) {
        return axios.post(BASE_URL + USER_MANAGEMENT_URL.addClient, obj)
    }
    getClientMappingDetails(pageNumber = 0) {
        const param2 = '?page=' + pageNumber;
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getClientMappingDetails + param2 + '&size=10');
    }
    getAllStoreList() {
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getAllStoreList);
    }
    getClientSearch(data) {
        return axios.post(BASE_URL + USER_MANAGEMENT_URL.getClientSearch, data);
    }
    searchSupporters(role, pageNumber = 0, obj) {
        const param = '?roleName=' + role;
        const param2 = '&page=' + pageNumber;
        return axios.post(BASE_URL + USER_MANAGEMENT_URL.searchSupporters + param + param2 + '&size=10', obj);
    }
    // searchClientMapping(data) {
    //     return axios.post(BASE_URL + USER_MANAGEMENT_URL.searchClientMapping, data);
    // }

    searchClientMapping(data, pageNumber = 0) {
        const param = '?page=' + pageNumber;
        return axios.post(BASE_URL + USER_MANAGEMENT_URL.searchClientMapping + param + '&size=100', data);
    }
    getClientSupportersData(role, pageNumber = 0, obj) {
        const param = '?roleName=' + role;
        const param2 = '&page=' + pageNumber;
        return axios.post(BASE_URL + USER_MANAGEMENT_URL.getClientSupporters + param + param2 + '&size=500', obj);
    }
    editClient(saveObj) {
        return axios.post(BASE_URL + USER_MANAGEMENT_URL.editClient, saveObj);
    }
    editClientMapping(obj) {
        return axios.post(BASE_URL + USER_MANAGEMENT_URL.editClientMapping, obj);
    }
    clientOrder(reqObj) {
        const URL = process.env.REACT_APP_BASE_URL + '/paymentgateway/paymentgateway/create_client_order';
        return axios.post(URL, reqObj, {

        });
    }
    getUsersForClient(clientId) {
        const param = '?clientId=' + clientId;
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getUsersForClient + param); 
    }
    getClientsForUser(userId) {
        const param = '?userId=' + userId;
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getClientsForUser + param); 
    }
    deleteMapping(obj) {
        return axios.post(BASE_URL + USER_MANAGEMENT_URL.deleteMapping, obj);
    }
    getClientStores(clientId){
        const param = '?clientId=' + clientId + '&isActive=false';
        return axios.get(BASE_URL + USER_MANAGEMENT_URL.getClientStores+ param);
    }
    updatePlan(obj){
        return axios.post(BASE_URL + USER_MANAGEMENT_URL.updatePlan , obj);
    }

}
export default new URMService()