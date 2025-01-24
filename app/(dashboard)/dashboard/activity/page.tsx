"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { db, auth } from "../../../../lib/auth/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Save, Trash2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface Position {
  id: string;
  optionType: string;
  contracts: string;
  strikePrice: string;
  optionPrice: string;
}

interface Results {
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

interface SavedCalculation {
  id?: string;
  userId: string;
  stockPrice: string;
  positions: Position[];
  results: Results;
  createdAt: Timestamp;
  calculationNotes?: string;
}

interface SavedCalculationsProps {
  userId: string;
  currentCalculation: {
    stockPrice: string;
    positions: Position[];
    results: Results | null;
  };
  onLoadCalculation: (calculation: SavedCalculation) => void;
}

const SavedCalculations: React.FC<SavedCalculationsProps> = ({
  onLoadCalculation,
}) => {
  const [savedCalculations, setSavedCalculations] = useState<
    SavedCalculation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const fetchCalculations = async () => {
    setIsLoading(true);
    setError(null);

    // Check if user is authenticated
    if (!auth.currentUser) {
      setError("Please log in to view calculations");
      setIsLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "calculations"),
        where("userId", "==", auth.currentUser.uid), // Use auth.currentUser.uid instead of userId
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const calculations: SavedCalculation[] = [];
      querySnapshot.forEach((doc) => {
        calculations.push({
          id: doc.id,
          ...doc.data(),
        } as SavedCalculation);
      });
      setSavedCalculations(calculations);
    } catch (error) {
      console.error("Error fetching calculations:", error);
      setError("Failed to load saved calculations");
    } finally {
      setIsLoading(false);
    }
  };

  // Call fetchCalculations when auth state changes
  useEffect(() => {
    if (user) {
      fetchCalculations();
    } else {
      setSavedCalculations([]); // Clear calculations when user logs out
    }
  }, [user]);

  // Delete a saved calculation
  const deleteCalculation = async (calculationId: string) => {
    try {
      await deleteDoc(doc(db, "calculations", calculationId));
      setSavedCalculations((prev) =>
        prev.filter((calc) => calc.id !== calculationId)
      );
    } catch (error) {
      console.error("Error deleting calculation:", error);
      setError("Failed to delete calculation");
    }
  };
  const getRandomColor = (index: number) => {
    const colors = ["#d5896f", "#a5be00", "#003f88", "#FFB703", "#757bc8"];
    return colors[index % colors.length];
  };
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-2 border rounded shadow">
          <p className="label">
            <strong>Stock Price:</strong> ${parseFloat(label).toFixed(2)}
          </p>
          {payload.map((entry: any, index: number) => {
            const value = entry.value;
            const valueClass =
              value > 0 ? "text-green-500" : value < 0 ? "text-red-500" : "";
            return (
              <p
                key={`tooltip-${index}`}
                className={`font-medium ${valueClass}`}
              >
                <strong>{entry.name}:</strong> ${value.toFixed(2)}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Saved Calculations</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 mb-4 p-2 bg-red-50 rounded">{error}</div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : savedCalculations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No saved calculations yet
          </div>
        ) : (
          <div className="space-y-4">
            {savedCalculations.map((calc) => (
              <div
                key={calc.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <h3 className="font-medium">
                        Stock Price: ${parseFloat(calc.stockPrice).toFixed(2)}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {calc.positions.length} position
                        {calc.positions.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Saved on: {calc.createdAt.toDate().toLocaleDateString()}{" "}
                      at {calc.createdAt.toDate().toLocaleTimeString()}
                    </p>
                    <div className="mt-2 flex gap-4">
                      <span className="text-sm">
                        Investment: ${calc.results.totalInvestment.toFixed(2)}
                      </span>
                      <span className="text-sm">
                        Max Loss: ${calc.results.maxLoss.toFixed(2)}
                      </span>
                      {calc.calculationNotes && (
                        <p className="text-sm">
                          Notes: {calc.calculationNotes}
                        </p>
                      )}
                    </div>
                    {calc.results.chartData && (
                      <div className="mt-4">
                        <Card className="w-full max-w-2xl">
                          <CardHeader>
                            <CardTitle>Trading Performance Chart</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                              <LineChart data={calc.results.chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                  className=""
                                  dataKey="price"
                                  label={{
                                    value: "",
                                    position: "bottom",
                                  }}
                                  tickFormatter={(value: number) =>
                                    value.toFixed(2)
                                  }
                                />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="totalProfit"
                                  name="Total Profit"
                                  stroke="#780000"
                                  dot={false}
                                  strokeWidth={2.5}
                                />
                                {calc.positions.map((position, index) => (
                                  <Line
                                    className=""
                                    key={position.id}
                                    type="monotone"
                                    dataKey={`position${position.id}`}
                                    name={`Position ${index + 1} (${
                                      position.optionType
                                    })`}
                                    stroke={getRandomColor(index)}
                                    dot={false}
                                    strokeWidth={1.2}
                                  />
                                ))}
                                
                              </LineChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => calc.id && deleteCalculation(calc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedCalculations;
