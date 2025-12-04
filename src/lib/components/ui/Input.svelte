<script lang="ts">
  export let type:
    | "text"
    | "email"
    | "tel"
    | "password"
    | "number"
    | "textarea"
    | "select" = "text";
  export let label: string = "";
  export let id: string = "";
  export let name: string = "";
  export let value: string = "";
  export let placeholder: string = "";
  export let required = false;
  export let disabled = false;
  export let error: string = "";
  export let options: Array<{ value: string; label: string }> = [];
  export let rows = 4;
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;

  $: inputClasses = [
    "input",
    error ? "input-error" : "",
    disabled ? "input-disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");
</script>

<div class="form-group">
  {#if label}
    <label for={id} class="label">
      {label}
      {#if required}
        <span class="required">*</span>
      {/if}
    </label>
  {/if}

  {#if type === "textarea"}
    <textarea
      {id}
      {name}
      {placeholder}
      {required}
      {disabled}
      {rows}
      class={inputClasses}
      bind:value
    ></textarea>
  {:else if type === "select"}
    <select {id} {name} {required} {disabled} class={inputClasses} bind:value>
      <option value="">{placeholder || "Select an option"}</option>
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  {:else}
    <input
      {type}
      {id}
      {name}
      {placeholder}
      {required}
      {disabled}
      {min}
      {max}
      class={inputClasses}
      bind:value
    />
  {/if}

  {#if error}
    <span class="error-message">{error}</span>
  {/if}
</div>

<style>
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
  }

  .label {
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-dark);
    font-size: 1rem;
  }

  .required {
    color: #dc3545;
    margin-left: 0.25rem;
  }

  .input {
    width: 100%;
    padding: 1rem;
    border: 2px solid var(--light-gray);
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-family: inherit;
    transition: var(--transition);
    background-color: var(--white);
    color: var(--text-dark);
  }

  .input:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 3px rgba(25, 128, 56, 0.1);
  }

  .input-error {
    border-color: #dc3545;
  }

  .input-error:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
  }

  .input-disabled {
    background-color: var(--light-gray);
    cursor: not-allowed;
    opacity: 0.7;
  }

  .error-message {
    color: #dc3545;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    font-weight: 500;
  }

  /* Textarea specific styling */
  textarea.input {
    resize: vertical;
    min-height: 120px;
  }

  /* Select specific styling */
  select.input {
    cursor: pointer;
    background-image: url("image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23666' d='M2 0L0 2h4zM0 3l2 2 2-2z'/></svg>");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 0.8rem;
    padding-right: 3rem;
    appearance: none;
  }

  select.input:focus {
    background-image: url("image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23198038' d='M2 0L0 2h4zM0 3l2 2 2-2z'/></svg>");
  }

  /* Number input specific styling */
  input[type="number"].input {
    -moz-appearance: textfield;
  }

  input[type="number"].input::-webkit-outer-spin-button,
  input[type="number"].input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Mobile responsiveness */
  @media (max-width: 480px) {
    .input {
      padding: 0.875rem;
      font-size: 0.95rem;
    }

    .label {
      font-size: 0.95rem;
    }

    .error-message {
      font-size: 0.85rem;
    }
  }
</style>
