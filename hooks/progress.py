"""Generate the static page manifest used by the progress tracker."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from mkdocs.config.defaults import MkDocsConfig
from mkdocs.structure.pages import Page


TRACKED_PAGE_TYPES = {"concept-index", "theory", "interview"}
DOMAIN_ORDER = {"Swift": 0, "SwiftUI": 1, "UIKit": 2, "Architecture": 3}
_tracked_pages: list[dict[str, Any]] = []


def on_pre_build(*, config: MkDocsConfig) -> None:
    """Reset state before every build, including development-server rebuilds."""
    _tracked_pages.clear()


def on_page_markdown(
    markdown: str,
    *,
    page: Page,
    config: MkDocsConfig,
    files: Any,
) -> str:
    """Collect metadata for pages that represent study material."""
    page_type = page.meta.get("page_type")
    if page_type not in TRACKED_PAGE_TYPES:
        return markdown

    domain = page.meta.get("domain")
    topic = page.meta.get("topic")
    if not domain or not topic:
        return markdown

    title = str(page.meta.get("title") or page.title)
    concept = page.meta.get("concept")
    if not concept:
        concept = title

    _tracked_pages.append(
        {
            "id": page.file.src_uri,
            "title": title,
            "url": page.url,
            "domain": str(domain),
            "topic": str(topic),
            "concept": str(concept),
            "pageType": str(page_type),
            "priority": page.meta.get("interview_priority"),
        }
    )
    return markdown


def on_post_build(*, config: MkDocsConfig) -> None:
    """Write a deterministic manifest beside the tracker JavaScript."""
    output = Path(config.site_dir) / "javascripts" / "progress-manifest.json"
    output.parent.mkdir(parents=True, exist_ok=True)

    pages = sorted(
        _tracked_pages,
        key=lambda page: (
            DOMAIN_ORDER.get(page["domain"], len(DOMAIN_ORDER)),
            page["domain"].casefold(),
            page["topic"].casefold(),
            page["concept"].casefold(),
            _page_type_order(page["pageType"]),
        ),
    )
    output.write_text(
        json.dumps({"version": 1, "pages": pages}, indent=2) + "\n",
        encoding="utf-8",
    )


def _page_type_order(page_type: str) -> int:
    return {"concept-index": 0, "theory": 1, "interview": 2}.get(page_type, 3)
