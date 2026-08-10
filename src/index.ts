import { buildServer } from './server';
import { config } from './config';

const app = buildServer();

app.listen({ port: config.port, host: '0.0.0.0' }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
