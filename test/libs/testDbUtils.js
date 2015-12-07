var expect = require('chai').expect;
var describe = require('mocha').describe;
var it = require('mocha').it;
var proxyquire = require('proxyquire').noPreserveCache();
var sinon = require('sinon');
var config = require('config');

/**
 * Tests for /libs/dbUtils.js
 */
describe('dbUtils',function(){
    var seraph = {};
    var seraphStub = sinon.stub().returns(seraph);

    var dbUtils = proxyquire('../../libs/dbUtils',{
        'seraph':seraphStub,
        './appUtils':{
                logger:{ // stub out logger as well
                    info:sinon.stub(),
                    error:sinon.stub()
                }
            }
    });

    it('should initiate seraph with neo4j config.',function(){
        sinon.assert.calledWith(seraphStub,config.get("neo4j"));
    });

    it('Should define findOne function in seraph.',function(){
        expect(seraph.findOne).to.be.a('function');
    });

    describe('getNeoDb',function(){

        it('Should return an instance of seraph db driver.',function(){
            expect(dbUtils.getNeoDB()).to.be.equal(seraph);
        });

    });

    describe('getNeoDb.findOne',function(){

        it('Calls seraph find with same arguments except that callback is wrapped in another function.',function(){
            var predicate = {};
            var any = false;
            var label = 'label';
            var callback = sinon.spy();

            // all params
            seraph.find = sinon.spy();
            dbUtils.getNeoDB().findOne(predicate,any,label,callback);
            sinon.assert.calledWith(seraph.find,predicate,any,label,sinon.match.func);

            // 1 optional param
            seraph.find = sinon.spy();
            dbUtils.getNeoDB().findOne(predicate,label,callback);
            sinon.assert.calledWith(seraph.find,predicate,label,sinon.match.func);

            // other optional param
            seraph.find = sinon.spy();
            dbUtils.getNeoDB().findOne(predicate,any,callback);
            sinon.assert.calledWith(seraph.find,predicate,any,sinon.match.func);

            // no optional param
            seraph.find = sinon.spy();
            dbUtils.getNeoDB().findOne(predicate,callback);
            sinon.assert.calledWith(seraph.find,predicate,sinon.match.func);

            // no callback
            seraph.find = sinon.spy();
            dbUtils.getNeoDB().findOne(predicate);
            sinon.assert.calledWith(seraph.find,predicate);
        });

        it('Calls callback parameter with first node in find() results or undefined. Also, forwards error.',function(){
            var node = {};
            var err = {};

            // 1 node found
            seraph.find = sinon.stub().callsArgWith(1,err,[node]);
            var callback = sinon.spy();
            dbUtils.getNeoDB().findOne({},callback);
            sinon.assert.calledWith(callback,err,node);

            // many nodes found
            seraph.find = sinon.stub().callsArgWith(1,err,[node,{}]);
            callback = sinon.spy();
            dbUtils.getNeoDB().findOne({},callback);
            sinon.assert.calledWith(callback,err,node);

            // no nodes found
            seraph.find = sinon.stub().callsArgWith(1,err,[]);
            callback = sinon.spy();
            dbUtils.getNeoDB().findOne({},callback);
            sinon.assert.calledWith(callback,err,undefined);
        });
    });

    describe('getNeoDb.queryFirst',function(){

        it('Calls seraph query with same arguments except that callback is wrapped in another function.',function(){
            var query = 'query';
            var params = {};
            var callback = sinon.spy();

            // all params
            seraph.query = sinon.spy();
            dbUtils.getNeoDB().queryFirst(query,params,callback);
            sinon.assert.calledWith(seraph.query,query,params,sinon.match.func);

            // 1 optional param
            seraph.query = sinon.spy();
            dbUtils.getNeoDB().queryFirst(query,callback);
            sinon.assert.calledWith(seraph.query,query,sinon.match.func);

            // no callback
            seraph.query = sinon.spy();
            dbUtils.getNeoDB().queryFirst(query);
            sinon.assert.calledWith(seraph.query,query);
        });

        it('Calls callback parameter with first node in query() results or undefined. Also, forwards error.',function(){
            var node = {};
            var err = {};

            // 1 node found
            seraph.query = sinon.stub().callsArgWith(2,err,[node]);
            var callback = sinon.spy();
            dbUtils.getNeoDB().queryFirst('query',{},callback);
            sinon.assert.calledWith(callback,err,node);

            // many nodes found
            seraph.query = sinon.stub().callsArgWith(2,err,[node,{}]);
            callback = sinon.spy();
            dbUtils.getNeoDB().queryFirst('query',{},callback);
            sinon.assert.calledWith(callback,err,node);

            // no nodes found
            seraph.query = sinon.stub().callsArgWith(2,err,[]);
            callback = sinon.spy();
            dbUtils.getNeoDB().queryFirst('query',{},callback);
            sinon.assert.calledWith(callback,err,undefined);
        });
    });

    describe('getNeoDb.findByIdAndLabel',function(){

        it('requires id parameter to be a number or a string that can be parsed to a number',function(){
            seraph.query = sinon.spy();

            expect(function(){dbUtils.getNeoDB().findByIdAndLabel('abc','label',function(){});}).to.throw(Error);
            expect(function(){dbUtils.getNeoDB().findByIdAndLabel({},'label',function(){});}).to.throw(Error);
            expect(function(){dbUtils.getNeoDB().findByIdAndLabel([],'label',function(){});}).to.throw(Error);
            expect(function(){dbUtils.getNeoDB().findByIdAndLabel(123,'label',function(){});}).to.not.throw();
            expect(function(){dbUtils.getNeoDB().findByIdAndLabel('123','label',function(){});}).to.not.throw();
        });

        it('required label parameter to be a string',function(){
            seraph.query = sinon.spy();

            expect(function(){dbUtils.getNeoDB().findByIdAndLabel(1,123,function(){});}).to.throw(Error);
            expect(function(){dbUtils.getNeoDB().findByIdAndLabel(2,null,function(){});}).to.throw(Error);
            expect(function(){dbUtils.getNeoDB().findByIdAndLabel(3,function(){});}).to.throw(Error);
            expect(function(){dbUtils.getNeoDB().findByIdAndLabel(4,'label',function(){});}).to.not.throw();
        });

        it('requires callback parameter to be a function',function(){
            seraph.query = sinon.spy();

            expect(function(){dbUtils.getNeoDB().findByIdAndLabel(123,'label');}).to.throw(Error);
            expect(function(){dbUtils.getNeoDB().findByIdAndLabel(123,'label',null);}).to.throw(Error);
            expect(function(){dbUtils.getNeoDB().findByIdAndLabel(123,'label',function(){});}).to.not.throw();
        });

        it('calls seraph with proper query and a callback',function(){
            seraph.query = sinon.spy();

            dbUtils.getNeoDB().findByIdAndLabel(123,'label',sinon.spy());

            sinon.assert.calledOnce(seraph.query);
        });

        it('calls back with first node found in query results',function(){
            var node = {};
            seraph.query = sinon.stub().callsArgWith(2,undefined,[node]);
            var callback = sinon.spy();
            dbUtils.getNeoDB().findByIdAndLabel(123,'label',callback);

            sinon.assert.calledWith(callback,undefined,node);
        });

        it('calls back with undefined if query results are empty',function(){
            seraph.query = sinon.stub().callsArgWith(2,undefined,[]);
            var callback = sinon.spy();
            dbUtils.getNeoDB().findByIdAndLabel(123,'label',callback);

            sinon.assert.calledWith(callback,undefined,undefined);
        });

        it('forwards errors from seraph query',function(){
            var err = new Error();
            seraph.query = sinon.stub().callsArgWith(2,err);
            var callback = sinon.spy();
            dbUtils.getNeoDB().findByIdAndLabel(123,'label',callback);

            sinon.assert.calledWith(callback,err,undefined);
        });
    });

    describe('getNeoDb.ensureIndexes',function(done){

        it('Calls seraph index.createIfNone with label and keys.',function(){
            seraph.index = {
                createIfNone:sinon.stub().callsArgWith(2,null)
            };

            // single key
            dbUtils.getNeoDB().ensureIndexes('label','key');
            sinon.assert.calledWith(seraph.index.createIfNone,'label','key',sinon.match.func);

            // many keys
            seraph.index.createIfNone = sinon.stub().callsArgWith(2,null);
            dbUtils.getNeoDB().ensureIndexes('label',['key1','key2'],function(err){
                expect(err).to.not.exist;
                sinon.assert.calledWith(seraph.index.createIfNone,'label','key1',sinon.match.func);
                sinon.assert.calledWith(seraph.index.createIfNone,'label','key2',sinon.match.func);
                done();
            });
        });

        it('Forwards errors to callback',function(done){
            var error = new Error();
            seraph.index = {
                createIfNone:sinon.stub().callsArgWith(2,error)
            };

            dbUtils.getNeoDB().ensureIndexes('label',['key1','key2'],function(err){
                expect(err).to.be.equals(error);
                done();
            });
        });
    });
});