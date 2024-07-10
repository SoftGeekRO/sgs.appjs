
import $ from "jquery";
import _ from "lodash";
import { AppConfig } from "../sgs/apps/config";

import { settings } from "../sgs/config/settings";
import SGSPWA from "../pwa/apps";

class SGDISTRIBUTION extends AppConfig {

	constructor() {
		super("SGDISTRIBUTION");
	}

	render() {
		let social_div = $(".bottom-section .holder .container-h .col.social"),
			distribution_content = "<p class='title'>Distributie B2B</p>" +
				"<a href='https://www.softgeek.ro' target='_blank'>" +
				"<img src='https://cdn.sgsolar.ro/softgeek.ro/logo/sg_distribution_logo_350x150.png' alt='SG Distribution B2B' style='margin:auto'>" +
				"</a>";
		$("<div>").html(distribution_content).insertAfter(social_div).addClass("col sg-distribution");

	}

	ready() {
		this.render();
	}

}

export default SGDISTRIBUTION;