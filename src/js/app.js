/* Boostrap code from inside the GoMag framework
   suggestion to minimize the code

(function(w,d) {
    var st = d.createElement('link'),
    sc=d.createElement('script'),
    sc_pre = d.createElement('link'),
    _debug = new URLSearchParams(window.location.search).get('_'),
    no_cache = (_debug != null && _debug.toLowerCase() === 'true') ? new Date().getTime() : "",
    sgs_app_href = `https://cdn.sgsolar.ro/sgs.app/js/load.chunks.js`;

    st.type = 'text/css';
    st.rel = 'stylesheet';
    st.href = `https://cdn.sgsolar.ro/assets/css/sgs_style.css`;

    if (no_cache) {
      st.href = st.href + "?v="+no_cache;
    }

    sc.src = sgs_app_href;
    if (no_cache) {
      sc.src = sc.src+"?v="+no_cache;
    }

    sc.async = true;
    sc.onload = () => {
        console.info(`%cAsset loaded: ${sc.src}`, 'background: #222; color: #bada55');
    };
    sc.onerror = () => {
        console.error(`%cAsset fail to load: ${sc.src}`, 'background: #222; color: #bada55');
    };
    d.addEventListener("sgs.app.load", () => {
      let sgs_app_after_elm = d.body.querySelector("script[src*='30.js']") || d.body.querySelector("script[src*='default.js']");
      d.body.insertBefore(sc, sgs_app_after_elm.nextSibling)
    })
})(window, document);


----==== Trigger the script insert after the final GoMag script is executed ====----

let sgs_bootstrap = new Event('sgs.app.load', {
    bubbles: true
})
document.dispatchEvent(sgs_bootstrap);

*/

import { settings } from "./sgs/config/settings";
import { load_signal } from "./sgs/core/signals";

import apps from "./sgs/apps/registry";

apps.populate(settings.INSTALLED_APPS);
