import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';
import {LoginService} from './login.service'
import {ResponseContentType,RequestOptions} from '@angular/http'

@Injectable()
export class AdminService {

  constructor(private http:Http,
    private loginService:LoginService
) { }

  getAdminProfile(){
    console.log(this.loginService.getToken())
    let headers=new Headers();
     headers.append('Content-Type','application/json');
     headers.append('authorization',this.loginService.getToken());
       console.log("in staff")
       return this.http.get("http://localhost:8080/admin/",
       {headers:headers})
       .map(res=>{
         return res.json();
       })
      }

      updateStudentsDetails(data,whom?: string){
        console.log('in update student details')
        return this.http.put("http://localhost:8080/admin/"+whom,data)
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

      addAdminStudent_Staff(data,whom){
        return this.http.post("http://localhost:8080/admin/"+whom,data).map(
          (res)=>{
            return res.json();
          }
        )
      }

      deleteMethod(ID,whom: string){
        let headers = new Headers({ 'Content-Type': 'application/json' });
        
        headers.append('Content-Type','application/json');
        headers.append('authorization',this.loginService.getToken());
        headers.append('body',ID);
        
        let options = new RequestOptions({
          headers: headers,
        });
    
        return this.http.delete('http://localhost:8080/admin'+whom,options).map(
          (res)=>{
              return res.json();
          })
      }

}
