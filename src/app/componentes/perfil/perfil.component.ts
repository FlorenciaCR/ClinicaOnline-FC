import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Horario } from 'src/app/entidades/horario';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { HorarioService } from 'src/app/servicios/horario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  miUsuario:any;

  mostrarEspecialidades : boolean = true;
  horariosDb : any = "";
  datoABuscar : any = "";
  franjasHorarias = [
    ["08:00","12:00"],
    ["14:00","18:00"],
  ]
  dias = ["Lunes","Martes","Miercoles","Jueves","Viernes"]
  especialidadSeleccionada : any = "";
  horarioSeleccionado : any = "";
  
  constructor(public firebase : FirebaseService, private router : Router,private horarioService : HorarioService, private ts : ToastrService) 
  { 
    this.firebase = firebase;
    this.miUsuario = this.firebase.usuarioLogueado

    this.horarioService.traerHorarios().subscribe(value => {
      this.horariosDb = value;
    });
  }

  ngOnInit(): void {
  }

  obtenerFranjasHorarias(){
    return this.franjasHorarias
  }

  seleccionarFranjaHoraria(horarioSeleccionado:any){
    this.horarioSeleccionado = horarioSeleccionado
  }

  seleccionarEspecialidad(especialidadSeleccionada:any){
    this.especialidadSeleccionada = especialidadSeleccionada
  }

  obtenerEspecialidades(){
    return this.miUsuario.especialidades
  }

  crearHorario()
  {
    let horario = new Horario()

    horario.especialistaId = this.firebase.usuarioLogueado.id;

    let horarioEspecialidad = {
      dias: this.dias,
      nombre: this.especialidadSeleccionada,
      rangoHorario: this.horarioSeleccionado  
    }
    horario.horariosEspecialidad.push(horarioEspecialidad);
    this.horarioService.agregarHorario(horario)
  }
}
