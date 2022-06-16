import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Especialista } from '../entidades/especialista';
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
  tipoUsuarioLogueado:any;
  turnos:any

  nameCollectionTurnos:string='TurnosColeccion'
  listaTurnos:Turno[]=[]
  listaAuxTurnos:Turno[]=[]
  turnosCargados:boolean = false

  listadoEspecialidades:any[]=[]
  listadoEspecialistas:Especialista[]=[] 


  filtroEspecialista:boolean = false
  filtroEspecialidades:boolean = false
  activarFiltros:boolean = false
  filtroAplicado:boolean = false
  turnoSeleccionadoComentario:Turno = new Turno()
  formaComentario:FormGroup;



  
  constructor(public firebase : FirebaseService, private turnoService : TurnoService,private fb:FormBuilder, private ts :ToastrService) 
  {
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
          
          this.firebase.obtenerTodos('usuariosColeccion').subscribe(res=>{
          
            let especialistas:Especialista[]=[]
            res.forEach(value=>{
              if(value.tipoUsuario=='especialista' && value.uid == this.miUsuario.uid){
                let especialista = new Especialista(value.nombre,value.apellido,value.edad,value.dni,value.email,value.password,value.imgPerfil)
                especialista.especialidades = value.especialidades
                especialista.uid = value.uid
                especialistas.push(especialista)
              }
            })
          this.listadoEspecialistas=especialistas
        })


        this.firebase.obtenerTodos('especialidades').subscribe(res=>{
          if(this.tipoUsuarioLogueado=='especialista')
          {
            this.listadoEspecialidades = []
            res.forEach(x =>{
              console.log(res)
              this.miUsuario.especialidades.forEach(k => {
                console.log(k)
                if(x.valor ==  k.especialidad){
                  this.listadoEspecialidades.push(x)
                }
              })
            })
          }else if (this.tipoUsuarioLogueado !=='especialista'){
            this.listadoEspecialidades=res;
          }
        })
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
  
          //console.log('tipoUsuario obtenerTodos: ',this.miUsuario.tipoUsuario)
          console.log('tipoUsuario obtenerTodos, tipoUsuarioLogueado: ',this.tipoUsuarioLogueado)
          if(this.tipoUsuarioLogueado == 'especialista'){
            if(turno.especialista.uid === this.miUsuario.uid){
              turnos.push(turno)
            }  
          }else if(this.tipoUsuarioLogueado == 'paciente'){
            if(turno.paciente.uid === this.miUsuario.uid){
              turnos.push(turno)
              console.log(turno)
              console.log(turnos)
            } 
          }
        })
        this.listaTurnos=turnos
        console.log(this.listaTurnos)
        this.listaAuxTurnos=turnos
        this.turnosCargados=true
      })
    }, 3000);


    this.formaComentario = this.fb.group({
      'comentario':['',[Validators.required]],
    })

    //console.log('sigo estando en el constructor, tipoUsuarioLogueado: ',this.tipoUsuarioLogueado)
  }


  ngOnInit(): void {


  }

  obtenerTurnos(){
    return this.turnos
  }

  obtenerFechaFormateada(time){
    console.log("time", time)
    console.log("nanos", time.nanoseconds)
    return new Date(time.nanoseconds)
  }

  aceptarTurno1(turno:Turno){
    //turno.estado = "Aceptado"
    ///this.turnoService.modificarTurno(turno, turno.id)
  }
  
  cancelarTurno1(turno:Turno){
    //turno.estado = "Cancelado"
    //this.turnoService.modificarTurno(turno, turno.id)
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
        e = 'realizado'
        break;
      case 6:
        e = 'cancelado'
        break;     
    }
    return e;
  }
  // activarFiltrosUnicos(){
  //   this.activarFiltros =  !this.activarFiltros 
  //  }
 
   activarFiltroEspecialistas(){
     if(!this.filtroEspecialista){
       this.filtroEspecialidades=false
     }
     this.filtroEspecialista = !this.filtroEspecialista
     
   }
   activarFiltroEspecialidades(){
     if(!this.filtroEspecialidades){
       this.filtroEspecialista=false
     }
     this.filtroEspecialidades = !this.filtroEspecialidades
   }
 
   eliminarFiltros(){
     this.listaTurnos = this.listaAuxTurnos
     this.filtroEspecialista=false
     this.filtroEspecialidades=false
     this.filtroAplicado=false
 
   }
 
   seleccionarTurnoParaComentario(turno:Turno){
    this.turnoSeleccionadoComentario = turno
  }

   seleccionarEspecialistaParaFiltrar(especialista:Especialista){
     this.filtrarTurnosxEspecialista(especialista)
     this.filtroAplicado=true
     this.filtroEspecialista=false
   }
   seleccionarEspecialidadParaFiltrar(especialidad:any){
     this.filtrarTurnosxEspecialidad(especialidad)
     this.filtroAplicado=true
     this.filtroEspecialidades=false
   }

   filtrarTurnosxEspecialista(esp:Especialista){
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

  justificarCancelamiento(turno: Turno)
  {
    console.log(turno.estadoTurno)
    this.seleccionarTurnoParaComentario(turno)
  }

  cancelarTurno()
  {
    this.turnoService.tmodificarPropiedad(this.turnoSeleccionadoComentario.id,{comentario:this.formaComentario.value.comentario})
    .then(rta=>{
      this.formaComentario.setValue({comentario:''})
      this.turnoService.modificarEstado(this.turnoSeleccionadoComentario.id,6,this.obtenerEstadoTurno(6))
      .then(rta=>{
        this.ts.info('Turno cancelado')
      })
      .catch(err=>{
        console.log('error editar estado' + err)
      })
    })
    .catch(err=>{
      console.log('error editar comentario' + err)
    })

  }


  // case 2:
  //   e = 'aceptado'

  aceptarTurno(turno: Turno)
  {
    console.log(turno.id)
    this.turnoService.tmodificarPropiedad(turno.id,{comentario:this.formaComentario.value.comentario})
    .then(rta=>{
      this.formaComentario.setValue({comentario:''})
      this.turnoService.modificarEstado(turno.id,2,this.obtenerEstadoTurno(2))
      .then(rta=>{
        this.ts.info('Turno aceptado')
      })
      .catch(err=>{
        console.log('error editar estado' + err)
      })
    })
    .catch(err=>{
      console.log('error editar comentario' + err)
    })
  }



}
