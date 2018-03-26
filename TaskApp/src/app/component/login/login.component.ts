import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router'
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { FlashMessagesService } from 'ngx-flash-messages';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username:String;
  password:String;


  constructor(
    private authService:AuthService,
    private router:Router,
    private flashMessagesService:FlashMessagesService
  ) { }

  ngOnInit() {
    console.log('in login')
    if(this.authService.loggedIn()){
     
      if (this.authService.loadUser().user.indexOf('admin')>-1){
      console.log('in1 login')
      this.router.navigate(['/admin'])}
      else if (this.authService.loadUser().user.indexOf('staff')>-1){
      this.router.navigate(['/profile'])
      console.log('in2 login')
    }
    else{
      console.log('djfdsfjldjlfjdlksjalkjlk hello')
      this.authService.logoutUser()
      this.router.navigate(['/login'])
    }
    }
    else{
      this.authService.logoutUser()
      this.router.navigate(['/login'])
    }
    
  }

  onLoginSubmit(){
    const user={
      username:this.username,
      password:this.password
    }
    console.log(user)
    this.authService.authenticateUser(user).subscribe(data =>{
      console.log("data is ",data);
      if(data.success){
        this.authService.storeUserData(data.token,data.user);
        this.flashMessagesService.show(data.msg, {
          classes: ['alert', 'alert-warning'], // You can pass as many classes as you need
          timeout: 3000, // Default is 3000
        });
        if (data.user.user=="staff")
        this.router.navigate(['/profile'])
        else if (data.user.user.indexOf("admin")>-1)
        this.router.navigate(['/admin']);
        else{
          this.router.navigate(['/login']);
        }
        
      }
      else{
        this.flashMessagesService.show(data.msg, {
          classes: ['alert', 'alert-warning'], // You can pass as many classes as you need
          timeout: 3000, // Default is 3000
        });
          this.router.navigate(['login'])
      }
    })
  }
}
