import Fastify from 'fastify';
import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

export const app = Fastify({
  logger,
  trustProxy: true,
});

// Healthcheck Route
app.get('/health', async () => {
  return { status: 'ok', service: 'unwind-api', timestamp: new Date().toISOString() };
});

// API V1 Routes
app.get('/api/v1/ping', async () => {
  return { message: 'Unwind Fastify API running on AWS Lambda', version: '0.1.0' };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 4000;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`Unwind Fastify API listening on http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}
