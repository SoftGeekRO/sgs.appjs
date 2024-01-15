import { AppConfig } from "../sgs/apps/config";

import _ from "lodash";
import $ from "jquery";

import productInfo from "../sgs/utils/product";

let gomag = _.isUndefined($.Gomag) ? null : $.Gomag;

class DatasheetTabMockup extends AppConfig {
	constructor() {
		super("DatasheetTabMockup");
		this.tabs = $("#resp-tab").find("ul > li");
	}

	render() {
		if (this.tabs.length > 0) {
			let _prod_info = productInfo(),
				_prod_name = $.parseHTML(_prod_info.product_name)[0]["wholeText"],
				tab_hook = "";

			for (let i = 0; i < this.tabs.length; i++) {
				let tab = $(this.tabs[i]);
				if (tab.text() === "Datasheet") {
					tab_hook = tab.attr("aria-controls");
					break;
				}
			}
			if (tab_hook !== "") {
				// select the content of the Datasheet attribute div
				let datasheet_tab_span = $(
						`.resp-tabs-container .product-attribute-tab[aria-labelledby=${tab_hook}] span`,
					),
					datasheet_tab_content = datasheet_tab_span.text().trim(),
					txt_elm = datasheet_tab_span
						.empty()
						.addClass("tab-attribute-span datasheet")
						.html(`Carte technica <strong>${_prod_name}</strong>: `);

				if (datasheet_tab_content.endsWith("#")) {
					return;
				}
				$("<a>", {
					title: "Datasheet",
					href: datasheet_tab_content,
					target: "_blank",
				})
					.text("click aici")
					.appendTo(txt_elm);
			}
		}
	}

	ready() {
		let self = this;
		if (gomag !== null && !_.isUndefined(gomag.bind)) {
			gomag.bind("Gomag.ajaxContentLoadedComplete", function (event, data) {
				self.render();
			});
		}
	}
}

export default DatasheetTabMockup;
