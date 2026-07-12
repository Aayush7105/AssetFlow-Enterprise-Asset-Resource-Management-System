# Frontend Design Choices

This document outlines the design conventions and UI patterns for the AssetFlow frontend application, based on the established implementations (e.g., the Login page).

## Core Philosophy
The application follows a clean, modern, and minimalist aesthetic, focusing on accessibility, usability, and a professional enterprise look.

## Technologies & Libraries
- **CSS Framework**: Tailwind CSS
- **Component Library**: [Shadcn UI](https://ui.shadcn.com/) (built on Radix UI)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Library**: [forgeui](https://pro.forgeui.in/)

## UI Patterns

### Layout & Containers
- **Cards**: Use Shadcn `Card`, `CardHeader`, `CardTitle`, `CardContent`, and `CardFooter` components for self-contained blocks of content (e.g., forms, settings, summaries).
- **Centering**: Center layout components using flexbox/grid utility classes (`flex`, `items-center`, `justify-center`, `justify-between`).

### Typography & Colors
- **Semantic Colors**: Use Tailwind's thematic color variables to support dynamic themes (Light/Dark mode):
  - `bg-background` for main page backgrounds.
  - `bg-card` for card backgrounds.
  - `text-foreground` for primary text.
  - `text-muted-foreground` for secondary/helper text.
  - `text-primary` for primary actions and links.
- **Typography**: Keep text clear and hierarchical (e.g., `text-2xl` for titles, `text-sm` for helper texts).

### Form Elements
- **Structure**: Forms must be built using `react-hook-form` and validated via `zod`.
- **Components**: Use Shadcn's `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, and `<FormMessage>`.
- **Inputs**: Use the standard `<Input>` component. Add visual feedback (e.g., disabled states during submission).
- **Buttons**: Use the Shadcn `<Button>` component. Ensure the button reflects loading states clearly (e.g., using `Loader2` from `lucide-react` with an `animate-spin` class and disabling the button).

### Interactivity & Feedback
- **Loading States**: Always provide immediate visual feedback on user actions. Use spinners on buttons during asynchronous operations.
- **Transitions**: Use interactive elements cautiously; hover states and transitions (e.g., `hover:underline`, `transition-colors`) should feel natural and subtle.
- **Accessibility**: Implement standard accessibility features. Ensure form fields are fully keyboard navigable. Use descriptive placeholders and associate labels correctly.

### Reusable Utilities
- **Routing**: Use `next/navigation` and manage routes through centralized constants (e.g., `ROUTES` object).
- **Validation Schemas**: Keep validation logic (Zod schemas) centralized and decoupled from the UI components.
