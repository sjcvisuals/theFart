/**
 * Display advertising for The Daily Fart.
 *
 * Leave adsenseClient empty until Google AdSense has approved the site.
 * House ads still occupy the wells so the paper looks like a paper.
 * Exact AdSense clicks: SETUP.md part B.
 * GitHub Pages allows donation links; paste a Ko-fi URL into supportUrl
 * if AdSense is refused.
 */
(function () {
  "use strict";

  window.FARTLE_ADS = {
    adsenseClient: "",
    slots: {
      left: "",
      right: "",
      bottom: ""
    },
    supportUrl: "",
    advertiseUrl: ""
  };

  var HOUSE = {
    left: {
      kicker: "To let",
      headline: "This space to let",
      text: "A modest square on the late city edition. No pop-ups. Never over the puzzle."
    },
    right: {
      kicker: "Subscription",
      headline: "Keep the presses windy",
      text: "A pint for the compositor goes further than a dancing banner."
    },
    bottom: {
      kicker: "Display",
      headline: "Advertise in The Daily Fart",
      text: "A strip along the bottom of the paper. Small rates for a small smell. The puzzle stays clear."
    }
  };

  document.addEventListener("DOMContentLoaded", paintAds);

  function paintAds() {
    var cfg = window.FARTLE_ADS || {};
    var placements = ["left", "right", "bottom"];
    var useAdsense = Boolean(cfg.adsenseClient && /^ca-pub-\d+$/.test(cfg.adsenseClient));

    if (useAdsense) {
      loadAdsense(cfg.adsenseClient);
    }

    var adsenseCount = 0;
    placements.forEach(function (placement) {
      var root = document.getElementById("ad-" + placement);
      if (!root) {
        return;
      }
      root.innerHTML = "";
      var slot = cfg.slots && cfg.slots[placement];
      if (useAdsense && slot) {
        root.appendChild(buildAdsenseUnit(cfg.adsenseClient, slot, placement));
        adsenseCount += 1;
        return;
      }
      root.appendChild(buildHouseAd(placement, cfg));
    });

    if (adsenseCount) {
      window.setTimeout(function () {
        var i;
        try {
          for (i = 0; i < adsenseCount; i += 1) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        } catch (err) {
          // House ads remain if the network blocks the script.
        }
      }, 80);
    }
  }

  function loadAdsense(client) {
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
  }

  function buildAdsenseUnit(client, slot, placement) {
    var ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.setAttribute("data-ad-client", client);
    ins.setAttribute("data-ad-slot", slot);
    ins.setAttribute("data-full-width-responsive", "true");
    if (placement === "bottom") {
      ins.setAttribute("data-ad-format", "horizontal");
    } else {
      ins.setAttribute("data-ad-format", "rectangle");
    }
    return ins;
  }

  function buildHouseAd(placement, cfg) {
    var copy = HOUSE[placement] || HOUSE.bottom;
    var article = document.createElement("article");
    article.className = "ad-house";

    var kicker = document.createElement("p");
    kicker.className = "ad-house-kicker";
    kicker.textContent = copy.kicker;

    var heading = document.createElement("h3");
    heading.textContent = copy.headline;

    var text = document.createElement("p");
    text.textContent = copy.text;

    article.appendChild(kicker);
    article.appendChild(heading);
    article.appendChild(text);

    var href = "";
    var label = "Apply to the advertising desk";
    if (placement === "right" && cfg.supportUrl) {
      href = cfg.supportUrl;
      label = "Stand the compositor a pint";
    } else if (cfg.advertiseUrl) {
      href = cfg.advertiseUrl;
    }

    if (href) {
      var link = document.createElement("a");
      link.className = "ad-house-link";
      link.href = href;
      if (/^https?:/i.test(href)) {
        link.target = "_blank";
        link.rel = "noopener noreferrer sponsored";
      }
      link.textContent = label;
      article.appendChild(link);
    }

    return article;
  }
})();
