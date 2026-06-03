import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TechnicalService {
  private hubConnection!: signalR.HubConnection;

  constructor(private http: HttpClient) {}

  public technical$ = new BehaviorSubject<string>('');
  
    start() {
  
      this.hubConnection =
        new signalR.HubConnectionBuilder()
          .withUrl('https://localhost:7290/technical')
          .withAutomaticReconnect()
          .build();
  
      this.hubConnection.start()
        .then(() => console.log('Connected'));
  
      this.hubConnection.on(
        'technical',
        (data) => {
          this.technical$.next(data);
        });
    }

    public getPivots(): void {
      this.http.get('https://localhost:7265/pivots').subscribe((data: any) => {
        debugger;
      });
    }
  }
  
