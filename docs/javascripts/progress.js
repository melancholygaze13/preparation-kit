(function () {
  "use strict";

  const scriptUrl = new URL(document.currentScript.src);
  const manifestUrl = new URL("progress-manifest.json", scriptUrl);
  manifestUrl.search = scriptUrl.search;
  const siteRootUrl = new URL("../", manifestUrl);
  const storageKey = "preparation-kit.study-progress.v1";
  const trackedPageTypes = new Set(["theory", "interview"]);
  let manifestPromise;

  function loadManifest() {
    if (!manifestPromise) {
      manifestPromise = fetch(manifestUrl)
        .then((response) => {
          if (!response.ok) throw new Error(`Manifest request failed: ${response.status}`);
          return response.json();
        })
        .then((manifest) =>
          (manifest.pages || []).filter((page) => trackedPageTypes.has(page.pageType))
        );
    }
    return manifestPromise;
  }

  function loadCompletedPages() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey));
      return new Set(Array.isArray(value?.completedPageIds) ? value.completedPageIds : []);
    } catch (_error) {
      return new Set();
    }
  }

  function saveCompletedPages(completed) {
    localStorage.setItem(
      storageKey,
      JSON.stringify({version: 1, completedPageIds: Array.from(completed).sort()})
    );
  }

  function clearCompletedPages() {
    localStorage.removeItem(storageKey);
    window.dispatchEvent(new CustomEvent("study-progress-changed"));
  }

  function setPageCompleted(pageId, isCompleted) {
    const completed = loadCompletedPages();
    if (isCompleted) completed.add(pageId);
    else completed.delete(pageId);
    saveCompletedPages(completed);
    window.dispatchEvent(new CustomEvent("study-progress-changed"));
  }

  function normalizePath(url) {
    let path = new URL(url, window.location.href).pathname;
    path = path.replace(/index\.html$/, "");
    return path.endsWith("/") ? path : `${path}/`;
  }

  function pageUrl(page) {
    return new URL(page.url, siteRootUrl).href;
  }

  function currentPage(pages) {
    const currentPath = normalizePath(window.location.href);
    return pages.find((page) => normalizePath(pageUrl(page)) === currentPath);
  }

  function renderPageControl(page) {
    const content = document.querySelector(".md-content__inner");
    if (!content || content.querySelector(".study-page-control")) return;

    const wrapper = document.createElement("section");
    wrapper.className = "study-page-control";
    wrapper.setAttribute("aria-label", "Study progress for this page");
    content.appendChild(wrapper);

    const update = () => {
      const isCompleted = loadCompletedPages().has(page.id);
      wrapper.innerHTML = `
        <div>
          <strong>${isCompleted ? "Studied" : "Finished reviewing this page?"}</strong>
          <span>${isCompleted ? "This page counts toward your progress." : "You can change this status at any time."}</span>
        </div>
        <button class="md-button ${isCompleted ? "" : "md-button--primary"}" type="button"
                aria-pressed="${isCompleted}">
          ${isCompleted ? "Mark as not studied" : "Mark as studied"}
        </button>`;

      wrapper.querySelector("button").addEventListener("click", () => {
        setPageCompleted(page.id, !isCompleted);
      });
    };

    update();
    window.addEventListener("study-progress-changed", update);
  }

  function groupPages(pages) {
    const domains = new Map();
    for (const page of pages) {
      if (!domains.has(page.domain)) domains.set(page.domain, new Map());
      const topics = domains.get(page.domain);
      if (!topics.has(page.topic)) topics.set(page.topic, new Map());
      const concepts = topics.get(page.topic);
      if (!concepts.has(page.concept)) concepts.set(page.concept, []);
      concepts.get(page.concept).push(page);
    }
    return domains;
  }

  function completion(pages, completed) {
    const completedCount = pages.reduce(
      (count, page) => count + (completed.has(page.id) ? 1 : 0),
      0
    );
    return {
      completed: completedCount,
      total: pages.length,
      percent: pages.length ? Math.round((completedCount / pages.length) * 100) : 0,
    };
  }

  function flattenTopics(topics) {
    return Array.from(topics.values()).flatMap((concepts) =>
      Array.from(concepts.values()).flat()
    );
  }

  function pageLabel(page) {
    return {
      "concept-index": "Overview",
      theory: "Theory",
      interview: "Interview questions",
    }[page.pageType] || page.title;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function progressBar(stats, label) {
    return `<div class="study-progress-bar" role="progressbar"
      aria-label="${escapeHtml(label)}" aria-valuemin="0" aria-valuemax="100"
      aria-valuenow="${stats.percent}">
      <span style="width: ${stats.percent}%"></span>
    </div>`;
  }

  function renderConcept(name, pages, completed) {
    const stats = completion(pages, completed);
    const status = stats.completed === stats.total ? "complete" : stats.completed ? "partial" : "pending";
    const pageItems = pages.map((page) => {
      const checked = completed.has(page.id);
      return `<li>
        <label>
          <input type="checkbox" data-page-id="${escapeHtml(page.id)}" ${checked ? "checked" : ""}>
          <span>${escapeHtml(pageLabel(page))}</span>
        </label>
        <a href="${escapeHtml(pageUrl(page))}">Open</a>
      </li>`;
    }).join("");

    return `<details class="study-concept study-concept--${status}">
      <summary>
        <span class="study-status-dot" aria-hidden="true"></span>
        <span>${escapeHtml(name)}</span>
        <small>${stats.completed}/${stats.total}</small>
      </summary>
      <ul>${pageItems}</ul>
    </details>`;
  }

  function renderTopic(name, concepts, completed) {
    const pages = Array.from(concepts.values()).flat();
    const stats = completion(pages, completed);
    const conceptsHtml = Array.from(concepts.entries())
      .map(([conceptName, conceptPages]) => renderConcept(conceptName, conceptPages, completed))
      .join("");

    return `<details class="study-topic">
      <summary>
        <span>${escapeHtml(name)}</span>
        <small>${stats.percent}% · ${stats.completed}/${stats.total} pages</small>
      </summary>
      <div class="study-topic__content">${conceptsHtml}</div>
    </details>`;
  }

  function renderDashboard(container, pages) {
    const completed = loadCompletedPages();
    const domains = groupPages(pages);
    const overall = completion(pages, completed);

    const domainsHtml = Array.from(domains.entries()).map(([domainName, topics]) => {
      const domainPages = flattenTopics(topics);
      const stats = completion(domainPages, completed);
      const topicsHtml = Array.from(topics.entries())
        .map(([topicName, concepts]) => renderTopic(topicName, concepts, completed))
        .join("");

      return `<details class="study-domain">
        <summary>
          <div class="study-domain__heading">
            <strong>${escapeHtml(domainName)}</strong>
            <span>${stats.percent}%</span>
          </div>
          ${progressBar(stats, `${domainName} progress`)}
          <small>${stats.completed} of ${stats.total} pages studied</small>
        </summary>
        <div class="study-domain__content">${topicsHtml}</div>
      </details>`;
    }).join("");

    container.innerHTML = `
      <section class="study-overall" aria-label="Overall study progress">
        <div class="study-overall__header">
          <div>
            <span>Overall progress</span>
            <strong>${overall.percent}%</strong>
          </div>
          <button class="md-button" type="button" data-clear-progress
                  ${overall.completed ? "" : "disabled"}>
            Clear all progress
          </button>
        </div>
        ${progressBar(overall, "Overall progress")}
        <small>${overall.completed} of ${overall.total} pages studied</small>
      </section>
      <div class="study-progress__domains">${domainsHtml}</div>`;

    container.querySelectorAll("input[data-page-id]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        setPageCompleted(checkbox.dataset.pageId, checkbox.checked);
      });
    });

    container.querySelector("[data-clear-progress]").addEventListener("click", () => {
      if (window.confirm("Clear all study progress stored in this browser?")) {
        clearCompletedPages();
      }
    });
  }

  async function initialize() {
    try {
      const pages = await loadManifest();
      const page = currentPage(pages);
      if (page) renderPageControl(page);

      const dashboard = document.getElementById("study-progress-dashboard");
      if (dashboard && !dashboard.dataset.initialized) {
        dashboard.dataset.initialized = "true";
        const update = () => renderDashboard(dashboard, pages);
        update();
        window.addEventListener("study-progress-changed", update);
      }
    } catch (error) {
      const dashboard = document.getElementById("study-progress-dashboard");
      if (dashboard) {
        dashboard.innerHTML = "<p>Progress could not be loaded. Reload the page to try again.</p>";
      }
      console.error("Study progress initialization failed", error);
    }
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(initialize);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, {once: true});
  } else {
    initialize();
  }
})();
