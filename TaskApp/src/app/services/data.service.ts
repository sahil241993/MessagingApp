import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map'
import {ResponseContentType} from '@angular/http'
@Injectable()
export class DataService {
  constructor(private http:Http) { }

changeTask(task,user){
    console.log(user)
    let headers=new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post("http://127.0.0.1:8080/users/register",user,{headers:headers})
    .map(res=>res.json());  
  

}


}
