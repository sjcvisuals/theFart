/**
 * Newspaper copy for The Daily Fart.
 *
 * Articles are stored in a simple, API-shaped list so they can later be
 * replaced with a real news feed (headline, summary, section, byline).
 *
 * The game must run with no API key. loadNewsArticles() currently returns
 * this local data; swap the body of that function to call a backend later.
 */
window.FARTLE_NEWS_API = {
  /**
   * Optional future endpoint. Left blank on purpose.
   * Example: "https://example.com/api/headlines"
   */
  url: "",
  /**
   * Fetch articles for the edition.
   * @returns {Promise<Array<object>>}
   */
  async loadNewsArticles() {
    // Future replacement:
    // const response = await fetch(this.url, { headers: { ... } });
    // if (!response.ok) throw new Error("Newsroom silent");
    // return response.json();
    return window.FARTLE_NEWS;
  }
};

window.FARTLE_NEWS = [
  {
    id: "pm-crisis",
    column: "left",
    section: "Politics",
    kicker: "Westminster",
    headline: "Prime Minister Faces Fresh FART Crisis",
    summary:
      "Allies insisted the situation was 'under control' as another awkward briefing leaked from No. 10. Experts remain divided over whether the nation is prepared.",
    byline: "By P. Windbag"
  },
  {
    id: "deep-space",
    column: "left",
    section: "Science",
    kicker: "Astronomy",
    headline: "Scientists Discover Mysterious FART in Deep Space",
    summary:
      "Radio telescopes in Cheshire picked up a low-frequency burst that researchers described as 'unexplained, spherical, and faintly embarrassing'. Peer review continues, windows closed.",
    byline: "By Dr I. M. Gaseous"
  },
  {
    id: "un-talks",
    column: "left",
    section: "World",
    kicker: "Diplomacy",
    headline: "United Nations Calls Emergency Session Over Unexplained FART",
    summary:
      "Delegates agreed the incident was 'deeply regrettable' and promised a strongly worded communique. Translation headsets were briefly abandoned.",
    byline: "By A. Envoy"
  },
  {
    id: "england-sport",
    column: "right",
    section: "Sport",
    kicker: "The back page",
    headline: "England Prepare for Crucial FART Showdown",
    summary:
      "The manager asked supporters to get behind the team and, if possible, slightly further behind. Training-ground sources reported 'a lot of shape work'.",
    byline: "By G. Kick"
  },
  {
    id: "tech-giant",
    column: "right",
    section: "Technology",
    kicker: "Silicon roundabout",
    headline: "Technology Giant Unveils Revolutionary New FART",
    summary:
      "The device is thinner, quieter, and available in three colours nobody asked for. Analysts said it would change everything, then opened a window.",
    byline: "By C. Lick"
  },
  {
    id: "markets",
    column: "right",
    section: "Business",
    kicker: "Fartonomics",
    headline: "Markets Rise After Surprise FART Announcement",
    summary:
      "Traders caught wind of the news shortly after lunch. Futures remained volatile, gilts held their nerve, and at least one analyst asked to work from home.",
    byline: "By L. Sterling"
  },
  {
    id: "awards",
    column: "bottom",
    section: "Entertainment",
    kicker: "Showbusiness",
    headline: "Awards Season Thrown Into Chaos By Surprise FART",
    summary:
      "A leading actor described the moment as 'raw' and 'unscripted'. The orchestra played on, professionally.",
    byline: "By T. Footlight"
  },
  {
    id: "weather-warning",
    column: "bottom",
    section: "Weather",
    kicker: "Met Office",
    headline: "Forecasters Issue Rare Amber FART Warning",
    summary:
      "High pressure is expected to build from the west, with a chance of isolated gusts after tea. The public is advised to remain indoors, or at least upwind.",
    byline: "By F. Cast"
  },
  {
    id: "high-street",
    column: "bottom",
    section: "Business",
    kicker: "The shops",
    headline: "High Street Braces For Weekend Of Heavy FART",
    summary:
      "Retailers reported strong footfall and weak air quality. One department store offered a silent hour, which lasted eleven minutes.",
    byline: "By M. Till"
  }
];

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
