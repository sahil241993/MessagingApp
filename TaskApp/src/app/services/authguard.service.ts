import { Injectable } from '@angular/core';
import {Router,CanActivate} from '@angular/router'
import {AuthService} from '../services/auth.service'

@Injectable()
export class AuthguardService implements CanActivate {

  constructor(
    private authService:AuthService,
    private router:Router
    ) { }

 canActivate(){
  if(this.authService.loggedIn() && this.authService.loadUser().user=="staff"){
    return true;
  }else{
    this.authService.logoutUser();
    this.router.navigate(['/login'])
  }
}

}
