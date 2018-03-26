import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { ProfileComponent } from './component/profile/profile.component';
import {ValidateService} from './services/validate.service';
import { FlashMessagesModule } from 'ngx-flash-messages';
import {AuthService} from './services/auth.service'
import {AuthguardService} from './services/authguard.service'
import {DataService} from './services/data.service'
import { CommonModule } from '@angular/common';     
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { ContenteditableDirective } from './directives/contenteditable.directive';//added this line to your module
import {FilterPipe} from './pipes/filaterPipe';
import {FilterPipe1} from './pipes/staffFilter'
import { AdminComponent } from './component/admin/admin.component';
import { EqualValidator } from './directives/equal-validator';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    ContenteditableDirective,
    FilterPipe,
    FilterPipe1,
    AdminComponent,
    EqualValidator
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FlashMessagesModule,
    NgxPaginationModule
     ],
  providers: [ValidateService,AuthService,AuthguardService,DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
