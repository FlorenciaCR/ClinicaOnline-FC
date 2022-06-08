import { Especialidad } from "./especialidad";
import { Especialista } from "../entidades/especialista";
import { Paciente } from "../entidades/paciente";

export interface Turno {

    paciente : Paciente;
    especialista : Especialista,
    especialidad : Especialidad;
    fecha : any;
    estado : string;
    comentario : string;
    encuesta : any;
}
