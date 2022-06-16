import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Especialista } from 'src/app/entidades/especialista';
import { Paciente } from 'src/app/entidades/paciente';
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

  
  


  listaActualizadaUsuarios:any[]=[]

  listaPacientes:any[]=[]
  listaEspecialistas:any[]=[]
  listaAdministradores:any[]=[]

  spinnerImgSubiendose:boolean=false;
  constructor(private firebase:FirebaseService,) {
    this.spinnerImgSubiendose=true;
    setTimeout(() => {
      
      this.firebase.obtenerTodos('usuariosColeccion').subscribe(data=>{
        this.listaActualizadaUsuarios=[];
        console.log("data ", data)
        data.forEach(value=>{
          let usuario : any ={
            id:value.id,
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
            imgsPerfil :value.imgsPerfil

          }
          this.listaActualizadaUsuarios.push(usuario);
          this.cargarListados();
        })
        console.log("lista", this.listaActualizadaUsuarios)
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
    console.log("lista admins", this.listaAdministradores)
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
