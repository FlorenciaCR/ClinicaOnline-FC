import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  usuariosCollectionReference: AngularFirestoreCollection;
  turnosCollectionReference: AngularFirestoreCollection;
  turnos: Observable<any>;
  turnosArray : any = [];


  constructor(private angularF : AngularFirestore) {
    this.usuariosCollectionReference = this.angularF.collection('usuariosColeccion');
    this.turnosCollectionReference = this.angularF.collection('turnos');
    // this.traerTurnos().subscribe(value =>{
    //   this.turnosArray = value;
    // });
   }

   
   traerTurnos()
   {
    return this.turnos;
  }
  
  agregarTurno(turno : any)
  {
    return this.turnosCollectionReference.add({...turno});
  }
  
  modificarTurno(turno : any, id : any)
  {
    return this.angularF.collection('turnos').doc(id).update(turno);
  }
  modificarDuracion(idEspecialista:string|undefined,objActualizado:any): Promise<any> {
    return this.usuariosCollectionReference.doc(idEspecialista).update(objActualizado);
  }
  umodificarPropiedad(idUsuario:string|undefined,objConCambio:any): Promise<any> {
    return this.usuariosCollectionReference.doc(idUsuario).update(objConCambio);
  }

  modificarEstado(idTurno:string|undefined,estadoTurno:number, nombreEstado:string): Promise<any> {
    return this.turnosCollectionReference.doc(idTurno).update({estadoTurno:estadoTurno, estado:nombreEstado});
  }

  tmodificarPropiedad(idTurno:string|undefined,objConCambio:any): Promise<any> {
    return this.turnosCollectionReference.doc(idTurno).update(objConCambio);
  }
}
