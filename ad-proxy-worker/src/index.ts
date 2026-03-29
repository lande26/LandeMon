export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

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
        // Strip out malicious ad networks and click-overlay scripts, AND rewrite relative assets
        finalResponse = new HTMLRewriter()
          .on('script', {
            element(e: any) {
              const src = e.getAttribute('src');
              if (src) {
                // Block ads
                const blocked = [
                  'adsterra', 'popads', 'onclick', 'propeller', 
                  'exoclick', 'popcash', 'realsrv', 'histats'
                ];
                if (blocked.some(domain => src.includes(domain))) {
                  e.remove();
                  return;
                }
                
                // Rewrite relative JS
                if (src.startsWith('/')) {
                  e.setAttribute('src', targetOrigin + src);
                }
              }
            }
          })
          .on('link', {
            element(e: any) {
              const href = e.getAttribute('href');
              // Rewrite relative CSS
              if (href && href.startsWith('/')) {
                e.setAttribute('href', targetOrigin + href);
              }
            }
          })
          .on('img', {
            element(e: any) {
              const src = e.getAttribute('src');
              if (src && src.startsWith('/')) {
                e.setAttribute('src', targetOrigin + src);
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
