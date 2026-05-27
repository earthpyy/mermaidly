---
name: mermaidly-link
description: Use when the user provides mermaid diagram code and wants a shareable mermaidly.app link to view or edit it, or when generating mermaid diagrams that should include a preview link
---

# Generate Mermaidly Link

Generate a shareable https://mermaidly.app link from mermaid diagram code.

## Encoding

Mermaidly uses **Base64 URL-safe encoding** in the URL hash:

1. UTF-8 encode the diagram source string
2. Convert bytes to binary string via `String.fromCharCode()`
3. Base64 encode with `btoa()`
4. Replace `+` → `-`, `/` → `_`, strip trailing `=`

## URL Format

```
https://mermaidly.app/#view=<encoded>   ← view-only (default, editor hidden)
https://mermaidly.app/#code=<encoded>   ← editable
```

## How to Generate

Use a Bash one-liner to encode and build the link:

```bash
echo -n '<MERMAID_CODE>' | base64 | tr '+/' '-_' | tr -d '=' | xargs -I{} echo 'https://mermaidly.app/#view={}'
```

For editable, replace `#view=` with `#code=`

For multiline diagrams, use a heredoc:

```bash
cat <<'MERMAID' | base64 | tr '+/' '-_' | tr -d '=' | xargs -I{} echo 'https://mermaidly.app/#view={}'
graph TD
    A[Start] --> B[End]
MERMAID
```

## Workflow

1. Take the user's mermaid code (or generate it if asked)
2. Run the Bash encoding command above to produce the link
3. Present the mermaid code, then the link **inside a single-line code block** so it's easy to copy
4. Default to `#view=` (view-only) unless the user asks for editable
