// public/tests/investment-logic.tests.js
QUnit.module('Investment Logic Calculations');

QUnit.test('calculateInvestmentMetrics - No Transactions', function(assert) {
  const metrics = calculateInvestmentMetrics([], '10'); // No transactions, current price 10
  assert.deepEqual(metrics.current_total_quantity, 0, 'Total quantity should be 0');
  assert.deepEqual(metrics.market_value_current_holdings, 0, 'Market value should be 0');
  assert.deepEqual(metrics.profit_loss_absolute, 0, 'Absolute P&L should be 0');
  assert.deepEqual(metrics.weighted_average_acquisition_price, 0, 'WAP should be 0');
});

QUnit.test('calculateInvestmentMetrics - Single Purchase', function(assert) {
  const transactions = [
    { transaction_type: 'Compra/Aporte', transaction_date: '2023-01-01', quantity_transacted: 10, price_per_unit_transacted: 100, fees_paid: 10 }
  ]; // Total cost = 10*100 + 10 = 1010
  const metrics = calculateInvestmentMetrics(transactions, '110'); // Current price 110

  assert.equal(metrics.current_total_quantity, 10, 'Quantity should be 10');
  assert.equal(metrics.total_invested_all_purchases, 1010, 'Total invested should be 1010');
  assert.equal(metrics.cost_basis_current_holdings, 1010, 'Cost basis of current holdings should be 1010');
  assert.equal(metrics.weighted_average_acquisition_price, 101, 'WAP should be 101'); // 1010 / 10
  assert.equal(metrics.market_value_current_holdings, 1100, 'Market value should be 1100'); // 10 * 110
  assert.equal(metrics.unrealized_profit_loss, 90, 'Unrealized P&L should be 90'); // 1100 - 1010
  assert.equal(metrics.profit_loss_absolute, 90, 'Absolute P&L should be 90');
  assert.close(metrics.profit_loss_percentage, (90 / 1010) * 100, 0.01, 'Percentage P&L');
});

QUnit.test('calculateInvestmentMetrics - Purchase and Sale (Full)', function(assert) {
  const transactions = [
    { transaction_type: 'Compra/Aporte', transaction_date: '2023-01-01', quantity_transacted: 10, price_per_unit_transacted: 100, fees_paid: 10 }, // Cost 1010, WAP running 101
    { transaction_type: 'Venda/Resgate', transaction_date: '2023-02-01', quantity_transacted: 10, price_per_unit_transacted: 120, fees_paid: 5 }    // Proceeds 1200-5 = 1195. Cost of sale = 10 * 101 = 1010
  ];
  const metrics = calculateInvestmentMetrics(transactions, '120'); // Current price doesn't matter for fully sold.

  assert.equal(metrics.current_total_quantity, 0, 'Quantity should be 0');
  assert.equal(metrics.total_invested_all_purchases, 1010, 'Total invested all purchases');
  assert.equal(metrics.cost_basis_current_holdings, 0, 'Cost basis of current holdings should be 0');
  assert.equal(metrics.market_value_current_holdings, 0, 'Market value should be 0');
  assert.equal(metrics.unrealized_profit_loss, 0, 'Unrealized P&L should be 0');
  assert.equal(metrics.realized_profit_loss, 185, 'Realized P&L should be 185'); // 1195 (proceeds) - 1010 (cost basis)
  assert.equal(metrics.profit_loss_absolute, 185, 'Absolute P&L should be 185');
  assert.close(metrics.profit_loss_percentage, (185 / 1010) * 100, 0.01, 'Percentage P&L');
});

QUnit.test('calculateInvestmentMetrics - Purchase, Sale (Partial), Income', function(assert) {
  const transactions = [
    { transaction_type: 'Compra/Aporte', transaction_date: '2023-01-01', quantity_transacted: 20, price_per_unit_transacted: 50, fees_paid: 20 }, // Total cost 1020. Qty 20. Running WAP 51.
    { transaction_type: 'Venda/Resgate', transaction_date: '2023-02-01', quantity_transacted: 5, price_per_unit_transacted: 60, fees_paid: 5 },     // Sold 5. WAP at sale 51. Cost of sale 5*51=255. Proceeds 5*60-5 = 295. Realized PL = 295-255 = 40.
                                                                                                                                                // Remaining: Qty 15. Running Cost 1020-255 = 765. Running Qty 15. WAP of remaining: 765/15 = 51.
    { transaction_type: 'Dividendo Recebido', transaction_date: '2023-03-01', quantity_transacted: 15, price_per_unit_transacted: 2, fees_paid: 0 } // Income: 15*2=30. (Assuming per share for current 15 shares)
  ];
  const metrics = calculateInvestmentMetrics(transactions, '65'); // Current price for remaining 15 shares.

  assert.equal(metrics.current_total_quantity, 15, 'Quantity should be 15');
  assert.equal(metrics.total_invested_all_purchases, 1020, 'Total invested all purchases');
  assert.equal(metrics.cost_basis_current_holdings, 765, 'Cost basis of current holdings');
  assert.equal(metrics.weighted_average_acquisition_price, 51, 'WAP of current holdings');

  assert.equal(metrics.market_value_current_holdings, 975, 'Market value should be 975'); // 15 * 65
  assert.equal(metrics.unrealized_profit_loss, 210, 'Unrealized P&L should be 210'); // 975 - 765

  assert.equal(metrics.realized_profit_loss, 40, 'Realized P&L from sale should be 40');
  assert.equal(metrics.total_income_received, 30, 'Total income should be 30');

  assert.equal(metrics.profit_loss_absolute, 280, 'Absolute P&L should be 280'); // Unrealized 210 + Realized 40 + Income 30
  assert.close(metrics.profit_loss_percentage, (280 / 1020) * 100, 0.01, 'Percentage P&L');
});

QUnit.test('calculateInvestmentMetrics - Income as lump sum', function(assert) {
  const transactions = [
    { transaction_type: 'Compra/Aporte', transaction_date: '2023-01-01', quantity_transacted: 10, price_per_unit_transacted: 100, fees_paid: 10 }, // Cost 1010
    // For income as lump sum, assuming price_per_unit_transacted is the total amount, and fees_paid are applied to it.
    // The logic in calculateInvestmentMetrics has a fallback: if quantity is not specified meaningfully (e.g. 0 or 1 sometimes) OR total_transaction_amount is present, it will prioritize that.
    // For this test, we'll rely on the price_per_unit_transacted being the primary value for income when quantity is 1.
    { transaction_type: 'Juros Recebido', transaction_date: '2023-03-01', quantity_transacted: 1, price_per_unit_transacted: 50, fees_paid: 0 } // Income: 50
  ];
  const metrics = calculateInvestmentMetrics(transactions, '100'); // Current price 100 for the 10 shares
  assert.equal(metrics.total_income_received, 50, 'Total income should be 50');
  assert.equal(metrics.profit_loss_absolute, 40, 'Absolute P&L should be 40'); // Unrealized -10 (10 shares at 100 = 1000 market value - 1010 cost basis) + Income 50
  assert.equal(metrics.current_total_quantity, 10, 'Quantity should remain 10 after income');
});

QUnit.module('Portfolio Logic Calculations');

QUnit.test('calculatePortfolioSummary - No Investments', function(assert) {
  const summary = calculatePortfolioSummary([]);
  assert.deepEqual(summary.current_total_portfolio_value, 0, 'Total portfolio value should be 0');
  assert.deepEqual(summary.overall_portfolio_profit_loss_absolute, 0, 'Portfolio P&L should be 0');
});

QUnit.test('calculatePortfolioSummary - Multiple Investments', function(assert) {
  const investment1Metrics = { // Mock metrics output from calculateInvestmentMetrics
    market_value_current_holdings: 1000,
    cost_basis_current_holdings: 800,
    total_invested_all_purchases: 800,
    unrealized_profit_loss: 200,
    realized_profit_loss: 0,
    total_income_received: 50,
    profit_loss_absolute: 250
  };
  const investment2Metrics = {
    market_value_current_holdings: 1500,
    cost_basis_current_holdings: 1200,
    total_invested_all_purchases: 1200,
    unrealized_profit_loss: 300,
    realized_profit_loss: 100,
    total_income_received: 20,
    profit_loss_absolute: 420
  };
  const summary = calculatePortfolioSummary([investment1Metrics, investment2Metrics]);

  assert.equal(summary.current_total_portfolio_value, 2500, 'Portfolio market value');
  assert.equal(summary.total_invested_portfolio_current_holdings, 2000, 'Portfolio cost basis current');
  assert.equal(summary.total_invested_portfolio_all_time, 2000, 'Portfolio total invested all time');
  assert.equal(summary.overall_portfolio_unrealized_pl, 500, 'Portfolio unrealized P&L');
  assert.equal(summary.overall_portfolio_realized_pl, 100, 'Portfolio realized P&L');
  assert.equal(summary.overall_portfolio_income, 70, 'Portfolio income');
  assert.equal(summary.overall_portfolio_profit_loss_absolute, 670, 'Portfolio absolute P&L');
  assert.close(summary.overall_portfolio_profit_loss_percentage, (670 / 2000) * 100, 0.01, 'Portfolio percentage P&L');
});
