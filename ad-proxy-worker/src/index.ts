/// <reference types="@cloudflare/workers-types" />

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    let targetUrl = url.searchParams.get('url');

    // If it's a relative asset request (like /saas/css/embed.min.css) without a ?url= parameter,
    // we must deduce the target server by looking at the Referer header (e.g. http://localhost:8787/?url=https://vidsrc.cc/...)
    if (!targetUrl) {
      const referer = request.headers.get('Referer');
      if (referer) {
        try {
          const refererUrl = new URL(referer);
          const refererTarget = refererUrl.searchParams.get('url');
          if (refererTarget) {
            const origin = new URL(refererTarget).origin;
            // Reconstruct the actual asset URL pointing back to the original streaming server
            targetUrl = origin + url.pathname + url.search;
          }
        } catch (e) {
          // Ignore invalid referer parsing errors
        }
      }
    }

    if (!targetUrl) {
      return new Response('Missing target URL parameter', { status: 400 });
    }

    try {
      // 1. Fetch the original source video player
      const targetRequest = new Request(targetUrl, request);

      // Mimic a legitimate browser so streaming servers don't block us
      targetRequest.headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      // Some providers block requests if they suspect a proxy.
      targetRequest.headers.delete('X-Forwarded-For');
      targetRequest.headers.delete('CF-Connecting-IP');

      const response = await fetch(targetRequest);

      const contentType = response.headers.get('content-type') || '';

      let finalResponse = response;

      const targetOrigin = new URL(targetUrl).origin;

      // 2. Only modify HTML responses
      if (contentType.includes('text/html')) {
        finalResponse = new HTMLRewriter()
          .on('head', {
            element(e: any) {
              // Inject a base tag so the browser resolves relative assets directly to the target server
              e.prepend(`<base href="${targetOrigin}/">`, { html: true });
              
              // Inject the LandeMon Watch Party Sync Script
              e.append(`
<script>
  window.addEventListener('message', (event) => {
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      
      // 1. Handle commands from our main site (LandeMon)
      if (data.source === 'landemon-party') {
        // Relay to any children iframes that might be the actual player
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(f => {
           try { f.contentWindow.postMessage(data, '*'); } catch(e) {}
        });

        // Attempt to find any video element on the page
        const v = document.querySelector('video');
        if (v) {
          if (data.action === 'play') v.play().catch(e => console.error('Play blocked', e));
          if (data.action === 'pause') v.pause();
          if (data.action === 'seek' && data.time !== undefined) {
            if (Math.abs(v.currentTime - data.time) > 2) {
               v.currentTime = data.time;
            }
          }
        }
      }

      // 2. Relay state from child iframes upwards to our main site
      if (data.source === 'landemon-proxy' && window.parent && window.parent !== window) {
        window.parent.postMessage(data, '*');
      }
    } catch(err) {}
  });

  // Periodically send video state back to parent
  setInterval(() => {
    const v = document.querySelector('video');
    if (v && window.parent && window.parent !== window) {
      window.parent.postMessage({
        source: 'landemon-proxy',
        state: {
           paused: v.paused,
           currentTime: v.currentTime,
           duration: v.duration
        }
      }, '*');
    }
  }, 1000);
</script>
              `, { html: true });
            }
          })
          .on('iframe', {
            element(e: any) {
              const src = e.getAttribute('src');
              if (src) {
                // If it's a relative URL or on the same target origin, force it through proxy
                try {
                  const absoluteUrl = new URL(src, targetUrl).href;
                  // We proxy everything that isn't already our proxy to ensure sync script injection
                  if (!absoluteUrl.includes(url.origin)) {
                    e.setAttribute('src', `${url.origin}/?url=${encodeURIComponent(absoluteUrl)}`);
                  }
                } catch(err) {}
              }
            }
          })
          .on('script', {
            element(e: any) {
              const src = e.getAttribute('src');
              if (src) {
                // Block intrusive click-ad networks
                const blocked = [
                  'adsterra', 'popads', 'onclick', 'propeller',
                  'exoclick', 'popcash', 'realsrv', 'histats'
                ];
                if (blocked.some(domain => src.includes(domain))) {
                  e.remove();
                  return;
                }
              }
            }
          })
          // Often, they place a massive transparent DIV over the entire screen to catch the first click
          .on('div', {
            element(e: any) {
              const style = e.getAttribute('style') || '';
              const zIndexHigh = style.includes('z-index: 2147483647') || style.includes('z-index: 999999');
              const coversScreen = style.includes('width: 100%') && style.includes('height: 100%') && style.includes('position: absolute');

              if (zIndexHigh && coversScreen) {
                e.remove();
              }
            }
          })
          .transform(response);
      }

      const newResponse = new Response(finalResponse.body, finalResponse);
      newResponse.headers.delete('X-Frame-Options');
      newResponse.headers.delete('Content-Security-Policy');
      newResponse.headers.set('Access-Control-Allow-Origin', '*');

      return newResponse;
    } catch (error) {
      return new Response(`Cloudflare Proxy Error: ${error}`, { status: 500 });
    }
  }
};
