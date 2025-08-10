import { loadEnv } from '../utils/env.js';
import { loadConfig } from '../config/schema.js';
import { createLogger } from '../utils/logger.js';
import { loadCandles } from '../data/candles.js';
import { MomentumStrategy } from '../strategy/momentum.js';
import { runBacktest } from '../backtest/engine.js';
import { computeMetrics } from '../backtest/metrics.js';
import { writeReport } from '../backtest/report.js';

const args = process.argv;
const cfgPath = args.includes('--config') ? args[args.indexOf('--config') + 1] : 'src/config/default.yaml';

loadEnv();
const cfg = loadConfig(cfgPath);
const logger = createLogger(cfg.logging);

async function main() {
  try {
    const candles = await loadCandles(cfg.pair, cfg.marketData);
    const strat = new MomentumStrategy(cfg.strategy.params);
    const pf = runBacktest(candles, strat, cfg.risk, cfg.backtest);
    const metrics = computeMetrics(pf, cfg.backtest);
    writeReport(metrics);
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
}

main();
