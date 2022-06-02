import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  listaPaciente:any[]=[];
  listaEspecialista:any[]=[];
  forma : FormGroup;

  constructor(private firebase :FirebaseService,private fb :FormBuilder, private router : Router) 
  {
    this.firebase.obtenerTodos2('pacientesColeccion').subscribe(data=>{
 
      this.listaPaciente=data;
    })  

    this.firebase.obtenerTodos2('especialistasColeccion').subscribe(data=>{
     
      
      this.listaEspecialista=data;
    }) 

    this.forma = this.fb.group({
      'email':['',[Validators.required,Validators.email]],
      'password':['',[Validators.required,Validators.minLength(6)]]
    })


    
  }

  ngOnInit(): void {
  }

  verificarUsuario()
  {
    let encontrado = false

    this.listaEspecialista.forEach(value=>{
      if(value.email == this.forma.value.email && value.password == this.forma.value.password){
        console.log('existe el especialista en la lista de especialistas')
        console.log(value)
        this.firebase.esEspecialistafn(value)
        this.firebase.esAdministrador(value)
        encontrado=true
        
        this.router.navigate(['bienvenido'])

      }
    })
    
   !encontrado && this.listaPaciente.forEach(value=>{
      if(value.email == this.forma.value.email && value.password == this.forma.value.password){
        console.log('existe el paciente en la lista de pacientes')
        console.log(value)
        this.firebase.esPacientefn(value)
        encontrado=true
        this.router.navigate(['bienvenido'])
      }
    })

    !encontrado && console.log('no existe el usuario ingresado');


    
    // let email = {SACAR FORMULARIO}

    // console.log("verificar login")
    // this.firebase.obtenerTodos2("pacientesColeccion").subscribe(data => {
    //   console.log("pacientes", data)

    // data.forEach(x => {
    //   if(x.email == email && !x.verificadoEmail){
    //     console.error("EMAIL NO VERIFICADO")
    //     // return
    //   }
    //   })
    // })

    // this.firebase.obtenerTodos2("especialistasColeccion").subscribe(data => {
    //   console.log("especialistas", data)
    //   data.forEach(x => {
    //     if(x.email == email && !x.verificadoEmail){
    //       console.error("EMAIL NO VERIFICADO")
    //       // return
    //     }
    //     if(x.email == email && !x.verificadoAdmin){
    //       console.error("ADMIN NO VERIFICADO")
    //       // return
    //     }
    //   })
    // })
  }
}
