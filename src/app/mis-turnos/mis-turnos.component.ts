import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Turno } from '../interfaces/turno';
import { FirebaseService } from '../servicios/firebase.service';
import { TurnoService } from '../servicios/turno.service';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss']
})
export class MisTurnosComponent implements OnInit {

  miUsuario:any
  turnos:any
  
  constructor(public firebase : FirebaseService, private turnoService : TurnoService) 
  {
    this.miUsuario = this.firebase.usuarioLogueado

    turnoService.turnos.subscribe(x => {
      this.turnos = x
    })

    //this.turnos = this.turnoService.turnosArray
    
  }


  ngOnInit(): void {
  }

  obtenerTurnos(){
    console.log("tur",this.turnos)
    return this.turnos
  }

  obtenerFechaFormateada(time){
    return new Date(time.nanoseconds)
  }

  aceptarTurno(turno:Turno){
    turno.estado = "Aceptado"
    this.turnoService.modificarTurno(turno, turno.id)
  }
  
  cancelarTurno(turno:Turno){
    turno.estado = "Cancelado"
    this.turnoService.modificarTurno(turno, turno.id)
  }
}
