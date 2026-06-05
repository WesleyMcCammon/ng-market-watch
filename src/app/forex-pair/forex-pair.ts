import { Component, computed, input, OnInit, signal } from '@angular/core';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { ForexQuote } from '../forex.service';
import { ForexHubService } from '../forex-hub.service';

export interface PivotRow {
  id?: string;
  label: string;
  price: number;
  diff: number;
  labelClass?: string;
  group?: string;
}

@Component({
  selector: 'app-forex-pair',
  imports: [DecimalPipe, NgClass, NgIf],
  templateUrl: './forex-pair.html',
})
export class ForexPair implements OnInit {
  lastBid: number = 0;
  private lastAsk: number = 0;

  readonly quote = input.required<ForexQuote>();

  readonly showGrouped = signal(true);

  readonly hubBid = computed(() => {
    const latest = this.forexHubService.latest();  
    if (latest && 
      latest.instrument === this.quote().pair && 
      this.quote().bid !== parseFloat(latest.closeoutBid)) {
        this.lastBid = latest.closeoutBid ? parseFloat(latest.closeoutBid) : this.quote().bid;
        return this.lastBid;
    }
    
    return this.quote().bid === 0 ? this.lastBid : this.quote().bid;
  });

  readonly hubAsk = computed(() => {
    const latest = this.forexHubService.latest();
    if (latest && latest.instrument === this.quote().pair  && this.quote().ask !== parseFloat(latest.closeoutAsk)) {
      this.lastAsk = latest.closeoutAsk ? parseFloat(latest.closeoutAsk) : this.quote().ask;
      return this.lastAsk;
    }
    return this.quote().ask === 0 ? this.lastAsk : this.quote().ask;
  });

  readonly priceFormat = computed(() => (this.quote().pair.includes('JPY') ? '1.3-3' : '1.5-5'));

  readonly allRows = computed<PivotRow[]>(() => {    
    const rows = [
      ...this.pivotRows(),
      ...this.valueAreaRows(),
      ...this.vwapRows(),
      ...this.ohlcRows(),
      ...this.weeklyOhlcRows(),
    ].map((row, index) => ({
      ...row,
      id: `${row.group ?? 'group'}-${row.label}-${row.price}-${index}`,
    }));

    return rows.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff));
  });

  readonly pivotRows = computed<PivotRow[]>(() => {
    const q = this.quote();
    const p = q.pivots;
    const bid = this.hubBid();
    return [
      { label: 'R3', price: p.r3, diff: (bid - p.r3) / q.pipSize, group: 'Pivot Levels' },
      { label: 'R2', price: p.r2, diff: (bid - p.r2) / q.pipSize, group: 'Pivot Levels' },
      { label: 'R1', price: p.r1, diff: (bid - p.r1) / q.pipSize, group: 'Pivot Levels' },
      { label: 'Pivot', price: p.pivot, diff: (bid - p.pivot) / q.pipSize, group: 'Pivot Levels' },
      { label: 'S1', price: p.s1, diff: (bid - p.s1) / q.pipSize, group: 'Pivot Levels' },
      { label: 'S2', price: p.s2, diff: (bid - p.s2) / q.pipSize, group: 'Pivot Levels' },
      { label: 'S3', price: p.s3, diff: (bid - p.s3) / q.pipSize, group: 'Pivot Levels' },
    ];
  });

  readonly valueAreaRows = computed<PivotRow[]>(() => {
    const q = this.quote();
    const va = q.valueArea;
    const bid = this.hubBid();
    return [
      { label: 'VAH', price: va.vah, diff: (bid - va.vah) / q.pipSize, group: 'Value Area' },
      { label: 'POC', price: va.poc, diff: (bid - va.poc) / q.pipSize, group: 'Value Area' },
      { label: 'VAL', price: va.val, diff: (bid - va.val) / q.pipSize, group: 'Value Area' },
    ];
  });

  readonly ohlcRows = computed<PivotRow[]>(() => {
    const q = this.quote();
    const o = q.prevDayOhlc;
    const bid = this.hubBid();
    const closeClass = o.close >= o.open ? 'text-success' : 'text-danger';
    return [
      { label: 'Open', price: o.open, diff: (bid - o.open) / q.pipSize, labelClass: 'text-secondary', group: 'Prev Day OHLC' },
      { label: 'High', price: o.high, diff: (bid - o.high) / q.pipSize, labelClass: 'text-success', group: 'Prev Day OHLC' },
      { label: 'Low', price: o.low, diff: (bid - o.low) / q.pipSize, labelClass: 'text-danger', group: 'Prev Day OHLC' },
      { label: 'Close', price: o.close, diff: (bid - o.close) / q.pipSize, labelClass: closeClass, group: 'Prev Day OHLC' },
    ];
  });

  readonly weeklyOhlcRows = computed<PivotRow[]>(() => {
    const q = this.quote();
    const o = q.weeklyOhlc;
    const bid = this.hubBid();
    const closeClass = o.close >= o.open ? 'text-success' : 'text-danger';
    return [
      { label: 'Open', price: o.open, diff: (bid - o.open) / q.pipSize, labelClass: 'text-secondary', group: 'Weekly OHLC' },
      { label: 'High', price: o.high, diff: (bid - o.high) / q.pipSize, labelClass: 'text-success', group: 'Weekly OHLC' },
      { label: 'Low', price: o.low, diff: (bid - o.low) / q.pipSize, labelClass: 'text-danger', group: 'Weekly OHLC' },
      { label: 'Close', price: o.close, diff: (bid - o.close) / q.pipSize, labelClass: closeClass, group: 'Weekly OHLC' },
    ];
  });

  readonly vwapRows = computed<PivotRow[]>(() => {
    const q = this.quote();
    const { vwap, stdDev } = q.vwap;
    const bid = this.hubBid();
    return [
      { label: 'SD +3', price: vwap + 3 * stdDev, diff: (bid - (vwap + 3 * stdDev)) / q.pipSize, group: 'VWAP Bands' },
      { label: 'SD +2', price: vwap + 2 * stdDev, diff: (bid - (vwap + 2 * stdDev)) / q.pipSize, group: 'VWAP Bands' },
      { label: 'SD +1', price: vwap + stdDev, diff: (bid - (vwap + stdDev)) / q.pipSize, group: 'VWAP Bands' },
      { label: 'VWAP', price: vwap, diff: (bid - vwap) / q.pipSize, group: 'VWAP Bands' },
      { label: 'SD -1', price: vwap - stdDev, diff: (bid - (vwap - stdDev)) / q.pipSize, group: 'VWAP Bands' },
      { label: 'SD -2', price: vwap - 2 * stdDev, diff: (bid - (vwap - 2 * stdDev)) / q.pipSize, group: 'VWAP Bands' },
      { label: 'SD -3', price: vwap - 3 * stdDev, diff: (bid - (vwap - 3 * stdDev)) / q.pipSize, group: 'VWAP Bands' },
    ];
  });

  constructor(private forexHubService: ForexHubService) {}

  ngOnInit() {
  }
}
