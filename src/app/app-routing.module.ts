import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidoComponent } from './componentes/bienvenido/bienvenido.component';
import { EstadisticasComponent } from './componentes/estadisticas/estadisticas.component';
import { LoginComponent } from './componentes/login/login.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { SeccionPacientesComponent } from './componentes/seccion-pacientes/seccion-pacientes.component';
import { SeccionUsuariosComponent } from './componentes/seccion-usuarios/seccion-usuarios.component';
import { UsuariosListadoComponent } from './componentes/usuarios-listado/usuarios-listado.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';

const routes: Routes = [
  {path:'', redirectTo: 'bienvenido',pathMatch:'full'},
  {path: 'registro', component: RegistroComponent},
  {path: 'bienvenido', component: BienvenidoComponent},
  {path: 'login', component: LoginComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'perfil', component: PerfilComponent},
  {path: 'turno', loadChildren: () => import('./modulos/turno-module/turno-module.module').then(m => m.TurnoModuleModule)},
  {path: 'seccionUsuarios', component: SeccionUsuariosComponent},
  {path: 'seccionPacientes', component: SeccionPacientesComponent},
  {path: 'estadisticas', component: EstadisticasComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
