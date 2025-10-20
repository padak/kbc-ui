import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': 'var(--color-primary-50)',
  				'100': 'var(--color-primary-100)',
  				'200': 'var(--color-primary-200)',
  				'300': 'var(--color-primary-300)',
  				'400': 'var(--color-primary-400)',
  				'500': 'var(--color-primary-500)',
  				'600': 'var(--color-primary-600)',
  				'700': 'var(--color-primary-700)',
  				'800': 'var(--color-primary-800)',
  				'900': 'var(--color-primary-900)'
  			},
  			neutral: {
  				'50': 'var(--color-neutral-50)',
  				'100': 'var(--color-neutral-100)',
  				'200': 'var(--color-neutral-200)',
  				'300': 'var(--color-neutral-300)',
  				'400': 'var(--color-neutral-400)',
  				'500': 'var(--color-neutral-500)',
  				'600': 'var(--color-neutral-600)',
  				'700': 'var(--color-neutral-700)',
  				'800': 'var(--color-neutral-800)',
  				'900': 'var(--color-neutral-900)'
  			},
  			success: {
  				'50': 'var(--color-success-50)',
  				'500': 'var(--color-success-500)',
  				'700': 'var(--color-success-700)'
  			},
  			warning: {
  				'50': 'var(--color-warning-50)',
  				'500': 'var(--color-warning-500)',
  				'700': 'var(--color-warning-700)'
  			},
  			error: {
  				'50': 'var(--color-error-50)',
  				'500': 'var(--color-error-500)',
  				'700': 'var(--color-error-700)'
  			},
  			info: {
  				'50': 'var(--color-info-50)',
  				'500': 'var(--color-info-500)',
  				'700': 'var(--color-info-700)'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			shimmer: {
  				'0%': {
  					backgroundPosition: '-1000px 0'
  				},
  				'100%': {
  					backgroundPosition: '1000px 0'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			shimmer: 'shimmer 2s infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
