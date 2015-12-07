var expect = require('chai').expect;
var should = require('chai').should();
var request = require('supertest');
var app = require('../../../app').app;
var config = require('config');
var proxyquire = require('proxyquire').noPreserveCache();
var magentoObj = require('../../../assets/magentoobj');
var magento = magentoObj.magento;
var host = config.get("server.host");
var port = config.get("server.port");
var route_prefix = config.get("server.route_prefix");
var routes = host + ":" + port + route_prefix;
var keys = config.get("api_keys.web");
var api = request(routes);
var storeId = require("../../testData");
var MasterData = require('../../../Controllers/masterData/MasterData');
var MagentoLoginError = require('../../../helpers/MagentoLoginError');
var checkMagentoLogin = require('../../../helpers/checkMagentoLogin');
var apiSuccess = require('../../../libs/core/ApiSuccess');
var Authutils = require('../../../libs/authUtil');


// test cases for Constructor
describe('Constructor', function() {

  it('Should create an instance of cart', function() {
    var master = new MasterData();
    expect(master).instanceOf(MasterData);
  });

  it('Should create an instance of MagentoLogin', function() {
    var magentoLoginError = new MagentoLoginError();
    expect(magentoLoginError).instanceOf(MagentoLoginError);
  });

  it('Should create an instance of check Magento Login', function() {
    var MagentoLogin = new checkMagentoLogin();
    expect(MagentoLogin).instanceOf(checkMagentoLogin);
  });

  it('Should create an instance of Api Success', function() {
    var ApiSuccess = new apiSuccess();
    expect(ApiSuccess).instanceOf(apiSuccess);
  });
  it('Should create an instance of authUtil', function() {
    var authutil = new Authutils();
    expect(authutil).instanceOf(Authutils);
  });
});


describe("masterData", function() {

  // get categories for list for success
  describe("getCategoriesList", function() {
    it('Should get categories list', function(done) {
      this.timeout(35000);
      request(app)
      api.get("/getCategoryList")
        .set('Accept', 'application/json')
        .set('api_key',
          keys
        )
        .send({
          "store_id": storeId.quoteId.store_id
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.code).to.equal(200)
          done();
        });
    });
  });

  // get categories list for failure
  describe(" Error in get Categories List", function() {
    it('Should get errors in categories list', function(done) {
      this.timeout(24000);
      request(app)
      api.post("/getCategoryList")
        .set('Accept', 'application/json')
        .set('api_key',
          keys
        )
        .send({
          "store_id": storeId.errorId.store_id
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.code).to.equal(200)
          done();
        });
    });
  });

  // get countries for success
  describe("getCountries", function() {
    it('Should get list of countries', function(done) {
      this.timeout(35000);
      request(app)
      api.get("/getCountries")
        .set('Accept', 'application/json')
        .set('api_key',
          keys
        )
        .send({
          "store_id": storeId.quoteId.store_id
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.code).to.equal(200)
          done();
        });
    });
  });

  // get countries for failure
  describe("Error in get Countries", function() {
    it('Should get errors in listing of countries', function(done) {
      this.timeout(24000);
      request(app)
      api.post("/getCountries")
        .set('Accept', 'application/json')
        .set('api_key',
          keys
        )
        .send({
          "store_id": storeId.errorId.store_id
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.code).to.equal(200)
          done();
        });
    });
  });

  // get regions for success
  describe("getRegions", function() {
    it('Should get list of regions', function(done) {
      this.timeout(35000);
      request(app)
      api.post("/getRegions")
        .set('Accept', 'application/json')
        .set('api_key',
          keys
        )
        .send({
          "country": "Us"
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.code).to.equal(200)
          done();
        });
    });
  });

  // get regions for failure
  describe("Error in get Regions", function() {
    it('Should get error in listing of regions', function(done) {
      this.timeout(24000);
      request(app)
      api.post("/getRegions")
        .set('Accept', 'application/json')
        .set('api_key',
          keys
        )
        .send({
          "country": "Uss"
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.code).to.equal(101)
          done();
        });
    });
  });
});
