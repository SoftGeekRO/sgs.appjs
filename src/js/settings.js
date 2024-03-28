const settings = {
	COMPANY_NAME: "SoftGeek",
	BRANCH_NAME: "SG SOLAR ROMANIA",
	STORE_NAME: "SG SOLAR",
	AUTHOR_NAME: "Zaharia Constantin",

	BASE_URL: "https://www.sgsolar.ro/",

	CDN_BASE_URL: "https://cdn.sgsolar.ro/",

	get MEDIA_URL() {
		return `${this.CDN_BASE_URL}media/`;
	},

	get STATIC_URL() {
		return `${this.CDN_BASE_URL}static/`;
	},

	INSTALLED_APPS: [
		"catalogs",
		"brandsCarusel",
		"displayVAT",
		"displayEAN",
		"currentyToggle",
		"updatePageMeta",
		"categoryImageHeader",
		"datasheetTabMockup",
		"stickyAddToCart",
		"codeToProductBox",
		"minimumOrder",
		"pwa",
		"tweaks",
		"socialMediaIcons"
	],
};

export { settings };
