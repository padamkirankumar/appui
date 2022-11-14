import ecommerce from "../../src/assets/images/ecommerce.svg";
import axios from 'axios';
export default async function displayRazorpay(value, newsaleId) {
  console.log(newsaleId);
  const URL= process.env.REACT_APP_BASE_URL+'/paymentgateway/paymentgateway/create_order'
   console.log(URL);
   const body =   JSON.stringify(  { "amount": value,
    "info": "order_request",
  "newsaleId": newsaleId}    )
   return  axios.post(URL, body, {
    headers: {
        'Content-Type': 'application/json',
    }
})
  // const data = await fetch(URL, {
  //   method: "POST",
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(  { "amount": value,
  //   "info": "order_request"}    )
  // }).then((data) => data.json());

  // console.log(data);

  // const options = {
  //   // process.env.RAZORPAY_KEY_ID
  //   key: "rzp_test_z8jVsg0bBgLQer",
  //   currency: data.currency,
  //   amount: data.amount,
  //   name: "OTSI",
  //   description: "Transaction",
  //   image: ecommerce,
  //   order_id: data.id,
  //   handler: function (response) {
  //     console.log("PAYMENT ID ::" + response.razorpay_payment_id)
  //     console.log("ORDER ID :: " + response.razorpay_order_id)

  //    // return response;
  //     // alert("PAYMENT ID ::" + response.razorpay_payment_id);
  //     // alert("ORDER ID :: " + response.razorpay_order_id);
  //   },
  //   prefill: {
  //     name: "Kadali",
  //     email: "kadali@gmail.com",
  //     contact: "9999999999",
  //   },
  // };
  // const paymentObject = new window.Razorpay(options);
  // paymentObject.open();
  // const options = {
  //   key: "rzp_test_z8jVsg0bBgLQer",
  //   currency: 'INR',
  //   amount: 20000,
  //   name: "Learn Code Online",
  //   description: "Wallet Transaction",
  //   image: "http://localhost:1337/logo.png",
  //   order_id: "order_Hrlk5dOVlEDJQu",
  //   // handler: function (response) {
  //   //   alert("PAYMENT ID ::" + response.razorpay_payment_id);
  //   //   alert("ORDER ID :: " + response.razorpay_order_id);
  //   // },
  //   prefill: {
  //     name: "Kadali",
  //     email: "Kadali@gmail.com",
  //     contact: "9999999999",
  //   },

  //};

 
}
