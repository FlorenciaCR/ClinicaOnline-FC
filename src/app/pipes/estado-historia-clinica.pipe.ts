import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoHistoriaClinica'
})
export class EstadoHistoriaClinicaPipe implements PipeTransform {

//mi perfil paciente 
  transform(clave : any, valor : any){
    
    if(clave == 'temperatura'){
      if(valor > 39){
        return '🔥'
      }
    }else if(clave == 'peso'){
      if(valor > 200){
        return ''
      }
    }else if(clave == 'presion'){
      if(valor > 14){
        return '💥'
      }
    }

    return '🆗';
  }

}
