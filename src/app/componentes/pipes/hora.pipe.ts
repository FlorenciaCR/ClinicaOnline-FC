import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hora'
})
export class HoraPipe implements PipeTransform {

   //Utilizado en SolicitarTurno
  transform(entrada : string, salida : string) 
  {
      let entradaArray;
      let salidaArray;
      let horarios = [];
      let hora;
      
      entradaArray = entrada.split(':');
      salidaArray = salida.split(':');

      do {

        if(entradaArray[1] == "00")
        {
          entradaArray[1] = "30";
        }
        else
        {
          if(entradaArray[1] == "30")
          {
            entradaArray[1] = "00";
            entradaArray[0] += 1;
          } 
        }

        horarios.push(entradaArray[0] + ':' + entradaArray[1]);
        
      } while(parseInt(entradaArray[0]) < parseInt(salidaArray[0]));

      return horarios;
    }

}
