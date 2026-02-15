

# Rebrand: "Periodic Table of Estate Planning Elements" to "The Estate Planning Blueprint"

## New Concept

**The Estate Planning Blueprint™** -- Your strategies are the building blocks of a comprehensive plan. The interactive grid becomes a "Blueprint" where each tile represents a strategy component, organized by category (Charitable, Personal, Qualified). This metaphor is professional, intuitive, and fits the financial services brand without referencing the periodic table.

- **Nav label**: "Blueprint"
- **Page title**: "The Estate Planning Blueprint™"
- **Hero tagline**: "Build Your Estate Planning Blueprint™"
- **Subtitle**: "Discover the building blocks of a comprehensive estate plan."

## Files to Update

### 1. Navigation and Routes
- **`src/components/Layout.tsx`** -- Change nav label from "Periodic Table" to "Blueprint"; update route path from `/periodic-table` to `/blueprint`
- **`src/App.tsx`** -- Update route path from `/periodic-table` to `/blueprint`; rename the imported page component accordingly

### 2. Main Grid Page
- **`src/pages/PeriodicTable.tsx`** -- Rename file to `Blueprint.tsx`; update page title to "The Estate Planning Blueprint™"; update subtitle copy

### 3. Home / Landing Page
- **`src/pages/Index.tsx`** -- Replace hero heading with "Build Your Estate Planning Blueprint™"; update CTA button text from "Explore the Table" to "Explore the Blueprint"; update link from `/periodic-table` to `/blueprint`

### 4. Footer
- **`src/components/Footer.tsx`** -- Change brand name from "Estate Planning Elements™" to "Estate Planning Blueprint™"; update footer link label and path; update copyright line

### 5. Legal Pages
- **`src/pages/Disclaimer.tsx`** -- Replace all references to "Periodic Table of Estate Planning Elements™" with "Estate Planning Blueprint™"
- **`src/pages/Terms.tsx`** -- Same replacement in Sections 1 and 5
- **`src/pages/Privacy.tsx`** -- Update any references if present

### 6. Data File
- **`src/data/estatePlanningElements.ts`** -- No structural changes needed (the type/data names are internal and don't surface to users), but comments like "Charitable Planning Tools (Blue)" remain accurate

## What Stays the Same
- The interactive grid layout, category colors, filtering, and detail dialogs remain identical
- The route for `/assessment`, `/recommendations`, and all other pages are unchanged
- Internal code identifiers (type names, variable names) stay as-is to minimize risk

