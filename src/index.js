import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { I18nextProvider } from "react-i18next";
import * as CryptoJS from "crypto-js";
import i18n from "../src/commonUtils/i18n";
import { JSEncrypt } from "jsencrypt";
import { ENCRYPTION } from "../src/commonUtils/Base";

//  npm install jsencrypt
// Start our encryptor.
if (ENCRYPTION) {
  var encrypt = new JSEncrypt();
  // Copied from https://github.com/travist/jsencrypt
  var publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApcFVlWr1VQzgo4pqJYIPoSmdu2VGHv2gnupRs4eCVJTajzSnLORVs/DBSKg0qIaBdiFnmjB7agn1XiRb1ekgwC7Zys4fzIJlW53knV280jDvQ7uBn7NiIp+NUY0ZPZqk2Uh1YD9VhzS8y+wWmjTw6qdmr0ZtzQrmH1R0HHk3WHXLaOF/7rWpo7UOZtXTJfMeTpQ9Jvz/Lv8aS/oSLunY+6Xtf6qClAEg1zt7fvkMoFfiXL9mJXvDlqSFNx2sUaiZ/UL7e40aWMpuJihmUGvMp2Z97RtzXZekNk+2q4s7wg/cOnQcuJSD/yuh2HFoC2B0IOgtXk5Q+RXfMWhQoaImWQIDAQAB`;
  // Assign our encryptor to utilize the public key.
  encrypt.setPublicKey(publicKey);
}

axios.interceptors.request.use(
  (req) => {
    if (ENCRYPTION) {
      console.log(ENCRYPTION);
      var text = JSON.stringify(req.data);
      const key = "23KAVfsyYqk+hxye3/LDM59Ts8hTiAs=";
      const iv = "0000000000000000 ";
      var encryptedKey = encrypt.encrypt(key);
      console.log(encryptedKey);
      const cipher = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv), // parse the IV
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      });
      // When ready to decrypt the hex string, convert it back to bytes
      var encryptedBytes = cipher.toString();
    }
    document.body.classList.add("loading-indicator");
    const token = JSON.parse(sessionStorage.getItem("token"));
    let clientId;
    if (sessionStorage.getItem("clientId") !== "undefined") {
      clientId = JSON.parse(sessionStorage.getItem("clientId"));
    } else {
      clientId = 0;
    }


    req.headers = {
      "Content-Type": "application/json",
      'keepalive-time': "80s"
    };
    if (token !== null) {
      req.headers.Authorization = "Bearer" + " " + token;
      req.headers.clientId = clientId ? clientId : "0";
    }
    if (ENCRYPTION) {
      req.headers = {
        "Content-Type": "application/json",
        "enc-key": encryptedKey,
      };
      req.data = encryptedBytes;
    }

    console.log("Request to server:::::::::::::::::::");
    return req;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// For response
axios.interceptors.response.use(
  (res) => {
    if (
      res &&
      res.data &&
      (res.data.isSuccess === "true" ||
        res.data.isSuccess === null ||
        res.data.isSuccess === undefined)
    ) {
      document.body.classList.remove("loading-indicator");
      if (res.data.result == null) {
        toast.success(res.data.message);
      }
      // if (res.data && res.data.statusCode === 200) {
      //    console.log('Posted Successfully');
      // } else {
      //    toast.error(res.data.body);
      // }
      return res;
    } else {
      document.body.classList.remove("loading-indicator");
      toast.error(res.data.message);
    }
  },
  (err) => {
    toast.error(
      err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : "Something went Wrong"
    );
    document.body.classList.remove("loading-indicator");
    return Promise.reject(err);
  }
);
ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
