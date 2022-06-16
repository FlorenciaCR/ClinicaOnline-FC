import { Especialista } from "../entidades/especialista"
import { Paciente } from "../entidades/paciente"

export class Turno {

    id:string=''
    paciente:Paciente=new Paciente()
    especialista:Especialista=new Especialista()
    duracion:number
    especialidad:any
    fecha:Date = new Date()
    comentario:string=''
    resenia:string=''
    estadoTurno:number=0
    hizoEncuesta:boolean=false
    atencionCalificada:number=0
    
    constructor(duracion:number=30){
        this.duracion=duracion
        
    }

} 

// export class Turno {
//     id:string
//     fecha : Date;
//     nombreEspecialidad : string;
//     pacienteId : string;
//     especialistaId : string;
//     estado : string;
//     comentario : string;
//     encuesta : any;
//     duracion:number=30;
// }