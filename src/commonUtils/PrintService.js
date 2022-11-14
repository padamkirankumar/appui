import moment from "moment";
import { toast } from "react-toastify";
import eventBus from "./eventBus";


const PrinterStatusBill = (type, barcode, object, invoiceTax) => {
  console.log('object', object);
  // 192.168.1.13  HOME
  // 10.80.2.50 OFC
  const printerIPAddress = JSON.parse(sessionStorage.getItem('printerIp'));
  const printerPort = JSON.parse(sessionStorage.getItem('printerPort'));
  //   const [textToPrint, setTextToPrint] = useState("");
  let connectionStatus = '';
  let ePosDevice;
  let printer = {};

  const STATUS_CONNECTED = "Connected";


  connectionStatus = "Connecting ...";

  if (!printerIPAddress) {
    connectionStatus = "Type the printer IP address";
    return;
  }
  if (!printerPort) {
    connectionStatus = "Type the printer port";
    return;
  }

  connectionStatus = "Connecting ...";
  // ePosDevice = new epson.ePOSDevice();
  let ePosDev = new window.epson.ePOSDevice();
  ePosDevice = ePosDev;

  ePosDev.connect(printerIPAddress, printerPort, (data) => callBack_connect(data));
  function callBack_connect (data) {
    if (data === "OK") {
      sessionStorage.setItem('print_config', data);
      eventBus.dispatch("printerStatus", { message: data });
      ePosDev.createDevice(
        "local_printer",
        ePosDev.DEVICE_TYPE_PRINTER,
        { crypto: true, buffer: false },
        (devobj, retcode) => {
          if (retcode === "OK") {
            printer = devobj;
            connectionStatus = STATUS_CONNECTED;
            let prn = devobj;


            // var receiptString =
            // "======================\n" +
            // "|       Invoice      |\n" +
            // "======================\n" +
            // "Item             Price\n" +
            // "----------------------\n" +
            // "shirts           10.40\n" +
            // "T-shirts         20.60\n" +
            // "paste            10.00\n" +
            // "Idlyrava         15.00\n" +
            // "pants            10.00\n" +
            // "bendi            25.00\n" +
            // "brinja           10.00\n" +
            // "tamatoo          45.00\n" +
            // "shorts           50.00\n" +
            // "shoes            70.00\n" +
            // "sandle           30.00\n" +
            // "fliplops         55.00\n" +
            // "----------------------\n" +
            // "Total-----------220.00\n";
            // prn.addText(receiptString);
            // prn.addFeedLine(5);
            // prn.addCut(prn.CUT_FEED);

            // prn.send();

            // *************************PRINT BILL*****************************
            if (type === "start") {
              prn.addTextPosition(205);
              prn.addTextVPosition(205);
              prn.addText('Printer Connected\n');
            }
            else if (type === "DSNUM") {
              let dsNum = barcode;
              // prn.addTextPosition(212);
              // prn.addTextVPosition(486);
              // prn.addText('EASY RETAIL\n');
              // prn.addTextPosition(240);
              // prn.addText('ESTIMATION SLIP\n');
              // prn.addText(' =============================================\n');
              // prn.addTextPosition(3);
              // prn.addBarcode('eh4545212121r', prn.BARCODE_CODE39, prn.HRI_BELOW, prn.FONT_B, 2, 90);
              // prn.addText(' =============================================\n');
              prn.addTextDouble(true, true);
              prn.addTextPosition(150);
              prn.addTextVPosition(70);
              prn.addTextFont(printer.FONT_SPECIAL_A);
              prn.addText('EASY REATIL\n');
              prn.addTextLineSpace(40);
              prn.addTextPosition(100);
              prn.addTextVPosition(548);
              prn.addText('ESTIMATION SLIP\n');
              prn.addTextDouble(false, false);
              prn.addTextFont(printer.FONT_B);
              prn.addText('Date        :     ' + moment(new Date()).format("DD-MM-YYYY HH:mm:ss").toString() + '\n');
              // prn.addTextFont(printer.FONT_C);
              // prn.addText(' *************************************************************\n');
              prn.addTextFont(printer.FONT_C);
              prn.addText(' ______________________________________________________________\n');
              prn.addText(' S.NO   BARCODE           QTY    MRP      DISC        AMOUNT   \n');
              prn.addTextFont(printer.FONT_C);
              prn.addText(' ______________________________________________________________\n');
              let j = 1;
              for (let i = 0; i < object.length; i++) {
                prn.addTextPosition(0);
                prn.addText(' ' + j + '. ');
                prn.addTextPosition(70);
                prn.addText(object[ i ].barcode);
                prn.addTextPosition(232);
                prn.addText(object[ i ].quantity);
                prn.addTextPosition(298);
                prn.addText(object[ i ].itemMrp);
                prn.addTextPosition(379);
                prn.addText(object[ i ].itemDiscount);
                prn.addTextPosition(488);
                prn.addTextAlign(printer.ALIGN_RIGHT);
                prn.addText(object[ i ].totalMrp + '\n');
                j++;
              }

              prn.addText(' _________________________________________________________________\n');
              let grandTotal = 0;
              let totalqty = 0;
              let promoDiscount = 0;
              object.forEach(bardata => {
                grandTotal = grandTotal + bardata.totalMrp;
                promoDiscount = promoDiscount + bardata?.itemDiscount;
                totalqty = totalqty + parseInt(bardata.quantity);
              });
              let netpayable = grandTotal - promoDiscount;


              prn.addText(' Gross Amount                                        ' + grandTotal + '\n');
              prn.addText(' Total Discount                                      ' + promoDiscount + '\n');
              prn.addTextFont(printer.FONT_C);
              prn.addText(' ______________________________________________________________\n');
              prn.addTextPosition(120);
              prn.addTextSize(2, 2);
              prn.addText(' Total Qty    :  ' + totalqty + '\n');
              prn.addTextPosition(100);
              prn.addText(' Net Payable  :  ' + netpayable + '\n');
              // prn.addText(' =============================================\n');
              prn.addTextVPosition(246);
              prn.addTextSize(2, 1);
              prn.addTextPosition(30);
              prn.addBarcode(dsNum, prn.BARCODE_CODE39, prn.HRI_BELOW, prn.FONT_A, 2, 83);
              // prn.addText(' =============================================\n');
              prn.addTextPosition(211);
              prn.addTextVPosition(208);
              prn.addTextDouble(false, false);
              prn.addText('THANK YOU\n');
            } else if (type === 'INVOICE') {
              let inNum = barcode;
              prn.addTextDouble(true, true);
              prn.addTextPosition(150);
              prn.addTextVPosition(70);
              prn.addTextFont(printer.FONT_SPECIAL_A);
              prn.addText('EASY REATIL\n');
              prn.addTextLineSpace(40);
              prn.addTextPosition(60);
              prn.addTextVPosition(495);
              prn.addText('OTSI - Hi-tech city\n');
              prn.addTextDouble(false, false);
              prn.addTextFont(printer.FONT_C);
              prn.addText(' GST no:\n');
              prn.addTextPosition(170);
              prn.addTextVPosition(548);
              prn.addTextDouble(true, true);
              prn.addText(' *Invoice*\n');
              prn.addTextDouble(false, false);
              prn.addTextFont(printer.FONT_B);
              prn.addText(' Date        :     ' + moment(new Date()).format("DD-MM-YYYY HH:mm:ss").toString() + '\n');
              prn.addText(' SmNumber    :      ' + '\n');
              prn.addTextFont(printer.FONT_C);
              prn.addText(' ______________________________________________________________\n');
              prn.addTextPosition(10);
              prn.addText('CUSTOMER NAME:        ' + invoiceTax.tagCustomerName + '\n');
              prn.addTextPosition(10);
              prn.addText('Mobile       :        ' + invoiceTax.mobileNumber + '\n');
              prn.addTextFont(printer.FONT_C);
              prn.addText(' ______________________________________________________________\n');
              prn.addTextFont(printer.FONT_B);
              prn.addText('                * ITEMS LIST *                 \n');
              prn.addTextFont(printer.FONT_C);
              prn.addText(' ______________________________________________________________\n');
              prn.addText(' S.NO   BARCODE           QTY    MRP      DISC        AMOUNT   \n');
              prn.addTextFont(printer.FONT_C);
              prn.addText(' ______________________________________________________________\n');
              let j = 1;
              for (let i = 0; i < object.length; i++) {
                prn.addTextPosition(0);
                prn.addText(' ' + j + '. ');
                prn.addTextPosition(70);
                prn.addText(object[ i ].barCode);
                prn.addTextPosition(232);
                prn.addText(object[ i ].quantity);
                prn.addTextPosition(298);
                prn.addText(object[ i ].itemPrice);
                prn.addTextPosition(379);
                prn.addText(object[ i ].promoDiscount);
                prn.addTextPosition(488);
                prn.addTextAlign(printer.ALIGN_RIGHT);
                prn.addText(object[ i ].netValue + '\n');
                j++;
                // prn.addText(' '+ j + '. ' + object[i].barCode + '        ' + object[i].quantity + '   ' + object[i].itemPrice+ '    '+ object[i].promoDiscount + '       ' + object[i].netValue + '\n');
                // j++;
              }

              prn.addTextFont(printer.FONT_C);
              prn.addText(' ______________________________________________________________\n');
              let grandTotal = 0;
              let totalqty = 0;
              let promoDiscount = 0;
              object.forEach(bardata => {
                grandTotal = grandTotal + bardata.netValue;
                promoDiscount = promoDiscount + bardata?.promoDiscount;
                totalqty = totalqty + parseInt(bardata.quantity);
              });
              let netpayable = grandTotal - promoDiscount;
              prn.addText(' Gross Amount                                          ' + invoiceTax.grossAmount + '\n');
              prn.addText(' Promo Discount                                        ' + invoiceTax.totalPromoDisc + '\n');
              prn.addText(' Manual Discount                                       ' + invoiceTax.totalManualDisc + '\n');
              { invoiceTax.returnSlipAmount > 0 && prn.addText(' RT Amount                                             ' + invoiceTax.returnSlipAmount + '\n'); }
              { invoiceTax.gvAppliedAmount > 0 && prn.addText(' Coupon Amount                                         ' + invoiceTax.gvAppliedAmount + '\n'); }
              prn.addText(' ______________________________________________________________\n');
              prn.addText(' Total Amount                                          ' + invoiceTax.netPayableAmount + '\n');
              prn.addText(' ______________________________________________________________\n');
              prn.addText(' Tax                                          \n');
              prn.addText(' ______________________________________________________________\n');
              prn.addText(' SGST                                                  ' + invoiceTax.sgst + '\n');
              prn.addText(' CGST                                                  ' + invoiceTax.cgst + '\n');
              prn.addText(' IGST                                                    0.00\n');
              prn.addText(' ______________________________________________________________\n');
              prn.addText(' Net Total(tax inc)                                    ' + invoiceTax.netPayableAmount + '\n');
              prn.addText(' ______________________________________________________________\n');


              // prn.addText(' 1.    shirts     2       M      0.0   1850.00\n');
              // prn.addText(' 2.    sarees     4       F      0.0   2550.00\n');
              // prn.addText(' 3.    T-shirts   3       M      0.0   3000.00\n');
              // prn.addText(' 4.    shorts     2       M      0.0    750.00\n');
              // prn.addText(' 5.    pants      1       T      0.0    800.00\n');
              // prn.addText(' 6.    shoes      1       S      0.0   1250.00\n');
              // prn.addText(' 7.    socks      2       M      0.0    250.00\n');
              // prn.addText(' 8.    paste      5       Y      0.0    450.00\n');
              // prn.addText(' 9.    soaps      6       M      0.0    350.00\n');
              // prn.addText(' 10.   brushes    5       F      0.0    800.00\n');
              // prn.addText(' ---------------------------------------------\n');
              // prn.addText(' Total            31             0.0  11230.00\n');
              // prn.addText(' ---------------------------------------------\n');
              // prn.addText(' Tax                                          \n');
              // prn.addText(' ---------------------------------------------\n');
              // prn.addText(' SGST                                   125.00\n');
              // prn.addText(' CGST                                   125.00\n');
              // prn.addText(' IGST                                     0.00\n');
              // prn.addText(' ---------------------------------------------\n');
              // prn.addText(' Net Total                            11230.00\n');
              // prn.addText(' ---------------------------------------------\n');
              // prn.addSymbol('http://www.google.com/', prn.SYMBOL_QRCODE_MODEL_1, prn.LEVEL_DEFAULT, 9, 8, 350);
              prn.addTextPosition(30);
              prn.addTextDouble(true, true);
              prn.addBarcode(inNum, prn.BARCODE_CODE39, prn.HRI_BELOW, prn.FONT_B, 2, 90);
              prn.addTextDouble(false, false);
              prn.addTextFont(printer.FONT_B);
              prn.addText('                         THANK YOU                         \n');
            }
            // prn.addCut(prn.CUT_FEED);
            // // *************************PRINT BILL*****************************

            // prn.send();
            else if (type === 'RETURNSLIP') {
              let reNum = barcode;
              prn.addTextDouble(true, true);
              prn.addTextPosition(150);
              prn.addTextVPosition(70);
              prn.addTextFont(printer.FONT_SPECIAL_A);
              prn.addText('EASY REATIL\n');
              prn.addTextLineSpace(40);
              prn.addTextPosition(60);
              prn.addTextVPosition(495);
              prn.addText(' OTSI - Hi-tech city\n');
              prn.addTextPosition(170);
              prn.addTextVPosition(548);
              prn.addTextDouble(true, true);
              prn.addText(' *RETURN SLIP*\n');
              prn.addTextDouble(false, false);
              prn.addTextFont(printer.FONT_B);
              prn.addText(' Date        :     ' + moment(new Date()).format("DD-MM-YYYY HH:mm:ss").toString() + '\n');
              prn.addTextFont(printer.FONT_C);
              prn.addText(' _________________________________________________________________\n');
              prn.addTextFont(printer.FONT_B);
              prn.addText('                * ITEMS LIST *                 \n');
              prn.addTextFont(printer.FONT_C);
              prn.addText(' ______________________________________________________________\n');
              prn.addText(' S.NO   BARCODE         MRP       RETURNQTY     RETURNAMOUNT   \n');
              // prn.addText(' S.NO   BARCODE           QTY    MRP      DISC        AMOUNT   \n');
              prn.addTextFont(printer.FONT_C);
              prn.addText(' ______________________________________________________________\n');
              let j = 1;
              for (let i = 0; i < object.length; i++) {
                prn.addTextPosition(0);
                prn.addText(' ' + j + '. ');
                prn.addTextPosition(70);
                prn.addText(object[ i ].barCode);
                prn.addTextPosition(220);
                prn.addText(object[ i ].amount);
                prn.addTextPosition(310);
                prn.addText(object[ i ].returnQty);
                prn.addTextPosition(450);
                prn.addTextAlign(printer.ALIGN_RIGHT);
                prn.addText(object[ i ].returnAmount + '\n');
                // prn.addText(' '+j + '. ' + object[i].barcode + '    ' + object[i].mrp + '       ' + object[i].returnQty + '         ' + object[i].returnedAmout + '\n');
                j++;
              }
              prn.addTextFont(printer.FONT_C);
              prn.addText(' ______________________________________________________________\n');
              // prn.addTextPosition(100);
              // prn.addText(' RT AMOUNT                             '+ invoiceTax.totalAmount +'\n');
              prn.addText(' RT Amount                                             ' + invoiceTax.totalAmount + '\n');
              prn.addText(' ______________________________________________________________\n');
              prn.addTextPosition(30);
              prn.addTextDouble(true, true);
              prn.addBarcode(reNum, prn.BARCODE_CODE39, prn.HRI_BELOW, prn.FONT_B, 2, 90);
              prn.addTextDouble(false, false);
              prn.addTextFont(printer.FONT_B);
              prn.addText('                         THANK YOU                         \n');
            }
            prn.addCut(prn.CUT_FEED);
            // *************************PRINT BILL*****************************

            prn.send();

          } else {
            throw retcode;
          }
        }
      );
    } else {
      toast.error("Printer Not connected");
      document.body.classList.remove("connect-indicator");
    }
  };

};

export default PrinterStatusBill;
