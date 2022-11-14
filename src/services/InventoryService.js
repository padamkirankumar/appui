import axios from 'axios';
import { INVENTORY_URLS } from '../commonUtils/ApiConstants';
import { BASE_URL } from '../commonUtils/Base';


class InventoryService {

    updateInventoryList(list) {
        return axios.put(BASE_URL + INVENTORY_URLS.updateInventory, list);
    }

    getAllInventories(list) {
        return axios.post(BASE_URL + INVENTORY_URLS.getAllInventoriesList, list);
    }

    getUOMs() {
        return axios.get(BASE_URL + INVENTORY_URLS.getAllUOMs);
    }
    getProductBundleUpdate(update) {
        return axios.put(BASE_URL + INVENTORY_URLS.addProductBundleUpdate, update);
    }

    getAllDivisions(domainType) {
        const param = '?domainType=' + domainType;
        return axios.get(BASE_URL + INVENTORY_URLS.getAllDivisions + param);
    }

    getAllHsnList() {
        return axios.get(BASE_URL + INVENTORY_URLS.getAllHsnList);
    }
    getAllHsnData(selectedDomain, hsnCode) {
        let param = `?domainType=${selectedDomain}`
        return axios.get(BASE_URL + INVENTORY_URLS.getAllHsnData + param + "&hsnCode=" + hsnCode);
    }
    getAllSections(id, domainType) {
        const param1 = '?id=' + id + '&domainType=' + domainType;
        return axios.get(BASE_URL + INVENTORY_URLS.getAllSections + param1);
    }

    getAllCategories(domainType) {
        const param = '?domainType=' + domainType
        return axios.get(BASE_URL + INVENTORY_URLS.getAllCategories + param);
    }

    getStoreNamesByIds(list) {
        return axios.post(BASE_URL + INVENTORY_URLS.getStoreNamesByIds, list);
    }

    getEmpNamesByIds(list) {
        return axios.post(BASE_URL + INVENTORY_URLS.getEmpNameByEmpId, list);
    }



    addBarcode(list, domain, isEdit, value) {
        if (domain && domain.label === "Retail") {
            if (isEdit) {
                return axios.put(BASE_URL + INVENTORY_URLS.updateBarcodes, list);
            } else {
                return axios.post(BASE_URL + INVENTORY_URLS.addBarcodes, list);
            }
        } else {
            if (isEdit) {
                if (value === "REBAR") {
                    return axios.put(BASE_URL + INVENTORY_URLS.updatTextileBarcodes, list);
                } else {
                    return axios.put(BASE_URL + INVENTORY_URLS.updateBarcodesQuntity, list);
                }

            } else {
                return axios.post(BASE_URL + INVENTORY_URLS.addTextileBarcodes, list);
            }
        }
    }
    updateBarcodesQuntity() {
        return axios.put(BASE_URL + INVENTORY_URLS.updateBarcodesQuntity)
    }


    getBarcodeDetails(barcodeId, domain, storesId) {
        if (domain && domain.label === "Retail") {
            const param1 = '?barcodeId=' + barcodeId + '&storeId=' + storesId;
            return axios.get(BASE_URL + INVENTORY_URLS.getRetailBarcodeDetails + param1);
        } else {
            const param2 = '?barcode=' + barcodeId + '&storeId=' + storesId;
            return axios.get(BASE_URL + INVENTORY_URLS.getTextileBarcodeDetails + param2);
        }
    }

    deleteBarcode(barcode, domain, barcodeId, id) {
        if (domain && domain.label === "Retail") {
            const param1 = '?barcodeId=' + barcodeId;
            return axios.delete(BASE_URL + INVENTORY_URLS.deleteRetailBarcode + param1);
        } else {
            const param2 = '?id=' + barcode;
            console.log("barcode", barcode);
            return axios.delete(BASE_URL + INVENTORY_URLS.deleteTextileBarcode + param2);
        }
    }
    getHeadersData(domain) {
        const param1 = '?domainType=' + domain;
        return axios.get(BASE_URL + INVENTORY_URLS.getHeadersData + param1);
    }

    getAllBarcodes(list, domain, pageNumber = 0) {
        const param2 = '?page=' + pageNumber;
        // if (domain && domain.label === "Retail") {
        // return axios.post(BASE_URL+INVENTORY_URLS.getAllBarcodesList,list);
        // }else{

        // return axios.post(BASE_URL+INVENTORY_URLS.getAllBarcodesListTextile + param2 +'&size=10',list);
        return axios.post(BASE_URL + INVENTORY_URLS.getAllBarcodesListTextile + param2 + '&size=10', list);
        // return axios.post(BASE_URL+INVENTORY_URLS.getAllBarcodesListTextile,list);
        // }
    }

    getReBarcodeDetails(list, domain, pageNumber = 0) {
        const param2 = '?page=' + pageNumber;
        if (domain && domain.label === "Retail") {
            return axios.post(BASE_URL + INVENTORY_URLS.getAllBarcodesList, list);
        } else {
            return axios.post(BASE_URL + INVENTORY_URLS.getReBarcodeTextileBarcodeDetails + param2 + '&size=10', list);
        }
    }
    addProductDundle(obj) {
        return axios.post(BASE_URL + INVENTORY_URLS.addProductBundle, obj);
    }
    getProductBundle(toDate, fromDate, storeId) {
        const path = `?`
        return axios.post(BASE_URL + INVENTORY_URLS.getProductBundle);
    }
    getAllProductBundleList(fromdate, todate, storeId, pageNumber = 0) {
        const param2 = '&page=' + pageNumber;
        let param = '';
        if (storeId && !fromdate && !todate) {
            param = '?storeId=' + storeId;
        } else if (storeId && fromdate && !todate) {
            param = `?storeId=${storeId}&fromDate=${fromdate ? fromdate : null}`;
        } else {
            param = `?storeId=${storeId}&fromDate=${fromdate ? fromdate : null}&toDate=${todate ? todate : null}`;
        }
        return axios.post(BASE_URL + INVENTORY_URLS.getAllProductBundleList + param + param2 + '&size=10');
    }
    saveBulkData(uploadFile, storeId,domainType,categories) {
        const param2 = '?storeId=' + storeId +'&domainType=' + domainType;
      let token = JSON.parse(sessionStorage.getItem('token'));
        let formData = new FormData();
        formData.append('file', uploadFile)
        formData.append('categories', JSON.stringify(categories))
        //     addBulkTextile   BASE_URL+INVENTORY_URLS.addBulkTextile     "storeId":store
        //   let commonUrl = "http://10.80.1.39:9097/inventory/inventoryTextile/add-bulk-products"
        const uninterceptedAxiosInstance = axios.create();
        return uninterceptedAxiosInstance.post(BASE_URL + INVENTORY_URLS.addBulkTextile+param2,   formData,
            {
                headers: {
                    "Authorization": 'Bearer' + ' ' + token,

                },
            })

    }
    // saveCustomer(list) {
    //     return axios.post(BASE_URL+GENERATE_RETURN_SLIPS_URL.saveCustomer, list);
    // }
    // generateReturnSlip(list) {
    //     return axios.post(BASE_URL+GENERATE_RETURN_SLIPS_URL.generateReturnSlip, list);
    // }

    // getListOfReturnslips(list) {
    //     return axios.get(BASE_URL+GENERATE_RETURN_SLIPS_URL.getListOfReturnslips, list);
    // }

    getDownloadLink(domainType) {
        const param = '?domainType=' + domainType;
        return axios.get(BASE_URL + INVENTORY_URLS.getDownloadLink + param, { responseType: 'blob' });
    }
    getAllDropdown() {
        return axios.get(BASE_URL + INVENTORY_URLS.getAllDropdown);
    }
    getDomainAttributes(domain) {
        const param2 = '?domainType=' + domain;
        return axios.get(BASE_URL + INVENTORY_URLS.getDomainAttributes + param2);
    }
    getAllBarcodesList(list) {
        // const param2 = '&page=' + pageNumber;
        return axios.post(BASE_URL + INVENTORY_URLS.getAllBarcodesList, list);
    }
    listOfGoods(barcodeSearchId, fromDate, status, toDate, selectedStoreId, pageNumber = 0) {
        const param2 = '&page=' + pageNumber;
        let param = '';
        if (barcodeSearchId && selectedStoreId) {
            param = `?barcode=${barcodeSearchId ? barcodeSearchId : null}&storeId=${selectedStoreId}`;
        } else if (fromDate && status && toDate && selectedStoreId) {
            param = `?fromDate=${fromDate ? fromDate : null}&status=${status ? status : null}&toDate=${toDate ? toDate : null}&storeId=${selectedStoreId}`;
        } else if (fromDate && toDate && selectedStoreId) {
            param = `?fromDate=${fromDate ? fromDate : null}&toDate=${toDate ? toDate : null}&storeId=${selectedStoreId}`;
        }
        else if (status && selectedStoreId) {
            param = `?status=${status ? status : null}&storeId=${selectedStoreId}`;
        } else if (selectedStoreId) {
            param = `?storeId=${selectedStoreId}`;
        }

        return axios.post(BASE_URL + INVENTORY_URLS.listOfGoods + param + param2 + '&size=10');
    }

    saveTransfer(saveObj) {
        return axios.post(BASE_URL + INVENTORY_URLS.saveTransfer, saveObj);
    }
    orderShipment(barcodeSearchId, selectedStoreId, fromDate, toDate, pageNumber = 0) {
        const param2 = '&page=' + pageNumber;
        let param = '';
        if (barcodeSearchId && selectedStoreId) {
            param = `?barcode=${barcodeSearchId ? barcodeSearchId : null}&storeId=${selectedStoreId}`;
        } else if (fromDate && toDate && selectedStoreId) {
            param = `?fromDate=${fromDate ? fromDate : null}&toDate=${toDate ? toDate : null}&storeId=${selectedStoreId}`;
        }
        else if (selectedStoreId && !barcodeSearchId) {
            param = `?storeId=${selectedStoreId}`;
        }
        return axios.post(BASE_URL + INVENTORY_URLS.orderShipment + param + param2 + '&size=10');
    }
    updateOrderShipment(saveObj) {
        return axios.put(BASE_URL + INVENTORY_URLS.updateOrderShipment, saveObj);
    }

    goodsTransferCancel(saveObj) {
        return axios.put(BASE_URL + INVENTORY_URLS.goodsTransferCancel, saveObj)
    }

    exportDownload(fromDate, selectedStoreId, toDate) {
        const param = `?fromDate=${fromDate ? fromDate : null}&storeId=${selectedStoreId}&toDate=${toDate ? toDate : null}`
        return axios.get(BASE_URL + INVENTORY_URLS.exportDownload + param, { responseType: 'blob' });
    }

    orderExportDownload(fromDate, selectedStoreId, toDate) {
        const param = `?fromDate=${fromDate ? fromDate : null}&storeId=${selectedStoreId}&toDate=${toDate ? toDate : null}`
        return axios.get(BASE_URL + INVENTORY_URLS.orderExportDownload + param, { responseType: 'blob' });
    }

    editGoodsTransfer(saveObj) {
        return axios.put(BASE_URL + INVENTORY_URLS.saveTransfer, saveObj);
    }
    receiveOrder(barcode, selectedStoreId, fromDate, toDate, status, pageNumber = 0) {
        const param2 = '&page=' + pageNumber;
        let param = '';
        if (barcode && selectedStoreId) {
            param = `?barcode=${barcode ? barcode : null}&storeId=${selectedStoreId}`;
        } else if (fromDate && status && toDate && selectedStoreId) {
            param = `?fromDate=${fromDate ? fromDate : null}&status=${status ? status : null}&toDate=${toDate ? toDate : null}&storeId=${selectedStoreId}`;
        } else if (status && selectedStoreId) {
            param = `?status=${status ? status : null}&storeId=${selectedStoreId}`;
        } else if (fromDate && toDate && selectedStoreId) {
            param = `?fromDate=${fromDate ? fromDate : null}&toDate=${toDate ? toDate : null}&storeId=${selectedStoreId}`
        } else if (selectedStoreId) {
            param = `?storeId=${selectedStoreId}`
        }
        return axios.post(BASE_URL + INVENTORY_URLS.receiveOrder + param + param2 + '&size=10')
    }

    updateReceiveOrder(saveObj) {
        return axios.put(BASE_URL + INVENTORY_URLS.updateReceiveOrder, saveObj)
    }
    trackOrder(barcode,selectedStoreId,designCode) {
        let param = ''    
        if (barcode && selectedStoreId) {
            param = `?barcode=${barcode ? barcode : null}&storeId=${selectedStoreId}`;
        } else if (designCode && selectedStoreId) {
            param = `?designCode=${designCode ? designCode : null}&storeId=${selectedStoreId}`;
        } else {
            param = `?storeId=${selectedStoreId}`;
        }
        return axios.post(BASE_URL + INVENTORY_URLS.trackOrder + param)
    }
}

export default new InventoryService()