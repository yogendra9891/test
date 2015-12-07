var lodash = require('lodash');
var Route = require('../../libs/core/Route');
//var helpers = require('../../helpers');
var Check = require('../../libs/core/Check');
var appUtils = require('../../libs/appUtils');
var api_errors = require('../../assets/api_errors');
var ApiException = require('../../libs/core/ApiException');
var magentoObj = require('../../assets/magentoobj');
var CartCustomer = require('../../Controllers/cart/CartCustomer');
var magento = magentoObj.magento;
var magentoLoginError = require("../../helpers/MagentoLoginError");
var ApiSuccess = require("../../libs/core/ApiSuccess");
// define route
var route = new Route('post', '/setCartAddress');
module.exports = route;

// validate input
route.use(function(req, res, next) {
  var input = req.body;
  var rules = {
    store_id: Check.that(input.store_id).isInteger(),
    cart_id: Check.that(input.cart_id).isInteger(),
    shipping_address_id: Check.that(input.shipping_address.address_id).isOptional()
      .isNotEmptyOrBlank(),
    shipping_fname: Check.that(input.shipping_address.fname).isNotEmptyOrBlank(),
    shipping_lname: Check.that(input.shipping_address.lname).isNotEmptyOrBlank(),
    shipping_street: Check.that(input.shipping_address.street).isNotEmptyOrBlank(),
    shipping_region: Check.that(input.shipping_address.region).isNotEmptyOrBlank(),
    shipping_region_id: Check.that(input.shipping_address.region_id).isInteger(),
    shipping_city: Check.that(input.shipping_address.city).isNotEmptyOrBlank(),
    shipping_country: Check.that(input.shipping_address.country).isNotEmptyOrBlank(),
    shipping_mob: Check.that(input.shipping_address.mob).isNotEmptyOrBlank(),
    shipping_postcode: Check.that(input.shipping_address.postcode).isNotEmptyOrBlank(),
    shipping_is_default_billing: Check.that(input.shipping_address.is_default_billing)
      .isBooleanType(),
    shipping_is_default_shipping: Check.that(input.shipping_address.is_default_shipping)
      .isBooleanType(),
    shipping_type: Check.that(input.shipping_address.type).isEnum([
      'shipping'
    ]),

    billing_address_id: Check.that(input.billing_address.address_id).isOptional()
      .isNotEmptyOrBlank(),
    billing_fname: Check.that(input.billing_address.fname).isNotEmptyOrBlank(),
    billing_lname: Check.that(input.billing_address.lname).isNotEmptyOrBlank(),
    billing_street: Check.that(input.billing_address.street).isNotEmptyOrBlank(),
    billing_region: Check.that(input.billing_address.region).isNotEmptyOrBlank(),
    billing_region_id: Check.that(input.billing_address.region_id).isInteger(),
    billing_city: Check.that(input.billing_address.city).isNotEmptyOrBlank(),
    billing_country: Check.that(input.billing_address.country).isNotEmptyOrBlank(),
    billing_mob: Check.that(input.billing_address.mob).isNotEmptyOrBlank(),
    billing_postcode: Check.that(input.billing_address.postcode).isNotEmptyOrBlank(),
    billing_is_default_billing: Check.that(input.billing_address.is_default_billing)
      .isBooleanType(),
    billing_is_default_shipping: Check.that(input.billing_address.is_default_shipping)
      .isBooleanType(),
    billing_type: Check.that(input.billing_address.type).isEnum([
      'billing'
    ])
  };
  appUtils.validateChecks(rules, next);

});

route.use(function(req, res, next) {
  var address = ["fname", "lname", "street", "region", "city",
    "country", "mob", "postcode"
  ];
  address.forEach(function(item) {
    /* istanbul ignore else */
    if (lodash.has(req.body.shipping_address, item)) {
      req.body.shipping_address[item] = (req.body.shipping_address[item])
        .trim();
    }
  });

  address.forEach(function(item) {
    /* istanbul ignore else */
    if (lodash.has(req.body.billing_address, item)) {
      req.body.billing_address[item] = (req.body.billing_address[item])
        .trim();
    }
  });
  //sanitize input
  /*route.use(function(req, res, next) {

    //shipping address
    if (lodash.has(req.body.shipping_address, 'fname')) {
      req.body.shipping_address.fname = (req.body.shipping_address.fname).trim();
    }

    if (lodash.has(req.body.shipping_address, 'lname')) {
      req.body.shipping_address.lname = (req.body.shipping_address.lname).trim();
    }

    if (lodash.has(req.body.shipping_address, 'street')) {
      req.body.shipping_address.street = (req.body.shipping_address.street).trim();
    }

    if (lodash.has(req.body.shipping_address, 'region')) {
      req.body.shipping_address.region = (req.body.shipping_address.region).trim();
    }

    if (lodash.has(req.body.shipping_address, 'country')) {
      req.body.shipping_address.country = (req.body.shipping_address.country)
        .trim();
    }

    if (lodash.has(req.body.shipping_address, 'mob')) {
      req.body.shipping_address.mob = (req.body.shipping_address.mob).trim();
    }

    if (lodash.has(req.body.shipping_address, 'postcode')) {
      req.body.shipping_address.postcode = (req.body.shipping_address.postcode)
        .trim();
    }

    if (lodash.has(req.body.shipping_address, 'type')) {
      req.body.shipping_address.type = (req.body.shipping_address.type).trim();
    }

    //billing address
    if (lodash.has(req.body.billing_address, 'fname')) {
      req.body.billing_address.fname = (req.body.billing_address.fname).trim();
    }

    if (lodash.has(req.body.billing_address, 'lname')) {
      req.body.billing_address.lname = (req.body.billing_address.lname).trim();
    }

    if (lodash.has(req.body.billing_address, 'street')) {
      req.body.billing_address.street = (req.body.billing_address.street).trim();
    }

    if (lodash.has(req.body.shipping_address, 'region')) {
      req.body.billing_address.region = (req.body.billing_address.region).trim();
    }

    if (lodash.has(req.body.shipping_address, 'country')) {
      req.body.billing_address.country = (req.body.billing_address.country).trim();
    }

    if (lodash.has(req.body.shipping_address, 'mob')) {
      req.body.billing_address.mob = (req.body.billing_address.mob).trim();
    }

    if (lodash.has(req.body.billing_address, 'postcode')) {
      req.body.billing_address.postcode = (req.body.billing_address.postcode)
        .trim();
    }

    if (lodash.has(req.body.billing_address, 'type')) {
      req.body.billing_address.type = (req.body.billing_address.type).trim();
    }*/
  /* istanbul ignore else */
  if (lodash.has(req.body, 'shipping_address')) {
    req.body.shippngInputAddress = {
      "firstname": req.body.shipping_address.fname,
      "lastname": req.body.shipping_address.lname,
      "street": req.body.shipping_address.street,
      "city": req.body.shipping_address.city,
      "region": req.body.shipping_address.region,
      "region_id": req.body.shipping_address.region_id,
      "country_id": req.body.shipping_address.country,
      "telephone": req.body.shipping_address.mob,
      "mode": req.body.shipping_address.type,
      "postcode": req.body.shipping_address.postcode
    };
    req.body.billingInputAddress = {
      "firstname": req.body.billing_address.fname,
      "lastname": req.body.billing_address.lname,
      "street": req.body.billing_address.street,
      "city": req.body.billing_address.city,
      "region": req.body.billing_address.region,
      "region_id": req.body.billing_address.region_id,
      "country_id": req.body.billing_address.country,
      "telephone": req.body.billing_address.mob,
      "mode": req.body.billing_address.type,
      "postcode": req.body.billing_address.postcode
    };
  }
  next();
});

route.use(function(req, res, next) {
  var input = req.body;
  var store_id = input.store_id;
  var cart_id = input.cart_id;
  var shippingAddress = input.shippngInputAddress;
  var billingAddress = input.billingInputAddress;

  var addresses = [];
  addresses.push(shippingAddress);
  addresses.push(billingAddress);
  CartCustomer.setCustomerAddressToCart(store_id, cart_id, addresses,
    function(err, resp) {
      if (err) {
        magentoLoginError.handleError(err, req, res, next,
          api_errors.set_cart_address.error_code,
          err.faultString, false);
      } else {
        data = {
          "response": resp
        };
        var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", data);
        return res.json(resp);
      }
    })
});
