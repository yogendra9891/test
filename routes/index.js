/* istanbul ignore next*/
var Route = require('../libs/core/Route');
//var helpers = require('../../helpers');
var Check = require('../libs/core/Check');
var appUtils = require('../libs/appUtils');
var ApiException = require('../libs/core/ApiException');

// define route
var route = new Route('post', '/hello');
module.exports = route;

// validate input
/* istanbul ignore next */
route.use(function(req, res, next) {
  var input = req.body;


  var rules = {
    //device_type: Check.that(input.device_type).isOptional(),
    device_id: Check.that(input.device_id).isNotEmptyOrBlank()
  };
  appUtils.validateChecks(rules, next);

});

/* istanbul ignore next */
route.use(function(req, res, next) {
  var input = req.body;


  res.json('hello');
});
