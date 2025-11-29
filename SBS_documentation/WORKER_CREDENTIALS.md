# Test Worker Credentials

This document contains login credentials for 5 test worker profiles created for production workflow testing.

## Important Notes

- All workers are **verified** and **active**, ready to accept bookings
- Workers are positioned around the default center location (37.7749, -122.4194)
- Each worker has a service radius allowing them to receive nearby booking requests
- All workers use the same password for testing convenience: `Worker@123`

---

## Worker Profiles

### 1. Rajesh Kumar - Plumber
- **Email:** `rajesh.plumber@thelokals.com`
- **Password:** `Worker@123`
- **Phone:** +91 9876543210
- **Category:** Plumber
- **Experience:** 8 years
- **Service Radius:** 15 km
- **Rating:** 4.5/5.0
- **Total Jobs:** 156
- **Total Earnings:** ₹1,25,000
- **Location:** 37.7749°N, -122.4194°W (Default Center)
- **Bio:** Experienced plumber with 8+ years in residential and commercial plumbing. Expert in leak repairs, installations, and emergency services.

---

### 2. Amit Sharma - Electrician
- **Email:** `amit.electrician@thelokals.com`
- **Password:** `Worker@123`
- **Phone:** +91 9876543211
- **Category:** Electrician
- **Experience:** 6 years
- **Service Radius:** 12 km
- **Rating:** 4.7/5.0
- **Total Jobs:** 203
- **Total Earnings:** ₹1,80,000
- **Location:** 37.7799°N, -122.4194°W (North of center)
- **Bio:** Certified electrician specializing in home wiring, appliance installation, and electrical repairs. Available for emergency calls.

---

### 3. Suresh Patel - Carpenter
- **Email:** `suresh.carpenter@thelokals.com`
- **Password:** `Worker@123`
- **Phone:** +91 9876543212
- **Category:** Carpenter
- **Experience:** 10 years
- **Service Radius:** 10 km
- **Rating:** 4.8/5.0
- **Total Jobs:** 289
- **Total Earnings:** ₹2,50,000
- **Location:** 37.7749°N, -122.4144°W (East of center)
- **Bio:** Master carpenter with expertise in custom furniture, door/window installation, and furniture repair. Quality workmanship guaranteed.

---

### 4. Priya Singh - Maid Service
- **Email:** `priya.maid@thelokals.com`
- **Password:** `Worker@123`
- **Phone:** +91 9876543213
- **Category:** Maid Service
- **Experience:** 5 years
- **Service Radius:** 8 km
- **Rating:** 4.6/5.0
- **Total Jobs:** 412
- **Total Earnings:** ₹1,95,000
- **Location:** 37.7699°N, -122.4194°W (South of center)
- **Bio:** Professional house cleaning service with 5 years experience. Reliable, trustworthy, and detail-oriented. Available for daily or part-time work.

---

### 5. Vikram Reddy - Mechanic
- **Email:** `vikram.mechanic@thelokals.com`
- **Password:** `Worker@123`
- **Phone:** +91 9876543214
- **Category:** Mechanic
- **Experience:** 12 years
- **Service Radius:** 20 km
- **Rating:** 4.9/5.0
- **Total Jobs:** 567
- **Total Earnings:** ₹4,50,000
- **Location:** 37.7749°N, -122.4244°W (West of center)
- **Bio:** Expert auto mechanic with 12+ years experience. Specializing in all car brands, general service, repairs, and diagnostics. Mobile service available.

---

## How to Use

### For Testing Booking Flow:

1. **Client Side (Customer):**
   - Go to the client app (thelokals.com)
   - Search for services near the default location (37.7749, -122.4194)
   - Create a booking for any of the categories above
   - The booking should be matched with nearby workers

2. **Provider Side (Worker):**
   - Go to the provider app (pro.thelokals.com)
   - Sign in with any of the credentials above
   - You should see incoming booking requests
   - Accept/reject bookings to test the workflow

### Database Setup:

Run the SQL script `scripts/seed-workers.sql` in your Supabase SQL Editor to create these workers.

**Note:** The script uses `ON CONFLICT DO NOTHING` so it's safe to run multiple times.

---

## Testing Scenarios

### Scenario 1: Nearby Worker Discovery
- Create a booking near coordinates (37.7749, -122.4194)
- All 5 workers should be within range
- System should find and notify appropriate workers based on category

### Scenario 2: Category-Specific Matching
- Request a Plumber → Should match with Rajesh Kumar
- Request an Electrician → Should match with Amit Sharma
- Request a Carpenter → Should match with Suresh Patel
- Request Maid Service → Should match with Priya Singh
- Request a Mechanic → Should match with Vikram Reddy

### Scenario 3: Service Radius Testing
- Create bookings at different distances from each worker
- Verify workers only receive requests within their service radius
- Vikram (20km radius) should receive the most distant requests
- Priya (8km radius) should have the smallest coverage area

### Scenario 4: Multiple Worker Response
- Create a booking that multiple workers can accept
- Test the first-come-first-served or assignment logic
- Verify other workers are notified when booking is accepted

---

## Database Verification

After running the seed script, verify workers with this SQL query:

```sql
SELECT 
  p.full_name,
  p.email,
  p.category,
  p.is_verified,
  p.is_active,
  p.rating_average,
  p.service_radius_km,
  ST_AsText(p.operating_location::geometry) as location
FROM public.providers p
WHERE p.email LIKE '%@thelokals.com'
ORDER BY p.category, p.full_name;
```

---

## Troubleshooting

### Workers Not Appearing in Search:
- Verify `is_active = true` and `is_verified = true`
- Check that `operating_location` is properly set with PostGIS
- Ensure the search location is within the worker's `service_radius_km`

### Cannot Login:
- Verify the auth.users record was created
- Check that `email_confirmed_at` is set (not null)
- Ensure the password was properly encrypted with `crypt()`

### Bookings Not Matching:
- Verify the `category` field matches exactly (case-sensitive)
- Check the `find_nearby_providers` function is working
- Ensure RLS policies allow the queries

---

## Security Note

**⚠️ IMPORTANT:** These are test credentials for development/testing only. 
- Do NOT use these in production
- Change all passwords before going live
- Implement proper authentication flows
- Remove or deactivate test accounts in production

---

Last Updated: 2025-01-29
