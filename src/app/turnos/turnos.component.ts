import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Especialista } from '../entidades/especialista';
import { Turno } from '../interfaces/turno';
import { FirebaseService } from '../servicios/firebase.service';
import { TurnoService } from '../servicios/turno.service';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss']
})
export class TurnosComponent implements OnInit {

  miUsuario:any;
  tipoUsuarioLogueado:any;
  nameCollectionTurnos:string='turnos'
  nameCEspecialidades:string='especialidades'
  nameCollectionUsers:string='usuariosColeccion'

  listaTurnos:Turno[]=[]
  listaAuxTurnos:Turno[]=[]

  listaEspedialidades:any[]=[] //especialidades
  listaEspeciaistas:Especialista[]=[] //especialista

  switchFiltroEspecialista:boolean = false
  switchFiltroEspecialidades:boolean = false
  switchActivarFiltros:boolean = false
  filtroAplicado:boolean = false
  
  turnosCargados:boolean = false
  turnoSelectedForComentary:Turno = new Turno()
  formaComentario:FormGroup;
  
  constructor(private fb:FormBuilder,private firebase:FirebaseService, private ts:ToastrService, private turnoservice : TurnoService) { 

    this.formaComentario = this.fb.group({
      'comentario':['',[Validators.required]],
    })

    this.firebase.getCurrentUser().subscribe(obs=>{
      if(obs!=null){
        this.firebase.getUsuario(obs.uid).subscribe(res=>{
          let aux = res.data();
          this.tipoUsuarioLogueado =aux?.['tipoUsuario'] 
          console.log('getCurrentUser tipoUsuarioLogueado: ',this.tipoUsuarioLogueado)
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
            password : aux?.['password']
          }
        })
      }
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
          turno.estadoTurno= inf.estadoTurno // pendiente
          turno.id= inf.id
          turno.atencionCalificada=inf.atencionCalificada
          turno.comentario=inf.comentario
          turno.resenia=inf.resenia
  
         turnos.push(turno);
        })
        console.log(this.listaTurnos)
        this.listaTurnos=turnos
        this.listaAuxTurnos=turnos
        this.turnosCargados=true
      })
    }, 3000);

    setTimeout(() => {
      this.firebase.obtenerTodos('usuariosColeccion').subscribe(res=>{

        let usuarios : Especialista[]=[];
        res.forEach(value=>{
          if(value.tipoUsuario==='especialista'){
            let especialista = new Especialista(value.nombre,value.apellido,value.edad,value.dni,value.email,value.password,value.imgsPerfil)
            especialista.especialidades = value.especialidad
            especialista.uid = value.uid
            usuarios.push(especialista)
          }
        })
        this.listaEspeciaistas= usuarios
      })
    }, 2000);
    this.firebase.obtenerTodos('especialidades').subscribe(res=>{
      this.listaEspedialidades=res;
    })

  }

  ngOnInit(): void {
  }


  activarFiltrosUnicos(){
    this.switchActivarFiltros =  !this.switchActivarFiltros 
   }
 
   activarFiltroEspecialistas(){
     if(!this.switchFiltroEspecialista){
       this.switchFiltroEspecialidades=false
     }
     this.switchFiltroEspecialista = !this.switchFiltroEspecialista
     
   }
   activarFiltroEspecialidades(){
     if(!this.switchFiltroEspecialidades){
       this.switchFiltroEspecialista=false
     }
     this.switchFiltroEspecialidades = !this.switchFiltroEspecialidades
   }
 
   eliminarFiltros(){
     this.listaTurnos = this.listaAuxTurnos
     this.switchFiltroEspecialista=false
     this.switchFiltroEspecialidades=false
     this.filtroAplicado=false
 
   }
 
 
   seleccionarEspecialistaParaFiltrar(especialista:Especialista){
     this.filtrarTurnosEspecialista(especialista)
     this.filtroAplicado=true
     this.switchFiltroEspecialista=false
   }
   seleccionarEspecialidadParaFiltrar(especialidad:any){
     this.filtrarTurnosxEspecialidad(especialidad)
     this.filtroAplicado=true
     this.switchFiltroEspecialidades=false
   }
   seleccionarTurnoParaComentario(turno:Turno){
     this.turnoSelectedForComentary = turno
   }
 
 
   filtrarTurnosEspecialista(esp:Especialista){
     let listaFiltrada = this.listaAuxTurnos.filter(value=> {
       return value.especialista.uid == esp.uid 
       })
     this.listaTurnos=listaFiltrada
   }
 
   filtrarTurnosxEspecialidad(especialidad:any){
     let listaFiltrada = this.listaAuxTurnos.filter(value=> {
       return value.especialidad.id == especialidad.id 
       })
     this.listaTurnos=listaFiltrada
   }

   justiciarCancelamiento(turno:Turno)
   {
    console.log(turno)
    this.seleccionarTurnoParaComentario(turno)
   }
   
   cancelarTurno(){
    
    this.turnoservice.tmodificarPropiedad(this.turnoSelectedForComentary.id,{comentario:this.formaComentario.value.comentario})
    .then(rta=>{
      console.log('editado el  Comentario ')
      this.formaComentario.setValue({comentario:''})
      this.turnoservice.modificarEstado(this.turnoSelectedForComentary.id,6,this.obtenerEstadoTurno(6))
      .then(rta=>{
        console.log('Turno cancelado ')
        this.ts.info('Turno cancelado')
       //actualizar listados 
      })
      .catch(err=>{
        console.log('error al editar el estado ' + err)
      })
    })
    .catch(err=>{
      console.log('error al editar el cometnario ' + err)
    })
  }
  obtenerEstadoTurno(n:number){
    let e = '-';
    switch(n){
      case 1:
        e = 'pendiente'
        break;
      case 2:
        e = 'aceptado'
        break;
      case 3:
        e = 'realizado'
        break;
      case 6:
        e = 'cancelado'
        break;     
    }
    return e;
  }


}
