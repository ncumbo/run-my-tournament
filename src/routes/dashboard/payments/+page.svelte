<script lang="ts">
  import { onMount } from "svelte";
  import { customerAuth } from "$lib/stores/customerAuth";
  import Card from "$lib/components/ui/Card.svelte";
  import Button from "$lib/components/ui/Button.svelte";

  let organization = $customerAuth.organization;
  let loading = false;
  let message = "";

  // Payment settings
  let paymentSettings = {
    stripe_connect_account_id: "",
    stripe_account_status: "not_connected",
    payment_processing_enabled: false,
    transaction_fee_percentage: 2.9,
    revenue_share_enabled: true,
    payout_schedule: "weekly",
  };

  // Recent transactions (mock data)
  let recentTransactions = [
    {
      id: "txn_1",
      tournament_name: "Spring Golf Classic",
      amount: 150.0,
      fee: 4.35,
      net: 145.65,
      status: "completed",
      date: "2024-12-04",
    },
    {
      id: "txn_2",
      tournament_name: "Charity Golf Tournament",
      amount: 200.0,
      fee: 5.8,
      net: 194.2,
      status: "completed",
      date: "2024-12-03",
    },
    {
      id: "txn_3",
      tournament_name: "Corporate Golf Day",
      amount: 300.0,
      fee: 8.7,
      net: 291.3,
      status: "pending",
      date: "2024-12-02",
    },
  ];

  // Analytics data (mock)
  let analytics = {
    total_revenue: 2450.0,
    total_fees: 71.05,
    net_earnings: 2378.95,
    transactions_count: 18,
    average_transaction: 136.11,
  };

  async function connectStripeAccount() {
    loading = true;
    message = "";

    try {
      const response = await fetch("/api/payments/stripe/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (result.success && result.onboarding_url) {
        // Redirect to Stripe Connect onboarding
        window.location.href = result.onboarding_url;
      } else {
        message = result.error || "Failed to initiate Stripe Connect";
      }
    } catch (error) {
      message = "Network error. Please try again.";
    } finally {
      loading = false;
    }
  }

  async function disconnectStripeAccount() {
    loading = true;

    try {
      const response = await fetch("/api/payments/stripe/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (result.success) {
        paymentSettings.stripe_connect_account_id = "";
        paymentSettings.stripe_account_status = "not_connected";
        paymentSettings.payment_processing_enabled = false;
        message = "Stripe account disconnected successfully!";
      } else {
        message = result.error || "Failed to disconnect Stripe account";
      }
    } catch (error) {
      message = "Network error. Please try again.";
    } finally {
      loading = false;
    }
  }

  async function updatePayoutSettings() {
    loading = true;

    try {
      const response = await fetch("/api/payments/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payout_schedule: paymentSettings.payout_schedule,
        }),
      });

      const result = await response.json();

      if (result.success) {
        message = "Payout settings updated successfully!";
      } else {
        message = result.error || "Failed to update settings";
      }
    } catch (error) {
      message = "Network error. Please try again.";
    } finally {
      loading = false;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "completed":
        return "#22543d";
      case "pending":
        return "#d69e2e";
      case "failed":
        return "#c53030";
      default:
        return "#4a5568";
    }
  }

  onMount(() => {
    // Load payment settings from API
    // TODO: Implement API call to get current Stripe Connect status
  });
</script>

<svelte:head>
  <title>Payments & Billing - PinPoint Golf</title>
</svelte:head>

<div class="payments-page">
  <div class="page-header">
    <h1>Payments & Billing</h1>
    <p>Manage payment processing and view financial analytics</p>
  </div>

  <div class="payments-grid">
    <!-- Stripe Connect Setup -->
    <Card>
      <h2>Payment Processing</h2>

      {#if paymentSettings.stripe_account_status === "not_connected"}
        <div class="connect-stripe">
          <div class="stripe-info">
            <h3>Connect with Stripe</h3>
            <p>
              Enable payment processing for your tournaments by connecting your
              Stripe account. This allows you to collect registration fees
              directly.
            </p>

            <div class="benefits">
              <h4>Benefits:</h4>
              <ul>
                <li>✅ Secure payment processing</li>
                <li>✅ Direct deposits to your bank account</li>
                <li>✅ Support for all major credit cards</li>
                <li>✅ Fraud protection included</li>
                <li>✅ Real-time transaction tracking</li>
              </ul>
            </div>
          </div>

          <Button
            on:click={connectStripeAccount}
            {loading}
            disabled={loading}
            size="large"
          >
            <span class="stripe-logo">💳</span>
            Connect with Stripe
          </Button>
        </div>
      {:else}
        <div class="stripe-connected">
          <div class="connection-status">
            <span class="status-badge connected">✅ Connected</span>
            <h3>Stripe Account Active</h3>
            <p>Account ID: {paymentSettings.stripe_connect_account_id}</p>
          </div>

          <div class="account-details">
            <div class="detail-row">
              <span>Payment Processing:</span>
              <span class="value">
                {paymentSettings.payment_processing_enabled
                  ? "Enabled"
                  : "Disabled"}
              </span>
            </div>
            <div class="detail-row">
              <span>Transaction Fee:</span>
              <span class="value"
                >{paymentSettings.transaction_fee_percentage}%</span
              >
            </div>
            <div class="detail-row">
              <span>Payout Schedule:</span>
              <select
                bind:value={paymentSettings.payout_schedule}
                on:change={updatePayoutSettings}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div class="stripe-actions">
            <Button
              href="https://dashboard.stripe.com"
              target="_blank"
              variant="secondary"
            >
              View Stripe Dashboard
            </Button>
            <Button
              on:click={disconnectStripeAccount}
              variant="danger"
              {loading}
              disabled={loading}
            >
              Disconnect Account
            </Button>
          </div>
        </div>
      {/if}
    </Card>

    <!-- Financial Analytics -->
    <Card>
      <h2>Financial Overview</h2>

      <div class="analytics-grid">
        <div class="metric-card">
          <div class="metric-value">${analytics.total_revenue.toFixed(2)}</div>
          <div class="metric-label">Total Revenue</div>
        </div>

        <div class="metric-card">
          <div class="metric-value">${analytics.net_earnings.toFixed(2)}</div>
          <div class="metric-label">Net Earnings</div>
        </div>

        <div class="metric-card">
          <div class="metric-value">{analytics.transactions_count}</div>
          <div class="metric-label">Transactions</div>
        </div>

        <div class="metric-card">
          <div class="metric-value">
            ${analytics.average_transaction.toFixed(2)}
          </div>
          <div class="metric-label">Avg Transaction</div>
        </div>
      </div>

      <div class="fees-breakdown">
        <h4>Fee Breakdown</h4>
        <div class="fee-item">
          <span>Processing Fees:</span>
          <span>${analytics.total_fees.toFixed(2)}</span>
        </div>
        <div class="fee-item">
          <span>Platform Fee (0.5%):</span>
          <span>${(analytics.total_revenue * 0.005).toFixed(2)}</span>
        </div>
      </div>
    </Card>

    <!-- Recent Transactions -->
    <Card>
      <h2>Recent Transactions</h2>

      <div class="transactions-table">
        <div class="table-header">
          <div class="col-tournament">Tournament</div>
          <div class="col-amount">Amount</div>
          <div class="col-fee">Fee</div>
          <div class="col-net">Net</div>
          <div class="col-status">Status</div>
          <div class="col-date">Date</div>
        </div>

        {#each recentTransactions as transaction}
          <div class="table-row">
            <div class="col-tournament">{transaction.tournament_name}</div>
            <div class="col-amount">${transaction.amount.toFixed(2)}</div>
            <div class="col-fee">${transaction.fee.toFixed(2)}</div>
            <div class="col-net">${transaction.net.toFixed(2)}</div>
            <div class="col-status">
              <span
                class="status-badge"
                style="background-color: {getStatusColor(
                  transaction.status
                )}20; color: {getStatusColor(transaction.status)}"
              >
                {transaction.status}
              </span>
            </div>
            <div class="col-date">{transaction.date}</div>
          </div>
        {/each}
      </div>

      <div class="table-footer">
        <Button variant="ghost" href="/dashboard/payments/transactions">
          View All Transactions
        </Button>
      </div>
    </Card>

    <!-- Payment Settings -->
    <Card>
      <h2>Payment Settings</h2>

      <div class="settings-form">
        <div class="setting-group">
          <h4>Revenue Sharing</h4>
          <label class="checkbox-label">
            <input
              type="checkbox"
              bind:checked={paymentSettings.revenue_share_enabled}
            />
            <span class="checkmark"></span>
            Enable revenue sharing with PinPoint Golf (helps support platform development)
          </label>
          <p class="setting-description">
            When enabled, 0.5% of gross revenue supports platform development
            and new features.
          </p>
        </div>

        <div class="setting-group">
          <h4>Transaction Notifications</h4>
          <label class="checkbox-label">
            <input type="checkbox" checked />
            <span class="checkmark"></span>
            Email notifications for successful payments
          </label>
          <label class="checkbox-label">
            <input type="checkbox" checked />
            <span class="checkmark"></span>
            Email notifications for failed payments
          </label>
        </div>
      </div>
    </Card>
  </div>

  {#if message}
    <div class="message" class:success={message.includes("successfully")}>
      {message}
    </div>
  {/if}
</div>

<style>
  .payments-page {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .page-header h1 {
    margin: 0 0 0.5rem 0;
    color: var(--text-dark);
    font-size: 2rem;
    font-weight: 700;
  }

  .page-header p {
    margin: 0;
    color: var(--text-muted);
    font-size: 1.1rem;
  }

  .payments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
  }

  .connect-stripe {
    text-align: center;
    padding: 2rem 0;
  }

  .stripe-info h3 {
    margin: 0 0 1rem 0;
    color: var(--text-dark);
  }

  .stripe-info p {
    margin-bottom: 2rem;
    color: var(--text-muted);
    line-height: 1.6;
  }

  .benefits {
    text-align: left;
    margin-bottom: 2rem;
  }

  .benefits h4 {
    margin: 0 0 1rem 0;
    color: var(--text-dark);
  }

  .benefits ul {
    list-style: none;
    padding: 0;
  }

  .benefits li {
    margin-bottom: 0.5rem;
    color: var(--text-muted);
  }

  .stripe-logo {
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }

  .stripe-connected {
    space-y: 1.5rem;
  }

  .connection-status {
    text-align: center;
    margin-bottom: 2rem;
  }

  .status-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .status-badge.connected {
    background: var(--pale-green);
    color: var(--primary-green);
  }

  .account-details {
    margin-bottom: 2rem;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border-light);
  }

  .detail-row:last-child {
    border-bottom: none;
  }

  .detail-row .value {
    font-weight: 500;
    color: var(--text-dark);
  }

  .detail-row select {
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--border-light);
    border-radius: 4px;
    background: white;
  }

  .stripe-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .analytics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .metric-card {
    text-align: center;
    padding: 1.5rem;
    border: 1px solid var(--border-light);
    border-radius: var(--border-radius);
    background: var(--off-white);
  }

  .metric-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-green);
    margin-bottom: 0.5rem;
  }

  .metric-label {
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .fees-breakdown {
    padding: 1rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
  }

  .fees-breakdown h4 {
    margin: 0 0 1rem 0;
    color: var(--text-dark);
  }

  .fee-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    color: var(--text-muted);
  }

  .fee-item:last-child {
    margin-bottom: 0;
    font-weight: 500;
    color: var(--text-dark);
  }

  .transactions-table {
    overflow-x: auto;
  }

  .table-header,
  .table-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border-light);
  }

  .table-header {
    font-weight: 600;
    color: var(--text-dark);
    background: var(--off-white);
    padding: 1rem;
    border-radius: var(--border-radius);
    margin-bottom: 0.5rem;
    border: none;
  }

  .table-row {
    align-items: center;
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .col-tournament {
    font-weight: 500;
    color: var(--text-dark);
  }

  .col-amount,
  .col-fee,
  .col-net {
    font-family: monospace;
    text-align: right;
  }

  .col-status .status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    text-transform: capitalize;
  }

  .col-date {
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .table-footer {
    margin-top: 1rem;
    text-align: center;
  }

  .settings-form {
    space-y: 2rem;
  }

  .setting-group {
    margin-bottom: 2rem;
  }

  .setting-group h4 {
    margin: 0 0 1rem 0;
    color: var(--text-dark);
  }

  .checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1rem;
    cursor: pointer;
  }

  .checkbox-label input[type="checkbox"] {
    margin: 0;
  }

  .checkmark {
    flex-shrink: 0;
    margin-top: 0.1rem;
  }

  .setting-description {
    margin: 0.5rem 0 0 2rem;
    color: var(--text-muted);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .message {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius);
    background: #fee;
    color: #c53030;
    border: 1px solid #feb2b2;
    box-shadow: var(--shadow);
    z-index: 1000;
  }

  .message.success {
    background: #f0fff4;
    color: #22543d;
    border-color: #9ae6b4;
  }

  @media (max-width: 1024px) {
    .payments-grid {
      grid-template-columns: 1fr;
    }

    .analytics-grid {
      grid-template-columns: 1fr 1fr;
    }

    .table-header,
    .table-row {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .table-header {
      display: none;
    }

    .table-row {
      display: block;
      padding: 1rem;
      border: 1px solid var(--border-light);
      border-radius: var(--border-radius);
      margin-bottom: 1rem;
    }

    .table-row > div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .table-row > div:before {
      content: attr(data-label);
      font-weight: 500;
      color: var(--text-muted);
    }
  }

  @media (max-width: 768px) {
    .stripe-actions {
      flex-direction: column;
    }

    .analytics-grid {
      grid-template-columns: 1fr;
    }

    .message {
      left: 1rem;
      right: 1rem;
      bottom: 1rem;
    }
  }
</style>
