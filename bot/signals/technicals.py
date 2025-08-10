import pandas as pd
def roc(s: pd.Series, w: int): return s.pct_change(w)
def ema(s: pd.Series, span: int): return s.ewm(span=span, adjust=False).mean()
def sma(s: pd.Series, w: int): return s.rolling(w).mean()
def atr(df: pd.DataFrame, n: int = 14):
    hl = (df['high'] - df['low']).abs()
    hc = (df['high'] - df['close'].shift()).abs()
    lc = (df['low'] - df['close'].shift()).abs()
    tr = pd.concat([hl, hc, lc], axis=1).max(axis=1)
    return tr.rolling(n).mean()
