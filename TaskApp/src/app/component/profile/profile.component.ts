import { Component, OnInit ,AfterViewInit,DoCheck,ViewChild,ElementRef} from '@angular/core';
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router'
import {DataService} from '../../services/data.service'
import {ValidateService} from '../../services/validate.service'
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { Pipe, PipeTransform } from '@angular/core'
import * as moment from 'moment'
import { AuthConfig } from 'angular2-jwt';
import { FlashMessagesService } from 'ngx-flash-messages';
import {FilterPipe} from '../../pipes/filaterPipe'
import { forEach } from '@angular/router/src/utils/collection';
import {Student_info} from '../../interfaces/all_interface'; 
import {LoginService} from '../../services/login.service'
import {Observable} from 'rxjs'
import { InputDecorator, Input } from '@angular/core/src/metadata/directives';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

@Pipe({
  name: 'FilterPipe',
})

export class ProfileComponent implements OnInit , AfterViewInit,DoCheck {
  @ViewChild('hh') input :ElementRef
  mobileFieldChanged:boolean=false
  user:any;
  students:Student_info[];
  student_info:Student_info;
  dateValid:boolean;
  table_show:boolean;
  validation_msg:string;
  p: number = 1;
  searchString:string;
  class_selected:string;
  teacher_classes:Array<string>=[]
  message={
    to:'',
    to_build:[],
    from:'',
    body:''
  };
  constructor(
    private authservice:AuthService,
    private router:Router,
    private dataService:DataService,
    private validateService:ValidateService,
    private flashMessagesService:FlashMessagesService,
    private loginService:LoginService
  ) { 

    this.student_info={
      ID:null,
      Name:'',
      MobilePhone:'',
      DateOfBirth:null,
      PlaceOfBirth:'',
      class:'',
      StaffName:'',
      Address:'',
      Sex:'',
      state:false
    };
   
  }


  ngAfterViewInit() {
    console.log(this.input)
    var observable=Observable.fromEvent(this.input.nativeElement,'input')
    observable
    .map((event)=>{
      //console.log(event)
      return event//['target'].value
    })
    .debounceTime(2000)
    .distinctUntilChanged()
    .subscribe({
      next:(event)=>{
        if (event['target']['validity'].valid){
          this.mobileFieldChanged=true;
        }
        else{
          this.mobileFieldChanged=false;
        }
      }
    })
  }

  ngOnInit() {
    this.loadStudenData();
  }

  
  ngDoCheck(){ 
  }


  checkAll(ev) {
    this.students.forEach((x) =>{ 
      x.state = ev.target.checked
    })  
  }

  sentMessage(){
  console.log(this.message)
  this.authservice.sendMessage(this.message).subscribe(
    (data)=>{
      console.log(data)
    }
  )
}


populateClassDetails(){
  this.teacher_classes=[]
  this.students.forEach(element => {
    var flag=0;

    if (this.teacher_classes&& this.teacher_classes.length>0){
      this.teacher_classes.forEach(element1 => {
          if(element1==element.class){
            flag=1;
          }   
      });
      if (flag==0){

        this.teacher_classes.push(element.class)
      }
    }
    else{
      this.teacher_classes.push(element.class)
    }
  });
}
autoPopulateMessage(){
  this.message.to_build=[]
  this.user=this.loginService.getUser();
  this.students.forEach(element => {
      if (element.state){
        this.message.to_build.push("+91"+element.MobilePhone)
      }
      // else if(this.message.to_build.indexOf(element.MobilePhone) > -1 ){
      //     this.message.to_build.splice(this.message.to_build.indexOf(element.MobilePhone),1)
      // }
  });
  this.message.to=this.message.to_build.toString();
  this.message.from=this.user.username;
}
  isAllChecked() {
    return this.students.every(_ => _.state);
  }
  loadStudenData(){

    this.authservice.getProfile().subscribe(data=>{
      this.students=data.students;
      
      console.log('clas ssss ',this.teacher_classes)

      if (this.students.length>0){
        this.table_show=true;
      }
      else{
        this.table_show=false;
        this.validation_msg ="Current there are no students assigned to you"
      }
  
      console.log(this.students)
      },
      err=>{
        console.log(err);
        return false;
      }
      )
   
  }
  futureDateCheck(d)
  {
    if(new Date(d).getTime() > Date.now()){
      return true;
    }
    else{
      return false;
    }
  
  }
  updateDetail(instance:any){  
    console.log(this.mobileFieldChanged)

     instance.state='';

   console.log(instance)
    this.authservice.updateByStaffStudentsDetails(instance).subscribe(
    (data)=>{
      console.log(data)
      if (data.success){




      for (var i=0;i<this.students.length;i++){
        if (this.students[i].ID==instance.ID){
            this.students[i]=data.data 
            break;
        }
      }
      this.flashMessagesService.show(data.msg, {
        classes: ['alert', 'alert-warning'], // You can pass as many classes as you need
        timeout: 3000, // Default is 3000
      });

      if(this.mobileFieldChanged){
        this.authservice.staffTryingTOChangeMobileField(this.student_info).subscribe(
          (data)=>{
             if (data.success){
               this.mobileFieldChanged=false;
              this.flashMessagesService.show(data.msg, {
                classes: ['alert', 'alert-warning'], // You can pass as many classes as you need
                timeout: 3000, // Default is 3000
              });
             }
             else{
              this.flashMessagesService.show(data.msg, {
                classes: ['alert', 'alert-warning'], // You can pass as many classes as you need
                timeout: 3000, // Default is 3000
              });
             }
          }
        )
      }
    }
    else
    {
      this.flashMessagesService.show(data.msg, {
        classes: ['alert', 'alert-warning'], // You can pass as many classes as you need
        timeout: 3000, // Default is 3000
      });
    }
  
  }
    )



    
    
    

  }
  fun4(event){
    event.DateOfBirth=moment(event.DateOfBirth).format('YYYY-MM-DD').toString();
    this.student_info=Object.assign({}, event); 
    
  }

}


