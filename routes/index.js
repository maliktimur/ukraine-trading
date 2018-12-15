var express = require('express');
var md5 = require('md5')
var router = express.Router();
var connection = require('../db');
// var id = req.session.user_id;
// var popups = require('popups');

function IndexMiddleware(req, res){ 

	connection.query('SELECT * FROM car_make; SELECT * FROM Cars21 ', [1, 2],	function(error, results, fields) {
  		if (error) throw error
  		var unique = [];

  		results[1].forEach(el => {
  			if(unique.map(_ => _.Model).indexOf(el.Model) === -1) {
  				unique.push(el);
  			} else {
  			}
  		})
  		// results[2] == unique
  		results.push(unique);


  		var chunked = [];
		var i,j,chunk = 8;
		for (i=0,j=results[1].length; i<j; i+=chunk) {
		    chunked.push(results[1].slice(i,i+chunk));
		}

		// 3
		results.push(chunked);
		// console.dir(chunked, {depth:1});
		// console.log(results[2]);
  		// console.log(results[0]); // [{1: 1}]
  		// console.log(results[1]); // [{2: 2}]
  		// console.log(req.session)
  		if(res.locals.logined) {
  			res.render('logined',{
	  			id : req.session.user_id,
	  			title : req.session.first_name,
	  			results
	  		});
  		}
  		else {
  			res.render('unlogined',{
	  			results
	  		});
  		}
  		
	});
}

function isAuthenticated(req, res, next) {
	console.log('isAuthenticated')
    // Improvement: TODO authenctication token with expire time 
    // console.log(req.session)
    if (req.session.user_id)
        return next()

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/')
}

router.get('/logout', (req, res) => {
        req.session.destroy((err) => {
        	res.redirect('/');
        });
        
});
router.get('/main/search:make_select', function(req, res, next){
	var make_select = req.body.make_select; 
	console.log(req.params.make_select);
	// connection.query('', function(err, results, fields){
	// 	if(err) throw err
	// 	res.render('logined',{
	// 		results
	// 	});
	// });
});
/* GET home page. */
router.get('/main', isAuthenticated, (req, res, next) => {
	res.locals.logined = true;
	next();
}, IndexMiddleware);

router.get('/', function(req, res, next) {

	if (req.session.user_id) {
        return res.redirect('/main');
	}
	next();
}, IndexMiddleware);


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

router.post('/sellingcar', function(req, res, next){
	// const photolink=String(req.body.photo);
	// console.log(photolink);
	// if(photolink==null) photolink='nothing';
	connection.query(`CALL ADDCAR(?,?,?,?,?,?,?,?,?);`,
		[
		id=req.session.user_id,
		make=req.param("make"),
		model=req.param("model"),
		year=req.param("year"),
		body=req.param("body"),
		engine=req.param("engine"),
		mileage=req.param("mileage"),
		price=req.param("price"),
		photolink=req.param("photolink")
		], function(error, results, fields){
			console.log(id,make,model,year,body,engine,mileage,price,photolink);
			if(error){
				return console.error(error.message);
			}
			console.log('Add car to DB');
			res.redirect('/');
	});
	

});

router.post('/login', (req, res) => {
	const email = String(req.body.email)
    const password = String(req.body.password)
    connection.query(`Select * From clients where email='${email}'`, (err, result, fields) => {
    	if(err) throw err 
    	// console.log(result[0])
    	const user = result[0];
    	// console.log(md5(password), user.Password)
    	if(md5(password) === user.Password){
			// res.cookie('user_id', user.idClients)
			// res.cookie('name',user.Name)
			req.session.user_id = user.idClients
			req.session.first_name = user.Name
    		// const id = req.session.user_id
    		// const firstname = user.Name
			console.log(req.session.user_id)
			console.log(req.session.first_name)
    		res.redirect('/main')
    	} else {
    		// alert('Wrong password')
    		res.redirect('/main')
    		// alert({content:'Wrong password!!!'});
    	}  
    
    	
    
    });
});

module.exports = router;
