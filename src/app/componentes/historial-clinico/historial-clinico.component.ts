import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HistoriaClinica } from 'src/app/entidades/HistoriaClinica';
import { Turno } from 'src/app/interfaces/turno';
import { EstadoHistoriaClinicaPipe } from 'src/app/pipes/estado-historia-clinica.pipe';

import { FirebaseService } from 'src/app/servicios/firebase.service';
import { TurnoService } from 'src/app/servicios/turno.service';

@Component({
  selector: 'app-historial-clinico',
  templateUrl: './historial-clinico.component.html',
  styleUrls: ['./historial-clinico.component.scss']
})
export class HistorialClinicoComponent implements OnInit {

  //Paciente
  tipoUsuarioLogueado:any;
  miUsuario: any;
  poseeHistorial: Boolean =false;
  historialesClinicos:HistoriaClinica[]=[];

  //id del paciente a listar
  @Input() idPaciente :string | undefined='';

  
  constructor(public firebase : FirebaseService, private turnoService : TurnoService,private fb:FormBuilder, private ts :ToastrService, public estadoHistoriaClinica : EstadoHistoriaClinicaPipe) 
  {
    console.log('fuera del construcotr',this.idPaciente);
    setTimeout(() => {
      console.log(this.idPaciente);
      this.idPaciente? this.traerIdPaciente(this.idPaciente):null;
      
    }, 3000);
 
  }

  traerIdPaciente(idPaciente:string)
  {

    this.firebase.getUsuario(idPaciente).subscribe(res=>{
          let aux = res.data();
          this.tipoUsuarioLogueado =aux?.['tipoUsuario'] 
          //console.log('getCurrentUser tipoUsuarioLogueado: ',this.tipoUsuarioLogueado)
          this.miUsuario ={
            uid : aux?.['uid'],
            nombre : aux?.['nombre'],
            apellido : aux?.['apellido'],
            dni : aux?.['dni'],
            edad : aux?.['edad'],
            email : aux?.['email'],
            imgPerfil : aux?.['imgPerfil'],
            imgsPerfil : aux?.['imgsPerfil'],
            tipoUsuario :aux?.['tipoUsuario'] ,
            obraSocial : aux?.['obraSocial'],
            especialidades : aux?.['especialidades'],
            especialidad : aux?.['especialidad'],
            password : aux?.['password'],
            historialClinico : aux?.['historialClinico']
          }

          if(this.miUsuario.historialClinico?.length >0)
          {
            this.poseeHistorial=true;
            this.miUsuario.historialClinico.forEach(value=>{
              let auxHistorial :HistoriaClinica = value
              this.historialesClinicos.push(auxHistorial);
              console.log(this.historialesClinicos);

            })
          }
      })
    }
      
  
  

  ngOnInit(): void {}

}
