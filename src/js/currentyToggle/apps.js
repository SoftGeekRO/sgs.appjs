import { AppConfig } from "../sgs/apps/config";

import $ from "jquery";
import _ from "lodash";

class CurrentyToggle extends AppConfig {
	constructor() {
		super("CurrentyToggle");
	}

	render() {
		const curreny_map = {
				RON: "RON lei",
				EUR: "EUR €",
			},
			currenty_display = $(
				".acount-section ul li span.currency e._currencyDisplay",
			);
		currenty_display.html(curreny_map[currenty_display.html()]);

		$(".currency a.currencyList").each(function (ndx, item) {
			$(this).html(curreny_map[$(this).html()]);
		});
	}

	ready() {
		if (!_.isEmpty($(".currency a.currencyList"))) {
			this.render();
		}
	}
}

export default CurrentyToggle;
