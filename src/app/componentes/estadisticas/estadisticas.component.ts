import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Chart } from 'node_modules/chart.js'
import { Turno } from 'src/app/interfaces/turno';
//import Chart from 'chart.js/auto';
//import { Chart, registerables } from 'chart.js';
//import { Chart, registerables } from 'chart.js';



@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {

  listaLogs: any;
  myChart:any;
  listaTurnos:Turno[]=[]
  listaEspecialidades:any[]=[] //especialidades
  turnosCargados:boolean = false
  especialidadesCargadas:boolean=false
  datosListosTurnosxEspecialidades:boolean = false
  datosListosTurnosxDias:boolean = false;
  spinner:boolean=true;

  dataLabel1:any;
  serie1:any;

  dataLabel2:any;
  serie2:any;



  constructor(private firebase : FirebaseService) 
  {

    setTimeout(() => {
      
      this.firebase.obtenerTodos('logUsuarios').subscribe(
        resp=>{
          this.listaLogs = resp;
          console.log('listalogs',this.listaLogs);
      });
    }, 1000);

  
    this.firebase.obtenerTodos('turnos').subscribe(res=>{
        
      let arrayTurnos:Turno[]=[]
      res.forEach(value=>{

          let turno = new Turno()
          turno.duracion = value.duracion
          turno.especialidad= value.especialidad
          turno.especialista = value.especialista
          turno.paciente = value.paciente
          turno.fecha = new Date(value.fecha) 
          turno.estadoTurno= value.estadoTurno
          turno.id= value.id
          turno.calificacion=value.calificacion
          turno.comentario=value.comentario
          turno.resenia=value.resenia

          arrayTurnos.push(turno)

              
      })
      console.log(arrayTurnos)
      this.turnosCargados=true
      this.listaTurnos=arrayTurnos
    })
    this.firebase.obtenerTodos('especialidades').subscribe(res=>{
      this.listaEspecialidades= res
      console.log(this.listaEspecialidades)
      this.especialidadesCargadas=true
    })


  }

  ngOnInit(): void {

    
    setTimeout(() => {
      
      this.turnoxEspecialidad();
      this.turnosxDia();
      this.turnoxEspecialidadGrafico();
      this.turnoxDiaGrafico();

      this.spinner=false;
    }, 3000);

  }

  turnoxEspecialidad()
  {
    let auxListaEspecialidades = this.listaEspecialidades.map(value=>{
      return {id:value.id,name:value.especialidad,cantidad:0} 
    })

    //recorro los turnos
    this.listaTurnos.forEach(turno=>{
      auxListaEspecialidades.forEach(especialidad=>{
        if(especialidad.id === turno.especialidad.id){
          especialidad.cantidad++
        }
      })
    })


    let auxLabelsGraficoTurnoxEspecialidades:any[]=[]
    let auxValuesGraficoTurnoxEspecialidades:number[]=[]

    auxListaEspecialidades.forEach(value=>{
      auxLabelsGraficoTurnoxEspecialidades.push(value.name)
      auxValuesGraficoTurnoxEspecialidades.push(value.cantidad)
    })

    this.dataLabel1= auxLabelsGraficoTurnoxEspecialidades
    this.serie1 = auxValuesGraficoTurnoxEspecialidades
    console.log(this.dataLabel1);
    console.log(this.serie1)

    //this.data.series=auxSerie

    this.datosListosTurnosxEspecialidades=true
  }

  turnosxDia(){
    let auxListaDiasTurnos = this.listaTurnos.map(value=>{
      let auxDate = new Date(value.fecha)
      return {fecha:auxDate} 
    })

    console.log('DIAS DE LOS TURNOS ')
    console.log(auxListaDiasTurnos)

    let diasTurnosUnicos:any[]=[]

    auxListaDiasTurnos.forEach(value=>{
      let auxDiaString = value.fecha.toLocaleDateString()

      if(!diasTurnosUnicos.includes(auxDiaString)){
        diasTurnosUnicos.push(auxDiaString)
      }
      
    })
    console.log('DIAS DE LOS TURNOS UNICOS ')
    console.log(diasTurnosUnicos)

    //Lista de los dias SIN REPETIR de todos los turnos.
    let auxListaDiasTurnoConCantidad = diasTurnosUnicos.map(value=>{
      return {fecha:value,cantidad:0}
    })

    console.log('DIAS DE LOS TURNOS UNICOS SIN CANTIDADES ')
    console.log(auxListaDiasTurnoConCantidad) 

  
     //recorro los turnos buscando las fechas. 
     this.listaTurnos.forEach(turno=>{
      let auxFechaTurnoActual = new Date(turno.fecha)
      auxListaDiasTurnoConCantidad.forEach(diaWithCantidad=>{
        if(diaWithCantidad.fecha === auxFechaTurnoActual.toLocaleDateString()){
          diaWithCantidad.cantidad++
        }
      })
    })

    console.log('DIAS DE LOS TURNOS UNICOS CON CANTIDADES ACTUALIZADAS ')
    console.log(auxListaDiasTurnoConCantidad) 

    let auxLabelsGraficoTurnoxDia:any[]=[]
    let auxValuesGraficoTurnoxDia:number[]=[]

    auxListaDiasTurnoConCantidad.forEach(value=>{
      auxLabelsGraficoTurnoxDia.push(value.fecha)
      auxValuesGraficoTurnoxDia.push(value.cantidad)
    })

    this.dataLabel2=auxLabelsGraficoTurnoxDia
    //let auxSerie = [auxValuesGraficoTurnoxDia]
    this.serie2=auxValuesGraficoTurnoxDia

    this.datosListosTurnosxDias=true

  }

//////////////////////////////////////////////////

  turnoxEspecialidadGrafico(){
  const myChart = new Chart('myChart', {
    type: 'line',
    data: {
        labels: this.dataLabel1,
        datasets: [{
            label: '# turnos',
            data: this.serie1,
            fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
    }
});
  }

  turnoxDiaGrafico()
  {
    const myChart = new Chart('myChart2', {
    type: 'doughnut',
     data : {
      labels: this.dataLabel2,
      datasets: [{
        label: 'My First Dataset',
        data: this.serie2,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
      }
    })
  }

  logsTipoUsuario()
  {
    let lista = this.listaLogs.map(value=>{
      return {id:value.id,}
    })
  }

  

  

  

}
