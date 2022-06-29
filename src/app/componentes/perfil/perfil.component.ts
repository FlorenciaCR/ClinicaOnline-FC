import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Especialista } from 'src/app/entidades/especialista';
import { Horario } from 'src/app/entidades/horario';
import { Paciente } from 'src/app/entidades/paciente';
import { Turno } from 'src/app/interfaces/turno';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { HorarioService } from 'src/app/servicios/horario.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  miUsuario:any;

  @ViewChild ('turnosListadoPDF', {static: false}) el! : ElementRef

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
  dia : any;

 usuarioLoggeado:any
 tipoUsuarioLogueado:any;
 uidUser:string|boolean=false

 especialidadSelected:any={"especilidaD":'','disponibilidad':0,'id':0}
 newDisponibilidad:number=30
 diasSemana:any[]=[{id:1,name:'Lunes'},{id:2,name:'Martes'},{id:3,name:'Miercoles'},{id:4,name:'Jueves'},{id:5,name:'Viernes'},{id:6,name:'Sabado'}]
 diasSeleccionados:number[]=[]
 mostrarHistoriales : Boolean=false;
 
 filtroEspecialista:boolean = false
 listadoEspecialistas:Especialista[]=[] 
 listaTurnos:Turno[]=[]
 listaAuxTurnos:Turno[]=[]
 turnosCargados:boolean = false
 filtroAplicado:boolean=false

 fechaActual : Date  = new Date();

  
  constructor(public firebase : FirebaseService, private router : Router,private horarioService : HorarioService, private ts : ToastrService ) 
  { 
    setTimeout(() => {
      
      this.firebase.getCurrentUser().subscribe(obs=>{
        if(obs!=null){
          this.firebase.getUsuario(obs.uid).subscribe(res=>{
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
              password : aux?.['password'],

              historialClinico : aux?.['historialClinico'],
              pacientesFinalizados : aux?.['pacientesFinalizados']
            }
            if(this.miUsuario.imgsPerfil == null){
              this.miUsuario.imgsPerfil = ['https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png']
            }
            if(this.miUsuario.obraSocial == null){
              this.miUsuario.obraSocial = "NoDefinida"
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
                  turno.calificacion=inf.calificacion
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
    }, 2000);
    // this.horarioService.traerHorarios().subscribe(value => {
    //   this.horariosDb = value;
    // });
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
    //console.log(this.listadoPacientes);
    //this.listadoPacientes=pacientes;
    })


    this.especialidadSelected= this.miUsuario?.especialidades[0]

  }

  ngOnInit(): void {
  }


  //PDF
  // async descargarPDF(){

  //   PdfMakeWrapper.setFonts(pdfFonts);
  //   const pdf = new PdfMakeWrapper();
  //   pdf.add((await new Img('./../../../../assets/especialidadDefault.png').width(100).alignment('center').build()))
  //   let fecha = new Date();
  //   let footer : any;
  //   footer = this.datePipe.transform(fecha, 'dd/MM/yyyy');
  //   pdf.pageSize('A4');
  //   pdf.pageMargins(40);
  //   pdf.add({text: 'Clinica Bernheim', alignment: 'center',fontSize: 22, bold: true,  margin: [50, 20]});
  //   pdf.add({text: footer, alignment: 'center',fontSize: 22, bold: true,  margin: [50, 20]});
  //   pdf.add({text: 'Historia clinica: ' + this.auth.currentUser.nombre + ' ' + this.auth.currentUser.apellido, alignment: 'center',fontSize: 22, bold: true,  margin: [50, 20]});
  //   pdf.add(this.createTable());
  //   pdf.create().download();

  // }

  // createTable(){
  //   this.formatDataToTable();
  //   [{}]
  //   return new Table(this.tabla).alignment('center').end;
  // }

  // formatDataToTable(){

  //   console.log(this.turnosAMostrar)
  //   this.tabla = this.turnosAMostrar.map((turno:any)=>{
  //     let row = [];
  //     let rowAux = [];
  //     row.push(
  //       'Especialista: ' + turno.especialista + '\n'
  //     );
  //     row.push(
  //       'Altura: ' + turno.altura + '\n' + 
  //       'Peso: ' +  turno.peso + '\n' +
  //       'Temperatura: ' +  turno.temperatura + '\n' + 
  //       'Presion: ' + turno.presion + '\n'
  //       );
  //       for(let item of turno.claveValor){
  //         if(item.clave != null && item.valor != null){
  //           rowAux.push(item.clave + ': ' + item.valor + '\n');
  //         }
  //       }
  //       if(rowAux.length != 0){
  //         row.push(rowAux);
  //       }
  //       return row;
  //     });
  // }




  //h
  selectedEspecialidad(id:string){
    this.miUsuario.especialidades.forEach(value=>{
      if(value.id === id){
        this.especialidadSelected=value // obtengo la especialidad seleccionada
      }
    })
  }

  actualizarDuracionEspecialidad(idEspecialidad:string){
    // el especiaño
    let specialidades = this.miUsuario.especialidades // obtengo el listado de especialidades del usuarios actual 
    
    let newEspecialidades = specialidades.map(value=>{ //obtengo un nuievo array de especialidades segun 
      
      if(idEspecialidad === value.id){ // obtengo la especialidad que quiero modificar. 
        value.disponibilidad = this.newDisponibilidad // seteo la nueva cantidad de minutos para el turno 
        value.diasDisponibles = this.diasSeleccionados
      }
      return value
  })

  
  this.firebase.updateDuracion(this.miUsuario.uid,{... this.miUsuario,especialidad:newEspecialidades})
  .then(rta=>{
    console.log('editada la duracion')
    //this.reLoad()
  })
  .catch(err=>{
    console.log('ocurrio un error edirtando la duracion ' + err)
  })
  }

  seleccionarDia(dia:number){
    
    let valido= false

    if(this.diasSeleccionados.length>0){
      
      valido = this.diasSeleccionados.includes(dia)
      if(!valido){
        this.ts.success('Dia agregado a tus horarios!')
        //alert('Dia agregado a tus horarios!')
        this.diasSeleccionados.push(dia)
      }else{
        this.ts.info('Ya seleccionaste ese dia')
      }
    
    }else{
      this.diasSeleccionados.push(dia)
    }
    
    console.log(this.diasSeleccionados)
 
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

  diaSeleccionado(dia:any)
  {
    this.dia = dia;
  }

  crearHorario()
  {
    let horario = new Horario()

    horario.especialistaId = this.firebase.usuarioLogueado.id;

    let horarioEspecialidad = {
      //dias: this.dias,
      dias: this.dia,
      nombre: this.especialidadSeleccionada,
      rangoHorario: this.horarioSeleccionado  
    }
    horario.horariosEspecialidad.push(horarioEspecialidad);
    this.horarioService.agregarHorario(horario)
  }


  activarFiltroEspecialistas(){
    if(!this.filtroEspecialista){
      //this.filtroEspecialidades=false
    }
    this.filtroEspecialista = !this.filtroEspecialista
  }

  seleccionarEspecialistaParaFiltrar(especialista:Especialista){
    this.filtrarTurnosxEspecialista(especialista)
    this.filtroAplicado=true
    this.filtroEspecialista=false
    
  }

  filtrarTurnosxEspecialista(esp:Especialista){
    let listaFiltrada = this.listaAuxTurnos.filter(value=> {
      return value.especialista.uid == esp.uid && value.paciente.uid == this.miUsuario.uid
      })
    this.listaTurnos=listaFiltrada
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

  eliminarFiltros(){
    this.listaTurnos = this.listaAuxTurnos
    this.filtroEspecialista=false

    this.filtroAplicado=false

 }

 crearPDFturnos()
 {
  let pdf = new jsPDF('p','pt','a4');
  pdf.html(this.el.nativeElement,{
    callback:(pdf)=>{
      pdf.save(`TurnosDelPaciente_${this.miUsuario.nombre}.pdf`);
    }
  })

 }





}
