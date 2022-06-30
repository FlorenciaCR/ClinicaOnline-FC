import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Especialista } from 'src/app/entidades/especialista';
import { Paciente } from 'src/app/entidades/paciente';
import { Turno } from 'src/app/interfaces/turno';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import * as XLSX from 'xlsx'; 



@Component({
  selector: 'app-usuarios-listado',
  templateUrl: './usuarios-listado.component.html',
  styleUrls: ['./usuarios-listado.component.scss']
})
export class UsuariosListadoComponent implements OnInit {



    /*name of the excel-file which will be downloaded. */ 
  fileName= 'usuariosClinica.xlsx';  
  fileName2= 'turnosDelUsuario.xlsx';  

  tablaTodosUsuarios:boolean=true;

  mostrarHistorial : boolean=false;
  
  filtroPaciente:boolean = false
  filtroEspecialista:boolean = false
  listaTurnos:Turno[]=[]
  listaAuxTurnos:Turno[]=[]
  turnosCargados:boolean = false

  listaActualizadaUsuarios:any[]=[]

  listaPacientes:any[]=[]
  listaEspecialistas:any[]=[]
  listaAdministradores:any[]=[]
  usuarioSeleccionado:any;
  tipoUsuarioLogueado:any;

  spinnerImgSubiendose:boolean=false;
  constructor(private firebase:FirebaseService,) {
    this.spinnerImgSubiendose=true;
    setTimeout(() => {
      this.firebase.getCurrentUser().subscribe(obs=>{
        if(obs!=null)
        {
          this.firebase.getUsuario(obs.uid).subscribe(res=>{
            let aux = res.data();
            this.tipoUsuarioLogueado =aux?.['tipoUsuario'] 
          })
        }
      })
      
      this.firebase.obtenerTodos('usuariosColeccion').subscribe(data=>{
        this.listaActualizadaUsuarios=[];
        //console.log("data ", data)
        data.forEach(value=>{
          let usuario : any ={
            uid:value.uid,
            nombre : value.nombre,
            apellido : value.apellido,
            edad: value.edad,
            dni : value.dni,
            especialidad : value.especialidad,
            obraSocial : value.obraSocial,
            email : value.email,
            tipoUsuario : value.tipoUsuario,
            habilitado: value.habilitado,
            imgPerfil : value.imgPerfil,
            imgsPerfil :value.imgsPerfil,
            historialClinico: value.historialClinico
          }
          this.listaActualizadaUsuarios.push(usuario);
          //this.cargarListados();

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

                //if(this.tipoUsuarioLogueado == 'administrador'){
                  turnos.push(turno)
                //}
                // }else if(turno.especialista.tipoUsuario == 'especialista'){
                //   if(turno.especialista.uid === usuario.uid){
                //     turnos.push(turno)
                //   }  
                // }else if(turno.paciente.tipoUsuario == 'paciente'){
                //   if(turno.paciente.uid === usuario.uid){
                //     turnos.push(turno)
                //   } 
                // }
              })
              this.listaTurnos=turnos
              this.listaAuxTurnos=turnos
              this.turnosCargados=true

              console.log('lista turnos completa',this.listaAuxTurnos)
            })

          
        })
        //console.log("lista", this.listaActualizadaUsuarios)
     
      })

      this.spinnerImgSubiendose=false;
    }, 2000);
    
   }

  ngOnInit(): void {}

  actualizarHabilitado(especialista : any){
    if(especialista.habilitado==false)
    {
      this.firebase.habilitarEspecialista(especialista.id,true)
    }else{
      this.firebase.habilitarEspecialista(especialista.id,false)
    }
  
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
     XLSX.writeFile(wb, this.fileName);
    
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
  exportexcel2(): void 
  {
    console.log("lista excel listaTurnos", this.listaTurnos)

     /* table id is passed over here */   
     let element = document.getElementById('excel-tableTurnoUsuario'); 
     const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     /* save to file */
     XLSX.writeFile(wb, this.fileName2);
    
  }

  cargarListados()
  {
    this.listaPacientes = [];
    this.listaEspecialistas = [];
    this.listaAdministradores = [];
    for(let i=0; i<this.listaActualizadaUsuarios.length;i++){
      if(this.listaActualizadaUsuarios[i].tipoUsuario == 'paciente'){
        this.listaPacientes.push(this.listaActualizadaUsuarios[i]);
      }else if(this.listaActualizadaUsuarios[i].tipoUsuario == 'especialista'){
        this.listaEspecialistas.push(this.listaActualizadaUsuarios[i]);
      }else if(this.listaActualizadaUsuarios[i].tipoUsuario == 'administrador')
      {
        this.listaAdministradores.push(this.listaActualizadaUsuarios[i]);
      }
    }
    //console.log("lista admins", this.listaAdministradores)
  }


  seleccionarPacienteHistorial(usuario:any)
  {
    this.usuarioSeleccionado = usuario;
    console.log(this.usuarioSeleccionado)
    this.mostrarHistorial=true;
  }

 // seleccionarUsuario

  cerrarHistorial()
  {
    this.mostrarHistorial=false;
  }

  seleccionarPacienteParaFiltrar(paciente:Paciente){
    this.filtrarTurnosxPaciente(paciente)
    //this.filtroAplicado=true
    //this.filtroPaciente=false
 }
   seleccionarEspecialistaParaFiltrar(especialista:Especialista){
     this.filtrarTurnosxEspecialista(especialista)
     //this.filtroAplicado=true
     //this.filtroEspecialista=false
     
}




filtrarTurnosxPaciente(pac:Paciente){
  let listaFiltrada = this.listaAuxTurnos.filter(value=> {
    if( value.paciente.uid == pac.uid ){
      console.log("encontro paciente: ", value.paciente.nombre)
    }
    return value.paciente.uid == pac.uid 
    })
  this.listaTurnos=listaFiltrada
  console.log('Listado de turnos del paciente selecc: ',  this.listaTurnos)
}

 filtrarTurnosxEspecialista(esp:Especialista){
  //console.log("esp uid: ", esp.uid)
  //console.log("lista aux turnos: ", this.listaAuxTurnos)
  let listaFiltrada = this.listaAuxTurnos.filter(value=> {
    if( value.especialista.uid == esp.uid ){
      console.log("encontro especialista: ", value.especialista.nombre)
    }
    return value.especialista.uid == esp.uid 
    })
  //console.log("lista filtrada esp", listaFiltrada)
  this.listaTurnos=listaFiltrada
  console.log('Listado de turnos del especialista selecc: ',this.listaTurnos)
}

filtrarTurnoUsuarioExcel(usuario:any)
{
  //alert('suario clickeado : ' + usuario.tipoUsuario);
  console.log("tipo paciente", usuario.tipoUsuario)
  if(usuario.tipoUsuario=='paciente'){
    this.filtrarTurnosxPaciente(usuario);
  setTimeout(() => {
    this.exportexcel2();
  }, 3000);

  }else if(usuario.tipoUsuario=='especialista')
  {
    this.filtrarTurnosxEspecialista(usuario)
    
  setTimeout(() => {
    this.exportexcel2();
  }, 3000);
  }else{
    alert('los amdins no tienen turnos')
  }


  
}


  // public listaPaciente : Paciente[] = [];
  // public listaEspecialista : Especialista[] = [];
  // constructor(private firebase : FirebaseService) 
  // { 
    
  // }


  // ngOnInit(): void 
  // {

  //   this.firebase.obtenerTodos('pacientesColeccion').subscribe(data=>{
    
  //     this.listaPaciente = []

      
  //     data.forEach(x => {
  //       let container = new Paciente()
  //       container.nombre = x.nombre
  //       container.apellido = x.apellido
  //       container.obraSocial = x.obraSocial 
  //       container.dni = x.dni 
  //       container.edad = x.edad 
  //       container.email = x.email 
  //       container.imgsPerfil = x.imgsPerfil;

  //       this.listaPaciente.push(container)
  //     })
  //   })  

  //   this.firebase.obtenerTodos('especialistasColeccion').subscribe(data=>{
    
  //     this.listaEspecialista = []

      
  //     data.forEach(x => {
  //       let container = new Especialista()
  //       container.nombre = x.nombre
  //       container.apellido = x.apellido
  //       container.dni = x.dni 
  //       container.edad = x.edad 
  //       container.email = x.email 
  //       container.especialidad = x.especialidad 
  //       container.imgPerfil = x.imgPerfil;

  //       this.listaEspecialista.push(container)
  //     })
  //   })  
  // }

}
