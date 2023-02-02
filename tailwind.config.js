/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				darkPrimary: "#131a24",
				darkText: "#00ABB3",
				darkNav: "#1f2833",
				darkActive: "#1fb2a6",
			},
			spacing: {
				bannerHeight: "30rem",
				cardWidth: "286px",
				cardHeight: "400px",
			},
		},
	},
	plugins: [require("@tailwindcss/line-clamp")],
};
