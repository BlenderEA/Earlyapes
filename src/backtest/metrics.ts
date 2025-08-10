import { Portfolio } from '../exec/portfolio.js';
import { BacktestConfig } from '../config/types.js';

export interface Metrics {
  totalReturn: number;
}

export function computeMetrics(pf: Portfolio, cfg: BacktestConfig): Metrics {
  const totalReturn = (pf.equity - cfg.startingEquity) / cfg.startingEquity;
  return { totalReturn };
}
