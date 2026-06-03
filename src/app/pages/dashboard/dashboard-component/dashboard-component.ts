import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SymbolCard } from '../../../model/forexCard';
import { LiveDataService } from '../../../service/live-data-service';
import { LiveData } from '../../../model/liveData';
import { IndicatorService } from '../../../service/indicator-service';
import { TechnicalService } from '../../../service/technical-service';
import { OandaService } from '../../../service/oanda-service';

@Component({
  selector: 'app-dashboard-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent implements OnInit {
  indicators: any[] = [];
  constructor(
    private liveDataService: LiveDataService, 
    private indicatorService: IndicatorService, 
    private technicalService: TechnicalService,
    private changeDetectorRef: ChangeDetectorRef) {}

  forexCards: SymbolCard[] = [];
  forexCards2: SymbolCard[] = [
    {
      symbol: '/NQ:XCME',
      bid: 0,
      ask: 0,
      change: 0.42,
      indicators: [
        { name: 'Pivot', value: 29950.25 },
        { name: 'R1', value: 1.0865 },
        { name: 'S1', value: 1.0812 }
      ]
    },
    {
      symbol: '/YM:XCBT',
      bid: 0,
      ask: 0,
      change: -0.18,
      indicators: [
        { name: 'EMA 50', value: 1.2745 },
        { name: 'VWAP', value: 1.2758 },
        { name: 'Resistance', value: 1.2810 },
        { name: 'Support', value: 1.2715 }
      ]
    },
    {
      symbol: '/ES:XCME',
      bid: 0,
      ask: 0,
      change: 0.91,
      indicators: [
        { name: 'Pivot', value: 156.200 },
        { name: 'R2', value: 156.880 }
      ]
    },
    {
      symbol: '/RTY:XCME',
      bid: 0,
      ask: 0,
      change: 0.11,
      indicators: [
        { name: 'EMA 200', value: 0.6621 },
        { name: 'Daily High', value: 0.6670 },
        { name: 'Daily Low', value: 0.6608 },
        { name: 'Pivot', value: 0.6635 },
        { name: 'R1', value: 0.6661 }
      ]
    },
    {
      symbol: '/CL:XNYM',
      bid: 0,
      ask: 0,
      change: 0.11,
      indicators: [
        { name: 'EMA 200', value: 0.6621 },
        { name: 'Daily High', value: 0.6670 },
        { name: 'Daily Low', value: 0.6608 },
        { name: 'Pivot', value: 0.6635 },
        { name: 'R1', value: 0.6661 }
      ]
    },
    {
      symbol: '/GC:XCEC',
      bid: 0,
      ask: 0,
      change: 0.11,
      indicators: [
        { name: 'EMA 200', value: 0.6621 },
        { name: 'Daily High', value: 0.6670 },
        { name: 'Daily Low', value: 0.6608 },
        { name: 'Pivot', value: 0.6635 },
        { name: 'R1', value: 0.6661 }
      ]
    }
  ];
  ngOnInit(): void {
    // this.indicators = this.indicatorService.getIndicators();

    // this.technicalService.start();
    // this.technicalService.technical$.subscribe((data: string) => {
    //   console.log('Technical data received:', data);
    // });

    this.technicalService.getPivots();
    
    this.liveDataService.start();
    this.liveDataService.prices$.subscribe((data: LiveData) => {
      var forexCard = this.forexCards.find(card => card.symbol === data.symbol);
      
      if (forexCard) {
        if (data.quoteType === 'Bid') {
          forexCard.bid = data.value;
        } else if (data.quoteType === 'Ask') {
          forexCard.ask = data.value;
        }
      }
      else {
        if(data.symbol.length > 0) {

          const i: any[] = [];
          this.indicators.map(indicator => {
            indicator.indicatorLevels.map((level: any) => {
              i.push({ name: `${indicator.name} ${level.name}`, value: level.value });
            });
          });
          
          this.forexCards.push({
            symbol: data.symbol,
            bid: data.quoteType === 'Bid' ? data.value : 0,
            ask: data.quoteType === 'Ask' ? data.value : 0,
            change: 0,
            indicators: i
          });
        }
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  getDifference(indicatorValue: number, bid: number): number {

    return indicatorValue - bid;
  }
}
