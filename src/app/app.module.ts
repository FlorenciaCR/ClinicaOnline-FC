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
import { SeccionUsuariosComponent } from './componentes/seccion-usuarios/seccion-usuarios.component';
import { SeccionPacientesComponent } from './componentes/seccion-pacientes/seccion-pacientes.component';
import { HistorialClinicoComponent } from './componentes/historial-clinico/historial-clinico.component';
import { EstadoHistoriaClinicaPipe } from './pipes/estado-historia-clinica.pipe';
import { ListaTurnospComponent } from './componentes/lista-turnosp/lista-turnosp.component';
import { FechaPipe } from 'src/app/pipes/fecha.pipe';
import { HoraPipe } from './pipes/hora.pipe';
import { AgrandarDirective } from './directivas/agrandar.directive';
import { BordeDirective } from './directivas/borde.directive';
import { ColorDirective } from './directivas/color.directive';
import { EstadisticasComponent } from './componentes/estadisticas/estadisticas.component';


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
    TurnosComponent,
    SeccionUsuariosComponent,
    SeccionPacientesComponent,
    HistorialClinicoComponent,
    EstadoHistoriaClinicaPipe,
    ListaTurnospComponent,
    HoraPipe,
    FechaPipe,
    AgrandarDirective,
    BordeDirective,
    ColorDirective,
    EstadisticasComponent
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
  providers: [EstadoHistoriaClinicaPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
