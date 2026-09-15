(function initWaiHeroAnimation() {
  const root = document.querySelector(".wai-hero-anim");
  const hero = document.querySelector(".hero");
  if (!root || !hero) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const inPath = root.querySelector(".wai-flow-in textPath");
  const outPath = root.querySelector(".wai-flow-out textPath");
  const outText = root.querySelector(".wai-flow-out");
  const bars = [...hero.querySelectorAll(".wai-wave span")];
  const actB = hero.querySelector('.wai-act[data-act="b"]');
  if (!inPath || !outPath || !bars.length) return;

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
  let startedAt = performance.now();
  let running = true;
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
    if (root.dataset.state !== name) root.dataset.state = name;
  }

  function waveAmp(state, t) {
    if (state === "listen") return lerp(0.72, 1, 0.5 + 0.5 * Math.sin(t * Math.PI));
    if (state === "think") return lerp(0.85, 0.22, easeInOut(t));
    if (state === "act") return 0.28 + 0.08 * Math.sin(t * Math.PI);
    return lerp(0.3, 0.95, easeInOut(t));
  }

  function tick(now) {
    if (!running) {
      raf = requestAnimationFrame(tick);
      return;
    }

    const { name, t } = at(now);
    setState(name);

    if (name === "listen") {
      inPath.setAttribute("startOffset", `${lerp(-6, 18, easeInOut(t))}%`);
      inPath.parentElement.style.opacity = t > 0.9 ? String(1 - (t - 0.9) / 0.1) : "1";
      outText.style.opacity = "0";
      actB.classList.remove("is-on");
    } else if (name === "think") {
      inPath.setAttribute("startOffset", `${lerp(18, 42, easeInOut(t))}%`);
      inPath.parentElement.style.opacity = String(1 - easeInOut(t));
      outText.style.opacity = "0";
      actB.classList.remove("is-on");
    } else if (name === "act") {
      inPath.parentElement.style.opacity = "0";
      outText.style.opacity = "0";
      if (t > 0.38) actB.classList.add("is-on");
    } else {
      inPath.parentElement.style.opacity = "0";
      actB.classList.remove("is-on");
      outPath.setAttribute("startOffset", `${lerp(38, 96, easeInOut(t))}%`);
      const fadeIn = clamp(t / 0.14, 0, 1);
      const fadeOut = t > 0.78 ? 1 - (t - 0.78) / 0.22 : 1;
      outText.style.opacity = String(fadeIn * fadeOut);
    }

    const amp = waveAmp(name, t);
    const clock = now / 1000;
    bars.forEach((bar, i) => {
      const p = phases[i];
      const organic =
        0.52 +
        0.28 * Math.sin(clock * (2.1 + p.c * 8) + p.a) +
        0.2 * Math.sin(clock * (3.4 + p.c * 5) + p.b);
      const midBoost = 1 - Math.abs(i - 5) / 9;
      const height = clamp((18 + organic * 70 * amp) * (0.72 + midBoost * 0.4), 12, 92);
      bar.style.height = `${height}%`;
    });

    raf = requestAnimationFrame(tick);
  }

  function onVisibility() {
    running = !document.hidden;
  }

  document.addEventListener("visibilitychange", onVisibility);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        running = entries.some((entry) => entry.isIntersecting) && !document.hidden;
      },
      { threshold: 0.12 }
    );
    observer.observe(hero);
  }

  window.addEventListener("pagehide", () => cancelAnimationFrame(raf), { once: true });
  raf = requestAnimationFrame(tick);
})();
