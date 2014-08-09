'use strict';

var morgan = require('morgan');
var bodyParser = require('body-parser');
var accounts = require('../controllers/account');
var transactions = require('../controllers/transaction');
var transfer = require('../controllers/transfer');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));

  app.get('/accounts/new', accounts.init);
  app.post('/accounts', accounts.create);
  app.get('/accounts/:id', priorities.show);

  app.get('/', tasks.index);
  app.get('/tasks/new', tasks.init);
  app.post('/tasks', tasks.create);
  app.get('/tasks', tasks.index);
  app.post('/tasks/:id', tasks.toggle);

  console.log('Pipeline Configured');
};
