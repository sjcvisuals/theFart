/**
 * Daily Fartle objects.
 *
 * One average human fart is treated as 100 mL (0.1 litres) of gas.
 * fartCount ≈ volumeLitres / 0.1, rounded to a sensible whole number.
 *
 * Order matters: the daily puzzle rotates through this list by calendar date.
 * Keep ids stable if you add new objects at the end.
 */
window.FART_VOLUME_LITRES = 0.1;

window.FARTLE_OBJECTS = [
  {
    id: "pint-glass",
    name: "Pint glass",
    emoji: "🍺",
    volumeLitres: 0.57,
    fartCount: 6,
    description: "A proper imperial pint. Not a half. Not a schooner. A pint.",
    successMessage: "Your landlord would still charge you extra.",
    failMessage: "Even the barmaid had it in one.",
    caption: "Last orders, in theory."
  },
  {
    id: "espresso-cup",
    name: "Espresso cup",
    emoji: "☕",
    volumeLitres: 0.06,
    fartCount: 1,
    description: "A thimble for people in a hurry. One careful toot should do it.",
    successMessage: "One perfect toot. Italian in spirit only.",
    failMessage: "It was one. One fart. The smallest puzzle of the year.",
    caption: "Served without dignity."
  },
  {
    id: "thermos",
    name: "Thermos flask",
    emoji: "🫖",
    volumeLitres: 0.75,
    fartCount: 8,
    description: "Still warm from Tuesday's tea and absolutely not designed for this.",
    successMessage: "It will still smell like that at Christmas.",
    failMessage: "Eight. The flask has seen worse, but only just.",
    caption: "Keeps things hot. Unfortunately."
  },
  {
    id: "kettle",
    name: "Kettle",
    emoji: "♨️",
    volumeLitres: 1.7,
    fartCount: 17,
    description: "Just boiled. Deeply unwise to fill with anything else.",
    successMessage: "Put the kettle on. Then open a window.",
    failMessage: "Seventeen farts. About the same as a long committee meeting.",
    caption: "National emergency, 1.7 litres."
  },
  {
    id: "teapot",
    name: "Teapot",
    emoji: "🍵",
    volumeLitres: 1.2,
    fartCount: 12,
    description: "China, floral, and presently considering a career change.",
    successMessage: "The Queen is not amused. Nor is the tea.",
    failMessage: "Twelve. A dozen toots for a domestic vessel.",
    caption: "Brewed for a very different purpose."
  },
  {
    id: "wellington-boot",
    name: "Wellington boot",
    emoji: "🥾",
    volumeLitres: 4.8,
    fartCount: 48,
    description: "Left foot. Slightly damp. Occupant unknown.",
    successMessage: "There are frogs who would disagree with your methods.",
    failMessage: "Forty-eight farts. The right boot remains at large.",
    caption: "Size 10, morale size 2."
  },
  {
    id: "football",
    name: "Football",
    emoji: "⚽",
    volumeLitres: 5.5,
    fartCount: 55,
    description: "A regulation Size 5, slightly muddy, entirely unsuitable.",
    successMessage: "Even the referee would have given that.",
    failMessage: "Fifty-five. VAR has reviewed the volume and upheld it.",
    caption: "Match ball, yesterday's kickabout."
  },
  {
    id: "briefcase",
    name: "Briefcase",
    emoji: "💼",
    volumeLitres: 15,
    fartCount: 150,
    description: "Combination 000. Contents: a sandwich and a sense of dread.",
    successMessage: "HR have been informed.",
    failMessage: "One hundred and fifty. The sandwich did not survive.",
    caption: "City gent, unspecified firm."
  },
  {
    id: "microwave",
    name: "Microwave",
    emoji: "📦",
    volumeLitres: 25,
    fartCount: 250,
    description: "Eight hundred watts of kitchen optimism and one terrible idea.",
    successMessage: "Do not, under any circumstances, press start.",
    failMessage: "Two hundred and fifty. The baked potato is suing.",
    caption: "800W. Zero judgement."
  },
  {
    id: "washing-machine",
    name: "Washing machine",
    emoji: "🌀",
    volumeLitres: 60,
    fartCount: 600,
    description: "Quick wash. Extra spin. No further comments at this time.",
    successMessage: "The neighbours have already heard.",
    failMessage: "Six hundred. The socks have requested a transfer.",
    caption: "Cotton cycle, moral cycle unknown."
  },
  {
    id: "dustbin",
    name: "Dustbin",
    emoji: "🪣",
    volumeLitres: 80,
    fartCount: 800,
    description: "The old-fashioned kind, before wheels were considered luxurious.",
    successMessage: "Next collection: never.",
    failMessage: "Eight hundred farts. The foxes have moved to the next street.",
    caption: "Council issue, pre-wheel."
  },
  {
    id: "space-hopper",
    name: "Space hopper",
    emoji: "🟠",
    volumeLitres: 90,
    fartCount: 900,
    description: "Orange, squeaky, and a relic of better afternoons.",
    successMessage: "You may now bounce, though we would not.",
    failMessage: "Nine hundred. Childhood is cancelled.",
    caption: "Inflated, 1974, never the same again."
  },
  {
    id: "fish-tank",
    name: "Fish tank",
    emoji: "🐠",
    volumeLitres: 100,
    fartCount: 1000,
    description: "Home to three goldfish, one plastic castle, and now this.",
    successMessage: "The goldfish have unionised.",
    failMessage: "A round thousand. The castle has surrendered.",
    caption: "Freshwater, formerly."
  },
  {
    id: "pillar-box",
    name: "Pillar box",
    emoji: "📮",
    volumeLitres: 140,
    fartCount: 1400,
    description: "VR standing for Very Roomy, apparently. Letters may be delayed.",
    successMessage: "Royal Mail politely declines to comment.",
    failMessage: "Fourteen hundred. First class, in a manner of speaking.",
    caption: "Last collection: 5.30pm. Last dignity: earlier."
  },
  {
    id: "bathtub",
    name: "Bathtub",
    emoji: "🛁",
    volumeLitres: 180,
    fartCount: 1800,
    description: "Four legs, one plug, and absolutely no remaining romance.",
    successMessage: "Do not attempt to verify this at home.",
    failMessage: "Eighteen hundred. The rubber duck has left the building.",
    caption: "Enamel, slightly stained, spiritually ruined."
  },
  {
    id: "wheelie-bin",
    name: "Wheelie bin",
    emoji: "🗑️",
    volumeLitres: 240,
    fartCount: 2400,
    description: "The grey sentinel of British driveways. Lid optional, regret included.",
    successMessage: "The binmen will be delighted.",
    failMessage: "Two thousand four hundred. Put it out on Tuesday.",
    caption: "Grey bin, ordinary Wednesday."
  },
  {
    id: "canoe",
    name: "Canoe",
    emoji: "🛶",
    volumeLitres: 280,
    fartCount: 2800,
    description: "Two seats. One terrible idea. Life jackets advised for everyone else.",
    successMessage: "Please remain seated until the gas has settled.",
    failMessage: "Twenty-eight hundred. The river has taken legal advice.",
    caption: "Portage not recommended today."
  },
  {
    id: "fridge-freezer",
    name: "Fridge-freezer",
    emoji: "❄️",
    volumeLitres: 380,
    fartCount: 3800,
    description: "The light is still on. The milk is watching. The peas have opinions.",
    successMessage: "The cheese has seen things.",
    failMessage: "Three thousand eight hundred. Best before: immediately.",
    caption: "Family model, open-plan interior."
  },
  {
    id: "paddling-pool",
    name: "Paddling pool",
    emoji: "🛟",
    volumeLitres: 500,
    fartCount: 5000,
    description: "Bought in a heatwave. Used twice. Stored in the shed ever since.",
    successMessage: "The children have gone inside. Forever.",
    failMessage: "Five thousand. A round number for a round inflatable.",
    caption: "August, garden, poor planning."
  },
  {
    id: "mini-cooper",
    name: "Mini Cooper",
    emoji: "🚗",
    volumeLitres: 1243,
    fartCount: 12430,
    description: "A small car with a large personality and limited air circulation.",
    successMessage: "Scientists are disappointed you know this.",
    failMessage: "Twelve thousand four hundred and thirty. The union jack roof has retired.",
    caption: "Parked, windows up, a mistake."
  },
  {
    id: "phone-box",
    name: "Phone box",
    emoji: "☎️",
    volumeLitres: 1500,
    fartCount: 15000,
    description: "Bright red. Slightly smelly already. Usually out of order.",
    successMessage: "Superman is already inside, holding his breath.",
    failMessage: "Fifteen thousand. Directory Enquiries hung up.",
    caption: "K6 kiosk, Westminster, theoretically."
  },
  {
    id: "portaloo",
    name: "Portaloo",
    emoji: "🚻",
    volumeLitres: 1700,
    fartCount: 17000,
    description: "A small room for big decisions. The irony is doing some heavy lifting.",
    successMessage: "The irony is not lost on us. Or on anyone within a mile.",
    failMessage: "Seventeen thousand. Festival season continues, somehow.",
    caption: "Blue plastic, yellow caution."
  },
  {
    id: "lift",
    name: "Lift",
    emoji: "🛗",
    volumeLitres: 4500,
    fartCount: 45000,
    description: "Capacity: eight persons. Or one idea, poorly timed.",
    successMessage: "Please mind the gap. And the atmosphere.",
    failMessage: "Forty-five thousand. The ground floor has never looked so appealing.",
    caption: "Between floors, indefinitely."
  },
  {
    id: "skip",
    name: "Skip",
    emoji: "🏗️",
    volumeLitres: 6000,
    fartCount: 60000,
    description: "Builders' favourite. Piano optional. Neighbours furious either way.",
    successMessage: "Someone will still try to put a sofa in it.",
    failMessage: "Sixty thousand. Permit expired at noon.",
    caption: "Hired until Friday. Odour until March."
  },
  {
    id: "garden-shed",
    name: "Garden shed",
    emoji: "🛠️",
    volumeLitres: 9000,
    fartCount: 90000,
    description: "Home to a rusty lawnmower, three tins of paint, and several secrets.",
    successMessage: "The spiders have filed a complaint.",
    failMessage: "Ninety thousand. Dad is not coming out.",
    caption: "6x4, creosote, locked from inside."
  },
  {
    id: "igloo",
    name: "Igloo",
    emoji: "🧊",
    volumeLitres: 12000,
    fartCount: 120000,
    description: "Compact, spherical, and a triumph of insulation. Unfortunately.",
    successMessage: "The polar bears have moved next door.",
    failMessage: "One hundred and twenty thousand. Spring arrived early.",
    caption: "Artist's impression, slightly melted."
  },
  {
    id: "greenhouse",
    name: "Greenhouse",
    emoji: "🌱",
    volumeLitres: 15000,
    fartCount: 150000,
    description: "Tomatoes, a watering can, and a lingering sense of horticultural shame.",
    successMessage: "The tomatoes are blushing for a different reason.",
    failMessage: "One hundred and fifty thousand. The courgettes have bolted.",
    caption: "Glass, aluminium, no ventilation plan."
  },
  {
    id: "caravan",
    name: "Caravan",
    emoji: "🚐",
    volumeLitres: 16000,
    fartCount: 160000,
    description: "A bungalow that goes on holiday and never quite forgives you.",
    successMessage: "The campsite has asked you to leave.",
    failMessage: "One hundred and sixty thousand. Hook-up disconnected.",
    caption: "Pitch 14, awning down, spirits lower."
  },
  {
    id: "london-eye-capsule",
    name: "London Eye capsule",
    emoji: "🎡",
    volumeLitres: 25000,
    fartCount: 250000,
    description: "A glass egg with a view, thirty minutes of company, and nowhere to hide.",
    successMessage: "Tourists below remain blissfully unaware.",
    failMessage: "A quarter of a million. The rotation has been paused.",
    caption: "Capsule 12, half rotation, full regret."
  },
  {
    id: "conservatory",
    name: "Conservatory",
    emoji: "🏡",
    volumeLitres: 30000,
    fartCount: 300000,
    description: "Added in 1998. Still called 'the new bit'. Mostly used at Christmas.",
    successMessage: "Your in-laws felt that.",
    failMessage: "Three hundred thousand. Planning permission did not cover this.",
    caption: "South-facing, curtains drawn."
  },
  {
    id: "shipping-container",
    name: "Shipping container",
    emoji: "📦",
    volumeLitres: 33200,
    fartCount: 332000,
    description: "A standard twenty-footer. Contents: none. Potential: vast and unwise.",
    successMessage: "Customs have some questions.",
    failMessage: "Three hundred and thirty-two thousand. Held at Felixstowe.",
    caption: "TEU 20, doors sealed, harbour puzzled."
  },
  {
    id: "tube-carriage",
    name: "Tube carriage",
    emoji: "🚇",
    volumeLitres: 70000,
    fartCount: 700000,
    description: "Mind the fart. This is a Central line service. All stations to West Ruislip.",
    successMessage: "TfL would like a word.",
    failMessage: "Seven hundred thousand. The next train is not this train.",
    caption: "Central line, peak, windows sealed."
  },
  {
    id: "double-decker",
    name: "Double-decker bus",
    emoji: "🚌",
    volumeLitres: 80000,
    fartCount: 800000,
    description: "Please hold on. And perhaps hold it in. The upstairs has already heard.",
    successMessage: "The passengers downstairs have some notes.",
    failMessage: "Eight hundred thousand. Request stop, immediately.",
    caption: "Routemaster spiritual successor, traffic delayed."
  },
  {
    id: "hot-air-balloon",
    name: "Hot air balloon",
    emoji: "🎈",
    volumeLitres: 2200000,
    fartCount: 22000000,
    description: "Mostly air already. You are merely changing the recipe.",
    successMessage: "A historic moment for gastrointestinal mathematics.",
    failMessage: "Twenty-two million. The basket would like to be let down.",
    caption: "Dawn launch, wind variable, crew resigned."
  },
  {
    id: "olympic-pool",
    name: "Olympic swimming pool",
    emoji: "🏊",
    volumeLitres: 2500000,
    fartCount: 25000000,
    description: "Fifty metres of municipal ambition and one lane reserved for shame.",
    successMessage: "The lifeguard has swallowed the whistle.",
    failMessage: "Twenty-five million. The 200m breaststroke is postponed.",
    caption: "Lane 4, closed for atmosphere."
  }
];
