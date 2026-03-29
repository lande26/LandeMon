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
      
      // 2. Only modify HTML responses
      if (contentType.includes('text/html')) {
        // Strip out malicious ad networks and click-overlay scripts
        return new HTMLRewriter()
          .on('script', {
            element(e) {
              const src = e.getAttribute('src');
              if (src) {
                const blocked = [
                  'adsterra', 
                  'popads', 
                  'onclick', 
                  'propeller', 
                  'exoclick', 
                  'popcash',
                  'realsrv',
                  'histats'
                ];
                if (blocked.some(domain => src.includes(domain))) {
                  e.remove();
                }
              }
            }
          })
          // Often, they place a massive transparent DIV over the entire screen to catch the first click
          .on('div', {
            element(e) {
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
      
      // If it's a video file or subtitle, pass it through completely untouched
      return response;
    } catch (error) {
      return new Response(`Cloudflare Proxy Error: ${error}`, { status: 500 });
    }
  }
};
