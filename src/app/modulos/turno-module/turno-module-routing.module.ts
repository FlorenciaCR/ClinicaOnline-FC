import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisTurnosComponent } from 'src/app/mis-turnos/mis-turnos.component';
import { SolicitarTurnoComponent } from 'src/app/solicitar-turno/solicitar-turno.component';
import { TurnosComponent } from 'src/app/turnos/turnos.component';

const routes: Routes = [
  {path: 'gestionTurnos', component: TurnosComponent},
  {path: 'solicitarTurno', component: SolicitarTurnoComponent},
  {path: 'misTurnos', component: MisTurnosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnoModuleRoutingModule { }

