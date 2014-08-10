/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect;
var Transaction  = require('../../app/models/transaction');
var dbConnect = require('../../app/lib/mongodb');
var cp        = require('child_process');
var db        = 'bankr-test';
var Mongo     = require('mongodb');

describe('Transaction', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/freshdb.sh', [db], {cwd:__dirname + '/../scripts'}, function(){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new transaction', function(){
      var obj = {type:'withdrawl', date: '2014-8-8', fee: '0', 
      accountId: Mongo.ObjectID().toString(), amount: '100'};
      var t = new Transaction(obj);

      expect(t).to.be.instanceof(Transaction);
      expect(t).to.be.okay;
      expect(t.type).to.equal('withdrawl');
      expect(t.date).to.be.instanceof(Date);
      expect(t.amount).to.equal(100.00);
      expect(t.fee).to.equal(0);
      expect(t.accountId).to.be.instanceof(Mongo.ObjectID);
    });
  });
  describe('.create', function(){
    it('should create a new transaction and save it to the database', function(done){
      var obj = {type:'withdrawl', date: '2014-8-8', fee: '0', 
      accountId: Mongo.ObjectID().toString(), amount: '100'};
      
      Transaction.create(obj, function(transaction){
        expect(transaction._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });
  describe('.findById', function(){
    it('should find transactions by the TransactionId', function(done){
      var transactionId = '53e596422e13be436066f6d0';
      Transaction.findById(transactionId, function(err, transaction){
        expect(transaction._id.toString()).to.equal(transactionId);
        done();
      });
    });
  });


}); 
