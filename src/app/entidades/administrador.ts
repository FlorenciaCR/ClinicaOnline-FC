export class Administrador {
    uid:string| undefined=''
    nombre:string
    apellido:string
    edad:number
    dni:number
    email:string
    password:string
    imgPerfil:string
    tipoUsuario:string
    verificadoEmail:boolean

    constructor(nombre:string='',apellido:string='',edad:number=0,dni:number=0,email:string='',password:string='',foto:string='', tipoUsuario:string='administrador',verificadoEmail:boolean=false){
        this.nombre=nombre
        this.apellido=apellido
        this.edad=edad
        this.dni=dni
        this.email=email
        this.password=password
        this.imgPerfil=foto
        this.tipoUsuario=tipoUsuario
        this.verificadoEmail=verificadoEmail
    }
        
    }