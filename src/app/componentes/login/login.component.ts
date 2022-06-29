import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  listaUsuarios:any[]=[];
  forma : FormGroup;
  mensaje:string='';

  usuario : any = "";//otro login
  acceso: boolean = false;
  emailu : any;
  passu : any;
  miUsuario:any;

  constructor(private firebase :FirebaseService,private fb :FormBuilder, private router : Router, private ts : ToastrService) 
  {
    this.firebase.obtenerTodos2('usuariosColeccion').subscribe(data=>{
 
      this.listaUsuarios=data;
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
    this.listaUsuarios.forEach(value=>{
      if(value.email == this.forma.value.email && value.password == this.forma.value.password){
        this.firebase.logIn(this.forma.value.email,this.forma.value.password)
        .then(res =>{
          if(value.tipoUsuario == 'especialista')
          {
            if(value.habilitado !== true)
            {
              this.ts.error('Especialista no habilitado');
              this.firebase.logOut()
            }else{

              this.miUsuario = value;
              this.enviarLogUsuario();

              setTimeout(() => {
                this.router.navigate(['bienvenido'])
              }, 1800);
            

            }
          }else{
            this.miUsuario = value;
            this.enviarLogUsuario();
            setTimeout(() => {
              this.router.navigate(['bienvenido'])
            }, 1800);
           
          }
        })
        .catch(err =>{
          this.mensaje  = 'Error'

          //Custom
          switch(err)
          {
            case 'auth/email-not-verified':
              this.mensaje = 'Email no verificado.';
              break;
          }

          //Firebase
          switch(err.code)
          {
            case 'auth/invalid-email':
             this.mensaje = 'Email invalido.';
              break;     
            case 'auth/user-disabled':
              this.mensaje = 'Usuario deshabilitado.';
              break;
            case 'auth/user-not-found':
              this.mensaje = 'Usuario no encontrado.';
              break;       
            case 'auth/wrong-password':
              this.mensaje = 'Contrasenia incorrecta.';
              break;  
            case 'auth/user-not-found':
              this.mensaje ='Usuario no encontrado.';
              break;
          }
        }); 
        this.firebase.esEspecialistafn(value)
        this.firebase.esAdministrador(value)
        this.firebase.esPacientefn(value)
        encontrado=true

        this.firebase.logOut()
      }
    })
    
   
    !encontrado && console.log('no existe el usuario ingresado');
    if(!encontrado)
    {
      this.mensaje='NO existe el usuario'
    }
  }

  accesoRapido(email:any, password:any)
  {
    this.acceso=true;
    this.emailu = email;
    this.passu = password;
  } 


  enviarLogUsuario(){
    let hoy = new Date();
    let fecha = hoy;
    let horario = hoy.getHours() < 10 ? '0'+hoy.getHours() + ':' : hoy.getHours() + ':';
    horario += hoy.getMinutes() < 10 ? '0'+hoy.getMinutes() + ':' : hoy.getMinutes() + ':';
    horario += hoy.getSeconds() < 10 ? '0'+hoy.getSeconds() : hoy.getSeconds();
    let datos = {
      usuario: this.miUsuario.nombre + " " + this.miUsuario.apellido,
      email: this.miUsuario.email,
      tipoUsuario: this.miUsuario.tipoUsuario,
      fecha: fecha.toDateString(),
      horario: horario,
    }
    console.log('Datos del log a enviar',datos)
    this.firebase.agregarLog("logUsuarios",datos)
    //this.fireStoreService.agregarLogIngreso("LogIngresos",datos);
  }




}
