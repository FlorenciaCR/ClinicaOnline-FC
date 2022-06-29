import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha',
})
export class FechaPipe implements PipeTransform {
  transform(value: Date): string {
    let dia = '';
    let mes = '';

    switch (value.getMonth()) {
      case 0:
        mes = 'Enero';
        break;
      case 1:
        mes = 'Febrero';
        break;
      case 2:
        mes = 'Marzo';
        break;
      case 3:
        mes = 'Abril';
        break;
      case 4:
        mes = 'Mayo';
        break;
      case 5:
        mes = 'Junio';
        break;
      case 6:
        mes = 'Julio';
        break;
      case 7:
        mes = 'Agosto';
        break;
      case 8:
        mes = 'Septiembre';
        break;
      case 9:
        mes = 'Octubre';
        break;
      case 10:
        mes = 'Noviembre';
        break;
      case 11:
        mes = 'Diciembre';
        break;
    }
    console.log('get date', value.getDate());
    console.log('day', value.getDay());
    console.log('day2', value.getUTCDay);

    switch (value.getDay()) {
      case 0:
        dia = 'Domingo';
        break;
      case 1:
        dia = 'Lunes';
        break;
      case 2:
        dia = 'Martes';
        break;
      case 3:
        dia = 'Miercoles';
        break;
      case 4:
        dia = 'Jueves';
        break;
      case 5:
        dia = 'Viernes';
        break;
      case 6:
        dia = 'Sabado';
        break;
    }
    //return `${dia} - ${value.getDate()} - ${mes}`;
    return  `${dia} - ${mes}`;
  }
}
