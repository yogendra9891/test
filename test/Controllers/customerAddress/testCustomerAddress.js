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
  var address = {
    "address_id": ""
  };
  var CustomerAddress = require('../../../Controllers/customer/customerAddress');
  var MagentoLoginError = require('../../../helpers/MagentoLoginError');
  var checkMagentoLogin = require('../../../helpers/checkMagentoLogin');
  var apiSuccess = require('../../../libs/core/ApiSuccess');
  var Authutils = require('../../../libs/authUtil');

  // test cases for constructor
  describe('Constructor', function() {

    it('Should create an instance of cart', function() {
      var customer = new CustomerAddress();
      expect(customer).instanceOf(CustomerAddress);
    });

    it('Should create an instance of Magento Login Error', function() {
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

  describe("Customer", function() {

    // create customer address for success
    describe("AddNewCustomerAddress", function() {
      it('Should create new customer Address', function(done) {
        this.timeout(31000);
        request(app)
        api.post("/addNewCustomerAddress")
          .set('Accept', 'application/json')
          .set('api_key',
            keys
          )
          .send({
            "customer_id": 637,
            "address": {
              "firstname": "abhishek",
              "lastname": "kumar",
              "middlename": "dvdvfdv",
              "postcode": "244304",
              "prefix": "Mr.",
              "suffix": "abc",
              "city": "delhi",
              "company": "Google",
              "country_id": "IN",
              "fax": "abc",
              "region_id": 497,
              "region": "Haryana",
              "telephone": "9837326376",
              "street": ["sec-15"],
              "is_default_billing": false,
              "is_default_shipping": true
            }
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.data.response).to.equal(true)
            done();
          });
      });
    });
    // create customer address for failure
    describe("Error in Customer Address", function() {
      it('It should get error in creating customer Address',
        function(
          done) {
          this.timeout(21000);
          request(app)
          api.post("/addNewCustomerAddress")
            .set('Accept', 'application/json')
            .set('api_key',
              keys
            )
            .send({
              "customer_id": 0,
              "address": {
                "firstname": "abhishek",
                "lastname": "kumar",
                "middlename": "dvdvfdv",
                "postcode": "244304",
                "prefix": "Mr.",
                "suffix": "",
                "city": "gurgaon",
                "company": "Google",
                "country_id": "IN",
                "fax": "abc",
                "region_id": 497,
                "region": "Haryana",
                "telephone": "9837326376",
                "street": ["sec-15"],
                "is_default_billing": false,
                "is_default_shipping": true
              }
            })
            .expect(200)
            .end(function(err, res) {
              expect(res.body.code).to.equal(200)
              done();
            });
        });
    });

    // customer address list for success
    describe("getAddressList", function() {
      it('It should get  address list', function(done) {
        this.timeout(20000);
        request(app)
        api.post("/customerAddressList")
          .set('Accept', 'application/json')
          .set('api_key',
            keys
          )
          .send({
            "customer_id": 637
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(200);
            address.address_id = res.body.data.address[0].customer_address_id;
            done();
          });
      });
    });

    // customer address list for failure
    describe("Error in Address List", function() {
      it('It should get error in address list', function(done) {
        this.timeout(20000);
        request(app)
        api.post("/customerAddressList")
          .set('Accept', 'application/json')
          .set('api_key',
            keys
          )
          .send({
            "customer_id": 0
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(200)
            done();
          });
      });
    });

    // update customer address for succcess
    describe("updateCustomerAddress", function() {
      it('It should update customer Address', function(done) {
        this.timeout(20000);
        request(app)
        api.post("/updateCustomerAddress")
          .set('Accept', 'application/json')
          .set('api_key',
            keys
          )
          .send({
            "address_id": parseInt(address.address_id),
            "address": {
              "firstname": "abhishek",
              "lastname": "kumar",
              "middlename": "dvdvfdv",
              "postcode": "244304",
              "prefix": "Mr.",
              "suffix": "",
              "city": "gurgaon",
              "company": "Google",
              "country_id": "IN",
              "fax": "abc",
              "region_id": 497,
              "region": "Haryana",
              "telephone": "9837326376",
              "street": ["sec-15"],
              "is_default_billing": false,
              "is_default_shipping": true
            }
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(200)
            done();
          });
      });
    });

    // update customer address for failure
    describe("Error in update Customer Address", function() {
      it('It should  get error in updating customer Address',
        function(
          done) {
          this.timeout(20000);
          request(app)
          api.post("/updateCustomerAddress")
            .set('Accept', 'application/json')
            .set('api_key',
              keys
            )
            .send({
              "address_id": 0,
              "address": {
                "firstname": "abhishek",
                "lastname": "kumar",
                "middlename": "dvdvfdv",
                "postcode": "244304",
                "prefix": "Mr.",
                "suffix": "cfv",
                "city": "gurgaon",
                "company": "Google",
                "country_id": "IN",
                "fax": "abc",
                "region_id": 497,
                "region": "Haryana",
                "telephone": "9837326376",
                "street": ["sec-15"],
                "is_default_billing": false,
                "is_default_shipping": true
              }
            })
            .expect(200)
            .end(function(err, res) {
              expect(res.body.code).to.equal(200)
              done();
            });
        });
    });

    // delete customer address for success
    describe("deleteCustomerAddress", function() {
      it('It should delete customer Address', function(done) {
        this.timeout(19000);
        request(app)
        api.post("/deleteCustomerAddress")
          .set('Accept', 'application/json')
          .set('api_key',
            keys
          )
          .send({
            "address_id": parseInt(address.address_id)
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.data.response).to.equal(true);
            done();
          });
      });
    });

    // delete customer address for failure
    describe("Error in delete customer address", function() {
      it('It should  get error in deleting customer Address',
        function(
          done) {
          this.timeout(19000);
          request(app)
          api.post("/deleteCustomerAddress")
            .set('Accept', 'application/json')
            .set('api_key',
              keys
            )
            .send({
              "address_id": 0
            })
            .expect(200)
            .end(function(err, res) {
              expect(res.body.code).to.equal(200);
              done();
            });
        });
    });
  });
