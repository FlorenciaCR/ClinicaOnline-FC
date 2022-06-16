import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoTurno'
})
export class EstadoTurnoPipe implements PipeTransform {

  /* 
  Utilizado en: 
    tabla-turnos-administrador.component.html = linea 25
    tabla-turnos-especialista.component.html = linea 34
    tabla-turnos-paciente.component.html = linea 34
  */

  transform(value: any) {
    if(!value.aceptado && !value.cancelado && !value.realizado && !value.rechazado){
      return 'Estado: Sin aceptar';
    }
    if(value.aceptado && !value.cancelado && !value.realizado && !value.rechazado){
      return 'Estado: Aceptado';
    }

    if(value.cancelado){
      return 'Estado: Cancelado';
    }

    if(value.realizado){
      return 'Estado: Realizado';
    }

    if(value.rechazado){
      return 'Estado: Rechazado';
    }

    return '';
  }

}
