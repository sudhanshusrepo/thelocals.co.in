-- Create offers table
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED', 'FREE')),
    discount_value NUMERIC NOT NULL DEFAULT 0,
    max_uses INTEGER,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    location_constraints JSONB -- Array of valid pin codes or city names
);

-- Create user_offers table to track usage
CREATE TABLE IF NOT EXISTS public.user_offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE,
    used_at TIMESTAMPTZ DEFAULT NOW(),
    booking_id UUID REFERENCES public.bookings(id)
);

-- Enable RLS
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_offers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Offers are viewable by everyone" ON public.offers
    FOR SELECT USING (true);

CREATE POLICY "Users can view their own offer usage" ON public.user_offers
    FOR SELECT USING (auth.uid() = user_id);

-- Insert the Beta Launch Offer
INSERT INTO public.offers (code, title, description, discount_type, discount_value, max_uses, location_constraints)
VALUES (
    'BETA_FREE_AC',
    'Free AC Service (Beta)',
    'Free AC servicing for our first 100 users in Gurgaon & Delhi!',
    'FREE',
    0,
    100,
    '["122001", "122002", "122018", "110001", "110002", "110003"]' -- Example pin codes
);
