# iOS Engineering Preparation Kit

A Markdown knowledge base for Senior, Staff, and Principal iOS engineering
roles. Each concept combines concise theory, production engineering judgment,
and concept-specific interview questions.

[Browse the published preparation kit](https://melancholygaze13.github.io/preparation-kit/)

## Domains

- [Swift](docs/swift/README.md)

## Local Preview

Install the documentation dependencies and start the live-reloading development
server:

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install --requirement requirements.txt
mkdocs serve
```

Open <http://127.0.0.1:8000/preparation-kit/>. Changes to files under `docs/`
are rebuilt automatically.

## Publishing

Pushes to `main` are built and deployed by GitHub Actions. In the repository's
GitHub settings, select **Pages → Build and deployment → Source → GitHub
Actions** once to enable the deployment workflow.
