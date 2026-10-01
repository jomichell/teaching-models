// Solow growth model with Cobb-Douglas technology, in discrete time.
// k is capital per effective worker; output per effective worker is y = k^alpha.

export const defaults = {
  s: 0.25, // investment rate (the textbook "saving rate")
  alpha: 0.33, // capital share
  delta: 0.05, // depreciation rate
  n: 0.01, // population growth
  g: 0.02, // technology growth
};

export function output(k, { alpha }) {
  return k ** alpha;
}

// Investment per effective worker needed to keep k constant.
export function breakEven(k, { delta, n, g }) {
  return (delta + n + g + n * g) * k;
}

export function steadyState({ s, alpha, delta, n, g }) {
  return (s / (delta + n + g + n * g)) ** (1 / (1 - alpha));
}

export function step(k, p) {
  return (p.s * output(k, p) + (1 - p.delta) * k) / ((1 + p.n) * (1 + p.g));
}

// Returns [{t, k, y, c, i, s, A, L, K, Y, yPerCapita}, ...] for t = 0..periods.
// k, y, c, i are per effective worker; A, L, K, Y are levels, with technology
// and labour starting from A0 and L0; yPerCapita is output per worker, Y / L,
// and yPerCapitaGrowth its growth rate over the previous period (undefined at t = 0).
// An optional shock {t, params} permanently replaces the given parameters from
// period t onwards, e.g. {t: 50, params: {s: 0.35}}. Each row records the investment
// rate in force in that period.
export function simulate(k0, p = defaults, periods = 100, { A0 = 1, L0 = 1, shock } = {}) {
  const path = [];
  let k = k0;
  for (let t = 0; t <= periods; t++) {
    const pt = shock && t >= shock.t ? { ...p, ...shock.params } : p;
    const y = output(k, pt);
    const A = A0 * (1 + p.g) ** t;
    const L = L0 * (1 + p.n) ** t;
    const yPerCapita = y * A;
    const yPerCapitaGrowth = t > 0 ? yPerCapita / path[t - 1].yPerCapita - 1 : undefined;
    path.push({ t, k, y, c: (1 - pt.s) * y, i: pt.s * y, s: pt.s, A, L, K: k * A * L, Y: y * A * L, yPerCapita, yPerCapitaGrowth });
    k = step(k, pt);
  }
  return path;
}
