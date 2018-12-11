var mysql      = require('mysql');
var connection = mysql.createPool({
	multipleStatements: true,
	connectionLimit: 10,
	host     : 'lightos.beget.tech',
	user     : 'lightos_timur',
	password : '3Mduhcx*',
	database : 'lightos_timur'
}); 

 
module.exports = connection;