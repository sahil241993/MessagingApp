import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service'
import {Router,ActivatedRoute} from '@angular/router'
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { FlashMessagesService } from 'ngx-flash-messages';
import {LoginService} from '../../services/login.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username:String;
  password:String;
  currentLoginUser:String;


  constructor(
    private authService:AuthService,
    private router:Router,
    private flashMessagesService:FlashMessagesService,
    private loginService : LoginService,
    private activatedRoute:ActivatedRoute
  ) {
    

   }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
     
      console.log(params); // Print the parameter to the console. 
      this.currentLoginUser=params['name'];
  });
    console.log('in login')
    if(this.loginService.loggedIn()){
     
      if (this.loginService.getUser().user.indexOf('admin')>-1){
      console.log('in1 login')
      this.router.navigate(['/admin'])}
      else if (this.loginService.getUser().user.indexOf('staff')>-1){
      this.router.navigate(['/profile'])
      console.log('in2 login')
    }
    else{
      console.log('djfdsfjldjlfjdlksjalkjlk hello')
      this.loginService.logoutUser()
      this.router.navigate(['/login'],{ queryParams: { name: this.currentLoginUser } });
    }
    }
    else{
      this.loginService.logoutUser()
      this.router.navigate(['/login'],{ queryParams: { name: this.currentLoginUser } });
    }
    
  }

  onLoginSubmit(){
    const user={
      username:this.username,
      password:this.password
    }
    console.log(user)
    this.loginService.authenticateUser(user).subscribe(data =>{
      console.log("data is ",data);
      if(data.success){
        this.loginService.storeUserData(data.token,data.user);
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
