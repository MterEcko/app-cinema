import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './core/api.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterOutlet]
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      if (event.url === '/setup' && localStorage.getItem('serverUrl')) {
        this.apiService.getProfiles().subscribe(
          (profiles) => {
            if (profiles.length > 0) {
              this.router.navigate(['/sub-profiles']);
            }
          },
          (error) => {
            console.log('No redirigiendo:', error);
          }
        );
      }
    });
  }
}