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

// Replace port and hostname logic with Phusion Passenger / LiteSpeed compatible handler
const oldPortLogic = "const currentPort = parseInt(process.env.PORT, 10) || 3000\nconst hostname = process.env.HOSTNAME || '0.0.0.0'";
const newPortLogic = `// Phusion Passenger / Hostinger LiteSpeed compatibility fix
const rawPort = process.env.PORT;
const isPassenger = rawPort === 'passenger' || (typeof rawPort === 'string' && (rawPort.includes('/') || rawPort.includes('\\\\') || isNaN(Number(rawPort))));
const currentPort = isPassenger ? rawPort : (parseInt(rawPort, 10) || 3000);
const hostname = isPassenger ? undefined : (process.env.HOSTNAME || '0.0.0.0');
console.log('[Hastina Server] PORT env:', rawPort, '| isPassenger:', isPassenger, '| Listening on:', currentPort, '| Hostname:', hostname);`;

if (content.includes(oldPortLogic)) {
  content = content.replace(oldPortLogic, newPortLogic);
  fs.writeFileSync(serverJsPath, content, 'utf8');
  console.log('[patch-standalone] Successfully patched server.js with Passenger compatibility!');
} else {
  console.warn('[patch-standalone] Target pattern not found in server.js. Inspecting content...');
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
