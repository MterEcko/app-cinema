import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private defaultUrl = 'http://localhost:8080/api/v1/'; // Ajusta la URL base según tu backend
  private localUrl = 'http://172.19.114.40:8080/api/v1/'; // Ajusta si usas una IP local
  private ispIp = '38.22.182.197';

  private get baseUrl(): string {
    return localStorage.getItem('serverUrl') || this.defaultUrl;
  }

  constructor(private http: HttpClient) {}

  getUserIp(): Observable<string> {
    return this.http.get('https://api.ipify.org?format=json').pipe(
      map((response: any) => response.ip)
    );
  }

  determineServerUrl(): Observable<string> {
    return this.getUserIp().pipe(
      map(ip => {
        console.log('IP del usuario:', ip);
        return ip === this.ispIp ? this.localUrl : this.defaultUrl;
      })
    );
  }

  login(username: string, password: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);
    body.set('remember-me', 'true');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest'
    });

    return this.http.post(`${this.baseUrl}login/authenticate`, body.toString(), { headers, withCredentials: true });
  }

  getProfiles(): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    });
    return this.http.get<any>(`${this.baseUrl}profile/getUserProfiles.json`, { headers, withCredentials: true }).pipe(
      tap((response) => console.log('Response crudo de perfiles:', response)),
      map((response) => response || [])
    );
  }

  getMovies(params: any = { sort: 'title', order: 'ASC', max: '30', offset: '0' }): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest',
      'profileid': '1' // Ajusta según el profileId
    });
    return this.http.get<any>(`${this.baseUrl}dash/listMovies.json`, { headers, withCredentials: true, params }).pipe(
      tap((response) => console.log('Response crudo de películas:', response)),
      map((response) => response.list || [])
    );
  }
  
  getShows(params: any = { sort: 'name', order: 'ASC', max: '30', offset: '0' }): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest',
      'profileid': '1' // Ajusta según el profileId
    });
    return this.http.get<any>(`${this.baseUrl}dash/listShows.json`, { headers, withCredentials: true, params }).pipe(
      tap((response) => console.log('Response crudo de series:', response)),
      map((response) => response.list || [])
    );
  }

  getGenres(): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    });
    return this.http.get<any>(`${this.baseUrl}dash/listGenres.json`, { headers, withCredentials: true }).pipe(
      tap((response) => console.log('Response crudo de géneros:', response)),
      map((response) => response || [])
    );
  }

  getNewReleases(): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    });
    return this.http.get<any>(`${this.baseUrl}dash/listNewReleases.json`, { headers, withCredentials: true }).pipe(
      tap((response) => console.log('Response crudo de nuevos estrenos:', response)),
      map((response) => response || [])
    );
  }

  getContinueWatching(profileId?: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest',
      'profileid': profileId ? profileId.toString() : '1' // Usa el profileId proporcionado o '1' por defecto
    });
    const params = {
      max: '20',
      offset: '0',
      order: 'DESC',
      sort: 'lastUpdated'
    };
    console.log('Enviando profileId al endpoint Continue Watching:', profileId);
    console.log('Enviando params al endpoint Continue Watching:', params);
    return this.http.get<any>(`${this.baseUrl}dash/listContinueWatching.json`, { headers, withCredentials: true, params }).pipe(
      tap({
        next: (response) => console.log('Response crudo de continue watching:', response),
        error: (error) => console.error('Error completo del servidor:', error)
      }),
      map((response) => response.list || [])
    );
  }

  getRecommendations(): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    });
    return this.http.get<any>(`${this.baseUrl}dash/listRecommendations.json`, { headers, withCredentials: true }).pipe(
      tap((response) => console.log('Response crudo de recomendaciones:', response)),
      map((response) => response || [])
    );
  }

  // Método para búsqueda en movies, shows y contenido genérico como en la app original
  search(query: string): Observable<any[]> {
    const normalizedQuery = this.normalizeQuery(query);
    const headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest',
      'profileid': '1'
    });
  
    // Params específicos para cada endpoint
    const movieParams = {
      max: '30',
      offset: '0',
      order: 'ASC',
      sort: 'title', // Ordenar por título para películas
      title: normalizedQuery // Solo title para películas
    };
    const showParams = {
      max: '30',
      name: normalizedQuery, // Solo name para series
      offset: '0',
      order: 'ASC',
      sort: 'name' // Ordenar por nombre para series
    };
    const genericParams = {
      max: '30',
      offset: '0',
      order: 'ASC',
      sort: 'title', // Ordenar por título para videos
      title: normalizedQuery // Solo title para videos genéricos
    };
  
    return forkJoin([
      this.http.get<any>(`${this.baseUrl}api/v1/dash/listMovies`, { headers, withCredentials: true, params: movieParams }).pipe(
        map(response => response.list || []),
        catchError(err => of([])) // Si falla, devuelve array vacío para no romper el forkJoin
      ),
      this.http.get<any>(`${this.baseUrl}dash/listShows.json`, { headers, withCredentials: true, params: showParams }).pipe(
        map(response => response.list || []),
        catchError(err => of([]))
      ),
      this.http.get<any>(`${this.baseUrl}api/v1/dash/listGenericVideos`, { headers, withCredentials: true, params: genericParams }).pipe(
        map(response => response.list || []),
        catchError(err => of([]))
      )
    ]).pipe(
      tap(responses => console.log('Respuestas crudas de búsqueda:', responses)),
      map(([movies, shows, genericVideos]) => {
        const allResults = [...movies, ...shows, ...genericVideos];
        const uniqueItems = allResults.filter((item, index, self) =>
          index === self.findIndex((t) => t.id === item.id && (t.mediaType || t.type) === (t.mediaType || t.type))
        );
        console.log('Resultados finales desde el backend (sin duplicados):', uniqueItems);
        return uniqueItems;
      }),
      catchError(error => {
        console.error('Error general en la búsqueda:', error);
        throw error;
      })
    );
  }

  // Nuevo método para obtener los detalles de una película específica por ID
  // Método original getMovie (si lo necesitas para otros casos)
  getMovie(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}`);
  }

  // Nuevo método para replicar apiService.dash.mediaDetail
  dashMediaDetail(id: string, mediaType: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/dash/mediaDetail`, {
      params: { id, mediaType }
    });
  }

  private normalizeQuery(query: string): string {
    if (!query) return '';
    return query
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos (tildes, acentos)
      .replace(/[^\w\s-¡¿.,]/g, '') // Elimina caracteres no alfanuméricos, manteniendo espacios, guiones, puntos, comas, ¡, ¿
      .replace(/\s+/g, ' ') // Normaliza espacios múltiples a un solo espacio
      .replace(/[,.-]+/g, ' ') // Convierte comas, puntos y guiones en espacios
      .toLowerCase()
      .trim();
  }
}