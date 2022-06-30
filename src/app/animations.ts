import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";

// export const slideInAnimation =
//   trigger('routeAnimations', [
//     transition('LoginPage => *,RegistroPage => BienvenidoPage, SolicitarTurnoPage => PerfilGeneralPage, PerfilGeneralPage => MiPerfilPage, MisTurnosPage => PerfilGeneralPage, BienvenidoPage => TurnosPage, BienvenidoPage => MisTurnosPage',[
//       style({ position: 'relative' }),
//       query(':enter, :leave', [
//         style({
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%'
//         })
//       ]),
//       query(':enter', [
//         style({ top: '-100%' })
//       ]),
//       query(':leave', animateChild()),
//       group([
//         query(':leave', [
//           animate('300ms ease-out', style({ top: '100%', opacity : 2 }))
//         ]),
//         query(':enter', [
//           animate('300ms ease-out', style({ top: '0%', opacity : 2 }))
//         ])
//       ]),
//       query(':enter', animateChild()),
//     ]),
//     transition('BienvenidoPage => LoginPage,BienvenidoPage => RegistroPage,BienvenidoPage => SolicitarTurnosPage,BienvenidoPage => PacientesPage,BienvenidoPage => PerfilGeneralPage,RegistroPage => LoginPage, PerfilGeneralPage => SolicitarTurnoPage , MiPerfilPage => PerfilGeneralPage , PerfilGeneralPage => MisTurnosPage, TurnosPage => PerfilGeneralPage,ErrorAdminPage => LoginPage,ErrorEPage => LoginPage,ErrorLogeoPage => LoginPage,ErrorPAPage => LoginPage,ErrorPEPage => LoginPage', [
//         style({ position: 'relative' }),
//         query(':enter, :leave', [
//           style({
//             position: 'absolute',
//             top: 0,
//             right: 0,
//             width: '100%'
//           })
//         ]),
//         query(':enter', [
//           style({ top: '-100%' })
//         ]),
//         query(':leave', animateChild()),
//         group([
//           query(':leave', [
//             animate('300ms ease-out', style({ top: '100%' , opacity : 2}))
//           ]),
//           query(':enter', [
//             animate('300ms ease-out', style({ top: '0%' , opacity : 2 }))
//           ])
//         ]),
//         query(':enter', animateChild()),
//       ]),
//   ]);