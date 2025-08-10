import numpy as np

def ewma_vol(returns, span=30):
    vol = returns.ewm(span=span, adjust=False).std()
    return vol * (365 ** 0.5)

def cap_weights(weights, max_gross=1.0, max_per=1.0):
    w = weights.copy().clip(-max_per, max_per)
    gross = w.abs().sum()
    if gross > max_gross and gross > 0:
        w *= (max_gross / gross)
    return w
