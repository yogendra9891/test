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
var route = new Route('post', '/applyCoupon');
module.exports = route;

// validate input
route.use(function(req, res, next) {
  var input = req.body;
  var rules = {
    store_id: Check.that(input.store_id).isInteger(),
    cart_id: Check.that(input.cart_id).isInteger(),
    coupon_code: Check.that(input.coupon_code).isNotEmptyOrBlank()
  };
  appUtils.validateChecks(rules, next);

});


route.use(function(req, res, next) {
  var input = req.body;
  var store_id = input.store_id;
  var cart_id = input.cart_id;
  var coupon_code = input.coupon_code;
  Cart.applyCoupon(store_id, cart_id, coupon_code, function(err, response) {
    if (err) {
      magentoLoginError.handleError(err, req, res, next,
        api_errors.apply_coupon_to_cart.error_code,
        err.faultString, false);
    } else {
      var data = {
        "response": response
      };
      var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", data);
      return res.json(resp);
    }
  })
});
