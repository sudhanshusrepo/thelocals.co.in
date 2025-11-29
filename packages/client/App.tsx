
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter, Routes, Route, useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { WorkerCard } from './components/WorkerCard';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { UserDashboard, DashboardView } from './components/UserDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CATEGORY_ICONS, DEFAULT_CENTER, SERVICE_GROUPS, CATEGORY_DISPLAY_NAMES, LOWERCASE_TO_WORKER_CATEGORY } from './constants';
import { WorkerCategory, WorkerProfile, Coordinates } from '@core/types';
import { workerService } from '@core/services/workerService';
import { HomeSkeleton, SearchResultsSkeleton, BookingSkeleton, ProfileSkeleton } from './components/Skeleton';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import NoData from './components/NoData';
import { ServiceStructuredData } from './components/StructuredData';
import NotFound from './components/NotFound';
import LiveBooking from './components/LiveBooking';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { ServiceSelection } from './components/ServiceSelection';
import { LiveSearch } from './components/LiveSearch';
import { ServiceType } from '@core/types';

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const AuthRequiredPlaceholder: React.FC<{ onSignIn: () => void, view: string }> = ({ onSignIn, view }) => (
    <div className="text-center py-20 animate-fade-in">
        <div className="text-6xl mb-4">🔐</div>
        <h3 className="text-2xl font-bold dark:text-white">Authentication Required</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">Please sign in to view your {view.toLowerCase()}.</p>
        <button
            onClick={onSignIn}
            className="px-6 py-3 rounded-lg font-bold bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-md"
        >
            Sign In
        </button>
    </div>
);

const OfferBanner: React.FC = () => (
    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md shadow-md">
        <p className="font-bold">20% off cleaning services!</p>
        <p>Use code CLEAN20 at checkout.</p>
    </div>
);

const EmergencyBanner: React.FC = () => (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md shadow-md">
        <p className="font-bold">Emergency Help Needed?</p>
        <p>Call our 24/7 hotline at 1-800-123-4567.</p>
    </div>
);

const HomePage: React.FC<{
    handleCategorySelect: (category: WorkerCategory) => void,
    isLoading: boolean,
    setShowLiveBooking: (show: boolean) => void
}> = ({ handleCategorySelect, isLoading, setShowLiveBooking }) => {
    const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const initialCollapsedState = Object.keys(SERVICE_GROUPS).reduce((acc, groupName) => {
            acc[groupName] = false;
            return acc;
        }, {} as Record<string, boolean>);
        setCollapsedCategories(initialCollapsedState);
    }, []);

    const toggleCategory = (groupName: string) => {
        setCollapsedCategories(prev => ({ ...prev, [groupName]: !prev[groupName] }));
    }

    if (isLoading) {
        return <HomeSkeleton />;
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            <Helmet>
                <title>Thelokals.com - Find and Book Local Services</title>
                <meta name="description" content="Thelokals.com is your one-stop platform to find, book, and manage services from skilled local professionals. From cleaning to repairs, we connect you with the best experts in your neighborhood." />
            </Helmet>
            <div className="space-y-4">
                {Object.values(SERVICE_GROUPS).map((group) => (
                    <div key={group.name} className="rounded-2xl shadow-sm border dark:border-slate-700 bg-white dark:bg-slate-800 p-3 transition-all duration-300">
                        <button onClick={() => toggleCategory(group.name)} className="w-full flex justify-between items-center">
                            <h2 className="font-bold text-lg dark:text-white">{group.name}</h2>
                            <span className={`transform transition-transform duration-300 ${!collapsedCategories[group.name] ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{group.helperText}</p>
                        <div className={`grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4 transition-all duration-300 overflow-hidden ${collapsedCategories[group.name] ? 'max-h-0' : 'max-h-full'}`}>
                            {group.categories.map((cat) => (
                                <button
                                    onClick={() => handleCategorySelect(cat as WorkerCategory)}
                                    key={cat}
                                    className="flex flex-col items-center justify-center bg-white dark:bg-slate-700 p-2 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-600/50 transition-all duration-300 h-28 group shadow-[0_10px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.1)] hover:-translate-y-1 border border-slate-100 dark:border-slate-600"
                                >
                                    <span className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">{CATEGORY_ICONS[cat]}</span>
                                    <span className="text-xs font-bold text-center text-slate-600 dark:text-slate-300 group-hover:text-teal-600">{CATEGORY_DISPLAY_NAMES[cat]}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="py-8">
                <HowItWorks />
                <div className="my-8">
                    <OfferBanner />
                </div>
                <Features />
                <div className="my-8">
                    <EmergencyBanner />
                </div>
            </div>
            <div className="flex justify-center pb-8">
                <button onClick={() => setShowLiveBooking(true)} className="px-8 py-3 bg-teal-600 text-white font-bold rounded-full shadow-lg hover:bg-teal-700 transition-colors hover:shadow-xl transform hover:-translate-y-0.5">
                    Try Live Booking
                </button>
            </div>
        </div>
    );
};

const ServiceSelectionPage: React.FC<{
    userLocation: Coordinates,
    isLoading: boolean,
    onBook: (service: ServiceType) => void
}> = ({ userLocation, isLoading, onBook }) => {
    const { category } = useParams<{ category: string }>();
    const selectedCategory = category ? LOWERCASE_TO_WORKER_CATEGORY[category.toLowerCase()] : undefined;

    if (isLoading) {
        return <SearchResultsSkeleton />;
    }

    if (!selectedCategory) {
        return <NotFound />;
    }

    return (
        <div className="animate-fade-in">
            <Helmet>
                <title>Thelokals.com | Select Service</title>
                <meta name="description" content="Select a specific service to book instantly." />
            </Helmet>
            <ServiceSelection category={selectedCategory} onBook={onBook} />
        </div>
    );
};

const DashboardPage: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
    const { view } = useParams<{ view: DashboardView }>();
    const { user } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    if (isLoading) {
        return view === 'Bookings' ? <BookingSkeleton /> : <ProfileSkeleton />;
    }

    if (!user) {
        return <AuthRequiredPlaceholder onSignIn={() => setShowAuthModal(true)} view={view || 'Bookings'} />;
    }

    return <UserDashboard initialView={view || 'Bookings'} />;
}

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [allWorkers, setAllWorkers] = useState<WorkerProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLocationLoading, setIsLocationLoading] = useState(false);

    const [userLocation, setUserLocation] = useState<Coordinates>(DEFAULT_CENTER);
    const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showLiveBooking, setShowLiveBooking] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            setIsLoading(true);
            try {
                const workers = await workerService.getWorkers();
                setAllWorkers(workers);
            } catch (error) {
                console.error("Failed to initialize app data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        initialize();
    }, []);

    const requestLocationAndProceed = useCallback((callback: (location: Coordinates) => void) => {
        setIsLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setUserLocation(newLocation);
                setIsLocationLoading(false);
                callback(newLocation);
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Location access was denied. Showing results from a default location. For more accurate results, please enable location services for this site.");
                setUserLocation(DEFAULT_CENTER);
                setIsLocationLoading(false);
                callback(DEFAULT_CENTER);
            }
        );
    }, []);

    const handleSearch = (query: string, category: WorkerCategory | null) => {
        requestLocationAndProceed(() => {
            const path = category ? `/category/${category.toLowerCase()}` : '/search';
            // Search logic would need to be adapted for service search
            navigate(`${path}?q=${query}`);
        });
    };

    const handleBookService = (service: ServiceType) => {
        setIsSearching(true);
        // Here we would call the backend to create a booking request
    };

    const handleCategorySelect = (category: WorkerCategory) => {
        requestLocationAndProceed(() => {
            navigate(`/category/${category.toLowerCase()}`);
        });
    };

    const getHeaderTitle = () => {
        const path = location.pathname;
        const pathParts = path.split('/');

        if (path.startsWith('/category/') && pathParts.length >= 3) {
            const categoryKey = pathParts[2];
            const workerCategory = LOWERCASE_TO_WORKER_CATEGORY[categoryKey];
            if (workerCategory) {
                return CATEGORY_DISPLAY_NAMES[workerCategory];
            }
        }
        if (path.startsWith('/dashboard/') && pathParts.length >= 3) {
            return pathParts[2].toUpperCase();
        }
        if (path.startsWith('/search')) {
            return 'Search Results';
        }
        return 'Thelokals.com';
    }

    const isResultsPageLoading = isLoading || isLocationLoading;

    if (showLiveBooking) {
        return <LiveBooking />;
    }

    if (isSearching) {
        return <LiveSearch onCancel={() => setIsSearching(false)} />;
    }

    return (
        <SkeletonTheme baseColor="#dcfce7" highlightColor="#bbf7d0">
            <div className="min-h-screen bg-[#f0fdf4] dark:bg-slate-900 font-sans pb-20">
                <Helmet>
                    <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/favicon-16x16.png" />
                    <link rel="manifest" href="/assets/images/site.webmanifest" />
                </Helmet>
                <BookingModal worker={selectedWorker} onClose={() => setSelectedWorker(null)} onAuthReq={() => { setSelectedWorker(null); setShowAuthModal(true); }} />
                {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

                <Header
                    isHome={location.pathname === '/'}
                    title={getHeaderTitle()}
                    onSignInClick={() => setShowAuthModal(true)}
                    onSearch={(query) => handleSearch(query, null)}
                />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Routes>
                        <Route path="/" element={<HomePage handleCategorySelect={handleCategorySelect} isLoading={isLoading} setShowLiveBooking={setShowLiveBooking} />} />
                        <Route path="/category/:category" element={<ServiceSelectionPage userLocation={userLocation} isLoading={isResultsPageLoading} onBook={handleBookService} />} />
                        {/* Search page can remain as legacy or be updated later */}
                        <Route path="/search" element={<ServiceSelectionPage userLocation={userLocation} isLoading={isResultsPageLoading} onBook={handleBookService} />} />
                        <Route path="/dashboard/:view" element={<DashboardPage isLoading={isLoading} />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>

                <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t dark:border-slate-700 flex justify-around max-w-7xl mx-auto rounded-t-2xl shadow-lg">
                    <NavLink to="/" label="Home" />
                    <NavLink to="/dashboard/bookings" label="Bookings" />
                    <NavLink to="/dashboard/profile" label="Profile" />
                </nav>
            </div>
        </SkeletonTheme>
    );
};

const NavLink: React.FC<{ to: string, label: string }> = ({ to, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to || (to.startsWith('/dashboard') && location.pathname.startsWith(to));

    return (
        <Link
            to={to}
            className={`flex flex-col items-center justify-center flex-1 p-3 text-sm font-semibold transition-colors ${isActive ? 'text-teal-600' : 'text-slate-500'}`}>
            {label}
        </Link>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <MainLayout />
            </BrowserRouter>
        </AuthProvider>
    );
}
