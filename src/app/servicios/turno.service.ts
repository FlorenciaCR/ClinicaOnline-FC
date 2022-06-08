import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  turnoCollectionReference: any;
  turnos: Observable<any>;
  turnosArray : any = [];

  constructor(private angularF : AngularFirestore) {
    this.turnoCollectionReference = this.angularF.collection('turnos');
    this.turnos = this.turnoCollectionReference.valueChanges({idField : 'id'});
    this.traerTurnos().subscribe(value =>{
      this.turnosArray = value;
    });
   }

  traerTurnos()
  {
    return this.turnos;
  }

  agregarTurno(turno : any)
  {
    return this.turnoCollectionReference.add({...turno});
  }

  modificarTurno(turno : any, id : any)
  {
    return this.angularF.collection('turnos').doc(id).update(turno);
  }
}
