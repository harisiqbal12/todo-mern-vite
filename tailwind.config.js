/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontSize: {
				sx: '14px',
				heading: '50px',
			},
		},
	},
	plugins: [],
};
