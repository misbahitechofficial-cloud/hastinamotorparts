const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const rawPort = process.env.PORT || 3000;

// On Hostinger / Phusion Passenger / LiteSpeed:
// process.env.PORT can be either a numeric port (e.g. 3000) OR a Unix domain socket path (e.g. /usr/local/lsws/.../_.sock).
// In Node.js, server.listen(target) accepts:
// - number: TCP port
// - string: Unix domain socket path or Windows named pipe
const listenTarget = (!isNaN(rawPort) && !String(rawPort).includes('/') && !String(rawPort).includes('\\'))
  ? parseInt(rawPort, 10)
  : rawPort;

console.log(`[Hastina Bootstrap] Starting Next.js app in ${dev ? 'development' : 'production'} mode...`);
console.log(`[Hastina Bootstrap] Raw PORT env: "${process.env.PORT}", Listen Target: "${listenTarget}"`);

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = createServer((req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
      } catch (err) {
        console.error('[Hastina Server] Request handler error:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

    server.listen(listenTarget, (err) => {
      if (err) {
        console.error('[Hastina Server] Failed to listen on target:', listenTarget, err);
        process.exit(1);
      }
      console.log(`[Hastina Server] Ready and successfully listening on: ${listenTarget}`);
    });
  })
  .catch((err) => {
    console.error('[Hastina Server] Fatal error during Next.js app.prepare():', err);
    process.exit(1);
  });
