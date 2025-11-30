# v1.0 Requirements Analysis

**Date:** November 30, 2025  
**Phase:** v1.0 Development  
**Focus:** Beta Launch, Location Intelligence, Real-time Booking, UI/UX Polish

---

## 1. Business Requirements

### 1.1 Beta Launch Offer (Gurgaon/Delhi)
- **Objective:** Acquire first 100 users in Gurgaon/Delhi NCR.
- **Offer:** Free AC Servicing.
- **Mechanism:**
  - Detect user location via Pin Code / Geolocation.
  - If Pin Code matches Gurgaon/Delhi list:
    - Unlock "Free AC Service" offer.
    - Display special banner on Home Screen.
  - Limit to first 100 users.

### 1.2 Real-time Booking Experience
- **Client Side:**
  - "Live Search" screen with map visualization.
  - "Scanning" animation showing search radius expanding.
  - Real-time status updates (Searching -> Provider Found -> Accepted).
  - PIN generation for service verification.
- **Provider Side:**
  - Receive booking request notification.
  - View booking details and estimated amount.
  - "Accept" action triggers navigation to user location.
  - Map view of user location upon acceptance.
  - PIN entry screen to start service.

### 1.3 Location Intelligence
- **Persistent Permissions:**
  - Cache location permission status.
  - Store last known location in local storage/cache.
  - Reduce repetitive permission prompts.
- **Mapping:**
  - Integrate map view for both Client (tracking provider) and Provider (navigating to client).

### 1.4 UI/UX "Liveliness"
- **Animations:**
  - Add micro-interactions (hover effects, button presses).
  - "Cool processing style" for loading states (e.g., AI thinking, searching).
  - Smooth transitions between screens.
- **Responsiveness:**
  - **Critical:** Mobile view must show **3 service category tiles per row** (currently 2).
  - Ensure 2 rows total (6 categories visible without scrolling).

---

## 2. Technical Analysis

### 2.1 Current State
- **Repo Structure:** Monorepo (Client, App, Provider, Core).
- **Frontend:** React (Vite) for Client, React Native (Expo) for App.
- **Backend:** Supabase (PostgreSQL, Realtime, Auth).
- **Location:** `useGeolocation` hook exists but lacks caching.
- **Booking:** `LiveSearch` exists but uses simulated timeouts. No real map integration yet.
- **Responsiveness:** `HomePage.tsx` uses `grid-cols-2` on mobile. Needs update to `grid-cols-3`.

### 2.2 Gap Analysis

| Feature | Current State | Required State | Effort |
|---------|---------------|----------------|--------|
| **Service Grid** | 2 cols mobile | 3 cols mobile | Low |
| **Location Cache** | No caching | Persistent cache | Low |
| **Beta Offer** | Static banner | Dynamic, location-based | Medium |
| **Live Map Search** | Simulated UI | Real map integration | High |
| **Provider Map** | Basic list | Map navigation | High |
| **Booking PIN** | Not implemented | Database & UI support | Medium |
| **Animations** | Basic CSS | Framer Motion / Reanimated | Medium |

---

## 3. Implementation Strategy

### 3.1 Location Service Upgrade
- Modify `useGeolocation` to check `localStorage` first.
- Implement reverse geocoding (Coords -> Pin Code) to validate Beta Offer eligibility.

### 3.2 Database Updates
- Add `pin_code` to `profiles` table.
- Add `verification_pin` to `bookings` table.
- Create `offers` table to track "First 100" usage.

### 3.3 UI Overhaul
- **Home Page:** Update grid layout, add dynamic banner.
- **Live Search:** Replace static pulse with Map component (Leaflet/Google Maps).
- **Animations:** Integrate animation library.

### 3.4 Provider Flow
- Update Provider App to handle "Accept" -> "Navigate" flow.
- Implement PIN verification screen.

---

## 4. Risks & Mitigation
- **Map API Costs:** Use OpenStreetMap/Leaflet for free tier, or optimize Google Maps usage.
- **Location Accuracy:** Handle edge cases where GPS is inaccurate.
- **Realtime Latency:** Optimize Supabase subscriptions.

---

**Next Steps:** Proceed to Sprint Planning.
