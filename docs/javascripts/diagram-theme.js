(() => {
  const selector = "iframe.schematic-frame";
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function selectedScheme() {
    const selected = document.body?.getAttribute("data-md-color-scheme")
      ?? document.documentElement.getAttribute("data-md-color-scheme");
    if (selected === "slate") return "dark";
    if (selected === "default") return "light";
    return systemDark.matches ? "dark" : "light";
  }

  function applyScheme(frame) {
    try {
      frame.contentWindow?.postMessage(
        {type: "preparation-kit:diagram-theme", scheme: selectedScheme()},
        "*",
      );
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
    if (document.body?.dataset.diagramThemeWatching !== "true") {
      document.body.dataset.diagramThemeWatching = "true";
      systemDark.addEventListener("change", syncDiagrams);
      document.addEventListener("click", (event) => {
        if (event.target.closest('[data-md-component="palette"] label')) {
          requestAnimationFrame(syncDiagrams);
        }
      });
    }
    syncDiagrams();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, {once: true});
  } else {
    initialize();
  }
})();
