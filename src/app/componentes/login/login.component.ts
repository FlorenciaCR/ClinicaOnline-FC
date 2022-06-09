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

  listaUsuarios:any[]=[];
  forma : FormGroup;
  mensaje:string='';

  usuario : any = "";//otro login
  acceso: boolean = false;
  emailu : any;
  passu : any;

  constructor(private firebase :FirebaseService,private fb :FormBuilder, private router : Router) 
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
        .catch(err =>{
          //this.responseMessage = err.message;
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
            default:
              this.mensaje  = 'Error';
          }
          console.log('Error en login.ts: ',err);
        }); 
        this.mensaje='existe en la lista de usuarios'

        console.log(value)
        this.firebase.esEspecialistafn(value)
        this.firebase.esAdministrador(value)
        this.firebase.esPacientefn(value)
        encontrado=true
        setTimeout(() => {
          
          this.router.navigate(['bienvenido'])
        }, 2000);

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





}
