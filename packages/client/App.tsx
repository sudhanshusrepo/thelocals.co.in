
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { WorkerCard } from './components/WorkerCard';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { UserDashboard, DashboardView } from './components/UserDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { CATEGORY_ICONS, DEFAULT_CENTER, SERVICE_GROUPS } from './constants';
import { WorkerCategory, WorkerProfile, Coordinates } from './types';
import { workerService } from './services/workerService';
import SearchBar from './components/SearchBar';

// --- Types ---
// Consolidating view types for clearer state management
type View = 'home' | 'results' | 'dashboard';

// --- Helper Functions ---
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

// --- Main Application Component ---
const MainLayout: React.FC = () => {
  // --- State Management ---
  const [view, setView] = useState<View>('home');
  const [dashboardView, setDashboardView] = useState<DashboardView>('Bookings');

  const [allWorkers, setAllWorkers] = useState<WorkerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WorkerCategory | null>(null);
  const [sortBy, setSortBy] = useState('relevance');

  const [userLocation, setUserLocation] = useState<Coordinates>(DEFAULT_CENTER);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // --- Data Fetching and Initialization ---
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const workers = await workerService.getWorkers();
        setAllWorkers(workers);
        // We can ask for location silently here
        navigator.geolocation.getCurrentPosition(
            (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => setUserLocation(DEFAULT_CENTER) 
        );
      } catch (error) {
        console.error("Failed to initialize app data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, []);

  // --- Event Handlers ---
  const handleSearch = (query: string, category: WorkerCategory | null) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    setView('results');
  };

  const handleCategoryClick = (category: WorkerCategory) => {
    setSearchQuery(''); // Clear search query when a category is clicked
    setSelectedCategory(category);
    setView('results');
  };

  const handleBottomNavClick = (newView: View, dashView: DashboardView = 'Bookings') => {
      setView(newView);
      setDashboardView(dashView);
  }

  const goHome = () => {
      setView('home');
      setSelectedCategory(null);
      setSearchQuery('');
  }

  // --- Derived State (Filtering & Sorting) ---
  const filteredAndSortedWorkers = useMemo(() => {
    const workersWithDistance = allWorkers.map(worker => ({
      ...worker,
      distanceKm: getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, worker.location.lat, worker.location.lng)
    }));

    const filtered = workersWithDistance.filter(worker => {
      if (selectedCategory && worker.category !== selectedCategory) return false;
      if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const searchableText = [worker.name, worker.description, ...worker.expertise].join(' ').toLowerCase();
          if (!searchableText.includes(query)) return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      
      const getScore = (w: typeof a) => {
          let score = w.distanceKm * 0.5;
          score -= w.rating * 2;
          if (w.isVerified) score -= 5;
          if (w.status === 'AVAILABLE') score -= 10;
          return score;
      };
      return getScore(a) - getScore(b);
    });

    return filtered;
  }, [allWorkers, userLocation, selectedCategory, searchQuery, sortBy]);

  // --- Header & Title Logic ---
  const isSubPage = view === 'results' || view === 'dashboard';
  const getHeaderTitle = () => {
      if (view === 'results') return selectedCategory || 'Search Results';
      if (view === 'dashboard') return dashboardView;
      return 'The Lokals';
  }

  // --- JSX Rendering ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans pb-20">
      <BookingModal worker={selectedWorker} onClose={() => setSelectedWorker(null)} onAuthReq={() => { setSelectedWorker(null); setShowAuthModal(true); }} />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      <Header 
        isHome={!isSubPage} 
        onBack={goHome} 
        onLogoClick={goHome}
        title={getHeaderTitle()}
        onSignInClick={() => setShowAuthModal(true)}
        onDashboardClick={() => handleBottomNavClick('dashboard', 'Profile')}
      />

      <main className="max-w-5xl mx-auto px-4 pt-6">
        {view === 'home' && (
          <div className="space-y-8 animate-fade-in-up">
            <SearchBar onSearch={handleSearch} />
            <div className="space-y-4">
              {Object.values(SERVICE_GROUPS).map((group) => (
                <div key={group.name} className="rounded-2xl shadow-sm border dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                  <h2 className="font-bold text-lg dark:text-white mb-4">{group.name}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {group.categories.map((cat) => (
                      <button 
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 p-4 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-600/50 transition-all h-28 group"
                      >
                         <span className="text-3xl mb-2">{CATEGORY_ICONS[cat]}</span>
                         <span className="text-xs font-bold text-center text-gray-600 dark:text-gray-300 group-hover:text-indigo-600">{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'results' && (
          <div className="animate-fade-in">
            <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar">
               {['relevance', 'rating', 'distance', 'price'].map(sortType => (
                   <button 
                    key={sortType}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap border ${sortBy === sortType ? 'bg-gray-900 dark:bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-gray-800'}`}
                    onClick={() => setSortBy(sortType)}
                  >
                    {sortType.charAt(0).toUpperCase() + sortType.slice(1)}
                  </button>
               ))}
            </div>

            {isLoading ? (
              <div className="text-center py-20"><p>Loading workers...</p></div>
            ) : (
              <>
                <p className="text-gray-500 text-sm my-4 font-medium">{filteredAndSortedWorkers.length} experts found</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedWorkers.map(worker => (
                      <WorkerCard key={worker.id} worker={worker} distanceKm={worker.distanceKm} onConnect={setSelectedWorker} />
                    ))}
                </div>
                {filteredAndSortedWorkers.length === 0 && (
                    <div className="col-span-full text-center py-20">
                        <h3 className="text-xl font-bold">No professionals found</h3>
                        <p className="text-gray-500">Try a different category or search term.</p>
                    </div>
                )}
              </>
            )}
          </div>
        )}

        {view === 'dashboard' && <UserDashboard initialView={dashboardView} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex justify-around max-w-5xl mx-auto rounded-t-2xl shadow-lg">
            <NavButton label="Home" view="home" currentView={view} onClick={() => handleBottomNavClick('home')} />
            <NavButton label="Bookings" view="dashboard" currentView={view} onClick={() => handleBottomNavClick('dashboard', 'Bookings')} />
            <NavButton label="Profile" view="dashboard" currentView={view} data-subview="Profile" onClick={() => handleBottomNavClick('dashboard', 'Profile')} />
      </nav>
    </div>
  );
};

// --- Sub-components ---

interface NavButtonProps {
    label: string;
    view: View;
    currentView: View;
    onClick: () => void;
    'data-subview'?: DashboardView;
}

const NavButton: React.FC<NavButtonProps> = ({ label, view, currentView, onClick, 'data-subview': dataSubview }) => {
    // A tab is active if its main view matches, and if it has a subview, that must also match.
    const isActive = currentView === view && (dataSubview ? dataSubview === (view === 'dashboard' ? (dataSubview) : null) : true);

    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center p-3 text-sm font-semibold transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
            {label}
        </button>
    )
}

// --- Root Component ---
export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
