const express=require('express');
const route=express.Router();
var connection=require('../databaseConnection/connection');
const jwt=require('jsonwebtoken');
var crypto = require("crypto");
const model=require('../models/model')
var nodemailer = require('nodemailer');
var multer=require('multer');
var path=require('path')
var csvtojson= require('csvtojson')

var store=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./upload');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'.'+file.originalname);
    }
});






var upload = multer({storage:store}).single('file');

route.post('/upload',(req,res,next)=>{
    var jsonArray=[];
    upload(req,res,(err)=>{
        if(err){
            return res.status(501).json({
                success:false,
                error:err});
        }
        console.log(path.resolve(__dirname, '../upload/'+ req.file.filename))
        csvtojson({}).fromFile(path.resolve(__dirname, '../upload/'+ req.file.filename))
        .on('json',(jsonObj)=>{
         jsonArray.push(jsonObj);        
         })
        .on('done',(error)=>{
        console.log('end')
        jsonArray.forEach(element=>{
            saveStudents(element)
        })
        })

        return res.json({  
            originalname:req.file.originalname,
            uploadname:req.file.filename
        })
    })

   
})


function saveStudents(req){
    console.log(new Date(req.DateOfBirth))
    var sql = "insert into student(staffname,Name,DateOfBirth,PlaceOfBirth,Sex,MobilePhone,Address,class,state)"+
    "values(?,?,?,?,?,?,?,?,?);";
    connection.con.query(sql,[req.StaffName,req.Name,new Date(req.DateOfBirth),req.PlaceOfBirth,req.Sex,req.MobilePhone,
        req.Address,req.class,req.state], function(err,result){
            if(err){
                console.log(err)
            }
            console.log("success");
    });   

}


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
    })    
});



route.get('/checkEmail',function(req,res,next){
    var sql = "select username from staff";
    connection.con.query(sql, function(err,rows){
        if(err)
        return res.json({
            success:true,
            msg:err
        }
        );
        localEmails=rows;
        return res.json({
            success:true,
            emails:localEmails
        }
        )
    });   
})



route.post('/download',(req,res,next)=>{
    console.log(__dirname)
    var name=req.body.name;
    // filepath=path.join(__dirname, '/../admin/download.csv')
    var filepath= path.resolve(__dirname, '../download/'+ name+'.csv')
    console.log(filepath)
    res.sendFile(filepath);
})

route.post('/mobilefieldchange',function(req,res,next){

    var obj = req.body;
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
        subject: obj.teacherName+ ' changed the mobile no of ' + obj.studentName,
        text: 'Hi Admin, \n This is a system generated mail to inform you that teacher with username '+obj.teacherName+
        " tried to change the mobile no of "+ obj.studentName +' who belongs to class '+obj.studentClass +
        ' and the changed mobile no is '+obj.studentMobileNo
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.json({
              success:false,
              msg:err
          });
        }
      });
    return res.json({
       success:true,
       msg:"An Email hasbeen sent to the admin saying you were trying to change the mobile no of "+obj.studentName
    })

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
            var sql = "insert into staff(Name,DateOfBirth,PlaceOfBirth,Sex,MobilePhone,Address,Salary,username,state)"+ 
            "values(?,?,?,?,?,?,?,?,?);"
            connection.con.query(sql,
                [req.body.Name,new Date(req.body.DateOfBirth),req.body.PlaceOfBirth,req.body.Sex,req.body.MobilePhone,
                req.body.Address,req.body.Salary,req.body.username,req.body.state],function(err,result1){
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
    var sql = "insert into student(staffname,Name,DateOfBirth,PlaceOfBirth,Sex,MobilePhone,Address,class,state)"+
    "values(?,?,?,?,?,?,?,?,?);";
    connection.con.query(sql,[req.body.StaffName,req.body.Name,new Date(req.body.DateOfBirth),req.body.PlaceOfBirth,req.body.Sex,req.body.MobilePhone,
        req.body.Address,req.body.class,req.body.state], function(err,result){
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
