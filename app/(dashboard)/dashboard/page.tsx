"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAuth } from "@/lib/auth/context/AuthContext";
import SavedCalculations from "../../components/SavedCalculations";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Trash2 } from "lucide-react";
import { Timestamp } from "firebase/firestore";

interface Position {
  id: string;
  optionType: string;
  contracts: string;
  strikePrice: string;
  optionPrice: string;
}

const Settings = () => {
  const [stockPrice, setStockPrice] = useState("");
  const [positions, setPositions] = useState<Position[]>([
    {
      id: "1",
      optionType: "buyCall",
      contracts: "1",
      strikePrice: "",
      optionPrice: "",
    },
  ]);

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
  const [results, setResults] = useState<Results | null>(null);

  const addPosition = () => {
    setPositions([
      ...positions,
      {
        id: Date.now().toString(),
        optionType: "buyCall",
        contracts: "1",
        strikePrice: "",
        optionPrice: "",
      },
    ]);
  };

  const removePosition = (id: string) => {
    setPositions((prevPositions) => {
      const updatedPositions = prevPositions.filter((pos) => pos.id !== id);
      setResults(null); // Clear results since the positions have changed
      return updatedPositions;
    });
  };

  const updatePosition = (id: string, field: keyof Position, value: string) => {
    setPositions(
      positions.map((pos) => (pos.id === id ? { ...pos, [field]: value } : pos))
    );
  };

  const calculatePositionProfit = (
    position: Position,
    price: number
  ): number => {
    const strikePrice = parseFloat(position.strikePrice);
    const optionPrice = parseFloat(position.optionPrice);
    const contracts = parseInt(position.contracts);

    let profit = 0;

    switch (position.optionType) {
      case "buyCall":
        profit = Math.max(0, price - strikePrice) - optionPrice;
        break;
      case "buyPut":
        profit = Math.max(0, strikePrice - price) - optionPrice;
        break;
      case "sellCall":
        profit = optionPrice - Math.max(0, price - strikePrice);
        break;
      case "sellPut":
        profit = optionPrice - Math.max(0, strikePrice - price);
        break;
    }

    return profit * contracts * 100;
  };

  const calculateResults = () => {
    if (
      !stockPrice ||
      positions.some((p) => !p.strikePrice || !p.optionPrice)
    ) {
      alert("Please fill in all fields");
      return;
    }

    const currentPrice = parseFloat(stockPrice);
    const allStrikePrices = positions.map((p) => parseFloat(p.strikePrice));
    const minStrike = Math.min(...allStrikePrices);
    const maxStrike = Math.max(...allStrikePrices);

    const minPrice = Math.min(currentPrice, minStrike) * 0.7;
    const maxPrice = Math.max(currentPrice, maxStrike) * 1.3;
    const step = (maxPrice - minPrice) / 50;

    const chartData: Array<{
      [key: string]: number;
      price: number;
      totalProfit: number;
    }> = [];
    const breakEvenPrices = [];
    let maxLoss = 0;

    for (let price = minPrice; price <= maxPrice; price += step) {
      const dataPoint: {
        [key: string]: number;
        price: number;
        totalProfit: number;
      } = { price, totalProfit: 0 };
      let totalProfit = 0;

      positions.forEach((position) => {
        const profit = calculatePositionProfit(position, price);
        dataPoint[`position${position.id}`] = profit;
        totalProfit += profit;
      });

      dataPoint.totalProfit = totalProfit;
      maxLoss = Math.min(maxLoss, totalProfit);
      chartData.push(dataPoint);

      if (chartData.length > 1) {
        const prevPoint = chartData[chartData.length - 2];
        if (
          (prevPoint.totalProfit <= 0 && totalProfit >= 0) ||
          (prevPoint.totalProfit >= 0 && totalProfit <= 0)
        ) {
          breakEvenPrices.push(price);
        }
      }
    }

    const totalInvestment = positions.reduce((sum, pos) => {
      const amount =
        parseFloat(pos.optionPrice) * parseInt(pos.contracts) * 100;
      return pos.optionType.startsWith("buy") ? sum + amount : sum;
    }, 0);

    const pricePoints = [
      currentPrice * 0.5,
      currentPrice * 0.8,
      currentPrice,
      currentPrice * 1.2,
      currentPrice * 1.5,
    ];

    const analysisPoints = pricePoints.map((price) => {
      const totalProfit = positions.reduce(
        (sum, pos) => sum + calculatePositionProfit(pos, price),
        0
      );

      return {
        price: price.toFixed(2),
        totalProfit: totalProfit.toFixed(2),
        returnPercentage: ((totalProfit / totalInvestment) * 100).toFixed(2),
      };
    });

    setResults({
      breakEvenPrices,
      totalInvestment,
      maxLoss,
      analysisPoints,
      chartData,
    });
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

  interface SavedCalculation {
    id?: string;
    userId: string;
    stockPrice: string;
    positions: Position[];
    results: Results;
    createdAt: Timestamp;
  }

  const { user } = useAuth();

  const handleLoadCalculation = (calculation: SavedCalculation) => {
    setStockPrice(calculation.stockPrice);
    setPositions(calculation.positions);
    setResults(calculation.results);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <CardHeader>
        <CardTitle className="text-center text-lg sm:text-xl">
          Basic Multi-Position Options Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label>Current Stock Price</Label>
            <Input
              type="number"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="space-y-4">
            {positions.map((position, index) => (
              <div
                key={position.id}
                className="p-4 border rounded-lg space-y-4 relative"
              >
                <div className="absolute top-2 right-2">
                  {positions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePosition(position.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>

                <h3 className="font-semibold">Position {index + 1}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <Label>Option Type</Label>
                    <Select
                      value={position.optionType}
                      onValueChange={(value) =>
                        updatePosition(position.id, "optionType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyCall">Buy Call</SelectItem>
                        <SelectItem value="buyPut">Buy Put</SelectItem>
                        <SelectItem value="sellCall">Sell Call</SelectItem>
                        <SelectItem value="sellPut">Sell Put</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Contracts</Label>
                    <Input
                      type="number"
                      value={position.contracts}
                      onChange={(e) =>
                        updatePosition(position.id, "contracts", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Strike Price</Label>
                    <Input
                      type="number"
                      value={position.strikePrice}
                      onChange={(e) =>
                        updatePosition(
                          position.id,
                          "strikePrice",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Option Premium</Label>
                    <Input
                      type="number"
                      value={position.optionPrice}
                      onChange={(e) =>
                        updatePosition(
                          position.id,
                          "optionPrice",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button className="flex-1" onClick={addPosition} variant="outline">
              Add Position
            </Button>
            <Button className="flex-1" onClick={calculateResults}>
              Calculate
            </Button>
          </div>

          {results && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="p-4 rounded-lg bg-gray-100 flex-1">
                  <div className="text-sm text-gray-600">Break-even Prices</div>
                  <div className="text-lg font-bold">
                    {results.breakEvenPrices
                      .map((price) => `$${price.toFixed(2)}`)
                      .join(", ") || "N/A"}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-gray-100 flex-1">
                  <div className="text-sm text-gray-600">
                    Initial Investment
                  </div>
                  <div className="text-lg font-bold">
                    ${results.totalInvestment.toFixed(2)}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-gray-100 flex-1">
                  <div className="text-sm text-gray-600">Max Loss</div>
                  <div className="text-lg font-bold text-red-600">
                    ${results.maxLoss.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={results.chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      className=""
                      dataKey="price"
                      label={{
                        value: "",
                        position: "bottom",
                      }}
                      tickFormatter={(value: number) => value.toFixed(2)}
                    />
                    <YAxis
                      label={{
                        value: "Profit/Loss($)",
                        angle: -90,
                        position: "left",
                      }}
                    />
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
                    {positions.map((position, index) => (
                      <Line
                        className=""
                        key={position.id}
                        type="monotone"
                        dataKey={`position${position.id}`}
                        name={`Position ${index + 1} (${position.optionType})`}
                        stroke={getRandomColor(index)}
                        dot={false}
                        strokeWidth={1.2}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stock Price</TableHead>
                      <TableHead>Total Profit/Loss</TableHead>
                      <TableHead>Return %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.analysisPoints.map((point, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          ${point.price}
                        </TableCell>
                        <TableCell
                          className={
                            parseFloat(point.totalProfit) > 0
                              ? "text-green-500"
                              : parseFloat(point.totalProfit) === 0
                              ? "text-orange-500"
                              : "text-red-500"
                          }
                        >
                          ${point.totalProfit}
                        </TableCell>
                        <TableCell
                          className={
                            parseFloat(point.returnPercentage) > 0
                              ? "text-green-500"
                              : parseFloat(point.returnPercentage) === 0
                              ? "text-orange-500"
                              : "text-red-500"
                          }
                        >
                          {point.returnPercentage}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          {user && (
            <SavedCalculations
              userId={user.uid}
              currentCalculation={{
                stockPrice,
                positions,
                results,
              }}
              onLoadCalculation={handleLoadCalculation}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Settings;
