import { loadEnv } from '../utils/env.js';
import { loadConfig } from '../config/schema.js';
import { createLogger } from '../utils/logger.js';
import { loadCandles } from '../data/candles.js';
import { MomentumStrategy } from '../strategy/momentum.js';
import { Portfolio } from '../exec/portfolio.js';
import { sizePosition } from '../exec/risk.js';
import { executeSwap } from '../exec/jupiter.js';

const args = process.argv;
const cfgPath = args.includes('--config') ? args[args.indexOf('--config') + 1] : 'src/config/default.yaml';

loadEnv();
const cfg = loadConfig(cfgPath);
const logger = createLogger(cfg.logging);

async function main() {
  const candles = await loadCandles(cfg.pair, cfg.marketData);
  const strat = new MomentumStrategy(cfg.strategy.params);
  const pf = new Portfolio(cfg.backtest.startingEquity);
  const sig = strat.onBar(candles);
  const price = candles[candles.length - 1].close;
  logger.info({ sig }, 'strategy signal');
  if (sig.side === 'long' && pf.positions.length === 0) {
    const pos = sizePosition(pf.equity, price, candles, cfg.risk);
    const fill = await executeSwap('buy', pos.qty, price, cfg.execution, true);
    pf.open({ ...pos, entry: fill });
    logger.info({ fill }, 'paper trade executed');
  }
}

main().catch(e => {
  logger.error(e);
  process.exit(1);
});
