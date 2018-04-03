import { Component, OnInit ,DoCheck} from '@angular/core';
import {AuthService} from '../../services/auth.service'
import {Router} from'@angular/router';
import { FlashMessagesService } from 'ngx-flash-messages';
import {LoginService} from '../../services/login.service'
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit,DoCheck{
  user={
    username:'',
    currentpassword:'',
    newpassword:'',
    confirmPassword:''

  };
  constructor(
    private authService:AuthService,
    private router:Router,
    private flashMessagesService:FlashMessagesService,
    private loginService:LoginService
  ) { }

  ngOnInit() { 
  }
  ngDoCheck(){
    if(this.loginService.loggedIn()){
      this.user.username=this.loginService.getUser().username;
    }
  }
ngViewChecked(){
  
}
loggedIn(){
  return this.loginService.loggedIn();
}

logoutUser(){
  this.loginService.logoutUser();
    this.router.navigate(['/']);
  return false;   
}

changePassword(model, isValid: boolean) {
  console.log(model)
  this.authService.changePassword(model).subscribe(
    (data)=>{
        this.user={
          username:this.loginService.getUser().username,
          currentpassword:'',
          newpassword:'',
          confirmPassword:'' 
        };
        this.flashMessagesService.show(data.msg, {
          classes: ['alert', 'alert-warning'], // You can pass as many classes as you need
          timeout: 3000, // Default is 3000
        });
      }
    
  )
}

}