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
var route = new Route('post', '/updateCustomer');
module.exports = route;

// validate input
route.use(function(req, res, next) {
  var input = req.body;
  var rules = {
    store_id: Check.that(input.store_id).isInteger(),
    customer_id: Check.that(input.customer_id).isInteger(),
    fname: Check.that(input.fname).isNotEmptyOrBlank(),
    lname: Check.that(input.lname).isNotEmptyOrBlank(),
    email: Check.that(input.email).isEmail(),
    dob: Check.that(input.dob).isNotEmptyOrBlank(),
  };
  appUtils.validateChecks(rules, next);

});


route.use(function(req, res, next) {
  var customer = ["fname", "lname", "email", "dob"];
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
//   if (lodash.has(req.body.customer_id, 'customer_id')) {
//     req.body.customer_id = (req.body.customer_id).trim();
//   }
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
//   if (lodash.has(req.body.dob, 'dob')) {
//     req.body.dob = (req.body.dob).trim();
//   }
//   console.log((req.body.fname).trim());
//   next();
// });

route.use(function(req, res, next) {
  var input = req.body;
  var store_id = input.store_id;
  var customer_id = input.customer_id;
  var customer = {
    'firstname': input.fname,
    'lastname': input.lname,
    'email': input.email,
    'dob': input.dob
  };
  Cart.updateCustomer(store_id, customer_id, customer, function(err,
    customer) {
    if (err) {
      magentoLoginError.handleError(err, req, res, next,
        api_errors.get_update_customer.error_code,
        err.faultString, false);
    } else {
      data = {
        //"response": customer
        "response": customer
      };
      var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", data);
      return res.json(resp);
    }
  });
});
