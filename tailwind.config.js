/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Crimson Pro', 'Georgia', 'serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'academic-xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'academic-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'academic-base': ['1rem', { lineHeight: '1.75', letterSpacing: '0.01em' }],
        'academic-lg': ['1.125rem', { lineHeight: '1.75', letterSpacing: '0em' }],
        'academic-xl': ['1.25rem', { lineHeight: '1.75', letterSpacing: '-0.01em' }],
        'academic-2xl': ['1.5rem', { lineHeight: '1.5', letterSpacing: '-0.02em' }],
        'academic-3xl': ['1.875rem', { lineHeight: '1.4', letterSpacing: '-0.02em' }],
        'academic-4xl': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.03em' }],
        'academic-5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        'academic-6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
      },
      // Colors are now defined in @theme directive in src/index.css (Tailwind v4 approach)
      // Keeping this empty to avoid conflicts with @theme definitions
      colors: {},
    },
  },
  plugins: [],
};
