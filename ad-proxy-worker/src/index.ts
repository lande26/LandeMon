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
        // We don't need to rewrite relative paths natively anymore because the Referer logic handles it,
        // but it's safe to leave the malicious ad-blocker HTMLRewriter intact!
        finalResponse = new HTMLRewriter()
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
