import { PositionSizing } from './risk.js';

export interface Position extends PositionSizing {
  entry: number;
}

export class Portfolio {
  equity: number;
  positions: Position[] = [];

  constructor(startingEquity: number) {
    this.equity = startingEquity;
  }

  open(pos: Position) {
    this.positions.push(pos);
  }

  update(price: number) {
    // naive unrealized PnL
    this.positions.forEach(p => {
      const pnl = (price - p.entry) * p.qty;
      this.equity += pnl;
      p.entry = price;
    });
  }

  closeAll(price: number) {
    this.positions.forEach(p => {
      const pnl = (price - p.entry) * p.qty;
      this.equity += pnl;
    });
    this.positions = [];
  }
}
