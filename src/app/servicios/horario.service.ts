import { Injectable } from '@angular/core';
import { Horario } from '../entidades/horario';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  horarioCollectionReference: any;
  horarios: Observable<Horario>;
  horariosArray : any = []; 

  constructor(private angularF : AngularFirestore) {
    this.horarioCollectionReference = this.angularF.collection<Horario>('horarios');
    this.horarios = this.horarioCollectionReference.valueChanges({idField : 'id'});

    this.traerHorarios().subscribe(value =>{
      this.horariosArray = value;
    });

   }
   traerHorarios()
   {
     return this.horarios;
   }
 
   agregarHorario(horario : Horario)
   {
     return this.horarioCollectionReference.add({...horario})
   }
 
   modificarHorario(horario : any, id : any)
   {
     return this.angularF.collection('horarios').doc(id).update({...horario});
   }


}
