import { ExecutionConfig } from '../config/types.js';

export async function executeSwap(
  side: 'buy' | 'sell',
  qty: number,
  price: number,
  cfg: ExecutionConfig,
  paper = true
): Promise<number> {
  const slip = cfg.jupiter.maxSlippageBps / 10000;
  if (paper) {
    return side === 'buy' ? price * (1 + slip) : price * (1 - slip);
  }
  // TODO: integrate Jupiter on-chain swap
  return price;
}
