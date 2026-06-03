import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { ForexService, ForexQuote } from '../forex.service';

export interface LevelRow {
  pair: string;
  label: string;
  price: number;
  diff: number;
  group: string;
  pipSize: number;
  bid: number;
}

@Component({
  selector: 'app-market-levels',
  imports: [DecimalPipe, NgClass],
  templateUrl: './market-levels.html',
  styleUrl: './market-levels.css',
})
export class MarketLevels {
  private readonly forexService = inject(ForexService);

  protected readonly Math = Math;

  protected readonly filterPair = signal('');
  protected readonly sortBy = signal<'pair' | 'diff'>('pair');
  protected readonly thresholdPips = signal(50);

  protected readonly allLevels = computed<LevelRow[]>(() => {
    const quotes = this.forexService.quotes();
    const levels: LevelRow[] = [];

    for (const quote of quotes) {
      const createRows = (pairs: { label: string; price: number; group: string }[]) => {
        for (const pair of pairs) {
          levels.push({
            pair: quote.pair,
            label: pair.label,
            price: pair.price,
            diff: (quote.bid - pair.price) / quote.pipSize,
            group: pair.group,
            pipSize: quote.pipSize,
            bid: quote.bid,
          });
        }
      };

      const p = quote.pivots;
      createRows([
        { label: 'R3', price: p.r3, group: 'Pivot Levels' },
        { label: 'R2', price: p.r2, group: 'Pivot Levels' },
        { label: 'R1', price: p.r1, group: 'Pivot Levels' },
        { label: 'Pivot', price: p.pivot, group: 'Pivot Levels' },
        { label: 'S1', price: p.s1, group: 'Pivot Levels' },
        { label: 'S2', price: p.s2, group: 'Pivot Levels' },
        { label: 'S3', price: p.s3, group: 'Pivot Levels' },
      ]);

      const va = quote.valueArea;
      createRows([
        { label: 'VAH', price: va.vah, group: 'Value Area' },
        { label: 'POC', price: va.poc, group: 'Value Area' },
        { label: 'VAL', price: va.val, group: 'Value Area' },
      ]);

      const o = quote.prevDayOhlc;
      createRows([
        { label: 'Open', price: o.open, group: 'Prev Day OHLC' },
        { label: 'High', price: o.high, group: 'Prev Day OHLC' },
        { label: 'Low', price: o.low, group: 'Prev Day OHLC' },
        { label: 'Close', price: o.close, group: 'Prev Day OHLC' },
      ]);

      const w = quote.weeklyOhlc;
      createRows([
        { label: 'Open', price: w.open, group: 'Weekly OHLC' },
        { label: 'High', price: w.high, group: 'Weekly OHLC' },
        { label: 'Low', price: w.low, group: 'Weekly OHLC' },
        { label: 'Close', price: w.close, group: 'Weekly OHLC' },
      ]);

      const { vwap, stdDev } = quote.vwap;
      createRows([
        { label: 'SD +3', price: vwap + 3 * stdDev, group: 'VWAP Bands' },
        { label: 'SD +2', price: vwap + 2 * stdDev, group: 'VWAP Bands' },
        { label: 'SD +1', price: vwap + stdDev, group: 'VWAP Bands' },
        { label: 'VWAP', price: vwap, group: 'VWAP Bands' },
        { label: 'SD -1', price: vwap - stdDev, group: 'VWAP Bands' },
        { label: 'SD -2', price: vwap - 2 * stdDev, group: 'VWAP Bands' },
        { label: 'SD -3', price: vwap - 3 * stdDev, group: 'VWAP Bands' },
      ]);
    }

    return levels;
  });

  protected readonly filteredAndSortedLevels = computed<LevelRow[]>(() => {
    const filterVal = this.filterPair().trim().toUpperCase();
    const sortMode = this.sortBy();

    let filtered = filterVal
      ? this.allLevels().filter((level) => level.pair.includes(filterVal))
      : this.allLevels();

    if (sortMode === 'pair') {
      filtered.sort((a, b) => a.pair.localeCompare(b.pair) || a.label.localeCompare(b.label));
    } else {
      filtered.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff));
    }

    return filtered;
  });

  protected readonly nearLevels = computed<LevelRow[]>(() => {
    const threshold = this.thresholdPips();
    return this.allLevels()
      .filter((level) => Math.abs(level.diff) < threshold)
      .sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff));
  });

  protected readonly pairOptions = computed(() => {
    return [...new Set(this.allLevels().map((l) => l.pair))].sort();
  });

  protected getPriceFormat(pipSize: number): string {
    return pipSize === 0.01 ? '1.3-3' : '1.5-5';
  }

  protected setSortBy(value: string): void {
    if (value === 'pair' || value === 'diff') {
      this.sortBy.set(value);
    }
  }
}
