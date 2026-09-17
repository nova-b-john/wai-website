(function initWaiHeroAnimation() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const visual = hero.querySelector(".hero-visual");
  const inPath = hero.querySelector(".wai-flow-in textPath");
  const inText = hero.querySelector(".wai-flow-in");
  const bars = [...hero.querySelectorAll(".wai-wave span")];
  const actB = hero.querySelector('.wai-act[data-act="b"]');
  if (!visual || !inPath || !bars.length) return;

  const phases = bars.map((_, i) => ({
    a: 0.35 + i * 0.37,
    b: 1.1 + i * 0.19,
    c: 0.07 + (i % 5) * 0.03,
  }));

  const timeline = [
    { name: "listen", ms: 3800 },
    { name: "think", ms: 1800 },
    { name: "act", ms: 2600 },
    { name: "respond", ms: 2200 },
  ];

  const total = timeline.reduce((sum, step) => sum + step.ms, 0);
  const startedAt = performance.now();
  let raf = 0;

  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const lerp = (a, b, t) => a + (b - a) * t;

  function at(now) {
    const elapsed = (now - startedAt) % total;
    let cursor = 0;
    for (const step of timeline) {
      if (elapsed < cursor + step.ms) {
        return { name: step.name, t: (elapsed - cursor) / step.ms, elapsed };
      }
      cursor += step.ms;
    }
    return { name: "listen", t: 0, elapsed: 0 };
  }

  function setState(name) {
    if (visual.dataset.state !== name) visual.dataset.state = name;
  }

  function waveAmp(state, t) {
    if (state === "listen") return lerp(0.72, 1, 0.5 + 0.5 * Math.sin(t * Math.PI));
    if (state === "think") return lerp(0.85, 0.22, easeInOut(t));
    if (state === "act") return 0.28 + 0.08 * Math.sin(t * Math.PI);
    return lerp(0.3, 0.95, easeInOut(t));
  }

  function tick(now) {
    const { name, t } = at(now);
    setState(name);

    // Continuous ribbon scroll, Wispr-style: text keeps drifting along the curve.
    const loopMs = 14000;
    const progress = ((now - startedAt) % loopMs) / loopMs;
    inPath.setAttribute("startOffset", `${lerp(-55, 105, progress)}%`);
    inText.style.opacity = "1";
    visual.dataset.flow = "stream";

    if (name === "act" && t > 0.38) actB?.classList.add("is-on");
    else actB?.classList.remove("is-on");

    const amp = waveAmp(name, t);
    const clock = now / 1000;
    bars.forEach((bar, i) => {
      const p = phases[i];
      const organic =
        0.52 +
        0.28 * Math.sin(clock * (2.1 + p.c * 8) + p.a) +
        0.2 * Math.sin(clock * (3.4 + p.c * 5) + p.b);
      const midBoost = 1 - Math.abs(i - 5) / 9;
      const height = clamp((22 + organic * 58 * amp) * (0.62 + midBoost * 0.55), 16, 88);
      bar.style.height = `${height}%`;
    });

    raf = requestAnimationFrame(tick);
  }

  window.addEventListener("pagehide", () => cancelAnimationFrame(raf), { once: true });
  raf = requestAnimationFrame(tick);
})();
