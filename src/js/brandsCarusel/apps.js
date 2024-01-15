import $ from "jquery";
import { BaseApp } from "../sgs/core/baseApp";

import "bxslider/dist/jquery.bxslider.min";
import "jquery-ui/dist/jquery-ui.min";

import { settings } from "../sgs/config/settings";
import { load_signal } from "../sgs/core/signals";
import { AppConfig } from "../sgs/apps/config";
import companies_data from "./companiesList.json";

const BRANDS_URL =
	"https://gomagcdn.ro/domains2/sgsolar.ro/files/brand/original/";

let defaults = {
	controls: false,
	pager: false,
	auto: true,
	speed: 200,
	minSlides: 1,
	maxSlides: 18,
	slideWidth: 100,
	slideMargin: 50,
	moveSlides: 1,
	easing: "cubic-bezier(0.165, 0.84, 0.44, 1)",
	// shrinkItems: true,
	preloadImages: "all",
	onSliderLoad: () => {
		load_signal.trigger("SGS.bxslider", { elm: this });
	},
};

load_signal.bind("SGS.bxslider", (evt, prop) => {
	$(".sg-brands-slider .bx-wrapper").css({
		"max-width": "none",
		"margin-bottom": "5px",
	});
	$(".sg-brands-slider .bxslider").css({
		display: "flex",
	});
	$(".sg-brands-slider .bxslider li").css({
		"align-self": "center",
	});
	$(".sg-brands-slider").css({ visibility: "visible" });
});

class BrandsCarusel extends AppConfig {
	#wrapper = $("<div/>").addClass("sg-brands-slider container-h").css({ visibility: "hidden" });

	#carusel = $("<ul/>").addClass("bxslider");
	constructor() {
		super("BrandsCarusel");

		this.allOptions = { ...defaults };
	}

	ready() {
		if ($("#-g-footer-general-before").length === 1) {
			this.render();
		}
	}

	render() {
		Object.entries(companies_data).forEach((elm, ndx) => {
			let [brand, [brand_img, url]] = elm,
				imgElm = $("<img/>").attr({
					src: BRANDS_URL + brand_img,
					title: brand,
					decoding: "sync",
				}),
				aLink = $("<a>", { title: brand }).attr("href", url).html(imgElm),
				inner = $("<li/>").addClass("glide__slide").append(aLink);

			inner.appendTo(this.#carusel);
		});
		this.#carusel.appendTo(this.#wrapper);

		this.#wrapper.insertBefore("#-g-footer-general-before");
		$(".bxslider").bxSlider(this.allOptions);
	}
}

export default BrandsCarusel;
