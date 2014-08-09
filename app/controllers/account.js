'use strict';

var Account = require('../models/account');

exports.init = function(req, res){
  res.render('account/init');
};

exports.create = function(req, res){
  Account.create(req.body, function(){
    res.redirect('/accounts');
  });
};

exports.index = function(req, res){
  Account.findAll(function(err, accounts){
    res.render('accounts/index', {accounts:accounts});
  });
};
