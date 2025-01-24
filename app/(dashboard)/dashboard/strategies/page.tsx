import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const concepts = [
  {
    title: "Put-Call Parity",
    definition:
      "Put-call parity is a fundamental principle in options pricing that defines the relationship between the prices of European call and put options with the same strike price and expiration.",
    formula: "C - P = S - K * e^(-rT)",
    example: {
      parameters: {
        stock_price: 100,
        strike_price: 100,
        risk_free_rate: 0.05,
        time_to_expiration: 1,
        call_price: 10,
      },
      calculation: {
        put_price: "P = C - S + K * e^(-rT)",
        result: 4.88,
      },
    },
  },
  {
    title: "Call and Put Spreads",
    definition:
      "Spreads involve buying and selling options of the same type but with different strike prices or expirations.",
    types: {
      call_spread:
        "Buying a call at one strike price and selling another call at a higher strike price.",
      put_spread:
        "Buying a put at one strike price and selling another put at a lower strike price.",
    },
    example: {
      bull_call_spread: {
        buy_call: {
          strike_price: 100,
          price: 5,
        },
        sell_call: {
          strike_price: 110,
          price: 2,
        },
        net_cost: 3,
        max_profit: 7,
      },
      bear_put_spread: {
        buy_put: {
          strike_price: 110,
          price: 6,
        },
        sell_put: {
          strike_price: 100,
          price: 3,
        },
        net_cost: 3,
        max_profit: 7,
      },
    },
  },
  {
    title: "Butterflies and Convexity of Option Prices",
    definition:
      "A butterfly spread combines multiple options to profit from low volatility, while convexity describes the curvature of option prices as a function of strike price.",
    example: {
      butterfly_spread: {
        buy_call_1: {
          strike_price: 90,
          price: 10,
        },
        sell_calls_2: {
          strike_price: 100,
          price: 15,
        },
        buy_call_3: {
          strike_price: 110,
          price: 8,
        },
        net_cost: 3,
        max_profit: 7,
      },
      convexity:
        "The curvature indicates the relationship between moneyness and time decay or volatility.",
    },
  },
  {
    title: "Digital Options",
    definition:
      "Digital (or binary) options pay a fixed amount if the underlying asset is above (call) or below (put) a specific level at expiration.",
    example: {
      digital_call: {
        strike_price: 100,
        payout: 10,
        stock_price: 95,
        probability_above_strike: 0.4,
        price: 4,
      },
    },
  },
  {
    title: "Bounds on Call Prices",
    definition:
      "The price of a call option is bounded between 0 and the price of the underlying asset. For European calls, the price must also satisfy specific lower bounds.",
    bounds: {
      upper_bound: "C <= S",
      lower_bound: "C >= max(S - K * e^(-rT), 0)",
    },
    example: {
      parameters: {
        stock_price: 50,
        strike_price: 60,
        risk_free_rate: 0.05,
        time_to_expiration: 1,
      },
      calculation: {
        lower_bound: "C >= max(50 - 60 * e^(-0.05), 0)",
        result: 0.92,
      },
    },
  },
  {
    title: "Options on Forward Contracts",
    definition:
      "An option on a forward contract gives the holder the right, but not the obligation, to enter into a forward contract at expiration.",
    example: {
      forward_contract: {
        stock_price: 100,
        forward_price: 105,
        call_option_on_forward: {
          strike_price: 105,
          pricing: "Uses forward-specific Black-Scholes formulas.",
        },
      },
    },
  },
  {
    title: "Hedging and Replication in the Two-State World",
    definition:
      "The two-state world assumes that the price of an underlying asset can only move to two possible values over a single time step. Options can be priced by replicating their payoffs using a portfolio of the underlying asset and risk-free bonds.",
    key_idea:
      "Hedging offsets risk, while replication constructs a portfolio that mimics the option’s payoff.",
    example: {
      setup: {
        current_stock_price: 100,
        up_state_price: 120,
        down_state_price: 80,
        risk_free_rate: 0.05,
        strike_price: 100,
      },
      replicating_portfolio: {
        delta: 0.5,
        bonds: -40,
        price_of_call_option: 10,
      },
    },
  },
  {
    title: "Risk-Neutral Probabilities",
    definition:
      "Risk-neutral probabilities are theoretical probabilities under which the expected discounted payoff of a derivative equals its current price. They are used to simplify pricing by avoiding assumptions about investor risk preferences.",
    formula: "q_u = (e^(rΔt) - d) / (u - d), q_d = 1 - q_u",
    example: {
      parameters: {
        up_factor: 1.2,
        down_factor: 0.8,
        risk_free_rate: 0.05,
      },
      results: {
        q_u: 0.713,
        q_d: 0.287,
      },
    },
  },
  {
    title: "Multiple Time Steps",
    definition:
      "In a multi-period model, the price evolution of the underlying is modeled over several time steps. The pricing of derivatives is computed recursively, working backward from the final payoff to the current value.",
    example: {
      two_step_binomial_model: {
        stock_price: 100,
        up_factor: 1.2,
        down_factor: 0.8,
        risk_free_rate: 0.05,
        strike_price: 100,
        final_payoffs: {
          S_uu: 44,
          S_ud: 0,
          S_dd: 0,
        },
        computation:
          "Option price at each node is calculated using risk-neutral probabilities.",
      },
    },
  },
  {
    title: "General No-Arbitrage Condition",
    definition:
      "The no-arbitrage condition ensures that there are no opportunities for riskless profit in a financial market. A pricing model is consistent with no-arbitrage if it prevents creating portfolios that generate profits without any initial cost or risk.",
    key_idea:
      "For any derivative, its price must lie within bounds determined by the prices of other tradable assets.",
    example: {
      call_option_bounds: "C <= S_0 and C >= max(S_0 - Ke^(-rT), 0)",
      synthetic_forward:
        "The price of a forward contract must satisfy F = S_0 * e^(rT).",
    },
  },
];

function Strategies() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Financial Concepts
      </h1>
      <Accordion type="single" collapsible className="space-y-4">
        {concepts.map((concept, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-xl font-semibold hover:bg-gray-100 p-4 rounded-lg">
              {concept.title}
            </AccordionTrigger>
            <AccordionContent>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {concept.title}
                    <Badge variant="secondary">Finance Concept</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      <strong>Definition:</strong> {concept.definition}
                    </p>

                    {concept.key_idea && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <strong>Key Idea:</strong> {concept.key_idea}
                      </div>
                    )}

                    
                    {concept.formula && (
                      <div>
                        <strong>Formula:</strong>
                        <pre className="bg-gray-100 p-2 rounded-md mt-2 overflow-x-auto">
                          {concept.formula}
                        </pre>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Example:</h3>
                      <pre className="bg-gray-50 p-3 rounded-md overflow-x-auto">
                        {JSON.stringify(concept.example, null, 2)}
                      </pre>
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
}

export default Strategies;
