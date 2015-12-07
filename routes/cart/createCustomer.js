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
var route = new Route('post', '/createCustomer');
module.exports = route;

// validate input
route.use(function(req, res, next) {
  var input = req.body;
  var rules = {
    fname: Check.that(input.fname).isNotEmptyOrBlank(),
    lname: Check.that(input.lname).isNotEmptyOrBlank(),
    email: Check.that(input.email).isEmail(),
    password: Check.that(input.password).isNotEmptyOrBlank(),
    group_id: Check.that(input.group_id).isInteger(),
    website_id: Check.that(input.website_id).isInteger(),
  };
  appUtils.validateChecks(rules, next);

});

route.use(function(req, res, next) {
  var customer = ["fname", "lname", "email", "password"];
  customer.forEach(function(item) {
    /* istanbul ignore else */
    if (lodash.has(req.body, item)) {
      req.body[item] = (req.body[item]).trim();
    }
  });
  next();
});



// sanitize input
// route.use(function(req, res, next) {
//
//   if (lodash.has(req.body.fname, 'fname')) {
//     req.body.fname = (req.body.fname).trim();
//   }
//
//   if (lodash.has(req.body.lname, 'lname')) {
//     req.body.lname = (req.body.lname).trim();
//   }
//
//   if (lodash.has(req.body.email, 'email')) {
//     req.body.email = (req.body.email).trim();
//   }
//
//   if (lodash.has(req.body.password, 'passowrd')) {
//     req.body.password = (req.body.password).trim();
//   }
//   next();
// });

route.use(function(req, res, next) {
  var input = req.body;
  var store_id = input.store_id;
  var customer = {
    'firstname': input.fname,
    'lastname': input.lname,
    'email': input.email,
    'password': input.password,
    'website_id': input.website_id,
    'group_id': input.group_id
  }
  Cart.createCustomer(store_id, customer, function(err, customer) {
    if (err) {
      magentoLoginError.handleError(err, req, res, next,
        api_errors.get_create_customer.error_code,
        err.faultString, false);
    } else {
      //customer is id of currently created customer
      data = {
        //"response": customer
        "response": true
      };
      var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", data);
      return res.json(resp);
    }
  })
});
