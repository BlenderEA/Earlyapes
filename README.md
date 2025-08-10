# EARLY APE DEGENERATOR — SOL/USDC (Jupiter DEX)

TypeScript refactor of the Solana trading bot featuring a modular strategy engine,
risk management, and paper/backtest/live execution via Jupiter.

## Quickstart
```bash
npm install
cp .env.example .env  # fill SOLANA_RPC_URL, optional PRIVATE_KEY and BIRDEYE_API_KEY

# Paper trading (default)
npm run paper

# Backtest
npm run backtest
```

## Scripts
- `npm run paper` – run the strategy in PAPER mode using current config
- `npm run live` – execute swaps on-chain when `mode: LIVE` and keys are present
- `npm run backtest` – run historical backtest and write a metrics report

Configuration lives in `src/config/default.yaml` and is validated on load.
