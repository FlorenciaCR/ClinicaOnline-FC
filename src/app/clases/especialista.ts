export class Especialista {

    nombre:string
    apellido:string
    edad:number
    dni:number
    especialidad:any
    email:string
    password:string
    imgPerfil:string
    esAdministrador:boolean
    tipoUsuario:string
    verificadoEmail:boolean

    constructor(nombre:string='',apellido:string='',edad:number=0,dni:number=0,especialidad:string='',email:string='',password:string='',foto:string='', tipoUsuario:string='especialista',esAdministrador:boolean=false,verificadoEmail:boolean=false){
        this.nombre=nombre
        this.apellido=apellido
        this.edad=edad
        this.dni=dni
        this.email=email
        this.password=password
        this.imgPerfil=foto
        this.tipoUsuario=tipoUsuario
        this.esAdministrador=esAdministrador
        this.verificadoEmail=verificadoEmail
    }
        
    }