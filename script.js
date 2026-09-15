const capabilities = {
  "01": {
    title: "Inbound & outbound calls",
    body: "Answer and place calls around the clock with a consistent voice.",
    visual: `
      <div class="mock mock-call">
        <div class="mock-top"><span class="mock-dot"></span>Incoming · Malayalam</div>
        <p class="mock-name">Reception line</p>
        <p class="mock-sub">Answered in &lt; 500ms</p>
        <div class="wave wave-lg">
          <span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span>
        </div>
      </div>`,
  },
  "02": {
    title: "Call recording & downloads",
    body: "Keep every conversation for training, QA, and compliance.",
    visual: `
      <div class="mock">
        <div class="mock-top">Recording ready</div>
        <p class="mock-name">Call recording</p>
        <p class="mock-sub">Keep every conversation for training, QA, and compliance</p>
        <div class="mock-kb" style="margin-top:1.1rem">
          <span>Audio archive</span>
          <span>Export transcript</span>
        </div>
      </div>`,
  },
  "03": {
    title: "Live transcripts",
    body: "See what was said in real time — useful for coaching and handoffs.",
    visual: `
      <div class="mock">
        <div class="mock-top">Live transcript</div>
        <div class="mock-lines">
          <div class="mock-line accent"></div>
          <div class="mock-line"></div>
          <div class="mock-line"></div>
        </div>
        <p class="mock-sub" style="margin-top:1rem">Streaming as the call happens</p>
      </div>`,
  },
  "04": {
    title: "Analytics dashboard",
    body: "Volume, outcomes, and trends in one place your team can act on.",
    visual: `
      <div class="mock">
        <div class="mock-top">Volume · Outcomes · Trends</div>
        <div class="mock-bars">
          <i style="height:46%"></i>
          <i style="height:68%"></i>
          <i style="height:38%"></i>
          <i style="height:84%"></i>
          <i style="height:60%"></i>
          <i style="height:72%"></i>
        </div>
      </div>`,
  },
  "05": {
    title: "Knowledge base",
    body: "Ground answers in your products, policies, and FAQs.",
    visual: `
      <div class="mock">
        <div class="mock-top">Grounded answers</div>
        <div class="mock-kb" style="margin-top:1rem">
          <span>Products</span>
          <span>Policies</span>
          <span>FAQs</span>
        </div>
      </div>`,
  },
  "06": {
    title: "Human transfer",
    body: "Escalate to a person when the caller needs a specialist.",
    visual: `
      <div class="mock">
        <div class="mock-top"><span class="mock-dot"></span>Handoff</div>
        <p class="mock-name">Transfer to specialist</p>
        <p class="mock-sub">Escalate to a person when the caller needs a specialist</p>
      </div>`,
  },
  "07": {
    title: "English & Malayalam",
    body: "Speak the languages your customers already use.",
    visual: `
      <div class="mock">
        <div class="mock-top">Languages</div>
        <p class="mock-name">English · Malayalam</p>
        <p class="mock-sub">The languages your customers already use</p>
      </div>`,
  },
  "08": {
    title: "Secure cloud",
    body: "Hosted on Indian infrastructure with careful access defaults.",
    visual: `
      <div class="mock">
        <div class="mock-top">India hosted</div>
        <p class="mock-name">Secure cloud</p>
        <p class="mock-sub">Indian infrastructure · careful access defaults</p>
      </div>`,
  },
};

document.documentElement.classList.add("js");

function revealAll(scope) {
  (scope || document).querySelectorAll(".reveal").forEach((node) => {
    node.classList.add("is-in");
  });
}

function initReveal() {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealAll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
  );

  nodes.forEach((node) => observer.observe(node));

  const hashTarget = location.hash && document.querySelector(location.hash);
  if (hashTarget) revealAll(hashTarget);

  window.addEventListener("hashchange", () => {
    const target = location.hash && document.querySelector(location.hash);
    if (target) revealAll(target);
  });
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const header = document.querySelector(".site-header");
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });

  window.addEventListener("scroll", () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  });
}

function setCapability(id, { animate = true } = {}) {
  const data = capabilities[id];
  const panel = document.getElementById("cap-panel");
  if (!data || !panel) return;
  if (panel.dataset.cap === id) return;
  panel.dataset.cap = id;

  const apply = () => {
    panel.setAttribute("aria-labelledby", `tab-${id}`);
    panel.querySelector(".panel-eyebrow").textContent = id;
    panel.querySelector(".panel-title").textContent = data.title;
    panel.querySelector(".panel-body").textContent = data.body;
    panel.querySelector(".panel-visual").innerHTML = data.visual;
    panel.classList.remove("is-leaving");
    panel.classList.add("is-in");
  };

  document.querySelectorAll(".capability-tab").forEach((tab) => {
    const active = tab.dataset.cap === id;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  window.clearTimeout(setCapability.timer);

  if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply();
    return;
  }

  panel.classList.add("is-leaving");
  panel.classList.remove("is-in");
  setCapability.timer = window.setTimeout(apply, 180);
}

function initCapabilities() {
  const tabs = [...document.querySelectorAll(".capability-tab")];
  const stage = document.querySelector(".capability-stage");
  const pin = document.querySelector(".capability-pin");
  const panel = document.getElementById("cap-panel");
  if (!tabs.length || !stage || !panel) return;

  panel.dataset.cap = "01";
  let ticking = false;
  let index = 0;
  let timer;
  let paused = false;
  let inView = false;
  let lastScrollAt = 0;

  const desktop = () => window.matchMedia("(min-width: 980px)").matches;

  const navPx = () => {
    const styles = getComputedStyle(document.documentElement);
    const nav = parseFloat(styles.getPropertyValue("--nav-h")) || 4.4;
    const fs = parseFloat(styles.fontSize) || 16;
    return nav * fs;
  };

  const activateFromScroll = () => {
    if (!desktop() || !pin) return;

    const pinRect = pin.getBoundingClientRect();
    const start = navPx();
    const travel = Math.max(1, pin.offsetHeight - (window.innerHeight - start));
    const progress = Math.min(0.999, Math.max(0, (start - pinRect.top) / travel));
    const next = Math.min(tabs.length - 1, Math.floor(progress * tabs.length));
    index = next;
    setCapability(tabs[next].dataset.cap, { animate: false });
  };

  const stop = () => window.clearInterval(timer);

  const play = () => {
    if (paused || !inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stop();
    timer = window.setInterval(() => {
      if (paused || !inView) return;
      if (performance.now() - lastScrollAt < 1600) return;
      index = (index + 1) % tabs.length;
      setCapability(tabs[index].dataset.cap);
    }, 3800);
  };

  const onScroll = () => {
    lastScrollAt = performance.now();
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      try {
        activateFromScroll();
      } finally {
        ticking = false;
      }
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("scroll", onScroll, { passive: true, capture: true });
  window.addEventListener("resize", activateFromScroll);

  const io = new IntersectionObserver(
    ([entry]) => {
      inView = Boolean(entry && entry.isIntersecting);
      if (inView) play();
      else stop();
    },
    { threshold: 0.2 }
  );
  io.observe(stage);

  activateFromScroll();

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      index = i;
      paused = true;
      stop();
      setCapability(tab.dataset.cap);
      if (desktop() && pin) {
        const start = navPx();
        const travel = Math.max(1, pin.offsetHeight - (window.innerHeight - start));
        const pinY = pin.getBoundingClientRect().top + window.scrollY;
        const top = pinY - start + ((i + 0.08) / tabs.length) * travel;
        const html = document.documentElement;
        const prev = html.style.scrollBehavior;
        html.style.scrollBehavior = "auto";
        html.scrollTop = top;
        html.style.scrollBehavior = prev;
        lastScrollAt = performance.now();
        activateFromScroll();
      }
    });
    tab.addEventListener("keydown", (event) => {
      const current = tabs.indexOf(tab);
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        tabs[(current + 1) % tabs.length].focus();
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        tabs[(current - 1 + tabs.length) % tabs.length].focus();
      }
    });
  });

  stage.addEventListener("mouseenter", () => {
    paused = true;
    stop();
  });
  stage.addEventListener("mouseleave", () => {
    paused = false;
    play();
  });
  stage.addEventListener("focusin", () => {
    paused = true;
    stop();
  });
  stage.addEventListener("focusout", (event) => {
    if (stage.contains(event.relatedTarget)) return;
    paused = false;
    play();
  });
}

function initHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  requestAnimationFrame(() => hero.classList.add("is-ready"));
}

initHero();
initReveal();
initNav();
initCapabilities();
