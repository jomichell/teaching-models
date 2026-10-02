// Solow growth model with Cobb-Douglas technology, in discrete time:
//   Y = A K^alpha (E L)^(1 - alpha)
// A is a constant level of productivity and E is the efficiency of labour, which
// starts at E0 and grows at rate g. k is capital per effective worker, K / (E L);
// output per effective worker is y = A k^alpha.
//
// Two special cases are used by the pages:
//   constant technology:  g = 0, so E = 1, k = K / L and y = A k^alpha;
//   effective labour:     A = 1, so Y = K^alpha (E L)^(1 - alpha). Textbooks, and
//                         the pages, write this efficiency term as A.

export const defaults = {
  s: 0.25, // investment rate (the textbook "saving rate")
  alpha: 0.33, // capital share
  delta: 0.05, // depreciation rate
  n: 0.01, // population growth
  g: 0.02, // growth of labour efficiency
  A: 1, // constant level of productivity
};

export function output(k, { alpha, A = 1 }) {
  return A * k ** alpha;
}

// Investment per effective worker needed to keep k constant.
export function breakEven(k, { delta, n, g }) {
  return (delta + n + g + n * g) * k;
}

export function steadyState({ s, alpha, delta, n, g, A = 1 }) {
  return ((s * A) / (delta + n + g + n * g)) ** (1 / (1 - alpha));
}

export function step(k, p) {
  return (p.s * output(k, p) + (1 - p.delta) * k) / ((1 + p.n) * (1 + p.g));
}

// Returns [{t, k, y, c, i, s, E, L, K, Y, yPerCapita, yPerCapitaGrowth}, ...] for
// t = 0..periods.
// k, y, c, i are per effective worker; E, L, K, Y are levels, with labour efficiency
// and labour starting from E0 and L0; yPerCapita is output per worker, Y / L,
// and yPerCapitaGrowth its growth rate over the previous period (undefined at t = 0).
// An optional shock {t, params} permanently replaces the given parameters from
// period t onwards, e.g. {t: 50, params: {s: 0.35}}. Each row records the investment
// rate in force in that period.
export function simulate(k0, p = defaults, periods = 100, { E0 = 1, L0 = 1, shock } = {}) {
  const path = [];
  let k = k0;
  for (let t = 0; t <= periods; t++) {
    const pt = shock && t >= shock.t ? { ...p, ...shock.params } : p;
    const y = output(k, pt);
    const E = E0 * (1 + p.g) ** t;
    const L = L0 * (1 + p.n) ** t;
    const yPerCapita = y * E;
    const yPerCapitaGrowth = t > 0 ? yPerCapita / path[t - 1].yPerCapita - 1 : undefined;
    path.push({ t, k, y, c: (1 - pt.s) * y, i: pt.s * y, s: pt.s, E, L, K: k * E * L, Y: y * E * L, yPerCapita, yPerCapitaGrowth });
    k = step(k, pt);
  }
  return path;
}
