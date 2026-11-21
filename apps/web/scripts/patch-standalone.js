const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const standaloneDir = path.join(rootDir, '.next', 'standalone');
const serverJsPath = path.join(standaloneDir, 'server.js');

console.log('[patch-standalone] Starting post-build standalone patching...');

if (!fs.existsSync(serverJsPath)) {
  console.error('[patch-standalone] Error: .next/standalone/server.js not found at:', serverJsPath);
  process.exit(1);
}

let content = fs.readFileSync(serverJsPath, 'utf8');

// Replace port and hostname logic with LiteSpeed / Phusion Passenger Unix socket compatible handler
const newPortLogic = `// LiteSpeed Web Server & Phusion Passenger Socket Compatibility Fix
let currentPort = parseInt(process.env.PORT, 10) || 3000;
let hostname = process.env.HOSTNAME || '0.0.0.0';

// Check if LiteSpeed or Hostinger passed a Unix domain socket path in HOSTNAME or PORT
const sockCandidate = (process.env.HOSTNAME && (process.env.HOSTNAME.includes('.sock') || process.env.HOSTNAME.includes('/')))
  ? process.env.HOSTNAME
  : (process.env.PORT && (String(process.env.PORT).includes('.sock') || String(process.env.PORT).includes('/')) ? process.env.PORT : null);

if (sockCandidate) {
  // Bind directly to the Unix domain socket so LiteSpeed can proxy requests instantly
  currentPort = sockCandidate;
  hostname = undefined;
  console.log('[Hastina Server] Binding to LiteSpeed Unix socket:', currentPort);
} else if (process.env.PORT === 'passenger') {
  currentPort = 'passenger';
  hostname = undefined;
  console.log('[Hastina Server] Passenger hook mode');
} else {
  console.log('[Hastina Server] Standard TCP mode on', hostname, ':', currentPort);
}`;

// Pattern matches either our previous patch or the stock Next.js code
const oldPattern1 = "const currentPort = parseInt(process.env.PORT, 10) || 3000\nconst hostname = process.env.HOSTNAME || '0.0.0.0'";
const oldPattern2 = `// Phusion Passenger / Hostinger LiteSpeed compatibility fix
const rawPort = process.env.PORT;
const isPassenger = rawPort === 'passenger' || (typeof rawPort === 'string' && (rawPort.includes('/') || rawPort.includes('\\\\') || isNaN(Number(rawPort))));
const currentPort = isPassenger ? rawPort : (parseInt(rawPort, 10) || 3000);
const hostname = isPassenger ? undefined : (process.env.HOSTNAME || '0.0.0.0');
console.log('[Hastina Server] PORT env:', rawPort, '| isPassenger:', isPassenger, '| Listening on:', currentPort, '| Hostname:', hostname);`;

if (content.includes(oldPattern2)) {
  content = content.replace(oldPattern2, newPortLogic);
  fs.writeFileSync(serverJsPath, content, 'utf8');
  console.log('[patch-standalone] Successfully updated server.js with LiteSpeed socket handler!');
} else if (content.includes(oldPattern1)) {
  content = content.replace(oldPattern1, newPortLogic);
  fs.writeFileSync(serverJsPath, content, 'utf8');
  console.log('[patch-standalone] Successfully patched server.js with LiteSpeed socket handler!');
} else {
  console.warn('[patch-standalone] Could not find target pattern in server.js');
}

// Ensure .next/static is copied to .next/standalone/.next/static
const srcStatic = path.join(rootDir, '.next', 'static');
const destStatic = path.join(standaloneDir, '.next', 'static');
if (fs.existsSync(srcStatic)) {
  fs.cpSync(srcStatic, destStatic, { recursive: true, force: true });
  console.log('[patch-standalone] Successfully copied .next/static to .next/standalone/.next/static');
}

// Ensure public is copied to .next/standalone/public
const srcPublic = path.join(rootDir, 'public');
const destPublic = path.join(standaloneDir, 'public');
if (fs.existsSync(srcPublic)) {
  fs.cpSync(srcPublic, destPublic, { recursive: true, force: true });
  console.log('[patch-standalone] Successfully copied public to .next/standalone/public');
}

console.log('[patch-standalone] All post-build steps completed successfully!');
