export default async function handler(req: any, res: any) {
  try {
    const rawUrl = (req.query?.url as string) || '';
    if (!rawUrl) {
      return res.status(400).send('Missing url parameter');
    }

    const targetUrl = decodeURIComponent(rawUrl);
    const parsed = new URL(targetUrl);

    // Security: Only allow preview domains from superdesign
    if (
      !parsed.hostname.endsWith('superdesign.dev') &&
      !parsed.hostname.endsWith('supabase.co')
    ) {
      return res.status(403).send('Forbidden hostname');
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .send(`Failed to fetch preview from source: ${response.statusText}`);
    }

    let html = await response.text();

    // Inject base href so that relative links, styles, fonts, and scripts load seamlessly
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head><base href="${targetUrl}">`);
    } else if (html.includes('<html')) {
      html = html.replace(/(<html[^>]*>)/i, `$1<head><base href="${targetUrl}"></head>`);
    }

    // Strip internal Superdesign visual edit bridge which tries to talk to parent editor and throws postMessage errors
    html = html.replace(/<script[^>]*__visual-edit-bridge[^>]*><\/script>/gi, '');

    // Allow frame embedding on our own origin
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader(
      'Cache-Control',
      'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
    );
    // Removing the restrictive frame-ancestors from the response allows our iframe to render it
    return res.status(200).send(html);
  } catch (err: any) {
    return res.status(500).send(`Error proxying preview: ${err.message}`);
  }
}
