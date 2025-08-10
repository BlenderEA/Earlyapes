# EARLY APE DEGENERATOR — SOL/USDC (Jupiter DEX)

This is a **rules‑based, non‑guessing** bot that trades **SOL/USDC** on Solana using **Jupiter** for execution
and **DexScreener** for candles. Paper mode by default.


███████╗ █████╗ ██████╗ ██╗  ██╗██╗   ██╗     █████╗ ██████╗ ███████╗
██╔════╝██╔══██╗██╔══██╗██║ ██╔╝╚██╗ ██╔╝    ██╔══██╗██╔══██╗██╔════╝
█████╗  ███████║██████╔╝█████╔╝  ╚████╔╝     ███████║██║  ██║█████╗  
██╔══╝  ██╔══██║██╔══██╗██╔═██╗   ╚██╔╝      ██╔══██║██║  ██║██╔══╝  
███████╗██║  ██║██║  ██║██║  ██╗   ██║       ██║  ██║██████╔╝███████╗
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚═╝  ╚═╝╚═════╝ ╚══════╝
               E A R L Y   A P E   D E G E N E R A T O R
                     Rule‑based Jupiter DEX Trading Bot


## Quickstart
```bash
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt

# Environment
copy .env.example .env   # or: cp .env.example .env
# Fill SOLANA_RPC_URL (wallet keys optional in paper; DexScreener needs no API key)
# If you are behind a corporate proxy that blocks outbound traffic,
# unset HTTP(S)_PROXY variables so the bot can reach api.dexscreener.com

# Run (paper mode)
python -m bot.live.run_jupiter --config config/live_sol_only.yaml
```

## Go Live (careful)
- In `.env`: `LIVE_TRADING=TRUE`
- In `config/live_sol_only.yaml`: `paper: false`
- Start with a tiny notional and confirm a test swap.

## Strategy
- Momentum: ROC(5) > 0 and ROC(20) > 0
- Trend: EMA(21) > EMA(55); price > SMA(120)
- Regime gating: SOPR 7‑period proxy ≥ 1.0; MVRV percentile below 85–90%
- Sizing: Volatility targeting with per‑asset & gross caps
- Risk: Min notional filter, TP/SL (ATR or fixed %), optional cool‑off after losses

## Files
- `bot/live/run_jupiter.py` — main loop + ASCII banner
- `bot/data/solana_dex.py` — DexScreener candles + Jupiter executor (paper/live)
- `bot/signals/*` — indicators & proxies
- `config/live_sol_only.yaml` — SOL/USDC only, `capital: 0.25` in SOL
- `.env.example` — RPC, optional wallet keys
