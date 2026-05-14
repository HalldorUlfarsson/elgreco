(function () {
  const posters = document.querySelectorAll('.video-poster');
  if (!posters.length) return;

  // YouTube Data API v3 key. Restricted by HTTP referrer; visible in source.
  const YT_API_KEY = 'AIzaSyDTVPUM4mzeiCWPu2f7n0451yoZ9XwZF58';

  // Fetch every videoId in a playlist (paginates 50 at a time).
  async function fetchPlaylistVideoIds(playlistId) {
    const ids = [];
    let pageToken = '';
    for (let i = 0; i < 10; i++) {
      const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
      url.searchParams.set('part', 'contentDetails');
      url.searchParams.set('maxResults', '50');
      url.searchParams.set('playlistId', playlistId);
      url.searchParams.set('key', YT_API_KEY);
      if (pageToken) url.searchParams.set('pageToken', pageToken);
      const r = await fetch(url.toString());
      if (!r.ok) throw new Error('YouTube API ' + r.status);
      const data = await r.json();
      for (const item of data.items || []) {
        if (item.contentDetails && item.contentDetails.videoId) {
          ids.push(item.contentDetails.videoId);
        }
      }
      if (!data.nextPageToken) break;
      pageToken = data.nextPageToken;
    }
    return ids;
  }

  // Pick a random video from a playlist, avoiding the previous session's pick.
  function pickRandom(ids, playlistId) {
    const PREV_KEY = 'playlistPrev:' + playlistId;
    const prev = sessionStorage.getItem(PREV_KEY);
    const pool = ids.length > 1 && prev ? ids.filter((id) => id !== prev) : ids;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    try { sessionStorage.setItem(PREV_KEY, pick); } catch (e) {}
    return pick;
  }

  // Embed URL params chosen to minimize YouTube branding/end-screens.
  function buildEmbedSrc(videoId) {
    const params = new URLSearchParams({
      autoplay: '1',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
      iv_load_policy: '3',
      cc_load_policy: '0',
      color: 'white',
    });
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  }

  function setThumb(poster, videoId) {
    poster.style.backgroundImage = `url("https://i.ytimg.com/vi/${videoId}/hqdefault.jpg")`;
  }

  posters.forEach(async (poster) => {
    const videoId = poster.getAttribute('data-video-id');
    const playlistId = poster.getAttribute('data-playlist-id');
    if (!videoId && !playlistId) return;

    // For single-video posters, the thumb and target are the same up front.
    let targetId = videoId;

    if (playlistId) {
      // Resolve the random pick BEFORE the user clicks so the poster thumbnail
      // matches the video that will actually play.
      try {
        const ids = await fetchPlaylistVideoIds(playlistId);
        if (ids.length === 0) throw new Error('Empty playlist');
        targetId = pickRandom(ids, playlistId);
      } catch (e) {
        // Fall back to the static poster video if the API fails.
        targetId = poster.getAttribute('data-poster-video-id') || null;
      }
    }

    if (targetId) setThumb(poster, targetId);

    poster.addEventListener(
      'click',
      () => {
        let src;
        if (targetId) {
          src = buildEmbedSrc(targetId);
        } else if (playlistId) {
          // Last-ditch fallback if the API failed and there was no poster ID.
          src = `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1&rel=0&modestbranding=1`;
        } else {
          return;
        }

        const iframe = document.createElement('iframe');
        iframe.className = 'video-embed';
        iframe.title = 'YouTube video player';
        iframe.src = src;
        iframe.allow =
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen = true;
        poster.replaceWith(iframe);
      },
      { once: true }
    );
  });
})();
