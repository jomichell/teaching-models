// Play/pause control with a slider, for stepping through time in animations.
// Use in a Quarto page as:  viewof t = scrubber(100)
// The value is an integer in 0..max, starting at `value`; playback stops at the end.

export function scrubber(max, { value = 0, delay = 80, label = "t", autoplay = false } = {}) {
  const form = document.createElement("form");
  form.style.cssText = "display:flex; align-items:center; gap:0.6em; font: 13px var(--bs-font-sans-serif, sans-serif);";

  const button = document.createElement("button");
  button.type = "button";
  button.style.width = "5em";

  const range = document.createElement("input");
  range.type = "range";
  range.min = 0;
  range.max = max;
  range.step = 1;
  range.value = 0;
  range.style.flex = "1";
  range.style.maxWidth = "360px";

  const readout = document.createElement("output");
  readout.style.minWidth = "5em";

  form.append(button, range, readout);

  let timer = null;

  function set(value, notify = true) {
    range.value = value;
    form.value = range.valueAsNumber;
    readout.textContent = `${label} = ${form.value}`;
    if (notify) form.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function stop() {
    clearInterval(timer);
    timer = null;
    button.textContent = "Play";
  }

  function start() {
    if (form.value >= max) set(0);
    button.textContent = "Pause";
    timer = setInterval(() => {
      if (!form.isConnected) return stop();
      set(form.value + 1);
      if (form.value >= max) stop();
    }, delay);
  }

  button.onclick = () => (timer ? stop() : start());
  range.oninput = (event) => {
    event.stopPropagation();
    stop();
    set(range.valueAsNumber);
  };

  set(value, false);
  button.textContent = "Play";
  if (autoplay) start();
  return form;
}
