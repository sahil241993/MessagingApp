import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';
import {LoginService} from './login.service'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import {ResponseContentType,RequestOptions} from '@angular/http'
import { Student_info } from 'app/interfaces/all_interface';
@Injectable()
export class AuthService {

  constructor(private http:Http,
              private loginService:LoginService
  ) { }

 
 checkEmail(){
   return this.http.get('http://localhost:8080/admin/checkEmail').map(
      (res)=>{
          return res.json();
      })
 }
  changePassword(data){
    return this.http.post('http://localhost:8080/updatePassword',data).map(
      (res)=>{
          return res.json();
      })
  }

  sendMessage(messageObj){
  return this.http.post('http://localhost:8080/sendMessage',messageObj).map(
    (res)=>{
      return res.json();
    }
  )
}






updateByStaffStudentsDetails(data){
  console.log('in update student details')
  return this.http.put("http://localhost:8080/staff/student",data)
  .map(res=>{
    console.log('in res');
    return res.json();
  }).catch((error:any)=>
   {
     console.log(error)
     return error;
   }
  
  );
}







getProfile(){
   let headers=new Headers();
    headers.append('Content-Type','application/json');
    headers.append('authorization',this.loginService.getToken());
      return this.http.get("http://localhost:8080/staff",
      {headers:headers})
      .map(res=>{
        return res.json();
      })
}


staffTryingTOChangeMobileField(studentObj:Student_info){
  var user=this.loginService.getUser();
  var obj={
    studentName:studentObj.Name,
    studentClass:studentObj.class,
    studentMobileNo:studentObj.MobilePhone,
    teacherName:user.username
  }
  console.log(user)
  return this.http.post('http://localhost:8080/admin/mobilefieldchange',obj)
          .map(res=>
          {
            return res.json();
          })
}

}