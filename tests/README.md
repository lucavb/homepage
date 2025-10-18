# Playwright Testing Setup

This project uses Playwright for end-to-end testing of the personal homepage.

## Running Tests Locally

### Prerequisites

- Node.js and npm installed
- Dependencies installed (`npm install`)
- Playwright browsers installed (done during setup)

### Test Commands

```bash
# Run all tests in headless mode
npm test

# Run tests with browser visible
npm run test:headed

# Run tests with UI mode (interactive)
npm run test:ui
```

The Playwright config automatically starts the Astro preview server before running tests, so you don't need to manually start it.

## Test Coverage

Current smoke tests cover:

- **Homepage**: Verifies all key sections load (Hero, About, Experience, Projects, Blog, Contact) and no console errors
- **Blog Index**: Verifies blog page loads and lists posts
- **Blog Post**: Verifies individual blog posts load correctly
- **Projects Page**: Verifies projects page loads
- **Impressum**: Verifies impressum page loads
- **Navigation**: Verifies navigation between pages works

## Continuous Integration

### Local Tests

Tests run against `http://localhost:4321` (Astro preview server)

### Post-Deployment Tests

After successful deployment to GitHub Pages, automated tests run against the production site (`https://luca-becker.me`)

## Notifications

Deployment notifications are sent via ntfy:

- **Build Success/Failure**: Notified when the build completes
- **Deployment Success/Failure**: Notified when deployment completes
- **Test Results**: Notified after post-deployment tests complete

### Required GitHub Secrets

Add these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions → New repository secret):

- `NTFY_BASE_URL`: Your ntfy server base URL (e.g., `https://ntfy.yourdomain.com`)
- `NTFY_TOPIC`: Topic name for notifications (e.g., `deployments` or `luca-becker-me-deploy`)

## Adding New Tests

1. Create or edit test files in the `tests/` directory
2. Follow the existing patterns for console error detection
3. Use descriptive test names
4. Run tests locally before pushing

## Playwright Configuration

Configuration is in `playwright.config.ts`:

- **Projects**: Tests run on Chromium, Firefox, and WebKit
- **Base URL**: Configurable via `BASE_URL` environment variable
- **Retries**: 2 retries in CI, 0 locally
- **Reports**: HTML and GitHub Actions reporters
- **Screenshots**: Captured on failure
- **Traces**: Captured on first retry

## Debugging

Use UI mode for interactive debugging:

```bash
npm run test:ui
```

This allows you to:

- Step through tests
- See screenshots at each step
- View network requests
- Inspect DOM elements
