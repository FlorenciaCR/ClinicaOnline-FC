import { Component, OnInit } from '@angular/core';
import { Especialidad } from '../interfaces/especialidad';
import { Turno } from '../interfaces/turno';
import { EspecialidadesService } from '../servicios/especialidades.service';
import { FirebaseService } from '../servicios/firebase.service';
import { HorarioService } from '../servicios/horario.service';
import { TurnoService } from '../servicios/turno.service';

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

  constructor(
    private firebaseService: FirebaseService,
    private especialidadesService: EspecialidadesService,
    private turnoService: TurnoService,
    private horarioService: HorarioService) {

    especialidadesService.obtenerEspecialidades().subscribe(x => {
      this.especialidades = x
      
    })

    firebaseService.usuariosObs.subscribe(x => {
      this.especialistas = x.filter(k => k.tipoUsuario == "especialista")
    })

    turnoService.turnos.subscribe(x => {
      this.turnos = x
    })

    horarioService.traerHorarios().subscribe(x => {
      this.horarios = x
    })

  }

  ngOnInit(): void {
  }

  obtenerEspecialidades() {
    return this.especialidades
  }

  obtenerHorariosDisponibles() {
    if(this.datos.especialista == null){
      return []
    }
    let hor = this.horarios.filter(x => x.especialistaId == this.datos.especialista?.uid)
    let horariosDisponibles = []
    if (hor) {
      hor = hor[0]
      let turnosEspecialista = this.turnos.filter(x => x.especialistaId == this.datos.especialista?.uid)

      if(turnosEspecialista.find(x => (new Date(x.fecha.nanoseconds).getHours() % 12  || 12) == 8) == null){
        horariosDisponibles.push("08:00")
      }
      if(turnosEspecialista.find(x => (new Date(x.fecha.nanoseconds).getHours() % 12  || 12) == 9) == null){
        horariosDisponibles.push("09:00")
      }
      if(turnosEspecialista.find(x => (new Date(x.fecha.nanoseconds).getHours() % 12  || 12) == 10) == null){
        horariosDisponibles.push("10:00")
      }
      if(turnosEspecialista.find(x => (new Date(x.fecha.nanoseconds).getHours() % 12  || 12) == 11) == null){
        horariosDisponibles.push("11:00")
      }
    }
    return horariosDisponibles
  }

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
    turno.pacienteId = this.firebaseService.usuarioLogueado.id
    turno.estado = "Nuevo"
    turno.especialistaId = this.datos.especialista.uid
    turno.nombreEspecialidad = this.datos.especialidad

    this.turnoService.agregarTurno(turno)
    alert("Creado")
  }
}
