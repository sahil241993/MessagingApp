var development=require('./development.js');
var production=require('./production');
module.exports = function(){
   
    var environment = process.env.NODE_ENV || 'development';
    switch(environment){
        
        case 'development':  
           return development 
        case 'production':
            return production;    
    }
};

