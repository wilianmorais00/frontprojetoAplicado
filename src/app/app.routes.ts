import { Routes } from '@angular/router';
import { GuardaRotasAdmin } from './Service/admin-service';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./Component/logComponent/logComponent').then(
        (m) => m.TelaLoginComponent
      ),
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./Component/homeComponent/homeComponent').then(
        (m) => m.TelaInicialComponent
      ),
  },

  {
    path: 'client/new',
    loadComponent: () =>
      import('./Component/client-component/client-component').then(
        (m) => m.CadastroHospedeComponent
      ),
  },

  {
    path: 'forms/new',
    loadComponent: () =>
      import('./Component/formscomponent/formscomponent').then(
        (m) => m.ConstrutorFormularioComponent
      ),
  },

  {
    path: 'forms/answers/:id',
    loadComponent: () =>
      import('./Component/component-visualizacao/component-visualizacao').then(
        (m) => m.PainelRespostasFormularioComponent
      ),
  },

  {
    path: 'public/form',
    loadComponent: () =>
      import('./Component/publicform-component/publicform-component').then(
        (m) => m.FormularioPublicoComponent
      ),
  },

  {
    path: 'users',
    canActivate: [GuardaRotasAdmin],
    loadComponent: () =>
      import('./Component/component-users/component-users').then(
        (m) => m.GerenciamentoUsuariosComponent
      ),
  },

  { path: '**', redirectTo: 'login' },
];
