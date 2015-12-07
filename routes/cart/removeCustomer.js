var lodash = require('lodash');
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

// define route
var route = new Route('post', '/removeCustomer');
module.exports = route;

// validate input
route.use(function(req, res, next) {
  var input = req.body;
  var rules = {
    customer_id: Check.that(input.customer_id).isInteger(),
  };
  appUtils.validateChecks(rules, next);

});

route.use(function(req, res, next) {
  var input = req.body;
  var customer_id = input.customer_id;
  Cart.removeCustomer(customer_id, function(err, customer) {
    if (err) {
      magentoLoginError.handleError(err, req, res, next,
        api_errors.get_remove_customer.error_code,
        err.faultString, false);
    } else {
      data = {
        "response": customer
      };
      var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", data);
      return res.json(resp);
    }
  });
});
