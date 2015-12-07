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
var route = new Route('post', '/getOrderList');
module.exports = route;

// validate input
route.use(function(req, res, next) {
  var input = req.body;
  var rules = {
    store_id: Check.that(input.store_id).isInteger(),
    customer_id: Check.that(input.customer_id).isInteger()
  };
  appUtils.validateChecks(rules, next);

});

// sanitize input
//Boths the keys are integer so cannot be trimmed

/* route.use(function(req, res, next) {

  if (lodash.has(req.body.store_id, 'store_id')) {
    req.body.store_id = (req.body.store_id).trim();
  }

  if (lodash.has(req.body.customer_id, 'customer_id')) {
    req.body.customer_id = (req.body.customer_id).trim();
  }

  next();
}); */

route.use(function(req, res, next) {
  var input = req.body;
  var store_id = input.store_id;
  var customer_id = input.customer_id;
  Cart.listOrders(store_id, customer_id, function(err, orders) {
    if (err) {
      magentoLoginError.handleError(err, req, res, next,
        api_errors.get_list_order.error_code,
        err.faultString, false);
    } else {
      data = {
        "orders": orders
      };
      var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", data);
      return res.json(resp);
    }
  })
});
