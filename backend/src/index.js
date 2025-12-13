import app from './app.js';
import config from './config/env.js';

// Start server
// eslint-disable-next-line no-console
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
