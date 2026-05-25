// ─── Data ────────────────────────────────────────────────────────────────────

export const GENRES   = ["Trap","Drill","UK Drill","Melodic Trap","R&B/Soul","Boom Bap","Afrobeats","Pop","Lofi Hip-Hop","Jersey Club"];
export const ARTISTS  = ["Drake","Travis Scott","Lil Baby","Gunna","Rod Wave","Future","NBA YoungBoy","Polo G","Lil Durk","21 Savage","Post Malone","SZA","Kendrick Lamar","Tyler the Creator","Playboi Carti"];
export const MOODS    = ["Dark","Melodic","Hard","Aggressive","Emotional","Chill","Wavy","Luxury","Raw","Cinematic"];
export const PLATFORMS = ["Instagram","TikTok","Twitter/X"];

const TITLE_WORDS = {
  Dark:       ["Nightfall","Shadow","Eclipse","Abyss","Obsidian","Phantom","Void","Murk","Reaper","Graveside","Omen","Dusk"],
  Melodic:    ["Sunrise","Velvet","Mirage","Serenade","Drift","Tender","Bloom","Reverie","Glide","Aurora","Solstice","Haze"],
  Hard:       ["Iron","Pressure","Force","Cement","Blitz","Steel","Impact","Ruthless","Grind","Concrete","Siege","Forged"],
  Aggressive: ["Rampage","Warfare","Ambush","Havoc","Fury","Frenzy","Riot","Wrath","Strike","Carnage","Berserk","Inferno"],
  Emotional:  ["Teardrops","Hollow","Numb","Broken","Confess","Fade","Lonesome","Ache","Solace","Unravel","Distant","Scar"],
  Chill:      ["Mellow","Sunset","Breezy","Smoke","Ease","Cruise","Coastal","Hazy","Unwind","Drifting","Vapour","Lull"],
  Wavy:       ["Ripple","Current","Offshore","Riptide","Wavelength","Aqua","Tide","Float","Shore","Undertow","Flux","Deep"],
  Luxury:     ["Penthouse","Iced Out","Gold Rush","Opulent","Caviar","Lavish","Elite","Prestige","Yacht","Couture","Opulence","Gilt"],
  Raw:        ["Uncut","Bare","Gritty","Concrete","Rough","Street","Exposed","Rugged","No Cap","Unfiltered","Blunt","Crude"],
  Cinematic:  ["Overture","Interlude","Climax","Prelude","Opus","Act II","Overture","Encore","Crescendo","Motif","Elegy","Cadence"],
};

const BS_TAGS = {
  Trap:           ["Trap","808s","Banger"],
  Drill:          ["Drill","Chicago","Gritty"],
  "UK Drill":     ["UKDrill","London","Dark"],
  "Melodic Trap": ["Melodic","Vibes","Emotional"],
  "R&B/Soul":     ["RnB","Soul","Smooth"],
  "Boom Bap":     ["BoomBap","HipHop","Classic"],
  Afrobeats:      ["Afro","Dancehall","Groovy"],
  Pop:            ["Pop","Catchy","Radio"],
  "Lofi Hip-Hop": ["Lofi","Chill","Study"],
  "Jersey Club":  ["JerseyClub","Club","Dance"],
};

const YT_TAGS = {
  Trap:           "trap beat,free trap beat,trap instrumental,trap type beat,rap beat,hard trap beat,808 beat",
  Drill:          "drill beat,free drill beat,drill instrumental,chicago drill beat,dark drill beat",
  "UK Drill":     "uk drill beat,london drill beat,uk drill instrumental,free uk drill beat",
  "Melodic Trap": "melodic trap beat,melodic beat,emotional trap beat,melodic instrumental",
  "R&B/Soul":     "rnb beat,soul beat,rnb instrumental,smooth beat,neo soul beat",
  "Boom Bap":     "boom bap beat,old school beat,boom bap instrumental,hip hop beat",
  Afrobeats:      "afrobeats instrumental,afro beat,afropop beat,dancehall beat",
  Pop:            "pop beat,pop instrumental,pop type beat,catchy beat,radio ready beat",
  "Lofi Hip-Hop": "lofi beat,lofi hip hop,chill beat,study beat,lofi instrumental",
  "Jersey Club":  "jersey club beat,club beat,jersey beat,dance beat",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pick(arr, n = 1) {
  const s = [...arr].sort(() => Math.random() - 0.5);
  return n === 1 ? s[0] : s.slice(0, n);
}

// ─── Generators ──────────────────────────────────────────────────────────────

export function genBeatTitles({ genre, artist, mood, bpm, producerName }) {
  const words = TITLE_WORDS[mood] || TITLE_WORDS.Dark;
  const tags  = BS_TAGS[genre]  || ["Trap","Beat","Hard"];
  const pn    = producerName || "YourTag";
  const year  = 2025;

  const titles = [];
  for (let i = 0; i < 6; i++) {
    const w = Math.random() > 0.4 ? `${pick(words)} ${pick(words)}` : pick(words);
    const t1 = artist.replace(/ /g, "");
    const t2 = tags[i % tags.length];
    const t3 = mood;
    titles.push({ title: `${artist} Type Beat "${w}" ${year} | ${bpm} BPM`, tags: [t1, t2, t3] });
  }

  return `🎵 BEAT TITLES  ·  ${genre.toUpperCase()}  ·  ${artist.toUpperCase()}  ·  ${mood.toUpperCase()}
${"━".repeat(54)}

${titles.map((t, i) => `${i + 1}.  ${t.title}\n    Tags → #${t.tags[0]}  #${t.tags[1]}  #${t.tags[2]}`).join("\n\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡  TIP: Single-word tags ("${artist.split(" ")[0]}") outperform
    multi-word phrases in BeatStars search. Hit Generate
    again for fresh title combinations.`;
}

export function genYouTubeSEO({ genre, artist, mood, bpm, beatTitle, producerName }) {
  const pn   = producerName || "YourProducerName";
  const bt   = beatTitle || pick(TITLE_WORDS[mood] || TITLE_WORDS.Dark);
  const base = YT_TAGS[genre] || "type beat,free beat,instrumental";
  const year = 2025;

  const videoTitle = `${artist} Type Beat ${year} | "${bt}" (${mood} ${genre}) ${bpm}BPM`;
  const allTags = [
    `${artist.toLowerCase()} type beat`,
    `${artist.toLowerCase()} type beat ${year}`,
    `free ${artist.toLowerCase()} type beat`,
    `${genre.toLowerCase()} type beat`,
    `${mood.toLowerCase()} beat`,
    `${mood.toLowerCase()} ${genre.toLowerCase()} beat`,
    ...base.split(","),
    `${pn.toLowerCase()} beats`,
    `beats ${year}`,
    "free for profit beat",
    "free beats",
  ].join(", ");

  const desc = `🎵 ${artist} Type Beat ${year} | "${bt}" — ${mood} ${genre} Instrumental

👉 License / Download → [YOUR BEATSTARS LINK]
📧 Exclusives & collabs → [YOUR EMAIL]
🔔 New beats every Friday — Subscribe & hit the bell

─────────────────────────────────────────
This ${mood.toLowerCase()} ${genre.toLowerCase()} instrumental was engineered for
artists who refuse to settle. "${bt}" runs at ${bpm} BPM with
layered 808s, atmospheric textures, and a mix built for
record-ready vocals straight out of the box.

Whether you're chasing streams or building a legacy,
this beat delivers the energy to match your vision.
─────────────────────────────────────────
🎧 LICENSING

MP3 Basic      $29.99  · 5K streams · 1 video
WAV Premium    $49.99  · 50K streams · monetization  ⭐ Best
Trackout       $99.99  · All stems · 100K streams
Unlimited     $199.99  · No limits · commercial use
Exclusive     from $499 · Full rights · DM to discuss

All leases include instant delivery.
─────────────────────────────────────────
#typebeat #${genre.replace(/ /g, "").toLowerCase()} #${artist.replace(/ /g, "").toLowerCase()}typebeat`;

  return `📺 YOUTUBE SEO PACKAGE  ·  "${bt}"
${"━".repeat(54)}

📌  VIDEO TITLE  (${videoTitle.length} chars)
${videoTitle}

🖼️  THUMBNAIL TEXT
"${artist.toUpperCase()} TYPE BEAT ${year}"
→ Bold white text, dark moody BG, readable at 250×140px

📝  DESCRIPTION
${desc}

🏷️  TAGS  (paste directly into YouTube tag field)
${allTags}`;
}

export function genSocialCaptions({ genre, artist, mood, bpm, beatTitle, producerName, platform }) {
  const pn   = producerName || "YourProducerName";
  const bt   = beatTitle    || `${mood} ${genre} Beat`;
  const year = 2025;

  const igTags  = `#typebeat #${genre.replace(/ /g,"").toLowerCase()}beat #${artist.replace(/ /g,"").toLowerCase()}typebeat #freebeats #beatsforsale #producerlife #beatstars #newbeat #${mood.toLowerCase()}beats #trapmusic #instrumentals #beatmaker #musicproducer #hiphopbeats #${year}`;
  const ttTags  = `#typebeat #beatsforsale #${genre.replace(/ /g,"").toLowerCase()} #musicproducer #beatstars`;
  const twTags  = `#typebeat #${genre.toLowerCase().replace(/ /g,"")} #beatsforsale`;
  const tags    = platform === "Instagram" ? igTags : platform === "TikTok" ? ttTags : twTags;

  const capA = platform === "TikTok"
    ? `POV: you just found the hardest ${artist} type beat of ${year} 🔥\n\n"${bt}" — ${bpm} BPM ${genre} 🎛️\nLink in bio to license 👇\n\n${tags}`
    : `🔥 NEW BEAT JUST DROPPED 🔥\n\n"${bt}" — ${mood} ${genre} | ${artist} energy\nThis one hits different. Link in bio 👇\n\n${tags}`;

  const capB = platform === "TikTok"
    ? `Started this beat at 2am and couldn't stop 🌙\n\n"${bt}" — ${mood} ${genre} | Available now\nLink in bio 🎛️\n\n${tags}`
    : `Every beat tells a story.\n\n"${bt}" started as a simple melody at midnight. By 3am it had turned into this. ${mood}. ${genre}. ${artist} energy.\n\nAvailable now on BeatStars. Link in bio.\n\n${tags}`;

  const capC = platform === "TikTok"
    ? `Drop your artist name below if you want a FREE ${genre} type beat 👇👇\n\n${tags}`
    : `🚨 "${bt}" just dropped — ${mood} ${genre} | ${artist} type\n\nLeases from $29.99. Exclusives available.\nComment "FIRE" and I'll DM you the link 🔥\n\n${tags}`;

  return `📱 ${platform.toUpperCase()} CAPTIONS  ·  "${bt}"
${"━".repeat(54)}

━━  VERSION A  —  Hype  ━━
${capA}

━━  VERSION B  —  Storytelling  ━━
${capB}

━━  VERSION C  —  Direct / Urgent  ━━
${capC}`;
}

export function genBio({ producerName, genre, bioArtists, bioAccomplishments, mood }) {
  const pn  = producerName        || "this producer";
  const g   = genre               || "Trap";
  const a   = bioArtists          || "top artists in the game";
  const acc = bioAccomplishments  || `a growing catalog of ${mood.toLowerCase()} ${g.toLowerCase()} instrumentals`;

  return `✍️  BEATSTARS BIO
${"━".repeat(54)}

${pn} is a ${g} music producer known for crafting ${mood.toLowerCase()},
high-energy instrumentals that move artists and fans alike.
With a sound inspired by ${a}, ${pn} brings ${acc}
to every project — built for artists serious about their craft.

Every beat is mixed, mastered, and ready for instant
recording. Whether you need a smash single or the sonic
foundation for your next project, ${pn} delivers.

📩 Browse the catalog below or reach out directly
   for exclusive licensing and custom beats.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡  PAGE TIPS
• Keep it under 4 sentences on BeatStars itself
• Mirror this language across YouTube & Instagram
• Update when you hit milestones (placements, streams)
• Add your IG / YouTube link at the very end`;
}

export function genPricingCopy({ genre, producerName }) {
  const pn = producerName || "the producer";
  return `💰 LICENSE TIER COPY  ·  ${genre.toUpperCase()}
${"━".repeat(54)}

🎵  MP3 BASIC  —  $29.99
Perfect for your first release. Studio-quality ${genre.toLowerCase()}
instrumental, instant delivery. Start building your brand
without breaking the bank.

⭐  WAV PREMIUM  —  $49.99   [MOST POPULAR]
The move serious artists make. Full WAV quality,
monetization rights, and 50K streams to grow your
fanbase. This is the tier that launches careers.

🎚️  TRACKOUT / STEMS  —  $99.99
Full creative control. Every stem separated so your
engineer can craft a mix straight out of a major-label
session.

♾️  UNLIMITED  —  $199.99
No ceilings. No expiration. Unlimited streams, unlimited
videos, full commercial rights — for artists who know
this record is going to blow.

🔑  EXCLUSIVE RIGHTS  —  from $499
Own it forever. The beat is pulled from the store.
One artist. One sound. One legacy.
Reach out to discuss.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡  Feature WAV Premium as your "recommended" option —
    it converts the most buyers at the best margin.`;
}
