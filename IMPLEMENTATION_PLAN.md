# Implementation Plan - Major Improvements

## Overview
This document outlines the implementation plan for major improvements to the Lokals Platform.

---

## Phase 1: Critical Fixes & Core Functionality (Week 1-2)

### 1.1 Geolocation API Integration ⚡ HIGH PRIORITY
**Status:** Not Started  
**Files to Modify:**
- `packages/client/components/ServiceRequestPage.tsx`
- `packages/client/App.tsx`

**Tasks:**
- [ ] Create geolocation hook (`useGeolocation.ts`)
- [ ] Add permission handling and error states
- [ ] Replace hardcoded `{ lat: 0, lng: 0 }` with real location
- [ ] Add fallback to IP-based geolocation
- [ ] Add location permission UI

**Estimated Time:** 4 hours

---

### 1.2 Complete Auth Flow (Remove GitHub SSO) ⚡ HIGH PRIORITY
**Status:** Not Started  
**Files to Modify:**
- `packages/client/components/AuthModal.tsx`
- `packages/provider/components/AuthModal.tsx`
- `packages/client/components/ServiceRequestPage.tsx`

**Tasks:**
- [ ] Remove GitHub OAuth provider
- [ ] Keep only Email/Password and Magic Link
- [ ] Add auth modal trigger when user not logged in
- [ ] Implement proper auth state handling
- [ ] Add loading states and error messages

**Estimated Time:** 6 hours

---

### 1.3 Define Proper Database Response Interfaces ⚡ HIGH PRIORITY
**Status:** Not Started  
**Files to Modify:**
- `packages/core/types.ts`
- `packages/core/services/bookingService.ts`
- `packages/core/services/workerService.ts`
- `packages/core/services/liveBookingService.ts`

**Tasks:**
- [ ] Create `DatabaseResponses.ts` with all DB response types
- [ ] Replace all `any` types in bookingService
- [ ] Replace all `any` types in workerService
- [ ] Replace all `any` types in liveBookingService
- [ ] Add Supabase query result types

**Estimated Time:** 8 hours

---

## Phase 2: Architecture & Security (Week 2-3)

### 2.1 Move Gemini API to Supabase Edge Functions 🔒 SECURITY
**Status:** Not Started  
**New Files:**
- `supabase/functions/estimate-service/index.ts`
- `supabase/functions/interpret-search/index.ts`

**Files to Modify:**
- `packages/core/services/geminiService.ts`
- `.env` (add Gemini API key to Supabase secrets)

**Tasks:**
- [ ] Create Edge Function for `estimateService`
- [ ] Create Edge Function for `interpretSearchQuery`
- [ ] Add Gemini API key to Supabase secrets
- [ ] Update client to call Edge Functions instead of direct API
- [ ] Add rate limiting
- [ ] Add error handling and logging

**Estimated Time:** 12 hours

---

### 2.2 Implement AppError Class & Global Error Boundary 🛡️ CRITICAL
**Status:** Not Started  
**New Files:**
- `packages/core/errors/AppError.ts`
- `packages/core/errors/ErrorBoundary.tsx`
- `packages/core/errors/errorHandler.ts`

**Files to Modify:**
- `packages/client/App.tsx`
- `packages/provider/App.tsx`
- All service files

**Tasks:**
- [ ] Create `AppError` class with error codes
- [ ] Create `ErrorBoundary` React component
- [ ] Create centralized error handler
- [ ] Add error logging service integration
- [ ] Update all services to use AppError
- [ ] Add user-friendly error messages

**Estimated Time:** 10 hours

---

## Phase 3: Build Optimization (Week 3-4)

### 3.1 Adopt Turborepo 🚀 OPTIMIZATION
**Status:** Not Started  
**New Files:**
- `turbo.json`
- `.turbo/` (gitignored)

**Files to Modify:**
- `package.json`
- `.gitignore`
- All package.json files

**Tasks:**
- [ ] Install Turborepo
- [ ] Create `turbo.json` configuration
- [ ] Define build pipeline
- [ ] Configure caching strategy
- [ ] Update npm scripts to use turbo
- [ ] Configure remote caching (optional)
- [ ] Update CI/CD to use Turborepo

**Estimated Time:** 6 hours

---

## Phase 4: Testing & Quality (Week 4-6)

### 4.1 Integration Tests for Booking Flow 🧪 TESTING
**Status:** Not Started  
**New Files:**
- `packages/core/services/__tests__/bookingFlow.integration.test.ts`
- `tests/fixtures/bookingData.ts`

**Tasks:**
- [ ] Set up integration test environment
- [ ] Create test fixtures for bookings
- [ ] Test complete booking creation flow
- [ ] Test booking status updates
- [ ] Test payment flow
- [ ] Test review submission
- [ ] Mock Supabase for integration tests

**Estimated Time:** 12 hours

---

### 4.2 E2E Tests for AI-Enhanced Booking 🤖 TESTING
**Status:** Not Started  
**New Files:**
- `tests/e2e/functional/ai-booking.spec.ts`
- `tests/e2e/fixtures/ai-responses.ts`

**Tasks:**
- [ ] Create Playwright test for AI booking flow
- [ ] Mock Gemini API responses
- [ ] Test service request page
- [ ] Test AI analysis display
- [ ] Test booking creation from AI analysis
- [ ] Test error scenarios

**Estimated Time:** 10 hours

---

### 4.3 Provider Dashboard Tests 📊 TESTING
**Status:** Not Started  
**New Files:**
- `tests/e2e/functional/provider-dashboard.spec.ts`
- `packages/provider/components/__tests__/ProviderDashboard.test.tsx`

**Tasks:**
- [ ] Create E2E tests for provider dashboard
- [ ] Test booking acceptance flow
- [ ] Test booking status updates
- [ ] Test earnings display
- [ ] Create unit tests for dashboard components

**Estimated Time:** 10 hours

---

### 4.4 Increase Test Coverage to 70%+ 📈 TESTING
**Status:** Not Started  
**Files to Create:**
- Multiple test files across all packages

**Tasks:**
- [ ] Fix all 6 failing test suites
- [ ] Add tests for all core services
- [ ] Add tests for all React components
- [ ] Add tests for all utilities
- [ ] Set up coverage reporting
- [ ] Add coverage gates to CI/CD

**Estimated Time:** 20 hours

---

## Phase 5: Accessibility (Week 6-7)

### 5.1 ARIA Labels & Keyboard Navigation 🦾 ACCESSIBILITY
**Status:** Not Started  
**Files to Modify:**
- All component files in `packages/client/components/`
- All component files in `packages/provider/components/`

**Tasks:**
- [ ] Audit all interactive elements
- [ ] Add ARIA labels to buttons, links, inputs
- [ ] Add ARIA roles where needed
- [ ] Implement keyboard navigation for modals
- [ ] Implement keyboard navigation for dropdowns
- [ ] Add focus management
- [ ] Test with screen readers
- [ ] Add skip-to-content links
- [ ] Ensure proper heading hierarchy

**Estimated Time:** 16 hours

---

## Summary

### Total Estimated Time: ~114 hours (~3 weeks of full-time work)

### Priority Order:
1. **Week 1-2:** Geolocation, Auth Flow, Database Interfaces
2. **Week 2-3:** Edge Functions, Error Handling
3. **Week 3-4:** Turborepo
4. **Week 4-6:** Testing (Integration, E2E, Coverage)
5. **Week 6-7:** Accessibility

### Dependencies:
- Edge Functions must be completed before removing client-side Gemini calls
- Error handling should be in place before extensive testing
- Turborepo can be done in parallel with testing

### Success Metrics:
- ✅ 100% test pass rate
- ✅ 70%+ code coverage
- ✅ 0 `any` types in core services
- ✅ All API keys server-side
- ✅ WCAG 2.1 AA compliance
- ✅ 50% faster build times with Turborepo

---

## Next Steps
1. Review and approve this plan
2. Start with Phase 1.1 (Geolocation)
3. Work through phases sequentially
4. Create feature branches for each major change
5. Review and merge incrementally
