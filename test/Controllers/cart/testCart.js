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
  var cart = {
    "cart_id": ""
  };
  var shippingmethod = {
    "shipping_method": ""
  };
  var paymentmethod = {
    "payment_method": ""
  };
  var order = {
    "order_id": ""
  };

  var Cart = require('../../../Controllers/cart/Cart');
  var CartCustomer = require('../../../Controllers/cart/CartCustomer');
  var Product = require('../../../Controllers/cart/Product');
  var MagentoLoginError = require('../../../helpers/MagentoLoginError');
  var checkMagentoLogin = require('../../../helpers/checkMagentoLogin');
  var apiSuccess = require('../../../libs/core/ApiSuccess');
  var Authutils = require('../../../libs/authUtil');

  // test cases for Constructor
  describe('Constructor', function() {

    it('Should create an instance of cart', function() {
      var cart = new Cart();
      expect(cart).instanceOf(Cart);
    });

    it('Should create an instance of cart', function() {
      var cartCustomer = new CartCustomer();
      expect(cartCustomer).instanceOf(CartCustomer);
    });

    it('Should create an instance of cart', function() {
      var product = new Product();
      expect(product).instanceOf(Product);
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


  describe("Cart", function() {

    //create cart for success
    describe("createCart", function() {
      it('Should create cart', function(done) {
        this.timeout(22000);
        request(app)
        api.post("/createCart")
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
            cart.cart_id = res.body.data.cart_id;
            done();
          });
      });
    });

    //create cart for failure
    describe("Error in create Cart", function() {
      it('It should  get error in creating cart', function(done) {
        this.timeout(20000);
        request(app)
        api.post("/createCart")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.errorId.store_id
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(1001)
            done();
          });
      });
    });

    //add product for success
    describe("addProduct", function() {
      it("It should add product to the cart", function(done) {
        this.timeout(20000);
        request(app)
        api.post("/addProduct")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.quoteId.store_id,
            "cart_id": cart.cart_id,
            "products": [{
              "product_id": storeId.product.product_id,
              "sku": storeId.product.sku,
              "qty": storeId.product.qty
            }]
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(200)
            done();
          });
      });
    });

    // add product for failure
    describe(" Error in add product", function() {
      it("It should  get error in adding product to the cart",
        function(
          done) {
          this.timeout(20000);
          request(app)
          api.post("/addProduct")
            .set('Accept', 'application/json')
            .set('api_key', keys)
            .send({
              "store_id": storeId.errorId.store_id,
              "cart_id": cart.cart_id,
              "products": [{
                "product_id": storeId.product.product_id,
                "sku": storeId.product.sku,
                "qty": storeId.product.qty
              }]
            })
            .expect(200)
            .end(function(err, res) {
              expect(res.body.code).to.equal(1001)
              done();
            });
        });
    });

    //update cart for success
    describe("updateCartProduct", function() {
      it("It should update product to the cart", function(done) {
        this.timeout(20000);
        request(app)
        api.post("/updateCartProduct")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.quoteId.store_id,
            "cart_id": cart.cart_id,
            "products": [{
              "product_id": storeId.product.product_id,
              "sku": storeId.product.sku,
              "qty": storeId.product.qty
            }]
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(200)
            done();
          });
      });
    });

    // update cart for failure
    describe("Error in update Cart Product", function() {
      it("It should  get error in updating product to the cart",
        function(done) {
          this.timeout(20000);
          request(app)
          api.post("/updateCartProduct")
            .set('Accept', 'application/json')
            .set('api_key', keys)
            .send({
              "store_id": storeId.errorId.store_id,
              "cart_id": cart.cart_id,
              "products": [{
                "product_id": storeId.product.product_id,
                "sku": storeId.product.sku,
                "qty": storeId.product.qty
              }]
            })
            .expect(200)
            .end(function(err, res) {
              expect(res.body.code).to.equal(1001)
              done();
            });
        });
    });

    // apply coupon for success
    describe("applyCoupon", function() {
      it("It should apply coupon code on product", function(done) {
        this.timeout(18000);
        request(app)
        api.post("/applyCoupon")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.quoteId.store_id,
            "cart_id": cart.cart_id,
            "coupon_code": "COMEBACK"
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(200)
            done();
          });
      });
    });

    //apply coupon for failure
    describe(" Error in apply Coupon", function() {
      it("It should  error on appling coupon on product", function(done) {
        this.timeout(20000);
        request(app)
        api.post("/applyCoupon")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": 1,
            "cart_id": 780,
            "coupon_code": "COMEeBACK"
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(1081)
            done();
          });
      });
    });

    //remove coupon for success
    describe("removeCoupon", function() {
      it("It should remove coupon from product", function(done) {
        this.timeout(20000);
        request(app)
        api.post("/removeCoupon")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.quoteId.store_id,
            "cart_id": cart.cart_id
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(200)
            done();
          });
      });
    });

    //remove coupon for failure
    describe(" Error in remove Coupon", function() {
      it("It should  get error on eliminating coupon from product",
        function(
          done) {
          this.timeout(20000);
          request(app)
          api.post("/removeCoupon")
            .set('Accept', 'application/json')
            .set('api_key', keys)
            .send({
              "store_id": storeId.errorId.store_id,
              "cart_id": 0
            })
            .expect(200)
            .end(function(err, res) {
              expect(res.body.code).to.equal(200)
              done();
            });
        });
    });

    //create customer for success
    describe("createCustomer", function() {
      it('It should create Customer', function(done) {
        this.timeout(20000);
        request(app)
        api.post("/createCustomer")
          .set('Accept', 'application/json')
          .set('api_key',
            keys
          )
          .send({
            "store_id": 1,
            "fname": "gunjan",
            "lname": "johari",
            "email": "gunjan.johri12" + Date.now() +
              "@daffodilsw.com",
            "password": "123456"
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(200);
            done();
          });
      });
    });

    //create customer for failure
    describe("Error in create Customer", function() {
      it('It should get errors in creating Customers', function(done) {
        this.timeout(20000);
        request(app)
        api.post("/createCustomer")
          .set('Accept', 'application/json')
          .set('api_key',
            keys
          )
          .send({
            "store_id": 1,
            "fname": "gunjan",
            "lname": "johari",
            "email": "gunjan.johri6@daffodilsw.com",
            "password": "123456"
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(100);
            done();
          });
      });
    });

    //update customer for success
    describe("updateCustomer", function() {
      it('It should update Customer', function(done) {
        this.timeout(23000);
        request(app)
        api.post("/updateCustomer")
          .set('Accept', 'application/json')
          .set('api_key',
            keys
          )
          .send({
            "store_id": 1,
            "customer_id": 637,
            "fname": "gunjan",
            "lname": "johari",
            "email": "gunjan.johri" + Date.now() +
              "@daffodilsw.com",
            "dob": "1732"
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.data.response).to.equal(
              true);
            done();
          });
      });
    });

    //update customer for failure
    describe(" Error in update Customer", function() {
      it('It should get errors in updating Customer', function(done) {
        this.timeout(23000);
        request(app)
        api.post("/updateCustomer")
          .set('Accept', 'application/json')
          .set('api_key',
            keys
          )
          .send({
            "store_id": 1,
            "customer_id": 63756467474676,
            "fname": "gunjan",
            "lname": "johari",
            "email": "gunjan.johri" + Date.now() +
              "@daffodilsw.com",
            "dob": "1732"
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(636);
            done();
          });
      });
    });

    //set customer to cart for success
    describe("setCustomer", function() {
      it("It should set customer", function(done) {
        this.timeout(20000);
        request(app)
        api.post("/setCustomer")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.quoteId.store_id,
            "cart_id": cart.cart_id,
            "customer": {
              "customer_id": 637,
              "fname": "ankit",
              "lname": "jain",
              "email": "gunjan.johri" + Date.now() +
                "@daffodilsw.com",
              "mob": "9467536008",
              "mode": "guest"
            }
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(200)
            done();
          });
      });
    });

    // set customer to cart for failure
    describe("Error in set Customer", function() {
      it("It should get errors in setting customer", function(done) {
        this.timeout(20000);
        request(app)
        api.post("/setCustomer")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.errorId.store_id,
            "cart_id": cart.cart_id,
            "customer": {
              "customer_id": 637,
              "fname": "ankit",
              "lname": "jain",
              "email": "gunjan.johri" + Date.now() +
                "@daffodilsw.com",
              "mob": "9467536008",
              "mode": "guest"
            }
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(1001)
            done();
          });
      });
    });

    //set customer address for success
    describe("setCartAddress", function() {
      it("It should set cart address", function(
        done) {
        this.timeout(20000);
        request(app)
        api.post("/setCartAddress")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.quoteId.store_id,
            "cart_id": cart.cart_id,
            "shipping_address": {
              "fname": "abhishek",
              "lname": "jain",
              "street": "test",
              "region": "AS",
              "region_id": 3,
              "city": "test",
              "country": "US",
              "mob": "9756051144",
              "type": "shipping",
              "postcode": "1234",
              "is_default_billing": false,
              "is_default_shipping": true
            },
            "billing_address": {
              "fname": "yogendra",
              "lname": "jain",
              "street": "test",
              "region": "AS",
              "region_id": 3,
              "city": "test",
              "country": "US",
              "mob": "9891508595",
              "type": "billing",
              "postcode": "24430",
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

    //set customer address for failure
    describe("Error in set Cart Address", function() {
      it("It should get errors in setting cart address", function(
        done) {
        this.timeout(20000);
        request(app)
        api.post("/setCartAddress")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": 1,
            "cart_id": 830564655757657,
            "shipping_address": {
              "fname": "abhishek",
              "lname": "jain",
              "street": "test",
              "region": "AS",
              "region_id": 3,
              "city": "test",
              "country": "US",
              "mob": "9756051144",
              "type": "shipping",
              "postcode": "1234",
              "is_default_billing": false,
              "is_default_shipping": true
            },
            "billing_address": {
              "fname": "yogendra",
              "lname": "jain",
              "street": "test",
              "region": "AS",
              "region_id": 3,
              "city": "test",
              "country": "US",
              "mob": "9891508595",
              "type": "billing",
              "postcode": "24430",
              "is_default_billing": false,
              "is_default_shipping": true
            }
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(636)
            done();
          });
      });
    });

    //get payment method for success
    describe("getpaymentMethod", function() {
      it("It should  get payment method",
        function(
          done) {
          this.timeout(20000);
          request(app)
          api.post("/getPaymentMathods")
            .set('Accept', 'application/json')
            .set('api_key', keys)
            .send({
              "store_id": storeId.quoteId.store_id,
              "cart_id": cart.cart_id
            })
            .expect(200)
            .end(function(err, res) {
              expect(res.body.code).to.equal(200)
              paymentmethod.payment_method = res.body.data.paymentMathods[
                0].code;
              done();
            });
        });
    });

    //get payment method for failure
    describe("Error in get payment Method", function() {
      it("It should  get error in getting payment method", function(
        done) {
        this.timeout(20000);
        request(app)
        api.post("/getPaymentMathods")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.errorId.store_id,
            "cart_id": cart.cart_id
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(1001)
            done();
          });
      });
    });

    //set payment method for success
    describe("setpaymentMethod", function() {
      it("It should  set payment method",
        function(
          done) {
          this.timeout(20000);
          request(app)
          api.post("/setPaymentMethod")
            .set('Accept', 'application/json')
            .set('api_key', keys)
            .send({
              "store_id": storeId.quoteId.store_id,
              "cart_id": cart.cart_id,
              "payment_method": paymentmethod.payment_method
            })
            .expect(200)
            .end(function(err, res) {
              expect(res.body.code).to.equal(200)
              done();
            });
        });
    });

    //set payemnt method for failure
    describe("Error in set payment Method", function() {
      it("It should get errors in setting payment method", function(
        done) {
        this.timeout(20000);
        request(app)
        api.post("/setPaymentMethod")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": 1,
            "cart_id": 830564655757657,
            "payment_method": paymentmethod.payment_method
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(636)
            done();
          });
      });
    });

    // get shipping method for success
    describe("getShippingMethod", function() {
      it("It should retrieve shipping method", function(
        done) {
        this.timeout(20000);
        request(app)
        api.post("/getShippingMathods")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.quoteId.store_id,
            "cart_id": cart.cart_id
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(200)
            shippingmethod.shipping_method = res.body.data.shippingMathods[
              0].code;
            done();
          });
      });
    });

    //get shipping method for failure
    describe("Error in get Shipping Method", function() {
      it("It should get error in retrieving shipping method", function(
        done) {
        this.timeout(20000);
        request(app)
        api.post("/getShippingMathods")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.errorId.store_id,
            "cart_id": cart.cart_id
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(1001)
            done();
          });
      });
    });

    //set shipping method for success
    describe("setShippingMethod", function() {
      it("It should set shipping method", function(
        done) {
        this.timeout(20000);
        request(app)
        api.post("/setShippingMethod")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.quoteId.store_id,
            "cart_id": cart.cart_id,
            "shipping_method": shippingmethod.shipping_method
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(200)
            done();
          });
      });
    });

    //set shipping method for failure
    describe(" Error in set Shipping Method", function() {
      it("It should  get error in setting shipping method",
        function(
          done) {
          this.timeout(20000);
          request(app)
          api.post("/setShippingMethod")
            .set('Accept', 'application/json')
            .set('api_key', keys)
            .send({
              "store_id": storeId.errorId.store_id,
              "cart_id": cart.cart_id,
              "shipping_method": shippingmethod.shipping_method
            })
            .expect(200)
            .end(function(err, res) {
              expect(res.body.code).to.equal(1001)
              done();
            });
        });
    });

    // place order for success
    describe("placeOrder", function() {
      it('It should place orders', function(done) {
        this.timeout(35000);
        request(app)
        api.post("/placeOrder")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.quoteId.store_id,
            "cart_id": cart.cart_id
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(200)
            order.order_id = res.body.data.order_id;
            done();
          });
      });
    });

    // place order for failure
    describe("Error in place Order", function() {
      it('It should get error in placing orders', function(done) {
        this.timeout(35000);
        request(app)
        api.post("/placeOrder")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.errorId.store_id,
            "cart_id": cart.cart_id

          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(1001)
            done();
          });
      });
    });

    //order details for success
    describe("orderDetails", function() {
      it('It should get details orders', function(done) {
        this.timeout(20000);
        request(app)
        api.post("/getOrderDetails")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.quoteId.store_id,
            "customer_id": 637,
            "order_id": parseInt(order.order_id)
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(200)
            done();
          });
      });
    });

    //order details for failure
    describe("Error in order Details", function() {
      it('It should get errors in getting details orders', function(
        done) {
        this.timeout(20000);
        request(app)
        api.post("/getOrderDetails")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": 1,
            "customer_id": 0,
            "order_id": 10000210
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(100)
            done();
          });
      });
    });

    //list order for success
    describe("listOrder", function() {
      it('It should get list of orders', function(done) {
        this.timeout(20000);
        request(app)
        api.post("/getOrderList")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.quoteId.store_id,
            "customer_id": storeId.customer.customer_id
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(200)
            done();
          });
      });
    });

    //list order for failure
    describe("Error in list Order", function() {
      it('It should get error in listing of orders', function(done) {
        this.timeout(20000);
        request(app)
        api.post("/getOrderList")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.errorId.store_id,
            "customer_id": 4343423424
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(636)
            done();
          });
      });
    });

    //cart details for success
    describe("cartDetails", function() {
      it('It should contains details of cart', function(done) {
        this.timeout(20000);
        request(app)
        api.post("/cartDetails")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.quoteId.store_id,
            "cart_id": cart.cart_id
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(200)
            done();
          });
      });
    });

    //cart details for failure
    describe(" Error in cart Details", function() {
      it('It should contains details of cart', function(done) {
        this.timeout(20000);
        request(app)
        api.post("/cartDetails")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.errorId.store_id,
            "cart_id": cart.cart_id
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(1001)
            done();
          });
      });
    });

    //delete product for success
    describe("deleteProduct", function() {
      it("It should delete product to the cart", function(done) {
        this.timeout(20000);
        request(app)
        api.post("/deleteCartProduct")
          .set('Accept', 'application/json')
          .set('api_key', keys)
          .send({
            "store_id": storeId.quoteId.store_id,
            "cart_id": cart.cart_id,
            "products": [{
              "product_id": storeId.product.product_id,
              "sku": storeId.product.sku,
              "qty": storeId.product.qty
            }]
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.body.code).to.equal(200)
            done();
          });
      });
    });

    //delete product for failure
    describe(" Error in delete Product", function() {
      it("It should  get error in deleting product from the cart",
        function(done) {
          this.timeout(20000);
          request(app)
          api.post("/deleteCartProduct")
            .set('Accept', 'application/json')
            .set('api_key', keys)
            .send({
              "store_id": storeId.errorId.store_id,
              "cart_id": cart.cart_id,
              "products": [{
                "product_id": storeId.product.product_id,
                "sku": storeId.product.sku,
                "qty": storeId.product.qty
              }]
            })
            .expect(200)
            .end(function(err, res) {
              expect(res.body.code).to.equal(1001)
              done();
            });
        });
    });
  });
