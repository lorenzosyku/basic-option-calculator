 
  const greeks =[
    {
      title: "Delta (Δ)",
      definition:
        "Delta measures the rate of change of an option's price with respect to changes in the price of the underlying asset. It represents the sensitivity of the option's value to small changes in the underlying price.",
      formula: "Δ = ∂V / ∂S",
      example: {
        parameters: {
          current_stock_price: 100,
          call_option_price_increase: 10.5,
          call_option_price_decrease: 9.5,
          stock_price_increase: 102,
          stock_price_decrease: 98,
        },
        calculation: {
          appliedFormula: "(10.5 - 9.5) / (102 - 98)",
          result: 0.25,
        },
        interpretation:
          "For every $1 increase in the stock price, the option's value increases by $0.25.",
      },
    },
    {
      title: "Gamma (Γ)",
      definition:
        "Gamma measures the rate of change of Delta with respect to changes in the underlying asset's price. It represents the curvature of the option's value as the price of the underlying changes.",
      formula: "Γ = ∂²V / ∂S²",
      example: {
        parameters: {
          delta1: 0.25,
          delta2: 0.3,
          stock_price_change: 2,
        },
        calculation: {
          appliedFormula: "(0.30 - 0.25) / 2",
          result: 0.025,
        },
        interpretation:
          "For every $1 change in the stock price, Delta changes by 0.025.",
      },
    },
    {
      title: "Vega (ν)",
      definition:
        "Vega measures the sensitivity of an option's price to changes in the volatility of the underlying asset.",
      formula: "ν = ∂V / ∂σ",
      example: {
        parameters: {
          volatility_increase: 0.01,
          call_option_price_increase: 0.5,
        },
        calculation: {
          appliedFormula: "0.50 / 0.01",
          result: 50,
        },
        interpretation:
          "For every 1% increase in volatility, the option price increases by $50.",
      },
    },
    {
      title: "Theta (Θ)",
      definition:
        "Theta measures the rate of change of an option's price with respect to the passage of time. It represents the time decay of an option.",
      formula: "Θ = ∂V / ∂t",
      example: {
        parameters: {
          option_price_today: 5.0,
          option_price_tomorrow: 4.9,
          time_passed: 1,
        },
        calculation: {
          appliedFormula: "(4.90 - 5.00) / 1",
          result: -0.1,
        },
        interpretation:
          "The option loses $0.10 in value per day due to time decay.",
      },
    },
    {
      title: "Rho (ρ)",
      definition:
        "Rho measures the sensitivity of an option's price to changes in the risk-free interest rate.",
      formula: "ρ = ∂V / ∂r",
      example: {
        parameters: {
          interest_rate_increase: 0.01,
          call_option_price_increase: 0.2,
        },
        calculation: {
          appliedFormula: "0.20 / 0.01",
          result: 20,
        },
        interpretation:
          "For every 1% increase in interest rates, the option price increases by $20.",
      },
    },
    {
      title: "Vanna",
      definition:
        "Vanna measures the sensitivity of Delta to changes in volatility, or equivalently, the sensitivity of Vega to changes in the underlying price.",
      formula: "Vanna = ∂²V / (∂S∂σ)",
      example: {
        parameters: {
          delta_change: 0.01,
          volatility_change: 0.02,
        },
        calculation: {
          appliedFormula: "0.01 / 0.02",
          result: 0.5,
        },
        interpretation:
          "For every 1% change in volatility, Delta changes by 0.5.",
      },
    },
    {
      title: "Charm",
      definition:
        "Charm measures the rate of change of Delta with respect to the passage of time, often referred to as 'Delta decay.'",
      formula: "Charm = ∂²V / (∂t∂S)",
      example: {
        parameters: {
          delta_today: 0.5,
          delta_tomorrow: 0.48,
          time_passed: 1,
        },
        calculation: {
          appliedFormula: "(0.48 - 0.50) / 1",
          result: -0.02,
        },
        interpretation: "For every day that passes, Delta decreases by 0.02.",
      },
    },
  ]


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const GreeksConcepts = () => {
  const formatParameterKey = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold mb-6">Options Greeks Reference</h1>

      <Accordion type="single" collapsible className="w-full">
        {greeks.map((greek, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-xl font-semibold">
              {greek.title}
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Definition</CardTitle>
                  <CardDescription>{greek.definition}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Formula</h4>
                    <code className="bg-slate-100 p-2 rounded">
                      {greek.formula}
                    </code>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Example</h4>

                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parameter</TableHead>
                            <TableHead>Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(greek.example.parameters).map(
                            ([key, value]) => (
                              <TableRow key={key}>
                                <TableCell>{formatParameterKey(key)}</TableCell>
                                <TableCell>{value}</TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2">Calculation</h5>
                        <div className="space-y-2">
                          <div>
                            Formula: {greek.example.calculation.appliedFormula}
                          </div>
                          <div>Result: {greek.example.calculation.result}</div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2">Interpretation</h5>
                        <p>{greek.example.interpretation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
export default GreeksConcepts;
