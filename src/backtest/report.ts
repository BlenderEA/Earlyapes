import fs from 'fs';
import { Metrics } from './metrics.js';

export function writeReport(metrics: Metrics) {
  console.log('Backtest metrics', metrics);
  const dir = `reports/${Date.now()}`;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/metrics.json`, JSON.stringify(metrics, null, 2));
}
