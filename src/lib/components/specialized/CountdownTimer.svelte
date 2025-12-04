<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  export let targetDate: Date;
  export let title: string = "Tournament Countdown";

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let interval: number;

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance > 0) {
      days = Math.floor(distance / (1000 * 60 * 60 * 24));
      hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      seconds = Math.floor((distance % (1000 * 60)) / 1000);
    } else {
      // Timer has reached zero
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
    }
  }

  onMount(() => {
    updateCountdown();
    interval = setInterval(updateCountdown, 1000);
  });

  onDestroy(() => {
    if (interval) {
      clearInterval(interval);
    }
  });
</script>

<div class="countdown-container">
  <h3>{title}</h3>
  <div class="countdown">
    <div class="time-unit">
      <span class="time-number">{days.toString().padStart(3, "0")}</span>
      <label class="time-label">Days</label>
    </div>
    <div class="time-unit">
      <span class="time-number">{hours.toString().padStart(2, "0")}</span>
      <label class="time-label">Hours</label>
    </div>
    <div class="time-unit">
      <span class="time-number">{minutes.toString().padStart(2, "0")}</span>
      <label class="time-label">Minutes</label>
    </div>
    <div class="time-unit">
      <span class="time-number">{seconds.toString().padStart(2, "0")}</span>
      <label class="time-label">Seconds</label>
    </div>
  </div>
</div>

<style>
  .countdown-container {
    margin: 3rem auto;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.15);
    border-radius: var(--border-radius-large);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    max-width: 600px;
    text-align: center;
  }

  .countdown-container h3 {
    color: var(--white);
    margin-bottom: 2rem;
    font-size: 1.5rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }

  .countdown {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  .time-unit {
    background: rgba(255, 255, 255, 0.2);
    padding: 1.5rem 1rem;
    border-radius: var(--border-radius);
    text-align: center;
    backdrop-filter: blur(5px);
  }

  .time-number {
    display: block;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    color: var(--white);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    line-height: 1;
  }

  .time-label {
    display: block;
    font-size: 0.9rem;
    color: var(--white);
    font-weight: 500;
    margin-top: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .countdown {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .time-unit {
      padding: 1rem 0.5rem;
    }
  }

  @media (max-width: 480px) {
    .countdown-container {
      padding: 1.5rem;
      margin: 2rem auto;
    }

    .countdown {
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
    }

    .time-unit {
      padding: 1rem 0.5rem;
    }

    .time-number {
      font-size: 1.5rem;
    }

    .time-label {
      font-size: 0.7rem;
    }
  }
</style>
