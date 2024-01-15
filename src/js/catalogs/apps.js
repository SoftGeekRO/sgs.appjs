import $ from "jquery";
import Handlebars from "handlebars/dist/handlebars.min";
import { Fancybox } from "@fancyapps/ui";

import catalogs_hbs from "html-loader!./template/catalogs.hbs";
import { settings } from "../sgs/config/settings";
import { request_finished } from "../sgs/core/signals";
import { AppConfig } from "../sgs/apps/config";
import { sort_json } from "../sgs/utils/json";
import { slugify } from "../sgs/utils/text";

import catalog_data from "./catalogs.json";

const sorted = true;

const catalogsURL = `${settings.CDN_BASE_URL}/sgs.app/catalogs/`;
const brandsLogoURL = `${settings.CDN_BASE_URL}sgs.app/img/brands/200x200/`;

class Catalogs extends AppConfig {
	#html_warapper = $(".brands-wrapper");
	constructor() {
		super("Catalogs");

		let _functions = Object.getOwnPropertyNames(
			Object.getPrototypeOf(this)).filter(
			(name) => name !== "constructor" && typeof this[name] === "function"
		);
		_functions.forEach((val, ndx) => {
			if (val.startsWith("helper_") || val.startsWith("partial_")) {
				this[val]();
			}
		});

		this.data = sorted ? this.sorted_list() : catalog_data;
	}

	ready() {
		this.render();
	}

	helper_brands_logo() {
		Handlebars.registerHelper("brandsLogoURL", function (img_url, options) {
			let brandName = options.hash.brandName;

			return new Handlebars.SafeString(
				`<img class="sgs-brand-logo" alt="${brandName}" src="${brandsLogoURL}${img_url}" rel="noreferrer"/>`,
			);
		});
	}

	helper_catalog_img() {
		Handlebars.registerHelper("catalogIMG", function (brand, options) {
			let img_url = options.hash.url,
				cat_name = options.hash.catName,
				brand_slugify = slugify(brand);
			return new Handlebars.SafeString(
				`<img class="sgs-catalog-image" alt="${cat_name}" src="${settings.MEDIA_URL}${img_url}" rel="noreferrer"/>`,
			);
		});
	}

	helper_catalog_columns() {
		Handlebars.registerHelper("catalogColumns", function (catalogs, options) {
			let catalog_count = catalogs.length,
				count = 4;
			if (catalog_count <= 3) {
				count = catalog_count;
			}
			return new Handlebars.SafeString(`cols-${count}`);
		});
	}

	partial_catalogs_url() {
		Handlebars.registerPartial("catalogsURL", function (brand, options) {
			let _name = brand.name,
				url = options.hash.url;
			return new Handlebars.SafeString(`${settings.MEDIA_URL}${url}`);
		});
	}

	sorted_list() {
		return { brands: sort_json(catalog_data.brands) };
	}

	render() {
		if (this.#html_warapper.length !== 1) {
			return;
		}

		let template = Handlebars.compile(catalogs_hbs),
			rendered = template(this.sorted_list());
		this.#html_warapper.html(rendered);

		Fancybox.bind("[data-fancybox]", {
			hideScrollbar: false,
		});
	}
}

export default Catalogs;
