import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';
import {tokenNotExpired} from 'angular2-jwt'
@Injectable()
export class LoginService {
  authToken:any;
  user:any;
  constructor(private http:Http) { }
  authenticateUser(user){
    return this.http.post("http://localhost:8080/login",user)
    .map(res =>res.json())  
}

storeUserData(token,user){
  console.log("user is ",user)
  localStorage.setItem('id_token',token);
  localStorage.setItem('user',JSON.stringify(user));
  this.authToken=token;
  this.user=user;
}

loggedIn()
{
  var token=this.getToken()
  return tokenNotExpired(null,token)
}

getToken(){
  return localStorage.getItem('id_token');
}

getUser(){
  const user=localStorage.getItem('user');
  this.user=JSON.parse(user);
  return this.user;
}

logoutUser(){
  localStorage.clear();
  this.authToken=null; 
  this.user=null;
}
}
