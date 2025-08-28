import axios from 'axios';

export interface YieldData {
  maturity: string;
  yield: number;
}

export interface YieldDataResponse {
  yields: YieldData[];
  date: Date;
}

const MATURITIES = [
  { key: 'BC_1MONTH', label: '1M' },
  { key: 'BC_2MONTH', label: '2M' },
  { key: 'BC_3MONTH', label: '3M' },
  { key: 'BC_4MONTH', label: '4M' },
  { key: 'BC_6MONTH', label: '6M' },
  { key: 'BC_1YEAR', label: '1Y' },
  { key: 'BC_2YEAR', label: '2Y' },
  { key: 'BC_3YEAR', label: '3Y' },
  { key: 'BC_5YEAR', label: '5Y' },
  { key: 'BC_7YEAR', label: '7Y' },
  { key: 'BC_10YEAR', label: '10Y' },
  { key: 'BC_20YEAR', label: '20Y' },
  { key: 'BC_30YEAR', label: '30Y' }
];

export async function fetchYieldCurveData(): Promise<YieldDataResponse> {
  try {
    // Use current year and month
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const yearMonth = `${year}${month}`;
    
    const response = await axios.get(
      `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_yield_curve&field_tdr_date_value_month=${yearMonth}`
    );
    
    const xmlText = response.data;
    
    // Parse XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('XML parsing error');
    }
    
    // Get all entries and find the most recent date
    const entries = Array.from(xmlDoc.querySelectorAll('entry'));
    
    if (entries.length === 0) {
      throw new Error('No data entries found in XML response');
    }
    
    // Get the most recent entry (always the last one in the XML)
    const latestEntry = entries[entries.length - 1];
    
    // Extract the date from the most recent entry
    const dateElement = latestEntry.querySelector('NEW_DATE') || 
                       latestEntry.querySelector('d\\:NEW_DATE');
    const dateString = dateElement?.textContent;
    
    if (!dateString) {
      throw new Error('No date found in the most recent entry');
    }
    
    const date = new Date(dateString);
    
    // Extract yield data from the most recent entry
    const yields: YieldData[] = MATURITIES
      .map(maturity => {
        const yieldElement = latestEntry.querySelector(maturity.key) || 
                           latestEntry.querySelector(`d\\:${maturity.key}`);
        const yieldValue = yieldElement?.textContent;
        return {
          maturity: maturity.label,
          yield: yieldValue ? parseFloat(yieldValue) : 0
        };
      })
      .filter(item => item.yield > 0);

    return { yields, date };
  } catch (error) {
    console.error('Error fetching yield data:', error);
    throw error;
  }
}
