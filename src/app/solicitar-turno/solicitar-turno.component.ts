import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Especialista } from '../entidades/especialista';
import { Paciente } from '../entidades/paciente';
import { Especialidad } from '../interfaces/especialidad';
import { Turno } from '../interfaces/turno';
import { EspecialidadesService } from '../servicios/especialidades.service';
import { FirebaseService } from '../servicios/firebase.service';
import { HorarioService } from '../servicios/horario.service';
import { TurnoService } from '../servicios/turno.service';
var uniqid = require('uniqid'); 
@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})

export class SolicitarTurnoComponent implements OnInit {

  especialidades: any
  especialistas: any

  turnos: any
  horarios: any

  datos = {
    especialidad: null,
    fecha: null,
    especialistaId: null,
    especialista: null,
    horarioSeleccionado: null
  }

  horariosMañana = ["08:00", "09:00", "10:00", "11:00"]
  horariosTarde = ["14:00", "15:00", "16:00", "17:00"]

  turno: Turno


    dias:Date[]=[] 
    listaPacientes:any[]=[]
    listaEspedialidades:any[]=[] 
    listaEspeciaistas:any[]=[] 
    disponibilidadEspecialista:number[]=[] 
    fechasDisponiblesParaTurno:Date[] = [] 
    horasDisponibles:Date[]=[]  
  
    tieneDiasDisponibles:boolean = true
    especialistaSelected:boolean = false 
    pacienteSelected:boolean = false
    isEspecialidadSelected:boolean = false
  
    especialistaSeleccionado: Especialista = new Especialista()
    especialidadSeleccionada:any
    PacienteSeleccionado:Paciente = new Paciente()
    fechaTurnoSelecciada:Date=new Date()
    horaSeleccionada:Date = new Date ()
    miUsuario: any;
    tipoUsuarioLogueado:any;
    horaSelected:boolean=false
 
  constructor(
    private firebaseService: FirebaseService,
    private especialidadesService: EspecialidadesService,
    private turnoService: TurnoService,
    private horarioService: HorarioService,
    private ts : ToastrService,
    private router : Router) 
    {
      firebaseService.usuariosObs.subscribe(x => {
        this.listaEspeciaistas = x.filter(k => k.tipoUsuario == "especialista")
      })
      
      firebaseService.usuariosObs.subscribe(x => {
        this.listaPacientes = x.filter(k => k.tipoUsuario == "paciente")
        console.log(this.listaPacientes)
      })

    especialidadesService.obtenerEspecialidades().subscribe(x => {
      this.especialidades = x
    })

    this.firebaseService.getCurrentUser().subscribe(obs=>{
      if(obs!=null){
        this.firebaseService.getUsuario(obs.uid).subscribe(res=>{
          let aux = res.data();
         
          this.tipoUsuarioLogueado =aux?.['tipoUsuario'] 
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
    
    // turnoService.turnos.subscribe(x => {
    //   this.turnos = x
    // })
    
    horarioService.traerHorarios().subscribe(x => {
      this.horarios = x
    })
  }

  ngOnInit(): void 
  {
    this.obtenerProximosDias();
  }

  obtenerEspecialidades() {
    return this.especialidades
  }

  // obtenerHorariosDisponibles() {
  //   if(this.datos.especialista == null){
  //     return []
  //   }
  //   let hor = this.horarios.filter(x => x.especialistaId == this.datos.especialista?.uid)
  //   let horariosDisponibles = []
  //   if (hor) {
  //     hor = hor[0]
  //     let turnosEspecialista = this.turnos.filter(x => x.especialistaId == this.datos.especialista?.uid)

  //     if(turnosEspecialista.find(x => (new Date(x.fecha.nanoseconds).getHours() % 12  || 12) == 8) == null){
  //       horariosDisponibles.push("08:00")
  //     }
  //     if(turnosEspecialista.find(x => (new Date(x.fecha.nanoseconds).getHours() % 12  || 12) == 9) == null){
  //       horariosDisponibles.push("09:00")
  //     }
  //     if(turnosEspecialista.find(x => (new Date(x.fecha.nanoseconds).getHours() % 12  || 12) == 10) == null){
  //       horariosDisponibles.push("10:00")
  //     }
  //     if(turnosEspecialista.find(x => (new Date(x.fecha.nanoseconds).getHours() % 12  || 12) == 11) == null){
  //       horariosDisponibles.push("11:00")
  //     }
  //   }
  //   return horariosDisponibles
  // }

  obtenerEspecialistas() {
    return this.especialistas?.filter(x => x.especialidades.includes(this.datos.especialidad))
  }

  obtenerTurnosEspecialista(especialistaId: string) {
    return this.turnos.filter(x => x.especialistaId == especialistaId).map(x => x.fecha)
  }

  obtenerFechaFormateada(time) {
    return new Date(time.nanoseconds)
  }

  seleccionarEspecialidad(especialidad: Especialidad) {
    this.datos.especialidad = especialidad.valor

  }

  seleccionarEspecialista(especialista: any) {
    this.datos.especialista = especialista
  }

  seleccionarHorario(horario: any) {
    this.datos.horarioSeleccionado = horario
  }

  crearTurno() {
    let partesHorario = this.datos.horarioSeleccionado.split(":")
    let date = new Date()
    date.setHours(partesHorario[0], partesHorario[1], 0)
    let turno = new Turno()
    turno.fecha = date
    //turno.pacienteId = this.firebaseService.usuarioLogueado.id
   // turno.estado = "Nuevo"
    //turno.especialistaId = this.datos.especialista.uid
    //turno.nombreEspecialidad = this.datos.especialidad

    this.turnoService.agregarTurno(turno)
    alert("Creado")
  }

  //----------------------------------------------------------------------------h
  seleccionarEspecialistah(item:Especialista){
    this.listaEspedialidades = item.especialidades
    this.especialistaSelected=true
    this.especialistaSeleccionado= item
  }

  seleccionarEspecialidadh(item:any){
    this.isEspecialidadSelected=true
    this.especialistaSeleccionado.especialidades.forEach(value=>{
      if(value.id === item.id){
        this.especialidadSeleccionada = value
        if(value.diasDisponibles.length>0)
        {
          this.disponibilidadEspecialista = value.diasDisponibles
        }else{
          this.tieneDiasDisponibles=false
        }        
      }
    })
    this.filtrarFechasDisponibles()
  }

  
  seleccionarFechaTurno(dia:Date)
  {
    console.log('dia selecc',dia)
    this.fechaTurnoSelecciada = dia
    this.obtenerHoras(dia,this.especialidadSeleccionada.disponibilidad)
  }

  seleccionarHora(hora:Date)
  {
    this.horaSeleccionada = hora
    this.horaSelected=true
    console.log('hora selecc',hora)
  }
  seleccionarPaciente(item:Paciente){
    this.pacienteSelected = true
    this.PacienteSeleccionado= item
  }

  obtenerProximosDias()
  {
    let date:Date = new Date();
    let dia:Date;
    for(let i = 1; i < 16; i++)
    {
      dia = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i);
      if(dia.toDateString().split(" ")[0] != "Sun")
      {
        this.dias.push(dia);
      }
    }
  } 

  filtrarFechasDisponibles()
  {
    this.dias.forEach(proximoDia=>{
      this.disponibilidadEspecialista.forEach(diaDisponibleEspecialista=>{
            if(proximoDia.getDay() === diaDisponibleEspecialista){
              this.fechasDisponiblesParaTurno.push(proximoDia)
            }
        })
    })
    let fecha = new Date()
    let hr2 = this.fechaTurnoSelecciada.setHours(8,0)
    console.log('Hora actual: ',fecha)
  }

//Se obtieenn las horas del dia seleccionado del especialista para elegir TURNO
  obtenerHoras(diaActual:Date,minutos:number){
    this.horasDisponibles = []
    const inicio =  new Date(diaActual)
    inicio.setHours(8,0)
    const fin =  new Date(diaActual)
    fin.setHours(19,0)
    const UN_MINUTO_EN_MILISEGUNDOS = 1000 * 60;
    const INTERVALO = UN_MINUTO_EN_MILISEGUNDOS * minutos;
    for (let i = inicio; i <= fin; i = new Date(i.getTime() + INTERVALO))
    {
      this.horasDisponibles.push(i)
      console.log(`${i.getHours()}:${i.getMinutes()}`);
    }
  }

  hacerTurno(){
    let miTurno = new Turno()
    let id = uniqid()

    if(this.miUsuario.tipoUsuario== 'paciente'){
      miTurno.paciente = this.miUsuario
    }else if (this.miUsuario.tipoUsuario== 'administrador'){
      miTurno.paciente = this.PacienteSeleccionado
    }
    miTurno.duracion = this.especialidadSeleccionada.disponibilidad
    miTurno.especialista = this.especialistaSeleccionado
    miTurno.especialidad=this.especialidadSeleccionada
    miTurno.fecha=this.horaSeleccionada
    miTurno.estadoTurno=1 // pendiente
    miTurno.id=id
  
    console.log('Turno: '+ miTurno);
     let seGuardo = this.firebaseService.crearDocumentoConIdEnCol('turnos',id,JSON.parse(JSON.stringify(miTurno)))
     seGuardo.status? this.ts.success('Se creo el turno!') : this.ts.error('No se pudo crear el turno.');
     !seGuardo.status && setTimeout(()=>{
      window.location.reload()
    },2000)
     seGuardo.status && this.router.navigate(['bienvenido'])    
  }





}
