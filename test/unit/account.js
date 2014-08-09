/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect;
var Account  = require('../../app/models/account');
var dbConnect = require('../../app/lib/mongodb');
var cp        = require('child_process');
var db        = 'bankr-test';
var Mongo     = require('mongodb');

describe('Account', function(){
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
    it('should create a new account', function(){
      var obj = {name:'Kate Capshaw', photo: 'http://www.123.com', accountType: 'savings', color: 'coral',
      dateCreated: '2014-8-8', pin:'1234', initDeposit: '100', balance: '500' };
      var a = new Account(obj);

      expect(a).to.be.instanceof(Account);
      expect(a).to.be.okay;
      expect(a.name).to.equal('Kate Capshaw');
      expect(a.photo).to.be.equal('http://www.123.com');
      expect(a.accountType).to.equal('savings');
      expect(a.dateCreated).to.be.instanceof(Date);
      expect(a.color).to.equal('coral');
      expect(a.pin).to.equal(1234);
      expect(a.initDeposit).to.equal(100);
      expect(a.balance).to.equal(500);
    });
  });
  describe('#create', function(){
    it('should create a new account and save it to the database', function(done){
      var obj = {name:'Kate Capshaw', photo: 'http://www.123.com', accountType: 'savings', color: 'coral',
        dateCreated: '2014-8-8', pin:'1234', initDeposit: '100', balance: '500' };
      var account = new Account(obj); 
      account.create(function(result){  
        expect(account).to.be.instanceof(Account);
        expect(account._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });
  describe('.findById', function(){
    it('should find an Account by its ID', function(done){
      var accountId = '53e5659ee1eb2778810b9d4a';
      Account.findById(accountId, function(err, account){
        expect(account).to.be.instanceof(Account);
        done();
      });
    });
  });

}); 
