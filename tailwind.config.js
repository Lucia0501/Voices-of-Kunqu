/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Cultural color palette inspired by Kunqu and Shakespearean aesthetics
      colors: {
        // Kunqu traditional colors
        kunqu: {
          50: '#fef7e7',
          100: '#fde8b8',
          200: '#fbd788',
          300: '#f9c658',
          400: '#f7b528',
          500: '#f59e0b', // Primary Kunqu gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        
        // Shakespearean inspired deep colors
        shakespeare: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b', // Primary Shakespeare slate
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        
        // Cultural accent colors
        cultural: {
          red: '#dc2626',    // Traditional Chinese red
          jade: '#059669',   // Chinese jade green
          plum: '#7c3aed',   // Royal purple
          ivory: '#fffbeb',  // Ivory for text backgrounds
          ink: '#111827',    // Chinese ink black
        },
        
        // Accessibility-compliant grays
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      
      // Cultural typography
      fontFamily: {
        'cultural': ['Noto Serif SC', 'Playfair Display', 'serif'],
        'chinese': ['Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        'english': ['Playfair Display', 'Crimson Text', 'serif'],
        'ui': ['Inter', 'system-ui', 'sans-serif'],
      },
      
      // Responsive typography scales
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        
        // Cultural specific sizes
        'performance-title': ['2rem', { lineHeight: '2.5rem', letterSpacing: '0.05em' }],
        'cultural-heading': ['1.5rem', { lineHeight: '2rem', letterSpacing: '0.025em' }],
        'cultural-body': ['1rem', { lineHeight: '1.625rem' }],
        'chinese-lg': ['1.25rem', { lineHeight: '1.875rem' }],
        'chinese-xl': ['1.5rem', { lineHeight: '2.25rem' }],
      },
      
      // Animation for cultural elements
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "cultural-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(245, 158, 11, 0.5)" },
          "50%": { boxShadow: "0 0 30px rgba(245, 158, 11, 0.8)" },
        },
        "text-highlight": {
          "0%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "rgba(245, 158, 11, 0.3)" },
          "100%": { backgroundColor: "rgba(245, 158, 11, 0.1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "cultural-glow": "cultural-glow 2s ease-in-out infinite",
        "text-highlight": "text-highlight 0.5s ease-out",
      },
      
      // Cultural spacing
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      },
      
      // Border radius for cultural elements
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'cultural': '0.75rem',
      },
      
      // Box shadows for depth
      boxShadow: {
        'cultural': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'cultural-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(245, 158, 11, 0.5)',
      },
      
      // Screen sizes for cultural content
      screens: {
        'xs': '475px',
        '3xl': '1680px',
        '4xl': '2048px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    
    // Custom plugin for cultural utilities
    function({ addUtilities, addComponents, theme }) {
      addUtilities({
        '.text-cultural-gradient': {
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.cultural-border': {
          border: '2px solid transparent',
          'background-image': 'linear-gradient(white, white), linear-gradient(135deg, #f59e0b, #d97706)',
          'background-origin': 'border-box',
          'background-clip': 'content-box, border-box',
        },
      });
      
      addComponents({
        '.cultural-card': {
          '@apply bg-white rounded-cultural shadow-cultural border border-gray-200 p-6': {},
          '@apply hover:shadow-cultural-lg transition-shadow duration-300': {},
        },
        '.performance-card': {
          '@apply cultural-card': {},
          '@apply hover:border-kunqu-300 hover:shadow-glow': {},
        },
        '.cultural-button': {
          '@apply bg-kunqu-500 hover:bg-kunqu-600 text-white': {},
          '@apply px-6 py-3 rounded-cultural font-medium': {},
          '@apply transition-colors duration-200': {},
          '@apply focus:outline-none focus:ring-2 focus:ring-kunqu-500 focus:ring-offset-2': {},
        },
      });
    },
  ],
}