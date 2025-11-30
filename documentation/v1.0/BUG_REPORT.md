# Bug Report & Improvements

**Date:** November 30, 2025  
**Version:** v0.9 (Pre-v1.0)

---

## 🔴 Critical Bugs

### 1. Location Permission Persistence
- **Issue:** User is prompted for location permission every time they visit the Service Request page or click "Book Now".
- **Impact:** Poor UX, friction in booking flow.
- **Fix:** Cache permission status and last known coordinates in `localStorage`.

### 2. Live Search Simulation
- **Issue:** `LiveSearch.tsx` uses `setTimeout` to simulate finding a provider. It does not actually search for providers in the backend or use real geolocation matching.
- **Impact:** Misleading user experience; functionality is not "real".
- **Fix:** Integrate with Supabase geospatial queries to find actual nearby providers.

### 3. Missing Provider App Features
- **Issue:** Provider app lacks the "Accept Booking" -> "Navigate" flow.
- **Impact:** Providers cannot fulfill the "Uber-like" experience.
- **Fix:** Implement map view and navigation integration in Provider App.

---

## 🟡 Improvements (UX/UI)

### 1. Service Grid Layout
- **Current:** 2 columns on mobile.
- **Required:** 3 columns on mobile (dense layout).
- **Action:** Optimize card sizing for 3-column mobile grid.

### 2. Loading States
- **Current:** Basic spinners or text.
- **Required:** "Cool processing style" / Liveliness.
- **Action:** Implement skeleton screens and animated transitions.

### 3. Offers Section
- **Current:** Hardcoded static banner.
- **Required:** Dynamic, location-aware offers.
- **Action:** Implement logic to check user pin code against "Gurgaon/Delhi" list.

---

## 🟢 Code Quality

### 1. Hardcoded Values
- **Issue:** Offer codes and logic are hardcoded in components.
- **Fix:** Move business logic (offers, pricing rules) to a configuration file or database table.

### 2. Type Safety
- **Issue:** Some `any` types used in error handling and API responses.
- **Fix:** Define strict interfaces for all API responses.

---

**Status:** Documented. Prioritized for v1.0 Sprints.
