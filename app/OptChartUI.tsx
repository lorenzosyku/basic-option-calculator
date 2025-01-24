"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {  CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { stockPrice: "80$", Portfolio: -100 },
  { stockPrice: "90$", Portfolio: -100 },
  { stockPrice: "100$", Portfolio: -100 },
  { stockPrice: "110$", Portfolio: 900 },
  { stockPrice: "120$", Portfolio: 1900 },
  { stockPrice: "130$", Portfolio: 2900 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

function OptChartUI() {
  return (
    <div className="h-69 w-full">
      <div className="py-2">
        <h2 className="text-center">Payout of a call option</h2>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="stockPrice"
                label={{
                  value: "stockPrice",
                  position: "bottom",
                }}
                tickFormatter={(value) => value.slice(0, 4)}
              />
              <YAxis
                label={{
                  value: "Profit/Loss($)",
                  angle: -90,
                  position: "left",
                }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

              <Line
                dataKey="Portfolio"
                type="linear"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </div>
    </div>
  );
}

export default OptChartUI;
