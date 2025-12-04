<script lang="ts">
  import { onMount } from "svelte";
  import { Card, Button } from "$lib/components";
  import { auth } from "$lib/stores/auth";
  import { permissionChecker } from "$lib/stores/permissions";

  // Export state
  let exportFormats = ["CSV", "JSON", "Excel", "PDF"];
  let selectedFormat = "CSV";
  let selectedData = "registrations";
  let dateRange = {
    start: "",
    end: "",
  };
  let includeFields = {
    registrations: {
      basic: true,
      contact: true,
      payment: true,
      timestamps: false,
    },
    financial: {
      summary: true,
      transactions: true,
      expenses: false,
    },
    users: {
      profile: true,
      activity: false,
      permissions: false,
    },
  };

  let isExporting = false;
  let exportStatus = "";

  // Data types available for export
  const dataTypes = [
    {
      id: "registrations",
      name: "Tournament Registrations",
      description: "Player registration data and details",
      permission: "players.view",
      icon: "🎯",
    },
    {
      id: "financial",
      name: "Financial Reports",
      description: "Payment transactions and revenue data",
      permission: "reports.financial",
      icon: "💰",
    },
    {
      id: "users",
      name: "User Management",
      description: "Admin user accounts and activity",
      permission: "users.view",
      icon: "👥",
    },
    {
      id: "analytics",
      name: "Analytics Data",
      description: "Performance metrics and insights",
      permission: "analytics.view",
      icon: "📊",
    },
  ];

  $: currentUser = $auth.user;
  $: availableDataTypes = dataTypes.filter((type) =>
    currentUser
      ? $permissionChecker.hasPermission(
          parseInt(currentUser.id),
          type.permission
        )
      : false
  );

  // Sample data for demo
  const sampleData = {
    registrations: [
      {
        id: 1,
        participant_name: "John Smith",
        email: "john@example.com",
        phone: "+1-555-0123",
        company: "IBM",
        registration_type: "individual",
        amount: 150,
        status: "confirmed",
        payment_status: "paid",
        created_at: "2024-03-01T10:00:00Z",
      },
      {
        id: 2,
        participant_name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "+1-555-0124",
        company: "Tech Corp",
        registration_type: "foursome",
        amount: 550,
        status: "pending",
        payment_status: "pending",
        created_at: "2024-03-02T14:30:00Z",
      },
    ],
    financial: [
      {
        transaction_id: "txn_001",
        participant_name: "John Smith",
        amount: 150,
        payment_method: "credit_card",
        status: "completed",
        processed_at: "2024-03-01T10:05:00Z",
      },
      {
        transaction_id: "txn_002",
        participant_name: "Team Builders Inc",
        amount: 550,
        payment_method: "bank_transfer",
        status: "pending",
        processed_at: "2024-03-02T15:00:00Z",
      },
    ],
    users: [
      {
        id: 1,
        name: "Tournament Admin",
        email: "admin@ibm.com",
        role: "super_admin",
        last_login: "2024-03-15T10:30:00Z",
        created_at: "2024-01-01T00:00:00Z",
      },
    ],
  };

  function formatDataForExport(data: any[], format: string): string {
    switch (format) {
      case "CSV":
        return convertToCSV(data);
      case "JSON":
        return JSON.stringify(data, null, 2);
      case "Excel":
        return convertToCSV(data); // Simplified - would need actual Excel library
      case "PDF":
        return "PDF export would require additional library implementation";
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  function convertToCSV(data: any[]): string {
    if (!data.length) return "";

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((value) => (typeof value === "string" ? `"${value}"` : value))
        .join(",")
    );

    return [headers, ...rows].join("\n");
  }

  function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  async function exportData() {
    if (!selectedData || !selectedFormat) {
      exportStatus = "Please select data type and format";
      return;
    }

    isExporting = true;
    exportStatus = "Preparing export...";

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get data based on selection
      let data = sampleData[selectedData as keyof typeof sampleData] || [];

      // Apply date filtering if specified
      if (dateRange.start || dateRange.end) {
        data = data.filter((item: any) => {
          const itemDate = new Date(item.created_at || item.processed_at);
          const startDate = dateRange.start ? new Date(dateRange.start) : null;
          const endDate = dateRange.end ? new Date(dateRange.end) : null;

          if (startDate && itemDate < startDate) return false;
          if (endDate && itemDate > endDate) return false;
          return true;
        });
      }

      // Apply field filtering
      const fields = includeFields[selectedData as keyof typeof includeFields];
      if (fields && selectedData === "registrations") {
        data = data.map((item: any) => {
          const filtered: any = {};

          if (fields.basic) {
            filtered.id = item.id;
            filtered.participant_name = item.participant_name;
            filtered.registration_type = item.registration_type;
            filtered.status = item.status;
          }

          if (fields.contact) {
            filtered.email = item.email;
            filtered.phone = item.phone;
            filtered.company = item.company;
          }

          if (fields.payment) {
            filtered.amount = item.amount;
            filtered.payment_status = item.payment_status;
          }

          if (fields.timestamps) {
            filtered.created_at = item.created_at;
          }

          return filtered;
        });
      }

      // Format data
      const formattedData = formatDataForExport(data, selectedFormat);

      // Generate filename
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `${selectedData}_export_${timestamp}.${selectedFormat.toLowerCase()}`;

      // Determine MIME type
      const mimeTypes: Record<string, string> = {
        CSV: "text/csv",
        JSON: "application/json",
        Excel: "text/csv", // Simplified
        PDF: "application/pdf",
      };

      // Download file
      downloadFile(formattedData, filename, mimeTypes[selectedFormat]);

      exportStatus = `Successfully exported ${data.length} records as ${selectedFormat}`;
    } catch (error) {
      exportStatus = "Export failed. Please try again.";
      console.error("Export error:", error);
    } finally {
      isExporting = false;

      // Clear status after delay
      setTimeout(() => {
        exportStatus = "";
      }, 3000);
    }
  }

  onMount(() => {
    // Set default date range to last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    dateRange.end = endDate.toISOString().split("T")[0];
    dateRange.start = startDate.toISOString().split("T")[0];
  });
</script>

<div class="data-export">
  <div class="section-header">
    <div class="header-content">
      <h2>📊 Data Export & Reports</h2>
      <p>Export tournament data in various formats</p>
    </div>
  </div>

  <div class="export-grid">
    <!-- Data Type Selection -->
    <Card variant="default" padding="large">
      <h3>📋 Select Data Type</h3>
      <div class="data-types">
        {#each availableDataTypes as dataType}
          <label class="data-type-option">
            <input type="radio" bind:group={selectedData} value={dataType.id} />
            <div
              class="data-type-card"
              class:selected={selectedData === dataType.id}
            >
              <div class="data-type-icon">{dataType.icon}</div>
              <div class="data-type-content">
                <h4>{dataType.name}</h4>
                <p>{dataType.description}</p>
              </div>
            </div>
          </label>
        {/each}
      </div>
    </Card>

    <!-- Export Options -->
    <Card variant="default" padding="large">
      <h3>⚙️ Export Options</h3>

      <!-- Format Selection -->
      <div class="form-group">
        <label for="format">Export Format</label>
        <select id="format" bind:value={selectedFormat}>
          {#each exportFormats as format}
            <option value={format}>{format}</option>
          {/each}
        </select>
      </div>

      <!-- Date Range -->
      <div class="form-row">
        <div class="form-group">
          <label for="start-date">Start Date</label>
          <input id="start-date" type="date" bind:value={dateRange.start} />
        </div>
        <div class="form-group">
          <label for="end-date">End Date</label>
          <input id="end-date" type="date" bind:value={dateRange.end} />
        </div>
      </div>

      <!-- Field Selection -->
      {#if selectedData === "registrations"}
        <div class="field-selection">
          <h4>Include Fields</h4>
          <div class="field-options">
            <label class="field-option">
              <input
                type="checkbox"
                bind:checked={includeFields.registrations.basic}
              />
              <span>Basic Information</span>
            </label>
            <label class="field-option">
              <input
                type="checkbox"
                bind:checked={includeFields.registrations.contact}
              />
              <span>Contact Details</span>
            </label>
            <label class="field-option">
              <input
                type="checkbox"
                bind:checked={includeFields.registrations.payment}
              />
              <span>Payment Information</span>
            </label>
            <label class="field-option">
              <input
                type="checkbox"
                bind:checked={includeFields.registrations.timestamps}
              />
              <span>Timestamps</span>
            </label>
          </div>
        </div>
      {/if}
    </Card>

    <!-- Export Actions -->
    <Card variant="default" padding="large">
      <h3>🚀 Export Data</h3>

      <div class="export-preview">
        <div class="preview-info">
          <span class="preview-label">Data Type:</span>
          <span class="preview-value">
            {availableDataTypes.find((dt) => dt.id === selectedData)?.name ||
              "None selected"}
          </span>
        </div>
        <div class="preview-info">
          <span class="preview-label">Format:</span>
          <span class="preview-value">{selectedFormat}</span>
        </div>
        <div class="preview-info">
          <span class="preview-label">Date Range:</span>
          <span class="preview-value">
            {dateRange.start || "Any"} to {dateRange.end || "Any"}
          </span>
        </div>
      </div>

      {#if exportStatus}
        <div
          class="export-status"
          class:success={exportStatus.includes("Successfully")}
          class:error={exportStatus.includes("failed")}
        >
          {exportStatus}
        </div>
      {/if}

      <div class="export-actions">
        <Button
          variant="outline"
          onclick={() => {
            selectedData = "registrations";
            selectedFormat = "CSV";
            dateRange.start = "";
            dateRange.end = "";
          }}
        >
          🔄 Reset
        </Button>
        <Button
          variant="primary"
          onclick={exportData}
          disabled={isExporting || !selectedData}
        >
          {isExporting ? "⏳ Exporting..." : "📥 Export Data"}
        </Button>
      </div>
    </Card>
  </div>

  <!-- Quick Export Templates -->
  <Card variant="default" padding="large">
    <h3>⚡ Quick Export Templates</h3>
    <div class="quick-templates">
      <button
        class="template-btn"
        on:click={() => {
          selectedData = "registrations";
          selectedFormat = "CSV";
          includeFields.registrations = {
            basic: true,
            contact: true,
            payment: true,
            timestamps: false,
          };
        }}
      >
        <div class="template-icon">📋</div>
        <div class="template-content">
          <h4>Registration Summary</h4>
          <p>Basic registration data as CSV</p>
        </div>
      </button>

      <button
        class="template-btn"
        on:click={() => {
          selectedData = "financial";
          selectedFormat = "Excel";
        }}
      >
        <div class="template-icon">💰</div>
        <div class="template-content">
          <h4>Financial Report</h4>
          <p>Revenue and payments as Excel</p>
        </div>
      </button>

      <button
        class="template-btn"
        on:click={() => {
          selectedData = "registrations";
          selectedFormat = "JSON";
          includeFields.registrations = {
            basic: true,
            contact: true,
            payment: true,
            timestamps: true,
          };
        }}
      >
        <div class="template-icon">🔧</div>
        <div class="template-content">
          <h4>Full Data Backup</h4>
          <p>Complete dataset as JSON</p>
        </div>
      </button>
    </div>
  </Card>
</div>

<style>
  .data-export {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
  }

  .header-content h2 {
    margin: 0 0 0.5rem 0;
    color: var(--text-dark);
  }

  .header-content p {
    margin: 0;
    color: var(--medium-gray);
  }

  .export-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  /* Data Type Selection */
  .data-types {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .data-type-option {
    cursor: pointer;
  }

  .data-type-option input[type="radio"] {
    display: none;
  }

  .data-type-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid var(--light-gray);
    border-radius: var(--border-radius);
    transition: all 0.2s ease;
  }

  .data-type-card:hover {
    border-color: var(--primary-green);
    background: var(--light-gray);
  }

  .data-type-card.selected {
    border-color: var(--primary-green);
    background: var(--primary-green);
    color: var(--white);
  }

  .data-type-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .data-type-content h4 {
    margin: 0 0 0.25rem 0;
  }

  .data-type-content p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.8;
  }

  /* Form Styles */
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-group label {
    font-weight: 600;
    color: var(--text-dark);
  }

  .form-group select,
  .form-group input {
    padding: 0.75rem;
    border: 2px solid var(--light-gray);
    border-radius: var(--border-radius);
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }

  .form-group select:focus,
  .form-group input:focus {
    outline: none;
    border-color: var(--primary-green);
  }

  /* Field Selection */
  .field-selection {
    margin-top: 1.5rem;
  }

  .field-selection h4 {
    margin: 0 0 1rem 0;
    color: var(--text-dark);
  }

  .field-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .field-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }

  .field-option input[type="checkbox"] {
    width: 1.25rem;
    height: 1.25rem;
  }

  /* Export Preview */
  .export-preview {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
  }

  .preview-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .preview-label {
    font-weight: 600;
    color: var(--text-dark);
  }

  .preview-value {
    color: var(--dark-gray);
    font-family: monospace;
  }

  /* Export Status */
  .export-status {
    padding: 1rem;
    border-radius: var(--border-radius);
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .export-status.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .export-status.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .export-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  /* Quick Templates */
  .quick-templates {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .template-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--white);
    border: 2px solid var(--light-gray);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .template-btn:hover {
    border-color: var(--primary-green);
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }

  .template-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .template-content h4 {
    margin: 0 0 0.25rem 0;
    color: var(--text-dark);
  }

  .template-content p {
    margin: 0;
    color: var(--medium-gray);
    font-size: 0.9rem;
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .section-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .export-grid {
      grid-template-columns: 1fr;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .export-actions {
      flex-direction: column;
    }

    .quick-templates {
      grid-template-columns: 1fr;
    }

    .template-btn {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .data-type-card {
      flex-direction: column;
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    .export-preview {
      padding: 0.75rem;
    }

    .preview-info {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }

    .template-btn {
      padding: 1rem;
    }
  }
</style>
