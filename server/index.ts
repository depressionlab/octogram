import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import compression from 'compression';
import consola from 'consola';
import express from 'express';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WS_PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(compression());
app.use(morgan('tiny'));
app.disable('X-Powered-By');

if (process.env.NODE_ENV === 'production') {
	app.use('/assets', express.static('dist/client/assets', { immutable: true, maxAge: '1y' }));
	app.get('/', (_req, res) => res.sendFile(path.join(__dirname, '../client/index.html')));
}

app.listen(PORT, () => {
	consola.info(`HTTP server is running on http://localhost:${PORT}`);
});
