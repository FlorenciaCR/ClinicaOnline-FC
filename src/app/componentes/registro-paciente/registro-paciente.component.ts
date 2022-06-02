import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/clases/paciente';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.component.html',
  styleUrls: ['./registro-paciente.component.scss']
})
export class RegistroPacienteComponent implements OnInit {


  mensaje : string='';
  agregarPac : boolean=false;
  formaPaciente : FormGroup;
  fotoPaciente1: any;
  fotoPaciente2: any;
  foto1Ok:boolean=false;
  foto2Ok:boolean=false;
  //prueba con dos fotos:
  archivoSubido:any;
  fotoParaMostrar1:any;
  fotoParaMostrar2:any;
  imagen:any;
  spinnerImgSubiendose:boolean = false;
  fotosPaciente:any;
  
  //fotos[] 
  
  
  miPaciente : Paciente;

  constructor(private fb :FormBuilder, private firebase : FirebaseService, private router : Router)  
  {

    this.formaPaciente = this.fb.group({
      'nombre':['',[Validators.required,]],
      'apellido':['',Validators.required],
      'edad':['',[Validators.required, Validators.min(18), Validators.max(99),Validators.pattern("^[0-9]*$")]],
      'dnidoc':['',[Validators.required,Validators.minLength(8) ,Validators.pattern("^[0-9]*$")]],
      'obraSocial':['',[Validators.required,]],
      'email':['',[Validators.required,Validators.email]],
      'password':['',[Validators.required,Validators.minLength(6)]],
      'imagen':['',[Validators.required,]]
    
    });
    this.miPaciente= new Paciente();
  }

  ngOnInit(): void {
  }

  cargarImagen(event:any){
    this.fotosPaciente = event.target.files
    
  }

  obtenerDatosEnviarRegistroPaciente()
  {
    this.spinnerImgSubiendose=true;
    this.miPaciente.nombre=this.formaPaciente.value.nombre
    this.miPaciente.apellido=this.formaPaciente.value.apellido
    this.miPaciente.edad=this.formaPaciente.value.edad
    this.miPaciente.dni=this.formaPaciente.value.dnidoc
    this.miPaciente.obraSocial=this.formaPaciente.value.obraSocial
    this.miPaciente.email=this.formaPaciente.value.email
    this.miPaciente.password=this.formaPaciente.value.password

    for (let i = 0; i < this.fotosPaciente.length; i++) 
    {
      let reader =new FileReader()
      reader.readAsDataURL(this.fotosPaciente[i])
      reader.onloadend=()=>{
        this.firebase.subirImagenes('imgPerfilPacientes',`${this.miPaciente.nombre}_${this.miPaciente.email}_img${i}`,reader.result)
        .then(res=>{
            if(res!=null)
            {
              this.miPaciente.imgsPerfil.push(res);
              if(i==1)
              {
                
                  let resultadoGuardar = this.firebase.crear2('pacientesColeccion',JSON.parse(JSON.stringify(this.miPaciente)))
                  resultadoGuardar.status && this.formaPaciente.reset();
                  resultadoGuardar.status && this.router.navigate(['login']);
              }
            }
        })
        .catch(err=>{
          console.log(err, 'no s epudo subir la foto')

        })
      }
    }

   
  }

  //=------------------------------------funciona version settimeout
  cargarImagen1(event:any){
    this.fotoPaciente1 = event.target.files[0]
 
    //this.subirImgEspecialista('pruebaAlbum','fotoPrueba2',event.target.files[0]  )  
  }

  cargarImagen2(event:any){
    this.fotoPaciente2 = event.target.files[0]
 
    //this.subirImgEspecialista('pruebaAlbum','fotoPrueba2',event.target.files[0]  )  
  }

  // subirImgEspecialista(nameAlbum:string,nameFoto:string,foto:any){
  //   let retorno = {status:false,url:''}
  // }


  // obtenerDatosEnviarRegistroPaciente()
  // {
  //   this.spinnerImgSubiendose=true;
  //   this.miPaciente.nombre=this.formaPaciente.value.nombre
  //   this.miPaciente.apellido=this.formaPaciente.value.apellido
  //   this.miPaciente.edad=this.formaPaciente.value.edad
  //   this.miPaciente.dni=this.formaPaciente.value.dnidoc
  //   this.miPaciente.obraSocial=this.formaPaciente.value.obraSocial
  //   this.miPaciente.email=this.formaPaciente.value.email
  //   this.miPaciente.password=this.formaPaciente.value.password

   
  //     let reader1 =new FileReader()
  //     reader1.readAsDataURL(this.fotoPaciente1)
  //     reader1.onloadend=()=>{
  //       this.firebase.subirImagenes('imgPerfilPacientes',`${this.miPaciente.email}_${this.miPaciente.nombre}_foto1`,reader1.result)
  //       .then(rta=>{
  //         if(rta != null )
  //         {
  //           this.foto1Ok=true;
  //           console.log(rta);
  //           this.miPaciente.imgPerfil1 = rta;
  //           //console.log(this.miPaciente)
  //           //this.firebase.crear('pacientesColeccion',JSON.parse(JSON.stringify(this.miPaciente)))
  //           console.log('foto1 subida')
  //         }
  //       })
  //       .catch(err =>{
  //         console.log(err);
  //         this.mensaje='Error. foto1 no subida'
  //         return false
  //       })
  //      }


 
  //      let reader2 =new FileReader()
  //      reader2.readAsDataURL(this.fotoPaciente2)
  //      reader2.onloadend=()=>{
  //        this.firebase.subirImagenes('imgPerfilPacientes',`${this.miPaciente.email}_${this.miPaciente.nombre}_foto2`,reader2.result)
  //        .then(rta=>{
  //          if(rta != null )
  //          {
  //            this.foto2Ok=true;
  //            console.log(rta);
  //            this.miPaciente.imgPerfil2 = rta;
  //            //console.log(this.miPaciente)
  //            console.log('foto2 subida')
  //          }
  //        })
  //        .catch(err =>{
  //          console.log(err);
  //          this.mensaje='Error. foto2 no subida'
  //          return false
  //        })
  //       }

  //       setTimeout(() => {
  //         if(this.foto1Ok&&this.foto2Ok)
  //         {
  //           this.firebase.crear('pacientesColeccion',JSON.parse(JSON.stringify(this.miPaciente)))
  //           .then(res=>{
  //             console.log('se subio al paciente con las fotos se supone D:')
  //           })
  //           .catch(err=>{
  //             console.log('no subio el paciente xd')
  //           })
  //           this.spinnerImgSubiendose=false;
  //         }
  //       }, 4000);

        
  // }


 


  


}
