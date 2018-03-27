var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var admin_route=require('./admin/routes.js');
var staff_route=require('./staff/routes.js');
const jwt=require('jsonwebtoken');
//var connection=require('./databaseConnection/connection');
const model=require('./models/model')
const path=require('path');
const cors=require('cors');
const accountSid = 'AC08b169060aade8d726e982f72a2ba115';
const authToken = '3a046dc638325ab3d85f6d8d3ab6ef18';
// // require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);
var config=require('./config/config')()
var mysql = require('mysql');
// client.messages.create(
//   {
//     to: '+917018537638',
//     from: '+17735702485',
//     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
//   },
//   (err, message) => {
//     if (err){
//       console.log(err);
//     }
//   }
// );
app.use(cors());
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

app.use(allowCrossDomain);
app.use(bodyParser.json())


app.post('/updatePassword',(req,res,next)=>{
    console.log(req.body)
    model.getUserByUsername(req.body.username,(err,r_table_user)=>{
        console.log(r_table_user)
        if(err) res.json(err)
        if(r_table_user.length==0) 
        {
            return res.json({success: false,msg:"user not found"});
        }
        model.comparePassword(req.body.currentpassword,r_table_user[0].password,(err,isMatch)=>{
            if(err){
                return res.json({success: false,msg:"Something went wrong Please try again",err:err});
            } 
           
            if(isMatch){
                model.addNewPassword(req.body.username,req.body.newpassword,(err,result)=>{
                    if(err)
                        return res.json({success: false,msg:"Something went wrong Please try again",err:err});
                    else if(result){
                        return res.json({success: true,msg:"Password updated Successfully"});
                    }
                })
            }else{
                return res.json({success: false,msg:"Wrong Password"});
            }
        });    
    })



})


app.post('/login',(req,res,next)=>{
  console.log("user data is",req.body);
  var username=''
  var password=''
  var user='';
  if ((req.body.username.indexOf('admin')==-1))
  {
    username=req.body.username
    password=req.body.password
    user='staff';
  }
  else{
    user=req.body.username;
    password=req.body.password
    username=req.body.username;
  }


  model.getUserByUsername(username,(err,r_table_user)=>{
    if(err) throw err;
    if(r_table_user.length==0) 
    {
        console.log("dskajfljdsljfldasjlfkjdsljf")
        return res.json({success: false,msg:"user not found"});
    }
    console.log("r_table_user is ",r_table_user[0].password)
    model.comparePassword(password,r_table_user[0].password,(err,isMatch)=>{
        if(err){
            console.log("after kdjfalkjdlafjl")
            return res.json({success: false,msg:"Something went wrong Please try again"});
        } 
       
        if(isMatch){
            
            jwt.sign(
                {data:{user:user,username:username}},
                "secretkey",
                (err,token)=>{
                    if(err){
                        return res.json('403')
                    }
                    return res.json({
                        success: true,
                        token:token,
                        user:{
                            username:req.body.username,

                            user:user
                            },
                        msg:"Login Successfull"
                    })
                }
            )


        }else{
            return res.json({success: false,msg:"Wrong Password"});
        }
    });    
})
  
})


app.post('/sendMessage',function(req,res,next){
    
console.log(req.body.to_build)
    client.messages.create(
  {
    to: req.body.to_build,
    from: '+17735702485',
    body: req.body +"/n Reagrds from"+req.from ,
  },
  (err, message) => {
    if (err){
      res.json(
          {
              "msg":"Unable to send message.Please try again.",
              "error":err
          }
      )

    }
    else{
        res.json(
            {
                "msg":"Message Sent Successfully"
            }
        )
    }
   
  }
);

})














const port=process.env.PORT || 8080;
app.use('/admin',admin_route);
app.use('/staff',staff_route);




app.use(express.static(path.join(__dirname,'public')))

app.get('/',function(req,res){
  res.sendFile(__dirname + "/index.html");
});
app.listen(port,() =>{
  console.log('Server started on port' + port);
})