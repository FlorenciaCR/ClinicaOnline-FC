import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Especialista } from 'src/app/entidades/especialista';
import { FirebaseService } from 'src/app/servicios/firebase.service';
var uniqid = require('uniqid'); 

@Component({
  selector: 'app-registro-especialista',
  templateUrl: './registro-especialista.component.html',
  styleUrls: ['./registro-especialista.component.scss']
})
export class RegistroEspecialistaComponent implements OnInit {

  mostrarmensaje:boolean=false;
  mensaje : string='';
  agregarEsp : boolean=false;
  formaEspecialista : FormGroup;
  listadoEspecialidades:any[]=[];
  fotoEspecialista:any
  miEspecialista : Especialista;
  spinnerImgSubiendose:boolean=false;
  numeroRandom : number;
  imgDefault = 'https://firebasestorage.googleapis.com/v0/b/tp-clinicaonline-fc.appspot.com/o/imgEspecialidades%2Fdefault.png?alt=media&token=910c9ae3-b0b6-40ab-b6ab-2bad28a05428';

  formaNewEspecialidad:FormGroup;

  constructor(private fb :FormBuilder, private firebase : FirebaseService, private router : Router,private mts: ToastrService)  
  {
    this.firebase.obtenerTodos('especialidades').subscribe(data=>{
      console.log("especialidades", data)
      this.listadoEspecialidades=data // mapeo de productos
    })
    this.formaEspecialista = this.fb.group({
      'nombre':['',[Validators.required,]],
      'apellido':['',Validators.required],
      'edad':['',[Validators.required, Validators.min(18), Validators.max(99),Validators.pattern("^[0-9]*$")]],
      'dnidoc':['',[Validators.required,Validators.minLength(8) ,Validators.pattern("^[0-9]*$")]],
      'email':['',[Validators.required,Validators.email]],
      'password':['',[Validators.required,Validators.minLength(6)]],
      'imagen':['',[Validators.required,]],
      'especialidad' : ['',[Validators.required]],
      'capcha' : ['',[Validators.required]]
    
    });

    //Nueva especialidad h
    this.formaNewEspecialidad = this.fb.group({
      'nombreEspecialidad':['',[Validators.required,]],
    })

    this.numeroRandom = Math.floor(Math.random() *  (500 - 100)) + 100;
    this.miEspecialista = new Especialista();
  }

  ngOnInit(): void {
  }


  cargarImagen(event:any){
    this.fotoEspecialista = event.target.files[0]    
  }

  obtenerDatosEnviarRegistroEspecialista()
  {
    let capcha = this.formaEspecialista.get("capcha")?.value;
    if(capcha == this.numeroRandom)
    {

      this.spinnerImgSubiendose=true;
      this.miEspecialista.nombre=this.formaEspecialista.value.nombre
      this.miEspecialista.apellido=this.formaEspecialista.value.apellido
      this.miEspecialista.edad=this.formaEspecialista.value.edad
      this.miEspecialista.dni=this.formaEspecialista.value.dnidoc
      this.miEspecialista.email=this.formaEspecialista.value.email
      this.miEspecialista.password=this.formaEspecialista.value.password
  
      if(this.formaEspecialista.value.especialidad != 'agregar'){
        this.listadoEspecialidades.forEach(value=>{
          if(value.id === this.formaEspecialista.value.especialidad){

            this.miEspecialista.especialidades.push({id:value.id,especialidad:value.especialidad,disponibilidad:30,diasDisponibles:[],img:value.img})
            // this.miEspecialista.especialidades.push({id:value.id,especialidad:value.valor,disponibilidad:30,diasDisponibles:[],img:value.img})
          }
        })
      }else{ 
        let newEspecialidad = {id:uniqid(),especialidad:this.formaNewEspecialidad.value.nombreEspecialidad,img:this.imgDefault}
        let rtaGuardarEspecialidad = this.firebase.agregarDataCollection('especialidades',newEspecialidad)
        if (rtaGuardarEspecialidad.status){
          this.miEspecialista.especialidades.push({...newEspecialidad,disponibilidad:30,diasDisponibles:[]})
        }else{
          this.mts.error('No se pudo guardar la especialidad');
          return;
        }  
      }
      let reader =new FileReader()
      reader.readAsDataURL(this.fotoEspecialista)
      reader.onloadend=()=>{
        this.firebase.subirImagenes('imgperfilEspecialista',`${this.miEspecialista.email}_${this.miEspecialista.nombre}`,reader.result)
        .then(rta=>{
          if(rta != null )
          {
            this.miEspecialista.imgPerfil = rta
            //se registra
            this.firebase.register(this.miEspecialista.email,this.miEspecialista.password)
            .then(res=>{
              this.miEspecialista.uid = res //le da id auth al esp     
              //Crea al esp en firestore
              console.log("mi usuario", this.miEspecialista)
              let retornoCrearDocId = this.firebase.crearDocumentoConIdEnCol('usuariosColeccion',`${res}`,JSON.parse(JSON.stringify(this.miEspecialista)))
              if(retornoCrearDocId.status==true)
              {
                this.spinnerImgSubiendose=false;
                this.formaEspecialista.reset();
                this.router.navigate(['login']);
  
              }
            }).catch(err=>{
              console.log('Error al registrar',err);
            })
          }
        }).catch(err=>{
          console.log('Error al subir imagenes',err);
          return false;
        })
      }
    }else{
      this.mts.error('Capcha incorrecto');
    }
  }


 


  




  }
