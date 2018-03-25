const express=require('express');
const route=express.Router();
var connection=require('../databaseConnection/connection');
const jwt=require('jsonwebtoken');


route.put('/student',function(req,res,next){
    console.log("in update method",req.data)
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
            msg:"Updation failed Please try again..",
            obj:err
       });
    return res.json
    ({
        success:true,
         msg:"Student Value Saved Successfully",
         obj:result,
         data:req.body
    });
})  
});

route.get('/',verifyToken,(req,res,next)=>{
    var sql = "select * from student where staffname='"+req.username+"'";
    console.log("username is" ,req.username)
    connection.con.query(sql, function(err,rows){
        if(err)return res.json(err);
        return res.json(
            {
                students:rows,
            }
        )
    });   
})

route.get('/:class',function(req,res,next){
    console.log("in class")
    var sql = "select * from student s where s.class='"+req.params.class+"' and staffname='"+req.username+"'";
    connection.con.query(sql, function(err,rows){
        if(err)
        return res.json(err);
        students=rows;
        return res.json({students:students}
        )
    });   
})



route.post('/students',function(req,res,next){
    var sql = "insert into student(staffname,Name,DateOfBirth,PlaceOfBirth,Sex,MobilePhone,Address,class)"+
    "values(?,?,?,?,?,?,?,?);";
    connection.con.query(sql,[req.body.staffname,req.body.Name,new Date(req.body.DateOfBirth),req.body.PlaceOfBirth,req.body.Sex,req.body.MobilePhone,
        req.body.Address,req.body.class], function(err,result){
            if(err)return res.json({
                msg:"Insertion failed",
                obj:err
           });
        return res.json
        ({
             msg:"Student inserted successfully",
             obj:result
        });

    });   
})





route.delete('/student',function(req,res,next){
    var sql = "delete from student where id ="+req.body.id;
    connection.con.query(sql,
        function(err,result){
            if(err)return res.json({
                    msg:"Deletion failed",
                    obj:err
               });
            return res.json
            ({
                 msg:"Deletion Successfully",
                 obj:result
            });
    });   
})

function verifyToken(req,res,next){
    const bearerHeader=req.headers['authorization'];
    console.log("in verify token",bearerHeader);
    if (bearerHeader !== undefined){
        req.token=bearerHeader;
        jwt.verify(req.token,"secretkey", function(err, decoded) {
            
            if(err){
                res.status(403).send({errorCode:"Something is wrong please log in again"});
            }
            else{
                if((decoded.data.user)=='staff'){
                    req.username=decoded.data.username
                    next();
                }
                else{
                    res.status(403).send({errorCode:"Permission denied!"});
                }
            }
          });
    }
    else{
        res.status(403).send({errorCode:"you are not logged in please log in"});
    }
}

module.exports=route;
