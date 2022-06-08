import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Especialista } from 'src/app/entidades/especialista';
import { FirebaseService } from 'src/app/servicios/firebase.service';


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
  listadoEspecialidades:any
  fotoEspecialista:any
  miEspecialista : Especialista;
  spinnerImgSubiendose:boolean=false;
  numeroRandom : number;

  constructor(private fb :FormBuilder, private firebase : FirebaseService, private router : Router,private mts: ToastrService)  
  {
    this.firebase.obtenerTodos('especialidades').subscribe(data=>{
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
      'capcha' : ['',[Validators.required]]
    
    });
    this.numeroRandom = Math.floor(Math.random() *  (500 - 100)) + 100;
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

  nuevaEspecialidad(especialidad:string){
    let esp = {
      valor:especialidad
    }
    this.firebase.crear("especialidades", JSON.parse(JSON.stringify(esp)))
  }

  agregarEspecialidad(especialidad:string){
    if(this.miEspecialista.especialidades.find(x => x == especialidad) == null){
      this.miEspecialista.especialidades.push(especialidad)
    }
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
  
   
      let reader =new FileReader()
      reader.readAsDataURL(this.fotoEspecialista)
      reader.onloadend=()=>{
  
        this.firebase.subirImagenes('imgperfilEspecialista',`${this.miEspecialista.email}_${this.miEspecialista.nombre}`,reader.result)
        .then(rta=>{
          if(rta != null )
          {
            this.miEspecialista.imgPerfil = rta
            console.log('esta en subir imagen'+rta)
            //se registra
            this.firebase.register(this.miEspecialista.email,this.miEspecialista.password)
            .then(res=>{
              this.miEspecialista.uid = res.user?.uid //le da id auth al esp          
              //Crea al esp en firestore 
              let retornoCrearDocId = this.firebase.crearDocumentoConIdEnCol('usuariosColeccion',`${res.user?.uid}`,JSON.parse(JSON.stringify(this.miEspecialista)))
              console.log('retorno status',retornoCrearDocId.status)
  
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
