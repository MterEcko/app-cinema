import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MoviePage } from './movie.page';
import { Router } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoviePage // Importa MoviePage como componente standalone
  ]
})
export class MoviePageModule {

  constructor(private router: Router) {} // Inyecta el Router

  viewMovieDetails(movieId: number) {
    this.router.navigate(['/main/dash/movie', movieId]);
  }
  

}

