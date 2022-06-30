import { Component, Input, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import{trigger,style,transition,animate, state} from'@angular/animations'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  animations:[
    trigger('arriba',[
      state('void',style({
        transform:'translateY(-100%)',
        opacity:0
      })),
      transition(':enter',[
        animate(1500,style({
          transform:'translateY(0)',
          opacity:1
        }))
      ])
    ]),

  ]
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
