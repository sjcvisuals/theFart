/**
 * Google sign-in and the global Fart Legends board (Firebase).
 */
(function () {
  "use strict";

  var auth = null;
  var db = null;
  var ready = false;
  var authListeners = [];

  window.FARTLE_CLOUD = {
    isConfigured: isConfigured,
    isReady: function () {
      return ready;
    },
    currentUser: function () {
      return auth && auth.currentUser ? auth.currentUser : null;
    },
    onAuth: function (fn) {
      authListeners.push(fn);
      if (ready) {
        fn(this.currentUser());
      }
    },
    init: init,
    signIn: signIn,
    signOut: signOut,
    submitResult: submitResult,
    listToday: listToday,
    listAllTime: listAllTime,
    getProfile: getProfile,
    listMyHistory: listMyHistory
  };

  function isConfigured() {
    var c = window.FARTLE_FIREBASE || {};
    return !!(
      c.apiKey &&
      c.projectId &&
      window.firebase &&
      firebase.auth &&
      firebase.firestore
    );
  }

  async function init() {
    if (!isConfigured() || ready) {
      return ready;
    }
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(window.FARTLE_FIREBASE);
      }
      auth = firebase.auth();
      db = firebase.firestore();
      ready = true;
      auth.onAuthStateChanged(function (user) {
        if (user) {
          ensureProfile(user).catch(function () {});
        }
        authListeners.forEach(function (fn) {
          try {
            fn(user);
          } catch (err) {}
        });
      });
      return true;
    } catch (err) {
      ready = false;
      return false;
    }
  }

  async function signIn() {
    if (!auth) {
      throw new Error("Cloud not ready");
    }
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    var result = await auth.signInWithPopup(provider);
    await ensureProfile(result.user);
    return result.user;
  }

  async function signOut() {
    if (auth) {
      await auth.signOut();
    }
  }

  async function ensureProfile(user) {
    if (!db || !user) {
      return;
    }
    var ref = db.collection("users").doc(user.uid);
    var snap = await ref.get();
    var base = {
      displayName: (user.displayName || "Anonymous").slice(0, 48),
      photoURL: user.photoURL || ""
    };
    if (!snap.exists) {
      await ref.set({
        displayName: base.displayName,
        photoURL: base.photoURL,
        allTimeScore: 0,
        currentStreak: 0,
        bestStreak: 0,
        gamesPlayed: 0,
        gamesWon: 0,
        lastPlayDate: "",
        lastWonDate: "",
        createdAt: Date.now()
      });
      return;
    }
    await ref.set(base, { merge: true });
  }

  function shiftDate(dateString, days) {
    var parts = String(dateString).split("-").map(Number);
    var d = new Date(parts[0], parts[1] - 1, parts[2]);
    d.setDate(d.getDate() + days);
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function dailyPoints(won, guesses) {
    if (!won) {
      return 0;
    }
    return Math.max(1, 6 - guesses) * 10;
  }

  async function submitResult(payload) {
    if (!db || !auth || !auth.currentUser) {
      throw new Error("Sign in to post");
    }
    var user = auth.currentUser;
    var date = payload.date;
    var scoreRef = db.collection("dailyScores").doc(date + "_" + user.uid);
    var userRef = db.collection("users").doc(user.uid);

    return db.runTransaction(async function (tx) {
      var existing = await tx.get(scoreRef);
      if (existing.exists) {
        return existing.data();
      }
      var userSnap = await tx.get(userRef);
      var prev = userSnap.exists ? userSnap.data() : {};
      var won = payload.won === true;
      var guesses = Number(payload.guesses) || 0;
      var yesterday = shiftDate(date, -1);
      var currentStreak = 0;
      if (won) {
        currentStreak = prev.lastWonDate === yesterday ? (prev.currentStreak || 0) + 1 : 1;
      }
      var bestStreak = Math.max(prev.bestStreak || 0, currentStreak);
      var points = dailyPoints(won, guesses);
      var streakBonus = won ? currentStreak * 5 : 0;
      var gained = points + streakBonus;
      var row = {
        date: date,
        uid: user.uid,
        displayName: (user.displayName || prev.displayName || "Anonymous").slice(0, 48),
        photoURL: user.photoURL || prev.photoURL || "",
        guesses: guesses,
        won: won,
        points: points,
        streakBonus: streakBonus,
        streak: currentStreak,
        guessList: Array.isArray(payload.guessList) ? payload.guessList.slice(0, 5) : [],
        objectId: payload.objectId || "",
        objectName: payload.objectName || "",
        createdAt: Date.now()
      };
      var nextUser = {
        displayName: row.displayName,
        photoURL: row.photoURL,
        allTimeScore: (prev.allTimeScore || 0) + gained,
        currentStreak: currentStreak,
        bestStreak: bestStreak,
        gamesPlayed: (prev.gamesPlayed || 0) + 1,
        gamesWon: (prev.gamesWon || 0) + (won ? 1 : 0),
        lastPlayDate: date,
        lastWonDate: won ? date : prev.lastWonDate || ""
      };
      tx.set(scoreRef, row);
      tx.set(userRef, nextUser, { merge: true });
      return row;
    });
  }

  async function listToday(dateString) {
    if (!db) {
      return [];
    }
    var snap = await db.collection("dailyScores").where("date", "==", dateString).limit(80).get();
    var rows = [];
    snap.forEach(function (doc) {
      rows.push(doc.data());
    });
    rows.sort(function (a, b) {
      if (a.won !== b.won) {
        return a.won ? -1 : 1;
      }
      if (a.guesses !== b.guesses) {
        return a.guesses - b.guesses;
      }
      return (a.createdAt || 0) - (b.createdAt || 0);
    });
    return rows;
  }

  async function listAllTime() {
    if (!db) {
      return [];
    }
    var snap = await db
      .collection("users")
      .orderBy("allTimeScore", "desc")
      .limit(40)
      .get();
    var rows = [];
    snap.forEach(function (doc) {
      var data = doc.data() || {};
      data.uid = doc.id;
      rows.push(data);
    });
    return rows;
  }

  async function getProfile(uid) {
    if (!db || !uid) {
      return null;
    }
    var snap = await db.collection("users").doc(uid).get();
    return snap.exists ? snap.data() : null;
  }

  async function listMyHistory(uid) {
    if (!db || !uid) {
      return [];
    }
    var snap = await db.collection("dailyScores").where("uid", "==", uid).limit(60).get();
    var rows = [];
    snap.forEach(function (doc) {
      rows.push(doc.data());
    });
    rows.sort(function (a, b) {
      return String(b.date).localeCompare(String(a.date));
    });
    return rows.slice(0, 14);
  }
})();
