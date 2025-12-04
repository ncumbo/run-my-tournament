<script lang="ts">
  import { PageHero, Card } from "$lib/components";
</script>

<svelte:head>
  <title>Tournament Details - IBM Charity Golf Tournament</title>
  <meta
    name="description"
    content="Complete tournament format, rules, and details for the IBM Charity Golf Tournament 2026"
  />
</svelte:head>

<PageHero
  title="Tournament Details"
  subtitle="Format, Rules & Schedule"
  stats={[
    { number: "18", label: "Holes" },
    { number: "4", label: "Player Teams" },
    { number: "8:00 AM", label: "Shotgun Start" },
  ]}
/>

<section class="tournament-format section">
  <div class="container">
    <h2>Tournament Format</h2>
    <div class="format-grid">
      <Card variant="info" padding="large">
        <h3>⛳ Scramble Format</h3>
        <p>
          The tournament follows a four-person scramble format. All players tee
          off, then select the best shot and all players play their next shot
          from that location.
        </p>
        <ul>
          <li>All skill levels welcome</li>
          <li>Team-based format promotes camaraderie</li>
          <li>Maximum handicap: 30 for men, 36 for women</li>
          <li>USGA rules apply with local modifications</li>
        </ul>
      </Card>

      <Card variant="info" padding="large">
        <h3>📅 Schedule</h3>
        <div class="schedule-list">
          <div class="schedule-item">
            <strong>7:00 AM</strong>
            <span>Registration & Check-in Opens</span>
          </div>
          <div class="schedule-item">
            <strong>7:30 AM</strong>
            <span>Continental Breakfast</span>
          </div>
          <div class="schedule-item">
            <strong>8:00 AM</strong>
            <span>Shotgun Start</span>
          </div>
          <div class="schedule-item">
            <strong>1:00 PM</strong>
            <span>Lunch & Awards Ceremony</span>
          </div>
          <div class="schedule-item">
            <strong>3:00 PM</strong>
            <span>Silent Auction Results</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
</section>

<section class="tournament-rules section">
  <div class="container">
    <h2>Rules & Regulations</h2>
    <div class="rules-grid">
      <Card variant="default" padding="large">
        <h3>🏌️ Playing Rules</h3>
        <ul class="rules-list">
          <li>
            <strong>Dress Code:</strong> Collared shirts required, no denim, soft
            spikes only
          </li>
          <li><strong>Pace of Play:</strong> 4 hours 30 minutes maximum</li>
          <li>
            <strong>Mulligans:</strong> Available for purchase ($20 each, max 2 per
            player)
          </li>
          <li>
            <strong>Closest to Pin:</strong> One shot per player on designated par
            3s
          </li>
          <li>
            <strong>Longest Drive:</strong> Must land in fairway to qualify
          </li>
          <li><strong>Cart Path Only:</strong> When conditions require</li>
        </ul>
      </Card>

      <Card variant="default" padding="large">
        <h3>🏆 Prizes & Awards</h3>
        <ul class="rules-list">
          <li>
            <strong>1st Place Team:</strong> Championship trophy + gift cards
          </li>
          <li><strong>2nd Place Team:</strong> Runner-up trophy + prizes</li>
          <li><strong>3rd Place Team:</strong> Bronze trophy + prizes</li>
          <li><strong>Closest to Pin:</strong> Prize for each par 3</li>
          <li><strong>Longest Drive:</strong> Men's & Women's divisions</li>
          <li><strong>Putting Contest:</strong> Skills challenge winner</li>
        </ul>
      </Card>

      <Card variant="default" padding="large">
        <h3>🌧️ Weather Policy</h3>
        <ul class="rules-list">
          <li>
            <strong>Rain Policy:</strong> Tournament continues in light rain
          </li>
          <li><strong>Lightning:</strong> Immediate suspension for safety</li>
          <li>
            <strong>Severe Weather:</strong> Postponement or cancellation possible
          </li>
          <li>
            <strong>Refunds:</strong> Available for weather cancellations only
          </li>
          <li>
            <strong>Updates:</strong> Check website and email for notifications
          </li>
        </ul>
      </Card>
    </div>
  </div>
</section>

<section class="registration-details section">
  <div class="container">
    <h2>Registration Information</h2>
    <div class="registration-grid">
      <Card variant="success" padding="large">
        <h3>💰 Pricing</h3>
        <div class="pricing-details">
          <div class="price-item">
            <span class="price-label">Individual Registration:</span>
            <span class="price-amount">$150</span>
          </div>
          <div class="price-item">
            <span class="price-label">Foursome Package:</span>
            <span class="price-amount">$550</span>
          </div>
          <div class="price-savings">Save $50 with foursome registration!</div>
        </div>

        <h4>Includes:</h4>
        <ul>
          <li>18 holes of golf with cart</li>
          <li>Continental breakfast</li>
          <li>Lunch and awards ceremony</li>
          <li>Tournament gift bag</li>
          <li>Participation in contests</li>
          <li>Access to silent auction</li>
        </ul>
      </Card>

      <Card variant="warning" padding="large">
        <h3>📋 Registration Deadline</h3>
        <div class="deadline-info">
          <div class="deadline-date">May 15, 2026</div>
          <div class="deadline-note">Limited to 144 players</div>
        </div>
        <p>
          Early registration is recommended as this tournament typically sells
          out. Registration includes all activities and meals for the day.
        </p>

        <h4>Cancellation Policy:</h4>
        <ul>
          <li>Full refund if cancelled before May 1st</li>
          <li>50% refund if cancelled before May 10th</li>
          <li>No refund after May 10th (substitutions allowed)</li>
        </ul>
      </Card>
    </div>
  </div>
</section>

<section class="course-info section">
  <div class="container">
    <h2>Course Information</h2>
    <Card variant="info" padding="large">
      <div class="course-details">
        <div class="course-text">
          <h3>Buffalo Country Club</h3>
          <p class="course-description">
            Established in 1889, Buffalo Country Club is a premier championship
            golf course featuring tree-lined fairways, challenging water
            hazards, and immaculate greens. The course offers a fair but
            demanding test for golfers of all skill levels.
          </p>

          <div class="course-specs">
            <div class="spec-item">
              <strong>Par:</strong> 72
            </div>
            <div class="spec-item">
              <strong>Yardage:</strong> 6,800 yards (Championship tees)
            </div>
            <div class="spec-item">
              <strong>Rating/Slope:</strong> 73.2/135
            </div>
            <div class="spec-item">
              <strong>Designer:</strong> Donald Ross
            </div>
          </div>

          <h4>Course Features:</h4>
          <ul>
            <li>Championship-caliber layout</li>
            <li>Well-maintained bent grass greens</li>
            <li>Strategic bunker placement</li>
            <li>Beautiful mature trees</li>
            <li>Full practice facilities</li>
          </ul>
        </div>
      </div>
    </Card>
  </div>
</section>

<style>
  .format-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .schedule-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .schedule-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
    border-left: 4px solid var(--primary-green);
  }

  .schedule-item strong {
    color: var(--primary-green);
    font-weight: 600;
    min-width: 80px;
  }

  .rules-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .rules-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
  }

  .rules-list li {
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--light-gray);
    line-height: 1.5;
  }

  .rules-list li:last-child {
    border-bottom: none;
  }

  .rules-list strong {
    color: var(--primary-green);
  }

  .registration-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .pricing-details {
    margin-bottom: 2rem;
  }

  .price-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin-bottom: 0.5rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
  }

  .price-label {
    font-weight: 500;
    color: var(--dark-gray);
  }

  .price-amount {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-green);
  }

  .price-savings {
    text-align: center;
    padding: 1rem;
    background: var(--primary-green);
    color: var(--white);
    border-radius: var(--border-radius);
    font-weight: 600;
    margin-top: 1rem;
  }

  .deadline-info {
    text-align: center;
    margin-bottom: 2rem;
  }

  .deadline-date {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent-yellow);
    margin-bottom: 0.5rem;
  }

  .deadline-note {
    font-size: 1.1rem;
    color: var(--dark-gray);
    font-weight: 500;
  }

  .course-details {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .course-description {
    font-size: 1.1rem;
    line-height: 1.7;
    margin-bottom: 2rem;
    color: var(--dark-gray);
  }

  .course-specs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .spec-item {
    padding: 1rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
    text-align: center;
  }

  .spec-item strong {
    display: block;
    color: var(--primary-green);
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .format-grid,
    .rules-grid,
    .registration-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .course-specs {
      grid-template-columns: 1fr;
    }

    .price-item {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }

    .schedule-item {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }

    .schedule-item strong {
      min-width: auto;
    }
  }

  @media (max-width: 480px) {
    .deadline-date {
      font-size: 1.5rem;
    }

    .price-amount {
      font-size: 1.1rem;
    }
  }
</style>
