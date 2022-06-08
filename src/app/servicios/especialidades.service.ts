import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Especialidad } from '../interfaces/especialidad';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {

  especialidadCollectionReference: any;
  especialidades: Observable<Especialidad>;
  especialidadesArray : any = ""; 

  constructor(private angularF : AngularFirestore) {
    this.especialidadCollectionReference = this.angularF.collection<Especialidad>('especialidades');
    this.especialidades = this.especialidadCollectionReference.valueChanges();

    this.traerEspecialidades().subscribe(value =>{
      this.especialidadesArray = value;
    });

   }

  traerEspecialidades()
  {
    return this.especialidades;
  }

  agregarEspecialidad(especialidad : Especialidad)
  {
    this.especialidadCollectionReference.add({...especialidad});
  }
}
