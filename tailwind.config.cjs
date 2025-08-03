/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
                outfit: ['Outfit', 'sans-serif'],
            },
            typography: {
                DEFAULT: {
                    css: {
                        'code::before': {
                            content: '""',
                        },
                        'code::after': {
                            content: '""',
                        },
                        code: {
                            backgroundColor: '#e5e7eb',
                            color: '#1f2937',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '0.25rem',
                            fontFamily:
                                'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                        },
                    },
                },
                dark: {
                    css: {
                        code: {
                            backgroundColor: '#374151',
                            color: '#f3f4f6',
                        },
                    },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
