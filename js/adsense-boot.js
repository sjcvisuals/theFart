/**
 * Put the official AdSense snippet in <head> so Google can verify the site.
 */
(function () {
  "use strict";

  var client = adsenseClient();
  if (!client) {
    return;
  }

  if (!document.querySelector('meta[name="google-adsense-account"]')) {
    var meta = document.createElement("meta");
    meta.name = "google-adsense-account";
    meta.content = client;
    document.head.appendChild(meta);
  }

  if (document.querySelector("script[data-fartle-adsense]")) {
    return;
  }

  var script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src =
    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
    encodeURIComponent(client);
  script.setAttribute("data-fartle-adsense", "true");
  document.head.appendChild(script);

  function adsenseClient() {
    var a = window.FARTLE_ADSENSE || {};
    var b = window.FARTLE_ADS || {};
    var raw = String(a.client || b.adsenseClient || "").trim();
    return /^ca-pub-\d+$/.test(raw) ? raw : "";
  }
})();
