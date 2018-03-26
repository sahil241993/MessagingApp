import { Component, OnInit ,DoCheck,ChangeDetectorRef } from '@angular/core';
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
import { updateLocale } from 'moment';
import {Student_info} from '../../interfaces/all_interface'; 
import {Staff_info} from '../../interfaces/all_interface';
import { AsyncPipe } from '@angular/common';
import { inspect } from 'util';
import { NgForRow } from '@angular/common/src/directives/ng_for';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})



@Pipe({
  name: 'FilterPipe',
})
export class AdminComponent implements OnInit,DoCheck{
  
  user:any;
  students:Student_info[] 
  staffMembers:Staff_info[]
  student_info:Student_info
   staff_info:Staff_info
  dateValid:boolean;
  student_show:boolean;
  staff_show:boolean
  validation_msg:string;
  p: number = 1;
  p1: number = 1;
  searchString:string;
  staffString:String;
  class_selected:string;
  teacher_classes:Array<string>=[]
  message={
    to:'',
    to_build:[],
    from:'',
    body:''
  };
  modelHeadline:string;
  new_flag:boolean;
  new_flag_1:boolean;
  constructor(
    private authservice:AuthService,
    private router:Router,
    private dataService:DataService,
    private validateService:ValidateService,
    private flashMessagesService:FlashMessagesService,
    private cdr:ChangeDetectorRef 
  ) {
    this.staff_info={
        ID:null,
        Name:'',
        MobilePhone:'',
        DateOfBirth:new Date(),
        PlaceOfBirth:'',
        Salary:'',
        username:'',
        Address:'',
        Sex:'',
        state:false
        };
      this.student_info={
        ID:null,
        Name:'',
        MobilePhone:'',
        DateOfBirth:new Date(),
        PlaceOfBirth:'',
        class:'',
        StaffName:'',
        Address:'',
        Sex:'',
        state:false
      };
    
   }



  ngOnInit() {
    this.loadStudenData();
  }
  ngDoCheck(){
      console.log('in Do check')
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
  saveNewDetails(f:any,whom:String){
    console.log(f)
    this.authservice.addAdminStudent_Staff(f,whom).subscribe(
      (data)=>{
        if (data.success){
          console.log("data is " , data,whom)
          if (data.whom=='student'){
            console.log('students');
              this.students.push(data.data)
          }
          else if (data.whom=='staff'){
              this.staffMembers.push(data.data);
          }
          this.flashMessagesService.show(data.msg, {
            classes: ['alert', 'alert-warning'], // You can pass as many classes as you need
            timeout: 3000, // Default is 3000
          });
        }
        else{
          console.log("data is " , data)
          this.flashMessagesService.show(data.msg, {
            classes: ['alert', 'alert-warning'], // You can pass as many classes as you need
            timeout: 10000, // Default is 3000
          });
        }
      
      }
    )
  }
 
 
 
 
  deleteMethod(f,whom:string){
     var data=f.ID;
     console.log(data)
      this.authservice.deleteMethod(data,whom).subscribe(
          (data)=>{
            console.log(data)
          if (data.success){
            if(data.whom=='student'){
                for (var i=0;i<this.students.length;i++){
                  if (this.students[i].ID==f.ID){
                      this.students.splice(i,1);
                  }
                }
            }
            else if(data.whom=='staff'){
              for (var i=0;i<this.staffMembers.length;i++){
                if (this.staffMembers[i].ID==f.ID){
                    this.staffMembers.splice(i,1);
                }
              }
            }


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



  saveMethod(f:any,whom:String){  
    if (this.new_flag){
     this.saveNewDetails(f,whom);
    }
    else{
        this.updateDetail(f,whom);
    }
  }


  clearStaffCurrentObject(){
    this.new_flag=true;
    this.modelHeadline="Add"
    if(this.new_flag_1){
    this.staff_info={
      ID:null,
      Name:'',
      MobilePhone:'',
      DateOfBirth:null,
      PlaceOfBirth:'',
      Salary:'',
      username:'',
      Address:'',
      Sex:'',
      state:false
     };
  }
  this.new_flag_1=false
  }

  staffMethod(event){
    this.new_flag=false;
    this.new_flag_1=true;
    this.modelHeadline="Update"
    event.DateOfBirth=moment(event.DateOfBirth).format('YYYY-MM-DD').toString();
    this.staff_info=Object.assign({}, event); 
  }

  clearCurrentObject(){
    this.new_flag=true;
    this.modelHeadline="Add"
    console.log('in flag1',this.new_flag_1)
    if(this.new_flag_1){
   
      this.student_info={
        ID:null,
        Name:null,
        MobilePhone:null,
        DateOfBirth:null,
        PlaceOfBirth:null,
        class:null,
        StaffName:null,
        Address:null,
        Sex:null,
        state:false
        };
    
    }
    this.new_flag_1=false
  }

  fun4(event,form:NgForm){
    this.new_flag=false;
    this.new_flag_1=true;
    this.modelHeadline="Update"
    event.DateOfBirth=moment(event.DateOfBirth).format('YYYY-MM-DD').toString();
    this.student_info=Object.assign({}, event);
  }


  checkAll(ev) {
    this.students.forEach((x) =>{ 
      x.state = ev.target.checked
    })
  }

  checkStaffAll(ev) {
    this.staffMembers.forEach((x) =>{ 
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

autoPopulateMessage(){

  this.message.to_build=[]
  this.user=this.authservice.loadUser();
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


autoStaffPopulateMessage(){
  this.message.to_build=[]
  this.user=this.authservice.loadUser();
  this.staffMembers.forEach(element => {
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

  isAllStaffChecked(){
    return this.staffMembers.every(_ => _.state);
  }

  loadStudenData(){
    console.log('in loadStudentData admin')
    this.authservice.getAdminProfile().subscribe(data=>{
      console.log(data);
      this.students=data.students;
      
      this.staffMembers=data.staff;
      this.cdr.detectChanges();
      this.students.forEach(element => {
        var flag=0;
        if (this.teacher_classes && this.teacher_classes.length>0){
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
      console.log('clas ssss ',this.teacher_classes)
      if (this.students.length>0){
        this.student_show=true;
      }
      else{
        this.student_show=false;
        this.flashMessagesService.show("Current there are no students.", {
          classes: ['alert', 'alert-warning'], // You can pass as many classes as you need
          timeout: 3000, // Default is 3000
        });
      }
      if (this.staffMembers.length>0){
        this.staff_show=true;
      }
      else{
        this.staff_show=false;
        this.flashMessagesService.show("Current there are no staff members", {
          classes: ['alert', 'alert-warning'], // You can pass as many classes as you need
          timeout: 3000, // Default is 3000
        });
      }
  
      console.log(this.students)
      },
      err=>{
        console.log(err);
        return false;
      }
      )

  }
  
  
  futureDateCheck(d){
    if(new Date(d).getTime() > Date.now()){
      return true;
    }
    else{
      return false;
    }}


 


  
    updateDetail(instance:any,whom){
    this.authservice.updateStudentsDetails(instance,whom).subscribe(
    (data)=>{
      console.log(data)
      if (data.success){
        if(data.whom=='student'){
            for (var i=0;i<this.students.length;i++){
              if (this.students[i].ID==instance.ID){
                  this.students[i]=data.data;
                  break;
              }
            }
        }
      }
        else if(data.whom=='staff'){

          for (var i=0;i<this.staffMembers.length;i++){
            if (this.staffMembers[i].ID==instance.ID){
                this.staffMembers[i]=data.data;
                break;
            }
          }
        }
      this.flashMessagesService.show(data.msg, {
        classes: ['alert', 'alert-warning'], // You can pass as many classes as you need
        timeout: 3000, // Default is 3000
      }); 
    
  })
}
}