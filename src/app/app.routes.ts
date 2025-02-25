import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'setup',
    pathMatch: 'full'
  },
  {
    path: 'setup',
    loadComponent: () => import('./setup/setup.page').then(m => m.SetupPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'main/sub-profiles',
    loadComponent: () => import('./sub-profiles/sub-profiles.page').then(m => m.SubProfilesPage)
  },
  {
    path: 'main/dash',
    loadComponent: () => import('./main-dash/main-dash.page').then(m => m.MainDashPage)
  },
  {
    path: 'main/search-results',
    loadComponent: () => import('./search-results/search-results.page').then(m => m.SearchResultsPage)
  },
  {
    path: 'main/movie',
    loadComponent: () => import('./movie/movie.page').then(m => m.MoviePage)
  },
  {
    path: 'main/dash/movie/:id',
    loadComponent: () => import('./movie-details/movie-details.page').then(m => m.MovieDetailsPage)
  },
  {
    path: 'main/dash/show/:id',
    loadComponent: () => import('./show-details/show-details.page').then(m => m.ShowDetailsPage)
  },
  {
    path: 'player/:videoId',
    loadComponent: () => import('./player/player.page').then(m => m.PlayerPage)
  },
  {
    path: 'show-details',
    loadComponent: () => import('./show-details/show-details.page').then( m => m.ShowDetailsPage)
  },
  {
    path: 'player',
    loadComponent: () => import('./player/player.page').then( m => m.PlayerPage)
  }
];