const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const PORT = 3000;
const BACKEND_DIR = __dirname;
const FRONTEND_DIR = path.join(BACKEND_DIR, '..', 'frontend');

const solverPath = path.join(BACKEND_DIR, process.platform === 'win32' ? 'wordhunt_solver.exe' : 'wordhunt_solver');

function serveFile(filePath, res, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function serveFrontend(req, res) {
  const urlPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(FRONTEND_DIR, urlPath.replace(/^\//, ''));
  const ext = path.extname(filePath);
  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  };
  if (path.relative(FRONTEND_DIR, filePath).startsWith('..')) {
    res.writeHead(403);
    res.end();
    return;
  }
  serveFile(filePath, res, types[ext] || 'application/octet-stream');
}

function handleSolve(letters, res) {
  const normalized = (letters || '').replace(/\s/g, '').toLowerCase();
  if (normalized.length !== 16 || !/^[a-z]+$/.test(normalized)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Provide exactly 16 letters (a-z).' }));
    return;
  }

  const child = spawn(solverPath, [normalized], {
    cwd: BACKEND_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let stdout = '';
  let stderr = '';
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (chunk) => { stdout += chunk; });
  child.stderr.on('data', (chunk) => { stderr += chunk; });

  child.on('close', (code) => {
    if (code !== 0) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Solver failed.', stderr: stderr.slice(0, 500) }));
      return;
    }
    const words = stdout
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ words }));
  });

  child.on('error', (err) => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Could not run solver. Run "make" in backend folder.', detail: err.message }));
  });
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/solve') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const { letters } = JSON.parse(body || '{}');
        handleSolve(letters, res);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body. Send { "letters": "..." }.' }));
      }
    });
    return;
  }

  if (req.method === 'GET') {
    serveFrontend(req, res);
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Word Hunt solver server at http://localhost:${PORT}`);
  console.log('Build the C++ solver with: make (in backend folder)');
});
