import { Candle } from '../types.js';
import { Strategy, Signal } from './base.js';

export interface MomentumParams {
  fastEMA: number;
  slowEMA: number;
  rsiPeriod: number;
  rsiBuy: number;
  rsiSell: number;
  minVolUsd: number;
  confirmBars: number;
}

function ema(values: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const emaVals: number[] = [];
  values.forEach((v, i) => {
    if (i === 0) emaVals.push(v);
    else emaVals.push(v * k + emaVals[i - 1] * (1 - k));
  });
  return emaVals;
}

function rsi(values: number[], period: number): number[] {
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    gains.push(Math.max(diff, 0));
    losses.push(Math.max(-diff, 0));
  }
  const avgGain = ema(gains, period);
  const avgLoss = ema(losses, period);
  const rsis: number[] = [];
  for (let i = 0; i < avgGain.length; i++) {
    const rs = avgLoss[i] === 0 ? 100 : avgGain[i] / avgLoss[i];
    rsis.push(100 - 100 / (1 + rs));
  }
  return [0, ...rsis];
}

export class MomentumStrategy implements Strategy {
  constructor(private params: MomentumParams) {}

  onBar(candles: Candle[]): Signal {
    if (candles.length < this.params.slowEMA + this.params.confirmBars) {
      return { side: 'flat', reason: 'warmup' };
    }
    const closes = candles.map(c => c.close);
    const fast = ema(closes, this.params.fastEMA);
    const slow = ema(closes, this.params.slowEMA);
    const rsis = rsi(closes, this.params.rsiPeriod);
    const vols = candles.map(c => c.volumeUsd);
    const n = candles.length - 1;
    const entryCond = [];
    for (let i = 0; i < this.params.confirmBars; i++) {
      const idx = n - i;
      entryCond.push(
        fast[idx] > slow[idx] &&
          rsis[idx] >= this.params.rsiBuy &&
          vols[idx] >= this.params.minVolUsd
      );
    }
    if (entryCond.every(Boolean)) {
      return { side: 'long', reason: 'momentum' };
    }
    if (fast[n] < slow[n] || rsis[n] <= this.params.rsiSell) {
      return { side: 'exit', reason: 'trend_loss' };
    }
    return { side: 'flat', reason: 'no_signal' };
  }
}
