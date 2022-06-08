export class Especialista {
    uid:string| undefined=''
    nombre:string
    apellido:string
    edad:number
    dni:number
    especialidad:any
    email:string
    password:string
    imgPerfil:string
    habilitado:boolean
    tipoUsuario:string
    especialidades:string[] = []
    verificadoEmail:boolean

    constructor(nombre:string='',apellido:string='',edad:number=0,dni:number=0,especialidad:string='',email:string='',password:string='',foto:string='', tipoUsuario:string='especialista',habilitado:boolean=false,verificadoEmail:boolean=false, especialidades:string[]=[]){
        this.nombre=nombre
        this.apellido=apellido
        this.edad=edad
        this.dni=dni
        this.email=email
        this.password=password
        this.imgPerfil=foto
        this.tipoUsuario=tipoUsuario
        this.habilitado=habilitado
        this.verificadoEmail=verificadoEmail
        this.especialidades=especialidades
    }
        
    }