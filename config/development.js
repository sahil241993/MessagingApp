// module.exports= {
//     host : 'localhost',
//     user : "root",
//     password : "root",
//     database: "test",
//     port:3306
// };
module.exports={
	var pool = mysql.createPool({
    connectionLimit : 100,
    host : "ss.ciljehvh059e.us-east-2.rds.amazonaws.com",
    user :"ss", 
    password: "sahilsharma",       
    port:'3306',
    database: "test"
	});
}