(() => {
  const toggle = document.getElementById("magic-toggle");
  const chamber = document.getElementById("chamber-enter");
  const snitch = document.getElementById("snitch-toggle");
  const owl = document.getElementById("owl-post");
  const trail = document.getElementById("spell-trail");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const systemMotion = document.getElementById("motion-system");
  const motionStatus = document.getElementById("motion-status");
  const motionKey = "hm-portfolio-motion";
  let forceMotion = false;
  try {
    forceMotion = localStorage.getItem(motionKey) === "enabled";
  } catch (error) {
    console.warn("Animation preference could not be read.", error);
    motionStatus.textContent =
      "Browser storage is unavailable. Animation choices will apply only to this tab.";
    motionStatus.hidden = false;
  }

  function motionReduced() {
    return reducedMotion.matches && !forceMotion;
  }

  function rememberMotion() {
    try {
      if (forceMotion) localStorage.setItem(motionKey, "enabled");
      else localStorage.removeItem(motionKey);
      motionStatus.hidden = true;
    } catch (error) {
      console.warn("Animation preference could not be saved.", error);
      motionStatus.textContent =
        "Animation choice applies to this tab, but could not be saved in browser storage.";
      motionStatus.hidden = false;
    }
  }
  let userPaused = false;
  let lastSpark = 0;
  let sparkIndex = 0;
  let chaseAnimations = [];
  let resizeTimer;
  const scrollOwl = document.createElement("div");
  scrollOwl.className = "scroll-hedwig";
  scrollOwl.setAttribute("aria-hidden", "true");
  scrollOwl.append(
    document.getElementById("snowy-owl-art").content.cloneNode(true)
  );
  document.body.append(scrollOwl);
  let owlFrame;
  let landingTimer;
  let lastScroll = window.scrollY;
  let owlX = 24;

  function owlEnabled() {
    return !userPaused && !motionReduced() && !document.hidden;
  }

  function positionOwl(x, y) {
    owlX = x;
    scrollOwl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function landOwl() {
    if (!owlEnabled()) return;
    const size = scrollOwl.getBoundingClientRect();
    const box = toggle.getBoundingClientRect();
    const x = Math.max(
      8,
      Math.min(
        window.innerWidth - size.width - 8,
        box.left + box.width / 2 - size.width / 2
      )
    );
    const y = Math.max(
      window.scrollY + 82,
      window.scrollY + box.top - size.height * (132 / 140)
    );
    scrollOwl.dataset.perch = "magic-toggle";
    const destination = `translate3d(${x}px, ${y}px, 0)`;
    if (
      scrollOwl.classList.contains("owl-flying") &&
      scrollOwl.style.transform !== destination
    ) {
      scrollOwl.dataset.state = "landing";
    } else {
      scrollOwl.dataset.state = "perched";
      scrollOwl.classList.remove("owl-flying");
    }
    positionOwl(x, y);
  }

  function syncScrollOwl() {
    scrollOwl.hidden = !owlEnabled();
    if (!owlEnabled()) {
      clearTimeout(landingTimer);
      cancelAnimationFrame(owlFrame);
      owlFrame = null;
      scrollOwl.classList.remove("owl-flying");
    } else landOwl();
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!owlEnabled()) return;
      clearTimeout(landingTimer);
      if (!owlFrame)
        owlFrame = requestAnimationFrame(() => {
          owlFrame = null;
          const direction = window.scrollY >= lastScroll ? 1 : -1;
          lastScroll = window.scrollY;
          scrollOwl.classList.add("owl-flying");
          delete scrollOwl.dataset.perch;
          const size = scrollOwl.getBoundingClientRect();
          const x = Math.max(
            8,
            Math.min(window.innerWidth - size.width - 8, owlX)
          );
          scrollOwl.dataset.state = "flying";
          positionOwl(
            x,
            window.scrollY + window.innerHeight * (direction > 0 ? 0.38 : 0.43)
          );
        });
      landingTimer = setTimeout(landOwl, 320);
    },
    { passive: true }
  );
  scrollOwl.addEventListener("transitionend", (event) => {
    if (
      event.target === scrollOwl &&
      event.propertyName === "transform" &&
      scrollOwl.dataset.state === "landing"
    ) {
      scrollOwl.dataset.state = "perched";
      scrollOwl.classList.remove("owl-flying");
    }
  });
  window.addEventListener("resize", () => {
    clearTimeout(landingTimer);
    landingTimer = setTimeout(landOwl, 180);
  });
  const chaseDuration = 22000;
  const chaseLead = 950;
  const chaseSprites = [
    document.querySelector(".snitch-flight"),
    document.querySelector(".wizard-flight"),
  ];
  const chaseRoute = [
    [0.08, 0.26],
    [0.4, 0.17],
    [0.84, 0.3],
    [0.7, 0.58],
    [0.36, 0.42],
    [0.57, 0.24],
    [0.91, 0.18],
    [0.78, 0.5],
    [0.53, 0.64],
    [0.24, 0.51],
    [0.1, 0.66],
    [0.33, 0.32],
    [0.64, 0.43],
    [0.44, 0.16],
    [0.08, 0.26],
  ];

  function flightFrames(sprite) {
    const frames = [];
    const width = window.innerWidth;
    const height = window.innerHeight;
    const box = sprite.getBoundingClientRect();
    let previousPose;
    chaseRoute.forEach(([x, y], index) => {
      const next = chaseRoute[(index + 1) % (chaseRoute.length - 1)];
      const direction = next[0] >= x ? 1 : -1;
      const slope = Math.atan2(
        (next[1] - y) * height,
        Math.abs(next[0] - x) * width
      );
      const angle = Math.max(
        -22,
        Math.min(22, ((slope * 180) / Math.PI) * direction)
      );
      const pose = `rotate(${angle}deg) scaleX(${direction})`;
      const position = `translate3d(${x * width - box.width / 2}px, ${
        y * height - box.height / 2
      }px, 0)`;
      const offset = index / (chaseRoute.length - 1);
      if (index && index < chaseRoute.length - 1) {
        frames.push({
          transform: `${position} ${previousPose}`,
          opacity: 1,
          offset,
          easing: "steps(1, end)",
        });
      }
      frames.push({
        transform: `${position} ${pose}`,
        opacity: 1,
        offset: offset + (index && index < chaseRoute.length - 1 ? 0.005 : 0),
        easing: "cubic-bezier(.35, 0, .3, 1)",
      });
      previousPose = pose;
    });
    return frames;
  }

  function buildChase() {
    const phase = chaseAnimations[0]?.currentTime ?? 1800;
    chaseAnimations.forEach((animation) => animation.cancel());
    chaseAnimations = chaseSprites.map((sprite, index) => {
      const animation = sprite.animate(flightFrames(sprite), {
        duration: chaseDuration,
        iterations: Infinity,
        fill: "both",
      });
      animation.currentTime =
        (Number(phase) - index * chaseLead + chaseDuration) % chaseDuration;
      return animation;
    });
  }

  function syncChase(paused) {
    if (motionReduced()) {
      chaseAnimations.forEach((animation) => animation.cancel());
      chaseAnimations = [];
      return;
    }
    if (!chaseAnimations.length) buildChase();
    chaseAnimations.forEach((animation) =>
      paused ? animation.pause() : animation.play()
    );
  }

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.AOS) window.AOS.refresh();
      if (motionReduced()) return;
      buildChase();
      syncChase(userPaused || document.hidden);
    }, 120);
  });
  for (const [template, target] of [
    ["chamber-art", "chamber-scene"],
    ["cup-art", "cup-scene"],
  ]) {
    document
      .getElementById(target)
      .append(document.getElementById(template).content.cloneNode(true));
  }
  const sparks = Array.from({ length: 16 }, () => {
    const spark = document.createElement("span");
    spark.className = "spell-spark";
    trail.append(spark);
    return spark;
  });

  function updateMotion() {
    if (forceMotion) document.documentElement.dataset.motion = "on";
    else delete document.documentElement.dataset.motion;
    const paused = userPaused || motionReduced() || document.hidden;
    document.documentElement.classList.toggle("magic-paused", paused);
    toggle.setAttribute("aria-pressed", String(userPaused));
    toggle.textContent = motionReduced()
      ? "Enable animations anyway"
      : userPaused
      ? "Resume magic"
      : "Pause magic";
    toggle.hidden = false;
    systemMotion.hidden = !forceMotion;
    syncChase(paused);
    syncScrollOwl();
    document.dispatchEvent(new Event("portfolio-motion-change"));
    if (paused)
      sparks.forEach((spark) =>
        spark.getAnimations().forEach((animation) => animation.cancel())
      );
  }

  toggle.addEventListener("click", () => {
    if (motionReduced()) {
      forceMotion = true;
      userPaused = false;
      rememberMotion();
    } else userPaused = !userPaused;
    updateMotion();
  });
  systemMotion.addEventListener("click", () => {
    forceMotion = false;
    userPaused = false;
    rememberMotion();
    updateMotion();
  });
  reducedMotion.addEventListener("change", updateMotion);
  document.addEventListener("visibilitychange", updateMotion);
  updateMotion();

  document.addEventListener(
    "pointermove",
    (event) => {
      if (
        event.pointerType !== "mouse" ||
        motionReduced() ||
        userPaused ||
        document.hidden ||
        event.timeStamp - lastSpark < 65
      )
        return;
      lastSpark = event.timeStamp;
      const spark = sparks[sparkIndex++ % sparks.length];
      spark.getAnimations().forEach((animation) => animation.cancel());
      spark.animate(
        [
          {
            transform: `translate(${event.clientX}px, ${event.clientY}px) scale(1) rotate(0deg)`,
            opacity: 0.8,
          },
          {
            transform: `translate(${event.clientX - 10}px, ${
              event.clientY - 28
            }px) scale(0) rotate(100deg)`,
            opacity: 0,
          },
        ],
        { duration: 750, easing: "ease-out" }
      );
    },
    { passive: true }
  );

  function openProjectArchive() {
    document.getElementById("projects").classList.add("chamber-open");
    document
      .getElementById("chamber-scene")
      .setAttribute(
        "aria-label",
        "An open serpent-guarded entrance to the project archive"
      );
  }
  chamber.addEventListener("click", () => {
    openProjectArchive();
    document.getElementById("project-spellbook").focus({ preventScroll: true });
  });
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", openProjectArchive);
  });

  snitch.hidden = false;
  snitch.addEventListener("click", () => {
    const caught = snitch.getAttribute("aria-pressed") !== "true";
    snitch.setAttribute("aria-pressed", String(caught));
    snitch.setAttribute(
      "aria-label",
      caught ? "Release the golden snitch" : "Catch the golden snitch"
    );
    document.getElementById("skills").classList.toggle("snitch-caught", caught);
    document.getElementById("snitch-label").textContent = caught
      ? "Caught! Release the snitch"
      : "Catch the snitch";
  });

  owl.hidden = false;
  owl.addEventListener("click", () => {
    document.getElementById("contact").classList.add("letter-ready");
    document.querySelector('#contactForm [name="name"]').focus();
  });

  const chapters = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("chapter-awake", entry.isIntersecting);
        if (entry.target.id === "achievements")
          entry.target.classList.toggle("cup-summoned", entry.isIntersecting);
      }
    },
    { threshold: 0 }
  );
  document
    .querySelectorAll(".magic-chapter")
    .forEach((section) => chapters.observe(section));

  const chapterLinks = [...document.querySelectorAll(".chapter-rail a")];
  const chapterPosition = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of chapterLinks) {
          if (link.hash === `#${entry.target.id}`)
            link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        }
      }
    },
    { rootMargin: "-20% 0px -65% 0px" }
  );
  document
    .querySelectorAll(".hero, .magic-chapter")
    .forEach((section) => chapterPosition.observe(section));
})();
