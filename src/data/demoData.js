export const candidates = [
  {
    ticker: 'PCG', company: 'PG&E', price: 14.30, flow: 97, upside: 82, opportunity: 93,
    stage: 'HIGH-CONVICTION MATCH', similarity: 96, ytd: -28, oiChange: 68,
    trend: [68, 74, 81, 88, 97], premium: { d3: 6.4, d5: 10.8, d10: 16.3 },
    setup: 'Repeated multi-day bullish call accumulation across Oct/Dec/Jan with expanding open interest.',
    evidence: [
      ['Flow persistence', 20, 20, 'Three consecutive sessions of qualifying bullish activity'],
      ['Opening OI evidence', 18, 18, 'Next-day OI expansion confirms new positioning'],
      ['Execution quality', 11, 12, 'Most premium executed at or above ask'],
      ['Premium commitment', 9, 10, '$6.4M bullish premium over three sessions'],
      ['Strike / expiry clustering', 10, 10, 'Concentrated across related long-dated calls'],
      ['Underlying upside', 8, 10, 'Shares remain below prior range and unextended'],
      ['Price confirmation', 7, 8, 'Price stabilizing while options demand expands'],
      ['Relative activity', 5, 5, 'Volume materially exceeds normal baseline'],
      ['IV structure', 4, 4, 'Term structure does not imply event-only speculation'],
      ['Stock volume', 3, 3, 'Underlying volume confirms participation']
    ]
  },
  {
    ticker: 'NKE', company: 'Nike', price: 38.40, flow: 88, upside: 90, opportunity: 89,
    stage: 'HIGH-CONVICTION MATCH', similarity: 91, ytd: -21, oiChange: 19,
    trend: [63, 69, 77, 82, 88], premium: { d3: 2.1, d5: 4.7, d10: 7.9 },
    setup: 'Long-duration bullish positioning while shares remain depressed and unextended.',
    evidence: [
      ['Flow persistence', 17, 20, 'Repeated bullish activity across multiple sessions'],
      ['Opening OI evidence', 16, 18, 'OI expanded following the largest prints'],
      ['Execution quality', 10, 12, 'Majority of calls printed near the offer'],
      ['Premium commitment', 8, 10, '$2.1M over three sessions'],
      ['Strike / expiry clustering', 9, 10, 'Long-duration strikes cluster around recovery levels'],
      ['Underlying upside', 10, 10, 'Depressed price leaves meaningful recovery runway'],
      ['Price confirmation', 6, 8, 'Base forming but breakout not confirmed'],
      ['Relative activity', 5, 5, 'Unusual options activity versus baseline'],
      ['IV structure', 3, 4, 'IV elevated but not extreme'],
      ['Stock volume', 2, 3, 'Underlying volume only modestly elevated']
    ]
  },
  {
    ticker: 'ADBE', company: 'Adobe', price: 279.10, flow: 86, upside: 94, opportunity: 88,
    stage: 'HIGH-CONVICTION MATCH', similarity: 89, ytd: -20, oiChange: 23,
    trend: [59, 66, 71, 79, 86], premium: { d3: 6.7, d5: 9.1, d10: 14.4 },
    setup: 'Bullish call ladder across Sep/Oct/Mar while valuation and price remain compressed.',
    evidence: [
      ['Flow persistence', 16, 20, 'Bullish prints repeat but are slightly less consistent'],
      ['Opening OI evidence', 16, 18, 'OI confirms several large positions'],
      ['Execution quality', 10, 12, 'Predominantly aggressive call buying'],
      ['Premium commitment', 10, 10, '$6.7M of bullish premium in three days'],
      ['Strike / expiry clustering', 8, 10, 'Multiple related calls form a bullish ladder'],
      ['Underlying upside', 10, 10, 'Underlying remains deeply compressed'],
      ['Price confirmation', 6, 8, 'Price action remains early'],
      ['Relative activity', 5, 5, 'Activity is well above baseline'],
      ['IV structure', 3, 4, 'Moderate event premium remains'],
      ['Stock volume', 2, 3, 'Stock volume has not fully confirmed']
    ]
  },
  {
    ticker: 'IREN', company: 'IREN', price: 44.68, flow: 84, upside: 86, opportunity: 85,
    stage: 'STRONG ACCUMULATION', similarity: 84, ytd: 11, oiChange: 31,
    trend: [57, 67, 73, 79, 84], premium: { d3: 3.6, d5: 5.9, d10: 9.7 },
    setup: 'Repeated long-dated bullish sweeps; price has begun moving, increasing extension risk.',
    evidence: [
      ['Flow persistence', 17, 20, 'Several sessions show continued accumulation'],
      ['Opening OI evidence', 15, 18, 'OI expansion supports new positions'],
      ['Execution quality', 10, 12, 'Sweeps largely execute aggressively'],
      ['Premium commitment', 8, 10, '$3.6M bullish premium in three days'],
      ['Strike / expiry clustering', 8, 10, 'Long-dated calls cluster in a narrow range'],
      ['Underlying upside', 7, 10, 'Recent rally reduces asymmetry'],
      ['Price confirmation', 8, 8, 'Underlying is confirming the flow'],
      ['Relative activity', 5, 5, 'Options activity is elevated'],
      ['IV structure', 3, 4, 'IV is somewhat rich'],
      ['Stock volume', 3, 3, 'Underlying volume confirms demand']
    ]
  },
  {
    ticker: 'KMB', company: 'Kimberly-Clark', price: 104.96, flow: 82, upside: 78, opportunity: 81,
    stage: 'EARLY ACCUMULATION', similarity: 79, ytd: -14, oiChange: 12,
    trend: [60, 63, 70, 76, 82], premium: { d3: 1.8, d5: 3.0, d10: 4.2 },
    setup: 'Call-heavy long-term positioning while underlying momentum remains weak.',
    evidence: [
      ['Flow persistence', 16, 20, 'Bullish activity is recurring'],
      ['Opening OI evidence', 13, 18, 'OI confirms some but not all activity'],
      ['Execution quality', 9, 12, 'Mixed execution with a bullish lean'],
      ['Premium commitment', 6, 10, 'Premium is meaningful but not exceptional'],
      ['Strike / expiry clustering', 8, 10, 'Positioning clusters in longer dated calls'],
      ['Underlying upside', 8, 10, 'Shares remain below prior range'],
      ['Price confirmation', 5, 8, 'Underlying has not confirmed yet'],
      ['Relative activity', 5, 5, 'Activity exceeds baseline'],
      ['IV structure', 4, 4, 'IV structure is favorable'],
      ['Stock volume', 2, 3, 'Stock volume is only moderately elevated']
    ]
  },
  {
    ticker: 'YETI', company: 'YETI', price: 41.37, flow: 79, upside: 83, opportunity: 80,
    stage: 'EARLY ACCUMULATION', similarity: 76, ytd: -9, oiChange: 8,
    trend: [52, 57, 62, 69, 79], premium: { d3: 0.6, d5: 1.1, d10: 1.5 },
    setup: 'First bullish sweep appeared near the money; another confirming session would strengthen the setup.',
    evidence: [
      ['Flow persistence', 13, 20, 'Signal is improving but still early'],
      ['Opening OI evidence', 12, 18, 'OI confirmation is limited so far'],
      ['Execution quality', 10, 12, 'Initial sweep executed aggressively'],
      ['Premium commitment', 5, 10, 'Premium remains modest'],
      ['Strike / expiry clustering', 7, 10, 'Some clustering is beginning to form'],
      ['Underlying upside', 9, 10, 'Price remains unextended'],
      ['Price confirmation', 5, 8, 'Underlying has not broken out'],
      ['Relative activity', 5, 5, 'Options volume is meaningfully elevated'],
      ['IV structure', 4, 4, 'IV remains constructive'],
      ['Stock volume', 1, 3, 'Stock volume has not confirmed']
    ]
  }
];

export const prints = {
  PCG: [
    { date: 'Sep 2', contract: 'Oct 2026 $15C', size: '15,000', voi: '—', premium: '$1.2M', read: 'Bullish' },
    { date: 'Sep 3', contract: 'Dec 2026 $18C', size: '15,000', voi: '32x', premium: '$1.8M', read: 'Bullish' },
    { date: 'Sep 4', contract: 'Jan 2027 $16C', size: '30,000', voi: '444x', premium: '$2.1M', read: 'Neutral → Bullish' },
    { date: 'Sep 4', contract: 'Jan 2027 $19C', size: '20,000', voi: '421x', premium: '$1.3M', read: 'Bullish' }
  ],
  NKE: [
    { date: 'Sep 4', contract: 'Jun 2028 $42.5C', size: '1,000', voi: '48x', premium: '$0.7M', read: 'Bullish' },
    { date: 'Sep 3', contract: 'Mar 2027 $40P', size: '2,500', voi: '—', premium: '$0.8M', read: 'Bullish put activity' }
  ],
  ADBE: [
    { date: 'Sep 4', contract: 'Oct 2026 $295C', size: '—', voi: '13.7x', premium: '$2.4M', read: 'Bullish' },
    { date: 'Sep 4', contract: 'Mar 2027 $360C', size: '—', voi: '—', premium: '$0.97M', read: 'Bullish' }
  ]
};

export const alerts = [
  {
    stage: 'HIGH-CONVICTION MATCH', ticker: 'PCG',
    body: 'Flow score reached 97 after a third consecutive session of large long-dated call activity. New OI confirms persistent positioning.',
    time: '2 min ago'
  },
  {
    stage: 'EARLY ACCUMULATION', ticker: 'YETI',
    body: 'Flow score rose 69 → 79. A near-the-money bullish sweep was detected; another confirming session would materially strengthen the setup.',
    time: '18 min ago'
  }
];
