var expect = require('chai').expect;
var describe = require('mocha').describe;
var it = require('mocha').it;
var util = require('util');
var lodash = require('lodash');
var sinon = require('sinon');

/**
 * Tests for /libs/core/Check.js
 */
describe('Check',function(){

    var Check = require('../../../libs/core/Check');

    describe('Constructor',function(){

        it('Should create an instance of Check, properties initialized.',function(){
            var check = new Check('value');
            expect(check).to.be.instanceOf(Check);
            expect(check.errors).to.be.an('Array');
            expect(check.val).to.be.equal('value');

            // errors recorded by default
            expect(check.recordErrors).to.be.true;
        });


    });

    describe('Check.that',function(){
        it('Should create an instance of Check, with provided value.',function(){
            var check = Check.that('value');
            expect(check).to.be.instanceOf(Check);
            expect(check.errors).to.be.an('Array');
            expect(check.val).to.be.equal('value');

            // errors recorded by default
            expect(check.recordErrors).to.be.true;
        });
    });

    describe('resolve',function(){

        it('Should require Boolean, String as parameters.',function(){
            var check = Check.that('value');
            expect(function(){check.resolve();}).to.throws(Error);
            expect(function(){check.resolve(1,null);}).to.throws(Error);
            expect(function(){check.resolve('a','a');}).to.throws(Error);
            expect(function(){check.resolve(true,null);}).to.throws(Error);
        });

        it('Should by default collect given error if valid parameter is false.',function(){
            var check = Check.that('value');

            expect(check.errors).to.be.deep.equal([]);

            check.resolve(false,'error_message');

            expect(check.errors).to.be.deep.equal(['error_message']);
        });

        it('Should by default NOT collect given error if valid parameter is false.',function(){
            var check = Check.that('value');

            expect(check.errors).to.be.deep.equal([]);

            check.resolve(true,'error_message');

            expect(check.errors).to.be.deep.equal([]);
        });

        it('Should NEVER collect given error if recordErrors property is false.',function(){
            var check = Check.that('value');

            check.recordErrors = false;

            expect(check.errors).to.be.deep.equal([]);

            check.resolve(true,'error_message');
            check.resolve(false,'error_message');

            expect(check.errors).to.be.deep.equal([]);
        });

    });

    describe('collectErrorMessages',function(){

        it('Should require input parameter to be a plain object.',function(){
            expect(function(){Check.collectErrorMessages('a');}).to.throws(Error);
            expect(function(){Check.collectErrorMessages(123);}).to.throws(Error);
            expect(function(){Check.collectErrorMessages([]);}).to.throws(Error);
            expect(function(){Check.collectErrorMessages(new Check('a'));}).to.throws(Error);
        });

        it('Should collect errors from all properties of given object that are Check instances.',function(){

            var check1 = Check.that('value');
            check1.errors = ['msg11','msg12'];

            var check2 = Check.that('value');
            check2.errors = ['msg21'];

            var rules = {
                key1:check1,
                key2:check2,
                key3:{} // not a check instance
            };

            var errors = Check.collectErrorMessages(rules);

            expect(errors).to.be.an("Array");
            expect(errors).to.be.deep.equal([{field:'key1',errors:check1.errors},{field:'key2',errors:check2.errors}]);

        });

    });

    describe('is.ok',function(){
        it('Should return true if no errors collected, false otherwise.',function(){
            var check = new Check('value');
            var is = check.is();
            expect(is).to.be.an('Object');
            expect(is.ok).to.be.a('function');

            // no errors
            expect(is.ok()).to.be.true;

            check.errors.push('error1');

            // has errors
            expect(is.ok()).to.be.false;
        });
    });

    describe('assert.ok',function(){
        it('Should throw an Error with collected messages if there ARE errors, otherwise do nothing.',function(){
            var check = new Check('value');
            var ca = check.assert();
            expect(ca).to.be.an('Object');
            expect(ca.ok).to.be.a('function');

            // no errors
            expect(function(){ca.ok();}).to.not.throw();

            check.errors.push('error1');

            // has errors
            expect(function(){ca.ok();}).to.throws(Error);
        });
    });

    describe('isOptional',function(){

        it('Should set recordErrors property to false if check value is null or undefined.',function(){

            // ---------value not null------------
            var check = new Check('value');

            // errors recorded by default
            expect(check.recordErrors).to.be.true;

            check.isOptional();

            // errors should be still recorded because value is not null or undefined
            expect(check.recordErrors).to.be.true;

            // -----------value is null-----------
            var check1 = new Check(null);

            // errors recorded by default
            expect(check1.recordErrors).to.be.true;

            check1.isOptional();

            // errors should  not be recorded because value is null
            expect(check1.recordErrors).to.be.false;

            // -----------value is undefined-----------
            var check2 = new Check();

            // errors recorded by default
            expect(check2.recordErrors).to.be.true;

            check2.isOptional();

            // errors should  not be recorded because value is undefined
            expect(check2.recordErrors).to.be.false;
        });

    });

    //------------- test validations -----------------

    describe('isMatch',function(){

        it('Requires test pattern to be a Regex.',function(){
            var check = Check.that('abc');

            expect(function(){check.isMatch();}).to.throw(Error);
            expect(function(){check.isMatch('abc','msg');}).to.throw(Error);
            expect(function(){check.isMatch(null,'msg');}).to.throw(Error);
        });

        it('Requires message to be a String.',function(){
            var check = Check.that('abc');

            expect(function(){check.isMatch(/a/);}).to.throw(Error);
            expect(function(){check.isMatch(/a/,null);}).to.throw(Error);
            expect(function(){check.isMatch(/a/,123);}).to.throw(Error);
        });

        it('Should test check values against a regex, and call resolve accordingly.',function(){

            var check = Check.that('alphabet');
            check.resolve = sinon.spy(check.resolve);

            // pass
            check.isMatch(/a\w+/,'msg');
            sinon.assert.calledWith(check.resolve,true,'msg');

            // fail
            check.resolve.reset();
            check.isMatch(/abc/,'msg');
            sinon.assert.calledWith(check.resolve,false,'msg');
        })

    });

    describe('isStringType',function(){

        it('Should check for input being string type.',function(){
            var check = Check.that('alphabet');
            check.resolve = sinon.spy(check.resolve);

            // pass
            check.isStringType();
            sinon.assert.calledWith(check.resolve,true);

            // fail
            [null,{},[],1234].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isStringType();
                sinon.assert.calledWith(check.resolve,false,sinon.match.string);
            });

        });

    });

    describe('isNumberType',function(){
        it('Should check for input being number type.',function(){
            var check = Check.that(123);
            check.resolve = sinon.spy(check.resolve);

            // pass
            check.isNumberType();
            sinon.assert.calledWith(check.resolve,true);

            // fail
            [null,{},[],'1234'].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isNumberType();
                sinon.assert.calledWith(check.resolve,false,sinon.match.string);
            });

        });
    });

    describe('isBooleanType',function(){
        it('Should check for input being Boolean type.',function(){

            var check = null;

            // pass
            [true,false].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isBooleanType();
                sinon.assert.calledWith(check.resolve,true);
            });


            // fail
            [null,{},[],'1234',1234].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isBooleanType();
                sinon.assert.calledWith(check.resolve,false,sinon.match.string);
            });

        });
    });

    describe('isInteger',function(){
        it('Should check for input being an Integer.',function(){

            var check = null;

            // pass
            [1,0,-1].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isInteger();
                sinon.assert.calledWith(check.resolve,true);
            });


            // fail
            [null,{},[],'12.34','123',12.34].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isInteger();
                sinon.assert.calledWith(check.resolve,false,sinon.match.string);
            });

        });
    });

    describe('isEnum',function(){

        it('Requires enum parameter to be an Array.',function(){
            var check = Check.that('a');
            expect(function(){check.isEnum();}).to.throw(Error);
            expect(function(){check.isEnum({});}).to.throw(Error);
            expect(function(){check.isEnum(null);}).to.throw(Error);
            expect(function(){check.isEnum('a');}).to.throw(Error);
        });

        it('Should check for input being one of provided values.',function(){

            var check = null;

            // pass
            ['a',0,null].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isEnum(['a',0,null,4]);
                sinon.assert.calledWith(check.resolve,true);
            });


            // fail
            [44,false,undefined,'12'].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isEnum([55,true,null]);
                sinon.assert.calledWith(check.resolve,false,sinon.match.string);
            });

        });
    });

    describe('isDate',function(){
        it('Should check for input being parse-able to a date.',function(){

            var check = null;

            // pass
            [0,'27-Aug-2000',new Date(),1442913175004,-1000].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isDate();
                sinon.assert.calledWith(check.resolve,true);
            });


            // fail
            [null,{},[],'12-days',NaN,999999999999999999].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isDate();
                sinon.assert.calledWith(check.resolve,false,sinon.match.string);
            });

        });
    });

    describe('isNotEmptyOrBlank',function(){
        it('Should check for input to pass as a string with at least some non white-space text.',function(){

            var check = null;

            // pass
            ['a','  a  ','\t a \n'].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isNotEmptyOrBlank();
                sinon.assert.calledWith(check.resolve,true);
            });


            // fail
            [null,{},[],123,' ', '\t',""].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isNotEmptyOrBlank();
                sinon.assert.calledWith(check.resolve,false,sinon.match.string);
            });

        });
    });

    describe('isBsonObjectId',function(){
        it('Should check for input being parse-able to a BSON object id.',function(){

            var check = null;

            // pass
            ['507f1f77bcf86cd799439011','507f1f77bcfa'].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isBsonObjectId();
                sinon.assert.calledWith(check.resolve,true);
            });


            // fail
            [null,{},[],'abc',undefined,'123drt4df566gvv'].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isBsonObjectId();
                sinon.assert.calledWith(check.resolve,false,sinon.match.string);
            });

        });
    });

    describe('isNeoId',function(){
        it('Should check for input being a NeoDB node id.',function(){

            var check = null;

            // pass
            ['123456',12345].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isNeoId();
                sinon.assert.calledWith(check.resolve,true);
            });


            // fail
            [null,{},[],'abc',undefined,'123drt4df566gvv','abc','1.2',4.3].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isNeoId();
                sinon.assert.calledWith(check.resolve,false,sinon.match.string);
            });

        });
    });

    describe('isArrayType',function(){
        it('Should check for input being an Array.',function(){

            var check = null;

            // pass
            [[],['a',1]].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isArrayType();
                sinon.assert.calledWith(check.resolve,true);
            });


            // fail
            [null,{},'abc',undefined,123].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isArrayType();
                sinon.assert.calledWith(check.resolve,false,sinon.match.string);
            });

        });
    });

    describe('isLengthInRange',function(){

        it('Requires min and max to be finite numbers',function(){
            var check = Check.that([]);
            expect(function(){check.isLengthInRange();}).to.throw(Error);
            expect(function(){check.isLengthInRange(1,null);}).to.throw(Error);
            expect(function(){check.isLengthInRange(NaN,2);}).to.throw(Error);
            expect(function(){check.isLengthInRange(1,2);}).to.not.throw();
        });

        it('Should check for input.length being greater or equal to than min length, ' +
            'if max length is not defined.',function(){

            var check = null;

            // pass
            ['asd',[1,2,3],'ab',['a','b']].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isLengthInRange(2);
                sinon.assert.calledWith(check.resolve,true);
            });


            // fail
            [null,{},'abc',undefined,[],[1,'a']].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isLengthInRange(100);
                sinon.assert.calledWith(check.resolve,false,sinon.match.string);
            });

        });

        it('Should check for input.length being between min and max, inclusive.',function(){

            var check = null;

            // pass
            ['asd',[1,2,3],'ab',[0]].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isLengthInRange(1,3);
                sinon.assert.calledWith(check.resolve,true);
            });


            // fail
            [null,{},'abc',undefined,[],[1,'a']].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isLengthInRange(4,100);
                sinon.assert.calledWith(check.resolve,false,sinon.match.string);
            });

        });
    });

    describe('isNumberInRange',function(){

        it('Requires min and max to be finite numbers',function(){
            var check = Check.that(42);
            expect(function(){check.isNumberInRange();}).to.throw(Error);
            expect(function(){check.isNumberInRange(1,null);}).to.throw(Error);
            expect(function(){check.isNumberInRange(NaN,2);}).to.throw(Error);
            expect(function(){check.isNumberInRange(1,50);}).to.not.throw();
        });


        it('Should check for input being a number greater or equal to than min length, ' +
            'if max length is not defined.',function(){

            var check = null;

            // pass
            [3,4,5,6].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isNumberInRange(3);
                sinon.assert.calledWith(check.resolve,true);
            });


            // fail
            [null,{},'abc',undefined,[],-45,-6].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isNumberInRange(-5);
                sinon.assert.calledWith(check.resolve,false,sinon.match.string);
            });

        });

        it('Should check for input being a number between min and max, inclusive.',function(){

            var check = null;

            // pass
            [-4, 0, -1, 2, 1, 4, 9, 10].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isNumberInRange(-4,10);
                sinon.assert.calledWith(check.resolve,true);
            });


            // fail
            [null,{},'abc',undefined,[],-2,6].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isNumberInRange(-1,5);
                sinon.assert.calledWith(check.resolve,false,sinon.match.string);
            });

        });
    });

    describe('isEmail',function(){
        it('Should check for input being an email address.',function(){

            var check = null;

            // pass
            ['a@b.com','alvin.todd@jibber.org','brit.guy@all.co.uk'].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isEmail();
                sinon.assert.calledWith(check.resolve,true);
            });


            // fail
            [null,{},'abc',undefined,123,'alvin@main@mk.us',
                'd.@m','df@.m','ross@@mail.com'].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isEmail();
                sinon.assert.calledWith(check.resolve,false,sinon.match.string);
            });

        });
    });

    describe('isMobileNumber',function(){
        it('Should check for input being a mobile number.',function(){

            var check = null;

            // pass
            ['+991234567890',1234567890,'1219988776655'].forEach(function(val){
                check = Check.that(val);
                check.resolve = sinon.spy(check.resolve);

                check.isMobileNumber();
                sinon.assert.calledWith(check.resolve,true);
            });


            // fail
            [null,{},'abc',undefined,123,'alvin@main@mk.us',
                '++61 1234','00097663456377',1122334455667788].forEach(function(val){
                    check = Check.that(val);
                    check.resolve = sinon.spy(check.resolve);

                    check.isMobileNumber();
                    sinon.assert.calledWith(check.resolve,false,sinon.match.string);
                });

        });
    });
});