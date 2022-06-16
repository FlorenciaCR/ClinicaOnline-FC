import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { DatePipe } from '@angular/common';
import { EstadoHistoriaClinicaPipe } from 'src/app/pipes/estado-historia-clinica.pipe';

@Component({
  selector: 'app-seccion-pacientes',
  templateUrl: './seccion-pacientes.component.html',
  styleUrls: ['./seccion-pacientes.component.scss']
})
export class SeccionPacientesComponent implements OnInit {

  coleccion : any;
  usuarios : any;
  usuariosBD : any;

  turnos : any;
  turnosBD : any;

  mostrarPacientes : boolean = true;
  mostrarHistoriaClinica : boolean = false;

  pacientesValidos : any[] = [];
  pacienteSeleccionado : any;
  turnosPaciente : any[] = [];

  constructor(private  firebase : FirebaseService, private datePipe : DatePipe, public estadoHistoriaClinica : EstadoHistoriaClinicaPipe) { }
  ngOnInit(): void {}
  //   this.coleccion = this.db.collection<any>('usuarios');
  //   this.usuarios = this.coleccion.valueChanges({idField: 'id'});

  //   this.coleccion = this.db.collection<any>('turnos');
  //   this.turnos = this.coleccion.valueChanges({idField: 'id'});
  // }

  // ngOnInit(): void {
  //   this.usuarios.subscribe((usuarios : any) => {
  //     this.usuariosBD = usuarios;
  //   });

  //   this.turnos.subscribe((turnos : any) => {
  //     this.turnosBD = turnos;
  //     this.validarPacientes()
  //   });

  // }

  // seleccionarPaciente(item : any){
  //   this.pacienteSeleccionado = item;
  //   this.validarTurnosPaciente();
  //   this.mostrarPacientes = false;
  //   this.mostrarHistoriaClinica = true;
  // }

  // validarPacientes(){

  //   let dniPacientes : any[] = [];
  //   let arrAux : any[] = [];
  //   let index : any;

  //     for(let turno of this.turnosBD){
        
  //       if(turno.dniEspecialista == this.auth.currentUser.dni){
          
  //         index = dniPacientes.indexOf(turno.dniPaciente);

  //         if(index == -1){
            
  //           dniPacientes.push(turno.dniPaciente);

  //         }

  //       }

  //     }

  //     for(let item of this.usuariosBD){

  //         if(dniPacientes.includes(item.dni)){
  //             arrAux.push(item);
  //         }

  //     }

  //     console.log(arrAux);
  //     this.pacientesValidos = arrAux;
  // }

  // validarTurnosPaciente(){

  //   this.turnosPaciente = [];

  //   for(let item of this.turnosBD){
  //     if(item.dniPaciente == this.pacienteSeleccionado.dni && item.dniEspecialista == this.auth.currentUser.dni){
  //       this.turnosPaciente.push(item);
  //     }
  //   }
  // }

  // tabla : any;

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
  //   pdf.add({text: 'Historia clinica paciente: ' + this.pacienteSeleccionado.nombre + ' ' + this.pacienteSeleccionado.apellido, alignment: 'center',fontSize: 22, bold: true,  margin: [50, 20]})
  //   pdf.add(this.createTable());
  //   pdf.create().download();

  // }

  // createTable(){
  //   this.formatDataToTable();
  //   [{}]
  //   return new Table(this.tabla).alignment('center').end;
  // }

  // formatDataToTable(){

  //   let turnosPDF : any[] = []

  //   for(let item of this.turnosPaciente){
  //     if(item.historiaClinica != null){
  //       turnosPDF.push(item);
  //     }
  //   }

  //   this.tabla = turnosPDF.map((turno:any)=>{
  //     let row = [];
  //     let rowAux = [];
  //     row.push(
  //       'Fecha: ' + turno.dia + ' ' + turno.hora + '\n' +
  //       'Especialidad: ' + turno.especialidad + '\n'
  //     );
  //     row.push(
  //       'Altura: ' + turno.historiaClinica.altura + '\n' + 
  //       'Peso: ' +  turno.historiaClinica.peso + '\n' +
  //       'Temperatura: ' +  turno.historiaClinica.temperatura + '\n' + 
  //       'Presion: ' + turno.historiaClinica.presion + '\n'
  //       );
  //       for(let item of turno.historiaClinica.claveValor){
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


  // cerrarHistoriaClinica(){
  //   this.mostrarHistoriaClinica = false;
  //   this.mostrarPacientes = true;
  // }
}
