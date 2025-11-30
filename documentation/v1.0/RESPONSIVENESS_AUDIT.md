# Responsiveness Audit & Plan

**Date:** November 30, 2025  
**Focus:** Mobile Optimization & Service Grid Layout

---

## 1. Current State Analysis

### 1.1 Service Category Grid (HomePage)
- **Current Implementation:**
  ```tsx
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
  ```
  - **Mobile:** 2 columns
  - **Desktop:** 3 columns

- **User Requirement:**
  - **Mobile:** 3 columns ("3 in a row")
  - **Total:** 2 rows (6 items total)

- **Issue:**
  - 3 columns on a standard mobile screen (e.g., 375px width) allows only ~115px per column (including gaps).
  - Current cards have padding `p-3`, icon size `w-14 h-14`.
  - **Risk:** Content might look cramped or overflow.

### 1.2 Other Components
- **How It Works:** `grid-cols-1 md:grid-cols-3` (Vertical stack on mobile). **Status: Good.**
- **Sticky Chat CTA:** Fixed position. **Status: Good.**
- **Modals:** Centered with max-width. **Status: Good.**

---

## 2. Proposed Solution for Service Grid

To achieve 3 columns on mobile without breaking the layout:

### 2.1 CSS Grid Update
```tsx
<div className="grid grid-cols-3 gap-2 sm:gap-4">
```

### 2.2 Component Styling Adjustments (Mobile Only)
- **Padding:** Reduce from `p-3` to `p-1.5` or `p-2`.
- **Icon Size:** Reduce from `w-14 h-14` to `w-10 h-10` or `w-12 h-12`.
- **Font Size:**
  - Title: `text-[10px]` or `text-xs`.
  - Helper Text: Hide on mobile or limit to 1 line.
- **Gap:** Reduce grid gap to `gap-2`.

### 2.3 Mockup (Code)
```tsx
<button className="
    flex flex-col items-center p-2
    rounded-xl
    ...
">
    <div className="w-10 h-10 ... text-xl ...">
        {icon}
    </div>
    <h3 className="text-xs font-bold ... leading-tight mt-1">
        {name}
    </h3>
    {/* Hide helper text on very small screens if needed */}
    <p className="text-[10px] hidden xs:block ...">
        {helperText}
    </p>
</button>
```

---

## 3. Implementation Plan

### Step 1: Update HomePage.tsx
- Change grid definition to `grid-cols-3`.
- Apply conditional sizing classes (`w-10 md:w-14`, `text-xs md:text-sm`).

### Step 2: Verify on Mobile Viewport
- Test on 320px (iPhone SE), 375px (iPhone X), 390px (iPhone 12).
- Ensure no horizontal scrolling.
- Ensure touch targets are accessible (>44px height).

### Step 3: Global Responsiveness Check
- Audit `ServiceRequestPage` form elements.
- Audit `Profile` page tables/lists.
- Audit `BookingConfirmation` details view.

---

**Status:** Plan Ready. To be executed in Sprint 1.
