var lodash = require('lodash');
var Route = require('../../libs/core/Route');
//var helpers = require('../../helpers');
var Check = require('../../libs/core/Check');
var appUtils = require('../../libs/appUtils');
var api_errors = require('../../assets/api_errors');
var ApiException = require('../../libs/core/ApiException');
var magentoObj = require('../../assets/magentoobj');
var CustomerAddressObject = require(
  '../../Controllers/customer/customerAddress');
var magento = magentoObj.magento;
var magentoLoginError = require("../../helpers/MagentoLoginError");
var ApiSuccess = require("../../libs/core/ApiSuccess");



// define route
var route = new Route('post', '/updateCustomerAddress');
module.exports = route;

route.use(function(req, res, next) {

  var input = req.body;
  var rules = {
    address_id: Check.that(input.address_id).isInteger(),
    firstname: Check.that(input.address.firstname).isStringType(),
    lastname: Check.that(input.address.lastname).isStringType(),
    middlename: Check.that(input.address.middlename).isOptional(),
    postcode: Check.that(input.address.postcode).isStringType(),
    prefix: Check.that(input.address.prefix).isStringType(),
    suffix: Check.that(input.address.suffix).isStringType(),
    city: Check.that(input.address.city).isStringType(),
    company: Check.that(input.address.company).isStringType(),
    country_id: Check.that(input.address.country_id).isStringType(),
    fax: Check.that(input.address.fax).isStringType(),
    region_id: Check.that(input.address.region_id).isInteger(),
    region: Check.that(input.address.region).isStringType(),
    telephone: Check.that(input.address.telephone).isOptional(),
    street: Check.that(input.address.street).isArrayType(),
    billing_is_default_billing: Check.that(input.address.is_default_billing)
      .isBooleanType(),
    shipping_is_default_shipping: Check.that(input.address.is_default_shipping)
      .isBooleanType()

  };
  appUtils.validateChecks(rules, next);

});

// sanitize input
/* istanbul ignore else */
route.use(function(req, res, next) {
  var address = ["firstname", "lastname", "middlename", "postcode",
    "prefix", "suffix", "city", "company", "country_id", "fax", "region",
    "telephone"
  ];
  /* istanbul ignore else */
  address.forEach(function(item) {
    /* istanbul ignore else */
    if (lodash.has(req.body.address, item)) {
      req.body.address[item] = (req.body.address[item]).trim();
    }
  });

  // sanitize input

  // route.use(function(req, res, next) {
  //
  //
  //   if (lodash.has(req.body.address, 'firstname')) {
  //     req.body.address.firstname = (req.body.address.firstname).trim();
  //   }
  //
  //   if (lodash.has(req.body.address, 'lastname')) {
  //     req.body.address.lastname = (req.body.address.lastname).trim();
  //   }
  //
  //   if (lodash.has(req.body.address, 'middlename')) {
  //     req.body.address.middlename = (req.body.address.middlename).trim();
  //   }
  //
  //   if (lodash.has(req.body.address, 'postcode')) {
  //     req.body.address.postcode = (req.body.address.postcode).trim();
  //   }
  //
  //   if (lodash.has(req.body.address, 'prefix')) {
  //     req.body.address.prefix = (req.body.address.prefix).trim();
  //   }
  //
  //   if (lodash.has(req.body.address, 'suffix')) {
  //     req.body.address.suffix = (req.body.address.suffix).trim();
  //   }
  //
  //   if (lodash.has(req.body.address, 'city')) {
  //     req.body.address.city = (req.body.address.city).trim();
  //   }
  //
  //   if (lodash.has(req.body.address, 'company')) {
  //     req.body.address.company = (req.body.address.company).trim();
  //   }
  //
  //   if (lodash.has(req.body.address, 'country_id')) {
  //     req.body.address.country_id = (req.body.address.country_id).trim();
  //   }
  //
  //   if (lodash.has(req.body.address, 'fax')) {
  //     req.body.address.fax = (req.body.address.fax).trim();
  //   }
  //
  //   if (lodash.has(req.body.address, 'region')) {
  //     req.body.address.region = (req.body.address.region).trim();
  //   }
  //
  //   if (lodash.has(req.body.address, 'telephone')) {
  //     req.body.address.telephone = (req.body.address.telephone).trim();
  //   }

  /* istanbul ignore else */
  if (lodash.has(req.body, 'address')) {
    req.body.customerAddress = {
      "firstname": req.body.address.firstname,
      "lastname": req.body.address.lastname,
      "middlename": req.body.address.middlename,
      "postcode": req.body.address.postcode,
      "prefix": req.body.address.prefix,
      "suffix": req.body.address.suffix,
      "city": req.body.address.city,
      "company": req.body.address.company,
      "country_id": req.body.address.country_id,
      "fax": req.body.address.fax,
      "region_id": req.body.address.region_id,
      "region": req.body.address.region,
      "telephone": req.body.address.telephone,
      "street": req.body.address.street,
      "is_default_billing": req.body.address.is_default_billing,
      "is_default_shipping": req.body.address.is_default_shipping
    };

  }
  next();
});


route.use(function(req, res, next) {
  var input = req.body;
  var address_id = input.address_id;
  var addressData = input.customerAddress;
  CustomerAddressObject.updateCustomerAddress(address_id, addressData,
    function(err, updateAddress) {
      if (err) {
        magentoLoginError.handleError(err, req, res, next,
          api_errors.update_Customer_Address.error_code,
          err.faultString, false);
      } else {
        data = {
          "response": updateAddress
        };

        var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", data);
        return res.json(resp);
      }
    })
});
