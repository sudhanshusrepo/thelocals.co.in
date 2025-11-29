---
description: AI-Enhanced Booking Flow Sprint Implementation
---

# AI-Enhanced Booking Flow Sprint

## Sprint Goal
Replace the current 2×3 category layout with a 3×2 category grid inside a thin light-green 3D box, make the header text less dominant, and implement a full "category → schedule service → confirm & book" flow that supports user input (text/audio/video), auto-transcription via Gemini, generated checkbox findings, pricing estimate, and provider matching.

---

## High-Level Flow Sequence

1. **Landing (Home)** shows 3×2 categories in a thin light-green 3D box; header text reduced visually.
2. **User taps category** → navigate to `/schedule?category=<slug>`.
3. **Schedule page** shows service types for that category in a 4-per-row card grid (cards same style as categories).
4. **Footer chat interface** lets the user input requirements using: Text, Audio (≤1min), Video (≤30s).
5. **Client uploads media** to backend; backend calls Gemini (speech->text).
6. **Backend NLP extracts** 3–7 findings → returns them as pre-checked checkboxes.
7. **Client shows checkboxes**; user can toggle; changes update pricing in real time.
8. **Once satisfied**, user presses Estimate → server returns total estimate.
9. **Footer chat replaced** by Book Now button (sticky). On Book Now, server starts provider matching and booking process, returning booking id + provider details when found.

---

## Implementation Tasks

### Phase 1: UI Updates (Home & Header)

#### Task 1.1: Update HomePage Layout (3×2 Grid)
**File:** `packages/client/components/HomePage.tsx`
- Change grid from `grid-cols-2 md:grid-cols-3` to `grid-cols-3 md:grid-cols-3`
- Add light-green 3D box container around category grid
- Apply subtle 3D shadow effects using Tailwind
- Ensure responsive design maintains 3×2 on mobile (2 rows, 3 cols)

#### Task 1.2: Reduce Header Text Dominance
**File:** `packages/client/components/Header.tsx`
- Reduce font size of header title from current to smaller
- Reduce padding/height of header
- Make header more subtle with lighter colors
- Maintain brand visibility while being less prominent

#### Task 1.3: Create 3D Box Component
**File:** `packages/client/components/CategoryBox3D.tsx` (new)
- Create reusable 3D box component with light-green theme
- Use CSS transforms for 3D effect
- Add subtle animations on hover
- Make it responsive

---

### Phase 2: Schedule Page Implementation

#### Task 2.1: Create Schedule Page Route
**File:** `packages/client/App.tsx`
- Add new route `/schedule` with query param support
- Handle category parameter from URL
- Integrate with existing routing structure

#### Task 2.2: Build Schedule Page Component
**File:** `packages/client/components/SchedulePage.tsx` (new)
- Display service types for selected category
- 4-per-row card grid layout
- Cards styled similar to category cards
- Click handler to select service type
- Show selected service in footer chat

#### Task 2.3: Service Type Data Structure
**File:** `packages/client/constants.ts`
- Add service type definitions for each category
- Map categories to their service types
- Include icons, descriptions, and pricing ranges

---

### Phase 3: Footer Chat Interface

#### Task 3.1: Create Chat Input Component
**File:** `packages/client/components/ChatInput.tsx` (new)
- Text input with rich text support
- Audio recording button (max 1 min)
- Video recording button (max 30s)
- File upload progress indicator
- Input validation and error handling

#### Task 3.2: Audio Recording Implementation
**File:** `packages/client/hooks/useAudioRecorder.ts` (new)
- Use Web Audio API / MediaRecorder
- 60-second time limit with countdown
- Audio format: WebM or MP3
- Playback preview before upload
- Cancel/retry functionality

#### Task 3.3: Video Recording Implementation
**File:** `packages/client/hooks/useVideoRecorder.ts` (new)
- Use MediaRecorder API
- 30-second time limit with countdown
- Video format: WebM
- Preview before upload
- Cancel/retry functionality

#### Task 3.4: Media Upload Handler
**File:** `packages/client/services/mediaUploadService.ts` (new)
- Upload to Supabase Storage
- Progress tracking
- Error handling and retry logic
- File size validation
- Format validation

---

### Phase 4: Backend API Endpoints

#### Task 4.1: Upload Media Endpoint
**File:** `supabase/functions/upload-media/index.ts` (new)
- Accept audio/video files
- Store in Supabase Storage
- Return file URL and metadata
- Validate file size and format
- Security: check authentication

#### Task 4.2: Transcription Endpoint
**File:** `supabase/functions/transcribe-media/index.ts` (new)
- Accept media file URL
- Call Gemini API for speech-to-text
- Support audio and video formats
- Return transcribed text
- Handle errors gracefully

#### Task 4.3: Extract Findings Endpoint
**File:** `supabase/functions/extract-findings/index.ts` (new)
- Accept transcribed text + service category
- Use Gemini NLP to extract 3-7 findings
- Return findings as checkbox items
- All checkboxes pre-checked by default
- Include confidence scores

#### Task 4.4: Estimate Pricing Endpoint
**File:** `supabase/functions/estimate-pricing/index.ts` (new)
- Accept selected findings + service type
- Calculate dynamic pricing based on findings
- Use Gemini for intelligent pricing
- Return itemized cost breakdown
- Include total estimate

#### Task 4.5: Find Providers Endpoint
**File:** `supabase/functions/find-providers/index.ts` (new)
- Accept location + service category + requirements
- Query providers from database
- Use geospatial matching
- Return top 5 providers with ratings
- Include availability status

#### Task 4.6: Book Service Endpoint
**File:** `supabase/functions/book-service/index.ts` (new)
- Accept booking details + selected provider
- Create booking record in database
- Notify provider via push/SMS
- Return booking ID and confirmation
- Handle race conditions (provider already booked)

---

### Phase 5: Client State Management

#### Task 5.1: Booking Flow State Machine
**File:** `packages/client/hooks/useBookingFlow.ts` (new)
- States: idle → uploading → transcribing → findings → estimate → booking → confirmed
- State transitions with validation
- Error state handling
- Progress tracking
- Cancellation support

#### Task 5.2: Findings Checkbox Component
**File:** `packages/client/components/FindingsCheckbox.tsx` (new)
- Display 3-7 findings as checkboxes
- All pre-checked by default
- Toggle functionality
- Real-time pricing update on toggle
- Visual feedback for changes

#### Task 5.3: Pricing Display Component
**File:** `packages/client/components/PricingEstimate.tsx` (new)
- Show itemized cost breakdown
- Highlight total estimate
- Update in real-time as checkboxes change
- Show confidence level
- "Get Estimate" CTA button

#### Task 5.4: Booking CTA Component
**File:** `packages/client/components/BookingCTA.tsx` (new)
- Replace footer chat after estimate accepted
- Sticky "Book Now" button
- Loading state during provider matching
- Success state with provider details
- Error handling

---

### Phase 6: Gemini Integration

#### Task 6.1: Update Gemini Service for Transcription
**File:** `packages/core/services/geminiService.ts`
- Add `transcribeAudio()` function
- Add `transcribeVideo()` function
- Handle different audio/video formats
- Error handling and fallbacks
- Rate limiting

#### Task 6.2: NLP Findings Extraction
**File:** `packages/core/services/geminiService.ts`
- Add `extractFindings()` function
- Parse text to identify 3-7 key findings
- Return structured findings with confidence
- Category-specific extraction logic
- Fallback to rule-based extraction

#### Task 6.3: Dynamic Pricing Algorithm
**File:** `packages/core/services/pricingService.ts` (new)
- Base pricing per service type
- Multipliers based on findings
- Complexity scoring
- Urgency factor
- Location-based adjustments
- Sample implementation with real data

---

### Phase 7: Testing & Quality

#### Task 7.1: Unit Tests
- Test audio/video recording hooks
- Test state machine transitions
- Test pricing calculations
- Test findings extraction
- Test media upload service

#### Task 7.2: Integration Tests
- Test full booking flow end-to-end
- Test Gemini API integration
- Test Supabase Edge Functions
- Test file upload to storage
- Test provider matching

#### Task 7.3: E2E Tests
**File:** `tests/e2e/booking-flow.spec.ts` (new)
- Test complete user journey
- Test text input flow
- Test audio input flow
- Test video input flow
- Test error scenarios

---

## Technical Specifications

### Media Constraints
- **Audio:** Max 1 minute, WebM/MP3 format, max 10MB
- **Video:** Max 30 seconds, WebM format, max 50MB
- **Text:** Max 2000 characters

### Findings Constraints
- **Min findings:** 3
- **Max findings:** 7
- **Default state:** All checked
- **Required fields:** description, confidence score

### Pricing Algorithm
```typescript
interface PricingInput {
  serviceType: string;
  findings: Finding[];
  urgency: 'low' | 'normal' | 'high';
  location: Coordinates;
}

interface PricingOutput {
  basePrice: number;
  findingsAdjustment: number;
  urgencyMultiplier: number;
  locationAdjustment: number;
  totalEstimate: number;
  breakdown: PriceItem[];
}
```

### State Machine
```
idle
  → uploading (media upload in progress)
    → transcribing (Gemini processing)
      → findings (show checkboxes, allow edits)
        → estimate (show pricing, "Book Now" appears)
          → booking (provider matching)
            → confirmed (booking created, show details)
```

---

## API Endpoints Summary

| Endpoint | Method | Purpose | Input | Output |
|----------|--------|---------|-------|--------|
| `/upload-media` | POST | Upload audio/video | File blob | File URL |
| `/transcribe-media` | POST | Speech-to-text | Media URL | Transcribed text |
| `/extract-findings` | POST | NLP extraction | Text + category | Findings array |
| `/estimate-pricing` | POST | Calculate cost | Findings + service | Price estimate |
| `/find-providers` | POST | Match providers | Location + service | Provider list |
| `/book-service` | POST | Create booking | Booking details | Booking ID |

---

## Dependencies

### New NPM Packages
- None required (using native Web APIs)

### Supabase Configuration
- Enable Storage bucket for media files
- Configure CORS for file uploads
- Set up Edge Functions deployment
- Configure Gemini API key in environment

### Environment Variables
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_GEMINI_API_KEY=AIzaSy... # Move to Edge Function
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... # For Edge Functions
```

---

## Success Criteria

1. ✅ 3×2 category grid with light-green 3D box
2. ✅ Reduced header text prominence
3. ✅ Schedule page with 4-per-row service grid
4. ✅ Footer chat with text/audio/video input
5. ✅ Audio recording (≤1min) with upload
6. ✅ Video recording (≤30s) with upload
7. ✅ Gemini transcription working
8. ✅ 3-7 findings extracted and displayed
9. ✅ Real-time pricing updates on checkbox toggle
10. ✅ "Book Now" CTA appears after estimate
11. ✅ Provider matching and booking creation
12. ✅ Booking confirmation with provider details
13. ✅ All tests passing
14. ✅ Error handling for all edge cases

---

## Timeline Estimate

- **Phase 1 (UI Updates):** 4 hours
- **Phase 2 (Schedule Page):** 6 hours
- **Phase 3 (Footer Chat):** 8 hours
- **Phase 4 (Backend APIs):** 12 hours
- **Phase 5 (State Management):** 8 hours
- **Phase 6 (Gemini Integration):** 6 hours
- **Phase 7 (Testing):** 8 hours

**Total:** ~52 hours (1.5 weeks for single developer)

---

## Notes

- Existing AI booking flow can be refactored to use new endpoints
- Current `ServiceRequestPage` can be deprecated or merged
- Maintain backward compatibility during transition
- Consider feature flags for gradual rollout
- Monitor Gemini API usage and costs
- Implement rate limiting to prevent abuse
