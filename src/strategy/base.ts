import { Candle } from '../types.js';

export interface Signal {
  side: 'long' | 'flat' | 'exit';
  reason: string;
}

export interface Strategy {
  onBar(candles: Candle[]): Signal;
}
