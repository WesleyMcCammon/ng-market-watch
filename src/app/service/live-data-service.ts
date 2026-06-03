import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { LiveData } from '../model/liveData';

@Injectable({
  providedIn: 'root',
})
export class LiveDataService {
  private hubConnection!: signalR.HubConnection;
  private includeForex: boolean = true;
  private includeFutures: boolean = false;

  public prices$ = new BehaviorSubject<LiveData>({ date: '', symbol: '', displaySymbol: '', quoteType: '', value: 0 });

  start() {

    this.hubConnection =
      new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:7265/liveData')
        .withAutomaticReconnect()
        .build();

    this.hubConnection.start()
      .then(() => console.log('Connected'));

    this.hubConnection.on(
      'liveData',
      (data) => {
        const liveData: LiveData = JSON.parse(data);
        const sendPrice: boolean = (this.includeForex && !liveData.symbol.startsWith('/')) || (this.includeFutures && liveData.symbol.startsWith('/')); 
        if (sendPrice) {
          this.prices$.next(liveData);
        }
      });
  }
}
