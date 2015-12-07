var Route = require('../../libs/core/Route');
//var helpers = require('../../helpers');
var Check = require('../../libs/core/Check');
var appUtils = require('../../libs/appUtils');
var api_errors = require('../../assets/api_errors');
var ApiException = require('../../libs/core/ApiException');
var magentoObj = require('../../assets/magentoobj');
var Cart = require('../../Controllers/cart/Cart');
var magento = magentoObj.magento;
var magentoLoginError = require("../../helpers/MagentoLoginError");
var ApiSuccess = require("../../libs/core/ApiSuccess");
var http = require('http');
var request = require('request');


// define route
var route = new Route('post', '/duplicateOrder');
module.exports = route;

// validate input
route.use(function(req, res, next) {
  var input = req.body;
  var rules = {
    store_id: Check.that(input.store_id).isInteger(),
  //  order_id: Check.that(input.order_id).isInteger(),
  //  customer_info: Check.that(input.customer).isArrayType()
  };
  appUtils.validateChecks(rules, next);

});
var headers = {};
var dataString = JSON.stringify({"order_id":100000080});
//console.log(dataString);

headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };

var options = {
      hostname: '14.141.28.114:8089/annabel_trends/',
      port: 80,
      path: 'api/rest/duplicateorder',
      // /annabel_trends/index.php/api/xmlrpc/
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': dataString.length
      }
    };

route.use(function(req1, res1, next) {
  request({
       url: "http://14.141.28.114:8089/annabel_trends/api/rest/duplicateorder", //URL to hit
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'api_secret': '123456'
       },
       body: dataString //Set the body as a string
     }, function(err, httpResponse, body){
       console.log(body);
     });

  res1.json({"code":100});
});
