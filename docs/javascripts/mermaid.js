(function () {
  "use strict";

  function colorScheme() {
    return document.body.getAttribute("data-md-color-scheme") === "slate"
      ? "dark"
      : "default";
  }

  function renderMermaid() {
    if (!window.mermaid) return;

    const diagrams = document.querySelectorAll(".mermaid:not([data-processed])");
    if (!diagrams.length) return;

    window.mermaid.initialize({
      startOnLoad: false,
      theme: colorScheme(),
      securityLevel: "strict",
    });

    window.mermaid.run({nodes: diagrams});
  }

  if (window.document$) {
    window.document$.subscribe(renderMermaid);
  } else {
    document.addEventListener("DOMContentLoaded", renderMermaid);
  }
})();
