# Development Plan: Critical Bug Fixes & App Enhancements

**Date**: 2025-11-29
**Based on**: E2E Test Findings Report
**Goal**: Stabilize the application, unblock critical user flows, and pass E2E tests.

---

## 🚨 Section 1: Mandatory Bugs & Improvements (P0 - Critical)
*These issues block the primary user journey and must be resolved immediately.*

### 1. Homepage & Navigation
- **[BUG] Sign-In Button Missing**: The sign-in button is not rendering or is not selectable on the homepage.
  - *Fix*: Ensure the button renders correctly and add `data-testid="sign-in-button"`.
- **[BUG] Category Cards Unclickable**: Users cannot navigate to service pages.
  - *Fix*: Add `onClick` handlers and valid `href` links to category cards. Add `data-testid="category-card"`.
- **[BUG] Broken Routing**: Navigation to `/dashboard`, `/service-request`, and `/auth` fails.
  - *Fix*: Verify `react-router-dom` configuration and ensure routes are defined in `App.tsx`.

### 2. Authentication System
- **[BUG] Login Flow Broken**: The login modal/page does not appear or function.
  - *Fix*: Implement/Fix the `AuthModal` component and integrate with Supabase `auth.signInWithPassword`.
- **[BUG] Session Persistence**: Users are logged out on reload.
  - *Fix*: Ensure `AuthProvider` correctly handles `onAuthStateChange` and persists session tokens.
- **[BUG] Registration Flow**: New users cannot sign up.
  - *Fix*: Connect registration form to Supabase `auth.signUp`.

### 3. API Integration
- **[BUG] API 404 Errors**: Critical endpoints (`/api/bookings`, `/api/providers`) return 404.
  - *Fix*: Ensure the API client base URL is correct and that backend endpoints (or mocks) exist for these routes.

---

## ⚠️ Section 2: Priority Bugs & Improvements (P1 - High)
*These issues affect core functionality but might have workarounds or secondary impacts.*

### 1. Booking Core
- **[IMP] Service Request Page**: The page for submitting details is missing or broken.
  - *Fix*: Implement `ServiceRequestPage.tsx` with form inputs for description and location.
- **[IMP] AI Integration**: AI analysis for cost/checklist is not connected.
  - *Fix*: Integrate `aiService.ts` with the frontend form to display results.
- **[IMP] Live Booking**: The "Find Provider" flow is non-functional.
  - *Fix*: Implement the matching logic and provider search state.

### 2. Provider & Dashboard
- **[BUG] Provider Search**: Search bar and filters do not return results.
  - *Fix*: Implement filtering logic in `ProviderSearch.tsx`.
- **[BUG] Dashboard Access**: Authenticated users cannot see their bookings.
  - *Fix*: Fetch and display user bookings in `UserDashboard.tsx`.

### 3. Quality of Life
- **[IMP] Form Validation**: No feedback for invalid emails or empty fields.
  - *Fix*: Add React Hook Form or manual validation states.
- **[IMP] Error Handling**: Network errors fail silently.
  - *Fix*: Add a global `Toast` or `Notification` system for errors.

---

## 📅 Section 3: Development Roadmap (Implementation Plan)

We will tackle these in **4 Sprints** to systematically clear the backlog.

### 🏃 Sprint 1: Foundation & Authentication (Immediate)
**Goal**: Users can see the homepage, log in, and navigate to protected routes.
1.  **Fix Homepage Rendering**: Ensure Sign-In button and Category Cards are visible and clickable (add `data-testid`).
2.  **Implement Auth Flow**: Fix `AuthModal`, connect Supabase Login/Signup, and ensure Session Persistence.
3.  **Fix Routing**: Ensure `/dashboard` and `/service/*` routes are accessible after login.

### 🏃 Sprint 2: Booking Engine (Next)
**Goal**: Users can create a booking using AI or Live search.
1.  **Service Request Page**: Build the form UI.
2.  **Connect AI Service**: Wire up `analyzeBooking` to the UI.
3.  **Live Booking Logic**: Implement the provider matching simulation/API call.

### 🏃 Sprint 3: Dashboards & Search
**Goal**: Users can manage bookings and find providers.
1.  **Provider Search**: Fix search bar and filters.
2.  **User Dashboard**: Display booking list and status.
3.  **Provider Dashboard**: Allow providers to see and accept jobs.

### 🏃 Sprint 4: Polish & Stability
**Goal**: App is robust, accessible, and handles errors gracefully.
1.  **Form Validation**: Add error messages and constraints.
2.  **Error Handling**: Add Toasts/Notifications.
3.  **Accessibility**: Fix ARIA labels and keyboard navigation (P2).

---

## 🛠️ Technical Strategy for Sprint 1

1.  **Analyze `App.tsx`**: Check route definitions.
2.  **Inspect `HomePage.tsx`**: Fix button rendering and links.
3.  **Audit `AuthProvider.tsx`**: Ensure session management is robust.
4.  **Verify `apiClient.ts`**: Check base URL and error interceptors.

---

**Ready to start Sprint 1?**
