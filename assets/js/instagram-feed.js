(() => {
  // Behold.so feed for @halldorophone — refreshes itself; no token to manage.
  const FEED_URL = 'https://feeds.behold.so/ZNypu39TVELC7byuyqux';

  // Cache the response in localStorage so the Behold endpoint is hit at most
  // once per browser per day (Behold free plan has a monthly request cap).
  const CACHE_KEY = 'halldorophone:insta-feed:v1';
  const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

  function readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.savedAt !== 'number') return null;
      if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;
      return parsed.data || null;
    } catch (_) {
      return null;
    }
  }

  function writeCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
    } catch (_) { /* quota / private mode — ignore */ }
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function pickImage(post) {
    return (post.sizes && post.sizes.small && post.sizes.small.mediaUrl)
        || (post.sizes && post.sizes.medium && post.sizes.medium.mediaUrl)
        || post.mediaUrl;
  }

  function renderFeed(posts) {
    const grid = document.getElementById('insta-feed-grid');
    if (!grid) return;

    if (!posts.length) {
      grid.innerHTML = '<p class="insta-error">No posts yet.</p>';
      return;
    }

    grid.innerHTML = posts.slice(0, 4).map(post => {
      const date = formatDate(post.timestamp);
      const captionRaw = post.caption ? post.caption.split('\n')[0] : '';
      const short = captionRaw.length > 80 ? captionRaw.slice(0, 80).trimEnd() + '\u2026' : captionRaw;
      const img = pickImage(post);
      const safeAria = (short || ('Instagram post from ' + date)).replace(/"/g, '&quot;');
      return `<a class="insta-post" href="${post.permalink}" target="_blank" rel="noopener noreferrer" aria-label="${safeAria}">
  <img src="${img}" alt="${safeAria}" loading="lazy" />
  <div class="insta-overlay">
    <span class="insta-caption">${short}</span>
    <span class="insta-date">${date}</span>
  </div>
</a>`;
    }).join('');
  }

  function init() {
    // Serve from cache if it's fresh.
    const cached = readCache();
    if (cached && Array.isArray(cached.posts)) {
      renderFeed(cached.posts);
      return;
    }

    fetch(FEED_URL)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load Instagram feed (' + r.status + ')');
        return r.json();
      })
      .then(data => {
        writeCache(data);
        renderFeed(data.posts || []);
      })
      .catch(err => {
        // Network or rate-limit failure — fall back to a stale cache if we have one,
        // even if older than the TTL, rather than showing the error state.
        try {
          const raw = localStorage.getItem(CACHE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.data && Array.isArray(parsed.data.posts)) {
              renderFeed(parsed.data.posts);
              return;
            }
          }
        } catch (_) { /* ignore */ }

        const grid = document.getElementById('insta-feed-grid');
        if (grid) grid.innerHTML = '<p class="insta-error">Instagram feed unavailable.</p>';
        console.warn('instagram-feed:', err.message);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
