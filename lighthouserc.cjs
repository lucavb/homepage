module.exports = {
    ci: {
        collect: {
            url: ['https://luca-becker.me/', 'https://luca-becker.me/blog/', 'https://luca-becker.me/projects/'],
            numberOfRuns: 3,
            settings: {
                preset: 'desktop',
            },
        },
        assert: {
            assertions: {
                'categories:performance': ['error', { minScore: 0.9 }],
                'categories:accessibility': ['error', { minScore: 0.95 }],
                'categories:best-practices': ['error', { minScore: 0.9 }],
                'categories:seo': ['error', { minScore: 0.9 }],
                'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
                'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            },
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};
