// types/optionCalculation.ts

import { Timestamp } from "firebase/firestore";

export interface Position {
  id: string;
  optionType: string;
  contracts: string;
  strikePrice: string;
  optionPrice: string;
}

export interface Results {
  breakEvenPrices: number[];
  totalInvestment: number;
  maxLoss: number;
  analysisPoints: Array<{
    price: string;
    totalProfit: string;
    returnPercentage: string;
  }>;
  chartData: Array<{
    price: number;
    totalProfit: number;
    [key: string]: number;
  }>;
}

export interface SavedCalculation {
  id?: string;
  userId: string;
  stockPrice: string;
  positions: Position[];
  results: Results;
  createdAt: Timestamp;
  calculationNotes?: string;
}

export interface SavedCalculationsProps {
  userId: string;
  currentCalculation: {
    stockPrice: string;
    positions: Position[];
    results: Results | null;
  };
}

export interface Example {
  parameters: {
    [key: string]: number;
  };
  calculation: {
    [key: string]: string | number;
  };
  interpretation: string;
}

export interface Greek {
  title: string;
  definition: string;
  formula: string;
  example: Example;
}

export interface Greeks {
  concepts: Greek[];
}
