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
var route = new Route('get', '/getCategoryList/:id');
module.exports = route;


route.use(function(req, res, next) {
  var input = req.body;
  var store_id = input.store_id;
  var cat_id = req.params.id; //getting from url
  MasterData.getCategoryList(cat_id, function(err, categories) {
    if (err) {
      magentoLoginError.handleError(err, req, res, next,
        api_errors.get_category_list.error_code,
        err.faultString, false);
      /* istanbul ignore if */
    } else {
      data = {
        "categories": categories
      };
      var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", data);
      return res.json(resp);
    }
  })
});
