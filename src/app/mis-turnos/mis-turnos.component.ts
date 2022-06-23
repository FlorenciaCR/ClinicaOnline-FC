import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ok } from 'assert';
import { ToastrService } from 'ngx-toastr';
import { Especialista } from '../entidades/especialista';
import { HistoriaClinica } from '../entidades/HistoriaClinica';
import { Paciente } from '../entidades/paciente';
import { Turno } from '../interfaces/turno';
import { FirebaseService } from '../servicios/firebase.service';
import { TurnoService } from '../servicios/turno.service';
var uniqid = require('uniqid'); 

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss']
})
export class MisTurnosComponent implements OnInit {

  miUsuario:any
  tipoUsuarioLogueado:any;
  turnos:any

  
  historiaClinica = new HistoriaClinica()

  nameCollectionTurnos:string='TurnosColeccion'
  listaTurnos:Turno[]=[]
  listaAuxTurnos:Turno[]=[]
  turnosCargados:boolean = false

  listadoEspecialidades:any[]=[]
  listadoEspecialistas:Especialista[]=[] 
  listadoPacientes:Paciente[]=[]

  filtroxPalabra:boolean = false;
  filtroPaciente:boolean = false
  filtroEspecialista:boolean = false
  filtroEspecialidades:boolean = false
  activarFiltros:boolean = false
  filtroAplicado:boolean = false
  turnoSeleccionadoComentario:Turno = new Turno()
  formaComentario:FormGroup;
  formaEncuesta:FormGroup;
  formaCalificacion:FormGroup;
  formaFinalizar:FormGroup;
  formaDatoClave1:FormGroup;
  formaDatoClave2:FormGroup;
  rechazarTurno:boolean=false
  auxCalificacion:number=0
  formaAgregado1:FormGroup
  formaAgregado2:FormGroup
  formaAgregado3:FormGroup
  agregarDato1:boolean = false
  agregarDato2:boolean = false
  agregarDato3:boolean = false
  cantCamposNews = 0
  buscarPalabra:any;
  



  
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
            especialidad : aux?.['especialidad'],
            password : aux?.['password'],
            historialClinico : aux?.['historialClinico'],
            pacientesFinalizados : aux?.['pacientesFinalizados']
          }

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
          }, 3000);

          
        })
      }
      
    })
    
    this.firebase.obtenerTodos('usuariosColeccion').subscribe(res=>{
      let especialistas:Especialista[]=[];
      let pacientes:Paciente[]=[];

      res.forEach(value=>{
        if(value.tipoUsuario=='especialista')
        {
          let especialista = new Especialista(value.nombre,value.apellido,value.edad,value.dni,value.email,value.password,value.imgPerfil)
          especialista.especialidades = value.especialidades
        
          especialista.pacientesFinalizados = value?.['pacientesFinalizados']
          
          especialista.uid = value.uid
          especialistas.push(especialista)
        }else if(value.tipoUsuario=='paciente')
        {
          let paciente = new Paciente(value.nombre,value.apellido,value.edad,value.dni,value.email,value.password,value.imgsPerfil)
          paciente.tipoUsuario= value.tipoUsuario
          paciente.obraSocial = value.obraSocial
          paciente.historialClinico = value.historialClinico
          paciente.uid = value.uid
          pacientes.push(paciente)
        }
      })
    this.listadoEspecialistas=especialistas;
    console.log(this.listadoPacientes);
    this.listadoPacientes=pacientes;
    })
  //listadoEspecialidades
    this.firebase.obtenerTodos('especialidades').subscribe(res=>{
    this.listadoEspecialidades=res;
    })


    this.formaComentario = this.fb.group({
      'comentario':['',[Validators.required]],
    })

    this.formaEncuesta = this.fb.group({

      'recomendar':['',[Validators.required,]],
      'sugerencia':['',[Validators.required,]],
      
      // 'opinion':['',[Validators.required,]],
      // 'sugerencia':['',[Validators.required,]],
     
    })
    this.formaCalificacion = this.fb.group({
      'calificacion':['',[Validators.required,]],
    })

    this.formaFinalizar = this.fb.group({
      'comentario':['',[Validators.required,]],
      'diagnostico':['',[Validators.required,]],
      'altura':['',[Validators.required,]],
      'peso':['',[Validators.required,]],
      'temperatura':['',[Validators.required,]],
      'presion':['',[Validators.required,]]
    })

    this.formaAgregado1 = this.fb.group({
      'clave1':['',[Validators.required,]],
      'valor1':['',[Validators.required,]],
    })
    this.formaAgregado2 = this.fb.group({
      'clave2':['',[Validators.required,]],
      'valor2':['',[Validators.required,]],
    })
    this.formaAgregado3 = this.fb.group({
      'clave3':['',[Validators.required,]],
      'valor3':['',[Validators.required,]],
    })
    

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

  activarFiltrosGenerico(filtro:string){
    switch(filtro){
      case 'Especialista':
        if(!this.filtroEspecialista){
          this.filtroEspecialidades=false       
        }
        this.filtroEspecialista = !this.filtroEspecialista       
        break;
      case 'Paciente':
        if(!this.filtroPaciente){
          this.filtroEspecialidades=false         
        }
        this.filtroPaciente = !this.filtroPaciente    
        break;
      case 'Especialidad':
        if(!this.filtroEspecialidades){
          this.filtroEspecialista=false
        }
       
        if(this.miUsuario.tipoUsuario=='especialista'){
         this.listadoEspecialidades = this.miUsuario.especialidades;
        }
        this.filtroEspecialidades = !this.filtroEspecialidades
        break;
    }
  }



  // activarFiltrosUnicos(){
  //   this.activarFiltros =  !this.activarFiltros 
  //  }
  activarFiltroPacientes()
  {
    if(!this.filtroPaciente){
      this.filtroEspecialidades=false
    }
    this.filtroPaciente = !this.filtroPaciente
  }
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
    console.log(this.miUsuario.especialidad)
    if(this.miUsuario.tipoUsuario=='especialista'){
     this.listadoEspecialidades = this.miUsuario.especialidades
     //this.listadoEspecialidades = this.miUsuario.especialidad
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

  filtroPalabra(event:any)
  {
    this.buscarPalabra = event.value
    console.log(this.buscarPalabra)
    let listaFiltrada:Turno[]=[] 

    this.listaAuxTurnos.forEach(value=>{
      if( value.comentario.includes(this.buscarPalabra)||
      value.resenia.includes(this.buscarPalabra)||
      
      value.paciente.nombre.includes(this.buscarPalabra)||
      value.paciente.apellido.includes(this.buscarPalabra)||
      value.paciente.edad.toString().includes(this.buscarPalabra)||
      value.paciente.dni.toString().includes(this.buscarPalabra)||
      value.paciente.obraSocial.includes(this.buscarPalabra)||
      
      value.especialista.nombre.includes(this.buscarPalabra)||
      value.especialista.apellido.includes(this.buscarPalabra)||
      value.especialista.edad.toString().includes(this.buscarPalabra)||
      value.especialista.dni.toString().includes(this.buscarPalabra)||
      value.especialista.email.includes(this.buscarPalabra) ||
      value.especialidad.especialidad.includes(this.buscarPalabra)||
      value.fecha.toDateString.toString().includes(this.buscarPalabra)||
      value.fecha.toLocaleDateString().includes(this.buscarPalabra)){
        this.filtroxPalabra=true
        this.filtroAplicado=true
        listaFiltrada.push(value)
      }
  })
    if(listaFiltrada.length>0){
      this.listaTurnos=listaFiltrada
    }
  }


  seleccionarPacienteParaFiltrar(paciente:Paciente){
    this.filtrarTurnosxPaciente(paciente)
    this.filtroAplicado=true
    this.filtroPaciente=false
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

   filtrarTurnosxPaciente(esp:Paciente){
    let listaFiltrada = this.listaAuxTurnos.filter(value=> {
      return value.paciente.uid == esp.uid 
      })
    this.listaTurnos=listaFiltrada
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

  justificarCancelamiento(turno: Turno, rechazado=0)
  {
    console.log(turno.estadoTurno)
    this.seleccionarTurnoParaComentario(turno)
    if(rechazado){
      this.rechazarTurno=true
    }
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
//1 pendiente, 2 aceptado, 3 realizado, 4 rechazado, 6 cancelado
  cancelarTurno()
  {
    this.turnoService.tmodificarPropiedad(this.turnoSeleccionadoComentario.id,{comentario:this.formaComentario.value.comentario})
    .then(rta=>{
      this.formaComentario.setValue({comentario:''})
                                      //(idTurno:string|undefined,status_:number):
                      //(idTurno:string|undefined,estadoTurno:number, nombreEstado:string):
      this.turnoService.modificarEstado(this.turnoSeleccionadoComentario.id,this.rechazarTurno?4:6,this.rechazarTurno?this.obtenerEstadoTurno(4):this.obtenerEstadoTurno(6))
      .then(rta=>{
        this.ts.info(this.rechazarTurno?'Se rechazo el turno':'Se cancelo el turno ')
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
    this.turnoService.modificarEstado(turno.id,2,this.obtenerEstadoTurno(2))
    .then(rta=>{
      this.ts.info('Turno aceptado')
    })
    .catch(err=>{
      console.log('error editar estado' + err)
    })
  }

  realizarEncuesta(turno:Turno){
    console.log(turno)
    this.seleccionarTurnoParaComentario(turno)
  }

  // 'recomendar':['',[Validators.required,]],
  // 'sugerencia':['',[Validators.required,]],
  hacerEncuesta(){
     console.log(this.formaEncuesta.value)
     this.turnoService.tmodificarPropiedad(this.turnoSeleccionadoComentario.id,{encuestaCompletada:true,encuesta:{recomendar:this.formaEncuesta.value.recomendar,sugerencia:this.formaEncuesta.value.sugerencia}})
     .then(rta=>{
      this.formaEncuesta.setValue({recomendar:' ',sugerencia:' '})
      console.log('Encuesta completada!');
      this.ts.success('Encuesta completada');
     })
     .catch(err=>{
      console.log('error al enviar la encuesta'+ err)
     })
  }

//realizarCalificacion
  calificar(turno:Turno){
    console.log("turno calificar",turno)
    this.seleccionarTurnoParaComentario(turno)
  }

  //enviar
  hacerCalificacion(){
    console.log("value calificacion", this.formaCalificacion.value)
    console.log("calificacion", {puntaje:this.auxCalificacion,comentario:this.formaCalificacion.value.calificacion})
    console.log("turno id", this.turnoSeleccionadoComentario.id)
     this.turnoService.tmodificarPropiedad(this.turnoSeleccionadoComentario.id,{calificacion:{puntaje:this.auxCalificacion,comentario:this.formaCalificacion.value.calificacion}})
     .then(rta=>{
      this.formaCalificacion.setValue({comentarioCalificacion:'',})

      console.log('Calificacion hecha')
     })
     .catch(err=>{
      console.log('error en calificacion'+ err)
     })
  }

  // guardarHistorial()
  // {
  //   console.log(this.formaHistorial.value);
  // }

    //FUNCION QUE HACE HISTORIAL Y FINALIZA TURNO
    finalizarTurnoCrearHistorial()
    {
      //turnoSeleccionadoComentario
      //this.turnoSeleccionadoComentario.especialista.nombre
      //this.turnoSeleccionadoComentario.paciente.nombre

      this.historiaClinica.turno = this.turnoSeleccionadoComentario
      this.historiaClinica.id=uniqid()
      this.historiaClinica.altura = this.formaFinalizar.value.altura
      this.historiaClinica.peso= this.formaFinalizar.value.peso
      this.historiaClinica.presion = this.formaFinalizar.value.presion 
      this.historiaClinica.temperatura = this.formaFinalizar.value.temperatura
      if(!this.formaAgregado1.invalid){
        let auxClave:string = this.formaAgregado1.value.clave1  //
        let auxValor = this.formaAgregado1.value.valor1 
        let objAux  = {clave:auxClave,valor:auxValor}
        this.historiaClinica.anexos.push(objAux) 
      }
      if(!this.formaAgregado2.invalid){
        let auxClave2 = this.formaAgregado2.value.clave2
        let auxValor2 = this.formaAgregado2.value.valor2
        let objAux  = {clave:auxClave2,valor:auxValor2}
        this.historiaClinica.anexos.push(objAux)
      }
      if(!this.formaAgregado3.invalid){
        let auxClave3 = this.formaAgregado3.value.clave3
        let auxValor3 = this.formaAgregado3.value.valor3
        let objAux  = {clave:auxClave3,valor:auxValor3} 
        this.historiaClinica.anexos.push(objAux)
      }

    let pacienteActualizado = this.listadoPacientes.find(value=>{
      return  value.uid === this.turnoSeleccionadoComentario.paciente.uid
    }) 

    let arrPacienteNuevo= pacienteActualizado?.historialClinico;
    arrPacienteNuevo?arrPacienteNuevo.push(JSON.parse(JSON.stringify(this.historiaClinica))):null

    let pacienteActualizado2 = {historialClinico:arrPacienteNuevo}
    console.log(pacienteActualizado2) 

   this.turnoService.umodificarPropiedad(this.turnoSeleccionadoComentario.paciente.uid,pacienteActualizado2)
    .then(value=>{
      this.ts.success('Se agrego el historial clinico')
      //lert('AGREGADO CON EXITO')
      this.closeModalHistorialClinico()
    })
    .catch(err=>{
      this.ts.error('Error historial clinico')
      console.log('error guardando la historia clinica en el paciente.'+err)
      this.closeModalHistorialClinico()
    }) 
  
      let especialistaActual = this.listadoEspecialistas.find(value=> {return value.uid === this.turnoSeleccionadoComentario.especialista.uid});

      let pacientesAtendidos = especialistaActual?especialistaActual.pacientesFinalizados:[];

      this.turnoService.modificarEstado(this.turnoSeleccionadoComentario.id,3,this.obtenerEstadoTurno(3))
      this.turnoService.tmodificarPropiedad(this.turnoSeleccionadoComentario.id,{diagnostico:this.formaFinalizar.value.diagnostico,comentario:this.formaFinalizar.value.comentario})
      .then(value=>{
        if(pacientesAtendidos.includes(this.turnoSeleccionadoComentario.paciente.uid))
        {

        }else{

          pacientesAtendidos.push(this.turnoSeleccionadoComentario.paciente.uid);
        }
        this.turnoService.umodificarPropiedad(this.turnoSeleccionadoComentario.especialista.uid,{pacientesFinalizados:pacientesAtendidos})
        .then(res=>{
          console.log("pacientes atendidos ok(?)")
        })
        .catch(err=>{
          console.log("error al actualizar pacientes atendidos")
        })




      this.ts.success('Turno finalizado');
        console.log('turno finalizado con exito')
      })
      .catch(err=>{
        this.ts.success('Error Turno finalizado');
        console.log('ERROR FINALIZANDO EL TURNO'+err)
      })
    }

    closeModalHistorialClinico(){
      let modal =  (<HTMLInputElement> document.getElementById('exampleModal5'))   
      modal.setAttribute('data-dismiss','modal');
    //.setAttribute('data-dismiss','modal');
    }

    agregarCampo(){
      if(!this.agregarDato1){
        this.agregarDato1=true
      }else if(this.agregarDato1 &&  !this.agregarDato2 ){
        this.agregarDato2=true
      }else if(this.agregarDato2 && !this.agregarDato3){
        this.agregarDato3=true
      }
    }
  

}
