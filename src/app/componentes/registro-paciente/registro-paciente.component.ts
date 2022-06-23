import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Paciente } from 'src/app/entidades/paciente';
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
  //prueba con dos fotos:
  archivoSubido:any;
  imagen:any;
  spinnerImgSubiendose:boolean = false;
  fotosPaciente:any;
  numeroRandom : number;
  
  
  miPaciente : Paciente;

  constructor(private fb :FormBuilder, private firebase : FirebaseService, private router : Router,private mts: ToastrService)  
  {

    this.formaPaciente = this.fb.group({
      'nombre':['',[Validators.required,]],
      'apellido':['',Validators.required],
      'edad':['',[Validators.required, Validators.min(18), Validators.max(99),Validators.pattern("^[0-9]*$")]],
      'dnidoc':['',[Validators.required,Validators.minLength(8) ,Validators.pattern("^[0-9]*$")]],
      'obraSocial':['',[Validators.required,]],
      'email':['',[Validators.required,Validators.email]],
      'password':['',[Validators.required,Validators.minLength(6)]],
      'imagen':['',[Validators.required,]],
      'capcha' : ['',[Validators.required]]
    
    });
    this.numeroRandom = Math.floor(Math.random() *  (500 - 100)) + 100;
    this.miPaciente= new Paciente();
  }

  ngOnInit(): void {
  }

  cargarImg(event:any){
    this.fotosPaciente=event.target.files; 
    
  }

  obtenerDatosEnviarRegistroPaciente()
  {
    let capcha = this.formaPaciente.get("capcha")?.value;
    if(capcha == this.numeroRandom)
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
                    this.firebase.register(this.miPaciente.email,this.miPaciente.password)
                    .then( async res=>{ 
                      console.log("res after register:", res)
                      this.miPaciente.uid = res
                      console.log("save user", this.miPaciente)
                      console.log("stringify user,", JSON.parse(JSON.stringify(this.miPaciente)))
                      let retornoCrearDocId = this.firebase.crearDocumentoConIdEnCol('usuariosColeccion',`${res}`,JSON.parse(JSON.stringify(this.miPaciente)))
                      console.log("save return", retornoCrearDocId)
                      //await res.user?.sendEmailVerification();
                    
                        if(retornoCrearDocId.status==true)
                        {
                          this.spinnerImgSubiendose=false;
                          this.mts.success('Se registro el usuario');
                          this.formaPaciente.reset();
                          this.router.navigate(['login']);
                        }
                        
                   
                    }).catch(err=>{
                      console.log('Error al registrar',err);
                    })
                }
              }
          })
        }
      }      

    }
    else{
      this.mts.error('Capcha incorrecto');
    }
  }




}