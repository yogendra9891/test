var expect = require('chai').expect;
var describe = require('mocha').describe;
var it = require('mocha').it;
var proxyquire = require('proxyquire').noPreserveCache();
var sinon = require('sinon');

/**
 * Tests for /libs/logger.js
 */
describe('logger',function() {
    var winston = {

        Logger:function(){
            this.add = sinon.spy();
        },
        transports:{Console:function(){}}
    };

    var logger = proxyquire('../../libs/logger', {'winston': winston});

    it('Should expose a configured winston instance.',function(){
        expect(logger).to.be.instanceOf(winston.Logger);
        sinon.assert.calledWith(logger.add,winston.transports.Console);
    });
});
