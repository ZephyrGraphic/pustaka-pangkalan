---
name: Pustaka Pangkalan Digital Library
colors:
  surface: '#f6fbf2'
  surface-dim: '#d7dbd3'
  surface-bright: '#f6fbf2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f5ed'
  surface-container: '#ebefe7'
  surface-container-high: '#e5eae1'
  surface-container-highest: '#dfe4dc'
  on-surface: '#181d18'
  on-surface-variant: '#434840'
  inverse-surface: '#2d322c'
  inverse-on-surface: '#eef2ea'
  outline: '#73796f'
  outline-variant: '#c3c8bd'
  surface-tint: '#486643'
  primary: '#244021'
  on-primary: '#ffffff'
  primary-container: '#3b5836'
  on-primary-container: '#abcda2'
  inverse-primary: '#aed0a5'
  secondary: '#596059'
  on-secondary: '#ffffff'
  secondary-container: '#dbe2d8'
  on-secondary-container: '#5d645d'
  tertiary: '#383b3a'
  on-tertiary: '#ffffff'
  tertiary-container: '#4f5251'
  on-tertiary-container: '#c2c5c3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#caecbf'
  primary-fixed-dim: '#aed0a5'
  on-primary-fixed: '#052105'
  on-primary-fixed-variant: '#314e2d'
  secondary-fixed: '#dee4db'
  secondary-fixed-dim: '#c1c8c0'
  on-secondary-fixed: '#171d18'
  on-secondary-fixed-variant: '#424842'
  tertiary-fixed: '#e1e3e1'
  tertiary-fixed-dim: '#c5c7c5'
  on-tertiary-fixed: '#191c1b'
  on-tertiary-fixed-variant: '#444746'
  background: '#f6fbf2'
  on-background: '#181d18'
  surface-variant: '#dfe4dc'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 20px
---

## Brand & Style

The design system is crafted for a village digital library, balancing professional utility with community warmth. The brand personality is **trustworthy, accessible, and grounded**, aiming to evoke a sense of digital empowerment within a rural context.

The aesthetic follows a **Modern Material 3** foundation, enhanced by **Glassmorphic accents** and **Soft Shadows**. This creates a "Modern Pastoral" atmosphere—clean and efficient like a high-end SaaS tool, but softened by organic color palettes and translucent layers that suggest openness and light. High-quality whitespace and a restricted color palette ensure the UI remains legible and unintimidating for users of all digital literacy levels.

## Colors

The color palette is derived from nature to resonate with a village environment while maintaining a digital-first clarity.

- **Primary (Army Green):** Used for key actions, active states, and brand-heavy components. It represents stability and growth.
- **Secondary (Olive Gray):** Utilized for muted accents, secondary buttons, and inactive icons to provide visual hierarchy without clutter.
- **Background (Sage White):** The primary canvas color. It provides a softer, more comfortable reading experience than pure white.
- **Dark Elements (Deep Slate):** Reserved for primary text and high-emphasis UI borders to ensure maximum legibility and contrast.

## Typography

This design system utilizes **Plus Jakarta Sans** across all levels. Its soft, rounded terminals and modern proportions provide the perfect bridge between a friendly community vibe and a professional application.

- **Headlines:** Use Bold (700) weights with slightly tighter letter spacing to create a strong visual anchor for content sections.
- **Body Text:** Use Regular (400) weight for long-form reading (book descriptions, news). Ensure a minimum of 14px for accessibility.
- **Labels:** Use Medium (500) weight in all-caps for category tags or metadata to differentiate from body text.

## Layout & Spacing

The design system employs a **Fluid Grid** model optimized for mobile-first consumption.

- **Mobile (360dp - 428dp):** 4-column grid with 20px side margins and 16px gutters.
- **Tablet (600dp+):** 8-column grid with 32px side margins.

Spacing follows a strict 4px base unit. Component internal padding should prioritize `md` (16px) for touch targets and `sm` (8px) for grouping related items. Large vertical gaps between sections should use `xl` (32px) to maintain a clean, airy feel.

## Elevation & Depth

This design system uses a combination of **Tonal Layers** and **Glassmorphism** to establish hierarchy.

1.  **Level 0 (Base):** Sage White background.
2.  **Level 1 (Cards/Lists):** Surface-colored containers with a subtle 1px border (#8E958D at 10% opacity) and a very soft, diffused shadow (0px 4px 20px, 4% black).
3.  **Level 2 (Glass Accents):** Bottom navigation bars and floating headers use a backdrop-blur (20px) with a semi-transparent Sage White (85% opacity) fill.
4.  **Level 3 (Modals/FABs):** These use the Primary Army Green or pure Sage White with a more pronounced shadow to indicate higher elevation and immediate action.

## Shapes

The shape language is consistently **Rounded**, reflecting the approachability of the "Plus Jakarta Sans" typeface.

- **Standard Elements:** Buttons, text fields, and list items use `rounded` (0.5rem).
- **Large Elements:** Book covers, hero cards, and modal containers use `rounded-lg` (1rem).
- **Specialty Elements:** Search bars and floating action buttons (FABs) use `rounded-xl` (1.5rem) or full pill-shapes to draw attention to interactive entry points.

## Components

### Buttons
- **Primary:** Solid Army Green with White text. High-emphasis actions.
- **Secondary:** Olive Gray at 15% opacity with Dark Slate text. For "Cancel" or secondary navigation.
- **Tertiary:** Ghost style, text-only with Army Green coloring.

### Cards (Book & Content)
- Use Level 1 Elevation. Image/Cover at the top with `rounded-lg` corners. Titles should use `title-md` and secondary info in `label-md`.

### Input Fields
- Outlined style using Olive Gray borders. Upon focus, the border shifts to Army Green (2px thickness). Labels should sit on the border (Material 3 style).

### Chips/Tags
- Small, `rounded-xl` containers. Use Olive Gray (10% opacity) for categories (e.g., "History," "Agriculture").

### Lists
- Clean, edge-to-edge separators using a thin Olive Gray line (10% opacity). Use 16px horizontal padding.

### Navigation Bar
- Glassmorphic style with 20px backdrop-blur. Active icons are Army Green; inactive icons are Olive Gray.