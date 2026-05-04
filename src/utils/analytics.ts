interface ScrollDepthTracked {
    [key: string]: boolean;
}

interface TimeTracked {
    [key: string]: boolean;
}

function initScrollDepthTracking(): void {
    const scrollDepthTracked: ScrollDepthTracked = {
        '25': false,
        '50': false,
        '75': false,
        '100': false,
    };

    function trackScrollDepth(): void {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);

        Object.keys(scrollDepthTracked).forEach((milestone) => {
            if (scrollPercent >= parseInt(milestone) && !scrollDepthTracked[milestone]) {
                scrollDepthTracked[milestone] = true;
                window.umami?.track('Scroll Depth', { depth: milestone + '%' });
            }
        });
    }

    let scrollTimeout: ReturnType<typeof setTimeout>;
    window.addEventListener('scroll', function () {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(trackScrollDepth, 100);
    });
}

function initSectionVisibilityTracking(): void {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    const sectionName = entry.target.id;
                    window.umami?.track('Section View', { section: sectionName });
                    sectionObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.5,
            rootMargin: '0px',
        },
    );

    const sectionsToTrack = ['about', 'experience', 'projects', 'blog', 'contact'];
    sectionsToTrack.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            sectionObserver.observe(section);
        }
    });
}

function initTimeSpentTracking(): void {
    const startTime = Date.now();
    const timeTracked: TimeTracked = {
        '30s': false,
        '60s': false,
        '2m': false,
        '5m': false,
    };

    function trackTimeSpent(): void {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);

        if (timeSpent >= 30 && !timeTracked['30s']) {
            timeTracked['30s'] = true;
            window.umami?.track('Time Spent', { duration: '30 seconds' });
        }
        if (timeSpent >= 60 && !timeTracked['60s']) {
            timeTracked['60s'] = true;
            window.umami?.track('Time Spent', { duration: '1 minute' });
        }
        if (timeSpent >= 120 && !timeTracked['2m']) {
            timeTracked['2m'] = true;
            window.umami?.track('Time Spent', { duration: '2 minutes' });
        }
        if (timeSpent >= 300 && !timeTracked['5m']) {
            timeTracked['5m'] = true;
            window.umami?.track('Time Spent', { duration: '5 minutes' });
        }
    }

    setInterval(trackTimeSpent, 10000);
}

export function initHomepageAnalytics(): void {
    if (window.location.pathname !== '/') return;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initScrollDepthTracking();
            initSectionVisibilityTracking();
            initTimeSpentTracking();
        });
    } else {
        initScrollDepthTracking();
        initSectionVisibilityTracking();
        initTimeSpentTracking();
    }
}

export function trackEvent(eventName: string, data?: Record<string, string | number | boolean>): void {
    window.umami?.track(eventName, data);
}
