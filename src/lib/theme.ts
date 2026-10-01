/**
 * Theme mode state machine. The single implementation of the site's theme
 * behavior (see CONTEXT.md: "theme mode"): storage, the dual `.dark` class +
 * `data-theme` representation, the pre-paint bootstrap, and the toggle wiring.
 * Components are markup adapters; they never touch classes directly.
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'theme';

const VALID_MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];

const ICONS: Record<ThemeMode, string> = {
    light: `<svg id="theme-toggle-icon" data-theme-icon class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>`,
    dark: `<svg id="theme-toggle-icon" data-theme-icon class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>`,
    system: `<svg id="theme-toggle-icon" data-theme-icon class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>`,
};

const ACTIVE_OPTION_CLASSES = ['bg-white', 'dark:bg-slate-700', 'shadow-sm', 'text-slate-900', 'dark:text-slate-100'];

const INACTIVE_OPTION_CLASSES = ['text-slate-500', 'dark:text-slate-400'];

/**
 * Pure: a valid stored value wins, otherwise the visitor follows the OS.
 */
export function resolveMode(stored: string | null, prefersDark: boolean): ThemeMode {
    return VALID_MODES.includes(stored as ThemeMode) ? (stored as ThemeMode) : 'system';
}

const prefersDark = (): boolean => window.matchMedia('(prefers-color-scheme: dark)').matches;

/**
 * The mode the visitor asked for ('system' passes through). Internal.
 */
let requestedMode: ThemeMode = 'system';

/**
 * The mode currently applied to the DOM ('light' | 'dark' — 'system' is
 * resolved away). Set by applyMode; lazily derived from storage otherwise.
 * Lets late scripts (mermaid) sync without reading classes themselves.
 */
let appliedMode: 'light' | 'dark' | null = null;

export function getAppliedTheme(): 'light' | 'dark' {
    if (appliedMode) return appliedMode;
    return resolveMode(localStorage.getItem(THEME_STORAGE_KEY), prefersDark()) === 'dark' ? 'dark' : 'light';
}

type ThemeListener = (mode: ThemeMode) => void;

const listeners = new Set<ThemeListener>();

/**
 * Fires with the APPLIED mode ('light' | 'dark') after every applyMode.
 */
export function onThemeChange(cb: ThemeListener): () => void {
    listeners.add(cb);
    return () => {
        listeners.delete(cb);
    };
}

export function applyMode(mode: ThemeMode, doc: Document = document): void {
    requestedMode = mode;

    const actualTheme = mode === 'system' ? (prefersDark() ? 'dark' : 'light') : mode;

    if (actualTheme === 'dark') {
        doc.documentElement.setAttribute('data-theme', 'dark');
        doc.documentElement.classList.add('dark');
        const browserTheme = doc.querySelector('[name="theme-color"]');
        if (browserTheme instanceof HTMLMetaElement) browserTheme.content = '#111b22';
    } else {
        doc.documentElement.setAttribute('data-theme', 'light');
        doc.documentElement.classList.remove('dark');
        const browserTheme = doc.querySelector('[name="theme-color"]');
        if (browserTheme instanceof HTMLMetaElement) browserTheme.content = '#f8f8f2';
    }

    appliedMode = actualTheme;

    listeners.forEach((cb) => cb(actualTheme));
}

function getPreferredTheme(): ThemeMode {
    return resolveMode(localStorage.getItem(THEME_STORAGE_KEY), prefersDark());
}

function setTheme(mode: ThemeMode): void {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    applyMode(mode);
}

function syncToggleUi(root: ParentNode, mode: ThemeMode): void {
    const icon = root.querySelector('[data-theme-icon]');
    if (icon instanceof Element) {
        icon.outerHTML = ICONS[mode];
    }

    root.querySelectorAll<HTMLElement>('.theme-option').forEach((btn) => {
        const btnTheme = btn.getAttribute('data-theme');
        if (btnTheme === mode) {
            btn.classList.add(...ACTIVE_OPTION_CLASSES);
            btn.classList.remove(...INACTIVE_OPTION_CLASSES);
            btn.setAttribute('aria-pressed', 'true');
        } else {
            btn.classList.remove(...ACTIVE_OPTION_CLASSES);
            btn.classList.add(...INACTIVE_OPTION_CLASSES);
            btn.setAttribute('aria-pressed', 'false');
        }
    });
}

function wireInstance(root: ParentNode): void {
    const doc = root instanceof Document ? root : (root.ownerDocument ?? document);

    applyMode(getPreferredTheme(), doc);
    onThemeChange(() => {
        syncToggleUi(root, requestedMode);
    });

    const dropdownButton = root.querySelector<HTMLElement>('button[id$="theme-toggle"]');
    const dropdown = root.querySelector('[data-theme-dropdown]');

    if (dropdownButton && dropdown) {
        let hideTimeout: ReturnType<typeof setTimeout> | null = null;
        let isDropdownOpen = false;

        const showDropdown = () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            dropdown.classList.remove('opacity-0', 'invisible', 'scale-95');
            dropdown.classList.add('opacity-100', 'visible', 'scale-100');
            dropdownButton.setAttribute('aria-expanded', 'true');
            isDropdownOpen = true;
        };

        const hideDropdown = () => {
            dropdown.classList.add('opacity-0', 'invisible', 'scale-95');
            dropdown.classList.remove('opacity-100', 'visible', 'scale-100');
            dropdownButton.setAttribute('aria-expanded', 'false');
            isDropdownOpen = false;
        };

        const scheduleHide = (delay = 300) => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }
            hideTimeout = setTimeout(() => {
                hideDropdown();
                hideTimeout = null;
            }, delay);
        };

        const cancelHide = () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
        };

        dropdownButton.addEventListener('mouseenter', () => {
            cancelHide();
            showDropdown();
        });

        dropdownButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isDropdownOpen) {
                hideDropdown();
            } else {
                showDropdown();
            }
        });

        dropdown.addEventListener('mouseenter', () => {
            cancelHide();
        });

        dropdown.addEventListener('mouseleave', () => {
            scheduleHide();
        });

        dropdownButton.addEventListener('mouseleave', () => {
            scheduleHide();
        });

        doc.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (!dropdownButton.contains(target) && !dropdown.contains(target)) {
                hideDropdown();
            }
        });

        doc.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideDropdown();
            }
        });
    }

    // Mode selection: each theme option applies its own mode. The dropdown
    // button itself opens the menu (below); there is no click cycle.
    root.querySelectorAll<HTMLElement>('.theme-option').forEach((button) => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            if (theme === 'light' || theme === 'dark' || theme === 'system') {
                setTheme(theme);
                const rootDropdown = root.querySelector('[data-theme-dropdown]');
                if (rootDropdown) {
                    rootDropdown.classList.add('opacity-0', 'invisible', 'scale-95');
                    rootDropdown.classList.remove('opacity-100', 'visible', 'scale-100');
                }
            }
        });
    });
}

let systemSyncInstalled = false;

/**
 * Wires toggle behavior scoped to the given root. With the default root
 * (document), each rendered ThemeToggle instance gets its own root:
 * dropdown wrappers (parent of [data-theme-dropdown]) and toggle pills
 * ([id$="theme-toggle"] containers that hold .theme-option buttons).
 */
export function initTheme(root: ParentNode = document): void {
    if (root === document) {
        const instanceRoots: ParentNode[] = [];

        document.querySelectorAll('[data-theme-dropdown]').forEach((dropdown) => {
            if (dropdown.parentElement) instanceRoots.push(dropdown.parentElement);
        });

        document.querySelectorAll<HTMLElement>('[id$="theme-toggle"]').forEach((el) => {
            const isDropdownWrapper = el.querySelector('[data-theme-dropdown]') !== null;
            if (el instanceof HTMLButtonElement || isDropdownWrapper) return;
            if (el.querySelector('.theme-option')) instanceRoots.push(el);
        });

        if (!systemSyncInstalled) {
            systemSyncInstalled = true;
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                if (getPreferredTheme() === 'system') {
                    applyMode('system');
                    syncToggleUi(document, 'system');
                }
            });
        }

        instanceRoots.forEach(wireInstance);
        return;
    }

    wireInstance(root);
}

/**
 * The current pre-paint bootstrap, verbatim. Intentionally a standalone
 * dependency-free string (it runs before module scripts load; sharing code
 * with it would drag the bundle into the critical path).
 */
export const THEME_BOOTSTRAP = `(() => {
    var t = localStorage.getItem('theme') || 'system';
    var d = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (d) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
})();`;
