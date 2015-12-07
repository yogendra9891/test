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
var route = new Route('post', '/getRegions');
module.exports = route;

// validate input
route.use(function(req, res, next) {
  var input = req.body;
  var rules = {
    country: Check.that(input.country).isNotEmptyOrBlank().isLengthInRange(
      2, 3)
  };
  appUtils.validateChecks(rules, next);

});


route.use(function(req, res, next) {
  var input = req.body;
  var country = input.country;
  MasterData.getRegions(country, function(err, regions) {
    if (err) {
      magentoLoginError.handleError(err, req, res, next,
        api_errors.get_regions.error_code,
        err.faultString, false);
    } else {
      var data = {
        "regions": regions
      };
      var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", data);
      return res.json(resp);
    }
  })
});
