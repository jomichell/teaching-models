# teaching-models

Simulation models for teaching economics, implemented in Python, R and
JavaScript, with interactive pages built as a [Quarto](https://quarto.org) website.

The site is published at <https://jomichell.github.io/teaching-models/>. It is
rebuilt and deployed by GitHub Actions on every push to `main`.

## Layout

```
_quarto.yml      website configuration
index.qmd        site home page
styles.css       shared page styles (e.g. the controls-beside-output layout)
pyproject.toml   Python dependencies (managed with uv)
js/              JavaScript helpers shared between pages (e.g. the play/pause scrubber)
solow/           one directory per model
  index.qmd      interactive page (Observable JS)
  shock.qmd      the same page with a shock to the investment rate
  _*.qmd         controls, state and charts shared by the two pages
  solow.js       JavaScript implementation, imported by the page
  solow.py       Python implementation
  solow.R        R implementation
```

Models don't need to be written in every language: use Python or R for
prototyping, and a Quarto page (with the model in JavaScript) for anything
interactive. The Solow model happens to have all three.

## Usage

```sh
quarto preview              # serve the website locally
quarto render               # build the website into _site/

uv run solow/solow.py       # Python: plot the Solow diagram and transition path
Rscript solow/solow.R       # R: save the transition path plot (needs ggplot2)
```

## Adding a model

1. Create a directory `<model>/` with the prototype and, for an interactive page, an `index.qmd`.
2. Add the page to the navbar menu in `_quarto.yml` and the list in `index.qmd`.
