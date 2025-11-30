-- ============================================================================
-- COMPLETE BACKEND SETUP SCRIPT
-- ============================================================================
-- This script consolidates all migrations and ensures the backend is ready
-- for the current application state including payment integration
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================================
-- PHASE 1: CORE SCHEMA (from 20250129000001_core_schema.sql)
-- ============================================================================

-- Service Categories Enum
DO $$ BEGIN
    CREATE TYPE service_category AS ENUM (
        'PLUMBER',
        'ELECTRICIAN',
        'CARPENTER',
        'PAINTER',
        'CLEANER',
        'GARDENER',
        'MECHANIC',
        'TUTOR',
        'BEAUTICIAN',
        'CHEF'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Provider Status Enum
DO $$ BEGIN
    CREATE TYPE provider_status AS ENUM (
        'ACTIVE',
        'INACTIVE',
        'SUSPENDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    name text NOT NULL,
    phone text,
    avatar_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Providers Table
CREATE TABLE IF NOT EXISTS public.providers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users NOT NULL,
    name text NOT NULL,
    category service_category NOT NULL,
    description text,
    price numeric(10, 2),
    price_unit text DEFAULT 'hour',
    rating numeric(3, 2) DEFAULT 0,
    review_count integer DEFAULT 0,
    status provider_status DEFAULT 'ACTIVE',
    image_url text,
    expertise text[],
    is_verified boolean DEFAULT false,
    location geography(Point, 4326),
    location_lat numeric(10, 6),
    location_lng numeric(10, 6),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id)
);

-- ============================================================================
-- PHASE 2: BOOKING SYSTEM (from 20250129000002_booking_system.sql)
-- ============================================================================

-- Booking Status Enum
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM (
        'PENDING',
        'CONFIRMED',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Booking Type Enum
DO $$ BEGIN
    CREATE TYPE booking_type AS ENUM (
        'AI_ENHANCED',
        'LIVE',
        'SCHEDULED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Payment Status Enum
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM (
        'PENDING',
        'PAID',
        'REFUNDED',
        'FAILED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Request Status Enum
DO $$ BEGIN
    CREATE TYPE request_status AS ENUM (
        'PENDING',
        'ACCEPTED',
        'REJECTED',
        'EXPIRED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id uuid REFERENCES auth.users NOT NULL,
    provider_id uuid REFERENCES public.providers,
    service_category text NOT NULL,
    booking_type booking_type DEFAULT 'SCHEDULED',
    status booking_status DEFAULT 'PENDING',
    
    -- User requirements and AI data
    requirements jsonb,
    ai_checklist text[],
    estimated_cost numeric(10, 2),
    final_cost numeric(10, 2),
    
    -- Scheduling
    scheduled_date timestamptz,
    started_at timestamptz,
    completed_at timestamptz,
    
    -- Location
    location geography(Point, 4326),
    address jsonb,
    
    -- Additional info
    notes text,
    payment_status payment_status DEFAULT 'PENDING',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Live Booking Requests Table
CREATE TABLE IF NOT EXISTS public.live_booking_requests (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id uuid REFERENCES public.bookings NOT NULL,
    provider_id uuid REFERENCES public.providers NOT NULL,
    status request_status DEFAULT 'PENDING',
    expires_at timestamptz NOT NULL,
    responded_at timestamptz,
    created_at timestamptz DEFAULT now(),
    UNIQUE(booking_id, provider_id)
);

-- Booking OTP Table
CREATE TABLE IF NOT EXISTS public.booking_otp (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id uuid REFERENCES public.bookings NOT NULL,
    otp_code text NOT NULL,
    is_verified boolean DEFAULT false,
    expires_at timestamptz NOT NULL,
    verified_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- PHASE 3: REVIEWS & RATINGS (from 20250129000003_reviews_ratings.sql)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id uuid REFERENCES public.bookings NOT NULL,
    worker_id uuid REFERENCES public.providers NOT NULL,
    user_id uuid REFERENCES auth.users NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(booking_id)
);

-- ============================================================================
-- PHASE 4: PAYMENT SYSTEM (from 20250130000001_payment_system.sql)
-- ============================================================================

-- Payment Method Enum
DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM (
        'BILLDESK',
        'PAYU',
        'UPI',
        'CARD'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Transaction Status Enum
DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM (
        'PENDING',
        'PROCESSING',
        'SUCCESS',
        'FAILED',
        'REFUNDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Payment Transactions Table
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id uuid REFERENCES public.bookings NOT NULL,
    amount numeric(10, 2) NOT NULL,
    payment_method payment_method NOT NULL,
    status transaction_status DEFAULT 'PENDING',
    
    -- Gateway details
    gateway_transaction_id text,
    gateway_response jsonb,
    
    -- Customer details
    customer_details jsonb,
    
    -- Refund details
    refund_amount numeric(10, 2),
    refund_reason text,
    refunded_at timestamptz,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

-- Providers
CREATE INDEX IF NOT EXISTS idx_providers_user ON public.providers(user_id);
CREATE INDEX IF NOT EXISTS idx_providers_category ON public.providers(category, status);
CREATE INDEX IF NOT EXISTS idx_providers_location ON public.providers USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_providers_rating ON public.providers(rating DESC, review_count DESC);

-- Bookings
CREATE INDEX IF NOT EXISTS idx_bookings_client ON public.bookings(client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON public.bookings(provider_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_bookings_location ON public.bookings USING GIST (location);

-- Live Booking Requests
CREATE INDEX IF NOT EXISTS idx_live_requests_provider ON public.live_booking_requests(provider_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_requests_booking ON public.live_booking_requests(booking_id);
CREATE INDEX IF NOT EXISTS idx_live_requests_expires ON public.live_booking_requests(expires_at) WHERE status = 'PENDING';

-- Booking OTP
CREATE INDEX IF NOT EXISTS idx_booking_otp_booking ON public.booking_otp(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_otp_code ON public.booking_otp(otp_code) WHERE is_verified = false;

-- Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_worker ON public.reviews(worker_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON public.reviews(booking_id);

-- Payment Transactions
CREATE INDEX IF NOT EXISTS idx_payment_transactions_booking ON public.payment_transactions(booking_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_method ON public.payment_transactions(payment_method);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_gateway_id ON public.payment_transactions(gateway_transaction_id) WHERE gateway_transaction_id IS NOT NULL;

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_providers_updated_at ON public.providers;
CREATE TRIGGER update_providers_updated_at 
    BEFORE UPDATE ON public.providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON public.payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at 
    BEFORE UPDATE ON public.payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update Provider Rating Function
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.providers
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM public.reviews
            WHERE worker_id = NEW.worker_id
        ),
        review_count = (
            SELECT COUNT(*)
            FROM public.reviews
            WHERE worker_id = NEW.worker_id
        )
    WHERE id = NEW.worker_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_provider_rating_trigger ON public.reviews;
CREATE TRIGGER update_provider_rating_trigger
    AFTER INSERT OR UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- Create AI Booking Function
CREATE OR REPLACE FUNCTION create_ai_booking(
    p_client_id uuid,
    p_service_category text,
    p_requirements jsonb,
    p_ai_checklist text[],
    p_estimated_cost numeric,
    p_location text,
    p_address jsonb,
    p_notes text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
    v_booking_id uuid;
BEGIN
    INSERT INTO public.bookings (
        client_id,
        service_category,
        booking_type,
        status,
        requirements,
        ai_checklist,
        estimated_cost,
        location,
        address,
        notes
    ) VALUES (
        p_client_id,
        p_service_category,
        'AI_ENHANCED',
        'PENDING',
        p_requirements,
        p_ai_checklist,
        p_estimated_cost,
        ST_GeomFromText(p_location, 4326),
        p_address,
        p_notes
    )
    RETURNING id INTO v_booking_id;
    
    RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Find Nearby Providers Function
CREATE OR REPLACE FUNCTION find_nearby_providers(
    service_id text,
    lat numeric,
    lng numeric,
    max_distance numeric DEFAULT 10000
)
RETURNS TABLE (
    id uuid,
    name text,
    category service_category,
    rating numeric,
    review_count integer,
    distance numeric
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.category,
        p.rating,
        p.review_count,
        ST_Distance(
            p.location,
            ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
        ) as distance
    FROM public.providers p
    WHERE 
        p.status = 'ACTIVE'
        AND p.category::text = service_id
        AND ST_DWithin(
            p.location,
            ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
            max_distance
        )
    ORDER BY distance ASC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Accept Booking Function
CREATE OR REPLACE FUNCTION accept_booking(
    booking_id uuid,
    provider_id uuid
)
RETURNS jsonb AS $$
DECLARE
    v_result jsonb;
BEGIN
    -- Update booking
    UPDATE public.bookings
    SET 
        provider_id = accept_booking.provider_id,
        status = 'CONFIRMED'
    WHERE id = accept_booking.booking_id
    AND status = 'PENDING';
    
    -- Update live request if exists
    UPDATE public.live_booking_requests
    SET 
        status = 'ACCEPTED',
        responded_at = now()
    WHERE 
        booking_id = accept_booking.booking_id
        AND provider_id = accept_booking.provider_id;
    
    -- Reject other pending requests
    UPDATE public.live_booking_requests
    SET 
        status = 'REJECTED',
        responded_at = now()
    WHERE 
        booking_id = accept_booking.booking_id
        AND provider_id != accept_booking.provider_id
        AND status = 'PENDING';
    
    v_result := jsonb_build_object(
        'success', true,
        'booking_id', accept_booking.booking_id,
        'provider_id', accept_booking.provider_id
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Payment Gateway Functions
CREATE OR REPLACE FUNCTION create_billdesk_payment(
    p_transaction_id uuid,
    p_amount numeric,
    p_customer_name text,
    p_customer_email text,
    p_customer_phone text
)
RETURNS jsonb AS $$
DECLARE
    v_payment_url text;
BEGIN
    UPDATE public.payment_transactions
    SET status = 'PROCESSING'
    WHERE id = p_transaction_id;
    
    v_payment_url := 'https://billdesk.com/payment?txnid=' || p_transaction_id::text || 
                     '&amount=' || p_amount::text ||
                     '&email=' || p_customer_email ||
                     '&phone=' || p_customer_phone;
    
    RETURN jsonb_build_object(
        'payment_url', v_payment_url,
        'transaction_id', p_transaction_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_payu_payment(
    p_transaction_id uuid,
    p_amount numeric,
    p_customer_name text,
    p_customer_email text,
    p_customer_phone text
)
RETURNS jsonb AS $$
DECLARE
    v_payment_url text;
BEGIN
    UPDATE public.payment_transactions
    SET status = 'PROCESSING'
    WHERE id = p_transaction_id;
    
    v_payment_url := 'https://secure.payu.in/_payment?txnid=' || p_transaction_id::text || 
                     '&amount=' || p_amount::text ||
                     '&email=' || p_customer_email ||
                     '&phone=' || p_customer_phone;
    
    RETURN jsonb_build_object(
        'payment_url', v_payment_url,
        'transaction_id', p_transaction_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_upi_payment(
    p_transaction_id uuid,
    p_amount numeric,
    p_customer_phone text
)
RETURNS jsonb AS $$
DECLARE
    v_upi_intent_url text;
BEGIN
    UPDATE public.payment_transactions
    SET status = 'PROCESSING'
    WHERE id = p_transaction_id;
    
    v_upi_intent_url := 'upi://pay?pa=merchant@upi&pn=TheLokals&am=' || p_amount::text ||
                        '&tn=Payment for booking ' || p_transaction_id::text || '&cu=INR';
    
    RETURN jsonb_build_object(
        'upi_intent_url', v_upi_intent_url,
        'transaction_id', p_transaction_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION verify_payment_callback(
    p_transaction_id uuid,
    p_gateway_txn_id text,
    p_status text,
    p_gateway_response jsonb
)
RETURNS boolean AS $$
DECLARE
    v_booking_id uuid;
    v_success boolean;
BEGIN
    SELECT booking_id INTO v_booking_id
    FROM public.payment_transactions
    WHERE id = p_transaction_id;
    
    IF v_booking_id IS NULL THEN
        RETURN false;
    END IF;
    
    v_success := (p_status = 'success' OR p_status = 'SUCCESS');
    
    UPDATE public.payment_transactions
    SET 
        status = CASE WHEN v_success THEN 'SUCCESS'::transaction_status ELSE 'FAILED'::transaction_status END,
        gateway_transaction_id = p_gateway_txn_id,
        gateway_response = p_gateway_response,
        updated_at = now()
    WHERE id = p_transaction_id;
    
    IF v_success THEN
        UPDATE public.bookings
        SET payment_status = 'PAID'
        WHERE id = v_booking_id;
    END IF;
    
    RETURN v_success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_otp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Providers Policies
DROP POLICY IF EXISTS "Anyone can view active providers" ON public.providers;
CREATE POLICY "Anyone can view active providers"
    ON public.providers FOR SELECT
    USING (status = 'ACTIVE' OR user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their provider profile" ON public.providers;
CREATE POLICY "Users can manage their provider profile"
    ON public.providers FOR ALL
    USING (user_id = auth.uid());

-- Bookings Policies
DROP POLICY IF EXISTS "Users can view their bookings" ON public.bookings;
CREATE POLICY "Users can view their bookings"
    ON public.bookings FOR SELECT
    USING (
        client_id = auth.uid() 
        OR provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
CREATE POLICY "Users can create bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (client_id = auth.uid());

DROP POLICY IF EXISTS "Providers can update their bookings" ON public.bookings;
CREATE POLICY "Providers can update their bookings"
    ON public.bookings FOR UPDATE
    USING (
        provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid())
        OR client_id = auth.uid()
    );

-- Payment Transactions Policies
DROP POLICY IF EXISTS "Users can view their payment transactions" ON public.payment_transactions;
CREATE POLICY "Users can view their payment transactions"
    ON public.payment_transactions FOR SELECT
    USING (
        booking_id IN (
            SELECT id FROM public.bookings 
            WHERE client_id = auth.uid() OR provider_id IN (
                SELECT id FROM public.providers WHERE user_id = auth.uid()
            )
        )
    );

DROP POLICY IF EXISTS "System can insert payment transactions" ON public.payment_transactions;
CREATE POLICY "System can insert payment transactions"
    ON public.payment_transactions FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "System can update payment transactions" ON public.payment_transactions;
CREATE POLICY "System can update payment transactions"
    ON public.payment_transactions FOR UPDATE
    USING (true);

-- Reviews Policies
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view reviews"
    ON public.reviews FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can create reviews for their bookings" ON public.reviews;
CREATE POLICY "Users can create reviews for their bookings"
    ON public.reviews FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        AND booking_id IN (SELECT id FROM public.bookings WHERE client_id = auth.uid())
    );

-- ============================================================================
-- REALTIME SETUP
-- ============================================================================

-- Enable realtime for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_booking_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_transactions;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Uncomment to verify setup
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
-- SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION' ORDER BY routine_name;
