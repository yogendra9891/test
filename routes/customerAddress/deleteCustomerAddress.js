var lodash = require('lodash');
var Route = require('../../libs/core/Route');
//var helpers = require('../../helpers');
var Check = require('../../libs/core/Check');
var appUtils = require('../../libs/appUtils');
var api_errors = require('../../assets/api_errors');
var ApiException = require('../../libs/core/ApiException');
var magentoObj = require('../../assets/magentoobj');
var CustomerAddressObject = require(
  '../../Controllers/customer/customerAddress');
var magento = magentoObj.magento;
var magentoLoginError = require("../../helpers/MagentoLoginError");
var ApiSuccess = require("../../libs/core/ApiSuccess");

// define route
var route = new Route('post', '/deleteCustomerAddress');
module.exports = route;

// validate input
route.use(function(req, res, next) {
  var input = req.body;
  var rules = {
    address_id: Check.that(input.address_id).isInteger()
  };
  appUtils.validateChecks(rules, next);
});

// sanitize input
// route.use(function(req, res, next) {
//
//   if (lodash.has(req.body.address_id, 'address_id')) {
//     req.body.address_id = (req.body.address_id).trim();
//   }
//
//   next();
// });


route.use(function(req, res, next) {
  var input = req.body;
  var address_id = input.address_id;
  CustomerAddressObject.deleteCustomerAddress(address_id, function(err,
    deleteAddress) {
    if (err) {
      magentoLoginError.handleError(err, req, res, next,
        api_errors.delete_customer_address.error_code,
        err.faultString, false);
    } else {
      data = {
        "response": true
      };
      var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", data);
      return res.json(resp);
    }
  })
});
