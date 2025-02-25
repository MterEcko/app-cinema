import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonMenu, IonList, IonItem, IonLabel, IonMenuToggle, IonMenuButton, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ApiService } from '../core/api.service';
import { SwiperModule } from 'swiper/angular';
import SwiperCore, { Navigation } from 'swiper';
import { RouterModule } from '@angular/router';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-main-dash',
  templateUrl: './main-dash.page.html',
  styleUrls: ['./main-dash.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonMenu, IonList, IonItem, IonLabel, IonMenuToggle, IonMenuButton, CommonModule, SwiperModule, RouterModule, IonButton, IonIcon]
})
export class MainDashPage implements OnInit {
  profiles: any[] = [];
  selectedProfile: any = null;
  movies: any[] = [];
  shows: any[] = [];
  genres: any[] = [];
  allMovies: any[] = [];
  allShows: any[] = [];
  newReleases: any[] = [];
  continueWatching: any[] = [];
  recommendations: any[] = [];
  newestShows: any[] = [];
  newestMovies: any[] = [];
  newestAddedShows: any[] = [];
  newestAddedMovies: any[] = [];
  selectedGenre: any = null;
  public screenWidth: number = window.innerWidth;

  constructor(private router: Router, private apiService: ApiService) {
    // Escuchar cambios de ruta para limpiar el estado si volvemos a /main/dash
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/main/dash') {
        // No necesitas limpiar nada aquí ya que eliminamos searchQuery y showSearch
      }
    });
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }

  getSlidesPerView(): number {
    const baseWidth = 210; // Ancho base por elemento (ajustable, ~210x315px para sliders)
    if (this.screenWidth < 365) {
      return 1; // 1 elemento en pantallas pequeñas
    }
    const calculatedSlides = Math.floor(this.screenWidth / baseWidth); // Calcula cuántos caben
    return Math.max(2, calculatedSlides); // Mínimo 2, aumenta con el ancho
  }

  ngOnInit() {
    this.loadProfiles();
    this.loadMovies();
    this.loadShows();
    this.loadGenres();
    this.loadNewReleases();
    this.loadContinueWatching();
    this.loadRecommendations();
    this.loadNewestShows();
    this.loadNewestMovies();
    this.loadNewestAddedShows();
    this.loadNewestAddedMovies();
    const storedProfile = localStorage.getItem('selectedProfile');
    if (storedProfile) {
      this.selectedProfile = JSON.parse(storedProfile);
    }
  }

  loadProfiles() {
    this.apiService.getProfiles().subscribe({
      next: (profiles) => {
        this.profiles = profiles;
        console.log('Perfiles cargados en dashboard:', profiles);
      },
      error: (error) => {
        console.error('Error al cargar perfiles:', error);
        this.profiles = [{ profileName: 'Usuario 1' }, { profileName: 'Usuario 2' }];
      }
    });
  }

  loadMovies() {
    this.apiService.getMovies().subscribe({
      next: (movies) => {
        this.allMovies = movies;
        this.movies = movies;
        console.log('Películas cargadas:', movies);
      },
      error: (error) => {
        console.error('Error al cargar películas:', error);
        this.movies = [];
        this.allMovies = [];
      }
    });
  }

  loadShows() {
    this.apiService.getShows().subscribe({
      next: (shows) => {
        this.allShows = shows;
        this.shows = shows;
        console.log('Series cargadas:', shows);
      },
      error: (error) => {
        console.error('Error al cargar series:', error);
        this.shows = [];
        this.allShows = [];
      }
    });
  }

  loadGenres() {
    this.apiService.getGenres().subscribe({
      next: (genres) => {
        this.genres = genres;
        console.log('Géneros cargados:', genres);
      },
      error: (error) => {
        console.error('Error al cargar géneros:', error);
        this.genres = [];
      }
    });
  }

  loadNewReleases() {
    this.apiService.getNewReleases().subscribe({
      next: (releases) => {
        this.newReleases = releases;
        console.log('Nuevos estrenos cargados:', releases);
      },
      error: (error) => console.error('Error al cargar nuevos estrenos:', error)
    });
  }

  loadContinueWatching() {
    const profileId = this.selectedProfile?.id;
    this.apiService.getContinueWatching(profileId).subscribe({
      next: (items) => {
        this.continueWatching = items;
        console.log('Continue watching cargado:', items);
        console.log('Con el perfil:', this.selectedProfile);
        if (!items || items.length === 0) {
          console.log('No se encontraron datos en Continue Watching para el perfil:', this.selectedProfile);
        }
      },
      error: (error) => {
        console.error('Error al cargar continue watching:', error);
        this.continueWatching = [];
      }
    });
  }

  loadRecommendations() {
    this.apiService.getRecommendations().subscribe({
      next: (items) => {
        this.recommendations = items;
        console.log('Recomendaciones cargadas:', items);
      },
      error: (error) => console.error('Error al cargar recomendaciones:', error)
    });
  }

  loadNewestShows() {
    this.apiService.getShows({ sort: 'first_air_date', order: 'DESC' }).subscribe({
      next: (shows) => {
        this.newestShows = shows;
        console.log('Series más nuevas cargadas:', shows);
      },
      error: (error) => console.error('Error al cargar series más nuevas:', error)
    });
  }

  loadNewestMovies() {
    this.apiService.getMovies({ sort: 'release_date', order: 'DESC' }).subscribe({
      next: (movies) => {
        this.newestMovies = movies;
        console.log('Películas más nuevas cargadas:', movies);
      },
      error: (error) => console.error('Error al cargar películas más nuevas:', error)
    });
  }

  loadNewestAddedShows() {
    this.apiService.getShows({ sort: 'dateCreated', order: 'DESC' }).subscribe({
      next: (shows) => {
        this.newestAddedShows = shows;
        console.log('Series recién añadidas cargadas:', shows);
      },
      error: (error) => console.error('Error al cargar series recién añadidas:', error)
    });
  }

  loadNewestAddedMovies() {
    this.apiService.getMovies({ sort: 'dateCreated', order: 'DESC' }).subscribe({
      next: (movies) => {
        this.newestAddedMovies = movies;
        console.log('Películas recién añadidas cargadas:', movies);
      },
      error: (error) => console.error('Error al cargar películas recién añadidas:', error)
    });
  }

  selectProfile(profile: any) {
    this.selectedProfile = profile;
    localStorage.setItem('selectedProfile', JSON.stringify(profile));
    console.log('Perfil seleccionado en dashboard:', profile);
    this.loadContinueWatching(); // Actualiza "Continue Watching" al cambiar de perfil
  }

  selectGenre(genre: any) {
    this.selectedGenre = genre;
    console.log('Género seleccionado:', genre);
    this.filterByGenre(genre);
  }

  filterByGenre(genre: any) {
    if (!genre) {
      this.movies = [...this.allMovies];
      this.shows = [...this.allShows];
      return;
    }
    this.movies = this.allMovies.filter(movie =>
      movie.genre.some((g: any) => g.id === genre.id)
    );
    this.shows = this.allShows.filter(show =>
      show.genre.some((g: any) => g.id === genre.id)
    );
    console.log('Películas filtradas:', this.movies);
    console.log('Series filtradas:', this.shows);
  }

  goToDashboard() {
    this.selectedGenre = null;
    this.filterByGenre(null);
    this.router.navigate(['/main/dash']);
  }

  goToManageProfiles() {
    this.router.navigate(['/main/sub-profiles']);
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('selectedProfile');
    this.router.navigate(['/setup']);
  }
  

  // Método para redirigir a /search-results con un query
  goToSearch(query: string) {
    console.log('Intentando redirigir a /search-results con query:', query || 'vacío');
    this.router.navigate(['/main/search-results'], { queryParams: { q: query || '' } })
      .then(success => {
        if (success) {
          console.log('Navegación exitosa a /search-results');
        } else {
          console.error('Navegación fallida a /search-results');
        }
      })
      .catch(error => {
        console.error('Error en la navegación a /search-results:', error);
      });
  }

  navigateToNewReleaseItem(item: any) {
    const media = item.media;
    if (media.type === 'movie') {
      this.router.navigate(['/main/dash/movie', media.id]);
    } else if (media.type === 'tvShow') {
      this.router.navigate(['/main/dash/show', media.id]);
    }
  }

  navigateToRecomendations(item: any) {
    const media = item.media;
    if (media.type === 'movie') {
      this.router.navigate(['/main/dash/movie', media.id]);
    } else if (media.type === 'tvShow') {
      this.router.navigate(['/main/dash/show', media.id]);
    }
  }

  navigateToDiscoverMovies(item: any) {
    const media = item.media;
    if (media.type === 'movie') {
      this.router.navigate(['/main/dash/movie', media.id]);
    }
  }

  navigateToDiscoverShows(item: any) {
    const media = item.media;
    if (media.type === 'movie') {
      this.router.navigate(['/main/dash/movie', media.id]);
    }
  }
  

  navigateToNewestShows(item: any) {
    const media = item.media;
    if (media.type === 'movie') {
      this.router.navigate(['/main/dash/movie', media.id]);
    }
  }

  navigateToNewestAddShows(item: any) {
    const media = item.media;
    if (media.type === 'movie') {
      this.router.navigate(['/main/dash/movie', media.id]);
    }
  }

  navigateToNewestMovies(item: any) {
    const media = item.media;
    if (media.type === 'movie') {
      this.router.navigate(['/main/dash/movie', media.id]);
    }
  }

  navigateToNewestAddMovies(item: any) {
    const media = item.media;
    if (media.type === 'movie') {
      this.router.navigate(['/main/dash/movie', media.id]);
    }
  }

  navigateToWatchList(item: any) {
    const media = item.media;
    if (media.type === 'movie') {
      this.router.navigate(['/main/dash/show', media.id]);
    }
  }

  
  navigateToContinueWatchingItem(item: any) {
    this.router.navigate(['/player', { videoId: item.id }]);
  }
}