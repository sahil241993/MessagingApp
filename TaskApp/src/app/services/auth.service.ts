import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import {tokenNotExpired} from 'angular2-jwt'
import {ResponseContentType,RequestOptions} from '@angular/http'
@Injectable()
export class AuthService {
  authToken:any;
  user:any;
  constructor(private http:Http) { }

  deleteMethod(ID,whom: string){
    this.loadToken();
    this.loadUser();
    
    let headers = new Headers({ 'Content-Type': 'application/json' });
    
    headers.append('Content-Type','application/json');
    headers.append('authorization',this.authToken);
    headers.append('body',ID);
    
    let options = new RequestOptions({
      headers: headers,
    });

    return this.http.delete('https://messagingschoolapp.herokuapp.com/admin/'+whom,options).map(
      (res)=>{
          return res.json();
      })
  }

  changePassword(data){
    return this.http.post('https://messagingschoolapp.herokuapp.com/updatePassword',data).map(
      (res)=>{
          return res.json();
      })
  }

  sendMessage(messageObj){
  return this.http.post('https://messagingschoolapp.herokuapp.com/sendMessage',messageObj).map(
    (res)=>{
      return res.json();
    }
  )
}


addAdminStudent_Staff(data,whom){
  return this.http.post("https://messagingschoolapp.herokuapp.com/admin/"+whom,data).map(
    (res)=>{
      return res.json();
    }
  )
}


updateStudentsDetails(data,whom?: string){
  console.log('in update student details')
  return this.http.put("https://messagingschoolapp.herokuapp.com/admin/"+whom,data)
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

updateByStaffStudentsDetails(data){
  console.log('in update student details')
  return this.http.put("https://messagingschoolapp.herokuapp.com/staff/student",data)
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

loggedIn()
{
  this.loadToken();
  return tokenNotExpired(null,this.authToken)
}

changeTask(){
    console.log('in changeTask')
   

  }

  authenticateUser(user){
    return this.http.post("https://messagingschoolapp.herokuapp.com/login",user)
    .map(res =>res.json())  
}

getProfile(){
   let headers=new Headers();
    this.loadToken();
    this.loadUser();
    headers.append('Content-Type','application/json');
    console.log(this.authToken)
    console.log(this.user)
    console.log(this.user.username)
    headers.append('authorization',this.authToken);
      console.log("in staff")
      return this.http.get("https://messagingschoolapp.herokuapp.com/staff",
      {headers:headers})
      .map(res=>{
        return res.json();
      })
}


getAdminProfile(){
  let headers=new Headers();
   this.loadToken();
   this.loadUser();
   headers.append('Content-Type','application/json');
   console.log(this.authToken)
   console.log(this.user)
   console.log(this.user.username)
   headers.append('authorization',this.authToken);
     console.log("in staff")
     return this.http.get("https://messagingschoolapp.herokuapp.com/admin",
     {headers:headers})
     .map(res=>{
       return res.json();
     })
}

loadToken(){
  const token=localStorage.getItem('id_token');
  this.authToken=token;
}
loadUser(){
  const user=localStorage.getItem('user');
  this.user=JSON.parse(user);
  return this.user;
}
storeUserData(token,user){
  console.log("user is ",user)
  localStorage.setItem('id_token',token);
  localStorage.setItem('user',JSON.stringify(user));
  this.authToken=token;
  this.user=user;
 
}
logoutUser(){
  localStorage.clear();
  this.authToken=null; 
  this.user=null;
}
}