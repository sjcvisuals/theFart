(function () {
  "use strict";

  var MAX_ATTEMPTS = 5;
  var EPOCH_DATE = "2026-01-01";
  var MAX_GUESS = 999999999;
  var NAME_MAX_LENGTH = 24;
  var SOUND_SRC = "assets/sounds/fart.mp3";
  var STORAGE = {
    game: "fartle.v1.game",
    scores: "fartle.v1.scores",
    muted: "fartle.v1.muted"
  };

  var els = {};
  var puzzle = null;
  var game = null;
  var winAudio = null;
  var copiedTimer = null;
  var confettiTimer = null;

  /**
   * Device-local scores. Methods return Promises so a backend such as
   * Supabase can replace this object later without rewriting the game.
   * This is not a global multiplayer leaderboard.
   */
  var ScoreRepository = {
    async listForDate(dateString) {
      var all = readJson(STORAGE.scores, []);
      return all
        .filter(function (entry) {
          return entry && entry.date === dateString;
        })
        .sort(function (a, b) {
          if (a.guesses !== b.guesses) {
            return a.guesses - b.guesses;
          }
          return (a.createdAt || 0) - (b.createdAt || 0);
        });
    },

    async add(entry) {
      var all = readJson(STORAGE.scores, []);
      all.push(entry);
      writeJson(STORAGE.scores, all);
      return entry;
    }
  };

  document.addEventListener("DOMContentLoaded", start);

  async function start() {
    try {
      cacheElements();
      bindEvents();
      loadMutePreference();

      var today = localDateString();
      puzzle = selectDailyPuzzle(today);
      game = restoreGame(today, puzzle) || newGame(today, puzzle);

      renderMasthead(today, puzzle);
      renderPuzzle();
      renderGuessTable();
      renderAttempts();
      setPlayable(game.status === "playing");

      if (game.status === "won") {
        renderWin(false);
      } else if (game.status === "lost") {
        renderLoss(false);
      }

      await renderNews();
      renderClassifieds();
      await renderLeaderboard();
    } catch (err) {
      if (els.objectDescription) {
        els.objectDescription.textContent =
          "The compositors have gone home. Please refresh the edition.";
      }
    }
  }

  function cacheElements() {
    els.issueLine = document.getElementById("issue-line");
    els.dateLine = document.getElementById("date-line");
    els.weatherLine = document.getElementById("weather-line");
    els.objectVisual = document.getElementById("object-visual");
    els.objectCaption = document.getElementById("object-caption");
    els.objectName = document.getElementById("object-name");
    els.objectDescription = document.getElementById("object-description");
    els.attemptLine = document.getElementById("attempt-line");
    els.guessForm = document.getElementById("guess-form");
    els.guessInput = document.getElementById("guess-input");
    els.guessButton = document.getElementById("guess-button");
    els.guessError = document.getElementById("guess-error");
    els.guessBody = document.getElementById("guess-body");
    els.liveRegion = document.getElementById("live-region");
    els.outcome = document.getElementById("outcome");
    els.newsLeft = document.getElementById("news-left");
    els.newsRight = document.getElementById("news-right");
    els.newsBottom = document.getElementById("news-bottom");
    els.classifieds = document.getElementById("classifieds");
    els.legendsList = document.getElementById("legends-list");
    els.muteButton = document.getElementById("mute-button");
    els.muteIcon = document.getElementById("mute-icon");
    els.muteLabel = document.getElementById("mute-label");
    els.confetti = document.getElementById("confetti-canvas");
  }

  function bindEvents() {
    els.guessForm.addEventListener("submit", onGuessSubmit);
    els.muteButton.addEventListener("click", toggleMute);
  }

  function localDateString(date) {
    var d = date || new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function formatLongDate(dateString) {
    var parts = dateString.split("-").map(Number);
    var date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function daysSinceEpoch(dateString) {
    return Math.round(
      (parseUtc(dateString) - parseUtc(EPOCH_DATE)) / 86400000
    );
  }

  function parseUtc(dateString) {
    var parts = dateString.split("-").map(Number);
    return Date.UTC(parts[0], parts[1] - 1, parts[2]);
  }

  function selectDailyPuzzle(dateString) {
    var objects = window.FARTLE_OBJECTS || [];
    if (!objects.length) {
      throw new Error("No objects in the cupboard.");
    }
    var dayIndex = daysSinceEpoch(dateString);
    var puzzleNumber = dayIndex + 1;
    var objectIndex =
      ((dayIndex % objects.length) + objects.length) % objects.length;
    return {
      date: dateString,
      puzzleNumber: puzzleNumber,
      object: objects[objectIndex]
    };
  }

  function newGame(dateString, currentPuzzle) {
    return {
      date: dateString,
      objectId: currentPuzzle.object.id,
      puzzleNumber: currentPuzzle.puzzleNumber,
      guesses: [],
      status: "playing",
      named: false
    };
  }

  function restoreGame(dateString, currentPuzzle) {
    var saved = readJson(STORAGE.game, null);
    if (
      !saved ||
      saved.date !== dateString ||
      saved.objectId !== currentPuzzle.object.id
    ) {
      return null;
    }
    return saved;
  }

  function saveGame() {
    writeJson(STORAGE.game, game);
  }

  function renderMasthead(dateString, currentPuzzle) {
    var issue = Math.max(1, currentPuzzle.puzzleNumber);
    els.issueLine.textContent = "No. " + formatNumber(68000 + issue);

    els.dateLine.innerHTML = "";
    var time = document.createElement("time");
    time.dateTime = dateString;
    time.textContent = formatLongDate(dateString);
    els.dateLine.appendChild(time);

    var forecasts = window.FARTLE_WEATHER || [];
    if (forecasts.length) {
      var idx =
        ((daysSinceEpoch(dateString) % forecasts.length) + forecasts.length) %
        forecasts.length;
      els.weatherLine.textContent = "Weather: " + forecasts[idx];
    }
  }

  function renderPuzzle() {
    var object = puzzle.object;
    els.objectVisual.textContent = object.emoji || "💨";
    els.objectCaption.textContent = object.caption || "Artist's impression.";
    els.objectName.textContent = object.name;
    els.objectDescription.textContent = object.description;
  }

  function renderAttempts() {
    if (game.status === "won") {
      els.attemptLine.textContent =
        "Solved in " + game.guesses.length + " of " + MAX_ATTEMPTS + ".";
      return;
    }
    if (game.status === "lost") {
      els.attemptLine.textContent = "No attempts remaining.";
      return;
    }
    var left = MAX_ATTEMPTS - game.guesses.length;
    els.attemptLine.textContent =
      left === 1 ? "1 attempt remaining." : left + " attempts remaining.";
  }

  function setPlayable(playing) {
    els.guessInput.disabled = !playing;
    els.guessButton.disabled = !playing;
    if (playing) {
      els.guessInput.focus();
    }
  }

  function onGuessSubmit(event) {
    event.preventDefault();
    clearGuessError();
    if (game.status !== "playing") {
      return;
    }

    var parsed = parseGuess(els.guessInput.value);
    if (parsed.error) {
      showGuessError(parsed.error);
      announce(parsed.error);
      return;
    }

    submitGuess(parsed.value);
    els.guessInput.value = "";
    if (game.status === "playing") {
      els.guessInput.focus();
    }
  }

  function parseGuess(raw) {
    var trimmed = String(raw || "").trim();
    if (!trimmed) {
      return { error: "The presses need a number." };
    }
    if (/[-–—−]/.test(trimmed)) {
      return { error: "A negative fart is a sniff. Try a positive number." };
    }
    if (/\./.test(trimmed)) {
      return { error: "Whole farts only. This is no place for decimals." };
    }

    var compact = trimmed.replace(/,/g, "").replace(/\s/g, "");
    if (!/^\d+$/.test(compact)) {
      return { error: "That is not a number of farts." };
    }
    if (/^0+$/.test(compact)) {
      return { error: "Zero farts would fill nothing, and you know it." };
    }

    var value = Number(compact);
    if (!Number.isFinite(value) || value < 1) {
      return { error: "That is not a number of farts." };
    }
    if (value > MAX_GUESS) {
      return { error: "Be reasonable. Even Jupiter has limits." };
    }
    return { value: value };
  }

  function submitGuess(value) {
    game.guesses.push(value);
    var answer = puzzle.object.fartCount;
    var feedback = calculateFeedback(value, answer);

    if (feedback.exact) {
      game.status = "won";
      saveGame();
      renderGuessTable();
      renderAttempts();
      setPlayable(false);
      renderWin(true);
      return;
    }

    if (game.guesses.length >= MAX_ATTEMPTS) {
      game.status = "lost";
      saveGame();
      renderGuessTable();
      renderAttempts();
      setPlayable(false);
      renderLoss(true);
      return;
    }

    saveGame();
    renderGuessTable();
    renderAttempts();
    announce(feedback.label + ". " + feedback.detail);
  }

  function calculateFeedback(guess, answer) {
    if (guess === answer) {
      return {
        exact: true,
        direction: "exact",
        percent: 0,
        label: "EXACT",
        detail: "You got the fart."
      };
    }

    var direction = guess < answer ? "higher" : "lower";
    var percent = Math.round((Math.abs(guess - answer) / answer) * 100);
    var away =
      percent === 0
        ? "You were less than 1% away"
        : "You were " + percent + "% away";
    var label = direction === "higher" ? "↑ HIGHER" : "↓ LOWER";

    return {
      exact: false,
      direction: direction,
      percent: percent,
      label: label,
      detail: away
    };
  }

  function formatFeedbackCell(guess, answer) {
    var feedback = calculateFeedback(guess, answer);
    if (feedback.exact) {
      return { className: "feedback-exact", text: "💨 EXACT" };
    }
    if (feedback.direction === "higher") {
      return {
        className: "feedback-higher",
        text: "↑ HIGHER — " + feedback.detail
      };
    }
    return {
      className: "feedback-lower",
      text: "↓ LOWER — " + feedback.detail
    };
  }

  function renderGuessTable() {
    var answer = puzzle.object.fartCount;
    els.guessBody.innerHTML = "";

    if (!game.guesses.length) {
      var empty = document.createElement("tr");
      empty.className = "empty-row";
      var cell = document.createElement("td");
      cell.colSpan = 2;
      cell.textContent = "No guesses yet. The nation waits.";
      empty.appendChild(cell);
      els.guessBody.appendChild(empty);
      return;
    }

    game.guesses.forEach(function (guess) {
      var row = document.createElement("tr");
      var guessCell = document.createElement("td");
      guessCell.textContent = formatNumber(guess);
      var resultCell = document.createElement("td");
      var formatted = formatFeedbackCell(guess, answer);
      resultCell.className = formatted.className;
      resultCell.textContent = formatted.text;
      row.appendChild(guessCell);
      row.appendChild(resultCell);
      els.guessBody.appendChild(row);
    });
  }

  function renderWin(fromThisTurn) {
    var object = puzzle.object;
    var article = indefiniteArticle(object.name);
    var lead =
      "It would take approximately " +
      formatNumber(object.fartCount) +
      " farts to fill " +
      article +
      " " +
      object.name +
      ".";

    els.outcome.hidden = false;
    els.outcome.innerHTML = "";
    addText(els.outcome, "p", "outcome-banner", "Extra! Extra! You got the fart!");
    addText(els.outcome, "p", "outcome-lead", lead);
    addText(els.outcome, "p", "outcome-joke", object.successMessage);

    if (!game.named) {
      renderNameForm();
    }
    renderShareControls();

    if (fromThisTurn) {
      announce("Extra! Extra! You got the fart! " + lead);
      playWinSound();
      launchConfetti();
    }
  }

  function renderLoss(fromThisTurn) {
    var object = puzzle.object;
    els.outcome.hidden = false;
    els.outcome.innerHTML = "";
    addText(els.outcome, "p", "outcome-banner", "You've run out of gas");
    addText(
      els.outcome,
      "p",
      "outcome-answer",
      "The answer was " + formatNumber(object.fartCount) + " farts."
    );
    addText(els.outcome, "p", "outcome-joke", object.failMessage);
    renderShareControls();

    if (fromThisTurn) {
      announce(
        "You've run out of gas. The answer was " +
          formatNumber(object.fartCount) +
          " farts."
      );
    }
  }

  function renderNameForm() {
    var form = document.createElement("form");
    form.className = "name-form";
    form.noValidate = true;

    var field = document.createElement("div");
    field.className = "field";

    var label = document.createElement("label");
    label.htmlFor = "player-name";
    label.textContent = "Your name";

    var input = document.createElement("input");
    input.id = "player-name";
    input.name = "playerName";
    input.type = "text";
    input.maxLength = NAME_MAX_LENGTH;
    input.autocomplete = "nickname";
    input.required = true;

    var error = document.createElement("p");
    error.className = "field-error";
    error.id = "name-error";
    error.hidden = true;

    field.appendChild(label);
    field.appendChild(input);
    form.appendChild(field);
    form.appendChild(error);

    var button = document.createElement("button");
    button.type = "submit";
    button.className = "name-button";
    button.textContent = "Print my name";
    form.appendChild(button);

    form.addEventListener("submit", onNameSubmit);
    els.outcome.appendChild(form);
  }

  async function onNameSubmit(event) {
    event.preventDefault();
    var form = event.currentTarget;
    var input = form.querySelector("#player-name");
    var error = form.querySelector("#name-error");
    var name = sanitizeName(input.value);

    if (!name) {
      error.hidden = false;
      error.textContent = "The press requires a name.";
      announce("The press requires a name.");
      input.focus();
      return;
    }

    error.hidden = true;

    try {
      await ScoreRepository.add({
        name: name,
        guesses: game.guesses.length,
        date: puzzle.date,
        objectId: puzzle.object.id,
        objectName: puzzle.object.name,
        answer: puzzle.object.fartCount,
        createdAt: Date.now()
      });
      game.named = true;
      saveGame();
      form.remove();
      await renderLeaderboard();
      var legends = document.getElementById("legends");
      if (legends && legends.scrollIntoView) {
        legends.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "nearest"
        });
      }
      announce(name + " printed among today's Fart Legends.");
    } catch (err) {
      error.hidden = false;
      error.textContent = "The compositor jammed. Please try again.";
    }
  }

  function renderShareControls() {
    var block = document.createElement("div");
    block.className = "share-block";

    var button = document.createElement("button");
    button.type = "button";
    button.className = "share-button";
    button.textContent = "Share result";
    button.addEventListener("click", onShare);

    var note = document.createElement("p");
    note.className = "copied-note";
    note.id = "copied-note";
    note.hidden = true;

    block.appendChild(button);
    block.appendChild(note);
    els.outcome.appendChild(block);
  }

  async function onShare() {
    var text = buildShareText();
    var note = document.getElementById("copied-note");

    if (navigator.share) {
      try {
        await navigator.share({ title: "The Daily Fart", text: text });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") {
          return;
        }
      }
    }

    var copied = await copyText(text);
    if (note) {
      note.hidden = false;
      note.textContent = copied
        ? "Copied to clipboard"
        : "Could not copy. Please copy the result yourself.";
      announce(note.textContent);
      window.clearTimeout(copiedTimer);
      copiedTimer = window.setTimeout(function () {
        note.hidden = true;
      }, 2500);
    }
  }

  function buildShareText() {
    var answer = puzzle.object.fartCount;
    var marks = game.guesses.map(function (guess) {
      if (guess === answer) {
        return "💨";
      }
      return guess < answer ? "⬆️" : "⬇️";
    });
    var result =
      game.status === "won"
        ? "Got it in " + game.guesses.length + "/" + MAX_ATTEMPTS
        : "Out of gas " + MAX_ATTEMPTS + "/" + MAX_ATTEMPTS;

    return [
      "THE DAILY FART — FARTLE #" + puzzle.puzzleNumber,
      marks.join(" "),
      result
    ].join("\n");
  }

  async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        // Fall through.
      }
    }

    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  async function renderNews() {
    var articles = [];
    try {
      var api = window.FARTLE_NEWS_API;
      articles =
        api && api.loadNewsArticles
          ? await api.loadNewsArticles()
          : window.FARTLE_NEWS || [];
    } catch (err) {
      articles = window.FARTLE_NEWS || [];
    }

    fillColumn(els.newsLeft, articles.filter(inColumn("left")));
    fillColumn(els.newsRight, articles.filter(inColumn("right")));
    fillColumn(els.newsBottom, articles.filter(inColumn("bottom")));
  }

  function inColumn(column) {
    return function (article) {
      return article.column === column;
    };
  }

  function fillColumn(root, articles) {
    root.innerHTML = "";
    articles.forEach(function (article) {
      root.appendChild(buildArticle(article));
    });
  }

  function buildArticle(article) {
    var card = document.createElement("article");
    card.className = "article-card";

    var kicker = document.createElement("p");
    kicker.className = "article-kicker";
    kicker.textContent =
      (article.section || "News") +
      (article.kicker ? " · " + article.kicker : "");

    var heading = document.createElement("h3");
    heading.textContent = article.headline;

    var summary = document.createElement("p");
    summary.textContent = article.summary;

    card.appendChild(kicker);
    card.appendChild(heading);
    card.appendChild(summary);

    if (article.byline) {
      var byline = document.createElement("p");
      byline.className = "byline";
      byline.textContent = article.byline;
      card.appendChild(byline);
    }
    return card;
  }

  function renderClassifieds() {
    var ads = window.FARTLE_CLASSIFIEDS || [];
    els.classifieds.innerHTML = "";
    ads.forEach(function (ad) {
      var item = document.createElement("article");
      item.className = "classified";
      var heading = document.createElement("h3");
      heading.textContent = ad.heading;
      var text = document.createElement("p");
      text.textContent = ad.text;
      item.appendChild(heading);
      item.appendChild(text);
      els.classifieds.appendChild(item);
    });
  }

  async function renderLeaderboard() {
    var scores = [];
    try {
      scores = await ScoreRepository.listForDate(puzzle.date);
    } catch (err) {
      scores = [];
    }

    els.legendsList.innerHTML = "";
    if (!scores.length) {
      var empty = document.createElement("li");
      empty.className = "legends-empty";
      empty.textContent = "No legends today. The press awaits.";
      els.legendsList.appendChild(empty);
      return;
    }

    scores.forEach(function (entry) {
      var item = document.createElement("li");
      var name = document.createElement("span");
      name.textContent = entry.name;
      var detail = document.createElement("span");
      detail.textContent =
        entry.guesses === 1
          ? "guessed in 1 attempt"
          : "guessed in " + entry.guesses + " attempts";
      item.appendChild(name);
      item.appendChild(detail);
      els.legendsList.appendChild(item);
    });
  }

  function playWinSound() {
    if (isMuted()) {
      return;
    }
    try {
      if (!winAudio) {
        winAudio = new Audio(SOUND_SRC);
        winAudio.preload = "auto";
      }
      winAudio.currentTime = 0;
      var playPromise = winAudio.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {
          synthesizeFart();
        });
      }
    } catch (err) {
      synthesizeFart();
    }
  }

  function synthesizeFart() {
    if (isMuted()) {
      return;
    }
    var Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) {
      return;
    }
    try {
      var ctx = new Ctor();
      var duration = 0.55;
      var rate = ctx.sampleRate;
      var length = Math.floor(rate * duration);
      var buffer = ctx.createBuffer(1, length, rate);
      var data = buffer.getChannelData(0);
      var phase = 0;
      for (var i = 0; i < length; i += 1) {
        var t = i / rate;
        var env = Math.exp(-t * 5.5) * (t < 0.03 ? t / 0.03 : 1);
        var freq = 150 - 70 * t;
        phase += (2 * Math.PI * freq) / rate;
        var osc = Math.sin(phase + 4 * Math.sin(2 * Math.PI * 12 * t));
        var noise = Math.random() * 2 - 1;
        data[i] = env * (0.35 * osc + 0.55 * noise) * 0.35;
      }
      var source = ctx.createBufferSource();
      var filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 420;
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(ctx.destination);
      source.start();
      source.onended = function () {
        ctx.close().catch(function () {});
      };
    } catch (err) {
      // Decorative only.
    }
  }

  function launchConfetti() {
    if (prefersReducedMotion() || !els.confetti) {
      return;
    }
    var canvas = els.confetti;
    var ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    var width = window.innerWidth;
    var height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    var colors = ["#1c1410", "#8b1a1a", "#d4a017", "#f3ead3", "#4a4036"];
    var pieces = [];
    for (var i = 0; i < 90; i += 1) {
      pieces.push({
        x: Math.random() * width,
        y: -20 - Math.random() * height * 0.4,
        w: 6 + Math.random() * 8,
        h: 8 + Math.random() * 12,
        vx: -1.5 + Math.random() * 3,
        vy: 2.4 + Math.random() * 3.2,
        rot: Math.random() * Math.PI,
        vr: -0.2 + Math.random() * 0.4,
        color: colors[i % colors.length]
      });
    }

    var started = performance.now();
    var duration = 2800;
    window.clearTimeout(confettiTimer);

    function frame(now) {
      var elapsed = now - started;
      ctx.clearRect(0, 0, width, height);
      pieces.forEach(function (piece) {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.vy += 0.04;
        piece.rot += piece.vr;
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rot);
        ctx.globalAlpha = Math.max(0, 1 - elapsed / duration);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
        ctx.restore();
      });
      if (elapsed < duration) {
        window.requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }

    window.requestAnimationFrame(frame);
    confettiTimer = window.setTimeout(function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, duration + 50);
  }

  function loadMutePreference() {
    applyMuteUi(readJson(STORAGE.muted, false) === true);
  }

  function toggleMute() {
    var muted = !isMuted();
    writeJson(STORAGE.muted, muted);
    applyMuteUi(muted);
  }

  function isMuted() {
    return els.muteButton.getAttribute("aria-pressed") === "true";
  }

  function applyMuteUi(muted) {
    els.muteButton.setAttribute("aria-pressed", muted ? "true" : "false");
    els.muteButton.setAttribute(
      "aria-label",
      muted ? "Unmute sound" : "Mute sound"
    );
    els.muteButton.title = muted ? "Unmute sound" : "Mute sound";
    els.muteIcon.textContent = muted ? "🔇" : "🔊";
    els.muteLabel.textContent = muted ? "Sound off" : "Sound on";
  }

  function showGuessError(message) {
    els.guessError.hidden = false;
    els.guessError.textContent = message;
    els.guessInput.setAttribute("aria-invalid", "true");
  }

  function clearGuessError() {
    els.guessError.hidden = true;
    els.guessError.textContent = "";
    els.guessInput.removeAttribute("aria-invalid");
  }

  function announce(message) {
    els.liveRegion.textContent = "";
    window.setTimeout(function () {
      els.liveRegion.textContent = message;
    }, 40);
  }

  function sanitizeName(value) {
    return String(value || "")
      .replace(/[\u0000-\u001f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, NAME_MAX_LENGTH);
  }

  function indefiniteArticle(name) {
    return /^[aeiou]/i.test(String(name || "").trim()) ? "an" : "a";
  }

  function formatNumber(value) {
    return Number(value).toLocaleString("en-GB");
  }

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function readJson(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      if (raw === null) {
        return fallback;
      }
      return JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      // Private browsing or a full store should not crash the edition.
    }
  }

  function addText(parent, tag, className, text) {
    var node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    parent.appendChild(node);
    return node;
  }
})();
