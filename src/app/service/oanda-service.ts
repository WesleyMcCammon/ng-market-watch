import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OandaService {
  url: string = '';
  private http = inject(HttpClient);
  private apiUrl: string = 'https://api-fxpractice.oanda.com/v3';

  public getHistoricalData(symbol: string, granularity: string, count: number = 500): Observable<any> {
    const apiToken: string = "90deb5a929e382e757addafec2e37b6b-5bc5012291a7d6cf5921b2cde2481948";

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(
      `${this.apiUrl}/instruments/${symbol}/candles?count={count}&granularity={granularity}&price=M`,
      {
        headers: headers,
        params: {
          granularity,
          count
        }
      }
    );
  }
}

/*
public async Task<List<Candle>> GetCandlesAsync(
    string instrument = "EUR_USD",
    string granularity = "H1",
    int count = 500)
{
    var url =
        $"v3/instruments/{instrument}/candles" +
        $"?count={count}" +
        $"&granularity={granularity}" +
        $"&price=M";

    var response = await _httpClient.GetAsync(url);
    response.EnsureSuccessStatusCode();

    var json = await response.Content.ReadAsStringAsync();

    var result = JsonSerializer.Deserialize<OandaCandlesResponse>(
        json,
        new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

    return result?.Candles ?? new List<Candle>();
}
*/