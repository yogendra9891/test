var Route = require('../../libs/core/Route');
//var helpers = require('../../helpers');
var Check = require('../../libs/core/Check');
var appUtils = require('../../libs/appUtils');
var api_errors = require('../../assets/api_errors');
var ApiException = require('../../libs/core/ApiException');
var magentoLoginError = require("../../helpers/MagentoLoginError");
var Cart = require('../../Controllers/cart/Cart');
var magentoObj = require('../../assets/magentoobj');
var magento = magentoObj.magento;
var magentoLoginError = require("../../helpers/MagentoLoginError");
var ApiSuccess = require("../../libs/core/ApiSuccess");

// define route
var route = new Route('post', '/createCart');
module.exports = route;

// validate input
route.use(function(req, res, next) {
  var input = req.body;
  var rules = {
    store_id: Check.that(input.store_id).isInteger(),
    agent_id: Check.that(input.agent_id).isInteger()
  };
  appUtils.validateChecks(rules, next);

});


route.use(function(req, res, next) {
  var input = req.body;
  var store_id = input.store_id;
  var agent_id = input.agent_id;
  Cart.createCart(store_id, agent_id, function(err, cart_id) {
    if (err) {
      magentoLoginError.handleError(err, req, res, next,
        api_errors.error_while_cart_create.error_code, err.faultString,
        false);
    } else {
      data = {
        "cart_id": cart_id
      };
      var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", data);
      return res.json(resp);
    }
  })
});
