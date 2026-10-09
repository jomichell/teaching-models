// CES (constant elasticity of substitution) production with two inputs, as in
// Jones (2026), "AI and our economic future", Journal of Economic Perspectives.
// sigma is the elasticity of substitution and rho = (sigma - 1) / sigma.

// Output as an equally weighted power mean of the two inputs:
//   Y = (x1^rho / 2 + x2^rho / 2)^(1 / rho).
// sigma = 1 is the Cobb-Douglas limit, the geometric mean sqrt(x1 x2).
export function ces(x1, x2, sigma) {
  const rho = (sigma - 1) / sigma;
  if (Math.abs(rho) < 1e-6) return Math.sqrt(x1 * x2);
  if (rho < 0 && (x1 === 0 || x2 === 0)) return 0; // every input is essential
  return (0.5 * x1 ** rho + 0.5 * x2 ** rho) ** (1 / rho);
}

// The weak-link function in Jones's text, sigma = 1/2 without the 1/2 weights:
//   1 / Y = 1 / easy + 1 / hard.
export function weakLink(easy, hard) {
  return 1 / (1 / easy + 1 / hard);
}

// Points [{x1, x2}, ...] on the isoquant f(x1, x2) = y, for any production
// function f with constant returns to scale. Each point lies on a ray from the
// origin, f(t u) = t f(u), so no equation has to be solved; points further than
// `limit` from the origin (where the isoquant runs off towards an asymptote) are
// left out, since browsers fail to draw enormous coordinates.
export function isoquant(y, f, limit, points = 800) {
  const out = [];
  for (let i = 1; i < points; i++) {
    const angle = (Math.PI / 2) * (i / points);
    const u1 = Math.cos(angle), u2 = Math.sin(angle);
    const t = y / f(u1, u2);
    if (Number.isFinite(t) && t * u1 <= limit && t * u2 <= limit) out.push({ x1: t * u1, x2: t * u2 });
  }
  return out;
}

// CES with capital and labour, as in the ETP lecture 2 slides:
//   Y = (alpha K^rho + (1 - alpha) L^rho)^(1 / rho).
// sigma = 1 is the Cobb-Douglas limit, K^alpha L^(1 - alpha).
export function cesKL(K, L, sigma, alpha) {
  const rho = (sigma - 1) / sigma;
  if (Math.abs(rho) < 1e-6) return K ** alpha * L ** (1 - alpha);
  if (rho < 0 && (K === 0 || L === 0)) return 0;
  return (alpha * K ** rho + (1 - alpha) * L ** rho) ** (1 / rho);
}

// Cost-minimising choice when capital costs r and labour costs w, given only
// through the relative price of capital, r / w. With constant returns and
// competitive markets, the shares of cost are also the shares of income.
// Returns the capital-labour ratio, spending on capital relative to labour, the
// labour share, and the inputs that produce one unit of output.
export function factorChoice(sigma, alpha, priceRatio) {
  const kl = ((alpha / (1 - alpha)) / priceRatio) ** sigma;
  const spending = priceRatio * kl;
  const L = 1 / cesKL(kl, 1, sigma, alpha);
  return { kl, spending, labourShare: 1 / (1 + spending), L, K: kl * L };
}
