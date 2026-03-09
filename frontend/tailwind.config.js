/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Outfit', 'system-ui', 'sans-serif']
      },
      colors: {
        atmo: {
          accent: 'var(--atmo-accent)',
          surface: 'var(--atmo-surface)',
          border: 'var(--atmo-border)',
          text: 'var(--atmo-text)',
          muted: 'var(--atmo-muted)'
        }
      },
      backgroundImage: {
        'atmo-gradient': 'linear-gradient(160deg, var(--atmo-bg1) 0%, var(--atmo-bg2) 50%, var(--atmo-bg3) 100%)'
      },
      boxShadow: {
        glow: '0 0 24px var(--atmo-glow)'
      },
      transitionDuration: {
        atmosphere: '1400ms'
      }
    }
  },
  plugins: []
};
