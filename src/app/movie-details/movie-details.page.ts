import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../core/api.service';
import { IonContent, IonCard, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: true,
  imports: [IonContent, IonCard, IonCardTitle, IonCardContent, IonButton]
})
export class MovieDetailsPage implements OnInit {
  movie: any = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId) {
      this.loadMovieDetails(movieId);
    }
  }

  loadMovieDetails(id: string) {
    this.apiService.getMovie(id).subscribe({
      next: (data: any) => {
        this.movie = data;
      },
      error: (error) => {
        console.error('Error al cargar detalles de la película:', error);
        this.movie = null;
      }
    });
  }

  addToWatchlist() {
    if (this.movie) {
      console.log('Añadiendo a lista de seguimiento:', this.movie.title);
      // Implementa la lógica con ApiService, similar a addToWatchlist en el controlador original
    }
  }

  removeFromWatchlist() {
    if (this.movie) {
      console.log('Eliminando de lista de seguimiento:', this.movie.title);
      // Implementa la lógica con ApiService, similar a removeFromWatchlist
    }
  }

  markAsUnviewed() {
    if (this.movie) {
      console.log('Marcando como no vista:', this.movie.title);
      // Implementa la lógica con ApiService, similar a markAsUnviewed
    }
  }
}