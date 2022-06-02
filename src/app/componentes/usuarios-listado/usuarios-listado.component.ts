import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Especialista } from 'src/app/clases/especialista';
import { Paciente } from 'src/app/clases/paciente';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-usuarios-listado',
  templateUrl: './usuarios-listado.component.html',
  styleUrls: ['./usuarios-listado.component.scss']
})
export class UsuariosListadoComponent implements OnInit {

  listaPaciente:any[]=[]
  listaEspecialista:any[]=[]
  spinnerImgSubiendose:boolean=false;
  constructor(private firebaseApi:FirebaseService,) {
    this.spinnerImgSubiendose=true;
    setTimeout(() => {
      
      this.firebaseApi.obtenerTodos2('pacientesColeccion').subscribe(data=>{
        this.listaPaciente=data // mapeo de productos
      }) 
      this.firebaseApi.obtenerTodos2('especialistasColeccion').subscribe(data=>{
        this.listaEspecialista=data // mapeo de productos
      }) 
      
      this.spinnerImgSubiendose=false;
    }, 3000);
    
   }
  ngOnInit(): void {}








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
