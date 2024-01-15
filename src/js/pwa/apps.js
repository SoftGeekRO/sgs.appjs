import { AppConfig } from "../sgs/apps/config";

import $ from "jquery";
import _ from "lodash";

import { settings } from "../sgs/config/settings";

class SGSPWA extends AppConfig {
	manifest = $('link[rel="manifest"]');
	constructor() {
		super("SGSPWA");
	}

	render() {
		let manifest_link = $("<link>").attr({
			rel: "manifest",
			crossorigin: "use-credentials",
			href: `${settings.CDN_BASE_URL}sgs.app/manifest.json`,
		});
		manifest_link.insertBefore("link[rel='preconnect']:first");
	}

	ready() {
		if (!_.isEmpty(this.manifest)) {
			return;
		}
		this.render();
	}
}

export default SGSPWA;
