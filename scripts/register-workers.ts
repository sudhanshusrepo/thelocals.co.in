/**
 * Worker Registration Script
 * 
 * This script creates 5 test worker accounts using Supabase Auth API
 * Run with: npx tsx scripts/register-workers.ts
 * 
 * Prerequisites:
 * - Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment
 * - Or create a .env file in the root directory
 */

import { createClient } from '@supabase/supabase-js';

// You need to set these environment variables or replace with actual values
const supabaseUrl = process.env.SUPABASE_URL || 'https://gdnltvvxiychrsdzenia.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required!');
    console.log('Please set it in your environment or .env file');
    process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

interface WorkerData {
    id: string;
    email: string;
    password: string;
    fullName: string;
    phone: string;
    category: string;
    experienceYears: number;
    latitude: number;
    longitude: number;
    serviceRadiusKm: number;
    rating: number;
    totalJobs: number;
    totalEarnings: number;
    bio: string;
}

const workers: WorkerData[] = [
    {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'rajesh.plumber@thelokals.com',
        password: 'Worker@123',
        fullName: 'Rajesh Kumar',
        phone: '+919876543210',
        category: 'Plumber',
        experienceYears: 8,
        latitude: 37.7749,
        longitude: -122.4194,
        serviceRadiusKm: 15,
        rating: 4.5,
        totalJobs: 156,
        totalEarnings: 125000,
        bio: 'Experienced plumber with 8+ years in residential and commercial plumbing. Expert in leak repairs, installations, and emergency services.'
    },
    {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'amit.electrician@thelokals.com',
        password: 'Worker@123',
        fullName: 'Amit Sharma',
        phone: '+919876543211',
        category: 'Electrician',
        experienceYears: 6,
        latitude: 37.7799,
        longitude: -122.4194,
        serviceRadiusKm: 12,
        rating: 4.7,
        totalJobs: 203,
        totalEarnings: 180000,
        bio: 'Certified electrician specializing in home wiring, appliance installation, and electrical repairs. Available for emergency calls.'
    },
    {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'suresh.carpenter@thelokals.com',
        password: 'Worker@123',
        fullName: 'Suresh Patel',
        phone: '+919876543212',
        category: 'Carpenter',
        experienceYears: 10,
        latitude: 37.7749,
        longitude: -122.4144,
        serviceRadiusKm: 10,
        rating: 4.8,
        totalJobs: 289,
        totalEarnings: 250000,
        bio: 'Master carpenter with expertise in custom furniture, door/window installation, and furniture repair. Quality workmanship guaranteed.'
    },
    {
        id: '44444444-4444-4444-4444-444444444444',
        email: 'priya.maid@thelokals.com',
        password: 'Worker@123',
        fullName: 'Priya Singh',
        phone: '+919876543213',
        category: 'Maid Service',
        experienceYears: 5,
        latitude: 37.7699,
        longitude: -122.4194,
        serviceRadiusKm: 8,
        rating: 4.6,
        totalJobs: 412,
        totalEarnings: 195000,
        bio: 'Professional house cleaning service with 5 years experience. Reliable, trustworthy, and detail-oriented. Available for daily or part-time work.'
    },
    {
        id: '55555555-5555-5555-5555-555555555555',
        email: 'vikram.mechanic@thelokals.com',
        password: 'Worker@123',
        fullName: 'Vikram Reddy',
        phone: '+919876543214',
        category: 'Mechanic',
        experienceYears: 12,
        latitude: 37.7749,
        longitude: -122.4244,
        serviceRadiusKm: 20,
        rating: 4.9,
        totalJobs: 567,
        totalEarnings: 450000,
        bio: 'Expert auto mechanic with 12+ years experience. Specializing in all car brands, general service, repairs, and diagnostics. Mobile service available.'
    }
];

async function createWorker(worker: WorkerData) {
    console.log(`\n📝 Creating worker: ${worker.fullName} (${worker.category})`);

    try {
        // Step 1: Create auth user
        console.log('  → Creating auth user...');
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: worker.email,
            password: worker.password,
            email_confirm: true,
            user_metadata: {
                full_name: worker.fullName,
                role: 'provider'
            }
        });

        if (authError) {
            if (authError.message.includes('already registered')) {
                console.log('  ⚠️  User already exists, skipping...');
                return { success: true, skipped: true };
            }
            throw authError;
        }

        const userId = authData.user?.id;
        if (!userId) {
            throw new Error('No user ID returned from auth creation');
        }

        console.log(`  ✅ Auth user created: ${userId}`);

        // Step 2: Create profile
        console.log('  → Creating profile...');
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                full_name: worker.fullName,
                phone: worker.phone,
                email: worker.email
            });

        if (profileError && !profileError.message.includes('duplicate')) {
            console.error('  ❌ Profile error:', profileError);
        } else {
            console.log('  ✅ Profile created');
        }

        // Step 3: Create provider record with PostGIS location
        console.log('  → Creating provider record...');

        // Use raw SQL for PostGIS geography insertion
        const { error: providerError } = await supabase.rpc('create_provider_with_location', {
            p_id: userId,
            p_full_name: worker.fullName,
            p_phone: worker.phone,
            p_email: worker.email,
            p_category: worker.category,
            p_experience_years: worker.experienceYears,
            p_longitude: worker.longitude,
            p_latitude: worker.latitude,
            p_service_radius_km: worker.serviceRadiusKm,
            p_is_verified: true,
            p_is_active: true,
            p_rating_average: worker.rating,
            p_total_jobs: worker.totalJobs,
            p_total_earnings: worker.totalEarnings,
            p_bio: worker.bio
        });

        if (providerError) {
            console.error('  ❌ Provider error:', providerError);
            // Try alternative method using direct insert
            console.log('  → Trying direct insert...');
            const { error: directError } = await supabase
                .from('providers')
                .insert({
                    id: userId,
                    full_name: worker.fullName,
                    phone: worker.phone,
                    email: worker.email,
                    category: worker.category,
                    experience_years: worker.experienceYears,
                    service_radius_km: worker.serviceRadiusKm,
                    is_verified: true,
                    is_active: true,
                    rating_average: worker.rating,
                    total_jobs: worker.totalJobs,
                    total_earnings: worker.totalEarnings,
                    bio: worker.bio
                });

            if (directError && !directError.message.includes('duplicate')) {
                throw directError;
            }
        }

        console.log('  ✅ Provider record created');
        console.log(`✅ Successfully created: ${worker.fullName}`);

        return { success: true, userId };
    } catch (error: any) {
        console.error(`❌ Failed to create ${worker.fullName}:`, error.message);
        return { success: false, error: error.message };
    }
}

async function main() {
    console.log('🚀 Starting worker registration...\n');
    console.log(`📍 Supabase URL: ${supabaseUrl}`);
    console.log(`👥 Workers to create: ${workers.length}\n`);

    const results = [];

    for (const worker of workers) {
        const result = await createWorker(worker);
        results.push({ worker: worker.fullName, ...result });

        // Small delay between creations
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));

    const successful = results.filter(r => r.success && !r.skipped).length;
    const skipped = results.filter(r => r.skipped).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`✅ Successfully created: ${successful}`);
    console.log(`⚠️  Skipped (already exist): ${skipped}`);
    console.log(`❌ Failed: ${failed}`);

    if (failed > 0) {
        console.log('\n❌ Failed workers:');
        results.filter(r => !r.success).forEach(r => {
            console.log(`  - ${r.worker}: ${r.error}`);
        });
    }

    console.log('\n' + '='.repeat(60));
    console.log('📋 CREDENTIALS');
    console.log('='.repeat(60));
    console.log('\nAll workers use the same password: Worker@123\n');

    workers.forEach(w => {
        console.log(`${w.fullName} (${w.category})`);
        console.log(`  Email: ${w.email}`);
        console.log(`  Phone: ${w.phone}`);
        console.log('');
    });

    console.log('✅ Registration complete!');
    console.log('\nNext steps:');
    console.log('1. Test login at pro.thelokals.com');
    console.log('2. Verify workers appear in database');
    console.log('3. Test booking flow from client app');
}

// Run the script
main().catch(console.error);
