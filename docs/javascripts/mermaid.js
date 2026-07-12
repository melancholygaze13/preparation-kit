(function () {
  "use strict";

  function colorScheme() {
    return document.body.getAttribute("data-md-color-scheme") === "slate"
      ? "dark"
      : "default";
  }

  function convertCodeBlocks() {
    document
      .querySelectorAll(
        "pre.mermaid > code, pre > code.language-mermaid, pre > code.mermaid"
      )
      .forEach((code) => {
        const source = code.textContent.trim();
        if (!source) return;

        const diagram = document.createElement("div");
        diagram.className = "mermaid";
        diagram.textContent = source;

        const wrapper =
          code.closest("pre.mermaid") ||
          code.closest(".highlight") ||
          code.parentElement;
        wrapper.replaceWith(diagram);
      });
  }

  function initializeMermaid() {
    if (!window.mermaid) return;

    window.mermaid.initialize({
      startOnLoad: false,
      theme: colorScheme(),
      securityLevel: "strict",
    });
  }

  function preserveReadableScale(diagrams) {
    diagrams.forEach((diagram) => {
      const svg = diagram.querySelector("svg");
      if (!svg) return;

      const naturalWidth = Number.parseFloat(svg.style.maxWidth);
      if (!naturalWidth) return;

      const readableWidth = naturalWidth * 0.72;
      const needsScroll = diagram.clientWidth < readableWidth;

      diagram.classList.toggle("mermaid--scroll", needsScroll);
      svg.style.minWidth = needsScroll ? `${readableWidth}px` : "";
    });
  }

  function renderMermaid(reset = false) {
    if (!window.mermaid) return;

    convertCodeBlocks();

    const allDiagrams = Array.from(document.querySelectorAll(".mermaid"));

    allDiagrams.forEach((diagram) => {
      if (!diagram.dataset.mermaidSource) {
        diagram.dataset.mermaidSource = diagram.textContent.trim();
      }

      if (reset) {
        diagram.removeAttribute("data-processed");
        diagram.textContent = diagram.dataset.mermaidSource;
      }
    });

    const diagrams = allDiagrams.filter(
      (diagram) => !diagram.hasAttribute("data-processed")
    );
    if (!diagrams.length) return;

    initializeMermaid();

    window.mermaid
      .run({nodes: diagrams})
      .then(() => preserveReadableScale(diagrams))
      .catch((error) => {
        console.error("Mermaid rendering failed", error);
      });
  }

  function watchPalette() {
    document.querySelectorAll('input[name="__palette"]').forEach((input) => {
      if (input.dataset.mermaidPaletteBound) return;
      input.dataset.mermaidPaletteBound = "true";

      input.addEventListener("change", () => {
        requestAnimationFrame(() => renderMermaid(true));
      });
    });
  }

  initializeMermaid();

  const navigation =
    typeof document$ !== "undefined" ? document$ : window.document$;

  if (navigation) {
    navigation.subscribe(() => {
      renderMermaid();
      watchPalette();
    });
  } else if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        renderMermaid();
        watchPalette();
      },
      {once: true}
    );
  } else {
    renderMermaid();
    watchPalette();
  }
})();
