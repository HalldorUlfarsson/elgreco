(function () {
  const articleEl = document.getElementById("wiki-article");
  const homeLinks = document.querySelectorAll(".home-link, [data-home-title]");
  const researchLinks = document.querySelectorAll(".research-link, [data-research-title]");

  if (!articleEl) return;

  const endpoint =
    "https://en.wikipedia.org/w/api.php?action=parse&page=Halldorophone&prop=text&formatversion=2&format=json&origin=*";
  const wikipediaStylesheet =
    "https://en.wikipedia.org/w/load.php?lang=en&modules=mediawiki.skinning.content.parsoid%7Csite.styles&only=styles&skin=vector";

  function renderShadowContent(contentNode, sourceText, opts = {}) {
    const { useWikipediaCss = false } = opts;
    const shadow = articleEl.shadowRoot || articleEl.attachShadow({ mode: "open" });
    shadow.innerHTML = "";

    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap";
    shadow.append(fontLink);

    const baseStyle = document.createElement("style");
    baseStyle.textContent = `
      :host {
        display: block;
      }
      .wiki-host {
        font-size: 14px;
        font-family: sans-serif;
        color: #202122;
        line-height: 1.6;
      }
      .wiki-host h1,
      .wiki-host h2,
      .wiki-host h3,
      .wiki-host h4 {
        margin: 1rem 0 0.6rem;
        line-height: 1.3;
      }
      .wiki-host p,
      .wiki-host li {
        margin: 0.45rem 0;
      }
      .wiki-host ul {
        padding-left: 1.3rem;
      }
      .wiki-host a {
        color: #1f4c8f;
      }
      .instrument-entry {
        border-top: 1px solid #e3e3e3;
        padding-top: 0.5rem;
        margin-top: 0.85rem;
      }
      .instrument-entry h3 {
        margin-bottom: 0.25rem;
      }
      .instrument-entry p:has(> a:only-child) {
        text-align: center;
      }
      .instrument-entry a {
        text-align: left;
      }
      .instrument-table {
        border-collapse: collapse;
        width: 100%;
        font-size: 0.9rem;
        margin: 0.5rem 0 0.25rem;
      }
      .instrument-table td {
        padding: 0.05rem 0.75rem 0.05rem 0;
        vertical-align: top;
        border: none;
        line-height: 1.2;
      }
      .instrument-table td:first-child {
        color: rgba(0,0,0,0.45);
        font-weight: 600;
        white-space: nowrap;
        width: 110px;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        padding-top: 0.1rem;
      }
      .instrument-table td:last-child {
        color: inherit;
      }
      .citing-works {
        font-size: 0.82rem;
        color: #444;
        line-height: 1.55;
      }
      .citing-intro {
        font-size: 0.82rem;
        color: #444;
        margin: 0 0 1rem;
        font-style: italic;
      }
      .citing-works h3 {
        font-size: 0.9rem;
        color: #202122;
        margin: 1.2rem 0 0.3rem;
        border-bottom: 1px solid #e3e3e3;
        padding-bottom: 0.2rem;
      }
      .citing-works ul {
        padding-left: 1.2rem;
        margin: 0.25rem 0 0;
      }
      .citing-works li {
        margin: 0.2rem 0;
      }
      .wiki-shell {
        color: #202122;
      }
      .wiki-topbar {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin: 0 0 0.65rem;
      }
      .wiki-brand {
        min-width: 150px;
        font-family: "Linux Libertine", "Times New Roman", serif;
        line-height: 1.1;
      }
      .wiki-brand-wordmark {
        font-size: 1.8rem;
        letter-spacing: 0.03em;
      }
      .wiki-brand-tagline {
        display: block;
        font-size: 0.9rem;
        margin-top: 0.25rem;
      }
      .wiki-page-head {
        margin: 0 0 0.45rem;
      }
      .wiki-page-title-row {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 1rem;
        border-bottom: 1px solid #a2a9b1;
        padding-bottom: 0.35rem;
      }
      .wiki-page-title {
        margin: 0;
        font-family: "Linux Libertine", "Times New Roman", serif;
        font-size: 2.08rem;
        line-height: 1.1;
        font-weight: 400;
      }
      .wiki-lang {
        display: inline-flex;
        align-items: center;
        gap: 0.38rem;
        color: #3366cc;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 0.98rem;
        font-weight: 700;
        text-decoration: none;
        line-height: 1;
        white-space: nowrap;
      }
      .wiki-lang-icon {
        width: 1.1em;
        height: 1.1em;
        display: inline-block;
        fill: currentColor;
      }
      .wiki-lang-caret {
        font-size: 0.72em;
        line-height: 1;
      }
      .wiki-tabs-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 1rem;
        border-bottom: 1px solid #a2a9b1;
        padding: 0.34rem 0 0.3rem;
      }
      .wiki-tabs,
      .wiki-actions {
        display: flex;
        gap: 1rem;
        align-items: flex-end;
        margin: 0;
        padding: 0;
      }
      .wiki-tab,
      .wiki-action {
        position: relative;
        display: inline-flex;
        align-items: flex-end;
        color: #3366cc;
        text-decoration: none;
        font-size: 1rem;
        line-height: 1.25;
        padding-bottom: 0.25rem;
      }
      .wiki-tab.active,
      .wiki-action.active {
        color: #202122;
      }
      .wiki-tab.active::after,
      .wiki-action.active::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: -0.3rem;
        height: 3px;
        background: #202122;
      }
      .wiki-source-line {
        margin: 0.48rem 0 0.62rem;
      }
      .wiki-source-line p {
        margin: 0;
        font-size: 0.92rem;
        font-weight: 400;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      .wiki-source-url {
        margin-top: 0.16rem;
        font-size: 0.86rem;
        word-break: break-all;
      }
      .wiki-embed-body {
        border-top: 1px solid #eaecf0;
        padding-top: 0.8rem;
      }
      @media (max-width: 900px) {
        .wiki-topbar {
          flex-direction: column;
          align-items: flex-start;
        }
        .wiki-page-title {
          font-size: 1.8rem;
        }
        .wiki-lang {
          font-size: 1rem;
        }
        .wiki-tab,
        .wiki-action {
          font-size: 0.95rem;
        }
        .wiki-source-line p {
          font-size: 0.92rem;
        }
      }
      @font-face {
        font-family: 'DSFetteGotisch';
        src: url('https://www.cdnfonts.com/s/15026/DSFetteGotisch.woff') format('woff');
        font-weight: normal;
        font-style: normal;
      }
      .order-page {
        width: 70%;
        margin: 0 auto;
        text-align: center;
        font-family: 'Cormorant Garamond', Georgia, serif;
      }
      .order-heading {
        font-family: 'DSFetteGotisch', 'UnifrakturMaguntia', cursive;
        font-size: 2.6rem;
        font-weight: 400;
        letter-spacing: 0.04em;
        margin: 0 0 1.2rem;
      }
      .order-img {
        width: 100%;
        height: auto;
        display: block;
        margin: 0 auto 1rem;
      }
      .order-intro-text {
        margin: 0 0 1.5rem;
      }
      .order-subheading {
        margin: 0 0 0.4rem;
      }
      .order-award-note {
        font-style: italic;
        color: #666;
        font-size: 0.9rem;
        margin: 0 0 1.2rem;
      }
      .order-entry {
        margin: 0 0 1.1rem;
      }
      .order-entry h3 {
        margin: 0 0 0.1rem;
      }
      .order-entry p {
        margin: 0;
      }
      @keyframes spin-slow {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      .spinning-wheel {
        width: 320px;
        height: 320px;
        margin: 0 auto 2rem;
        margin-top: 0;
        display: block;
        animation: spin-slow 60s linear infinite reverse;
      }
    `;

    shadow.append(baseStyle);

    if (useWikipediaCss) {
      const linkEl = document.createElement("link");
      linkEl.rel = "stylesheet";
      linkEl.href = wikipediaStylesheet;
      shadow.append(linkEl);
    }

    shadow.append(contentNode);
  }

  function markdownToHtml(markdown) {
    const escapeHtml = (text) =>
      text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const formatInline = (text) => {
      const imgRegex = /<img[^>]*>/g;
      const imgs = [];
      let imgIndex = 0;
      const textWithPlaceholders = text.replace(imgRegex, () => {
        imgs.push(text.match(imgRegex)[imgIndex]);
        return `__IMG_PLACEHOLDER_${imgIndex++}__`;
      });

      const escaped = escapeHtml(textWithPlaceholders);
      let result = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

      imgs.forEach((img, i) => {
        result = result.replace(`__IMG_PLACEHOLDER_${i}__`, img);
      });

      return result;
    };

    const lines = markdown.split(/\r?\n/);
    const html = [];
    let inList = false;

    for (const line of lines) {
      if (/^-{3,}$/.test(line.trim())) {
        html.push("<hr>");
        continue;
      }

      if (/^\s*-\s+/.test(line)) {
        if (!inList) {
          html.push("<ul>");
          inList = true;
        }
        html.push(`<li>${formatInline(line.replace(/^\s*-\s+/, ""))}</li>`);
        continue;
      }

      if (inList) {
        html.push("</ul>");
        inList = false;
      }

      if (!line.trim()) continue;
      if (/^####\s+/.test(line)) {
        html.push(`<h4>${formatInline(line.replace(/^####\s+/, ""))}</h4>`);
      } else if (/^###\s+/.test(line)) {
        html.push(`<h3>${formatInline(line.replace(/^###\s+/, ""))}</h3>`);
      } else if (/^##\s+/.test(line)) {
        html.push(`<h2>${formatInline(line.replace(/^##\s+/, ""))}</h2>`);
      } else if (/^#\s+/.test(line)) {
        html.push(`<h1>${formatInline(line.replace(/^#\s+/, ""))}</h1>`);
      } else if (/^\s*</.test(line)) {
        html.push(line.trim());
      } else if (/^\s*<img/.test(line)) {
        html.push(formatInline(line));
      } else {
        html.push(`<p>${formatInline(line)}</p>`);
      }
    }

    if (inList) {
      html.push("</ul>");
    }

    return html.join("\n");
  }

  // Only use pushState routing when served from a real HTTP server (not file:// or localhost)
  const isLocalDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:";

  // SEO helpers
  const seoMeta = {
    "/":                       { title: "Halldorophone", description: "The halldorophone — an electro-acoustic feedback string instrument by Halldór Úlfarsson." },
    "/further-reading":        { title: "Further Reading — Halldorophone", description: "Research and writing on the halldorophone and related topics." },
    "/list-of-halldorophones": { title: "List of Halldorophones — Halldorophone", description: "A catalogue of all halldorophones built by Halldór Úlfarsson." },
    "/halldorobass":           { title: "Halldorobass — Halldorophone", description: "The halldorobass: a modified double bass built to feedback in the same way as halldorophones." },
    "/order":                  { title: "Order of the Halldorophone", description: "Commission a halldorophone from Halldór Úlfarsson." },
    "/about":                  { title: "About Halldór Úlfarsson — Halldorophone", description: "Halldór Úlfarsson is an artist, designer and instrument builder whose work centres on the halldorophone." },
    "/hildur":                 { title: "The Halldorophone in Joker and Chernobyl — Hildur Guðnadóttir", description: "Hildur Guðnadóttir used the halldorophone to compose the Oscar, BAFTA, Golden Globe, Grammy, and Emmy-winning scores for Joker and Chernobyl — making her the first solo female composer to win all three major awards for the same work. The instrument was built by Halldór Úlfarsson." },
    "/sunn-life-metal":         { title: "The Halldorophone on Sunn O)))'s Life Metal", description: "Hildur Guðnadóttir played the halldorophone on 'Novæ', the 25-minute closing track of Sunn O)))'s 2019 album Life Metal, recorded entirely on analog tape by Steve Albini at Electrical Audio, Chicago." },
    "/arrival-soundtrack":       { title: "The Halldorophone in the Arrival Soundtrack — Jóhann Jóhannsson", description: "Hildur Guðnadóttir is credited on cello, halldorophone (listed as 'dórophone') and voice on Jóhann Jóhannsson's Golden Globe-nominated score for Denis Villeneuve's 2016 film Arrival, released on Deutsche Grammophon." },
    "/battlefield-2042":         { title: "The Halldorophone on Battlefield 2042", description: "The Battlefield 2042 soundtrack was composed by Hildur Guðnadóttir and Sam Slater using on-location recording and algorithmic processing — the same approach and instrumentation that defined their scores for Joker and Chernobyl." },
    "/martina-bertoni":          { title: "Martina Bertoni — Electroacoustic Works for Halldorophone", description: "Martina Bertoni's 2025 album on Karlrecords, composed and recorded at EMS Stockholm using a halldorophone built by Halldór Úlfarsson. A Dolby Atmos edition followed in 2026. The work uses the instrument as an algorithmic system for exploring tuning and harmonic frequency relationships." },
    "/the-knife-tomorrow-in-a-year": { title: "The Halldorophone on The Knife's Tomorrow, in a Year", description: "Hildur Guðnadóttir played halldorophone on The Knife's 2010 album Tomorrow, in a Year — a studio opera based on Charles Darwin's On the Origin of Species, created in collaboration with Mt. Sims and Planningtorock for Hotel Pro Forma." },
  };

  // Schema.org structured data per route
  const schemaData = {
    "/hildur": [
      {
        "@context": "https://schema.org",
        "@type": "MusicComposition",
        "name": "Joker (Original Motion Picture Soundtrack)",
        "datePublished": "2019",
        "composer": { "@type": "Person", "name": "Hildur Guðnadóttir" },
        "award": "Academy Award for Best Original Score (2020), BAFTA Award for Best Original Music, Golden Globe Award for Best Original Score",
        "description": "Score composed and performed primarily on the halldorophone, built by Halldór Úlfarsson. Themes were written before filming began; director Todd Phillips played recordings on set.",
        "instrument": { "@type": "Product", "name": "Halldorophone", "url": "https://halldorophone.info/" }
      },
      {
        "@context": "https://schema.org",
        "@type": "MusicComposition",
        "name": "Chernobyl (Original Series Soundtrack)",
        "datePublished": "2019",
        "composer": { "@type": "Person", "name": "Hildur Guðnadóttir" },
        "award": "Primetime Emmy Award for Outstanding Music Composition, Grammy Award for Best Score Soundtrack for Visual Media, BAFTA TV Award",
        "instrument": { "@type": "Product", "name": "Halldorophone", "url": "https://halldorophone.info/" }
      }
    ],
    "/sunn-life-metal": [
      {
        "@context": "https://schema.org",
        "@type": "MusicAlbum",
        "name": "Life Metal",
        "datePublished": "2019-04-26",
        "byArtist": { "@type": "MusicGroup", "name": "Sunn O)))" },
        "recordLabel": { "@type": "Organization", "name": "Southern Lord Records" },
        "description": "Eighth studio album by Sunn O))), recorded on analog tape by Steve Albini at Electrical Audio. Features Hildur Guðnadóttir on halldorophone on closing track Novæ.",
        "track": [
          { "@type": "MusicRecording", "name": "Between Sleipnir's Breaths", "byArtist": { "@type": "Person", "name": "Hildur Guðnadóttir" } },
          { "@type": "MusicRecording", "name": "Novæ", "byArtist": { "@type": "Person", "name": "Hildur Guðnadóttir" } }
        ]
      }
    ],
    "/arrival-soundtrack": [
      {
        "@context": "https://schema.org",
        "@type": "MusicAlbum",
        "name": "Arrival (Original Motion Picture Soundtrack)",
        "datePublished": "2016-11-11",
        "byArtist": { "@type": "Person", "name": "Jóhann Jóhannsson" },
        "recordLabel": { "@type": "Organization", "name": "Deutsche Grammophon" },
        "description": "Score for Denis Villeneuve's 2016 film Arrival. Hildur Guðnadóttir is credited on cello, halldorophone (listed as dórophone), and voice."
      }
    ],
    "/battlefield-2042": [
      {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        "name": "Battlefield 2042",
        "datePublished": "2021-11-19",
        "publisher": { "@type": "Organization", "name": "EA Games" },
        "musicBy": [
          { "@type": "Person", "name": "Hildur Guðnadóttir" },
          { "@type": "Person", "name": "Sam Slater" }
        ],
        "description": "First-person shooter developed by DICE. Soundtrack by Hildur Guðnadóttir and Sam Slater, built from drone textures and on-location recording consistent with their Joker and Chernobyl work."
      }
    ],
    "/martina-bertoni": [
      {
        "@context": "https://schema.org",
        "@type": "MusicAlbum",
        "name": "Electroacoustic Works for Halldorophone",
        "datePublished": "2025-02-21",
        "byArtist": { "@type": "Person", "name": "Martina Bertoni" },
        "recordLabel": { "@type": "Organization", "name": "Karlrecords" },
        "description": "Four pieces composed and recorded at EMS Stockholm using a halldorophone built by Halldór Úlfarsson. A Dolby Atmos edition was released in February 2026.",
        "track": [
          { "@type": "MusicRecording", "name": "Nr.1 Omen in G" },
          { "@type": "MusicRecording", "name": "Nr.2 Nominal D" },
          { "@type": "MusicRecording", "name": "Nr.3 Fades in C" },
          { "@type": "MusicRecording", "name": "Nr.4 Organon in D" }
        ]
      }
    ],
    "/the-knife-tomorrow-in-a-year": [
      {
        "@context": "https://schema.org",
        "@type": "MusicAlbum",
        "name": "Tomorrow, in a Year",
        "datePublished": "2010-02-01",
        "byArtist": { "@type": "MusicGroup", "name": "The Knife" },
        "recordLabel": { "@type": "Organization", "name": "Rabid Records" },
        "description": "Studio opera by The Knife with Mt. Sims and Planningtorock, based on Charles Darwin's On the Origin of Species. Hildur Guðnadóttir plays halldorophone on two tracks and cello on three."
      }
    ]
  };

  function updateSeo(urlPath) {
    const base = "https://halldorophone.info";
    const meta = seoMeta[urlPath] || seoMeta["/"];
    const fullUrl = base + (urlPath === "/" ? "" : urlPath);

    document.title = meta.title;

    let descEl = document.querySelector("meta[name='description']");
    if (descEl) descEl.setAttribute("content", meta.description);

    let canonEl = document.querySelector("link[rel='canonical']");
    if (canonEl) canonEl.setAttribute("href", fullUrl);

    const ogTags = { "og:url": fullUrl, "og:title": meta.title, "og:description": meta.description };
    Object.entries(ogTags).forEach(([prop, val]) => {
      let el = document.querySelector(`meta[property='${prop}']`);
      if (el) el.setAttribute("content", val);
    });

    const twTags = { "twitter:title": meta.title, "twitter:description": meta.description };
    Object.entries(twTags).forEach(([name, val]) => {
      let el = document.querySelector(`meta[name='${name}']`);
      if (el) el.setAttribute("content", val);
    });

    // Inject or update schema.org structured data
    document.querySelectorAll('script[data-schema-dynamic]').forEach(el => el.remove());
    const schemas = schemaData[urlPath];
    if (schemas) {
      schemas.forEach(schema => {
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.setAttribute('data-schema-dynamic', '');
        s.textContent = JSON.stringify(schema);
        document.head.appendChild(s);
      });
    }
  }

  // Map clean URL paths to markdown file paths
  const urlPathMap = {
    "/further-reading":        "Research/research.md",
    "/list-of-halldorophones": "Research/List-of-Halldorophones.md",
    "/halldorobass":           "Research/halldorobass.md",
    "/order":                  "Research/Order.md",
    "/about":                  "Research/about.md",
    "/hildur":                 "Research/hildur.md",
    "/sunn-life-metal":         "Research/sunn-life-metal.md",
    "/arrival-soundtrack":       "Research/arrival-soundtrack.md",
    "/battlefield-2042":         "Research/battlefield-2042.md",
    "/martina-bertoni":          "Research/martina-bertoni.md",
    "/the-knife-tomorrow-in-a-year": "Research/the-knife-tomorrow-in-a-year.md",
  };

  function loadResearchPage(path, title, pushState = true) {
    const cleanUrl = Object.keys(urlPathMap).find(k => urlPathMap[k] === path) || null;
    if (pushState && !isLocalDev) {
      if (cleanUrl) {
        history.pushState({ path, title }, "", cleanUrl);
      }
    }
    updateSeo(cleanUrl || "/");
    const resolvedPath = new URL(path, window.location.href).href;
    fetch(resolvedPath)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Research page request failed");
        }
        return res.text();
      })
      .then((markdown) => {
        const contentHost = document.createElement("div");
        contentHost.className = "wiki-host";
        contentHost.innerHTML = markdownToHtml(markdown);
        renderShadowContent(contentHost, "");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function loadHomePage() {
    if (!isLocalDev) history.pushState({}, "", "/");
    updateSeo("/");
    fetch(endpoint)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Wikipedia API request failed");
        }
        return res.json();
      })
      .then((data) => {
        if (!data.parse || !data.parse.text) {
          throw new Error("Wikipedia API did not return article HTML");
        }

        const sourceUrl = "https://en.wikipedia.org/wiki/Halldorophone";

        const parsedDoc = new DOMParser().parseFromString(data.parse.text, "text/html");

        parsedDoc
          .querySelectorAll(".mw-editsection, .reflist, .navbox, .metadata, .hatnote")
          .forEach((node) => node.remove());

        parsedDoc.querySelectorAll("a[href]").forEach((link) => {
          const href = link.getAttribute("href");
          if (!href || href.startsWith("#")) return;
          if (href.startsWith("/")) {
            link.href = `https://en.wikipedia.org${href}`;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
          }
        });

        parsedDoc.querySelectorAll("img[src]").forEach((img) => {
          const src = img.getAttribute("src");
          if (!src) return;
          if (src.startsWith("//")) {
            img.src = `https:${src}`;
          } else if (src.startsWith("/")) {
            img.src = `https://en.wikipedia.org${src}`;
          }
        });

        const contentHost = document.createElement("div");
        contentHost.className = "wiki-host";

        const sourceBanner = document.createElement("div");
        sourceBanner.className = "wiki-shell";
        sourceBanner.innerHTML = `
          <header class="wiki-topbar" aria-label="Wikipedia header">
            <div class="wiki-brand" aria-hidden="true">
              <div class="wiki-brand-wordmark">Wikipedia</div>
              <span class="wiki-brand-tagline">The free encyclopedia</span>
            </div>
          </header>
          <section class="wiki-page-head" aria-label="Article header">
            <div class="wiki-page-title-row">
              <h1 class="wiki-page-title">Halldorophone</h1>
              <a class="wiki-lang" href="${sourceUrl}" target="_blank" rel="noopener noreferrer" aria-label="View available languages on Wikipedia">
                <svg class="wiki-lang-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                  <path d="M3.5 4.5h7.8v1.2H8.2c.5 1.4 1.2 2.6 2.1 3.6.6-.9 1-1.8 1.3-2.9h1.3c-.4 1.4-.9 2.7-1.8 3.9.9.8 2.1 1.4 3.5 1.9l-.5 1.2c-1.5-.5-2.8-1.3-3.8-2.2-1 1-2.2 1.8-3.8 2.4l-.5-1.2c1.4-.5 2.6-1.2 3.5-2.1-1-1.1-1.8-2.6-2.3-4.3H3.5z"/>
                  <path d="M14.5 12.5h1.2l2.3 5.4h-1.3l-.5-1.3h-2.4l-.5 1.3h-1.3zm1.3 3-0.8-2-0.8 2z"/>
                </svg>
                <span>2 languages</span>
                <span class="wiki-lang-caret">⌄</span>
              </a>
            </div>
            <div class="wiki-tabs-row">
              <nav class="wiki-tabs" aria-label="Article tabs">
                <a class="wiki-tab active" href="${sourceUrl}" target="_blank" rel="noopener noreferrer">Article</a>
                <a class="wiki-tab" href="https://en.wikipedia.org/wiki/Talk:Halldorophone" target="_blank" rel="noopener noreferrer">Talk</a>
              </nav>
              <nav class="wiki-actions" aria-label="Page actions">
                <a class="wiki-action active" href="${sourceUrl}" target="_blank" rel="noopener noreferrer">Read</a>
                <a class="wiki-action" href="https://en.wikipedia.org/w/index.php?title=Halldorophone&action=edit" target="_blank" rel="noopener noreferrer">Edit</a>
                <a class="wiki-action" href="https://en.wikipedia.org/w/index.php?title=Halldorophone&action=history" target="_blank" rel="noopener noreferrer">View history</a>
                <a class="wiki-action" href="${sourceUrl}" target="_blank" rel="noopener noreferrer">Tools</a>
              </nav>
            </div>
          </section>
          <div class="wiki-source-line">
            <p>From Wikipedia, the free encyclopedia</p>
            <div class="wiki-source-url">URL: <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${sourceUrl}</a></div>
          </div>
        `;

        const articleBody = document.createElement("div");
        articleBody.className = "wiki-embed-body";
        articleBody.innerHTML = parsedDoc.body.innerHTML;

        contentHost.append(sourceBanner, articleBody);

        renderShadowContent(contentHost, "", {
          useWikipediaCss: true,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  homeLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      loadHomePage();
    });
  });

  researchLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const path = link.getAttribute("href");
      if (path) {
        loadResearchPage(path);
      }
    });
  });

  // Handle browser back/forward
  window.addEventListener("popstate", (event) => {
    if (event.state && event.state.path) {
      loadResearchPage(event.state.path, event.state.title, false);
    } else {
      updateSeo("/");
      loadHomePage();
    }
  });

  // On load, check the URL path and open the right page (production only)
  const initialPath = window.location.pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/";
  if (!isLocalDev && urlPathMap[initialPath]) {
    loadResearchPage(urlPathMap[initialPath], "", false);
  } else {
    loadHomePage();
  }
})();
