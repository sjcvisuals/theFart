/**
 * Display advertising for The Daily Fart.
 *
 * Publisher id lives in js/adsense-config.js. Until Google approves the
 * site, the wells keep house ads underneath and hide them when a unit fills.
 * Ads never sit on the puzzle.
 */
(function () {
  "use strict";

  window.FARTLE_ADS = window.FARTLE_ADS || {
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

  function adsenseClient() {
    var a = window.FARTLE_ADSENSE || {};
    var b = window.FARTLE_ADS || {};
    var raw = String(a.client || b.adsenseClient || "").trim();
    return /^ca-pub-\d+$/.test(raw) ? raw : "";
  }

  function adsenseSlot(placement) {
    var a = window.FARTLE_ADSENSE || {};
    var b = window.FARTLE_ADS || {};
    var slots = a.slots || b.slots || {};
    var slot = String(slots[placement] || "").trim();
    return /^\d+$/.test(slot) ? slot : "";
  }

  function paintAds() {
    var cfg = window.FARTLE_ADS || {};
    var client = adsenseClient();
    var placements = ["left", "right", "bottom"];
    var adsenseCount = 0;

    placements.forEach(function (placement) {
      var root = document.getElementById("ad-" + placement);
      if (!root) {
        return;
      }
      root.innerHTML = "";
      if (client) {
        root.appendChild(buildAdsenseUnit(client, adsenseSlot(placement), placement));
        adsenseCount += 1;
        root.classList.add("is-live");
        var well = root.closest(".ad-well");
        if (well) {
          well.classList.add("is-live");
        }
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

  function buildAdsenseUnit(client, slot, placement) {
    var ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.setAttribute("data-ad-client", client);
    ins.setAttribute("data-full-width-responsive", "true");
    ins.style.display = "block";
    if (slot) {
      ins.setAttribute("data-ad-slot", slot);
    }
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
