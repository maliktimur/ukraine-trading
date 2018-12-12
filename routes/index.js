var express = require('express');
var md5 = require('md5')
var router = express.Router();
var connection = require('../db');
// var id = req.session.user_id;
// var popups = require('popups');

function isAuthenticated(req, res, next) {
    // Improvement: TODO authenctication token with expire time 
    // console.log(req.session)
    if (req.session.user_id)
        return next()

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/')
}

router.get('/logout', (req, res) => {
        req.session.destroy()
        res.clearCookie("user_id")
        // console.log(req.session)
        res.redirect('/')
});
/* GET home page. */
router.get('/main', isAuthenticated, function(req, res, next) {
	connection.query('SELECT * FROM car_make; SELECT * FROM Cars21', [1, 2],	function(error, results, fields) {
  		if (error) throw error

  // `results` is an array with one element for every statement in the query:
		// console.log(results);
  		// console.log(results[0]); // [{1: 1}]
  		// console.log(results[1]); // [{2: 2}]
  		res.render('logined',{
  			id : req.session.user_id,
  			results
  		});
	});
});

router.get('/', function(req, res, next) {
	connection.query('SELECT * FROM car_make; SELECT * FROM Cars21 ', [1, 2], 	function(error, results, fields) {
  		if (error) throw error

  // `results` is an array with one element for every statement in the query:
		// console.log(results);
  		// console.log(results[0]); // [{1: 1}]
  		// console.log(results[1]); // [{2: 2}]
  		res.render('unlogined',{
  			results
  		});
	});
});


router.post('/clientregister', function(req, res, next){
	connection.query("CALL ClientInsert(?,?,?,?,?);",
	[
	Name = req.param("Name"),
	Surname = req.param("Surname"),
	Email = req.param("Email"),
	Phone = req.param("Phone"),
	Password = req.param("Password")
	], function(error, results, fields){
		if(error){
			return console.error(error.message);
		}
		console.log('Add client to DB');
		res.redirect('/');
	}); 

});

// router.post('/sellingcar', function(req, res, next){
// 	connection.query("CALL ClientInsert(?,?,?,?,?);",
// 	[
// 	Name = req.param("Name"),
// 	Surname = req.param("Surname"),
// 	Email = req.param("Email"),
// 	Phone = req.param("Phone"),
// 	Password = req.param("Password")
// 	], function(error, results, fields){
// 		if(error){
// 			return console.error(error.message);
// 		}
// 		console.log('Add client to DB');
// 	}) 

// });

router.post('/login', (req, res) => {
	const email = String(req.body.email)
    const password = String(req.body.password)
    connection.query(`Select * From clients where email='${email}'`, (err, result, fields) => {
    	if(err) throw err 
    	// console.log(result[0])
    	const user = result[0];
    	// console.log(md5(password), user.Password)
    	if(md5(password) === user.Password){
			res.cookie('user_id', user.idClients)
			req.session.user_id = user.idClients
    		const id = req.session.user_id
			console.log(req.session.user_id)
    		res.redirect('/main')
    	} else {
    		// alert('Wrong password')
    		res.redirect('/main')
    		// alert({content:'Wrong password!!!'});
    	}  
    
    	
    
    });
});

module.exports = router;
