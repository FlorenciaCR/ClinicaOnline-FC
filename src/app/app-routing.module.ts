import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidoComponent } from './componentes/bienvenido/bienvenido.component';
import { LoginComponent } from './componentes/login/login.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { SeccionUsuariosComponent } from './componentes/seccion-usuarios/seccion-usuarios.component';
import { UsuariosListadoComponent } from './componentes/usuarios-listado/usuarios-listado.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';

const routes: Routes = [
  {path:'', redirectTo: 'bienvenido',pathMatch:'full'},
  {path: 'registro', component: RegistroComponent,data: { animation: 'RegistroPage' }},
  {path: 'bienvenido', component: BienvenidoComponent,data: { animation: 'BienvenidoPage' }},
  {path: 'login', component: LoginComponent,data: { animation: 'LoginPage' }},
  {path: 'usuarios', component: UsuariosComponent,data: { animation: 'UsuariosPage' }},
  {path: 'perfil', component: PerfilComponent,data: { animation: 'MiPerfilPage' }},
  {path: 'turno', loadChildren: () => import('./modulos/turno-module/turno-module.module').then(m => m.TurnoModuleModule)},
  {path: 'seccionUsuarios', component: SeccionUsuariosComponent,data: { animation: 'MiPerfilPage' }},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
