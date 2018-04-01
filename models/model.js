var connection=require('../databaseConnection/connection');
const bcrypt=require('bcryptjs');

module.exports.addNewPassword=(user,newPassword,callback)=>{
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newPassword,salt,(err,hash)=>{
            if(err)callback(err,null)
                password=hash;
            var sql = "update staffconnection set password = '"+password+"'"+"where username='"+user+"'";
            connection.con.query(sql,callback);
        })
    })
}

module.exports.addUser=(newUser,callback)=>{
    console.log(newUser)
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err)throw err;
                password=hash;
            var sql = "insert into messagingapp.staffconnection(username,password)"+ 
            "values(?,?);"
            connection.con.query(sql,[newUser.username,password],callback);
        })
    })
}

module.exports.getUserByUsername=(username,callback)=>{
    var sql = "select username,password from staffconnection where username='"+username+"'";
    console.log(sql)
    connection.con.query(sql,callback);
}

module.exports.comparePassword=function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword,hash,(err,isMatch)=>{
        if(err) callback(err,null) 
        else
        callback(null,isMatch);
    })
}