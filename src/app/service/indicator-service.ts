import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndicatorService {

  public getIndicators() {
    const indicators = [
      {
        name: 'Pivot Points',
        indicatorLevels: [
          /*
          { name: 'R3', value: 1.2345 },
          { name: 'R2', value: 1.2345 },
          { name: 'R1', value: 1.2345 },
          { name: 'Pivot', value: 1.2345 },

          { name: 'S1', value: 1.2345 },*/
          { name: 'S2', value: 1.2345 },
          { name: 'S3', value: 1.2345 }]
      },
      {
        name: 'VWAP',
        indicatorLevels: [
          { name: 'VWAP', value: 1.2345 } /*,
          { name: 'Standard Deviation +1', value: 1.2345 },
          { name: 'Standard Deviation +2', value: 1.2345 },
          { name: 'Standard Deviation +3', value: 1.2345 },
          { name: 'Standard Deviation -1', value: 1.2345 },
          { name: 'Standard Deviation -2', value: 1.2345 },
          { name: 'Standard Deviation -3', value: 1.2345 }*/
        ]
      },
      {
        name: 'PrevDay OHLC', indicatorLevels: [
       /*   { name: 'High', value: 1.2345 },
          { name: 'Open', value: 1.2345 },*/
          { name: 'Low', value: 1.2345 },
          { name: 'Close', value: 1.2345 }
        ]
      },
      { name: 'Value Area', indicatorLevels: [
        //{ name: 'Value Area High', value: 1.2345 }, 
        //{ name: 'Value Area Low', value: 1.2345 },
        { name: 'Point of Control', value: 1.2345 }
      ] }
    ];

    return indicators;
  }
}
