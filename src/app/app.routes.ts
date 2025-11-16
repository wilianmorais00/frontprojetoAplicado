import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./Component/logComponent/logComponent').then(
        (m) => m.LoginComponent
      ),
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./Component/homeComponent/homeComponent').then(
        (m) => m.HomeComponent
      ),
  },

  {
    path: 'client/new',
    loadComponent: () =>
      import('./Component/client-component/client-component').then(
        (m) => m.ClientComponent
      ),
  },

  {
    path: 'forms/new',
    loadComponent: () =>
      import('./Component/formscomponent/formscomponent').then(
        (m) => m.FormsComponent
      ),
  },

  {
    path: 'forms/answers/:id',
    loadComponent: () =>
      import(
        './Component/component-visualizacao/component-visualizacao'
      ).then((m) => m.ComponentVisualizacao),
  },

  { path: '**', redirectTo: 'login' },
];
