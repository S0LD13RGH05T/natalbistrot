import express from 'express';
import path from 'path';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    const mode = process.env.NODE_ENV !== 'production' ? 'development' : 'production';
    console.log(`Server running in ${mode} mode at http://0.0.0.0:${PORT}`);
  });
}

startServer();
