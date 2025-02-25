import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';

// Declaramos jQuery, toastr y alertify como "any"
declare const $: any;
declare const toastr: any;
declare const alertify: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage implements OnInit {
  constructor() {}

  ngOnInit() {
    // Inicializamos Owl Carousel
    $('.owl-carousel').owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      items: 3
    });
  }

  showNotification() {
    // Mostramos una notificación con toastr
    toastr.success('¡Hola! Esto es una notificación.', 'Éxito');
  }

  showDialog() {
    // Mostramos un diálogo con alertify
    alertify.alert('Mensaje', '¡Hola! Esto es un diálogo de Alertify.', () => {
      console.log('Diálogo cerrado');
    });
  }
}