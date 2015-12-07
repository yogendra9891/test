var lodash = require('lodash');
var Route = require('../../libs/core/Route');
//var helpers = require('../../helpers');
var Check = require('../../libs/core/Check');
var appUtils = require('../../libs/appUtils');
var api_errors = require('../../assets/api_errors');
var ApiException = require('../../libs/core/ApiException');
var magentoObj = require('../../assets/magentoobj');
var Product = require('../../Controllers/cart/Product');
var magento = magentoObj.magento;
var magentoLoginError = require("../../helpers/MagentoLoginError");
var ApiSuccess = require("../../libs/core/ApiSuccess");

// define route
var route = new Route('post', '/addProduct');
module.exports = route;

// validate input
route.use(function(req, res, next) {
  var input = req.body;
  var rules = {
    store_id: Check.that(input.store_id).isInteger(),
    cart_id: Check.that(input.cart_id).isInteger(),
    products: Check.that(input.products).isArrayType()
  };
  appUtils.validateChecks(rules, next);

});


// sanitize input
route.use(function(req, res, next) {

  //prepare the multiple product data.
  /* istanbul ignore else */
  if (lodash.has(req.body, 'products')) {
    var productsInput = [];
    req.body.products.forEach(function(productData) {
      var singleProductData = {};
      singleProductData.product_id = productData.product_id;
      singleProductData.qty = productData.qty;
      singleProductData.sku = (productData.sku).trim();
      singleProductData.super_attribute = productData.super_attribute;
      singleProductData.bundle_option = null;
      singleProductData.bundle_option_qty = null;
      singleProductData.links = null;
      productsInput.push(singleProductData);
    });
    req.body.preParedProductData = productsInput;
  }
  next();
});

route.use(function(req, res, next) {
  var input = req.body;
  var store_id = input.store_id;
  var cart_id = input.cart_id;
  var products = input.preParedProductData;
  //console.log("products data is "+JSON.stringify(products, null, 2));
  Product.addProduct(store_id, cart_id, products, function(err, resp) {
    if (err) {
      console.log("Error is coming for cart id "+cart_id+" error is "+err);
      magentoLoginError.handleError(err, req, res, next,
        api_errors.error_while_adding_product_in_cart.error_code,
        err.faultString, false);
    } else {
      var data = {
        "response": resp
      };
      var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", data);
      return res.json(resp);
    }
  });
});
