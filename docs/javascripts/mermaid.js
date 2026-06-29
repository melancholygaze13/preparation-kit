(function () {
  "use strict";

  function colorScheme() {
    return document.body.getAttribute("data-md-color-scheme") === "slate"
      ? "dark"
      : "default";
  }

  function convertCodeBlocks() {
    document
      .querySelectorAll("pre > code.language-mermaid, pre > code.mermaid")
      .forEach((code) => {
        const source = code.textContent.trim();
        if (!source) return;

        const diagram = document.createElement("div");
        diagram.className = "mermaid";
        diagram.textContent = source;

        const wrapper = code.closest(".highlight") || code.parentElement;
        wrapper.replaceWith(diagram);
      });
  }

  function renderMermaid() {
    if (!window.mermaid) return;

    convertCodeBlocks();

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
