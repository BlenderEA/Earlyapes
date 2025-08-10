import numpy as np, pandas as pd
def sopr7d_proxy(returns: pd.Series): return 1.0 + returns.rolling(7).mean()
def mvrv_band_proxy(price: pd.Series, lookback=365):
    mean = price.rolling(lookback, min_periods=30).mean()
    dev = (price/mean) - 1.0
    def _pct_rank(x):
        s = pd.Series(x).dropna()
        if len(s)==0: return np.nan
        return s.rank(pct=True).iloc[-1]
    return dev.rolling(lookback, min_periods=30).apply(_pct_rank, raw=False).rename("mvrv_pct")
