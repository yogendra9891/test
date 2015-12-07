var lodash = require('lodash');
var Route = require('../../libs/core/Route');
//var helpers = require('../../helpers');
var Check = require('../../libs/core/Check');
var appUtils = require('../../libs/appUtils');
var api_errors = require('../../assets/api_errors');
var ApiException = require('../../libs/core/ApiException');
var magentoObj = require('../../assets/magentoobj');
var CartCustomer = require('../../Controllers/cart/CartCustomer');
var magento = magentoObj.magento;
var magentoLoginError = require("../../helpers/MagentoLoginError");
var ApiSuccess = require("../../libs/core/ApiSuccess");
var Cart = require('../../Controllers/cart/Cart');
var Product = require('../../Controllers/cart/Product');
var request = require('request');
var config = require('config');


// define route
var route = new Route('post', '/setCustomer');
module.exports = route;

// validate input
route.use(function(req, res, next) {
  var input = req.body;
  var rules = {
    store_id: Check.that(input.store_id).isInteger(),
    cart_id: Check.that(input.cart_id).isInteger(),
    customer_info: Check.that(input.customer).isArrayType()
  };
  appUtils.validateChecks(rules, next);

});


// sanitize input
route.use(function(req, res, next) {
  /* istanbul ignore else */
  if (lodash.has(req.body, 'customer')) {
    var allCustomer = req.body.customer;

    req.body.objectCustomer = [];
    allCustomer.forEach(function(item){
      var  formatedCustomer = {
        "customer_id": item.customer_id,
        "firstname": item.fname,
        "lastname": item.lname,
        "email": item.email,
        "mode": item.mode,
        "store_id": req.body.store_id,
        "comment": item.comment,
      };
      req.body.objectCustomer.push(formatedCustomer);
    });
}
  next();
});
//the process have to much if else, this is due to magento didnt change at thier end. so we have to do these 4-5 services
//for multiple clients.
//@TODO: please remove logs.
route.use(function(req, res, next) {
  var input = req.body;
  var store_id = input.store_id;
  var cart_id = input.cart_id;
  var firstcustomer = input.objectCustomer[0];
  CartCustomer.setCustomerToCart(store_id, cart_id, firstcustomer, function(err,
    resp) {
    if (err) {
      magentoLoginError.handleError(err, req, res, next,
        api_errors.set_cart_customer.error_code,
        err.faultString, false);
    } else {
      Cart.placeOrder(store_id, cart_id, function(err, orderdetails) {
        console.log("first order id is "+orderdetails+ " for cart id "+cart_id);
        if (err) {
          console.log("error is coming for placing the order to cart_id "+cart_id+" error code is "+ err.code+ " error is "+ err.faultString);
          magentoLoginError.handleError(err, req, res, next,
            api_errors.place_order.error_code,
            err.faultString, false);
        } else {
          Product.addCommentProduct(orderdetails, 'pending', firstcustomer.comment, function(err, comment_response){
            console.log("comment "+firstcustomer.comment+" is added for order id "+orderdetails+" and status is "+comment_response);
          });  
          if (input.objectCustomer.length == 1) {
              data = {"response":true};
              var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", data);
              return res.json(resp);
          } else {
            var remainCustomers = input.objectCustomer;
            remainCustomers.shift(); //remove first customer from array
            console.log(remainCustomers);
            remainCustomers.forEach(function(singleCustomer) { //iteration for each customer
              console.log("customer is "+JSON.stringify(singleCustomer));
                  request({
                       url: config.get("magento_rest.host")+config.get("magento_rest.path")+"api/rest/duplicateorder", //URL to hit
                       method: 'POST',
                       headers: {
                         'Content-Type': 'application/json',
                         'api_secret': config.get("magento_rest.api_secret")
                       },
                       body: JSON.stringify({"order_id":orderdetails}) //Set the body as a string
                     }, function(err, httpResponse, body){
                       if(err) {
                         magentoLoginError.handleError(err, req, res, next,
                           api_errors.duplicate_order.error_code,
                           err.faultString, false);
                       } else {
                               orderData = JSON.parse(body);
                               var newQuoteId = parseInt(orderData.data.quote_id);
                               console.log("new quote id for duplicate order is "+newQuoteId);
                                 CartCustomer.setCustomerToCart(store_id, newQuoteId, singleCustomer, function(err,
                                   resp) {
                                     if (err) {
                                       magentoLoginError.handleError(err, req, res, next,
                                         api_errors.set_cart_customer.error_code,
                                         err.faultString, false);
                                     } else {
                                       console.log("new quote id for order "+ newQuoteId);
                                       Cart.placeOrder(store_id, newQuoteId, function(err, orderdetail) {
                                         if (err) {
                                           magentoLoginError.handleError(err, req, res, next,
                                             api_errors.place_order.error_code,
                                             err.faultString, false);
                                         } else {
                                           Product.addCommentProduct(orderdetail, 'pending', singleCustomer.comment, function(err, comment_response){
                                             console.log("comment "+singleCustomer.comment+" is added for orderid "+ orderdetail);
                                           });
                                           console.log("order place for customer id "+singleCustomer.customer_id+" and order id is"+orderdetail);
                                         }
                                     });
                                   }
                                   });
                            }
                     });
            });
            var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", {"response":true});
            return res.json(resp);
          }
        }
      });
    }
  })
});
