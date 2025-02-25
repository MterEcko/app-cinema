import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Router } from '@angular/router';
import { IonContent, IonSearchbar, IonGrid, IonRow, IonCol, IonCard } from '@ionic/angular/standalone'; // Importa los componentes Ionic necesarios

@Component({
  selector: 'app-movie',
  templateUrl: './movie.page.html',
  styleUrls: ['./movie.page.scss'],
  standalone: true, // Asegúrate de que sea un componente standalone
  imports: [IonContent, IonSearchbar, IonGrid, IonRow, IonCol, IonCard] // Importa los componentes Ionic necesarios
})
export class MoviePage implements OnInit {
  movies: any[] = [];
  filteredMovies: any[] = [];
  searchQuery: string = '';
  featuredBackdropUrl: string = 'assets/img/default-backdrop.jpg';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.apiService.getMovies().subscribe((data: any) => {
      this.movies = data;
      this.filteredMovies = [...this.movies];
      if (this.movies.length > 0) {
        this.featuredBackdropUrl = this.movies[0].backdrop_path || this.movies[0].poster_path || 'assets/img/default-backdrop.jpg';
      }
    }, (error) => {
      console.error('Error al cargar películas:', error);
      this.movies = [];
      this.filteredMovies = [];
      this.featuredBackdropUrl = 'assets/img/default-backdrop.jpg';
    });
  }

  searchMovies() {
    if (!this.searchQuery.trim()) {
      this.filteredMovies = [...this.movies];
    } else {
      this.filteredMovies = this.movies.filter(movie =>
        movie.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  viewMovieDetails(movie: any) {
    console.log('Navegando a película con ID:', movie.id); // Depuración
    this.router.navigate(['/main/movie', movie.id]).then(success => {
      if (!success) {
        console.error('Fallo al navegar a /main/movie/', movie.id);
      }
    }).catch(error => {
      console.error('Error al navegar:', error);
    });
  }
}