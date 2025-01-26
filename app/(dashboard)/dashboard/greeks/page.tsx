const greeks = {
  concepts: [
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
          delta: "(10.5 - 9.5) / (102 - 98)",
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
          gamma: "(0.30 - 0.25) / 2",
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
          vega: "0.50 / 0.01",
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
          theta: "(4.90 - 5.00) / 1",
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
          rho: "0.20 / 0.01",
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
          vanna: "0.01 / 0.02",
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
          charm: "(0.48 - 0.50) / 1",
          result: -0.02,
        },
        interpretation: "For every day that passes, Delta decreases by 0.02.",
      },
    },
  ],
};

const GreeksConcepts = ()=> {
  return (
    <div>
      <h1>Options Greeks</h1>
      {greeks.concepts.map((greek, index) => (
        <div key={index}>
          <h2>{greek.title}</h2>
          <p>
            <strong>Definition:</strong> {greek.definition}
          </p>
          {greek.formula && (
            <p>
              <strong>Formula:</strong> {greek.formula}
            </p>
          )}
          <h3>Example:</h3>
          <pre>{JSON.stringify(greek.example, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}
export default GreeksConcepts