import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ignoreElements } from 'rxjs';
import { Paciente } from 'src/app/entidades/paciente';
import { Turno } from 'src/app/interfaces/turno';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-seccion-pacientes',
  templateUrl: './seccion-pacientes.component.html',
  styleUrls: ['./seccion-pacientes.component.scss']
})
export class SeccionPacientesComponent implements OnInit {

  miUsuario:any;
  tipoUsuarioLogueado:any;
  listadoPacientes:any[]=[]
  poseePaciente : boolean=false;
  listadoTurnos:Turno[]=[];
  listaTurnos:Turno[]=[]
  listaAuxTurnos:Turno[]=[]
  turnosCargados:boolean = false
  turnoDePacienteSeleccionado =[];
  pacienteSelecionado : Paciente;

  constructor(public firebase : FirebaseService, private ts :ToastrService) 
  {
   
    this.firebase.getCurrentUser().subscribe(obs=>{
      if(obs!=null){
        this.firebase.getUsuario(obs.uid).subscribe(res=>{
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
            historialClinico : aux?.['historialClinico'],
            pacientesFinalizados : aux?.['pacientesFinalizados']
          }
          console.log('usuario logueado',this.miUsuario.pacientesFinalizados)
       

          
        })
      }
      
      setTimeout(() => {
        this.firebase.obtenerTodos('usuariosColeccion').subscribe(res=>{
          //let especialistas:Especialista[]=[];
          let pacientes:Paciente[]=[];
    
          res.forEach(value=>{
            if(value.tipoUsuario=='paciente')
            {
              let paciente = value;
              console.log('paciente:',paciente)
    
              if(this.miUsuario.pacientesFinalizados.length>0)
              {
                if(this.miUsuario.pacientesFinalizados.includes(paciente.uid))
                {
                  pacientes.push(paciente)
                  this.poseePaciente =true;
                }
              }
            }
          })
        //this.listadoEspecialistas=especialistas;
        console.log('listado pacientes finalizados',this.listadoPacientes);
        this.listadoPacientes=pacientes;
    
        })
      }, 2000);
    })

    setTimeout(() => {
      this.firebase.obtenerTodos('turnos').subscribe(res=>{
        let turnos : Turno[]=[];
        res.forEach(inf=>{
          let turno = new Turno();
          turno.duracion= inf.duracion
          turno.especialidad= inf.especialidad
          turno.especialista = inf.especialista
          turno.paciente = inf.paciente
          turno.fecha = new Date(inf.fecha) 
          turno.estadoTurno= inf.estadoTurno
          turno.id= inf.id
          turno.atencionCalificada=inf.atencionCalificada
          turno.comentario=inf.comentario
          turno.resenia=inf.resenia

          if(this.tipoUsuarioLogueado == 'especialista'){
            if(turno.especialista.uid === this.miUsuario.uid){
              turnos.push(turno)
            }  
          }else if(this.tipoUsuarioLogueado == 'paciente'){
            if(turno.paciente.uid === this.miUsuario.uid){
              turnos.push(turno)
            } 
          }
        })
        this.listaTurnos=turnos
        this.listaAuxTurnos=turnos
        this.turnosCargados=true
      })
    }, 1500);
  }

  pacienteSeleccionado(paciente: any)
  {
    this.pacienteSelecionado = paciente;
   
    this.listaTurnos.forEach(value=>{
      if(value.paciente.uid === paciente.uid && value.especialista.uid === this.miUsuario.uid)
      {
        this.turnoDePacienteSeleccionado.push(value);
      }
    })
    console.log(this.turnoDePacienteSeleccionado);
  }

  ngOnInit(): void {
  }

}
