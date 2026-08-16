/* ============================================================
   data.js — ALL THE PERSONAL CONTENT LIVES HERE.
   ------------------------------------------------------------
   This is the only file you should need to touch to personalize
   the site: names, dates, the letter, the notes, photos, etc.
   Nothing in here is wired to layout — edit freely.

   PHOTOS: drop image files into assets/images/ using the exact
   filenames referenced below (e.g. "memory-01.jpg"). The site
   automatically detects whether a file exists — if it does, it
   replaces the placeholder frame. No other code changes needed.
   ============================================================ */

const SANA_DATA = {

  // ---- Core details -----------------------------------------
  recipientName: "Sana",
  birthdayISO: "2026-09-18",     // yyyy-mm-dd — used for the countdown
  senderSignoff: "Your brother", // change to your name if you'd rather sign it directly

  // ---- Hero section -------------------------------------------
  hero: {
    eyebrow: "A small site, for one specific person",
    headlineTop: "Happy Birthday,",
    headlineName: "Sana",
    subline: "I'm not good at saying this stuff out loud. So I built you a website instead.",
    scrollCue: "keep going, there's more"
  },

  // ---- The envelope / main letter ------------------------------
  // Keep it in your own voice. This is the "full" message —
  // the notes board below is the shorter, scattered stuff.
  letter: {
    label: "Open when ready",
    body: [
      "Hey Sana,",
      "I'll be honest — I sat here for a while not knowing how to start this, which tracks, because I'm also generally bad at starting these conversations in person. Building a website was apparently easier for me than sending a text. Make of that what you will.",
      "I don't check in as much as I should. That's not because I'm not thinking about you — it's more that I've always been the type to hang back and wait for someone to knock before I show up. You don't knock much. I've noticed. I'm working on being the one who knocks first, sometimes.",
      "For what it's worth: whenever you've asked me what I think about something, I've actually thought about it — properly, not just a quick reply to move the conversation along. That's just how I care about things, I suppose. Slowly, and seriously.",
      "So here's the actual point of this letter: happy birthday. I hope this year hands you fewer problems you have to solve alone, and if it doesn't, you already know where to find me. One text. No lecture attached. Well — maybe a small one.",
      "Go do something today that has nothing to do with anyone else's expectations."
    ],
    signoff: "— Your brother"
  },

  // ---- "Notes I Never Said" pinboard (the signature section) ---
  // Short, specific, undramatic lines. Replace these with real
  // things you've actually noticed about her — the more specific,
  // the better this section lands.
  notes: [
    "I noticed you've been laughing more this year. Don't think I don't clock things like that.",
    "You ask 'what do you think I should do' more than you realize. I take it seriously every time.",
    "I don't say 'I'm proud of you' enough. I am. Often.",
    "You're allowed to bring me the messy, unfinished version of a problem — not just the one you've already solved.",
    "I still think about that thing you said last year. Haven't brought it up since. Still think about it.",
    "If it actually goes wrong, you don't need the right words. Just text 'call me.'",
    "I'm not great at reaching out first. I'm trying to get better at it. This website is, arguably, me trying."
  ],

  // ---- Memory timeline -------------------------------------------
  // image should match a filename you'll add to assets/images/
  timeline: [
    {
      label: "Way back",
      title: "The one you'll fill in",
      caption: "Placeholder — swap in an early memory, a story, or an inside joke only the two of you get.",
      image: "memory-01.jpg"
    },
    {
      label: "A bit later",
      title: "Another placeholder",
      caption: "Something from the middle years. The chaotic phase. You know the one.",
      image: "memory-02.jpg"
    },
    {
      label: "More recently",
      title: "Closer to now",
      caption: "Something recent — a trip, a random Tuesday, whatever felt worth remembering.",
      image: "memory-03.jpg"
    }
  ],

  // ---- Photo gallery -----------------------------------------------
  gallery: [
    { image: "gallery-01.jpg", caption: "Add a caption" },
    { image: "gallery-02.jpg", caption: "Add a caption" },
    { image: "gallery-03.jpg", caption: "Add a caption" },
    { image: "gallery-04.jpg", caption: "Add a caption" },
    { image: "gallery-05.jpg", caption: "Add a caption" },
    { image: "gallery-06.jpg", caption: "Add a caption" }
  ],

  // ---- Make-a-wish cake section ---------------------------------
  cake: {
    prompt: "Blow out the candles.",
    candleCount: 5,
    wishRevealed: "Whatever you wished for — I hope it finds you. And if it doesn't show up on its own, tell me. I'll help however I can."
  },

  // ---- Guestbook -----------------------------------------------
  guestbook: {
    prompt: "Leave Sana a birthday note",
    placeholder: "Type something nice (or ridiculous, she'll take either)...",
    storageKey: "sana-birthday-guestbook"
  },

  // ---- Footer -----------------------------------------------------
  footer: {
    line: "Built with more effort than I'll ever admit to out loud.",
  }

};
