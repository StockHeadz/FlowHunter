import { candidates, prints, alerts } from '../data/demoData.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDashboardData() {
  // Demo adapter. Replace with fetch('/api/candidates'), fetch('/api/alerts'), etc.
  await sleep(120);
  return {
    candidates,
    prints,
    alerts,
    status: {
      mode: 'DEMO DATA',
      delayed: true,
      delayLabel: 'Static prototype',
      updatedAt: new Date()
    }
  };
}
