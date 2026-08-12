(() => {
  const selector = "iframe.schematic-frame";
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  let observer;

  function selectedScheme() {
    const selected = document.body?.getAttribute("data-md-color-scheme")
      ?? document.documentElement.getAttribute("data-md-color-scheme");
    if (selected === "slate") return "dark";
    if (selected === "default") return "light";
    return systemDark.matches ? "dark" : "light";
  }

  function applyScheme(frame) {
    try {
      const root = frame.contentDocument?.documentElement;
      if (root) root.setAttribute("data-color-scheme", selectedScheme());
    } catch {
      // Cross-origin embeds keep their own prefers-color-scheme fallback.
    }
  }

  function bindFrame(frame) {
    if (frame.dataset.diagramThemeBound !== "true") {
      frame.dataset.diagramThemeBound = "true";
      frame.addEventListener("load", () => applyScheme(frame));
    }
    applyScheme(frame);
  }

  function syncDiagrams() {
    document.querySelectorAll(selector).forEach(bindFrame);
  }

  function initialize() {
    if (!observer) {
      observer = new MutationObserver(syncDiagrams);
      observer.observe(document.body ?? document.documentElement, {
        attributes: true,
        attributeFilter: ["data-md-color-scheme"],
      });
      systemDark.addEventListener("change", syncDiagrams);
    }
    syncDiagrams();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(initialize);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, {once: true});
  } else {
    initialize();
  }
})();
