import type { Config } from 'tailwindcss';

// Design tokens from the handoff README §3. The generated views carry the exact
// template values inline; these tokens are for anything new built by hand.
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        onyx: { DEFAULT: '#022B1A', deep: '#021F13' }, deep: '#0B4A2F', forest: '#015D39',
        emerald: { DEFAULT: '#00E385', press: '#00C77B', deep: '#00A266' },
        mint: { glow: '#6FEBB6', bubble: '#CCFFEC' }, seaglass: '#B0F5D8', paper: '#F7FDFB',
        grey: { ui: '#F3F4F6', 2: '#EDF2EF', 3: '#EEF3F0', 4: '#D9E3DE' },
        muted: { 1: '#2E5A46', 2: '#5B7A6C', 3: '#7E918A', 4: '#8AA096', 5: '#9FB3AA' },
        sun: '#F5C400', blue: '#3071E8', coral: '#F24E2A', tunnel: { DEFAULT: '#240A06', 2: '#4A1A10' },
      },
      fontFamily: {
        display: ["'PP Frama'", "'Outfit'", 'sans-serif'],
        text: ["'PP Frama Text'", "'Outfit'", 'system-ui', 'sans-serif'],
        phone: ["'Geist'", 'system-ui', 'sans-serif'],
      },
      borderRadius: { pill: '999px', card: '24px', phone: '52px', icon: '12px' },
      boxShadow: { hairline: '0 0 0 1px rgba(2,43,26,0.08)', soft: '0 16px 40px rgba(2,43,26,0.1)', chunky: '0 4px 0 #022B1A' },
      maxWidth: { container: '1200px' },
      screens: { nav: '1120px' },
    },
  },
} satisfies Config;
