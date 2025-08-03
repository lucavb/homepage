export const createLogo = (name: string) =>
    name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase();

export const setupEmailProtection = (
    elementId: string,
    options: {
        autoReveal?: boolean;
        isDisplayElement?: boolean;
    } = {},
) => {
    const { autoReveal = false, isDisplayElement = false } = options;

    const emailData = 'aGVsbG9AbHVjYS1iZWNrZXIubWU=';

    const element = document.getElementById(elementId);
    if (!element) return;

    if (isDisplayElement) {
        element.addEventListener('click', function () {
            const decoded = atob(emailData);
            this.innerHTML = `<a href="mailto:${decoded}" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline">${decoded}</a>`;
            this.style.cursor = 'default';
            this.title = 'Email address';
        });
    } else {
        if (element instanceof HTMLAnchorElement) {
            const decoded = atob(emailData);
            element.href = 'mailto:' + decoded;
        }
    }

    if (autoReveal) {
        let hasInteracted = false;
        const revealOnInteraction = () => {
            if (!hasInteracted) {
                hasInteracted = true;
                element.click();
            }
        };

        document.addEventListener('scroll', revealOnInteraction);
        document.addEventListener('click', revealOnInteraction);
    }
};

export const initEmailProtection = (
    configs: Array<{
        elementId: string;
        options?: { autoReveal?: boolean; isDisplayElement?: boolean };
    }>,
) => {
    const init = () => {
        configs.forEach(({ elementId, options }) => {
            setupEmailProtection(elementId, options);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    setTimeout(init, 100);
};
