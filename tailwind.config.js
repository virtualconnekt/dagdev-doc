/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                background: '#0a0a0b',
                blue: {
                    400: '#60a5fa',
                    500: '#3b82f6',
                    900: '#1e3a8a', // Deep blue for DAG
                },
                red: {
                    500: '#ef4444', // Red blocks
                }
            },
            animation: {
                'type-line': 'type-line 1s steps(40) forwards',
            },
            keyframes: {
                'type-line': {
                    '0%': { width: '0' },
                    '100%': { width: '100%' },
                }
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
