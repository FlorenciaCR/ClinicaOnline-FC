import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  usuarioLogueado = this.authService.getCurrentUser();
  estaLogueado : any = null;
  constructor(private authService:FirebaseService, private router: Router)
  {
    this.ObtenerUsuarioLogueado();
  }

  ngOnInit(): void {
    
  }

  ObtenerUsuarioLogueado()
  {
    this.authService.getCurrentUser().subscribe(res =>{
      console.log('obtener usuario log: '+ res?.email);
      this.estaLogueado = res ? true: false;
    })
  }

  CerrarSesion()
  {
    this.estaLogueado = false;
    this.authService.logOut();
  }


}
