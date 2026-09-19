# cm01234.github.io

## Technical Overview

This project is a static, client-side website built with HTML, CSS, and vanilla JavaScript. It has no build step, framework, backend, or runtime dependencies.

## Project Structure

```text
index.html       Page markup and content structure
style.css        Layout, responsive styles, color system, and accessibility states
js/i18n.js       Client-side localization logic
locales/en.json  English translation strings
locales/ru.json  Russian translation strings
```

## Localization

The localization module:

- Supports English (`en`) and Russian (`ru`)
- Loads translations from `locales/{language}.json`
- Resolves nested keys such as `hero.description`
- Translates elements marked with `data-i18n`
- Translates ARIA labels marked with `data-i18n-aria-label`
- Updates the document language, title, and meta description
- Stores the selected language in `localStorage`
- Falls back to the browser language or English

Language files are loaded with `fetch()`, so the site should be served through a local HTTP server rather than opened directly with `file://`.

## Run Locally

From the project root, run:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000> in a browser.

## Accessibility and Responsive Behavior

- Semantic HTML landmarks and headings
- Skip navigation link
- Translated ARIA labels
- Keyboard-visible focus styles
- Color and control contrast considerations
- Reduced-motion media query support
- Responsive layouts for smaller viewports
- Forced-colors support for high-contrast environments

## Validation

The project can be checked without a build process:

```bash
jq empty locales/en.json
jq empty locales/ru.json
```

HTML, CSS, and JavaScript can be checked with the diagnostics provided by the editor or browser developer tools.