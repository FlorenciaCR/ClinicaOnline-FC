import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import 'firebase/compat/storage';
//import firebase from 'firebase/compat';
import firebase from 'firebase/compat/app';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private especialistasRef : AngularFirestoreCollection;
  storageRef = firebase.app().storage().ref();
  esAdmin :boolean = false
  esPaciente:boolean = false
  esEspecialista:boolean = false


  constructor(private afauth : AngularFireAuth, 
    private firestore : AngularFirestore
    ,private firestorage : AngularFireStorage,
     private router : Router) 
  { 
    this.especialistasRef = firestore.collection('especialistasColeccion');
  }


  esAdministrador(usuario:any){

    if(usuario){
      usuario.isAdmin?this.esAdmin=true:null
    }

  }
  esPacientefn(usuario:any){

    if(usuario){
      usuario.perfil=='paciente'?this.esPaciente=true:null
    }

  }
  esEspecialistafn(usuario:any){

    if(usuario){
      usuario.perfil=='especialista'?this.esEspecialista=true:null
    }

  }

  async logIn(email: string, contrasenia : string)
  {
     return await this.afauth.signInWithEmailAndPassword(email,contrasenia)
     .catch(error=>{
      throw(error);
      });
  }

  async register(email: string, contrasenia : string)
  {
    return await this.afauth.createUserWithEmailAndPassword(email,contrasenia)
    .catch(error=>{
      throw(error);
      });
  }

  getCurrentUser()
  {
    return this.afauth.authState;
  }

  logOut()
  {
    this.afauth.signOut();
  }
  
  async crear(nombreColeccion : string, data : string)
  {
    let resultado:boolean=false;
    return await this.firestore.collection<any>(nombreColeccion).add(data);
  }

  getByEmail(email:string){
    this.firestore.collection('pacientesColeccion', ref => ref.where('email', '==', email).limit(1)).get().subscribe(data => {return data})
  }

  crear2(nameColection:string,data:any){
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


  obtenerTodos(nombreColeccion : string){
    let collection = this.firestore.collection<any>(nombreColeccion)
    return collection.valueChanges({idField: 'id'});
  }


  //h
  obtenerTodos2(nameColection:string){
    let collection = this.firestore.collection<any>(nameColection)
    return collection.valueChanges();
  }


  async subirImagenes (nombreAlbum:string,nombre:string,imgB64:any){
    try {
      let rta = await this.storageRef.child(`${nombreAlbum}/${nombre}`).putString(imgB64,'data_url') // name carpeta/Nombre imagen 
        console.log(rta)
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
      console.log(respuesta);
      return await respuesta.ref.getDownloadURL();
    } catch (err) {
      console.log(err);
      return null;
    }
  }


}
