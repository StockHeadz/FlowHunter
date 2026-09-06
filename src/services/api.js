import * as demoData from '../data/demoData.js';

export async function getDashboardData() {
  return {
    ...demoData,
    status: {
      updatedAt: new Date(),
    },
  };
}

export async function getOptionsContracts(ticker) {
  const symbol = ticker.trim().toUpperCase();

  if (!symbol) {
    throw new Error('Enter a ticker symbol.');
  }

  const response = await fetch(
    `/api/options?ticker=${encodeURIComponent(symbol)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Unable to load options contracts.');
  }

  return data;
}
