import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  tipo : any;
  mensaje : string='';
  constructor() { }

  ngOnInit(): void {
  }

}
