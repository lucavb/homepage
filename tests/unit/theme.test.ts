// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    ThemeMode,
    resolveMode,
    applyMode,
    onThemeChange,
    initTheme,
    THEME_BOOTSTRAP,
    THEME_STORAGE_KEY,
} from '@lib/theme';

// Deterministic OS preference; tests flip `prefersDarkState` instead of
// relying on happy-dom's real media queries.
let matchMediaStub: { matches: boolean; addEventListener: ReturnType<typeof vi.fn> } | undefined;
let prefersDarkState = false;

vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation(() => {
        if (!matchMediaStub) {
            matchMediaStub = {
                get matches() {
                    return prefersDarkState;
                },
                addEventListener: vi.fn(),
            };
        }
        return matchMediaStub;
    }),
);

const clearDocument = () => {
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-theme');
    document.querySelector('meta[name="theme-color"]')?.remove();
    localStorage.clear();
};

const rootHtml = (variant: 'dropdown' | 'toggle', id: string) =>
    variant === 'dropdown'
        ? `<div id="${id}-wrapper">
            <button id="${id}" aria-label="Toggle theme" aria-haspopup="true" aria-expanded="false">
                <svg id="${id}-icon" data-theme-icon></svg>
            </button>
            <div id="${id}-dropdown" data-theme-dropdown>
                <button class="theme-option" data-theme="light" aria-pressed="false">Light</button>
                <button class="theme-option" data-theme="dark" aria-pressed="false">Dark</button>
                <button class="theme-option" data-theme="system" aria-pressed="false">System</button>
            </div>
        </div>`
        : `<div id="${id}" class="pill">
            <button class="theme-option" data-theme="system" aria-label="System theme" aria-pressed="false">System</button>
            <button class="theme-option" data-theme="light" aria-label="Light theme" aria-pressed="false">Light</button>
            <button class="theme-option" data-theme="dark" aria-label="Dark theme" aria-pressed="false">Dark</button>
        </div>`;

const click = (el: Element) => el.dispatchEvent(new Event('click', { bubbles: true }));
const pressedOption = (root: ParentNode) =>
    root.querySelector('.theme-option[aria-pressed="true"]')?.getAttribute('data-theme');

beforeEach(clearDocument);
afterEach(() => {
    prefersDarkState = false;
});

describe('resolveMode', () => {
    it('accepts the valid stored values', () => {
        expect(resolveMode('light', false)).toBe('light');
        expect(resolveMode('dark', true)).toBe('dark');
        expect(resolveMode('system', false)).toBe('system');
    });

    it('falls back to system for null or garbage (regardless of prefersDark)', () => {
        expect(resolveMode(null, true)).toBe('system');
        expect(resolveMode(null, false)).toBe('system');
        expect(resolveMode('banana', true)).toBe('system');
        expect(resolveMode('banana', false)).toBe('system');
    });
});

describe('applyMode', () => {
    it('light: no .dark class, data-theme light, meta theme-color #f8f8f2', () => {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        document.head.append(meta);

        applyMode('light');

        expect(document.documentElement.classList.contains('dark')).toBe(false);
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        expect(meta.content).toBe('#f8f8f2');
    });

    it('dark: .dark class, data-theme dark, meta theme-color #111b22', () => {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        document.head.append(meta);

        applyMode('dark');

        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(meta.content).toBe('#111b22');
    });

    it('system resolves through matchMedia: prefersDark true → dark, false → light', () => {
        prefersDarkState = true;
        applyMode('system');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

        prefersDarkState = false;
        applyMode('system');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
});

describe('toggle wiring (initTheme)', () => {
    it('a theme-option click selects that mode, persists it, and syncs its instance UI', () => {
        document.body.innerHTML = rootHtml('dropdown', 'theme-toggle');
        const root = document.getElementById('theme-toggle-wrapper')!;

        initTheme(root);

        click(root.querySelector('.theme-option[data-theme="dark"]')!);

        expect(localStorage.getItem('theme')).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(pressedOption(root)).toBe('dark');
        expect(document.querySelector('.theme-option[data-theme="light"]')!.getAttribute('aria-pressed')).toBe('false');
    });

    it("selection order light → dark → system matches the component's current three-option order", () => {
        document.body.innerHTML = rootHtml('dropdown', 'theme-toggle');
        const root = document.getElementById('theme-toggle-wrapper')!;
        initTheme(root);

        click(root.querySelector('.theme-option[data-theme="light"]')!);
        expect(localStorage.getItem('theme')).toBe('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);

        click(root.querySelector('.theme-option[data-theme="dark"]')!);
        expect(localStorage.getItem('theme')).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);

        prefersDarkState = true;
        click(root.querySelector('.theme-option[data-theme="system"]')!);
        expect(localStorage.getItem('theme')).toBe('system');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(pressedOption(root)).toBe('system');
    });

    it('two initTheme roots wire independently and neither breaks the other', () => {
        document.body.innerHTML = rootHtml('dropdown', 'theme-toggle') + rootHtml('toggle', 'mobile-theme-toggle');
        const header = document.getElementById('theme-toggle-wrapper')!;
        const mobile = document.getElementById('mobile-theme-toggle')!;

        initTheme(header);
        initTheme(mobile);

        // Sidebar (variant toggle) instance works on its own — the old
        // document-wide wiring bug is gone: mode selection via the second
        // instance changes page mode and storage.
        click(mobile.querySelector('.theme-option[data-theme="light"]')!);
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
        expect(pressedOption(mobile)).toBe('light');

        // Header dropdown stays closed; its own wiring is untouched by the
        // other instance's events.
        expect(header.querySelector('#theme-toggle-dropdown')!.classList.contains('visible')).toBe(false);

        // And the header instance still selects modes.
        click(header.querySelector('.theme-option[data-theme="dark"]')!);
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(pressedOption(header)).toBe('dark');
    });

    it('hovering the dropdown instance opens its menu without touching other instances', () => {
        document.body.innerHTML = rootHtml('dropdown', 'theme-toggle') + rootHtml('dropdown', 'other-toggle');
        const header = document.getElementById('theme-toggle-wrapper')!;
        const other = document.getElementById('other-toggle-wrapper')!;

        initTheme(header);
        initTheme(other);

        header.querySelector('button#theme-toggle')!.dispatchEvent(new Event('mouseenter'));
        expect(header.querySelector('#theme-toggle-dropdown')!.classList.contains('visible')).toBe(true);
        expect(other.querySelector('#other-toggle-dropdown')!.classList.contains('visible')).toBe(false);
    });
});

describe('onThemeChange', () => {
    it('fires with the applied mode after applyMode; unsubscribe stops it', () => {
        const seen: ThemeMode[] = [];
        const unsubscribe = onThemeChange((mode) => seen.push(mode));

        prefersDarkState = true;
        applyMode('dark');
        expect(seen).toEqual(['dark']);

        applyMode('system');
        expect(seen).toEqual(['dark', 'dark']);

        unsubscribe();
        applyMode('light');
        expect(seen).toEqual(['dark', 'dark']);
    });
});

describe('THEME_BOOTSTRAP', () => {
    it('is a dependency-free restore-on-load script', () => {
        expect(THEME_BOOTSTRAP).toContain("localStorage.getItem('theme')");
        expect(THEME_BOOTSTRAP).toContain("matchMedia('(prefers-color-scheme: dark)')");
        expect(THEME_BOOTSTRAP).toContain("classList.add('dark')");
        expect(THEME_BOOTSTRAP).toContain('data-theme');
    });
});
