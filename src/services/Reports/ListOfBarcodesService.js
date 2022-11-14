import axios from "axios";
import{BARCODE_LIST_URL} from "../../commonUtils/ApiConstants";
import {BASE_URL} from "../../commonUtils/Base";


class ListOfBarcodesService{
    getBarcodes(data,pageNumber){
        const param2 ='?page='+ parseInt(pageNumber);
        // return axios.post(BASE_URL+BARCODE_LIST_URL.listOfBarcodes+ param2 +'&size=10',data);
        return axios.post(BASE_URL+BARCODE_LIST_URL.listOfBarcodes + param2 +'&size=10',data);

    }

updateBarcodes(barcodeTextileId){
    return axios.put(BASE_URL+BARCODE_LIST_URL.updateBarcode,barcodeTextileId);
}

getStoreNames(domainId){
    return axios.get(BASE_URL+BARCODE_LIST_URL.getStoresClientDomainId+ '?clientDomianId=' + domainId)
}


}

export default new ListOfBarcodesService()