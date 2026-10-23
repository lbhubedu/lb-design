import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function previewProxyPlugin(): Plugin {
  // Mesma allowlist de api/preview.ts — mantenha as duas em sincronia.
  const ALLOWED_HOSTS = ['superdesign.dev', 'supabase.co'];
  const isAllowedHost = (hostname: string) => {
    const h = hostname.toLowerCase();
    return ALLOWED_HOSTS.some((host) => h === host || h.endsWith(`.${host}`));
  };

  return {
    name: 'preview-proxy',
    configureServer(server) {
      server.middlewares.use('/api/preview', async (req, res) => {
        try {
          const urlObj = new URL(req.url || '', 'http://localhost');
          const rawUrl = urlObj.searchParams.get('url');
          if (!rawUrl) {
            res.statusCode = 400;
            res.end('Missing url parameter');
            return;
          }
          let parsed: URL;
          try {
            parsed = new URL(decodeURIComponent(rawUrl));
          } catch {
            res.statusCode = 400;
            res.end('Invalid url parameter');
            return;
          }
          if (
            (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') ||
            !isAllowedHost(parsed.hostname)
          ) {
            res.statusCode = 403;
            res.end('Forbidden hostname');
            return;
          }
          const targetUrl = parsed.toString();
          const response = await fetch(targetUrl, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
          });
          if (!response.ok) {
            res.statusCode = response.status;
            res.end(`Failed to fetch preview: ${response.statusText}`);
            return;
          }
          let html = await response.text();
          if (html.includes('<head>')) {
            html = html.replace('<head>', `<head><base href="${targetUrl}">`);
          } else if (html.includes('<html')) {
            html = html.replace(/(<html[^>]*>)/i, `$1<head><base href="${targetUrl}"></head>`);
          }
          html = html.replace(/<script[^>]*__visual-edit-bridge[^>]*><\/script>/gi, '');
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(html);
        } catch (err: any) {
          res.statusCode = 500;
          res.end(`Error proxying preview: ${err.message}`);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), previewProxyPlugin()],
})
