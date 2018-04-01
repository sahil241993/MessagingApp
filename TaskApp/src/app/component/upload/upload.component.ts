import { Component, OnInit,DoCheck} from '@angular/core';
import {FileSelectDirective,FileUploader} from 'ng2-file-upload'

const uri ="http://localhost:8080/admin/upload"

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit,DoCheck {

  uploader:FileUploader =new FileUploader({
    url:uri,
    allowedMimeType: ['application/vnd.ms-excel','application/x-xls','text/csv'] 
  })
  
  attatchedList : any=[];
  constructor() { 
    this.uploader.onCompleteItem=(item:any,res:any,status:any,headers:any)=>{
    
      this.attatchedList.push(JSON.parse(res));
      console.log(this.attatchedList)
     
    }
  }
 ngDoCheck(){
 }
  ngOnInit() {
    this.uploader.onBeforeUploadItem = (item) => {
      console.log(item)
      item.withCredentials = false;
    }
  }

}
