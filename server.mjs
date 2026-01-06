const PORT = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.ts': 'application/typescript',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.map': 'application/json',
  '.d.ts': 'application/typescript',
};

Bun.serve({
  port: PORT,
  async fetch(request) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    if (pathname === '/') {
      pathname = '/index.html';
    }

    const filePath = `./dist${pathname}`;

    try {
      const file = Bun.file(filePath);
      const exists = await file.exists();

      if (!exists) {
        return new Response('Not Found', { status: 404 });
      }

      const ext = pathname.substring(pathname.lastIndexOf('.'));
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      const response = new Response(file, {
        headers: {
          'Content-Type': contentType,
          'Cross-Origin-Embedder-Policy': 'require-corp',
          'Cross-Origin-Opener-Policy': 'same-origin',
        },
      });

      return response;
    } catch (error) {
      console.error('Error serving file:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
});

console.log(`Server running at http://localhost:${PORT}`);
