import * as demoData from '../data/demoData.js';

export async function getDashboardData() {
  return {
    ...demoData,
    status: {
      updatedAt: new Date(),
    },
  };
}

export async function getOptionsContracts(ticker, type = 'all') {
  const symbol = ticker.trim().toUpperCase();
  const contractType = type.trim().toLowerCase();

  if (!symbol) {
    throw new Error('Enter a ticker symbol.');
  }

  if (!['all', 'call', 'put'].includes(contractType)) {
    throw new Error('Invalid contract type.');
  }

  const response = await fetch(
    `/api/options?ticker=${encodeURIComponent(symbol)}&type=${encodeURIComponent(contractType)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Unable to load options contracts.');
  }

  return data;
}


export async function getSignal(ticker) {
  const symbol = ticker.trim().toUpperCase();

  if (!symbol) {
    throw new Error("Enter a ticker symbol.");
  }

  const response = await fetch(
    `/api/signal?ticker=${encodeURIComponent(symbol)}&includeOptions=1`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to load signal.");
  }

  return data;
}
