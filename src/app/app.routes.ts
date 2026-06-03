import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then(m => m.Home) },
  { path: 'levels', loadComponent: () => import('./market-levels/market-levels').then(m => m.MarketLevels) },
  { path: 'about', loadComponent: () => import('./about/about').then(m => m.About) },
  { path: 'contact', loadComponent: () => import('./contact/contact').then(m => m.Contact) },
  { path: '**', redirectTo: '' },
];
