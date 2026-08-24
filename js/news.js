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
  dailyCount: 10,
  briefCount: 8,
  cacheKey: "fartle.v2.onion",

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

  loadBriefs(dateString) {
    var date = dateString || todayStamp();
    var picked = pickDaily(window.FARTLE_BRIEFS || [], date + ":briefs", this.briefCount);
    return picked.map(function (item, index) {
      var copy = {};
      Object.keys(item).forEach(function (key) {
        copy[key] = item[key];
      });
      copy.kind = "brief";
      if (index < 3) {
        copy.column = "left";
      } else if (index < 6) {
        copy.column = "right";
      } else {
        copy.column = "center";
      }
      return copy;
    });
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

window.FARTLE_BRIEFS = [
  {
    id: "council-sighing",
    section: "Civic affairs",
    headline: "Council bans outdoor sighing after a complaint from next door",
    summary:
      "A by-law drafted overnight treats heavy exhalation as a public nuisance. Residents may still breathe, but only in an indoor voice."
  },
  {
    id: "bus-timetable",
    section: "Transport",
    headline: "New bus timetable printed on thinner paper so it can leave faster",
    summary:
      "Officials said the 19:42 now weighs less and is therefore technically on time. Passengers are asked to hold their breath at stops."
  },
  {
    id: "met-office",
    section: "Meteorology",
    headline: "Met Office forecasts ‘a bit of weather’ and refuses to elaborate",
    summary:
      "A spokesperson pointed at the sky, nodded once, and went back inside. Umbrellas remain advisory. So do windows."
  },
  {
    id: "cambridge-beans",
    section: "Science",
    headline: "Cambridge study finds beans innocent, eaters less so",
    summary:
      "Researchers spent three years in a sealed room and still blamed the dog. The dog has retained counsel and a fan."
  },
  {
    id: "village-cricket",
    section: "Sport",
    headline: "Village cricket abandoned after the ball is accused of moving",
    summary:
      "The umpire inspected the atmosphere and found it guilty. Tea was taken early and not returned."
  },
  {
    id: "savile-vent",
    section: "Style",
    headline: "Savile Row unveils trousers with an emergency vent",
    summary:
      "Tailors insist it is for sudden weather. The lining is tartan, for dignity, and the receipt is already in another room."
  },
  {
    id: "letter-tuesday",
    section: "Letters",
    headline: "Sir — I have been holding this in since Tuesday",
    summary:
      "Your correspondent writes that the nation has gone soft. He would say more, but the envelope is already sealed."
  },
  {
    id: "pound-threadneedle",
    section: "Money",
    headline: "Pound twitches after an incident on Threadneedle Street",
    summary:
      "The Bank of England declined to comment, citing a sensitive odour. Markets opened a window and called it policy."
  },
  {
    id: "roses-bees",
    section: "Gardening",
    headline: "Roses blamed for attracting bees, bees blamed for everything else",
    summary:
      "The Royal Horticultural Society recommends planting something quieter. Lavender has been taken in for questioning."
  },
  {
    id: "lift-did-it",
    section: "Crime",
    headline: "Man questioned after claiming the empty lift ‘did it’",
    summary:
      "CCTV shows only one occupant. He has asked for the footage to be sniffed, not viewed."
  },
  {
    id: "ofsted-assembly",
    section: "Education",
    headline: "Ofsted rates school assembly ‘requires ventilation’",
    summary:
      "Inspectors praised the recorder concert and then opened every door. The nativity will now be staged in a field, forever."
  },
  {
    id: "mini-personality",
    section: "Motoring",
    headline: "Classic Mini recalled for storing too much personality",
    summary:
      "Owners say the car has always been like that. A spokesman recommended cracking a window, then selling the window."
  },
  {
    id: "silent-sitting",
    section: "Dining",
    headline: "Gastropub adds ‘silent sitting’ to the tasting menu",
    summary:
      "Diners pay extra not to discuss the cabbage. The sommelier pairs it with an open door and a long walk home."
  },
  {
    id: "speaker-questions",
    section: "Westminster",
    headline: "Speaker asks members to stop answering their own questions",
    summary:
      "The House divided, then regretted it. A window was opened in the Lords as a gesture of bipartisanship."
  },
  {
    id: "cows-staring",
    section: "Country diary",
    headline: "Cows accused of staring, which is fair",
    summary:
      "A walker on the footpath reported being judged from several angles. The herd issued a joint statement: grass."
  },
  {
    id: "ibsen-coughs",
    section: "Culture",
    headline: "National Theatre to stage Ibsen entirely through coughs",
    summary:
      "Critics called it unavoidable. Interval ice creams will be served in a neighbouring postcode."
  },
  {
    id: "nhs-downwind",
    section: "Health",
    headline: "NHS advises walking it off, preferably downwind",
    summary:
      "A leaflet recommends fresh air, dignity, and not using a lift. The lift union is considering industrial action."
  },
  {
    id: "fresh-air-obit",
    section: "Obituaries",
    headline: "Fresh air, beloved of rooms, dies at 4:15pm in a meeting",
    summary:
      "It is survived by a window that would not open and a man who said it wasn’t him. Donations to incense."
  },
  {
    id: "post-office-queue",
    section: "Home",
    headline: "Post Office queue declared a site of outstanding natural stillness",
    summary:
      "Walkers are invited to bring a ticket and a sense of perspective. The last person to speak is still waiting."
  },
  {
    id: "pigeon-inquiry",
    section: "London",
    headline: "Pigeon opened an inquiry into Trafalgar Square and found crumbs",
    summary:
      "The report runs to four pecks and a hard stare. Nelson, as ever, looked the other way."
  }
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
    var key = (item && (item.id || item.url)) || "";
    if (!item || !key || seen[key]) {
      continue;
    }
    seen[key] = true;
    picked.push(item);
  }
  return picked;
}

function assignColumns(items) {
  var n = items.length;
  var leftN = 0;
  var rightN = 0;
  var centerN = 0;
  if (n >= 10) {
    leftN = 3;
    rightN = 3;
    centerN = 2;
  } else if (n >= 8) {
    leftN = 3;
    rightN = 3;
    centerN = 2;
  } else if (n >= 6) {
    leftN = 2;
    rightN = 2;
    centerN = 2;
  } else if (n >= 3) {
    leftN = 1;
    rightN = 1;
    centerN = n - 2;
  } else {
    leftN = Math.ceil(n / 2);
    rightN = n - leftN;
  }
  return items.map(function (item, index) {
    var copy = {};
    Object.keys(item).forEach(function (key) {
      copy[key] = item[key];
    });
    if (index < leftN) {
      copy.column = "left";
    } else if (index < leftN + rightN) {
      copy.column = "right";
    } else if (index < leftN + rightN + centerN) {
      copy.column = "center";
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
