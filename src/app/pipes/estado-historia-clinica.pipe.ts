import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoHistoriaClinica'
})
export class EstadoHistoriaClinicaPipe implements PipeTransform {

  /* 
  Utilizado en: 
    perfil.component.html = lineas 91-93
    seccion-pacientes.component.html = lineas 52-54
    tabla-usuarios.component.html = linea 54-56
  */

  transform(clave : any, valor : any){
    
    if(clave == 'temperatura'){
      if(valor > 39){
        return '❗'
      }
    }else if(clave == 'peso'){
      if(valor > 200){
        return '❗'
      }
    }else if(clave == 'presion'){
      if(valor > 14){
        return '❗'
      }
    }

    return '✔️';
  }

}
