import axios from 'axios';
import { Candle } from '../../types.js';

export async function fetchDexScreenerCandles(
  chain: string,
  pairAddress: string,
  interval: string,
  limit: number
): Promise<Candle[]> {
  const url = `https://api.dexscreener.com/latest/dex/candles/${chain}/${pairAddress}?interval=${interval}&limit=${limit}`;
  const res = await axios.get(url);
  const candles = res.data?.candles || [];
  return candles.map((c: any) => ({
    ts: c.t,
    open: c.o,
    high: c.h,
    low: c.l,
    close: c.c,
    volumeUsd: c.vUsd,
  }));
}
