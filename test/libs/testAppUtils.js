var expect = require('chai').expect;
var describe = require('mocha').describe;
var it = require('mocha').it;
var proxyquire = require('proxyquire').noPreserveCache();
var sinon = require('sinon');
var ApiException = require('../../libs/core/ApiException');

/**
 * Tests for /libs/appUtils.js
 */
describe('appUtils',function(){
    var check = {};

    var appUtils = proxyquire('../../libs/appUtils',{'../libs/core/Check':check});


    it('Should define Numerical and Alphanumerical constants',function(){
        expect(appUtils.NUMERIC).to.be.a('String');
        expect(appUtils.ALPHANUMERIC).to.be.a('String');
    });

    it('Should define hash iteration constant.',function(){
        expect(appUtils.HASH_ITERATIONS).to.be.a('Number');
    });

    describe('randomFrom',function(){

        it('requires input string to be non empty.',function(){
            expect(function(){appUtils.randomFrom('',1);}).to.throw(Error);
            expect(function(){appUtils.randomFrom(null,1);}).to.throw(Error);
            expect(function(){appUtils.randomFrom('a',1);}).to.not.throw();
        });

        it('requires input length to be  > 0.',function(){
            expect(function(){appUtils.randomFrom('a','a');}).to.throw(Error);
            expect(function(){appUtils.randomFrom('a',0);}).to.throw(Error);
            expect(function(){appUtils.randomFrom('a',-1);}).to.throw(Error);
            expect(function(){appUtils.randomFrom('a',1);}).to.not.throw();
        });

        it('Should create a random string of given length, from given input.',function(){
            expect(appUtils.randomFrom('abc',3)).to.be.a('String');
            expect(appUtils.randomFrom('abc',2)).to.match(/[abc]{2}/);
        });

    });

    describe('validateChecks',function(){

        it('Requires rules parameter to be a plain object,',function(){
            expect(function(){appUtils.validateChecks('a',function(){});}).to.throw(Error);
            expect(function(){appUtils.validateChecks(null,function(){});}).to.throw(Error);
            expect(function(){appUtils.validateChecks({},function(){});}).to.not.throw();
        });

        it('Requires next parameter to be a function,',function(){
            expect(function(){appUtils.validateChecks({},{});}).to.throw(Error);
            expect(function(){appUtils.validateChecks({},null);}).to.throw(Error);
            expect(function(){appUtils.validateChecks({},function(){});}).to.not.throw();
        });

        it('Should collect errors using Check.js from given rules.',function(){
            check.collectErrorMessages = sinon.stub().returns(['a','b']);
            var rules = {};
            appUtils.validateChecks(rules,sinon.spy());

            sinon.assert.calledWith(check.collectErrorMessages,rules);
        });

        it('Should call next with an INVALID INPUT ApiException with errors collected as details.',function(){
            check.collectErrorMessages = sinon.stub().returns(['a','b']);
            var rules = {};
            var next = sinon.spy();
            appUtils.validateChecks(rules,next);

            sinon.assert.calledWith(next,sinon.match.instanceOf(ApiException));

            arg = next.getCall(0).args[0];

            expect(arg.errorCode).to.be.equal(ApiException.EC_BAD_REQUEST);
            expect(arg.httpCode).to.be.equal(ApiException.SC_BAD_REQUEST);
            expect(arg.details).to.be.deep.equal(['a','b']);

        });

        it('should call next without any error if no errors are collected.',function(){
            check.collectErrorMessages = sinon.stub().returns([]);
            var rules = {};
            var next = sinon.spy();
            appUtils.validateChecks(rules,next);

            sinon.assert.calledOnce(next);
            sinon.assert.neverCalledWith(next,sinon.match.any);
        });
    });

    describe('ensureId',function(){

        it('throws if input cannot be converted to an integer.',function(){
            expect(function(){appUtils.ensureId('a');}).to.throw(Error);
            expect(function(){appUtils.ensureId(null);}).to.throw(Error);
            expect(function(){appUtils.ensureId(undefined);}).to.throw(Error);
            expect(function(){appUtils.ensureId(NaN);}).to.throw(Error);
            expect(function(){appUtils.ensureId(123);}).to.not.throw();
            expect(function(){appUtils.ensureId('123');}).to.not.throw();
        });

        it('Converts input to an integer.',function(){
            expect(appUtils.ensureId(123)).to.be.equal(123);
            expect(appUtils.ensureId('123')).to.be.equal(123);
            expect(appUtils.ensureId(123.01)).to.be.equal(123);
            expect(appUtils.ensureId('123.01')).to.be.equal(123);
        });
    });

    describe('hashPassword and matchPassword',function(){

        it('Should hash and match a password correctly.',function(){

            this.timeout(5000); // bcrypt is intentionally made slower

            var pass = 'horse_staple_battery';
            var hash = appUtils.hashPassword(pass);

            // hash created
            expect(hash).to.be.a('String');

            // match
            expect(appUtils.matchPassword(hash,pass)).to.be.true;

            // no match
            expect(appUtils.matchPassword(hash,'xkcd')).to.be.false;
        });
    });
});