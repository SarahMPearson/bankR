'use strict';

var Mongo = require('mongodb');

function Transfer(obj){
  this.amount = parseInt(obj.amount);
  this.date   = new Date(obj.date);
  this.toAccountId = Mongo.ObjectID(obj.toAccountId);
  this.fromAccountId = Mongo.ObjectID(obj.fromAccountId);
  this.fee = parseInt(obj.fee);
}

Object.defineProperty(Transfer, 'collection',{
  get: function(){
    return global.mongodb.collection('transfers');
  }
});

Transfer.create = function(obj, cb){
  var transfer = new Transfer(obj);
  
  Transfer.collection.save(transfer, function(){
    cb(transfer);
  });
};


Transfer.findById = function(transferId, cb){
  var id = Mongo.ObjectID(transferId);
  Transfer.collection.findOne({_id:id}, cb);
};

module.exports = Transfer;
