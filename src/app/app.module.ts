import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidoComponent } from './componentes/bienvenido/bienvenido.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { RegistroEspecialistaComponent } from './componentes/registro-especialista/registro-especialista.component';
import { RegistroPacienteComponent } from './componentes/registro-paciente/registro-paciente.component';
import { AngularFireModule } from "@angular/fire/compat";
import { environment } from "src/environments/environment";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { UsuariosListadoComponent } from './componentes/usuarios-listado/usuarios-listado.component';
import { RegistroAdminComponent } from './componentes/registro-admin/registro-admin.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SolicitarTurnoComponent } from './solicitar-turno/solicitar-turno.component';
import { TurnosComponent } from './turnos/turnos.component';

@NgModule({
  declarations: [
    AppComponent,
    BienvenidoComponent,
    NavbarComponent,
    LoginComponent,
    RegistroComponent,
    RegistroEspecialistaComponent,
    RegistroPacienteComponent,
    UsuariosComponent,
    UsuariosListadoComponent,
    RegistroAdminComponent,
    PerfilComponent,
    SolicitarTurnoComponent,
    TurnosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,    
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    })
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
