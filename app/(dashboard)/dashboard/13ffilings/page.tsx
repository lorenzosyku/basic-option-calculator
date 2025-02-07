'use client';
// Types for SEC API responses
interface SECCompanyResponse {
  [cik: string]: {
    cik: string;
    name: string;
    tickers: string[];
  };
}

interface SECFiling {
  accessionNumber: string;
  filingDate: string;
  reportDate: string;
  form: string;
  primaryDocument: string;
  primaryDocDescription: string;
}

interface SECFilingsResponse {
  cik: string;
  entityType: string;
  filings: {
    recent: SECFiling[];
  };
}

interface Filing13FContent {
  entityName: string;
  val: number;
  period: string;
  cusip?: string;
  securityName?: string;
}

// Types for processed data
interface Institution {
  name: string;
  shares: number;
}

interface QuarterHoldings {
  quarter: string;
  totalShares: number;
  institutions: Institution[];
}

interface QuarterlyData {
  name: string;
  'Total Shares': number;
  [institutionName: string]: number | string;
}

// Props interface if needed
interface InstitutionalTrackerProps {
  // Add props if needed
}

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, TrendingUp, PieChart, Download } from 'lucide-react';

// SEC API configuration
const SEC_BASE_URL = 'https://data.sec.gov';
const COMPANY_SEARCH_URL = `${SEC_BASE_URL}/submissions`;
const USER_AGENT = 'xhaxhilenzi@gmail.com'; // Replace with your details

const InstitutionalTracker: React.FC<InstitutionalTrackerProps> = () => {
  const [ticker, setTicker] = useState<string>('');
  const [holdings, setHoldings] = useState<QuarterHoldings[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cik, setCik] = useState<string | null>(null);

  // Function to pad CIK with leading zeros
  const padCik = (cik: string): string => cik.padStart(10, '0');

  // Function to format date as YYYY-MM-DD
  const formatDate = (date: string): string => {
    return new Date(date).toISOString().split('T')[0];
  };

  // Function to get company CIK number
  const getCompanyCik = async (ticker: string): Promise<string> => {
    try {
      const response = await fetch(`${COMPANY_SEARCH_URL}/CIK${ticker}.json`, {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Company not found');
      }

      const data = await response.json() as SECCompanyResponse;
      return Object.keys(data)[0];
    } catch (error) {
      throw new Error(`Failed to find company: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Function to get company filings
  const getCompanyFilings = async (paddedCik: string): Promise<SECFiling[]> => {
    try {
      const response = await fetch(`${SEC_BASE_URL}/submissions/CIK${paddedCik}.json`, {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch filings');
      }

      const data = await response.json() as SECFilingsResponse;
      return data.filings.recent;
    } catch (error) {
      throw new Error(`Failed to fetch filings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Function to get 13F filing contents
  const get13FContents = async (accessionNumber: string, paddedCik: string): Promise<Filing13FContent[]> => {
    try {
      const formattedAccession = accessionNumber.replace(/-/g, '');
      const response = await fetch(
        `${SEC_BASE_URL}/api/xbrl/frames/us-gaap/InvestmentTypeAxis/USD/CY2019Q1I.json`,
        {
          headers: {
            'User-Agent': USER_AGENT,
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch filing contents');
      }

      const data = await response.json();
      return data as Filing13FContent[];
    } catch (error) {
      throw new Error(`Failed to fetch filing contents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Process 13F data into our required format
  const process13FData = (filingData: Filing13FContent[]): QuarterHoldings[] => {
    const holdings: Record<string, {
      quarter: string;
      totalShares: number;
      institutions: Record<string, number>;
    }> = {};
    
    // Group holdings by quarter
    filingData.forEach(filing => {
      const quarter = filing.period.substr(0, 7);
      if (!holdings[quarter]) {
        holdings[quarter] = {
          quarter,
          totalShares: 0,
          institutions: {}
        };
      }

      // Add institution holdings
      if (!holdings[quarter].institutions[filing.entityName]) {
        holdings[quarter].institutions[filing.entityName] = 0;
      }
      holdings[quarter].institutions[filing.entityName] += filing.val;
      holdings[quarter].totalShares += filing.val;
    });

    // Convert to array format
    return Object.values(holdings).map(quarterData => ({
      quarter: quarterData.quarter,
      totalShares: quarterData.totalShares,
      institutions: Object.entries(quarterData.institutions).map(([name, shares]) => ({
        name,
        shares
      }))
    }));
  };

  // Main search handler
  const handleSearch = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // Get company CIK
      const companyCik = await getCompanyCik(ticker);
      const paddedCik = padCik(companyCik);
      setCik(paddedCik);

      // Get company filings
      const filings = await getCompanyFilings(paddedCik);
      
      // Filter for 13F filings
      const thirteenFFilings = filings.filter(filing => 
        filing.form === '13F-HR' || filing.form === '13F-HR/A'
      );

      // Get contents of each 13F filing
      const holdingsData = await Promise.all(
        thirteenFFilings.slice(0, 4).map(filing => 
          get13FContents(filing.accessionNumber, paddedCik)
        )
      );

      // Process and set the holdings data
      const processedHoldings = process13FData(holdingsData.flat());
      setHoldings(processedHoldings);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Transform data for trend chart
  const trendData: QuarterlyData[] = holdings.map(quarter => ({
    name: quarter.quarter,
    'Total Shares': quarter.totalShares,
    ...quarter.institutions.reduce((acc, inst) => ({
      ...acc,
      [inst.name]: inst.shares
    }), {})
  }));

  // Rest of the component JSX remains the same...
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-6 h-6" />
            Search 13F Filings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter ticker symbol"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="p-2 border rounded w-48"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>

      {holdings.length > 0 && (
        <>
          {/* Trend Analysis Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Institutional Holdings Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Total Shares" stroke="#8884d8" />
                    {Object.keys(trendData[0] || {})
                      .filter(key => key !== 'name' && key !== 'Total Shares')
                      .map((institution, index) => (
                        <Line
                          key={institution}
                          type="monotone"
                          dataKey={institution}
                          stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Latest Holdings Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-6 h-6" />
                Latest Institutional Holdings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Institution</th>
                      <th className="p-2 text-right">Shares</th>
                      <th className="p-2 text-right">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings[holdings.length - 1].institutions.map((inst) => (
                      <tr key={inst.name} className="border-b">
                        <td className="p-2">{inst.name}</td>
                        <td className="p-2 text-right">{inst.shares.toLocaleString()}</td>
                        <td className="p-2 text-right">
                          {((inst.shares / holdings[holdings.length - 1].totalShares) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default InstitutionalTracker;