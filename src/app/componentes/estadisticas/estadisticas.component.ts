import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import jsPDF from 'jspdf';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Chart } from 'node_modules/chart.js'
import { Turno } from 'src/app/interfaces/turno';
import * as XLSX from 'xlsx'; 
//import Chart from 'chart.js/auto';
//import { Chart, registerables } from 'chart.js';
//import { Chart, registerables } from 'chart.js';
import html2canvas from 'html2canvas';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Especialista } from 'src/app/entidades/especialista';


@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {

  listaLogs: any;
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

  dataLabel3:any;
  serie3:any;

  dataLabel4:any;
  serie4:any;

  showFechasTurnoSolicitados:boolean = false
  showFechasTurnoFinalizado:boolean = false
  showLogs:boolean = false
  formaFechas:FormGroup;
  formaFechas2:FormGroup;

  hayDatosTurnoFinalizado:boolean=false
  hayDatosTurnoSolicitado:boolean=false
  datosListosTurnosSolicitados:boolean = false
  showEspecialistas:boolean=false
  showEspecialistas2:boolean=false
  especialistaSelected:Especialista = new Especialista();
  datosListosTurnosFinalizados:boolean=false
  fechaInicioTurnosFinalizados:Date = new Date()
  fechaFinalTurnosFinalizados:Date = new Date()
  fechaInicioTurnosSolicitado:Date = new Date()
  fechaFinalTurnosSolicitado:Date = new Date()


  fileName:any='LogsUsuariosExcel.xlsx'  
  @ViewChild ('graficospdf', {static: false}) el! : ElementRef
  @ViewChild ('graficospdf2', {static: false}) el2! : ElementRef
  @ViewChild ('graficospdf3', {static: false}) el3! : ElementRef

  
  constructor(private firebase : FirebaseService,private fb:FormBuilder,private dateAdapter:DateAdapter<Date>,) 
  {
    this.dateAdapter.setLocale('es-ES');

    setTimeout(() => {
      
      this.firebase.obtenerTodos('logUsuarios').subscribe(
        resp=>{
          this.listaLogs = resp;
          //console.log('listalogs',this.listaLogs);
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

    this.formaFechas = this.fb.group({
      'fechaInicio':['',[Validators.required,]],
      'fechaFinal':['',[Validators.required,]],
    })
    this.formaFechas2 = this.fb.group({
      'fechaInicio':['',[Validators.required,]],
      'fechaFinal':['',[Validators.required,]],
    })


  }

  ngOnInit(): void {
    setTimeout(() => {
      this.turnoxEspecialidad();
      this.turnosxDia();
      this.turnoxEspecialidadGrafico();
      this.turnoxDiaGrafico();
      // this.turnosRealizadosTempGrafico();
      // this.turnosSolicitadosTempGrafico();
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

    let diasTurnosUnicos:any[]=[]

    auxListaDiasTurnos.forEach(value=>{
      let auxDiaString = value.fecha.toLocaleDateString()

      if(!diasTurnosUnicos.includes(auxDiaString)){
        diasTurnosUnicos.push(auxDiaString)
      }
      
    })

    let auxListaDiasTurnoConCantidad = diasTurnosUnicos.map(value=>{
      return {fecha:value,cantidad:0}
    })

     this.listaTurnos.forEach(turno=>{
      let auxFechaTurnoActual = new Date(turno.fecha)
      auxListaDiasTurnoConCantidad.forEach(diaWithCantidad=>{
        if(diaWithCantidad.fecha === auxFechaTurnoActual.toLocaleDateString()){
          diaWithCantidad.cantidad++
        }
      })
    })

    let auxLabelsGraficoTurnoxDia:any[]=[]
    let auxValuesGraficoTurnoxDia:number[]=[]

    auxListaDiasTurnoConCantidad.forEach(value=>{
      auxLabelsGraficoTurnoxDia.push(value.fecha)
      auxValuesGraficoTurnoxDia.push(value.cantidad)
    })


    this.dataLabel2=auxLabelsGraficoTurnoxDia
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

  exportexcel(): void 
  {
    
     /* table id is passed over here */   
     let element = document.getElementById('excel-table'); 
     const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     /* save to file */
     XLSX.writeFileXLSX(wb, this.fileName);
    
  }
  
  crearPDFturnos()
  {
   let pdf = new jsPDF('p','pt','a4');
   pdf.html(this.el.nativeElement,{
     callback:(pdf)=>{
       pdf.save(`grafico.pdf`);
     }
   })
 
  }

  crearPDFturnos2()
  {
   let pdf = new jsPDF('p','pt','a4');
   pdf.html(this.el2.nativeElement,{
     callback:(pdf)=>{
       pdf.save(`grafico2.pdf`);
     }
   })
 
  }

  crearPDFturnos3()
  {
   let pdf = new jsPDF('p','pt','a4');
   pdf.html(this.el3.nativeElement,{
     callback:(pdf)=>{
       pdf.save(`grafico3.pdf`);
     }
   })
 
  }

  mergeListaDias(lista:any[]){
    let listaMerge :any[]=[]

    lista.forEach(value=>{
      let auxDiaString = value.fecha.toLocaleDateString()

      if(!listaMerge.includes(auxDiaString)){
        listaMerge.push(auxDiaString)
      }
      
    })


    return listaMerge
  }
  mergeListaEspecialistas(lista:any[]){
    let listamergeEspecialista :any[]=[]

    lista.forEach(value=>{

      if(!listamergeEspecialista.includes(value)){
        listamergeEspecialista.push(value)
      }
      
    })


    return listamergeEspecialista
  }


  turnosSolicitadosTemp(fechaInicio:Date,fechaFinal:Date){

    // obtengo una copia de TODOS LOS TURNOS de la coleccion. 
    let auxTurnos:Turno[] = this.listaTurnos

    console.log('TURNOS COMPLETOS')
    console.log(auxTurnos)

     // FILTRO EXCLUSIVAMENTE POR LOS TURNOS QUE ESTEN DENTRO DEL RANDO INDICADO POR LAS FECHAS.
     let auxTurnosFiltradosxFechas = auxTurnos.filter(turno=>{
      let auxFechaTurnoActual = new Date(turno.fecha)
      console.log("fecha actual", auxFechaTurnoActual)
      console.log("fecha final", fechaFinal)
      fechaFinal.setHours(23)
      fechaFinal.setMinutes(59)
      fechaFinal.setSeconds(59)
      return auxFechaTurnoActual>=fechaInicio && auxFechaTurnoActual<=fechaFinal
    })

    //MAPEO LA LISTA PARA OBTENER TODOS LOS ESPECIALISTAS SEGUN LOS TURNOS, ADEMAS AÑADO CAMPO DE CANTIDAD. 
    let listaEspecialistasTurno = auxTurnosFiltradosxFechas.map(value=>{
    
      return {especialista:`${value.especialista.nombre} ${value.especialista.apellido}`,idEspecialista:value.especialista.uid,cantidad:0} 
    })

    console.log('array de turnos filtrados por las fechas indicadas. ya mapeados SIN FILTRAR')
    console.log(listaEspecialistasTurno)


    //PROBANDO FUNCIONES PARA FILTRAR EL ARRAY 
    var arrayConEspecialistasUnicos = listaEspecialistasTurno
    
    var hash :any = {};
     arrayConEspecialistasUnicos = arrayConEspecialistasUnicos.filter(current=>{
      var exists = !hash[current.idEspecialista?current.idEspecialista:''];
      hash[current.idEspecialista?current.idEspecialista:''] = true;
      return exists;
    });
    
    console.log('arrayConEspecialistasUnicos YA FILTRADO ')
    console.log(arrayConEspecialistasUnicos);

    let newArrayconCantidadesSinDuplicados =  arrayConEspecialistasUnicos

    //RECORRO TODOS LOS TURNOS Y VOY COMPARANDO POR LOS ESPECIALISTAS YA FILTRADOS
    auxTurnosFiltradosxFechas.forEach(turnoAuxiliar=>{
      newArrayconCantidadesSinDuplicados.forEach(especialstaSinRepetir=>{

        if(turnoAuxiliar.especialista.uid === especialstaSinRepetir.idEspecialista){
          especialstaSinRepetir.cantidad++
        }
      })
    })

    console.log('arrayConEspecialistasUnicos YA CON CANTIDAD')
    console.log(newArrayconCantidadesSinDuplicados);

    let auxLabelsTurnosSolicitados:any [] = []
    let auxValuesTurnosSolicitados:number [] = []

    newArrayconCantidadesSinDuplicados.forEach(value=>{
      //obtengo los LABELS Y LOS VALORES
      auxLabelsTurnosSolicitados.push(`${value.especialista}(${value.cantidad})`)
      auxValuesTurnosSolicitados.push(value.cantidad)
    })
    
    // this.dataLabel2=auxLabelsGraficoTurnoxDia
    // this.serie2=auxValuesGraficoTurnoxDia
    // this.datosListosTurnosxDias=true

    this.dataLabel3=auxLabelsTurnosSolicitados
    this.serie3=auxValuesTurnosSolicitados
    this.datosListosTurnosSolicitados=true

    console.log("serie 3 loaded", this.serie3)
    this.turnosSolicitadosTempGrafico()

    return true
  }

  turnosSolicitadosTempGrafico(){

    var lineChart = new Chart("myChart3", {
      type: 'bar',
      data: {
        labels: this.dataLabel3,
        datasets: [{
          label: "Turnos",
          data: this.serie3,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        }]
      },
      options: {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
    });

  
  }

  turnosRealizadosTempGrafico(){
    var lineChart = new Chart("myChart4", {
      type: 'polarArea',
      data: {
        labels: this.dataLabel4,
        datasets: [{
          label: "Turnos finalizados",
          data: this.serie4,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        }]
      },
      options: {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
    });
  }

  turnosRealizadosTemp(fechaInicio:Date,fechaFinal:Date){

    let retorno = false
    // obtengo una copia de TODOS LOS TURNOS de la coleccion. 
    let auxTurnos:Turno[] = this.listaTurnos

     // FILTRO EXCLUSIVAMENTE POR LOS TURNOS QUE ESTEN DENTRO DEL RANDO INDICADO POR LAS FECHAS.
     let auxTurnosFiltradosxFechas = auxTurnos.filter(turno=>{
      let auxFechaTurnoActual = new Date(turno.fecha)
      return auxFechaTurnoActual>=fechaInicio && auxFechaTurnoActual<=fechaFinal&&turno.estadoTurno==3
    })

    //MAPEO LA LISTA PARA OBTENER TODOS LOS ESPECIALISTAS SEGUN LOS TURNOS, ADEMAS AÑADO CAMPO DE CANTIDAD. 
    let listaEspecialistasTurno = auxTurnosFiltradosxFechas.map(value=>{
    
      return {especialista:`${value.especialista.nombre} ${value.especialista.apellido}`,idEspecialista:value.especialista.uid,cantidad:0} 
    })

    //PROBANDO FUNCIONES PARA FILTRAR EL ARRAY 
    var arrayConEspecialistasUnicos = listaEspecialistasTurno
    
    var hash :any = {};
     arrayConEspecialistasUnicos = arrayConEspecialistasUnicos.filter(current=>{
      var exists = !hash[current.idEspecialista?current.idEspecialista:''];
      hash[current.idEspecialista?current.idEspecialista:''] = true;
      return exists;
    });

    let newArrayconCantidadesSinDuplicados =  arrayConEspecialistasUnicos

    //RECORRO TODOS LOS TURNOS Y VOY COMPARANDO POR LOS ESPECIALISTAS YA FILTRADOS
    auxTurnosFiltradosxFechas.forEach(turnoAuxiliar=>{
      newArrayconCantidadesSinDuplicados.forEach(especialstaSinRepetir=>{

        if(turnoAuxiliar.especialista.uid === especialstaSinRepetir.idEspecialista){
          especialstaSinRepetir.cantidad++
        }
      })
    })

    let auxLabelsTurnosSolicitados:any [] = []
    let auxValuesTurnosSolicitados:number [] = []

    newArrayconCantidadesSinDuplicados.forEach(value=>{
      //obtengo los LABELS Y LOS VALORES
      auxLabelsTurnosSolicitados.push(`${value.especialista}(${value.cantidad})`)
      auxValuesTurnosSolicitados.push(value.cantidad)
    })
    

    this.dataLabel4 = auxLabelsTurnosSolicitados
    this.serie4=auxValuesTurnosSolicitados

    console.log("seri4 ", this.serie4)

    this.turnosRealizadosTempGrafico()

    this.datosListosTurnosFinalizados=true
    newArrayconCantidadesSinDuplicados.length>0 ? retorno= true : retorno= false

    return retorno
  }


  mostrarFechas(finalizado:boolean=false){
    finalizado?this.showFechasTurnoFinalizado=!this.showFechasTurnoFinalizado :this.showFechasTurnoSolicitados=!this.showFechasTurnoSolicitados 
  }




  seleccionarFechas(){
    let newFechaInicio = new Date(this.formaFechas.value.fechaInicio)
    let newFechaFinal = new Date(this.formaFechas.value.fechaFinal)
   
    this.fechaInicioTurnosSolicitado=newFechaInicio
    this.fechaFinalTurnosSolicitado=newFechaFinal

    let rtaCargarGrafico =this.turnosSolicitadosTemp(newFechaInicio,newFechaFinal)
    
    if(rtaCargarGrafico){
      this.showFechasTurnoSolicitados = false
      this.especialistaSelected = new Especialista()
    }
  }
  seleccionarFechasTurnoFinalizado(){

    let newFechaInicio = new Date(this.formaFechas2.value.fechaInicio)
    let newFechaFinal = new Date(this.formaFechas2.value.fechaFinal)
   
    this.fechaInicioTurnosFinalizados=newFechaInicio
    this.fechaFinalTurnosFinalizados=newFechaFinal
    
    let rtaCargarGrafico =  this.turnosRealizadosTemp(newFechaInicio,newFechaFinal)
    this.showFechasTurnoFinalizado = false

    this.hayDatosTurnoFinalizado = rtaCargarGrafico

  }



 
  

  

}
