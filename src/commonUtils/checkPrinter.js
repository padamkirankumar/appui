const PrintBarcode = (type, object, name) => {
  console.log({ type });
  console.log(object);
  var devices = []
  let selected_device = null
  let devicename = ""

  // Barcode
  let count = 1;
  if (type === "BARCODE") {
    // let count =object.qty;
    let barcode = object.barcode;
    let barcodeName = object.name;
    let barcodePrice = object.itemMrp;
    let barcodeCategory = object.category;

    //Zpl Code for Barcode
    var barcodeZpl = `^XA`;
    barcodeZpl += `^CF0,30^FX Third section with bar code.^BY3,1,100^FO80,80^BC^FD${barcode}^FS^FO70,240^GB450,120,3^FS^FO300,240^GB3,120,3^FS`
    barcodeZpl += `^CF0,20^FO100,260^FDName: ${barcodeName}^FS`
    barcodeZpl += `^CF0,30^FO100,290^FDPrice: ${barcodePrice}^FS`
    barcodeZpl += `^CF0,20^FO100,325^FDCategory: ${barcodeCategory}^FS`
    barcodeZpl += `^CF0,50^FO380,260^FDOTSI^FS^XZ`
  }

  if (type === "REBARCODE") {
    // let count =object.qty;
    let barcode = object.barcode;
    let barcodeName = object.name;
    let barcodePrice = object.itemMrp;
    let barcodeCategory = object.category;

    //Zpl Code for Barcode
    var barcodeZpl = `^XA`;
    barcodeZpl += `^CF0,30^BY2,1,100^FO60,80^BC^FD${barcode}^FS^FO70,240^GB450,120,3^FS^FO300,240^GB3,120,3^FS`
    barcodeZpl += `^CF0,20^FO100,260^FDName: ${barcodeName}^FS`
    barcodeZpl += `^CF0,30^FO100,290^FDPrice: ${barcodePrice}^FS`
    barcodeZpl += `^CF0,20^FO100,325^FDCategory: ${barcodeCategory}^FS`
    barcodeZpl += `^CF0,50^FO380,260^FDOTSI^FS^XZ`
  }

  // Product Combo
  if (type === "PRODUCTCOMBO") {
    // alert(object.productTextiles.length)
    let listPrice = 0
    let itemNames = []
    let itemCategories = []
    object.productTextiles.forEach(data => {
      listPrice += data.itemMrp
      itemNames.push(data.name)
      itemCategories.push(data.category)
    })
    let barcode = object.barcode
    let productId = object.id
    let productDate = object.fromDate ? object.fromDate.toString().split(/T/)[0] : object.fromDate
    let productsName = itemNames
    let productsCategory = itemCategories
    let productsCost = listPrice
    let productsPrice = object.itemMrp

    // Zpl code for Product Combo
    var productComboZpl = `^XA`;
    productComboZpl += `^CF0,40^FO170,30^FDEasy Retail^FS`;
    productComboZpl += `^CF0,30^BY2,3,60^FO70,300^BC^FD${barcode}^FS`
    productComboZpl += `^FO70,80^GB350,50,3^FS`
    productComboZpl += `^FO280,80^GB3,50,3^FS`
    productComboZpl += `^CF0,20^FO100,95^FD ${productId}^FS`
    productComboZpl += `^CF0,20^FO285,95^FD ${productDate}^FS`
    if (object.productTextiles.length > 3) {
      productComboZpl += `^CF0,20^FO70,150^FDProductNames: ${productsName.slice(0, 3)} +${object.productTextiles.length - 3}^FS`
    } else {
      productComboZpl += `^CF0,20^FO70,150^FDProductNames: ${productsName}^FS`
    }
    if (object.productTextiles.length > 3) {
      productComboZpl += `^CF0,20^FO70,180^FDCategory: ${productsCategory.slice(0, 3)} +${object.productTextiles.length - 3}^FS`
    } else {
      productComboZpl += `^CF0,20^FO70,180^FDCategory: ${productsCategory}^FS`
    }
    productComboZpl += `^CF0,20^FO70,210^FDC.P: ${productsCost}^FS`
    productComboZpl += `^FO110,208^GD70,20,4^^FS`
    productComboZpl += `^FO110,208^GD70,20,4,B,L^FS`
    productComboZpl += `^CF0,30^FO70,240^FDMRP: ${productsPrice}^FS`
    productComboZpl += `^CF0,17^FO150, 270^FD( Incl.Tax )^FS`
    productComboZpl += `^CF0,60^FO500,190^FWr^FDOTSI^FS^FWN^XZ`

  }

  window.BrowserPrint.getDefaultDevice("printer", function (device) {

    //Add device to list of devices and to html select element
    selected_device = device;
    devices.push(device);
    // var html_select = document.getElementById("selected_device");
    // var option = document.createElement("option");
    devicename = device.name;
    // html_select.add(option);


    for (let i = 0; i < count; i++) {
      if (type === "BARCODE" || type === "REBARCODE") {
        selected_device.send(barcodeZpl, undefined, null);
      }
      if (type === "PRODUCTCOMBO") {
        selected_device.send(productComboZpl, undefined, null);
      }
    }

    //Discover any other devices available to the application
    window.BrowserPrint.getLocalDevices(function (device_list) {
      var printers_available = false;
      for (var i = 0; i < device_list.length; i++) {
        //Add device to list of devices and to html select element
        var device = device_list[i];
        if (!selected_device || device.uid != selected_device.uid) {
          devices.push(device);
          var option = document.createElement("option");
          option.text = device.name;
          option.value = device.uid;
          printers_available = true
          // html_select.add(option);
        }
      }


    }, function () { alert("Error getting local devices") }, "printer");

  }, function (error) {
    alert(error);
  })


};

export default PrintBarcode;
