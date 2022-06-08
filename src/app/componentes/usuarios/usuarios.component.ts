import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  constructor( private router : Router) { }
  puedeDarDeAltaAdmins:boolean=true;
  apareceRegistro:boolean=false;

  ngOnInit(): void {
  }
  
  irDarAltaUsuarios()
  {
    this.apareceRegistro=true;
    this.router.navigate(['registro']);
  }

}
