/// <reference types="@cloudflare/workers-types" />

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    let targetUrl = url.searchParams.get('url');

    // 1. Handle Preflight OPTIONS request for CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    let refererTarget: string | null = null;
    if (!targetUrl) {
      const referer = request.headers.get('Referer');
      if (referer) {
        try {
          const refererUrl = new URL(referer);
          refererTarget = refererUrl.searchParams.get('url');
          if (refererTarget) {
            const origin = new URL(refererTarget).origin;
            const path = url.pathname.startsWith('/') ? url.pathname : '/' + url.pathname;
            targetUrl = origin + path + url.search;
          }
        } catch (e) {}
      }
    }

    if (!targetUrl) {
      return new Response('Missing target URL parameter', { status: 400 });
    }

    try {
      const targetOrigin = new URL(targetUrl).origin;
      
      // 2. Forward all client headers, but overwrite Referer/Origin for security
      const headers = new Headers(request.headers);
      headers.set('User-Agent', request.headers.get('User-Agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
      
      // Use the parent page (refererTarget) or the target URL as the Referer
      // Overwrite the client's Referer (which is localhost or our vercel domain)
      headers.set('Referer', refererTarget || targetUrl);
      
      // Only set Origin if it was sent by the client, otherwise we trigger CDN CORS blocks
      if (request.headers.get('Origin')) {
        headers.set('Origin', targetOrigin);
      }
      
      // Remove any headers that identify this as a proxy or interfere with target checks
      for (const header of Array.from(headers.keys())) {
        if (header.toLowerCase().startsWith('sec-fetch-') || 
            header.toLowerCase().startsWith('x-forwarded-') || 
            header.toLowerCase().startsWith('cf-')) {
          headers.delete(header);
        }
      }

      const response = await fetch(targetUrl, {
        method: request.method,
        headers: headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.arrayBuffer() : undefined,
        redirect: 'follow'
      });

      const contentType = response.headers.get('content-type') || '';
      let finalResponse = response;

      // 3. Only modify HTML responses for sync script injection
      if (contentType.includes('text/html')) {
        finalResponse = new HTMLRewriter()
          .on('head', {
            element(e: any) {
              e.append(`
<script>
  (function() {
    try {
      Object.defineProperty(window.history, 'pushState', { value: function() {}, writable: false });
      Object.defineProperty(window.history, 'replaceState', { value: function() {}, writable: false });
    } catch (e) {}
  })();

  window.addEventListener('message', (event) => {
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      if (data.source === 'landemon-party') {
        const v = document.querySelector('video');
        if (v) {
          if (data.action === 'play') v.play().catch(e => console.error('Play blocked', e));
          if (data.action === 'pause') v.pause();
          if (data.action === 'seek' && data.time !== undefined) {
             if (Math.abs(v.currentTime - data.time) > 2) v.currentTime = data.time;
          }
        }
      }
    } catch(err) {}
  });

  setInterval(() => {
    const v = document.querySelector('video');
    if (v && window.parent && window.parent !== window) {
      window.parent.postMessage({
        source: 'landemon-proxy',
        state: { paused: v.paused, currentTime: v.currentTime, duration: v.duration }
      }, '*');
    }
  }, 1000);
</script>
              `, { html: true });
            }
          })
          .transform(response);
      }

      // 4. Set CORS and Frame headers for ALL responses (APIs and Video chunks need CORS too)
      const resHeaders = new Headers(finalResponse.headers);
      resHeaders.delete('X-Frame-Options');
      resHeaders.delete('Content-Security-Policy');
      resHeaders.delete('Cross-Origin-Resource-Policy');
      resHeaders.set('Access-Control-Allow-Origin', '*');
      resHeaders.set('X-Frame-Options', 'ALLOWALL');
      resHeaders.set('Content-Security-Policy', 'frame-ancestors *');
      resHeaders.set('X-Proxied-By', 'LandeMon');

      return new Response(finalResponse.body, {
        headers: resHeaders,
        status: finalResponse.status,
        statusText: finalResponse.statusText
      });
    } catch (error) {
      return new Response(`Cloudflare Proxy Error: ${error}`, { status: 500 });
    }
  }
};
