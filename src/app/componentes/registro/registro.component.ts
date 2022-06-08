import { Component, Input, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  tipo : any;
  mensaje : string='';
  esAdministrador:boolean=false
  firebaseService:any

  constructor(firebaseService:FirebaseService) { 
    this.firebaseService = firebaseService
  }


  ngOnInit(): void {
  }
  
}
