# Reusable Components Library

This directory contains a comprehensive set of reusable Svelte components for the IBM Charity Golf Tournament website. These components were extracted from common patterns found across multiple pages to improve maintainability and consistency.

## Component Architecture

### UI Components (`ui/`)

Core user interface components that provide consistent styling and behavior:

#### Button (`ui/Button.svelte`)

A versatile button component supporting multiple variants and sizes.

**Props:**

- `variant`: 'primary' | 'secondary' | 'outline' (default: 'primary')
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `disabled`: boolean (default: false)
- `href`: string | undefined - renders as anchor link if provided
- `type`: 'button' | 'submit' | 'reset' (default: 'button')
- `onclick`: function - click handler

**Usage:**

```svelte
<Button variant="primary" size="large" href="/register">
  Register Now
</Button>

<Button variant="outline" onclick={handleClick}>
  Click Me
</Button>
```

#### Card (`ui/Card.svelte`)

Flexible card component with multiple variants for different content types.

**Props:**

- `variant`: 'default' | 'info' | 'benefit' | 'package' | 'testimonial' (default: 'default')
- `hoverable`: boolean (default: true)
- `padding`: 'small' | 'medium' | 'large' (default: 'medium')
- `borderTop`: 'none' | 'primary' | 'secondary' | 'accent' (default: 'none')

**Slots:**

- `header`: Optional card header
- `default`: Main card content
- `footer`: Optional card footer

**Usage:**

```svelte
<Card variant="info" hoverable={true}>
  <svelte:fragment slot="header">
    <h3>Card Title</h3>
  </svelte:fragment>

  <div class="card-icon">📅</div>
  <p>Card content goes here</p>

  <svelte:fragment slot="footer">
    <Button variant="primary">Action</Button>
  </svelte:fragment>
</Card>
```

#### Form (`ui/Form.svelte`)

Container component for forms with built-in success state handling.

**Props:**

- `onSubmit`: (event: Event) => void - form submission handler
- `isSubmitting`: boolean (default: false)
- `showSuccessMessage`: boolean (default: false)
- `successTitle`: string (default: "Success!")
- `successMessage`: string

**Slots:**

- `header`: Form header content
- `default`: Form fields
- `footer`: Form footer content
- `successActions`: Actions to show in success state

**Usage:**

```svelte
<Form {onSubmit} {isSubmitting} {showSuccessMessage}>
  <svelte:fragment slot="header">
    <h2>Contact Form</h2>
  </svelte:fragment>

  <!-- Form fields go here -->

  <svelte:fragment slot="footer">
    <Button type="submit" disabled={isSubmitting}>
      Submit
    </Button>
  </svelte:fragment>
</Form>
```

#### Input (`ui/Input.svelte`)

Comprehensive input component supporting various input types.

**Props:**

- `type`: 'text' | 'email' | 'tel' | 'password' | 'number' | 'textarea' | 'select' (default: 'text')
- `label`: string - input label
- `id`: string - input id
- `name`: string - input name
- `value`: string - bound value
- `placeholder`: string
- `required`: boolean (default: false)
- `disabled`: boolean (default: false)
- `error`: string - error message to display
- `options`: Array<{value: string, label: string}> - for select inputs
- `rows`: number (default: 4) - for textarea inputs
- `min`, `max`: number - for number inputs

**Usage:**

```svelte
<Input
  type="email"
  label="Email Address"
  id="email"
  bind:value={formData.email}
  required={true}
  error={errors.email}
/>

<Input
  type="select"
  label="Choose Option"
  options={[
    {value: 'option1', label: 'Option 1'},
    {value: 'option2', label: 'Option 2'}
  ]}
  bind:value={selectedOption}
/>
```

### Layout Components (`layout/`)

Structural components that provide consistent page layouts:

#### PageHero (`layout/PageHero.svelte`)

Hero section component used across all pages with flexible content options.

**Props:**

- `title`: string - main headline
- `subtitle`: string (default: '') - subtitle text
- `variant`: 'default' | 'home' (default: 'default')
- `stats`: Array<{number: string, label: string}> (default: [])
- `showTournamentInfo`: boolean (default: false)

**Slots:**

- `actions`: Hero action buttons
- `content`: Additional hero content (e.g., countdown timer)

**Usage:**

```svelte
<PageHero
  title="Page Title"
  subtitle="Page description"
  stats={[
    {number: '120+', label: 'Participants'},
    {number: '$25K', label: 'Raised'}
  ]}
>
  <svelte:fragment slot="actions">
    <Button variant="primary">Primary Action</Button>
    <Button variant="secondary">Secondary Action</Button>
  </svelte:fragment>
</PageHero>
```

### Specialized Components (`specialized/`)

Purpose-built components for specific functionality:

#### CountdownTimer (`specialized/CountdownTimer.svelte`)

Live countdown timer for the tournament date.

**Props:**

- `targetDate`: Date - countdown target
- `title`: string (default: "Tournament Countdown")

**Usage:**

```svelte
<CountdownTimer
  targetDate={new Date("2026-06-12T12:00:00-05:00")}
  title="Tournament Countdown"
/>
```

## Import Patterns

### Individual Imports

```svelte
import Button from '$lib/components/ui/Button.svelte';
import Card from '$lib/components/ui/Card.svelte';
```

### Bulk Imports

```svelte
import { Button, Card, Form, Input, PageHero, CountdownTimer } from '$lib/components';
```

## Design Principles

### Consistency

- All components use the same CSS custom properties defined in `src/app.css`
- Consistent naming conventions for props and slots
- Standardized color variants (primary, secondary, accent)

### Flexibility

- Components accept multiple variants for different use cases
- Slot-based architecture allows for flexible content composition
- Props provide fine-grained control over appearance and behavior

### Accessibility

- Proper semantic HTML structure
- ARIA attributes where appropriate
- Keyboard navigation support
- Focus management

### Responsiveness

- Mobile-first design approach
- Flexible grid systems
- Responsive typography using clamp()

## Benefits of This Architecture

1. **Reduced Code Duplication**: Common patterns are centralized
2. **Consistent UI/UX**: Shared components ensure visual consistency
3. **Easier Maintenance**: Updates to components affect all usage automatically
4. **Faster Development**: Pre-built components speed up new page creation
5. **Better Testing**: Components can be tested in isolation
6. **Improved Performance**: Smaller bundle sizes through reuse

## Migration Guide

When converting existing pages to use these components:

1. **Identify Patterns**: Look for repeated HTML structures
2. **Replace Gradually**: Start with simple components like Button
3. **Update Imports**: Add component imports to page script
4. **Remove Redundant CSS**: Delete unused styles after component adoption
5. **Test Thoroughly**: Verify functionality hasn't changed

## Future Enhancements

Potential additions to this component library:

- Modal/Dialog component
- Loading/Spinner component
- Navigation breadcrumbs
- Data table component
- Image gallery component
- Toast notification system
