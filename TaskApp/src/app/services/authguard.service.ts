import { Injectable } from '@angular/core';
import {Router,CanActivate} from '@angular/router'
import {AuthService} from '../services/auth.service';
import {LoginService} from './login.service'

@Injectable()
export class AuthguardService implements CanActivate {

  constructor(
    private authService:AuthService,
    private router:Router,
    private loginService:LoginService
    ) { }

 canActivate(){
  
  if(this.loginService.loggedIn()){
    return true;
  }else{
    this.loginService.getUser();
    this.router.navigate(['/login'])
  }
}

}
