import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, FormsModule],
})
export class SetupPage implements OnInit {
  serverUrl: string = localStorage.getItem('serverUrl') || 'https://cinema.serviciosqbit.net/';
  username: string = '';
  password: string = '';

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.validateServerUrl();
  }

  validateServerUrl() {
    this.apiService.determineServerUrl().subscribe({
      next: (url) => {
        this.serverUrl = url;
        localStorage.setItem('serverUrl', this.serverUrl);
        console.log('URL seleccionada:', this.serverUrl);
      },
      error: (error) => {
        console.error('Error al determinar la URL:', error);
        this.serverUrl = 'https://cinema.serviciosqbit.net/';
        localStorage.setItem('serverUrl', this.serverUrl);
      }
    });
  }

  login() {
    if (this.serverUrl && this.username && this.password) {
      localStorage.setItem('serverUrl', this.serverUrl);
      this.apiService.login(this.username, this.password).subscribe({
        next: (response) => {
          console.log('Login completo:', response);
          if (response.username === '__grails.anonymous.user__') {
            alert('Credenciales inválidas o usuario anónimo');
            return;
          }
          localStorage.setItem('authToken', response.token || '');
          this.afterLogin();
        },
        error: (error) => {
          console.error('Error en login:', error);
          alert('Credenciales inválidas o error en el servidor');
        }
      });
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }

  afterLogin() {
    this.apiService.getProfiles().subscribe({
      next: (profiles) => {
        if (profiles.length > 0) {
          console.log('Perfiles cargados tras login:', profiles);
          this.router.navigate(['/main/sub-profiles']);
        } else {
          alert('No se encontraron perfiles');
        }
      },
      error: (error) => {
        console.error('Error al cargar perfiles:', error);
        alert('Error al cargar perfiles tras login');
      }
    });
  }
}