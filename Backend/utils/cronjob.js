import cron from 'node-cron';
import axios from 'axios';
const PING_URL = process.env.PING_URL || `http://localhost:${process.env.PORT}/ping`;

// Function to start cron pings
const startSelfPing = ()=> {
  // Cron expression "*/14 * * * *" => every 14 minutes
  cron.schedule(
    '*/14 * * * *',
    async () => {
      try {
        console.log(`[Ping] ${new Date().toISOString()} - GET ${PING_URL}`);
        const resp = await axios.get(PING_URL, { timeout: 8000 });
        console.log(`[Ping] success: ${resp.status} ${resp.statusText}`);
      } catch (error) {
        // log minimal error detail (avoid leaking sensitive info)
        console.error('[Ping] failed:', error.message);
      }
    },
    {
      scheduled: true,
      timezone: process.env.PING_TIMEZONE || 'UTC',
    }
  );

  console.log('[Ping] Cron job scheduled: every 14 minutes');
}

export { startSelfPing };
