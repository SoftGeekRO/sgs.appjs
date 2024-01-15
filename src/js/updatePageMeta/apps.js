import { AppConfig } from "../sgs/apps/config";

import $ from "jquery";
import _ from "lodash";

import { settings } from "../sgs/config/settings";

import productInfo from "../sgs/utils/product";

class UpdatePageMeta extends AppConfig {
	constructor() {
		super("UpdatePageMeta");
		this.productInfo = productInfo();
	}

	render() {
		let meta_author = $('meta[name="author"]');
		if (!_.isEmpty(meta_author)) {
			meta_author.attr("content", settings.AUTHOR_NAME);
		}

		if (this.productInfo) {
			document.querySelector("title").textContent =
				`${this.productInfo.product_brand} - ${document.title} | ${settings.COMPANY_NAME}`;
			$('meta[name="description"]').attr(
				"content",
				this.productInfo.product_description,
			);
		}
	}

	ready() {
		this.render();
	}
}

export default UpdatePageMeta;
