import axios from 'axios';
import { Candle } from '../../types.js';

export async function fetchBirdeyeCandles(
  address: string,
  interval: string,
  limit: number
): Promise<Candle[]> {
  const apiKey = process.env.BIRDEYE_API_KEY;
  if (!apiKey) throw new Error('BIRDEYE_API_KEY not set');
  const url = `https://public-api.birdeye.so/defi/v3/ohlcv?address=${address}&type=${interval}&limit=${limit}`;
  const res = await axios.get(url, { headers: { 'X-API-KEY': apiKey } });
  const candles = res.data?.data?.items || [];
  return candles.map((c: any) => ({
    ts: c.time,
    open: c.o,
    high: c.h,
    low: c.l,
    close: c.c,
    volumeUsd: c.v,
  }));
}
