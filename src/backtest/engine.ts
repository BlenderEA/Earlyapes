import { Candle } from '../types.js';
import { Strategy } from '../strategy/base.js';
import { RiskConfig, BacktestConfig } from '../config/types.js';
import { Portfolio } from '../exec/portfolio.js';
import { sizePosition } from '../exec/risk.js';

export function runBacktest(
  candles: Candle[],
  strat: Strategy,
  riskCfg: RiskConfig,
  btCfg: BacktestConfig
): Portfolio {
  const pf = new Portfolio(btCfg.startingEquity);
  for (let i = 0; i < candles.length; i++) {
    const slice = candles.slice(0, i + 1);
    const sig = strat.onBar(slice);
    const price = candles[i].close;
    if (sig.side === 'long' && pf.positions.length === 0) {
      const pos = sizePosition(pf.equity, price, slice, riskCfg);
      pf.open({ ...pos, entry: price });
    }
    if (sig.side === 'exit' && pf.positions.length > 0) {
      pf.closeAll(price);
    }
  }
  return pf;
}
