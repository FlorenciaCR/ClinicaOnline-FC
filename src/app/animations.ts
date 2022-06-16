import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('LoginPage => *,RegistroPage => BienvenidoPage, SolicitarTurnoPage => PerfilGeneralPage, PerfilGeneralPage => MiPerfilPage, MisTurnosPage => PerfilGeneralPage, PerfilGeneralPage => TurnosPage, ErrorPage => BienvenidoPage',[
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ left: '-100%' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ left: '100%', opacity : 2 }))
        ]),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%', opacity : 2 }))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('BienvenidoPage => LoginPage,BienvenidoPage => RegistroPage,BienvenidoPage => SolicitarTurnosPage,BienvenidoPage => PacientesPage,BienvenidoPage => PerfilGeneralPage,RegistroPage => LoginPage, PerfilGeneralPage => SolicitarTurnoPage , MiPerfilPage => PerfilGeneralPage , PerfilGeneralPage => MisTurnosPage, TurnosPage => PerfilGeneralPage,ErrorAdminPage => LoginPage,ErrorEPage => LoginPage,ErrorLogeoPage => LoginPage,ErrorPAPage => LoginPage,ErrorPEPage => LoginPage', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%'
          })
        ]),
        query(':enter', [
          style({ right: '-100%' })
        ]),
        query(':leave', animateChild()),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ right: '100%' , opacity : 2}))
          ]),
          query(':enter', [
            animate('300ms ease-out', style({ right: '0%' , opacity : 2 }))
          ])
        ]),
        query(':enter', animateChild()),
      ]),
  ]);