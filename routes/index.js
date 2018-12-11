var express = require('express');
var router = express.Router();
var connection = require('../db');


/* GET home page. */
router.get('/', function(req, res, next) {
	connection.query('SELECT * FROM car_make; SELECT * FROM Cars21 ', [1, 2], function(error, results, fields) {
  		if (error) throw error

  // `results` is an array with one element for every statement in the query:
		// console.log(results);
  		// console.log(results[0]); // [{1: 1}]
  		// console.log(results[1]); // [{2: 2}]
  		res.render('index',{
  			results
  		});
	});
});

module.exports = router;
