import os
import json
import base64
import base58
import requests
import pandas as pd
from typing import Dict, Any
from solana.rpc.api import Client as SolClient

BIRDEYE_BASE = "https://public-api.birdeye.so/defi/v3/ohlcv"

def fetch_ohlcv_birdeye(base_mint: str, quote_mint: str, timeframe: str, limit: int) -> pd.DataFrame:
    api_key = os.getenv("BIRDEYE_API_KEY", "")
    if not api_key:
        raise RuntimeError("BIRDEYE_API_KEY not set in environment")

    params = {
        "address": base_mint,     # token mint address (SOL wrapped mint for SOL/USDC)
        "type": timeframe,        # "1m","5m","15m","1h","4h","1d"
        "limit": int(limit),
    }
    headers = {
        "X-API-KEY": api_key,
        "accept": "application/json",
        "x-chain": "solana",
    }

    r = requests.get(BIRDEYE_BASE, params=params, headers=headers, timeout=20)
    r.raise_for_status()
    data = r.json().get("data", {})
    candles = data.get("items", [])
    if not candles:
        raise RuntimeError("No candles returned from Birdeye v3 API")

    df = pd.DataFrame(candles).rename(
        columns={"unixTime": "timestamp", "o": "open", "h": "high", "l": "low", "c": "close", "v": "volume"}
    )
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit="s", utc=True)
    df.set_index("timestamp", inplace=True)
    return df[["open", "high", "low", "close", "volume"]].astype(float)


class JupiterExecutor:
    """
    Jupiter executor that works in PAPER mode without Solana TX deps,
    and in LIVE mode with either solana-py or solders installed.
    """
    def __init__(self, rpc_url: str, secret: str = "", public_key: str = "", slippage_bps: int = 50, paper: bool = True):
        self.client = SolClient(rpc_url) if rpc_url else None
        self.slippage_bps = slippage_bps
        self.paper = paper
        self.keypair = self._load_keypair(secret) if secret else None
        # derive pubkey if not provided
        if public_key:
            self.pubkey = public_key
        else:
            self.pubkey = ""
            if self.keypair is not None:
                # solana-py has .public_key; solders has .pubkey()
                pk = getattr(self.keypair, "public_key", None)
                if pk is not None:
                    self.pubkey = pk.to_base58().decode()
                else:
                    try:
                        self.pubkey = str(self.keypair.pubkey())  # solders
                    except Exception:
                        self.pubkey = ""

    def _load_keypair(self, secret: str):
        """
        Accept base58 string or JSON array secret.
        Try solana-py Keypair.from_secret_key(bytes),
        then solders Keypair.from_bytes(bytes).
        """
        # Convert to raw bytes
        try:
            arr = json.loads(secret)  # Phantom export array
            secret_bytes = bytes(arr)
        except Exception:
            secret_bytes = base58.b58decode(secret)

        # Try solana-py
   

        # Try solders
        try:
            from solders.keypair import Keypair as SoldersKeypair
            return SoldersKeypair.from_bytes(secret_bytes)
        except Exception:
            return None

    # Minimal stubs to keep the interface; your live swap logic is elsewhere
    def quote(self, input_mint: str, output_mint: str, amount: int) -> Dict[str, Any]:
        return {"info": "stub_quote", "input": input_mint, "output": output_mint, "amount": amount}

    def swap(self, quote_resp: Dict[str, Any]) -> Dict[str, Any]:
        if self.paper:
            return {"info": "paper_trade"}
        return {"info": "live_swap_not_implemented_in_this_stub"}
