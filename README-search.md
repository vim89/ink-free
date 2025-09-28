# Pagefind Search Integration

The ink-free theme includes built-in support for [Pagefind](https://pagefind.app/), a fast, lightweight search solution that works entirely in the browser.

## Enabling Search

To enable search functionality, add the following to your site configuration:

```toml
[params]
enablePagefind = true
```

## Setting Up the Build Process

Pagefind needs to run after Hugo builds your site. Add Pagefind to your build process:

### Option 1: NPM Scripts (Recommended)

Add Pagefind to your `package.json`:

```json
{
  "devDependencies": {
    "pagefind": "^1.0.0"
  },
  "scripts": {
    "build": "hugo --minify --gc && npx pagefind --site public",
    "dev": "hugo server -D"
  }
}
```

### Option 2: GitHub Actions

For GitHub Pages or similar CI/CD:

```yaml
- name: Build Hugo site
  run: hugo --minify --gc

- name: Build search index
  run: npx pagefind --site public
```

### Option 3: Manual Installation

```bash
# Install Pagefind globally
npm install -g pagefind

# Build your site
hugo --minify --gc

# Generate search index
pagefind --site public
```

## Creating a Search Page

Create a search page at `content/search.md`:

```markdown
---
title: "Search"
layout: "search"
description: "Search through all posts and pages"
---

Use the search box below to find content across the site.
```

## Using the Search Shortcode

You can also embed search functionality in any page using the search shortcode:

```markdown
{{< search >}}
```

## Configuration Options

The search functionality will automatically:

- Load Pagefind assets only when search is used (lazy loading)
- Support dark/light mode theming
- Show search results with excerpts and URLs
- Debounce search queries for performance

## How It Works

1. When `enablePagefind = true`, the theme includes search CSS and adds a "Search" link to navigation
2. Pagefind runs after your Hugo build, creating a search index in `/public/pagefind/`
3. The search interface loads Pagefind dynamically when users start typing
4. All search processing happens in the browser - no server required

## Structured Data Integration

When search is enabled, the theme automatically adds a SearchAction to your site's structured data, enabling Google Sitelinks search box functionality.

## Browser Compatibility

Pagefind works in all modern browsers that support ES6 modules. The search gracefully degrades if JavaScript is disabled.