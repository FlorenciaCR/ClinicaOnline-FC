import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoUsuario'
})
export class TipoUsuarioPipe implements PipeTransform {

  /* 
  Utilizado en: 
    login.component.html = linea 33
  */

  transform(value : any){
    
    if(value.tipo == 'paciente'){
      return 'Paciente';
    }else if(value.tipo == 'especialista'){
      return 'Especialista';
    }else{
      return 'Administrador';
    }
  }

}
