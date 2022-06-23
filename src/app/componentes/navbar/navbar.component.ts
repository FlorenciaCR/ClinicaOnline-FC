import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  usuarioLogueado = this.firebase.getCurrentUser();
  estaLogueado : any = null;
  esAdministrador:boolean=false;

  tipoUsuarioLogueado: any;
  
  constructor(public firebase:FirebaseService, private router: Router)
  {
    this.ObtenerUsuarioLogueado();
  }

  ngOnInit(): void {
    
  }

  ObtenerUsuarioLogueado()
  {
    this.firebase.getCurrentUser().subscribe(res =>{
      //console.log('ObtenerEmailUsuarioLogueado: '+ res?.email);
      this.firebase.getUsuario(res?.uid).subscribe(res=>{
        let aux = res.data();
        this.tipoUsuarioLogueado =aux?.['tipoUsuario'] 
        

      })
      this.estaLogueado = res ? true: false;
    })
  }

  CerrarSesion()
  {
    this.estaLogueado = false;
    this.firebase.logOut();
  }


}
