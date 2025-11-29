# Worker Registration Summary

## Overview
I've created a comprehensive SQL script and documentation to register 5 test worker profiles for production workflow testing.

## Files Created

### 1. `scripts/seed-workers.sql`
A complete SQL script that creates:
- 5 auth users in `auth.users` table
- 5 profile records in `public.profiles` table  
- 5 provider records in `public.providers` table

**Key Features:**
- Uses `ON CONFLICT DO NOTHING` for safe re-runs
- Properly encrypts passwords using PostgreSQL's `crypt()` function
- Sets up PostGIS geography points for location-based matching
- Includes verification query at the end

### 2. `WORKER_CREDENTIALS.md`
Comprehensive documentation including:
- Login credentials for all 5 workers
- Detailed profile information
- Testing scenarios
- Troubleshooting guide
- Database verification queries

## Worker Profiles Created

| # | Name | Category | Email | Phone | Rating | Jobs | Earnings |
|---|------|----------|-------|-------|--------|------|----------|
| 1 | Rajesh Kumar | Plumber | rajesh.plumber@thelokals.com | +91 9876543210 | 4.5 | 156 | ₹1,25,000 |
| 2 | Amit Sharma | Electrician | amit.electrician@thelokals.com | +91 9876543211 | 4.7 | 203 | ₹1,80,000 |
| 3 | Suresh Patel | Carpenter | suresh.carpenter@thelokals.com | +91 9876543212 | 4.8 | 289 | ₹2,50,000 |
| 4 | Priya Singh | Maid Service | priya.maid@thelokals.com | +91 9876543213 | 4.6 | 412 | ₹1,95,000 |
| 5 | Vikram Reddy | Mechanic | vikram.mechanic@thelokals.com | +91 9876543214 | 4.9 | 567 | ₹4,50,000 |

**Common Password:** `Worker@123` (for all workers)

## Location Distribution

All workers are positioned around the default center (37.7749°N, 122.4194°W):
- **Rajesh (Plumber):** Center location, 15km radius
- **Amit (Electrician):** North of center, 12km radius
- **Suresh (Carpenter):** East of center, 10km radius
- **Priya (Maid):** South of center, 8km radius
- **Vikram (Mechanic):** West of center, 20km radius

This distribution ensures:
- Coverage of different areas
- Testing of proximity-based matching
- Validation of service radius logic

## How to Execute

### Step 1: Run the SQL Script
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `scripts/seed-workers.sql`
4. Execute the script

### Step 2: Verify Creation
Run this query to confirm workers were created:

```sql
SELECT 
  p.full_name,
  p.email,
  p.category,
  p.is_verified,
  p.is_active,
  p.rating_average
FROM public.providers p
WHERE p.email LIKE '%@thelokals.com'
ORDER BY p.category;
```

### Step 3: Test Login
1. Go to provider app (pro.thelokals.com)
2. Use any of the credentials from `WORKER_CREDENTIALS.md`
3. Verify you can sign in successfully

## Testing Workflow

### Client Side (Customer Creates Booking):
1. Go to client app
2. Set location near (37.7749, -122.4194)
3. Search for a service (e.g., "Plumber")
4. Create a booking with AI or manual flow
5. Booking should be created and matched to nearby workers

### Provider Side (Worker Receives Booking):
1. Sign in as one of the test workers
2. Should see incoming booking notification
3. Can accept or reject the booking
4. Test the complete booking lifecycle

## Database Tables Populated

### `auth.users`
- 5 user accounts with encrypted passwords
- Email confirmed and ready to use
- Metadata includes role: "provider"

### `public.profiles`
- Basic user information
- Phone numbers and contact details
- Linked to auth.users via UUID

### `public.providers`
- Complete provider profiles
- Geographic location using PostGIS
- Service radius for proximity matching
- Verification status: all verified
- Active status: all active
- Realistic ratings and job history

## Important Notes

### ✅ Ready for Production Testing:
- All workers are **verified** (`is_verified = true`)
- All workers are **active** (`is_active = true`)
- Proper geographic coordinates set
- Service radius configured
- Can receive booking requests immediately

### ⚠️ Security Considerations:
- These are TEST credentials only
- All use the same password for convenience
- Should NOT be used in actual production
- Delete or deactivate before going live

### 🔧 Customization:
To modify worker details:
1. Edit `scripts/seed-workers.sql`
2. Change names, emails, locations, etc.
3. Re-run the script (safe due to `ON CONFLICT DO NOTHING`)

## Next Steps

1. **Execute the SQL script** in Supabase to create the workers
2. **Test the booking flow** from client to provider
3. **Verify notifications** are working
4. **Test acceptance/rejection** of bookings
5. **Validate proximity matching** with different locations

## Troubleshooting

### Workers not appearing in search:
- Check `is_active` and `is_verified` are both `true`
- Verify PostGIS extension is enabled
- Confirm `operating_location` is properly set

### Cannot login:
- Verify `email_confirmed_at` is not null
- Check password encryption worked
- Ensure auth.users record exists

### Bookings not matching:
- Verify category names match exactly
- Check service radius covers the booking location
- Confirm `find_nearby_providers` function exists

---

**Status:** ✅ Complete and ready for testing
**Commit:** Pushed to main branch
**Files:** `scripts/seed-workers.sql`, `WORKER_CREDENTIALS.md`
