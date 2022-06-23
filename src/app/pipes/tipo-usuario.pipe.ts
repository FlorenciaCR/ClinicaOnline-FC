import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoUsuario'
})
export class TipoUsuarioPipe implements PipeTransform {


  transform(value : any){
    
    if(value == 'paciente'){
      return 'Paciente';
    }else if(value== 'especialista'){
      return 'Especialista';
    }else{
      return 'Administrador';
    }
  }

}
