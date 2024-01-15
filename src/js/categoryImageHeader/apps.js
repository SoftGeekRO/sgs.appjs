import { AppConfig } from "../sgs/apps/config";

import $ from "jquery";
import _ from "lodash";

class CategoryImageHeader extends AppConfig {
	// Add class to header text when category contains image
	// image must be inside a div with class="category-image-header"
	constructor() {
		super("CategoryImageHeader");
	}

	render() {
		const img_header = $("#category-page .catDesc .category-image-header"),
			title_style_color = img_header.data("title_color"),
			title_style_hidden = img_header.data("title_hide"),
			catTitle = $("#category-page .category-content .catTitle"),
			catclone = catTitle.clone(true),
			cat_title_group = $("<div>", {
				class: "catTitle-bg",
			}).append(catclone);

		if (title_style_hidden) {
			catTitle.hide();
		} else {
			if (title_style_color) {
				cat_title_group.insertBefore("#category-page .catDesc");
				$("#category-page .catTitle-bg .catTitle").css({
					color: title_style_color,
				});
				catTitle.remove();
			}
		}

		if (img_header.length === 1) {
			$("#category-page .category-content .catDesc").css({ "padding-top": 0 });
			$("#category-page .catTitle").addClass("catTitle-image-header");
		}
	}

	ready() {
		if (!_.isEmpty($("#category-page"))) {
			this.render();
		}
	}
}

export default CategoryImageHeader;
