const express=require('express');
const route=express.Router();
var connection=require('../databaseConnection/connection');
const jwt=require('jsonwebtoken');
var crypto = require("crypto");
const model=require('../models/model')
var nodemailer = require('nodemailer');
// connection.con.connect(function(err) {
//     if (err) 
//         throw err;
//   });

var students=[];
var staff=[];
route.get('/',verifyToken,(req,res,next)=>{
    var sql = "select * from staff;select * from student";
    connection.con.query(sql, function(err,rows){
        if(err)
        return res.json(err);
        staff=rows[0];
        students=rows[1];
        return res.json(
            {
                students:students,
                staff:staff
            }
        )
    });
    
})

route.get('/students/:class',verifyToken,function(req,res,next){
    var sql = "select * from student s where s.class='"+req.params.class+"'";
    connection.con.query(sql, function(err,rows){
        if(err)
        return res.json(err);
        students=rows;
        return res.json({students:students}
        )
    });   
})

route.get('/staff',verifyToken,function(req,res,next){
    var sql = "select * from staff"
    connection.con.query(sql, function(err,rows){
        if(err)
        return res.json(err);
        staff=rows;
        return res.json({staff:staff});
    });   
})

route.post('/staff',function(req,res,next){
    addStaffMember(req,function(err,result){
        if(err)
        res.json({success:false, msg:"Insertion failed in staffconnection table this username already exists",obj:err});
        else{ 
        console.log("in else cluse")
            var sql = "insert into staff(Name,DateOfBirth,PlaceOfBirth,Sex,MobilePhone,Address,Salary,username)"+ 
            "values(?,?,?,?,?,?,?,?);"
            connection.con.query(sql,
                [req.body.Name,new Date(req.body.DateOfBirth),req.body.PlaceOfBirth,req.body.Sex,req.body.MobilePhone,
                req.body.Address,req.body.Salary,req.body.username],function(err,result1){
                    if(err)
                    {
                        connection.con.query("delete from staffconnection where username ='"+req.body.username+"'"
                        ,function(err,res){});
                        res.json({success:false,msg:"Insertion failed in staff table",obj:err});
                    }
                    var transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                          user: 'sahilmarish@gmail.com',
                          pass: 'SahilSharma'
                        }
                      });
                      
                      var mailOptions = {
                        from: 'sahilmarish@gmail.com',
                        to: 'sahilmarish241993@gmail.com',
                        subject: 'Hi greeting from school mount carmel. \n'+ 
                        'your username is '+ req.body.username+"\n"+ 
                        'Your password is '+req.body.password,
                        text: 'That was easy!'
                      };
                      
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          res.json(err);
                        }
                      });
                    res.json({success:true,data:req.body,msg:"inserted successfully",whom:'staff',obj:result1,obj1:result});
            });  
        }  
    }); 
})

route.post('/student',function(req,res,next){
    var sql = "insert into student(staffname,Name,DateOfBirth,PlaceOfBirth,Sex,MobilePhone,Address,class)"+
    "values(?,?,?,?,?,?,?,?);";
    connection.con.query(sql,[req.body.StaffName,req.body.Name,new Date(req.body.DateOfBirth),req.body.PlaceOfBirth,req.body.Sex,req.body.MobilePhone,
        req.body.Address,req.body.class], function(err,result){
            if(err)return res.json({
                success:false,
                msg:"Insertion failed. Check the Teacher is correct",
                obj:err,
                
           });
        return res.json
        ({
            success:true,
             msg:"Student inserted successfully",
             whom:'student',
             obj:result,
             data:req.body
        });

    });   
})

route.put('/staff',function(req,res,next){
    var obj=req.body;
    console.log(obj)
    var str="";
  Object.keys(obj).map((k)=>{
        if (k.toLowerCase() !='id'){
            str+=k.toLowerCase()+"='"+obj[k]+"',";
        }
  })
  var newStr = str.substring(0, str.length-1);
  console.log(newStr);
  var sql = "update staff set "+newStr+" where id ="+obj['ID']+";";
  connection.con.query(sql,function(err,result){
        if(err)return res.json({
            success:false,
            msg:"Updation failed",
            obj:err,
            whom:'staff'
       });
    return res.json
    ({
        success:true,
         msg:"Staff value Update successfully",
         obj:result,
         data:req.body,
         whom:'staff'
    });

})   
});

route.put('/student',function(req,res,next){
    var obj=req.body;
    console.log(obj)
    var str="";
  Object.keys(obj).map((k)=>{
        if (k.toLowerCase() !='id'){
            str+=k.toLowerCase()+"='"+obj[k]+"',";
        }
  })
  var newStr = str.substring(0, str.length-1);
  console.log(newStr);
  var sql = "update student set "+newStr+" where id ="+obj['ID']+";";
  connection.con.query(sql,function(err,result){
        if(err)return res.json({
            success:false,
            msg:"Updation failed",
            obj:err,
            whom:'student'
       });
    return res.json
    ({
        success:true,
         msg:"Student value Update successfully",
         obj:result,
         data:req.body,
         whom:'student'
    });
})  
});

route.delete('/staff',verifyToken,function(req,res,next){
    var sql = "delete from staff where id ="+req.headers['body'];
    console.log("sql is ",sql)
    connection.con.query(sql,
        function(err,result){
            if(err)return res.json({
                success:false,    
                msg:"Deletion failed Stdents are assigned to this teacher Firstly change the teacher of those studens then try to delete it",
                obj:err
               });
            return res.json
            ({
                success:true,
                 msg:"Deletion Successfully",
                 whom:'staff',
                 obj:result
            });
    }) 
});

route.delete('/student',verifyToken,function(req,res,next){
    var sql = "delete from student where id ="+req.headers['body'];
    connection.con.query(sql,
        function(err,result){
            if(err)return res.json({
                    success:false,
                    msg:"Deletion failed",
                    obj:err
               });
            return res.json
            ({
                success:true,
                 msg:"Deletion Successfully",
                 whom:'student',
                 obj:result
            });
    });   
})

function addStaffMember(req,callback){
    let newUser={
        username:req.body.username,
        password:crypto.randomBytes(20).toString('hex')
    }
    req.body.password=newUser.password;
    model.addUser(newUser,callback);
  }

function verifyToken(req,res,next){ 
    const bearerHeader=req.headers['authorization'];
    if (bearerHeader !== undefined){
        req.token=bearerHeader;
        jwt.verify(req.token,"secretkey", function(err, decoded) {
            
            if(err){
                res.status(403).send({errorCode:"Something is wrong please log in again"});
            }
            else{
                if((decoded.data.user)=='admin'){
                    next();
                }
                else{
                    res.status(403).send({errorCode:"Permission denied!"});
                }
            }
          });
    }
    else{
        res.status(403).send({errorCode:"You are not logged in please log in"});
    }
}

module.exports=route;
