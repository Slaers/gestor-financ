// In public/js/investment-logic.js

function calculateInvestmentMetrics(allTransactionsForInvestment, currentUnitPriceString) {
  let currentTotalQuantity = 0;
  let totalCostOfPurchases = 0; // Sum of (qty * price + fees) for all purchases
  let costBasisOfAssetsSold = 0; // Accumulates cost basis of assets sold
  let proceedsFromSales = 0; // Accumulates (qty * price - fees) for all sales
  let totalIncomeReceived = 0; // Dividends, Juros

  // Ensure transactions are sorted by date
  const sortedTransactions = [...allTransactionsForInvestment].sort((a, b) => {
    const dateA = new Date(a.transaction_date);
    const dateB = new Date(b.transaction_date);
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    // If dates are the same, try to preserve original order or define secondary sort key if necessary
    return 0;
  });


  let runningTotalCost = 0; // Represents the cost basis of currently held shares
  let runningTotalQuantity = 0; // Represents the quantity of currently held shares

  for (const tx of sortedTransactions) {
    const quantity = parseFloat(tx.quantity_transacted) || 0;
    const price = parseFloat(tx.price_per_unit_transacted) || 0;
    const fees = parseFloat(tx.fees_paid) || 0;

    if (tx.transaction_type === 'Compra/Aporte' || tx.transaction_type === 'Reinvestimento') {
      const costThisPurchase = (quantity * price) + fees;
      totalCostOfPurchases += costThisPurchase; // Accumulates total $ ever put into this asset
      // currentTotalQuantity += quantity; // This was incorrectly accumulating here. It's better to use runningTotalQuantity at the end.

      runningTotalCost += costThisPurchase; // Add cost to current holdings' cost basis
      runningTotalQuantity += quantity; // Add quantity to current holdings

    } else if (tx.transaction_type === 'Venda/Resgate') {
      // Calculate WAP of shares held *at the moment of sale*
      const weightedAveragePriceAtSale = runningTotalQuantity > 0 ? runningTotalCost / runningTotalQuantity : 0;
      const costBasisThisSale = quantity * weightedAveragePriceAtSale;

      costBasisOfAssetsSold += costBasisThisSale;
      proceedsFromSales += (quantity * price) - fees;
      // currentTotalQuantity -= quantity; // This was incorrectly accumulating here.

      runningTotalCost -= costBasisThisSale; // Reduce cost basis of current holdings
      runningTotalQuantity -= quantity; // Reduce quantity of current holdings

      // Ensure runningTotalCost doesn't go significantly below zero due to floating point issues if selling all shares
      if (runningTotalQuantity <= 0.0000001) { // Using a small epsilon for quantity check
          runningTotalCost = 0;
          runningTotalQuantity = 0; // Explicitly set to 0 if all sold
      }

    } else if (tx.transaction_type === 'Dividendo Recebido' || tx.transaction_type === 'JCP Recebido' || tx.transaction_type === 'Rendimento') {
      // Assuming price_per_unit_transacted for income types is the total net amount received
      // and quantity_transacted is 1, or use a dedicated total_transaction_amount field.
      // For this example, assuming 'price' is the total net income amount for this transaction if quantity is 1 or not specified meaningfully for income.
      // This part might need adjustment based on actual transaction data structure for income.
      if (tx.quantity_transacted && tx.quantity_transacted !== 0 && tx.price_per_unit_transacted) {
         totalIncomeReceived += (quantity * price) - fees;
      } else if (tx.total_transaction_amount) { // Fallback to a dedicated total field if available
         totalIncomeReceived += (parseFloat(tx.total_transaction_amount) || 0) - fees;
      } else {
         // If only price is available, assume it's the total income.
         totalIncomeReceived += price - fees;
      }
    }
    // Other transaction types like 'Taxa', 'Imposto' could be handled here if they are separate from purchase/sale fees
  }

  currentTotalQuantity = runningTotalQuantity; // Final quantity is what's left in runningTotalQuantity

  const currentUnitPrice = parseFloat(currentUnitPriceString) || 0;

  // Cost basis of current holdings is the final state of runningTotalCost
  const costBasisOfCurrentHoldings = currentTotalQuantity > 0 ? runningTotalCost : 0;
  const marketValueOfCurrentHoldings = currentTotalQuantity * currentUnitPrice;

  const unrealizedProfitLoss = marketValueOfCurrentHoldings - costBasisOfCurrentHoldings;
  const realizedProfitLoss = proceedsFromSales - costBasisOfAssetsSold;
  const totalNetProfitLoss = unrealizedProfitLoss + realizedProfitLoss + totalIncomeReceived;

  // Overall return percentage based on the total amount ever invested in purchases for this asset
  const overallReturnPercentage = totalCostOfPurchases > 0 ? (totalNetProfitLoss / totalCostOfPurchases) * 100 : 0;

  // WAP of current holdings
  const weightedAveragePriceOfCurrentHoldings = currentTotalQuantity > 0 ? costBasisOfCurrentHoldings / currentTotalQuantity : 0;

  return {
    current_total_quantity: currentTotalQuantity,
    weighted_average_acquisition_price: weightedAveragePriceOfCurrentHoldings,
    total_invested_all_purchases: totalCostOfPurchases,
    cost_basis_current_holdings: costBasisOfCurrentHoldings,
    market_value_current_holdings: marketValueOfCurrentHoldings,
    unrealized_profit_loss: unrealizedProfitLoss,
    realized_profit_loss: realizedProfitLoss,
    total_income_received: totalIncomeReceived,
    profit_loss_absolute: totalNetProfitLoss,
    profit_loss_percentage: overallReturnPercentage,
  };
}

function calculatePortfolioSummary(investmentsWithMetricsArray) {
  let portfolioTotalMarketValue = 0;
  let portfolioTotalCostBasisCurrentHoldings = 0;
  let portfolioTotalInvestedAllPurchases = 0;
  let portfolioTotalUnrealizedPL = 0;
  let portfolioTotalRealizedPL = 0;
  let portfolioTotalIncome = 0;
  let portfolioTotalNetPL = 0;

  for (const metrics of investmentsWithMetricsArray) { // Assuming array of metrics objects
    if (metrics) {
      portfolioTotalMarketValue += metrics.market_value_current_holdings || 0;
      portfolioTotalCostBasisCurrentHoldings += metrics.cost_basis_current_holdings || 0;
      portfolioTotalInvestedAllPurchases += metrics.total_invested_all_purchases || 0;
      portfolioTotalUnrealizedPL += metrics.unrealized_profit_loss || 0;
      portfolioTotalRealizedPL += metrics.realized_profit_loss || 0;
      portfolioTotalIncome += metrics.total_income_received || 0;
      portfolioTotalNetPL += metrics.profit_loss_absolute || 0;
    }
  }

  const portfolioOverallReturnPercentage = portfolioTotalInvestedAllPurchases > 0 ? (portfolioTotalNetPL / portfolioTotalInvestedAllPurchases) * 100 : 0;

  return {
    current_total_portfolio_value: portfolioTotalMarketValue,
    total_invested_portfolio_current_holdings: portfolioTotalCostBasisCurrentHoldings,
    total_invested_portfolio_all_time: portfolioTotalInvestedAllPurchases,
    overall_portfolio_unrealized_pl: portfolioTotalUnrealizedPL,
    overall_portfolio_realized_pl: portfolioTotalRealizedPL,
    overall_portfolio_income: portfolioTotalIncome,
    overall_portfolio_profit_loss_absolute: portfolioTotalNetPL,
    overall_portfolio_profit_loss_percentage: portfolioOverallReturnPercentage,
  };
}
