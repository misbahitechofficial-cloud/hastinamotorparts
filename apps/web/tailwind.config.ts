import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef3f9',
          100: '#d5e2f0',
          200: '#acc4e1',
          300: '#8baed5',
          400: '#5a8dc3',
          500: '#326bb1',
          600: '#215195',
          700: '#133866',
          800: '#0e2d54',
          900: '#0B2545',
          950: '#07182e'
        },
        brand: {
          orange: '#F26B1D',
          orangeHover: '#D9580E',
          slate: '#5C6B7A',
          primary: '#54A5BE',
          secondary: '#BFB59E',
          accent: '#5A3E36',
          alloy: '#C8C9CE',
          charcoal: '#232323'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      maxWidth: {
        'screen-2xl': '1440px',
      }
    },
  },
  plugins: [],
};

export default config;
