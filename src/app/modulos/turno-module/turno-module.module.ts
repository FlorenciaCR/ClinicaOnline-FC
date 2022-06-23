import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurnoModuleRoutingModule } from './turno-module-routing.module';
import { MisTurnosComponent } from 'src/app/mis-turnos/mis-turnos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [MisTurnosComponent],
  imports: [
    CommonModule,
    TurnoModuleRoutingModule,
    FormsModule,ReactiveFormsModule,
    
  ]
})
export class TurnoModuleModule { }
