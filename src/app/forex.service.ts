import { Injectable, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ForexHubService, PriceResponse } from './forex-hub.service';

export interface ValueArea {
  vah: number;
  poc: number;
  val: number;
}

export interface VwapData {
  vwap: number;
  stdDev: number;
}

export interface PrevDayOhlc {
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface ForexData {
  pair: string;
  bid: number;
  ask: number;
  previousClose: number;
  dailyHigh: number;
  dailyLow: number;
  valueArea: ValueArea;
  vwap: VwapData;
  prevDayOhlc: PrevDayOhlc;
  weeklyOhlc: PrevDayOhlc;
}

export interface PivotLevels {
  r3: number;
  r2: number;
  r1: number;
  pivot: number;
  s1: number;
  s2: number;
  s3: number;
}

export interface ForexQuote extends ForexData {
  percentChange: number;
  pipChange: number;
  pipSize: number;
  pivots: PivotLevels;
}

function calcPivots(high: number, low: number, close: number): PivotLevels {
  const pivot = (high + low + close) / 3;
  const r1 = 2 * pivot - low;
  const r2 = pivot + (high - low);
  const r3 = high + 2 * (pivot - low);
  const s1 = 2 * pivot - high;
  const s2 = pivot - (high - low);
  const s3 = low - 2 * (high - pivot);
  return { r3, r2, r1, pivot, s1, s2, s3 };
}

function computeQuote(data: ForexData): ForexQuote {
  const pipSize = data.pair.includes('JPY') ? 0.01 : 0.0001;
  const percentChange = ((data.bid - data.previousClose) / data.previousClose) * 100;
  const pipChange = (data.bid - data.previousClose) / pipSize;
  const pivots = calcPivots(data.dailyHigh, data.dailyLow, data.previousClose);
  return { ...data, percentChange, pipChange, pipSize, pivots };
}

// const MOCK_DATA: ForexData[] = [
//   { pair: 'EUR/USD', bid: 1.08512, ask: 1.08524, previousClose: 1.08210, dailyHigh: 1.08650, dailyLow: 1.08100, valueArea: { vah: 1.08440, poc: 1.08250, val: 1.08110 }, vwap: { vwap: 1.08380, stdDev: 0.00115 }, prevDayOhlc: { open: 1.08380, high: 1.08650, low: 1.08100, close: 1.08210 }, weeklyOhlc: { open: 1.07920, high: 1.08750, low: 1.07650, close: 1.08210 } },
//   { pair: 'GBP/USD', bid: 1.27045, ask: 1.27060, previousClose: 1.26780, dailyHigh: 1.27200, dailyLow: 1.26650, valueArea: { vah: 1.27040, poc: 1.26850, val: 1.26680 }, vwap: { vwap: 1.26920, stdDev: 0.00150 }, prevDayOhlc: { open: 1.26900, high: 1.27200, low: 1.26650, close: 1.26780 }, weeklyOhlc: { open: 1.26350, high: 1.27380, low: 1.26200, close: 1.26780 } },
//   { pair: 'USD/JPY', bid: 150.485, ask: 150.510, previousClose: 149.980, dailyHigh: 150.750, dailyLow: 149.850, valueArea: { vah: 150.480, poc: 150.120, val: 149.920 }, vwap: { vwap: 150.280, stdDev: 0.190 }, prevDayOhlc: { open: 150.200, high: 150.750, low: 149.850, close: 149.980 }, weeklyOhlc: { open: 149.250, high: 151.050, low: 149.100, close: 149.980 } },
//   { pair: 'USD/CHF', bid: 0.89524, ask: 0.89540, previousClose: 0.89720, dailyHigh: 0.89800, dailyLow: 0.89300, valueArea: { vah: 0.89740, poc: 0.89600, val: 0.89410 }, vwap: { vwap: 0.89610, stdDev: 0.00120 }, prevDayOhlc: { open: 0.89450, high: 0.89800, low: 0.89300, close: 0.89720 }, weeklyOhlc: { open: 0.90050, high: 0.90150, low: 0.89200, close: 0.89720 } },
//   { pair: 'AUD/USD', bid: 0.63945, ask: 0.63958, previousClose: 0.64120, dailyHigh: 0.64250, dailyLow: 0.63800, valueArea: { vah: 0.64170, poc: 0.64000, val: 0.63840 }, vwap: { vwap: 0.64050, stdDev: 0.00105 }, prevDayOhlc: { open: 0.63950, high: 0.64250, low: 0.63800, close: 0.64120 }, weeklyOhlc: { open: 0.63600, high: 0.64380, low: 0.63450, close: 0.64120 } },
//   { pair: 'NZD/USD', bid: 0.58920, ask: 0.58935, previousClose: 0.58650, dailyHigh: 0.59050, dailyLow: 0.58500, valueArea: { vah: 0.58930, poc: 0.58720, val: 0.58570 }, vwap: { vwap: 0.58780, stdDev: 0.00130 }, prevDayOhlc: { open: 0.58580, high: 0.59050, low: 0.58500, close: 0.58650 }, weeklyOhlc: { open: 0.58300, high: 0.59150, low: 0.58200, close: 0.58650 } },
//   { pair: 'USD/CAD', bid: 1.38145, ask: 1.38162, previousClose: 1.38450, dailyHigh: 1.38600, dailyLow: 1.38000, valueArea: { vah: 1.38510, poc: 1.38330, val: 1.38130 }, vwap: { vwap: 1.38320, stdDev: 0.00140 }, prevDayOhlc: { open: 1.38150, high: 1.38600, low: 1.38000, close: 1.38450 }, weeklyOhlc: { open: 1.39100, high: 1.39250, low: 1.37850, close: 1.38450 } },
//   { pair: 'EUR/GBP', bid: 0.85410, ask: 0.85425, previousClose: 0.85280, dailyHigh: 0.85500, dailyLow: 0.85200, valueArea: { vah: 0.85450, poc: 0.85310, val: 0.85220 }, vwap: { vwap: 0.85350, stdDev: 0.00080 }, prevDayOhlc: { open: 0.85420, high: 0.85500, low: 0.85200, close: 0.85280 }, weeklyOhlc: { open: 0.85100, high: 0.85650, low: 0.85050, close: 0.85280 } },
//   { pair: 'EUR/JPY', bid: 163.245, ask: 163.275, previousClose: 162.850, dailyHigh: 163.500, dailyLow: 162.600, valueArea: { vah: 163.280, poc: 162.980, val: 162.750 }, vwap: { vwap: 163.080, stdDev: 0.245 }, prevDayOhlc: { open: 163.100, high: 163.500, low: 162.600, close: 162.850 }, weeklyOhlc: { open: 161.800, high: 163.750, low: 161.500, close: 162.850 } },
//   { pair: 'GBP/JPY', bid: 191.125, ask: 191.165, previousClose: 190.450, dailyHigh: 191.300, dailyLow: 190.200, valueArea: { vah: 191.080, poc: 190.680, val: 190.350 }, vwap: { vwap: 190.820, stdDev: 0.345 }, prevDayOhlc: { open: 190.800, high: 191.300, low: 190.200, close: 190.450 }, weeklyOhlc: { open: 189.200, high: 191.600, low: 188.950, close: 190.450 } },
// ];
const MOCK_DATA: ForexData[] = [
  { pair: 'EUR/USD', bid: 0, ask: 0, previousClose: 1.08210, dailyHigh: 1.08650, dailyLow: 1.08100, valueArea: { vah: 1.08440, poc: 1.08250, val: 1.08110 }, vwap: { vwap: 1.08380, stdDev: 0.00115 }, prevDayOhlc: { open: 1.08380, high: 1.08650, low: 1.08100, close: 1.08210 }, weeklyOhlc: { open: 1.07920, high: 1.08750, low: 1.07650, close: 1.08210 } },
  { pair: 'GBP/USD', bid: 0, ask: 0, previousClose: 1.26780, dailyHigh: 1.27200, dailyLow: 1.26650, valueArea: { vah: 1.27040, poc: 1.26850, val: 1.26680 }, vwap: { vwap: 1.26920, stdDev: 0.00150 }, prevDayOhlc: { open: 1.26900, high: 1.27200, low: 1.26650, close: 1.26780 }, weeklyOhlc: { open: 1.26350, high: 1.27380, low: 1.26200, close: 1.26780 } },
  { pair: 'USD/JPY', bid: 0, ask: 0, previousClose: 149.980, dailyHigh: 150.750, dailyLow: 149.850, valueArea: { vah: 150.480, poc: 150.120, val: 149.920 }, vwap: { vwap: 150.280, stdDev: 0.190 }, prevDayOhlc: { open: 150.200, high: 150.750, low: 149.850, close: 149.980 }, weeklyOhlc: { open: 149.250, high: 151.050, low: 149.100, close: 149.980 } },
  { pair: 'USD/CHF', bid: 0, ask: 0, previousClose: 0.89720, dailyHigh: 0.89800, dailyLow: 0.89300, valueArea: { vah: 0.89740, poc: 0.89600, val: 0.89410 }, vwap: { vwap: 0.89610, stdDev: 0.00120 }, prevDayOhlc: { open: 0.89450, high: 0.89800, low: 0.89300, close: 0.89720 }, weeklyOhlc: { open: 0.90050, high: 0.90150, low: 0.89200, close: 0.89720 } },
  { pair: 'AUD/USD', bid: 0, ask: 0, previousClose: 0.64120, dailyHigh: 0.64250, dailyLow: 0.63800, valueArea: { vah: 0.64170, poc: 0.64000, val: 0.63840 }, vwap: { vwap: 0.64050, stdDev: 0.00105 }, prevDayOhlc: { open: 0.63950, high: 0.64250, low: 0.63800, close: 0.64120 }, weeklyOhlc: { open: 0.63600, high: 0.64380, low: 0.63450, close: 0.64120 } },
  { pair: 'NZD/USD', bid: 0, ask: 0, previousClose: 0.58650, dailyHigh: 0.59050, dailyLow: 0.58500, valueArea: { vah: 0.58930, poc: 0.58720, val: 0.58570 }, vwap: { vwap: 0.58780, stdDev: 0.00130 }, prevDayOhlc: { open: 0.58580, high: 0.59050, low: 0.58500, close: 0.58650 }, weeklyOhlc: { open: 0.58300, high: 0.59150, low: 0.58200, close: 0.58650 } },
  { pair: 'USD/CAD', bid: 0, ask: 0, previousClose: 1.38450, dailyHigh: 1.38600, dailyLow: 1.38000, valueArea: { vah: 1.38510, poc: 1.38330, val: 1.38130 }, vwap: { vwap: 1.38320, stdDev: 0.00140 }, prevDayOhlc: { open: 1.38150, high: 1.38600, low: 1.38000, close: 1.38450 }, weeklyOhlc: { open: 1.39100, high: 1.39250, low: 1.37850, close: 1.38450 } },
  { pair: 'EUR/GBP', bid: 0, ask: 0, previousClose: 0.85280, dailyHigh: 0.85500, dailyLow: 0.85200, valueArea: { vah: 0.85450, poc: 0.85310, val: 0.85220 }, vwap: { vwap: 0.85350, stdDev: 0.00080 }, prevDayOhlc: { open: 0.85420, high: 0.85500, low: 0.85200, close: 0.85280 }, weeklyOhlc: { open: 0.85100, high: 0.85650, low: 0.85050, close: 0.85280 } },
  { pair: 'EUR/JPY', bid: 0, ask: 0, previousClose: 162.850, dailyHigh: 163.500, dailyLow: 162.600, valueArea: { vah: 163.280, poc: 162.980, val: 162.750 }, vwap: { vwap: 163.080, stdDev: 0.245 }, prevDayOhlc: { open: 163.100, high: 163.500, low: 162.600, close: 162.850 }, weeklyOhlc: { open: 161.800, high: 163.750, low: 161.500, close: 162.850 } },
  { pair: 'GBP/JPY', bid: 0, ask: 0, previousClose: 190.450, dailyHigh: 191.300, dailyLow: 190.200, valueArea: { vah: 191.080, poc: 190.680, val: 190.350 }, vwap: { vwap: 190.820, stdDev: 0.345 }, prevDayOhlc: { open: 190.800, high: 191.300, low: 190.200, close: 190.450 }, weeklyOhlc: { open: 189.200, high: 191.600, low: 188.950, close: 190.450 } },
];

@Injectable({ providedIn: 'root' })
export class ForexService {
  readonly quotes = signal<ForexQuote[]>(MOCK_DATA.map(computeQuote));
  // readonly quotes = signal<ForexQuote[]>([]);
  private hubSub: Subscription | null = null;

  constructor(private hub: ForexHubService) {}

  async startHub(hubUrl: string, eventName = 'PriceUpdate') {
    await this.hub.connect('');
    this.hubSub = this.hub.price$.subscribe((p) => this.applyPrice(p));
  }

  async stopHub() {
    this.hubSub?.unsubscribe();
    this.hubSub = null;
    await this.hub.disconnect();
  }

  private applyPrice(p: PriceResponse) {
    const extract = (arr: any[] | null) => {
      if (!arr || arr.length === 0) return NaN;
      const first = arr[0];
      if (Array.isArray(first)) return Number(first[0]);
      if (typeof first === 'object' && first !== null) {
        return Number(first.price ?? first[0] ?? NaN);
      }
      return Number(first);
    };

    const bid = extract(p.bids) || Number(p.closeoutBid) || NaN;
    const ask = extract(p.asks) || Number(p.closeoutAsk) || NaN;

    const current = this.quotes();
    const idx = current.findIndex((q) => q.pair === p.instrument);
    const baseQuote: ForexData = {
      pair: p.instrument,
      bid: isNaN(bid) ? 0 : bid,
      ask: isNaN(ask) ? 0 : ask,
      previousClose: isNaN(bid) ? 0 : bid,
      dailyHigh: isNaN(bid) ? 0 : bid,
      dailyLow: isNaN(bid) ? 0 : bid,
      valueArea: { vah: 0, poc: 0, val: 0 },
      vwap: { vwap: 0, stdDev: 0 },
      prevDayOhlc: { open: 0, high: 0, low: 0, close: 0 },
      weeklyOhlc: { open: 0, high: 0, low: 0, close: 0 },
    };

    const updated = computeQuote(baseQuote);
    if (idx >= 0) {
      const copy = [...current];
      copy[idx] = { ...copy[idx], bid: updated.bid, ask: updated.ask, percentChange: updated.percentChange, pipChange: updated.pipChange } as ForexQuote;
      this.quotes.set(copy);
    } else {
      this.quotes.set([updated, ...current]);
    }
  }
}
