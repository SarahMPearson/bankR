'use strict';

var Mongo = require('mongodb');
var _     = require('lodash');
var async = require('async');
var Transfer = require('./transfer');
var Transaction = require('./transaction');


function Account(obj){
  this.name           = obj.name;
  this.photo          = obj.photo;
  this.accountType    = obj.accountType;
  this.color          = obj.color;
  this.dateCreated    = new Date(obj.dateCreated);
  this.pin            = parseInt(obj.pin);
  this.initDeposit    = parseFloat(obj.initDeposit);
  this.balance        = parseFloat(obj.balance);
  this.transactionsIds=  [];
  this.transfersIds   =  [];
}

Object.defineProperty(Account, 'collection',{
  get: function(){
    return global.mongodb.collection('accounts');
  }
});

Account.prototype.save = function(cb){
  Account.collection.save(this, function(err, obj){
    cb(obj);
  });
};
Account.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Account.collection.findOne({_id:_id}, function(err, result){
    var account = changePrototype(result);
    async.map(account.transactionsIds, function(transactionId, done){
      Transaction.findById(transactionId, function(transaction){
        done(null, transaction);
      });
    }, function(err, transactions){
      account.transactions = transactions;
      async.map(account.transferIds, function(transferId, done){
        Transfer.findById(transferId, function(transfer){
          done(null, transfer);
        });
      }, function(err, transfers){
        account.transfers = transfers;
        cb(account);
      });
    });
  });
};

Account.findAll = function(cb){
  Account.collection.find().toArray(function(err, objects){
    var accounts = objects.map(function(obj){
      return changePrototype(obj);
    });
    cb(accounts);
  });
};

Account.prototype.deposit = function(deposit, cb){
  this.balance += deposit;
  var t = {
    date: new Date(),
    accountId: this._id.toString(),
    fee: 0,
    type: this.type,
    amount: this.deposit
  };
  Transaction.create(t, cb);
};

Account.prototype.withdraw = function(withdrawl, cb){
  if(this.balance >= withdrawl){
    this.balance -= withdrawl;
    var a = {
      date: new Date(),
      accountId: this._id.toString(),
      fee: 0,
      type: this.type,
      amount: this.withdrawl
    };
    Transaction.create(a, cb);
  } else {
    this.balance -= withdrawl + 50;
    var b = {
      date: new Date(),
      accountId: this._id.toString(),
      fee: 50,
      type: this.type,
      amount: this.withdrawl
    };
    Transaction.create(b, cb);
  }
};

module.exports = Account;

// PRIVATE FUNCTIONS ///

function changePrototype(obj){
  var account = _.create(Account.prototype, obj);
  return account;
}
