import { Component, OnInit } from '@angular/core';
import{trigger,style,transition,animate, state} from'@angular/animations'

@Component({
  selector: 'app-bienvenido',
  templateUrl: './bienvenido.component.html',
  styleUrls: ['./bienvenido.component.scss'],
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
export class BienvenidoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
