

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const data = {
  model_setup: {
    parameters: {
      current_stock_price: 100,
      up_factor: 1.1,
      down_factor: 0.9,
      risk_free_rate: 0.05,
      strike_price: 100,
      time_to_expiration: "1 period",
    },
  },
  terminal_stock_prices_and_option_payoffs: {
    stock_prices: {
      up_state: 110,
      down_state: 90,
    },
    put_option_payoffs: {
      up_state: 0,
      down_state: 10,
    },
  },
  risk_neutral_probability: {
    formula: "q = (1 + r - d) / (u - d)",
    calculation: {
      numerator: "1.05 - 0.9",
      denominator: "1.1 - 0.9",
      result: 0.75,
    },
    interpretation: {
      probability_up: 0.75,
      probability_down: 0.25,
    },
  },
  pricing_put_option: {
    formula: "P0 = (q * Pu + (1 - q) * Pd) / (1 + r)",
    calculation: {
      numerator: "(0.75 * 0) + (0.25 * 10)",
      denominator: 1.05,
      result: 2.38,
    },
    interpretation:
      "The arbitrage-free price of the put is approximately $2.38.",
  },
  replicating_portfolio: {
    parameters: {
      delta_formula: "Δ = (Pu - Pd) / (Su - Sd)",
      delta_calculation: {
        numerator: "0 - 10",
        denominator: "110 - 90",
        result: -0.5,
      },
      bond_formula: "B = (Pd - Δ * Sd) / (1 + r)",
      bond_calculation: {
        numerator: "10 - (-0.5 * 90)",
        denominator: 1.05,
        result: 52.38,
      },
    },
    portfolio_value: {
      formula: "P0 = Δ * S0 + B",
      calculation: {
        numerator: "(-0.5 * 100) + 52.38",
        result: 2.38,
      },
      interpretation:
        "The replicating portfolio perfectly matches the put price of $2.38.",
    },
  },
  no_arbitrage_condition: {
    condition: "u > 1 + r > d",
    values: {
      u: 1.1,
      "1_plus_r": 1.05,
      d: 0.9,
    },
    interpretation: {
      up_state_return: "10% > risk-free rate of 5%",
      down_state_loss: "Risk-free rate of 5% > loss of -10%",
    },
  },
  intuition: {
    replication:
      "By shorting 0.5 shares and investing $52.38 in bonds, we perfectly replicate the put’s payoff in both states.",
    risk_neutral_pricing:
      "The risk-neutral probability (q) adjusts for risk, allowing us to price the option as if investors are risk-neutral.",
  },
  extending_to_multi_period: {
    steps: [
      "Calculate stock prices at t=2: Suu, Sud, Sdd.",
      "Compute option payoffs at t=2.",
      "Work backward using risk-neutral probabilities to price the option at t=1, then t=0.",
    ],
  },
  summary: {
    put_price: 2.38,
    key_formula: "P0 = (q * Pu + (1 - q) * Pd) / (1 + r)",
    hedging_strategy: {
      delta: -0.5,
      bonds: 52.38,
    },
    interpretation:
      "No-arbitrage pricing ensures fair derivative pricing based on replication and risk-neutral expectations.",
  },
};

const BinomalModelDisplay = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Binomial Model Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="model-setup">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="model-setup">Setup</TabsTrigger>
              <TabsTrigger value="prices">Prices</TabsTrigger>
              <TabsTrigger value="probabilities">Probabilities</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="model-setup">
              <Card>
                <CardHeader>
                  <CardTitle>Model Parameters</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      {Object.entries(data.model_setup.parameters).map(
                        ([key, value]) => (
                          <TableRow key={key}>
                            <TableCell className="font-medium">
                              {key.replace(/_/g, " ").charAt(0).toUpperCase() +
                                key.slice(1).replace(/_/g, " ")}
                            </TableCell>
                            <TableCell>{value}</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prices">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Prices and Option Payoffs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Stock Prices</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableBody>
                            {Object.entries(
                              data.terminal_stock_prices_and_option_payoffs
                                .stock_prices
                            ).map(([key, value]) => (
                              <TableRow key={key}>
                                <TableCell className="font-medium">
                                  {key
                                    .replace(/_/g, " ")
                                    .charAt(0)
                                    .toUpperCase() +
                                    key.slice(1).replace(/_/g, " ")}
                                </TableCell>
                                <TableCell>${value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Put Option Payoffs
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableBody>
                            {Object.entries(
                              data.terminal_stock_prices_and_option_payoffs
                                .put_option_payoffs
                            ).map(([key, value]) => (
                              <TableRow key={key}>
                                <TableCell className="font-medium">
                                  {key
                                    .replace(/_/g, " ")
                                    .charAt(0)
                                    .toUpperCase() +
                                    key.slice(1).replace(/_/g, " ")}
                                </TableCell>
                                <TableCell>${value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="probabilities">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Neutral Probabilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-lg font-medium">
                    Formula: {data.risk_neutral_probability.formula}
                  </div>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Numerator</TableCell>
                        <TableCell>
                          {data.risk_neutral_probability.calculation.numerator}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Denominator
                        </TableCell>
                        <TableCell>
                          {
                            data.risk_neutral_probability.calculation
                              .denominator
                          }
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Result</TableCell>
                        <TableCell>
                          {data.risk_neutral_probability.calculation.result}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Interpretation</h4>
                    <div>
                      Up probability:{" "}
                      {
                        data.risk_neutral_probability.interpretation
                          .probability_up
                      }
                    </div>
                    <div>
                      Down probability:{" "}
                      {
                        data.risk_neutral_probability.interpretation
                          .probability_down
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio">
              <Card>
                <CardHeader>
                  <CardTitle>Replicating Portfolio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Delta Calculation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2">
                        Formula:{" "}
                        {data.replicating_portfolio.parameters.delta_formula}
                      </div>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">
                              Numerator
                            </TableCell>
                            <TableCell>
                              {
                                data.replicating_portfolio.parameters
                                  .delta_calculation.numerator
                              }
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              Denominator
                            </TableCell>
                            <TableCell>
                              {
                                data.replicating_portfolio.parameters
                                  .delta_calculation.denominator
                              }
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              Result
                            </TableCell>
                            <TableCell>
                              {
                                data.replicating_portfolio.parameters
                                  .delta_calculation.result
                              }
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Portfolio Value</h4>
                    <div>
                      Formula:{" "}
                      {data.replicating_portfolio.portfolio_value.formula}
                    </div>
                    <div>
                      Result: $
                      {
                        data.replicating_portfolio.portfolio_value.calculation
                          .result
                      }
                    </div>
                    <div className="mt-2">
                      {
                        data.replicating_portfolio.portfolio_value
                          .interpretation
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Put Price</TableCell>
                        <TableCell>${data.summary.put_price}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Key Formula
                        </TableCell>
                        <TableCell>{data.summary.key_formula}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Delta</TableCell>
                        <TableCell>
                          {data.summary.hedging_strategy.delta}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Bonds</TableCell>
                        <TableCell>
                          ${data.summary.hedging_strategy.bonds}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Interpretation
                        </TableCell>
                        <TableCell>{data.summary.interpretation}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BinomalModelDisplay;