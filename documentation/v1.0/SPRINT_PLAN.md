# v1.0 Sprint Plan

**Goal:** Launch Beta with "First 100 Users" Offer and Real-time Booking Experience.

---

## 📅 Sprint 1: Foundation & UI Polish
**Focus:** Responsiveness, Location Caching, Offers System

### Tasks
1.  **Responsiveness Fix (High Priority)**
    - Update `HomePage` service grid to 3 columns on mobile.
    - Optimize card styling for dense layout.
2.  **Location Intelligence**
    - Update `useGeolocation` to implement caching (localStorage).
    - Implement reverse geocoding (Coords -> Pin Code).
3.  **Offers System**
    - Create `offers` table in Supabase.
    - Implement "Gurgaon/Delhi Beta" logic.
    - Update Home Screen banner to be dynamic.
4.  **UI Liveliness**
    - Add `framer-motion` (or similar).
    - Add hover effects and micro-interactions.

---

## 📅 Sprint 2: Real-time Booking (Client Side)
**Focus:** Live Search, Map Integration

### Tasks
1.  **Map Integration**
    - Install Leaflet (react-leaflet) or Google Maps.
    - Replace `LiveSearch` pulse animation with real Map view.
2.  **Real-time Logic**
    - Update `bookingService` to query nearby providers (Geospatial).
    - Implement "Scanning" animation on the map.
3.  **Booking State Management**
    - Handle "Searching" -> "Provider Found" -> "Accepted" states via Supabase Realtime.

---

## 📅 Sprint 3: Provider Experience
**Focus:** Provider App, Navigation, Verification

### Tasks
1.  **Booking Acceptance**
    - Create "Incoming Request" screen for providers.
    - Show estimated earnings and distance.
2.  **Navigation**
    - Integrate map view in Provider App.
    - Show route to client location upon acceptance.
3.  **Verification System**
    - Implement PIN generation on Client side.
    - Implement PIN entry screen on Provider side.
    - Update database to handle verification status.

---

## 📅 Sprint 4: Testing & Launch
**Focus:** E2E Testing, Bug Fixes, Deployment

### Tasks
1.  **E2E Testing**
    - Update tests for new flows (Map, PIN).
    - Test "First 100" offer logic.
2.  **Performance Tuning**
    - Optimize map loading.
    - Minimize bundle size.
3.  **Deployment**
    - Deploy Client to Vercel (Production).
    - Build Mobile App (Android/iOS).

---

**Next Step:** Begin Sprint 1.
