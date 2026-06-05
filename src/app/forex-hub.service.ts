import { Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Subject } from 'rxjs';

export interface PriceResponse {
    type: string;
    time: Date;
    bids: any[] | null;
    asks: any[] | null;
    closeoutBid: string;
    closeoutAsk: string;
    status: string;
    tradeable: boolean;
    instrument: string;
}

@Injectable({ providedIn: 'root' })
export class ForexHubService {
    private connection: HubConnection | null = null;
    private priceSubject = new Subject<PriceResponse>();
    public price$ = this.priceSubject.asObservable();
    public latest = signal<PriceResponse | null>(null);

    private hubUrl: string = 'https://localhost:7265/liveData';

    /**
     * Connect to a SignalR hub and listen for streaming price updates.
     * @param hubUrl full url to the hub endpoint (e.g. "https://api.example.com/priceHub")
     * @param eventName name of the client method the server invokes (default: "PriceUpdate")
     */
    async connect(eventName = 'liveData') {
        if (this.connection) {
            return;
        }

        this.connection = new HubConnectionBuilder()
            .withUrl(this.hubUrl)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        this.connection.on(eventName, (payload: any) => {
            const price = this.normalizePrice(payload);
            this.latest.set(price);
            this.priceSubject.next(price);
        });

        await this.connection.start();
    }

    async disconnect() {
        if (!this.connection) return;
        try {
            await this.connection.stop();
        } finally {
            this.connection = null;
        }
    }

    isConnected(): boolean {
        return !!this.connection && this.connection.state === 'Connected';
    }

    private normalizePrice(payload: any): PriceResponse {
        const timeVal = payload?.time ? new Date(payload.time) : new Date();
        const payloadObject: any = JSON.parse(payload)
        return {
            type: payloadObject?.type ?? '',
            time: timeVal,
            bids: payloadObject?.bids ?? null,
            asks: payloadObject ?.asks ?? null,
            closeoutBid: payloadObject?.closeoutBid ?? '',
            closeoutAsk: payloadObject?.closeoutAsk ?? '',
            status: payloadObject?.status ?? '',
            tradeable: !!payloadObject?.tradeable,
            instrument: payloadObject?.instrument.replace('_', '/') ?? '',
        };
    }
}
