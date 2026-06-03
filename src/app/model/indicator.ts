export interface Indicator {
    name: string;
    indicatorLevels: IndicatorLevel[];
}

export interface IndicatorLevel {
    name: string;
    value: number;
}

export interface IndicatorLevelDisplay {
    symbol: string;
    description: string;
    name: string;
    value: number;
    difference: number;
}