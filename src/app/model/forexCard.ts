export interface Indicator {
  name: string;
  value: number;
}

export interface SymbolCard {
  symbol: string;
  bid: number;
  ask: number;
  change: number;
  indicators: Indicator[];
}