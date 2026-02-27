/** @type {import('tailwindcss').Config} */
const { withUt } = require("uploadthing/tw");

module.exports = withUt( {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			neutral: {
  				'700': 'rgb(63 63 70)'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
					background: 'hsl(var(--background))', // main app background (off-white/light grey)
					foreground: 'hsl(var(--foreground))',
					primary: {
						DEFAULT: 'hsl(var(--primary))', // main background
						foreground: 'hsl(var(--primary-foreground))'
					},
					sidebar: {
						DEFAULT: 'hsl(var(--sidebar-background))', // sidebar background (dark neutral)
						foreground: 'hsl(var(--sidebar-foreground))',
						primary: 'hsl(var(--sidebar-primary))',
						'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
						accent: 'hsl(var(--sidebar-accent))',
						'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
						border: 'hsl(var(--sidebar-border))',
						ring: 'hsl(var(--sidebar-ring))'
					},
					accent: {
						DEFAULT: 'hsl(var(--accent))', // green accent (for buttons/highlights)
						foreground: 'hsl(var(--accent-foreground))'
					},
					secondary: {
						DEFAULT: 'hsl(var(--secondary))', // new secondary color (e.g. amber, sage, warm grey)
						foreground: 'hsl(var(--secondary-foreground))'
					},
					muted: {
						DEFAULT: 'hsl(var(--muted))', // for disabled/muted states
						foreground: 'hsl(var(--muted-foreground))'
					},
					shade: {
						DEFAULT: 'hsl(var(--shade))', // for hover/active overlays
						foreground: 'hsl(var(--shade-foreground))'
					},
					card: {
						DEFAULT: 'hsl(var(--card))',
						foreground: 'hsl(var(--card-foreground))'
					},
					popover: {
						DEFAULT: 'hsl(var(--popover))',
						foreground: 'hsl(var(--popover-foreground))'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
    function ({ addUtilities }) {
      const newUtilities = {
        '.svg-14 svg': {
          width: '14px',
          height: '14px',
        },
        //scorll bar thin 
        ".scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            width: "2px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
            borderRadius: "10px", // Round the track
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "white",
            borderRadius: "30px", // Make thumb more rounded
            border: "0px solid white",
          },
          "&::-webkit-scrollbar-button": {
            display: "none",
            backgroundColor: "transparent",
            color: "transparent" // Hide the scrollbar buttons (arrows)
          },
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    }
  ],
} );


/*
".scrollbar-thin": {
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(63 63 70) transparent',
        },
*/