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

// The new port logic ALWAYS leaves hostname as undefined.
// This is mandatory for Phusion Passenger & LiteSpeed so that Passenger can intercept
// http.Server.prototype.listen() without being bypassed by a host argument.
const newPortLogic = `// Phusion Passenger & LiteSpeed compatibility fix
const rawPort = process.env.PORT;
const isNumeric = rawPort && !isNaN(Number(rawPort));
const currentPort = isNumeric ? parseInt(rawPort, 10) : (rawPort || 3000);
// CRITICAL: NEVER pass '0.0.0.0' or 'localhost' as hostname!
// Passenger only hooks server.listen() when the hostname argument is omitted.
const hostname = undefined;
console.log('[Hastina Server] Passenger-ready listening on port:', currentPort, '(hostname: undefined)');`;

// Find everything from start of port definition to keepAliveTimeout
const startMarker = "// LiteSpeed Web Server & Phusion Passenger Socket Compatibility Fix";
const oldDefault = "const currentPort = parseInt(process.env.PORT, 10) || 3000\nconst hostname = process.env.HOSTNAME || '0.0.0.0'";

if (content.includes(startMarker)) {
  const parts = content.split(startMarker);
  const afterMarker = parts[1];
  const endIdx = afterMarker.indexOf("let keepAliveTimeout");
  if (endIdx !== -1) {
    content = parts[0] + newPortLogic + "\n\n" + afterMarker.substring(endIdx);
    fs.writeFileSync(serverJsPath, content, 'utf8');
    console.log('[patch-standalone] Successfully replaced custom port logic in server.js!');
  }
} else if (content.includes(oldDefault)) {
  content = content.replace(oldDefault, newPortLogic);
  fs.writeFileSync(serverJsPath, content, 'utf8');
  console.log('[patch-standalone] Successfully replaced default Next port logic in server.js!');
} else {
  console.warn('[patch-standalone] Target pattern not found in server.js. Looking for currentPort pattern...');
  const portRegex = /const currentPort = [\s\S]*?const hostname = [^\n]*\n/;
  if (portRegex.test(content)) {
    content = content.replace(portRegex, newPortLogic + '\n');
    fs.writeFileSync(serverJsPath, content, 'utf8');
    console.log('[patch-standalone] Successfully patched server.js with regex match!');
  }
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
