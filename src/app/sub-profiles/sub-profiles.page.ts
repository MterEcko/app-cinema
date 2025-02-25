import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-sub-profiles',
  templateUrl: './sub-profiles.page.html',
  styleUrls: ['./sub-profiles.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, CommonModule]
})
export class SubProfilesPage implements OnInit {
  profiles: any[] = [];

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.loadProfiles();
  }

  loadProfiles() {
    this.apiService.getProfiles().subscribe(
      (profiles) => {
        this.profiles = profiles;
        console.log('Perfiles cargados:', this.profiles);
      },
      (error) => {
        console.error('Error al cargar perfiles:', error);
        this.profiles = [{ profileName: 'Usuario 1' }, { profileName: 'Usuario 2' }];
      }
    );
  }

  selectProfile(profile: any) {
    console.log('Perfil seleccionado:', profile);
    localStorage.setItem('selectedProfile', JSON.stringify(profile)); // Guardamos el perfil seleccionado
    this.router.navigate(['/main/dash']); // Redirigimos al dashboard
  }
}