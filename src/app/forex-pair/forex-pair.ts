import { Component, computed, input, signal } from '@angular/core';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { ForexQuote } from '../forex.service';

export interface PivotRow {
  id?: string;
  label: string;
  price: number;
  diff: number;
  labelClass?: string;
}

@Component({
  selector: 'app-forex-pair',
  imports: [DecimalPipe, NgClass, NgIf],
  templateUrl: './forex-pair.html',
})
export class ForexPair {
  readonly quote = input.required<ForexQuote>();

  readonly showGrouped = signal(true);

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
      id: `${row.label}-${row.price}-${index}`,
    }));

    return rows.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff));
  });

  readonly pivotRows = computed<PivotRow[]>(() => {
    const q = this.quote();
    const p = q.pivots;
    return [
      { label: 'R3', price: p.r3, diff: (q.bid - p.r3) / q.pipSize },
      { label: 'R2', price: p.r2, diff: (q.bid - p.r2) / q.pipSize },
      { label: 'R1', price: p.r1, diff: (q.bid - p.r1) / q.pipSize },
      { label: 'Pivot', price: p.pivot, diff: (q.bid - p.pivot) / q.pipSize },
      { label: 'S1', price: p.s1, diff: (q.bid - p.s1) / q.pipSize },
      { label: 'S2', price: p.s2, diff: (q.bid - p.s2) / q.pipSize },
      { label: 'S3', price: p.s3, diff: (q.bid - p.s3) / q.pipSize },
    ];
  });

  readonly valueAreaRows = computed<PivotRow[]>(() => {
    const q = this.quote();
    const va = q.valueArea;
    return [
      { label: 'VAH', price: va.vah, diff: (q.bid - va.vah) / q.pipSize },
      { label: 'POC', price: va.poc, diff: (q.bid - va.poc) / q.pipSize },
      { label: 'VAL', price: va.val, diff: (q.bid - va.val) / q.pipSize },
    ];
  });

  readonly ohlcRows = computed<PivotRow[]>(() => {
    const q = this.quote();
    const o = q.prevDayOhlc;
    const closeClass = o.close >= o.open ? 'text-success' : 'text-danger';
    return [
      { label: 'Open', price: o.open, diff: (q.bid - o.open) / q.pipSize, labelClass: 'text-secondary' },
      { label: 'High', price: o.high, diff: (q.bid - o.high) / q.pipSize, labelClass: 'text-success' },
      { label: 'Low', price: o.low, diff: (q.bid - o.low) / q.pipSize, labelClass: 'text-danger' },
      { label: 'Close', price: o.close, diff: (q.bid - o.close) / q.pipSize, labelClass: closeClass },
    ];
  });

  readonly weeklyOhlcRows = computed<PivotRow[]>(() => {
    const q = this.quote();
    const o = q.weeklyOhlc;
    const closeClass = o.close >= o.open ? 'text-success' : 'text-danger';
    return [
      { label: 'Open', price: o.open, diff: (q.bid - o.open) / q.pipSize, labelClass: 'text-secondary' },
      { label: 'High', price: o.high, diff: (q.bid - o.high) / q.pipSize, labelClass: 'text-success' },
      { label: 'Low', price: o.low, diff: (q.bid - o.low) / q.pipSize, labelClass: 'text-danger' },
      { label: 'Close', price: o.close, diff: (q.bid - o.close) / q.pipSize, labelClass: closeClass },
    ];
  });

  readonly vwapRows = computed<PivotRow[]>(() => {
    const q = this.quote();
    const { vwap, stdDev } = q.vwap;
    return [
      { label: 'SD +3', price: vwap + 3 * stdDev, diff: (q.bid - (vwap + 3 * stdDev)) / q.pipSize },
      { label: 'SD +2', price: vwap + 2 * stdDev, diff: (q.bid - (vwap + 2 * stdDev)) / q.pipSize },
      { label: 'SD +1', price: vwap + stdDev, diff: (q.bid - (vwap + stdDev)) / q.pipSize },
      { label: 'VWAP', price: vwap, diff: (q.bid - vwap) / q.pipSize },
      { label: 'SD -1', price: vwap - stdDev, diff: (q.bid - (vwap - stdDev)) / q.pipSize },
      { label: 'SD -2', price: vwap - 2 * stdDev, diff: (q.bid - (vwap - 2 * stdDev)) / q.pipSize },
      { label: 'SD -3', price: vwap - 3 * stdDev, diff: (q.bid - (vwap - 3 * stdDev)) / q.pipSize },
    ];
  });
}
