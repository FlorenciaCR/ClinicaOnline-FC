import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-turnosp',
  templateUrl: './lista-turnosp.component.html',
  styleUrls: ['./lista-turnosp.component.scss']
})
export class ListaTurnospComponent implements OnInit {

  @Input() recibeListaTurnos;
  constructor() { }

  ngOnInit(): void {
  }

 
  obtenerEstadoTurno(n:number):string{
    let e = '-';
    switch(n){
      case 1:
        e = 'pendiente'
        break;
      case 2:
        e = 'aceptado'
        break;
      case 3:
        e = 'finalizado'
        break;
      case 4:
          e = 'rechazado'
          break;
      case 6:
        e = 'cancelado'
        break;     
    }
    return e;
  }

}
