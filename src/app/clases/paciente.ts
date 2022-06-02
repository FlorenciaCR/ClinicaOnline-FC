export class Paciente {

    nombre:string
    apellido:string
    edad:number
    dni:number
    obraSocial:any
    email:string
    password:string
    imgsPerfil:string[]
    tipoUsuario:string
    verificadoEmail:boolean
  
    constructor(nombre:string='',apellido:string='',edad:number=0,dni:number=0,obraSocial:string='',email:string='',password:string='',fotoPerfil:string[]=[],tipoUsuario:string='paciente',verificadoEmail:boolean=false){
        this.nombre=nombre
        this.apellido=apellido
        this.edad=edad
        this.dni=dni
        this.obraSocial=obraSocial
        this.email=email
        this.password=password
        this.imgsPerfil= fotoPerfil
        this.tipoUsuario=tipoUsuario
        this.verificadoEmail=verificadoEmail
    }
        
    }