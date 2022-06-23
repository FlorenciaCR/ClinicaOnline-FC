import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Horario } from 'src/app/entidades/horario';
import { TipoUsuarioPipe } from 'src/app/pipes/tipo-usuario.pipe';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { HorarioService } from 'src/app/servicios/horario.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  miUsuario:any;

  mostrarEspecialidades : boolean = true;
  horariosDb : any = "";
  datoABuscar : any = "";
  franjasHorarias = [
    ["08:00","12:00"],
    ["14:00","18:00"],
  ]
  dias = ["Lunes","Martes","Miercoles","Jueves","Viernes"]
  especialidadSeleccionada : any = "";
  horarioSeleccionado : any = "";
  dia : any;

 usuarioLoggeado:any
 tipoUsuarioLogueado:any;
 uidUser:string|boolean=false

 especialidadSelected:any={"especilidaD":'','disponibilidad':0,'id':0}
 newDisponibilidad:number=30
 diasSemana:any[]=[{id:1,name:'Lunes'},{id:2,name:'Martes'},{id:3,name:'Miercoles'},{id:4,name:'Jueves'},{id:5,name:'Viernes'},{id:6,name:'Sabado'}]
 diasSeleccionados:number[]=[]
 mostrarHistoriales : Boolean=false;


  
  constructor(public firebase : FirebaseService, private router : Router,private horarioService : HorarioService, private ts : ToastrService,public tipoUsuarioPipe : TipoUsuarioPipe) 
  { 
    setTimeout(() => {
      
      this.firebase.getCurrentUser().subscribe(obs=>{
        if(obs!=null){
          this.firebase.getUsuario(obs.uid).subscribe(res=>{
            let aux = res.data();
            this.tipoUsuarioLogueado =aux?.['tipoUsuario'] 
            this.miUsuario ={
              uid : aux?.['uid'],
              nombre : aux?.['nombre'],
              apellido : aux?.['apellido'],
              dni : aux?.['dni'],
              edad : aux?.['edad'],
              email : aux?.['email'],
              imgPerfil : aux?.['imgPerfil'],
              imgsPerfil : aux?.['imgsPerfil'],
              tipoUsuario :aux?.['tipoUsuario'] ,
              obraSocial : aux?.['obraSocial'],
              especialidades : aux?.['especialidades'],
              password : aux?.['password']
            }
            if(this.miUsuario.imgsPerfil == null){
              this.miUsuario.imgsPerfil = ['https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png']
            }
            if(this.miUsuario.obraSocial == null){
              this.miUsuario.obraSocial = "NoDefinida"
            }
          })
        }
      })
    }, 2000);
    // this.horarioService.traerHorarios().subscribe(value => {
    //   this.horariosDb = value;
    // });


    this.especialidadSelected= this.miUsuario?.especialidades[0]

  }

  ngOnInit(): void {
  }


  //PDF
  // async descargarPDF(){

  //   PdfMakeWrapper.setFonts(pdfFonts);
  //   const pdf = new PdfMakeWrapper();
  //   pdf.add((await new Img('./../../../../assets/especialidadDefault.png').width(100).alignment('center').build()))
  //   let fecha = new Date();
  //   let footer : any;
  //   footer = this.datePipe.transform(fecha, 'dd/MM/yyyy');
  //   pdf.pageSize('A4');
  //   pdf.pageMargins(40);
  //   pdf.add({text: 'Clinica Bernheim', alignment: 'center',fontSize: 22, bold: true,  margin: [50, 20]});
  //   pdf.add({text: footer, alignment: 'center',fontSize: 22, bold: true,  margin: [50, 20]});
  //   pdf.add({text: 'Historia clinica: ' + this.auth.currentUser.nombre + ' ' + this.auth.currentUser.apellido, alignment: 'center',fontSize: 22, bold: true,  margin: [50, 20]});
  //   pdf.add(this.createTable());
  //   pdf.create().download();

  // }

  // createTable(){
  //   this.formatDataToTable();
  //   [{}]
  //   return new Table(this.tabla).alignment('center').end;
  // }

  // formatDataToTable(){

  //   console.log(this.turnosAMostrar)
  //   this.tabla = this.turnosAMostrar.map((turno:any)=>{
  //     let row = [];
  //     let rowAux = [];
  //     row.push(
  //       'Especialista: ' + turno.especialista + '\n'
  //     );
  //     row.push(
  //       'Altura: ' + turno.altura + '\n' + 
  //       'Peso: ' +  turno.peso + '\n' +
  //       'Temperatura: ' +  turno.temperatura + '\n' + 
  //       'Presion: ' + turno.presion + '\n'
  //       );
  //       for(let item of turno.claveValor){
  //         if(item.clave != null && item.valor != null){
  //           rowAux.push(item.clave + ': ' + item.valor + '\n');
  //         }
  //       }
  //       if(rowAux.length != 0){
  //         row.push(rowAux);
  //       }
  //       return row;
  //     });
  // }




  //h
  selectedEspecialidad(id:string){
    this.miUsuario.especialidades.forEach(value=>{
      if(value.id === id){
        this.especialidadSelected=value // obtengo la especialidad seleccionada
      }
    })
  }

  actualizarDuracionEspecialidad(idEspecialidad:string){
    // el especiaño
    let specialidades = this.miUsuario.especialidades // obtengo el listado de especialidades del usuarios actual 
    
    let newEspecialidades = specialidades.map(value=>{ //obtengo un nuievo array de especialidades segun 
      
      if(idEspecialidad === value.id){ // obtengo la especialidad que quiero modificar. 
        value.disponibilidad = this.newDisponibilidad // seteo la nueva cantidad de minutos para el turno 
        value.diasDisponibles = this.diasSeleccionados
      }
      return value
  })

  
  this.firebase.updateDuracion(this.miUsuario.uid,{... this.miUsuario,especialidad:newEspecialidades})
  .then(rta=>{
    console.log('editada la duracion')
    //this.reLoad()
  })
  .catch(err=>{
    console.log('ocurrio un error edirtando la duracion ' + err)
  })
  }

  seleccionarDia(dia:number){
    
    let valido= false

    if(this.diasSeleccionados.length>0){
      
      valido = this.diasSeleccionados.includes(dia)
      if(!valido){
        alert('Dia agregado a tus horarios!')
        this.diasSeleccionados.push(dia)
      }else{
        alert('ya seleccionaste este día') 
      }
    
    }else{
      this.diasSeleccionados.push(dia)
    }
    
    console.log(this.diasSeleccionados)
 
  }

  obtenerFranjasHorarias(){
    return this.franjasHorarias
  }

  seleccionarFranjaHoraria(horarioSeleccionado:any){
    this.horarioSeleccionado = horarioSeleccionado
  }

  seleccionarEspecialidad(especialidadSeleccionada:any){
    this.especialidadSeleccionada = especialidadSeleccionada
  }

  obtenerEspecialidades(){
    return this.miUsuario.especialidades
  }

  diaSeleccionado(dia:any)
  {
    this.dia = dia;
  }

  crearHorario()
  {
    let horario = new Horario()

    horario.especialistaId = this.firebase.usuarioLogueado.id;

    let horarioEspecialidad = {
      //dias: this.dias,
      dias: this.dia,
      nombre: this.especialidadSeleccionada,
      rangoHorario: this.horarioSeleccionado  
    }
    horario.horariosEspecialidad.push(horarioEspecialidad);
    this.horarioService.agregarHorario(horario)
  }
}
