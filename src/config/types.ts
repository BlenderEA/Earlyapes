export interface PairConfig {
  baseMint: string;
  quoteMint: string;
}

export interface MarketDataConfig {
  timeframe: string;
  lookback: number;
  provider: string;
  cacheTtlSec: number;
}

export interface StrategyParams {
  fastEMA: number;
  slowEMA: number;
  rsiPeriod: number;
  rsiBuy: number;
  rsiSell: number;
  minVolUsd: number;
  confirmBars: number;
}

export interface StrategyConfig {
  name: string;
  params: StrategyParams;
}

export interface RiskConfig {
  maxPortfolioExposurePct: number;
  perTradeRiskPct: number;
  atrPeriod: number;
  atrStopMult: number;
  takeProfitRR: number;
  slipPct: number;
  maxOpenPositions: number;
}

export interface ExecutionRetry {
  attempts: number;
  backoffMs: number;
}

export interface ExecutionJupiter {
  maxSlippageBps: number;
  retry: ExecutionRetry;
}

export interface ExecutionConfig {
  jupiter: ExecutionJupiter;
}

export interface LoggingConfig {
  level: string;
  json: boolean;
}

export interface BacktestConfig {
  startingEquity: number;
  feePct: number;
  start: string;
  end: string;
}

export interface Config {
  mode: 'PAPER' | 'LIVE';
  rpcUrl: string;
  walletPrivateKey?: string | null;
  pair: PairConfig;
  marketData: MarketDataConfig;
  strategy: StrategyConfig;
  risk: RiskConfig;
  execution: ExecutionConfig;
  logging: LoggingConfig;
  backtest: BacktestConfig;
}
