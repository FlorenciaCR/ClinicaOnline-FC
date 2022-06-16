import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import 'firebase/compat/storage';
//import firebase from 'firebase/compat';
import firebase from 'firebase/compat/app';
import { userInfo } from 'os';
import { ToastrService } from 'ngx-toastr';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private usuariosRef : AngularFirestoreCollection;
  storageRef = firebase.app().storage().ref();
  esPaciente:boolean = false
  esEspecialista:boolean = false
  estaLogueado : boolean=false;
  esAdmin : boolean =false;
  tipoUsuario:string=""
  
  logeado : any = false

  usuariosObs:any

  usuarioLogueado: any = ""
  usuarios:any
  especialistas:any
  pacientes:any

  constructor(private afauth : AngularFireAuth, 
    private firestore : AngularFirestore
    ,private firestorage : AngularFireStorage,
     private router : Router, private ts : ToastrService) 
  { 
    this.usuariosRef= firestore.collection('usuariosColeccion');
    this.usuariosObs = this.usuariosRef.valueChanges()

    this.usuariosObs.subscribe(x => {
      this.usuarios = x
      this.especialistas = x.filter(k => k.tipoUsuario == "especialista")
      this.pacientes = x.filter(k => k.tipoUsuario == "paciente")
    })

    this.getCurrentUser().subscribe(res=>{
      if(res!=null){
         this.esAdmin=this.esAdministrador(res)
         this.estaLogueado=true
      }else{
       this.estaLogueado=false
       this.esAdmin=false;
      }
    })

    

    this.obtenerTipoUsuario();
  }

  esAdministrador(usuario:any)
  {
      return usuario && usuario.email == 'admin@admin.com';
  }

  obtenerTipoUsuario(){
    this.getCurrentUser().subscribe(x => {
      this.obtenerTodos("usuariosColeccion").subscribe(i => {
        i.forEach(user => {
          if(user.uid == x?.uid){
            //console.log("ObtenerTipoUsuario (login):", this.tipoUsuario)
            this.tipoUsuario = user.tipoUsuario
          }
        })
      })
    })
  }

  obtenerUsuarioDatos(){
    this.getCurrentUser().subscribe(x => {
      this.obtenerTodos("usuariosColeccion").subscribe(i => {
        i.forEach(user => {
          if(user.uid == x?.uid){
            //console.log("Obtengo al usuario firestore:", this.usuarioLogueado)
            this.usuarioLogueado = user
          }
        })
      })
    })
  }

  esPacientefn(usuario:any){

    if(usuario){
      usuario.tipoUsuario=='paciente'?this.esPaciente=true:null
    }

  }
  esEspecialistafn(usuario:any){

    if(usuario){
      usuario.tipoUsuario=='especialista'?this.esEspecialista=true:null
    }

  }

  async logIn(email: string, contrasenia : string)
  {
     return await this.afauth.signInWithEmailAndPassword(email,contrasenia)
    //  .then(x => {
    //   if(x.user?.emailVerified){
    //     this.obtenerTipoUsuario()
    //     return x.user
    //   }else{
    //     return false
    //   }
    //  })
    //  .catch(error=>{
    //   throw(error);
    //   });
  }

  verificarEmail(coleccion:any,id:string)
  {
    this.firestore.collection(coleccion).doc(id).update({emailVerificado: true});
  }

  async register(email: string, contrasenia : string)
  {
    return await this.afauth.createUserWithEmailAndPassword(email,contrasenia)
    // .then(x =>{
    //   this.sendEmailForVerification(x)
    //   this.logOut()
    //   return x
    // })
    // .catch(error=>{
    //   throw(error);
    //   });
  }

  sendEmailForVerification(user:any)
  {
    return this.afauth.currentUser.then((u:any) => u.sendEmailVerification())
    .then(() => {
      // this.ruteo.navigateByUrl('verifyEmail');
      //TODO: PANTALLA VERIFY EMAIL
    })
      
  }

  getCurrentUser()
  {
    return this.afauth.authState;
  }

  getUsuario(id:string|undefined)
  { 
    return this.usuariosRef.doc(id).get()
  }

  logOut()
  {
    this.tipoUsuario = ""
    this.esAdmin = false
    this.afauth.signOut();
  }
  
  async crear(nombreColeccion : string, data : string)
  {
    return await this.firestore.collection<any>(nombreColeccion).add(data);
  }

  agregarDataCollection(nameColection:string,data:any){
    let response = {status:true,error:''}
    let collection = this.firestore.collection<any>(nameColection)
    try {
      collection.add(data) .then(data=>{
        if(!data){
          response.status=false;
          response.error='data vacia';}
      })
    } catch (error) {
        response.status=false;
        response.error=`${error}`; 
        console.log(error)
    }
    return response
  }


//Pone el mismo id en auth y firestore
//TODO:"FIXME
  crearDocumentoConIdEnCol(nameColection:string,nameDocument:string,data:any)
  {
    let response = {status:true,error:''}
    this.firestore.collection(nameColection).doc(nameDocument).set(data);

    let collection = this.firestore.collection<any>(nameColection)
    try {
      collection.doc(nameDocument).set(data).then(data=>{
        
          response.status=false;
          response.error='vacio';
      })
    }catch (error) {
        response.status=false;
        response.error=`${error}`; 
        console.log(error)
    }
    return response
  }

  // getByEmail(email:string){
  //   this.firestore.collection('pacientesColeccion', ref => ref.where('email', '==', email).limit(1)).get().subscribe(data => {return data})
  // }

  getById(id:string):any{
    // this.firestore.collection('usuariosColeccion', ref => ref.where('uid', '==', id).limit(1)).get().subscribe(data => {return data})
    this.firestore.collection('usuariosColeccion').get().subscribe(data => {return data})

  }

  obtenerTodos(nombreColeccion : string){
    let collection = this.firestore.collection<any>(nombreColeccion)
    return collection.valueChanges({idField: 'id'});
  }

  obtenerUsuariosCollection(){
    return this.usuariosRef.get();
  }
  habilitarEspecialista(id:string,valor: any): Promise<any> {
    return this.usuariosRef.doc(id).update({
      habilitado:valor
    });
  }

  obtenerTodos2(nameColection:string){
    let collection = this.firestore.collection<any>(nameColection)
    return collection.valueChanges();
  }

  async subirImagenes (nombreAlbum:string,nombre:string,imgB64:any){
    try {
      let rta = await this.storageRef.child(`${nombreAlbum}/${nombre}`).putString(imgB64,'data_url') // name carpeta/Nombre imagen 
        //console.log(rta)
        return await rta.ref.getDownloadURL();
    } catch (error) {
      
      console.log(error)
      return null
    }
  }

  async subirImagenV2(nombre:string, imgBase64:any){
    let storareRef = firebase.app().storage().ref();
    
    try {
      let respuesta = await storareRef.child("users/" + nombre).putString(imgBase64, 'data_url');
      //console.log(respuesta);
      return await respuesta.ref.getDownloadURL();
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  modificarPaciente(paciente : any, id : any)
  {
    return this.firestore.collection('pacientes').doc(id).update(paciente);
  }

  
  RegistrarLog(user : any)
  {
    return this.firestore.collection("logs").add(user);
  }

  traerLogs()
  {
    // return this.logs;
  }


  updateDuracion(idEspecialista:string|undefined,objActualizado:any): Promise<any> {
    return this.usuariosRef.doc(idEspecialista).update(objActualizado);
  }
}
