import { Component, OnInit,DoCheck} from '@angular/core';
import {FileSelectDirective,FileUploader} from 'ng2-file-upload'
import { Router,ActivatedRoute } from '@angular/router';
import{Http} from '@angular/http'
import {AuthService} from '../../services/auth.service'
const uri ="http://localhost:8080/admin/upload"

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit,DoCheck {
  currenttemplateUser:string;
  uploader:FileUploader =new FileUploader({
    url:uri,
    allowedMimeType: ['application/vnd.ms-excel','application/x-xls','text/csv'] 
  })
  

  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }
  
  attatchedList : any=[];
  constructor(private activatedRoute:ActivatedRoute,
              private router:Router,
              private http:Http,
              private authService:AuthService) { 

    this.uploader.onCompleteItem=(item:any,res:any,status:any,headers:any)=>{
    
      this.attatchedList.push(JSON.parse(res));
      console.log(this.attatchedList)
     
    }
  }
 ngDoCheck(){
 }
  ngOnInit() {
    this.currenttemplateUser=this.activatedRoute.snapshot.url[this.activatedRoute.snapshot.url.length-1].path;
    
    this.uploader.onBeforeUploadItem = (item) => {
    
      item.withCredentials = false;
    }
  }
  
  
  download(){
    console.log( this.currenttemplateUser)
    var data=this.currenttemplateUser;
    this.authService.download(data).subscribe(
      data=>{
        console.log(data)
        this.downloadFile(data)
      }
    )
  }

  downloadFile(data: any) {
    let parsedResponse = data._body;
    console.log('data is ',parsedResponse)
    let blob = new Blob([parsedResponse], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);

    if(navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, 'student.csv');
    } else {
        let a = document.createElement('a');
        a.href = url;
        a.download = 'student.csv';
        document.body.appendChild(a);
        a.click();        
        document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url);
}

}
