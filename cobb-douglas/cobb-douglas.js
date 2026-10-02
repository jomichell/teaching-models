// Cobb-Douglas production function, q = A L^a K^b, with parameters p = {A, a, b}.

// Capital needed to produce q with labour L.
export function capitalFor(q, L, { A, a, b }) {
  return (q / (A * L ** a)) ** (1 / b);
}

// Points [{q, L, K}, ...] along the isoquant for output q, for a chart whose axes
// both run from 0 to max. The isoquant is traced only where it is inside the chart,
// from the labour input at which it needs K = max across to L = max. Further left
// K is enormous when b is small, which browsers fail to draw.
export function isoquant(q, p, max, points = 200) {
  const Lmin = (q / (p.A * max ** p.b)) ** (1 / p.a);
  if (!(Lmin < max)) return [];
  return Array.from({ length: points + 1 }, (_, i) => {
    const L = Lmin + (max - Lmin) * (i / points) ** 2; // more points where the curve is steep
    return { q, L, K: i === 0 ? max : capitalFor(q, L, p) };
  });
}

// The cheapest way to produce q when labour costs w and capital costs r per unit.
// At the minimum the isoquant is tangent to an isocost line: K / L = (b / a)(w / r).
export function minimiseCost(q, { A, a, b }, w, r) {
  const L = (q / A) ** (1 / (a + b)) * ((a * r) / (b * w)) ** (b / (a + b));
  const K = ((b * w) / (a * r)) * L;
  const labourCost = w * L;
  const capitalCost = r * K;
  return { L, K, labourCost, capitalCost, cost: labourCost + capitalCost };
}
