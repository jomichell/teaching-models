# Solow growth model with Cobb-Douglas technology, in discrete time:
#   Y = A K^alpha (E L)^(1 - alpha)
# A is a constant level of productivity and E is the efficiency of labour, which
# grows at rate g. k is capital per effective worker, K / (E L); output per
# effective worker is y = A k^alpha. With g = 0 this is the model with constant
# technology, and k is capital per worker.
#
# Run as a script to plot the transition path:  Rscript solow/solow.R

solow_params <- function(s = 0.25,      # investment rate (the textbook "saving rate")
                         alpha = 0.33,  # capital share
                         delta = 0.05,  # depreciation rate
                         n = 0.01,      # population growth
                         g = 0.02,      # growth of labour efficiency
                         A = 1) {       # constant level of productivity
  list(s = s, alpha = alpha, delta = delta, n = n, g = g, A = A)
}

output <- function(k, p) p$A * k^p$alpha

# Investment per effective worker needed to keep k constant.
break_even <- function(k, p) (p$delta + p$n + p$g + p$n * p$g) * k

steady_state <- function(p) {
  (p$s * p$A / (p$delta + p$n + p$g + p$n * p$g))^(1 / (1 - p$alpha))
}

step <- function(k, p) {
  (p$s * output(k, p) + (1 - p$delta) * k) / ((1 + p$n) * (1 + p$g))
}

# Returns a data frame with columns t, k, y, c, i for t = 0..periods.
simulate <- function(k0, p = solow_params(), periods = 100) {
  k <- numeric(periods + 1)
  k[1] <- k0
  for (t in seq_len(periods)) k[t + 1] <- step(k[t], p)
  y <- output(k, p)
  data.frame(t = 0:periods, k = k, y = y, c = (1 - p$s) * y, i = p$s * y)
}

if (sys.nframe() == 0) {
  library(ggplot2)

  p <- solow_params()
  k_star <- steady_state(p)
  path <- simulate(k0 = 0.1 * k_star, p = p)

  plot <- ggplot(path, aes(t, k)) +
    geom_line() +
    geom_hline(yintercept = k_star, linetype = "dotted", colour = "grey40") +
    labs(title = "Solow model: transition path", x = "t", y = "k") +
    theme_minimal()

  ggsave("solow/solow_transition.png", plot, width = 6, height = 4)
  message("Saved solow/solow_transition.png")
}
