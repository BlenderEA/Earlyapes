import { Candle } from '../types.js';
import { RiskConfig } from '../config/types.js';

export interface PositionSizing {
  qty: number;
  stop: number;
  takeProfit: number;
}

export function calcATR(candles: Candle[], period: number): number {
  if (candles.length < period + 1) return 0;
  const trs: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const c = candles[i];
    const prev = candles[i - 1];
    const tr = Math.max(
      c.high - c.low,
      Math.abs(c.high - prev.close),
      Math.abs(c.low - prev.close)
    );
    trs.push(tr);
  }
  const atrs = trs.slice(-period).reduce((a, b) => a + b, 0) / period;
  return atrs;
}

export function sizePosition(
  equity: number,
  entry: number,
  candles: Candle[],
  cfg: RiskConfig
): PositionSizing {
  const atr = calcATR(candles, cfg.atrPeriod);
  const stopDist = atr * cfg.atrStopMult;
  const riskAmount = (equity * cfg.perTradeRiskPct) / 100;
  const qty = riskAmount / stopDist;
  const stop = entry - stopDist;
  const takeProfit = entry + cfg.takeProfitRR * stopDist;
  return { qty, stop, takeProfit };
}
