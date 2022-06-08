import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Horario } from 'src/app/entidades/horario';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { HorarioService } from 'src/app/servicios/horario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  mostrarPerfil : boolean=true;
  mostrarPregunta : boolean=false;
  spinnerImgSubiendose:boolean=false;
  miUsuario:any;

  especialidadSeleccionada : any = "";
  dias : any = [];
  mostrarEspecialidades : boolean = false;
  datoABuscar : any = "";
  horarioCompleto : string[] = ["08:00","19:00"];
  horarioMañana : string[] = ["08:00","12:00"];
  horarioTarde : string[] = ["13:00","19:00"];
  horarioSabado : string[] = ["08:00","14:00"];
  horariosBd : any = "";
  usuarioActual : any = "";
  lunesSeleccionado : boolean = false;
  martesSeleccionado : boolean = false;
  miercolesSeleccionado : boolean = false;
  juevesSeleccionado : boolean = false;
  viernesSeleccionado : boolean = false;
  sabadoSeleccionado : boolean = false;
  todoElDiaSeleccionado : boolean = false;
  mananaSeleccionado : boolean = false;
  tardeSeleccionado : boolean = false;
  sabadoHorarioSeleccionado : boolean = false;
  diaEncontrado : boolean = false;
  horarioSeleccionado : string[] = [];
  horario! : Horario;
  horarioEspecialidad : any;
  horariosCargados : boolean = false;
  algunDia : boolean = false;
  especialistaConHorario : boolean = false;
  horarioAModificar : any = "";
  mostrarHC : boolean = false;
  historiasClinicasAFiltrar : any = [];
  historiasClinicas : any = [];
  diaDeEmision : any = [];
  diaDeEmisionParseado : any = "";
  hc : any = "";
  mostrarPDF : boolean = false;



  
  constructor(public firebase : FirebaseService, private router : Router,private hs : HorarioService, private ts : ToastrService) 
  { 
    this.mostrarPregunta=true;
    this.firebase = firebase;
    this.firebase.getCurrentUser().subscribe(res=>{
      this.firebase.getUser(res?.uid).subscribe(resuser=>{
        let obj = resuser.data()
        this.miUsuario = {
          nombre: obj?obj['nombre']:'',
          apellido: obj?obj['apellido']:'',
          edad: obj?obj['edad']:0,
          dni: obj?obj['dni']:0,
          obraSocial: obj?obj['obraSocial']:'',
          especialidad: obj?obj['especialidad']:'',
          email: obj?obj['email']:'',
          imgsPerfil: obj?obj['imgsPerfil']:[],
          imgPerfil: obj?obj['imgPerfil']:'',
          tipoUsuario: obj?obj['tipoUsuario']:'',
          verificadoEmail: obj?obj['verificadoEmail']:false,
        }
      })
    });

    this.horario = new Horario();
    this.hs.traerHorarios().subscribe(value => {
      this.horariosBd = value;
    });

    this.usuarioActual = this.firebase.usuarioDatos;


  }

  ngOnInit(): void {
  }

  irA(dato : number)
  {
    this.mostrarPregunta=false;
    switch(dato)
    {
      case 1:
        this.mostrarPerfil=true;
        break;
      case 2:
        this.router.navigate(['/turno/misTurnos']);
        break;
      case 3:
        //admin
        this.router.navigate(['/turno/gestionTurnos']);
        break;
    }
  }

  atras()
  {
    this.mostrarPregunta=true;
    this.mostrarPerfil=false;
  }

  seleccionarDia(diaAAgregar : number)
  {
    switch(diaAAgregar)
    {
      case 1:
        this.lunesSeleccionado = !this.lunesSeleccionado;
        break;
      case 2:
        this.martesSeleccionado = !this.martesSeleccionado;
        break;
      case 3:
        this.miercolesSeleccionado = !this.miercolesSeleccionado;
        break;
      case 4:
        this.juevesSeleccionado = !this.juevesSeleccionado;
        break;
      case 5:
        this.viernesSeleccionado = !this.viernesSeleccionado;
        break;
      case 6:
        this.sabadoSeleccionado = !this.sabadoSeleccionado;
        break;
    }

    for (let dia of this.dias) 
    {
      if(dia == diaAAgregar || this.dias.length == 0)
      {
        this.diaEncontrado = true;
      }
    }

    if(!this.diaEncontrado)
    {
      this.dias.push(diaAAgregar);
    }
    else
    {
      let indice : number;
      indice = this.dias.indexOf(diaAAgregar,0);
      this.dias.splice(indice,1);
    }
    
  }

  seleccionarHorario(horario : string)
  {
    switch(horario)
    {
      case "todoElDia":
        this.horarioSeleccionado = this.horarioCompleto;
        this.todoElDiaSeleccionado = true;
        this.mananaSeleccionado = false;
        this.tardeSeleccionado = false;
        this.sabadoSeleccionado = false;
        break;
      case "mañana":
        this.horarioSeleccionado = this.horarioMañana;
        this.todoElDiaSeleccionado = false;
        this.mananaSeleccionado = true;
        this.tardeSeleccionado = false;
        this.sabadoSeleccionado = false;
        break;
      case "tarde":
        this.horarioSeleccionado = this.horarioTarde;
        this.todoElDiaSeleccionado = false;
        this.mananaSeleccionado = false;
        this.tardeSeleccionado = true;
        this.sabadoSeleccionado = false;
        break;
      case "sabado":
        this.horarioSeleccionado = this.horarioSabado;
        this.todoElDiaSeleccionado = false;
        this.mananaSeleccionado = false;
        this.tardeSeleccionado = false;
        this.sabadoHorarioSeleccionado = true;
        break;
    }
  }

  cargarHorario()
  {
    this.horario.especialista = this.firebase.usuarioDatos;
    this.horarioEspecialidad = {
      dias: this.dias,
      nombre: this.especialidadSeleccionada.valor,
      rangoHorario: this.horarioSeleccionado  
    }
    this.horario.horariosEspecialidad.push(this.horarioEspecialidad);

    this.resetear();
  }

  resetear()
  {
    this.dias = [];
    this.especialidadSeleccionada = "";
    this.lunesSeleccionado = false;
    this.martesSeleccionado = false;
    this.miercolesSeleccionado = false;
    this.juevesSeleccionado = false;
    this.viernesSeleccionado = false;
    this.sabadoSeleccionado = false;
    this.todoElDiaSeleccionado = false;
    this.mananaSeleccionado = false;
    this.tardeSeleccionado = false;
    this.sabadoHorarioSeleccionado = false;
    this.diaEncontrado = false;
    this.horarioSeleccionado = [];
  }

  yaTieneHorario()
  {
    for(let horario of this.horariosBd)
    {
      if(horario.especialista.dni == this.firebase.usuarioDatos.dni)
      {
        this.especialistaConHorario = true;
        this.horarioAModificar = horario;
        break;
      }
    }
  }

  subirHorario()
  {
    let id : number;
    
      this.yaTieneHorario();
      if(this.especialistaConHorario)
      {
        id = this.horarioAModificar.id;
        //this.as.loading = true;
        this.hs.modificarHorario(this.horario,id).then(async () =>{
          setTimeout(() => {
            //this.as.loading = false;
            this.ts.success("Se modificó el horario del especialista","Horario registrado");
            this.resetear(); 
          }, 1000);
        })
        .catch((error : any)=>{
          this.ts.error("No se pudo modificar el horario","Error");
        });
      }
      else
      {
        //this.as.loading = true;
        this.hs.agregarHorario(this.horario).then(async () =>{
          setTimeout(() => {
            //this.as.loading = false;
            this.ts.success("Se guardo el horario","Horario registrado");
            this.resetear(); 
          }, 1000);
        })
        .catch((error : any)=>{
          this.ts.error("No se pudo registrar el horario","Error");
        });
      }
  }

}
