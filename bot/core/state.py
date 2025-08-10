import os, json
from typing import Dict, Any

STATE_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "state", "state.json")

def load_state() -> Dict[str, Any]:
    try:
        with open(STATE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"positions": {}, "pnl": {}, "streak_losses": 0}

def save_state(s: Dict[str, Any]):
    os.makedirs(os.path.dirname(STATE_PATH), exist_ok=True)
    with open(STATE_PATH, "w", encoding="utf-8") as f:
        json.dump(s, f, indent=2)
