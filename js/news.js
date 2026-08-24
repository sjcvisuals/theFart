/**
 * Daily edition copy from The Onion.
 *
 * Headlines are fetched at runtime from The Onion's public RSS feed and
 * linked back to the original articles. Nothing from The Onion is stored
 * in this repository. No API key is required.
 *
 * loadNewsArticles(dateString) picks a stable set for the local calendar
 * date so the columns change with each new Fartle, not on every refresh.
 */
(function () {
  "use strict";

  window.FARTLE_NEWS_API = {
  homeUrl: "https://theonion.com/",
  feedUrl: "https://theonion.com/feed/",
  jsonFeedUrl:
    "https://api.rss2json.com/v1/api.json?rss_url=" +
    encodeURIComponent("https://theonion.com/feed/"),
  dailyCount: 6,
  cacheKey: "fartle.v1.onion",

  async loadNewsArticles(dateString) {
    var date = dateString || todayStamp();
    var cached = readEdition(this.cacheKey, date);
    if (cached && cached.length) {
      return assignColumns(cached);
    }

    var items = [];
    try {
      items = await this.fetchEdition();
    } catch (err) {
      items = [];
    }

    if (!items.length) {
      return [];
    }

    var picked = pickDaily(items, date, this.dailyCount);
    writeEdition(this.cacheKey, date, picked);
    return assignColumns(picked);
  },

  async fetchEdition() {
    var jsonResponse = await fetchWithTimeout(this.jsonFeedUrl, 8000);
    if (!jsonResponse.ok) {
      throw new Error("Onion wires down");
    }
    var data = await jsonResponse.json();
    if (!data || data.status !== "ok" || !Array.isArray(data.items)) {
      throw new Error("Onion wires unreadable");
    }
    var items = data.items.map(fromJsonItem).filter(Boolean);
    if (!items.length) {
      throw new Error("Onion wires empty");
    }
    return items;
  }
};

window.FARTLE_WEATHER = [
  "Scattered toots, clearing later. Wind: variable.",
  "A ridge of high pressure. Outlook: tense.",
  "Mist in low-lying areas. Avoid still rooms.",
  "Sunshine and showers, not necessarily of rain.",
  "A brisk south-westerly. Hold onto your hat.",
  "Fog expected on the M25. And in several lifts.",
  "Unseasonably close. Windows recommended."
];

window.FARTLE_CLASSIFIEDS = [
  {
    id: "lost-atmosphere",
    heading: "LOST",
    text: "One atmosphere. Last seen near a Mini Cooper. Sentimental value only."
  },
  {
    id: "for-sale-air",
    heading: "FOR SALE",
    text: "Used air. Buyer collects. No returns. Bring your own jar."
  },
  {
    id: "situations",
    heading: "SITUATIONS VACANT",
    text: "Junior reporter required. Must be able to hold a thought, and it in."
  }
];

function todayStamp() {
  var d = new Date();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + m + "-" + day;
}

async function fetchWithTimeout(url, ms) {
  var controller = new AbortController();
  var timer = window.setTimeout(function () {
    controller.abort();
  }, ms);
  try {
    return await fetch(url, { mode: "cors", signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

function fromJsonItem(item) {
  return normalizeItem(item || {});
}

function normalizeItem(item) {
  var url = cleanOnionUrl(item.link || item.url);
  var headline = decodeEntities(String(item.title || "").trim());
  if (!url || !headline) {
    return null;
  }
  var summary = tidySummary(plainText(item.description || item.content || ""));
  var section = "";
  if (Array.isArray(item.categories) && item.categories.length) {
    section = String(item.categories[0] || "").trim();
  }
  return {
    id: url,
    headline: headline,
    summary: summary,
    url: url,
    section: section,
    byline: item.author ? String(item.author).trim() : "The Onion",
    source: "The Onion"
  };
}

function cleanOnionUrl(value) {
  try {
    var url = new URL(String(value || ""));
    if (!/(^|\.)theonion\.com$/i.test(url.hostname)) {
      return "";
    }
    url.hash = "";
    return url.toString();
  } catch (err) {
    return "";
  }
}

function pickDaily(items, dateString, count) {
  var n = Math.min(count, items.length);
  if (!n) {
    return [];
  }
  var start = dateSeed(dateString) % items.length;
  var picked = [];
  var seen = {};
  var i = 0;
  while (picked.length < n && i < items.length * 2) {
    var item = items[(start + i) % items.length];
    i += 1;
    if (!item || seen[item.url]) {
      continue;
    }
    seen[item.url] = true;
    picked.push(item);
  }
  return picked;
}

function assignColumns(items) {
  return items.map(function (item, index) {
    var copy = {};
    Object.keys(item).forEach(function (key) {
      copy[key] = item[key];
    });
    if (index < 2) {
      copy.column = "left";
    } else if (index < 4) {
      copy.column = "right";
    } else {
      copy.column = "bottom";
    }
    return copy;
  });
}

function dateSeed(dateString) {
  var n = 0;
  var i;
  for (i = 0; i < dateString.length; i += 1) {
    n = (n * 31 + dateString.charCodeAt(i)) >>> 0;
  }
  return n;
}

function plainText(html) {
  if (!html) {
    return "";
  }
  var doc = new DOMParser().parseFromString(String(html), "text/html");
  var text = (doc.body && doc.body.textContent) || "";
  return decodeEntities(text).replace(/\s+/g, " ").trim();
}

function tidySummary(text) {
  var cleaned = String(text || "")
    .replace(/The post\s.+?\sappeared first on The Onion\.?/i, "")
    .replace(/What do you think\??/i, "")
    .trim();
  if (cleaned.length <= 180) {
    return cleaned;
  }
  var cut = cleaned.slice(0, 180);
  var last = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "));
  if (last > 70) {
    return cut.slice(0, last + 1);
  }
  return cut.replace(/\s+\S*$/, "") + "…";
}

function decodeEntities(value) {
  var area = document.createElement("textarea");
  area.innerHTML = value;
  return area.value;
}

function readEdition(key, date) {
  try {
    var raw = window.localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    var parsed = JSON.parse(raw);
    if (!parsed || parsed.date !== date || !Array.isArray(parsed.articles)) {
      return null;
    }
    return parsed.articles;
  } catch (err) {
    return null;
  }
}

function writeEdition(key, date, articles) {
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify({ date: date, articles: articles })
    );
  } catch (err) {
    // Ignore full or private storage.
  }
}
})();
