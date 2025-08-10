import { fetchDexScreenerCandles } from './providers/dexscreener.js';
import { fetchBirdeyeCandles } from './providers/birdeye.js';
import * as cache from './cache.js';
import { Candle } from '../types.js';
import { MarketDataConfig, PairConfig } from '../config/types.js';

export async function loadCandles(pair: PairConfig, md: MarketDataConfig): Promise<Candle[]> {
  const key = `${pair.baseMint}-${md.timeframe}`;
  const cached = cache.get<Candle[]>(key);
  if (cached) return cached;
  let candles: Candle[] = [];
  try {
    candles = await fetchDexScreenerCandles('solana', pair.baseMint, md.timeframe, md.lookback);
  } catch (e) {
    if (process.env.BIRDEYE_API_KEY) {
      candles = await fetchBirdeyeCandles(pair.baseMint, md.timeframe, md.lookback);
    } else {
      throw e;
    }
  }
  cache.set(key, candles, md.cacheTtlSec);
  return candles;
}
