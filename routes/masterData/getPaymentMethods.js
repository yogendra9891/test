var Route = require('../../libs/core/Route');
//var helpers = require('../../helpers');
var Check = require('../../libs/core/Check');
var appUtils = require('../../libs/appUtils');
var api_errors = require('../../assets/api_errors');
var ApiException = require('../../libs/core/ApiException');
var magentoObj = require('../../assets/magentoobj');
var MasterData = require('../../Controllers/masterData/MasterData');
var magento = magentoObj.magento;
var magentoLoginError = require("../../helpers/MagentoLoginError");
var ApiSuccess = require("../../libs/core/ApiSuccess");

// define route
var route = new Route('post', '/getPaymentMathods');
module.exports = route;

// validate input
route.use(function(req, res, next) {
  var input = req.body;
  var rules = {
    store_id: Check.that(input.store_id).isNumberType(),
    cart_id: Check.that(input.cart_id).isNumberType()
  };
  appUtils.validateChecks(rules, next);

});


route.use(function(req, res, next) {
  var input = req.body;
  var store_id = input.store_id;
  var cart_id = input.cart_id;
  MasterData.getPaymentMathods(store_id, cart_id, function(err,
    paymentMathods) {
    if (err) {
      magentoLoginError.handleError(err, req, res, next,
        api_errors.get_payment_methods.error_code,
        err.faultString, false);
    } else {
      data = {
        "paymentMathods": paymentMathods
      };
      var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", data);
      return res.json(resp);
    }
  })
});
