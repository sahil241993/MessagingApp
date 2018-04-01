import { Injectable } from '@angular/core';
@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user){
    if(user.name==undefined || user.email==undefined || user.username==undefined ||user.password==undefined)
     return false
    else
     return true;
  }

  validateEmail(email){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

validateDetails(user){
  console.log(user)
    if(user.name==undefined || user.email==undefined || user.Address==undefined
       || user.qualification.collage==undefined || user.qualification.twelve==undefined ||user.qualification.matric==undefined)
     return false
    else
     return true;
  }
isNumber (o) {
  return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
}

isValidDate(dateString)
{
    // First check for the pattern
    if(!/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[2], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[0], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};


validateUserTaskDetails(taskObj){
   if(taskObj.task==undefined || taskObj.dueDate==undefined || taskObj.Status==undefined){
      return false;
   }
   
     else if(!this.isValidDate(taskObj.dueDate)){
          return false;
      }
      return true;
   }
}
