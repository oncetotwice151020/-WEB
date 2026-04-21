function runLogoIntro() {
  const overlay = document.getElementById("logo-intro");
  const backdrop = document.getElementById("logo-intro-backdrop");
  const introLogo = document.getElementById("logo-intro-mark");
  const introImage = introLogo?.querySelector("img");
  const navLogo = document.getElementById("nav-logo-sony");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function finishIntro() {
    document.body.classList.remove("intro-active");
    document.body.classList.add("intro-done");
    overlay?.remove();
  }

  if (!overlay || !backdrop || !introLogo || !introImage || !navLogo || !introLogo.animate || reduceMotion) {
    finishIntro();
    return;
  }

  requestAnimationFrame(() => {
    const introRect = introLogo.getBoundingClientRect();
    const navRect = navLogo.getBoundingClientRect();
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    const endX = navRect.left + navRect.width / 2;
    const endY = navRect.top + navRect.height / 2;
    const moveX = endX - startX;
    const moveY = endY - startY;
    const targetScale = Math.max(navRect.width / introRect.width, 0.12);
    const startTransform = "translate(-50%, -50%) scale(0.94)";
    const holdTransform = "translate(-50%, -50%) scale(1)";
    const endTransform = `translate(-50%, -50%) translate(${moveX}px, ${moveY}px) scale(${targetScale})`;
    const finalLogoFilter = document.body.classList.contains("home-page") ? "invert(1)" : "invert(0)";

    const introAnimation = introLogo.animate(
      [
        { opacity: 0, filter: "blur(8px)", transform: startTransform, offset: 0 },
        { opacity: 1, filter: "blur(0)", transform: holdTransform, offset: 0.28 },
        { opacity: 1, filter: "blur(0)", transform: holdTransform, offset: 0.82 },
        { opacity: 1, filter: "blur(0)", transform: endTransform, offset: 1 },
      ],
      {
        duration: 4300,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      }
    );

    backdrop.animate(
      [
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: 0.7 },
        { opacity: 0, offset: 0.82 },
        { opacity: 0, offset: 1 },
      ],
      {
        duration: 4300,
        easing: "ease",
        fill: "forwards",
      }
    );

    introImage.animate(
      [
        { filter: "invert(1)", offset: 0 },
        { filter: "invert(1)", offset: 0.82 },
        { filter: finalLogoFilter, offset: 0.96 },
        { filter: finalLogoFilter, offset: 1 },
      ],
      {
        duration: 4300,
        easing: "ease",
        fill: "forwards",
      }
    );

    introAnimation.onfinish = finishIntro;
    introAnimation.oncancel = finishIntro;
  });
}

function initHomePage() {
  const gateway = document.querySelector(".home-gateway");
  const enterPanel = document.querySelector(".home-panel-enter");
  const enterCursor = enterPanel?.querySelector(".home-enter-cursor");
  const scrollCue = document.querySelector(".scroll-cue");

  if (!document.body.classList.contains("home-page") || !gateway || !enterPanel) {
    return;
  }

  let isPaging = false;
  const canFollowPointer =
    enterCursor &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointerTarget = { x: 50, y: 50 };
  const pointerCurrent = { x: 50, y: 50 };
  let pointerFrame = 0;

  function setEnterReveal() {
    const rawProgress = gateway.scrollTop / Math.max(gateway.clientHeight, 1);
    const normalized = Math.min(Math.max((rawProgress - 0.08) / 0.78, 0), 1);
    const easedProgress = normalized * normalized * (3 - 2 * normalized);
    const shouldReveal = rawProgress >= 0.45;

    gateway.style.setProperty("--enter-progress", easedProgress.toFixed(3));
    document.body.classList.toggle("enter-revealed", shouldReveal);
  }

  function goToPanel(panel) {
    if (isPaging) return;
    isPaging = true;
    gateway.scrollTo({
      top: panel === "enter" ? gateway.clientHeight : 0,
      behavior: "smooth",
    });
    window.setTimeout(() => {
      isPaging = false;
      setEnterReveal();
    }, 760);
  }

  function setEnterPosition(x, y) {
    enterPanel.style.setProperty("--enter-x", `${x}%`);
    enterPanel.style.setProperty("--enter-y", `${y}%`);
    enterPanel.style.setProperty("--enter-warp-x", ((x - 50) / 50).toFixed(3));
    enterPanel.style.setProperty("--enter-warp-y", ((y - 50) / 50).toFixed(3));
  }

  function updatePointerFollow() {
    pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.18;
    pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.18;
    setEnterPosition(pointerCurrent.x, pointerCurrent.y);

    if (
      Math.abs(pointerTarget.x - pointerCurrent.x) > 0.05 ||
      Math.abs(pointerTarget.y - pointerCurrent.y) > 0.05
    ) {
      pointerFrame = window.requestAnimationFrame(updatePointerFollow);
    } else {
      pointerFrame = 0;
    }
  }

  function queuePointerFollow() {
    if (!pointerFrame) {
      pointerFrame = window.requestAnimationFrame(updatePointerFollow);
    }
  }

  scrollCue?.addEventListener("click", () => goToPanel("enter"));

  if (canFollowPointer) {
    enterPanel.addEventListener("pointermove", (event) => {
      const rect = enterPanel.getBoundingClientRect();
      const cursorWidth = enterCursor.offsetWidth || 240;
      const cursorHeight = enterCursor.offsetHeight || 240;
      const marginX = Math.min(Math.max((cursorWidth / rect.width) * 50 + 4, 8), 28);
      const marginY = Math.min(Math.max((cursorHeight / rect.height) * 50 + 5, 10), 28);
      const rawX = ((event.clientX - rect.left) / rect.width) * 100;
      const rawY = ((event.clientY - rect.top) / rect.height) * 100;

      pointerTarget.x = Math.min(Math.max(rawX, marginX), 100 - marginX);
      pointerTarget.y = Math.min(Math.max(rawY, marginY), 100 - marginY);
      queuePointerFollow();
    });

    enterPanel.addEventListener("pointerleave", () => {
      pointerTarget.x = 50;
      pointerTarget.y = 50;
      queuePointerFollow();
    });
  }

  gateway.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) < 12) return;
      event.preventDefault();
      goToPanel(event.deltaY > 0 ? "enter" : "hero");
    },
    { passive: false }
  );

  gateway.addEventListener("scroll", setEnterReveal);
  setEnterReveal();
}

function initSearchTransitionLink() {
  const searchEntry = document.querySelector("[data-enter-search]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!document.body.classList.contains("home-page") || !searchEntry) {
    return;
  }

  const searchHref = new URL(searchEntry.dataset.searchUrl || "search.html", window.location.href).href;

  function enterSearch(event) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();

    try {
      sessionStorage.setItem("sonySearchTransition", "1");
    } catch (error) {}

    if (reduceMotion) {
      window.location.href = searchHref;
      return;
    }

    document.body.classList.add("is-transitioning");

    const transition = document.createElement("div");
    transition.className = "page-transition";
    transition.setAttribute("aria-hidden", "true");

    document.body.appendChild(transition);
    window.requestAnimationFrame(() => transition.classList.add("is-active"));
    window.setTimeout(() => {
      window.location.href = searchHref;
    }, 680);
  }

  searchEntry.addEventListener("click", enterSearch);
  searchEntry.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      enterSearch(event);
    }
  });
}

runLogoIntro();
initHomePage();
initSearchTransitionLink();
