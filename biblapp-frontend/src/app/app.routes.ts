import { Routes } from '@angular/router';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { CategoriaEditComponent } from './pages/categoria/categoria-edit/categoria-edit.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { ClienteEditComponent } from './pages/cliente/cliente-edit/cliente-edit.component';
import { LibroComponent } from './pages/libro/libro.component';
import { LibroEditComponent } from './pages/libro/libro-edit/libro-edit.component';
import { ReservaComponent } from './pages/reserva/reserva.component';
import { ReservaEditComponent } from './pages/reserva/reserva-edit/reserva-edit.component';
import { SearchComponent } from './pages/search/search.component';

export const routes: Routes = [
  {
    path: 'pages/search',
    component: SearchComponent,
  },
  {
    path: 'pages/categoria',
    component: CategoriaComponent,
    children: [
      { path: 'new', component: CategoriaEditComponent },
      { path: 'edit/:id', component: CategoriaEditComponent },
    ],
  },
  {
    path: 'pages/cliente',
    component: ClienteComponent,
    children: [
      { path: 'new', component: ClienteEditComponent },
      { path: 'edit/:id', component: ClienteEditComponent },
    ],
  },
  {
    path: 'pages/libro',
    component: LibroComponent,
    children: [
      { path: 'new', component: LibroEditComponent },
      { path: 'edit/:id', component: LibroEditComponent },
    ],
  },
  {
    path: 'pages/reserva',
    component: ReservaComponent,
    children: [
      { path: 'new', component: ReservaEditComponent },
      { path: 'edit/:id', component: ReservaEditComponent },
    ],
  },
];

