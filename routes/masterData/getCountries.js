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
var route = new Route('get', '/getCountries');
module.exports = route;


route.use(function(req, res, next) {
  var input = req.body;
  var store_id = input.store_id;
  MasterData.getCountries(function(err, countries) {
    if (err) {
      magentoLoginError.handleError(err, req, res, next,
        api_errors.get_country_list.error_code,
        err.faultString, false);
      /* istanbul ignore if */
    } else {
      data = {
        "countries": countries
      };
      var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", data);
      return res.json(resp);
    }
  })
});
