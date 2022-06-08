import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Administrador } from 'src/app/entidades/administrador';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-registro-admin',
  templateUrl: './registro-admin.component.html',
  styleUrls: ['./registro-admin.component.scss']
})
export class RegistroAdminComponent implements OnInit {

  mostrarmensaje:boolean=false;
  mensaje : string='';
  agregarEsp : boolean=false;
  formaAdministrador : FormGroup;
  listadoEspecialidades:any
  fotoEspecialista:any
  miAdministrador : Administrador;
  spinnerImgSubiendose:boolean=false;


  constructor(private fb :FormBuilder, private firebase : FirebaseService, private router : Router)  
  {
    this.firebase.obtenerTodos('especialidades').subscribe(data=>{
      this.listadoEspecialidades=data // mapeo de productos
    })
    this.formaAdministrador = this.fb.group({
      'nombre':['',[Validators.required,]],
      'apellido':['',Validators.required],
      'edad':['',[Validators.required, Validators.min(18), Validators.max(99),Validators.pattern("^[0-9]*$")]],
      'dnidoc':['',[Validators.required,Validators.minLength(8) ,Validators.pattern("^[0-9]*$")]],
      'email':['',[Validators.required,Validators.email]],
      'password':['',[Validators.required,Validators.minLength(6)]],
      'imagen':['',[Validators.required,]],
    });
    this.miAdministrador = new Administrador();
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


    this.miAdministrador.nombre=this.formaAdministrador.value.nombre
    this.miAdministrador.apellido=this.formaAdministrador.value.apellido
    this.miAdministrador.edad=this.formaAdministrador.value.edad
    this.miAdministrador.dni=this.formaAdministrador.value.dnidoc
    this.miAdministrador.email=this.formaAdministrador.value.email
    this.miAdministrador.password=this.formaAdministrador.value.password

 
    let reader =new FileReader()
    reader.readAsDataURL(this.fotoEspecialista)
    reader.onloadend=()=>{

      this.firebase.subirImagenes('imgperfilEspecialista',`${this.miAdministrador.email}_${this.miAdministrador.nombre}`,reader.result)
      .then(rta=>{
        if(rta != null )
        {
          this.miAdministrador.imgPerfil = rta
          console.log('esta en subir imagen'+rta)
          this.firebase.register(this.miAdministrador.email,this.miAdministrador.password)
          .then(res=>{
            this.miAdministrador.uid = res.user?.uid
            console.log('entro a registro',this.miAdministrador)
            let retornoCrearDocId = this.firebase.crearDocumentoConIdEnCol('usuariosColeccion',`${res.user?.uid}`,JSON.parse(JSON.stringify(this.miAdministrador)))
            if(retornoCrearDocId.status==true)
            {
              this.spinnerImgSubiendose=false;
              this.formaAdministrador.reset();
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
  }

}
