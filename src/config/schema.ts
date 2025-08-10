import { readFileSync } from 'fs';
import yaml from 'yaml';
import { z } from 'zod';
import { Config } from './types.js';

const pair = z.object({ baseMint: z.string(), quoteMint: z.string() });
const marketData = z.object({
  timeframe: z.string(),
  lookback: z.number(),
  provider: z.string(),
  cacheTtlSec: z.number(),
});
const strategy = z.object({
  name: z.string(),
  params: z.object({
    fastEMA: z.number(),
    slowEMA: z.number(),
    rsiPeriod: z.number(),
    rsiBuy: z.number(),
    rsiSell: z.number(),
    minVolUsd: z.number(),
    confirmBars: z.number(),
  }),
});
const risk = z.object({
  maxPortfolioExposurePct: z.number(),
  perTradeRiskPct: z.number(),
  atrPeriod: z.number(),
  atrStopMult: z.number(),
  takeProfitRR: z.number(),
  slipPct: z.number(),
  maxOpenPositions: z.number(),
});
const execution = z.object({
  jupiter: z.object({
    maxSlippageBps: z.number(),
    retry: z.object({ attempts: z.number(), backoffMs: z.number() }),
  }),
});
const logging = z.object({ level: z.string(), json: z.boolean() });
const backtest = z.object({
  startingEquity: z.number(),
  feePct: z.number(),
  start: z.string(),
  end: z.string(),
});

export const configSchema = z.object({
  mode: z.enum(['PAPER', 'LIVE']).default('PAPER'),
  rpcUrl: z.string(),
  walletPrivateKey: z.string().optional().nullable(),
  pair,
  marketData,
  strategy,
  risk,
  execution,
  logging,
  backtest,
});

export function loadConfig(path: string): Config {
  const raw = readFileSync(path, 'utf-8');
  const substituted = raw.replace(/\${(\w+)}/g, (_, v) => process.env[v] || '');
  const data = yaml.parse(substituted);
  return configSchema.parse(data);
}
