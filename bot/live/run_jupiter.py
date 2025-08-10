import os
import time
import yaml
from datetime import datetime, timezone
from pathlib import Path
from dotenv import load_dotenv, find_dotenv
from bot.data.solana_dex import fetch_ohlcv_dexscreener, JupiterExecutor

# robust .env loading (project root)
ROOT = Path(__file__).resolve().parents[2]   # -> project folder
env_path = ROOT / ".env"
load_dotenv(dotenv_path=str(env_path), override=True)
# fallback: search upwards from CWD just in case
load_dotenv(find_dotenv(usecwd=True), override=True)


def print_banner():
    print(r"""
███████╗ █████╗ ██████╗ ██╗  ██╗██╗   ██╗     █████╗ ██████╗ ███████╗
██╔════╝██╔══██╗██╔══██╗██║ ██╔╝╚██╗ ██╔╝    ██╔══██╗██╔══██╗██╔════╝
█████╗  ███████║██████╔╝█████╔╝  ╚████╔╝     ███████║██║  ██║█████╗
██╔══╝  ██╔══██║██╔══██╗██╔═██╗   ╚██╔╝      ██╔══██║██║  ██║██╔══╝
███████╗██║  ██║██║  ██║██║  ██╗   ██║       ██║  ██║██████╔╝███████╗
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚═╝  ╚═╝╚═════╝ ╚══════╝
            E A R L Y   A P E   D E G E N E R A T O R  v1.0
                Rule-based Jupiter DEX Trading Bot
""")

def main():
    with open("config/live_sol_only.yaml", "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)

    paper = bool(cfg.get("paper", True))
    tf = cfg.get("timeframe", "1h")
    lookback_bars = int(cfg.get("lookback_bars", 720))
    poll = int(cfg.get("poll_seconds", 60))
    dex_cfg = cfg.get("dex", {})
    chain = dex_cfg.get("chain", "solana")
    dex = dex_cfg.get("name", "raydium")
    pair_address = dex_cfg.get("pair_address", "")

    print_banner()
    mode = "LIVE" if not paper else "PAPER"
    print(f"Mode: {mode} | TF={tf} | Lookback bars={lookback_bars}")

    execu = JupiterExecutor(
        rpc_url=os.getenv("SOLANA_RPC_URL", ""),
        secret=os.getenv("SOLANA_SECRET_KEY", ""),
        public_key=os.getenv("SOLANA_PUBLIC_KEY", ""),
        slippage_bps=cfg.get("execution", {}).get("slippage_bps", 50),
        paper=paper,
    )

    while True:
        try:
            pair = cfg["symbols"][0]
            df = fetch_ohlcv_dexscreener(
                chain=chain,
                dex=dex,
                pair_address=pair_address,
                timeframe=tf,
                limit=lookback_bars,
            )
            print(f"[{datetime.now(timezone.utc).isoformat()}] Got {len(df)} bars for {pair['name']} from {dex}")
        except Exception as e:
            print(f"[{datetime.now(timezone.utc).isoformat()}] loop error: {e}")
        time.sleep(poll)

if __name__ == "__main__":
    main()
