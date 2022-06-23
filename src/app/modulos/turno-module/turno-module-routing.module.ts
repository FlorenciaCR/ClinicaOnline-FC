import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisTurnosComponent } from 'src/app/mis-turnos/mis-turnos.component';
import { SolicitarTurnoComponent } from 'src/app/solicitar-turno/solicitar-turno.component';
import { TurnosComponent } from 'src/app/turnos/turnos.component';

const routes: Routes = [
  {path: 'gestionTurnos', component: TurnosComponent,data: { animation: 'TurnosPage' }},
  {path: 'solicitarTurno', component: SolicitarTurnoComponent,data: { animation: 'SolicitarTurnoPage' }}, 
  {path: 'misTurnos', component: MisTurnosComponent,data: { animation: 'MisTurnosPage' }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnoModuleRoutingModule { }

