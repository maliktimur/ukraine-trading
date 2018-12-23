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
		// console.log(results[0]);
		// console.log(results[1]);
		// console.log(results[2]);
		// console.log(results[3]);
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
router.get('/search', (req,res,next)=>{
	// console.log(req.param("make_select"), req.param("model_select"))
	connection.query('Select * from car_make; SELECT * FROM Cars21; SELECT * from Cars21 WHERE idCar_make=? AND Model=?;',
		[
			(make=req.param("make_select")),
			(model= req.param("model_select"))
		], function(err,results,fields){
		console.log(make,model);
		if(err) throw err
		// console.log(make, model);
		// var make=req.body.make_select; 
		// var model= String(req.body.model_select);
		// console.log(make, model);
		var unique2 = [];
		var selected = results[2];
		// console.log('selected', selected)
		results = results.slice(0, 2);
		 results[1].forEach(el => {
  			if(unique2.map(_ => _.Model).indexOf(el.Model) === -1) {
  				unique2.push(el);
  			} else {
  			}
  		})

  		// results[3] == unique
  		results.push(unique2);

		// results.push([]);
		var chunked2 = [];
		var i,j,chunk = 8;
		for (i=0,j=selected.length; i<j; i+=chunk) {
		    chunked2.push(selected.slice(i,i+chunk));
		}

		// 4
		results.push(chunked2);
		// console.dir(results[3]);

		// console.log(results);
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
    	if(err) throw res.send("Incorrect error!");
    	// console.log(result)
    	if(result.length === 0) return	res.send("Email does not exist!");
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
    		res.redirect('/main');
    	} else {
    		// alert('Wrong password')
    		res.redirect('/main');
    	}  
    
    	
    
    });
});

module.exports = router;
