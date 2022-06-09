import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurnoModuleRoutingModule } from './turno-module-routing.module';
import { MisTurnosComponent } from 'src/app/mis-turnos/mis-turnos.component';


@NgModule({
  declarations: [MisTurnosComponent],
  imports: [
    CommonModule,
    TurnoModuleRoutingModule
  ]
})
export class TurnoModuleModule { }
