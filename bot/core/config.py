import yaml
from datetime import date, datetime

def load_config(path: str) -> dict:
    with open(path, "rb") as f:
        text = f.read().decode("utf-8-sig")
    cfg = yaml.safe_load(text)
    if not isinstance(cfg, dict):
        raise ValueError(f"Config not a mapping: {type(cfg)}")
    for k in ("since", "until"):
        if k in cfg and isinstance(cfg[k], (date, datetime)):
            cfg[k] = cfg[k].strftime("%Y-%m-%d")
    return cfg
