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
var route = new Route('post', '/cartDetails');
module.exports = route;

// validate input
route.use(function(req, res, next) {
  var input = req.body;
  var rules = {
    store_id: Check.that(input.store_id).isInteger(),
    cart_id: Check.that(input.cart_id).isInteger()
  };
  appUtils.validateChecks(rules, next);

});


route.use(function(req, res, next) {
  var input = req.body;
  var store_id = input.store_id;
  var cart_id = input.cart_id;
  Cart.cartDetails(store_id, cart_id, function(err, cartdetails) {
    if (err) {
      magentoLoginError.handleError(err, req, res, next,
        api_errors.get_cart_details.error_code,
        err.faultString, false);
    } else {
      data = {
        "cartdetails": cartdetails
      };

      var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", data);
      return res.json(resp);
    }
  })
});
