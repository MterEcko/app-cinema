import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonThumbnail, IonImg, IonButton, IonIcon, IonSearchbar, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ApiService } from '../core/api.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { SwiperModule } from 'swiper/angular';
import SwiperCore, { Navigation } from 'swiper';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonThumbnail, IonImg, CommonModule, RouterModule, IonButton, IonIcon, SwiperModule, IonSearchbar, FormsModule, IonGrid, IonRow, IonCol]
})
export class SearchResultsPage implements OnInit {
  searchQuery: string = '';
  searchResults: any[] = [];
  public screenWidth: number = window.innerWidth; // Para responsividad
  allMovies: any[] = []; // Para almacenar todas las películas
  allShows: any[] = []; // Para almacenar todas las series
  selectedItem: any = null; // Propiedad para el item seleccionado

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }

  getSlidesPerView(): number {
    const baseWidth = 150; // Ancho base más pequeño para los resultados (~150x90px)
    if (this.screenWidth < 365) {
      return 1; // 1 elemento en pantallas pequeñas
    }
    const calculatedSlides = Math.floor(this.screenWidth / baseWidth); // Calcula cuántos caben
    return Math.max(2, calculatedSlides); // Mínimo 2, aumenta con el ancho
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      console.log('Query recibido en search-results desde route.params:', this.searchQuery);
      this.loadDefaultContent();
      this.updateUrl(); // Actualiza la URL con el query inicial
    });
  }

  loadDefaultContent() {
    // Cargar todas las películas y series por defecto si no hay query
    if (!this.searchQuery.trim()) {
      forkJoin({
        movies: this.apiService.getMovies(),
        shows: this.apiService.getShows()
      }).subscribe({
        next: ({ movies, shows }) => {
          this.allMovies = movies;
          this.allShows = shows;
          this.searchResults = [...movies, ...shows]; // Mostrar todas las películas y series inicialmente
          console.log('Películas y series cargadas por defecto:', this.searchResults);
        },
        error: (error) => {
          console.error('Error al cargar películas y series por defecto:', error);
          this.searchResults = [];
        }
      });
    } else {
      this.searchItems();
    }
  }

  searchItems() {
    console.log('Ejecutando searchItems con query:', this.searchQuery);

    if (!this.searchQuery.trim()) {
      this.searchResults = [...this.allMovies, ...this.allShows]; // Mostrar todas las películas y series si el query está vacío
      console.log('Query vacío, mostrando todas las películas y series:', this.searchResults);
      this.updateUrl(); // Actualiza la URL cuando el query está vacío
      return;
    }

    this.apiService.search(this.searchQuery).subscribe({
      next: (results) => {
        console.log('Respuesta cruda del backend antes de filtrar:', results);
        const uniqueItems = results.filter((item, index, self) =>
          index === self.findIndex((t) => t.id === item.id && (t.mediaType || t.type) === (t.mediaType || t.type))
        );

        this.searchResults = uniqueItems;
        console.log('Resultados finales desde el backend:', this.searchResults);
        this.updateUrl(); // Actualiza la URL con el nuevo query
      },
      error: (error) => {
        console.error('Error al buscar resultados:', error);
        if (error.status === 404) {
          console.error('Endpoint no encontrado. Verifica la URL del backend (dash/search.json no existe, usa /api/v1/dash/list*).');
        } else if (error.status === 0) {
          console.error('No se pudo conectar al backend. Verifica la URL o el servidor.');
        } else {
          console.error('Error específico del backend:', error.message);
        }
        this.searchResults = []; // Mostrar vacío en caso de error
      }
    });
  }

  onSearch() {
    console.log('onSearch triggered with query:', this.searchQuery);
    this.searchItems();
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [...this.allMovies, ...this.allShows]; // Mostrar todas las películas y series al limpiar
    console.log('Búsqueda limpiada, mostrando todas las películas y series:', this.searchResults);
    this.updateUrl(); // Actualiza la URL al limpiar
  }

  updateUrl() {
    const queryParams: Params = { q: this.searchQuery || '' };
    this.router.navigate(['/main/search-results'], { 
      queryParams, 
      replaceUrl: true, // Evita duplicados en el historial de navegación
      skipLocationChange: false // Asegura que la URL se actualice en el navegador
    })
      .then(success => {
        if (success) {
          console.log('URL actualizada a /main/search-results?q=', this.searchQuery || 'vacío');
        } else {
          console.error('Fallo al actualizar la URL');
        }
      })
      .catch(error => {
        console.error('Error al actualizar la URL:', error);
      });
  }

  getPosterPath(item: any): string {
    if (this.selectedItem === item || window.innerWidth > 768) {
      // Verifica si es una película o una serie usando mediaType o type
      if (item.mediaType === 'movie' || item.type === 'movie') {
        return `https://image.tmdb.org/t/p/w1280/${item.backdrop_path || item.poster_path || 'assets/img/default-poster.jpg'}`;
      } else {
        return 'https://image.tmdb.org/t/p/w1280/'+item.poster_path || item.poster_path || item.poster_path || 'assets/img/default-poster.jpg';
      }
    }
    return item.poster_path || 'assets/img/default-poster.jpg';
  }

  getTitle(item: any): string {
    return item.title || item.name || item.video?.title || item.video?.name || item.media?.title || item.media?.name || '';
  }

  getOverview(item: any): string {
    return item.overview || item.description || item.video?.overview || item.media?.overview || '';
  }

  getVideoId(item: any): number {
    return item.id || item.video?.id || item.media?.videoToPlayId || 0;
  }

  cancelSearch() {
    this.router.navigate(['/main/dash']);
  }

  // Método para seleccionar un item al hacer clic
  selectItem(item: any) {
    this.selectedItem = this.selectedItem === item ? null : item; // Deselecciona si ya está seleccionado
  }
}