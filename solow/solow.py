"""Solow growth model with Cobb-Douglas technology, in discrete time:

    Y = A K^alpha (E L)^(1 - alpha)

A is a constant level of productivity and E is the efficiency of labour, which
grows at rate g. k is capital per effective worker, K / (E L); output per
effective worker is y = A k^alpha. With g = 0 this is the model with constant
technology, and k is capital per worker.

Run as a script to plot the transition path:  uv run solow/solow.py
"""

from dataclasses import dataclass

import numpy as np


@dataclass
class Params:
    s: float = 0.25  # investment rate (the textbook "saving rate")
    alpha: float = 0.33  # capital share
    delta: float = 0.05  # depreciation rate
    n: float = 0.01  # population growth
    g: float = 0.02  # growth of labour efficiency
    A: float = 1.0  # constant level of productivity


def output(k, p: Params):
    return p.A * k**p.alpha


def break_even(k, p: Params):
    """Investment per effective worker needed to keep k constant."""
    return (p.delta + p.n + p.g + p.n * p.g) * k


def steady_state(p: Params) -> float:
    return (p.s * p.A / (p.delta + p.n + p.g + p.n * p.g)) ** (1 / (1 - p.alpha))


def step(k, p: Params):
    return (p.s * output(k, p) + (1 - p.delta) * k) / ((1 + p.n) * (1 + p.g))


def simulate(k0: float, p: Params = Params(), periods: int = 100) -> dict:
    """Return arrays t, k, y, c, i for t = 0..periods."""
    k = np.empty(periods + 1)
    k[0] = k0
    for t in range(periods):
        k[t + 1] = step(k[t], p)
    y = output(k, p)
    return {"t": np.arange(periods + 1), "k": k, "y": y, "c": (1 - p.s) * y, "i": p.s * y}


if __name__ == "__main__":
    import matplotlib.pyplot as plt

    p = Params()
    k_star = steady_state(p)
    path = simulate(k0=0.1 * k_star, p=p)

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))

    k_grid = np.linspace(0, 1.5 * k_star, 200)
    ax1.plot(k_grid, p.s * output(k_grid, p), label="investment, $s f(k)$")
    ax1.plot(k_grid, break_even(k_grid, p), label="break-even investment")
    ax1.axvline(k_star, color="grey", linestyle=":")
    ax1.set_xlabel("$k$")
    ax1.set_title("Solow diagram")
    ax1.legend()

    ax2.plot(path["t"], path["k"])
    ax2.axhline(k_star, color="grey", linestyle=":")
    ax2.set_xlabel("$t$")
    ax2.set_ylabel("$k$")
    ax2.set_title("Transition path")

    fig.tight_layout()
    plt.show()
