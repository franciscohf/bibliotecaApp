# Design Guidelines — BIBLAPP

## Purpose

Define the comprehensive visual and architectural UI/UX standards for the **BIBLAPP** Angular application using **Angular Material 3** (M3), custom design tokens, responsive typography, and consistent component states.

---

# Theme

* **Theme Specification**: Angular Material 3 (`@use '@angular/material' as mat; mat.theme(...)`)
* **Theme Type**: Light theme default (`color-scheme: light;`) with design support for high contrast and dark tokens.
* **Primary Palette**: `mat.$azure-palette` (Azure / Electric Blue: `#0284c7` primary, `#0369a1` dark variant)
* **Secondary Palette**: Slate / Cool Gray (`#475569`, `#334155`) for secondary controls and subtle actions.
* **Tertiary Palette**: `mat.$blue-palette` (Deep Sky Blue `#2563eb`)
* **Surface Colors**: `var(--mat-sys-surface)` (`#ffffff`), `var(--mat-sys-surface-container)` (`#f8fafc`)
* **Density**: `0` (comfortable spacing compliant with desktop and touch interfaces)

---

# Color Palette

## Brand Colors

| Token | Hex | Role | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `#0284c7` / `#0ea5e9` | Brand Primary | Main action buttons, active navigation indicators, active tabs, header icons. |
| **Primary Dark** | `#0369a1` | Focus / Hover | Button hover states, counter badge text. |
| **Secondary** | `#475569` | Supporting | Secondary icon buttons, table header text, count badges. |
| **Accent / Tertiary**| `#2563eb` | Accent Highlights | Selected date ranges, active toggle switches. |

## Semantic Colors

Status badges, alerts, chips, and feedback banners follow unified color schemes:

| State | Background | Text Color | Border Color | Components / Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Success / Activo / Completada** | `#e8f5e9` | `#2e7d32` | `#c8e6c9` | `chip-completada`, `chip-active`, success notifications |
| **Warning / Pendiente** | `#fef3c7` | `#b45309` | `#fde68a` | `chip-pendiente`, observation banners |
| **Info / Confirmada** | `#e0f2fe` | `#0369a1` | `#bae6fd` | `chip-confirmada`, search counters, category badges |
| **Error / Cancelada / Delete** | `#fee2e2` | `#b91c1c` | `#fecaca` | `chip-cancelada`, error banner, delete button, invalid alerts |

## Neutral Colors

| Token | Value | Application |
| :--- | :--- | :--- |
| **App Background** | `#f8fafc` | General view background |
| **Card Surface** | `#ffffff` | Content containers, dialog bodies, tab containers |
| **Header Surface** | `#fafafa` | Table headers, filter toolbar backgrounds |
| **Border / Divider** | `#e2e8f0` / `#f0f0f0` | Card borders, table cell lines, dialog headers |
| **Text Primary** | `#0f172a` / `#1e293b` | Main headings, table primary text, dialog titles |
| **Text Secondary** | `#64748b` | Subtitles, labels, metadata, inactive icons |
| **Text Muted** | `#94a3b8` | Placeholders, empty state illustrations, disabled icons |

---

# Typography

* **Font Family**: `'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
* **Monospace**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` (for IDs, ISBNs, Cédulas)

### Hierarchy

| Element | Size | Weight | Line Height | Color | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Page Title (`h2`)** | `1.5rem` (24px) | `600` / `700` | `1.3` | `#0f172a` | Main card header with icon |
| **Section Title (`h3`)**| `1.15rem` (18px) | `600` | `1.4` | `#1e293b` | Results header, modal subtitles |
| **Dialog Title (`h2`)** | `1.25rem` (20px) | `600` | `1.3` | `#0f172a` | Modal dialog headers |
| **Subtitle / Hint** | `0.875rem` (14px)| `400` | `1.4` | `#64748b` | Description below page titles |
| **Body Medium** | `0.95rem` (15px) | `400` / `500` | `1.5` | `#1e293b` | Table content, dialog text |
| **Labels / Captions** | `0.75rem` (12px) | `600` | `1.2` | `#64748b` | Form field hints, uppercase metadata labels |
| **Badges / Chips** | `0.75rem` (12px) | `600` | `1.0` | Variant | Status chips, category tags |
| **Buttons** | `0.875rem` (14px)| `600` | `1.0` | Inherit | Action buttons, CTA labels |

---

# Spacing & Layout

## Spacing Scale

* **`0.25rem` (4px)**: Micro gap between icons and badge text.
* **`0.5rem` (8px)**: Gap in title groups, button icon spacing.
* **`0.75rem` (12px)**: Card padding compact, chips spacing.
* **`1rem` (16px)**: Standard gap between form fields, dialog actions padding.
* **`1.5rem` (24px)**: Container padding, table header padding, grid gap.
* **`2rem` (32px)**: Header horizontal padding, empty state vertical margins.

## Layout Containers

* **Max Width**:
  * Tables / Master Lists: `1200px` - `1280px` centered (`margin: 0 auto;`).
  * Search View: `1400px` centered.
  * Form / Edit Cards: `800px` centered.
* **Border Radius**:
  * Content Cards: `12px`
  * Tabs / Modals / Input Fields: `8px`
  * Book Cover Thumbnails: `4px`
  * Status Chips / Pill Counters: `16px` - `20px`
* **Elevation / Shadows**:
  * Cards: `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);`
  * Dialogs: Standard Material 3 dialog elevation with backdrop overlay (`rgba(0, 0, 0, 0.32)`).
  * Table Hover Rows: Flat background transition (`#f8fafc`).

## Responsive Breakpoints

* **Mobile (`< 600px`)**: Single column form layouts, stacked actions, horizontal scroll tables (`.table-responsive`).
* **Tablet (`600px – 960px`)**: 2-column grid for filters, drawer sidenav in toggle mode.
* **Desktop (`> 960px`)**: Full multi-column grid, fixed width columns, persistent sidenav.

---

# Angular Material Components

## 1. Buttons

* **Primary Actions (`mat-flat-button color="primary"`)**: Height `44px` - `48px`, border-radius `8px`, font-weight `600`, icon gap `0.5rem`.
* **Secondary / Reset (`mat-stroked-button`)**: Border `#cbd5e1`, text `#64748b`.
* **Table Action Buttons (`mat-icon-button`)**: Minimal footprint, primary or warn color, wrapped with `matTooltip` and descriptive `aria-label`.

## 2. Form Fields (`mat-form-field`)

* **Appearance**: `outline` across all modules.
* **Subscript Sizing**: `dynamic` for clean alignments without empty helper text whitespace.
* **Prefix / Suffix**: `matPrefix` icons (`search`, `badge`, `person`) and `matIconSuffix` datepicker toggles.
* **Signals Form Integration**: Bound reactively to Signal Models via `@angular/forms/signals` or model signals.

## 3. Cards (`mat-card`)

* Styled with `.content-card`: `border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; overflow: hidden;`.

## 4. Dialogs (`MatDialog`)

* Standard width: `750px` - `800px`.
* Layout: Flexbox header with icon and close button, scrollable `mat-dialog-content` (max height `75vh`), and `mat-dialog-actions align="end"`.

## 5. Tables (`mat-table`)

* Wrapped in `.table-responsive` with `overflow-x: auto;`.
* Class `.modern-table`: `width: 100%; border-collapse: collapse;`.
* Features: Row hover transitions (`background-color 0.2s ease`), column width specifiers (`.th-id`, `.th-actions`), sortable headers with `matSort`.

## 6. Navigation (`mat-sidenav` & `mat-toolbar`)

* Toolbar with elevation, logo brand, responsive menu trigger button, and user menu dropdown.
* Side navigation drawer with active state highlight (`.active { background-color: #dcdcdcc1; }`) and Material icons.

## 7. Snackbars & Notifications

* Configured via `NotificationService` + `MatSnackBar`.
* Standard duration: `3000ms`, `horizontalPosition: 'right'`, `verticalPosition: 'top'`.

## 8. Progress Indicators (`mat-progress-bar`)

* Indeterminate mode positioned directly below headers or at card top edges to signify asynchronous operations without blocking the screen.

---

# Component States

* **Default**: Clean white surface with subtle `#e2e8f0` border.
* **Hover**:
  * Table rows highlight to `#f8fafc`.
  * Buttons slightly elevate or darken tone.
* **Focus**: Accessible outline ring (`outline: 2px solid #0284c7; outline-offset: 2px;`).
* **Active / Selected**: Distinct background tint with matching high-contrast text.
* **Disabled**: `opacity: 0.6; cursor: not-allowed;` with neutral gray background.
* **Loading**: Top `mat-progress-bar` indeterminate, buttons disabled during saving.
* **Empty / Fallback**: Centered icon (`search_off`, `menu_book`), title `h4`, subtitle, and friendly hint text (`.empty-state`, `.prompt-state`).

---

# Accessibility (a11y)

* **Contrast Ratios**: All text and chip combinations comply with WCAG 2.1 AA standards (minimum contrast 4.5:1 for body, 3:1 for large headings).
* **Keyboard Navigation**: Native tab ordering across tabs, inputs, datepickers, buttons, and dialogs.
* **Focus Indicators**: Preserved `:focus-visible` outlines on interactive controls.
* **Screen Reader Support**: All icon-only buttons include `aria-label` (e.g. `aria-label="Ver Detalle"`, `aria-label="Cerrar"`).
* **Semantic Structure**: Proper HTML5 tags (`<main>`, `<header>`, `<table>`, `<h2>`, `<button>`).

---

# Design Principles

1. **Visual Consistency**: Every module (Categoría, Cliente, Libro, Reserva, Búsqueda) shares the identical card header anatomy, button heights, table borders, and chip aesthetics.
2. **Reusability**: Shared components (`ConfirmDialogComponent`, `NotificationService`, `GenericService`) provide single sources of truth.
3. **Reactive State**: Angular Signals (`signal`, `computed`, `effect`) and HTTP resources power fast, flicker-free UI updates.
4. **Responsiveness**: Fluid layout grids adapt seamlessly from mobile viewports to widescreen displays.
5. **Material 3 Compliance**: Full alignment with Google's Material 3 token specifications and component conventions.
