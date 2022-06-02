import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Especialista } from 'src/app/clases/especialista';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { RegistroPacienteComponent } from '../registro-paciente/registro-paciente.component';

@Component({
  selector: 'app-registro-especialista',
  templateUrl: './registro-especialista.component.html',
  styleUrls: ['./registro-especialista.component.scss']
})
export class RegistroEspecialistaComponent implements OnInit {

  mensaje : string='';
  agregarEsp : boolean=false;
  formaEspecialista : FormGroup;
  listadoEspecialidades:any
  fotoEspecialista:any
  miEspecialista : Especialista;
  spinnerImgSubiendose:boolean=false;


  constructor(private fb :FormBuilder, private firebase : FirebaseService, private router : Router)  
  {
    this.firebase.obtenerTodos('especialidades').subscribe(data=>{
      this.listadoEspecialidades=data // mapeo de productos
    })
    this.formaEspecialista = this.fb.group({
      'nombre':['',[Validators.required,]],
      'apellido':['',Validators.required],
      'edad':['',[Validators.required, Validators.min(18), Validators.max(99),Validators.pattern("^[0-9]*$")]],
      'dnidoc':['',[Validators.required,Validators.minLength(8) ,Validators.pattern("^[0-9]*$")]],
      'especialidad':['',[Validators.required,]],
      'email':['',[Validators.required,Validators.email]],
      'password':['',[Validators.required,Validators.minLength(6)]],
      'imagen':['',[Validators.required,]],
    
    });
    this.miEspecialista = new Especialista();
  }

  ngOnInit(): void {
  }


  cargarImagen(event:any){
    this.fotoEspecialista = event.target.files[0]    
    //this.subirImgEspecialista('pruebaAlbum','fotoPrueba2',event.target.files[0]  )  
  }

  subirImgEspecialista(nameAlbum:string,nameFoto:string,foto:any){
    let retorno = {status:false,url:''}
  }
  obtenerDatosEnviarRegistroEspecialista()
  {
    this.spinnerImgSubiendose=true;
    this.miEspecialista.nombre=this.formaEspecialista.value.nombre
    this.miEspecialista.apellido=this.formaEspecialista.value.apellido
    this.miEspecialista.edad=this.formaEspecialista.value.edad
    this.miEspecialista.dni=this.formaEspecialista.value.dnidoc
    this.miEspecialista.especialidad=this.formaEspecialista.value.especialidad
    this.miEspecialista.email=this.formaEspecialista.value.email
    this.miEspecialista.password=this.formaEspecialista.value.password

 
     let reader =new FileReader()
     reader.readAsDataURL(this.fotoEspecialista)
     reader.onloadend=()=>{

      this.firebase.subirImagenes('imgperfilEspecialista',`${this.miEspecialista.email}_${this.miEspecialista.nombre}`,reader.result)
      .then(rta=>{
       if(rta != null ){
         this.miEspecialista.imgPerfil = rta
         console.log(this.miEspecialista)

         this.firebase.crear('especialistasColeccion',JSON.parse(JSON.stringify(this.miEspecialista)))
         .then(res=>{
           console.log('Se creo y se subio especialista ?', res);
           this.mensaje='Se especialista registrado!'
           
           this.spinnerImgSubiendose=false;
           this.formaEspecialista.reset();
           this.router.navigate(['login']);
         })

       }  
      })
      .catch(err =>{
        console.log(err);
        this.mensaje='Error. Se especialista NO registrado!'
        return false
      })
     }
  }


 


  




  }
