import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ExploreView } from './components/ExploreView';
import { MapView } from './components/MapView';
import { VendorDetailDrawer } from './components/VendorDetailDrawer';
import { AdminPortal } from './components/AdminPortal';
import { AboutModal } from './components/AboutModal';
import { Category, Area, Vendor, AdminUser, ActiveTab } from './types';
import { fetchCategories, fetchAreas, fetchVendors, adminGetMe } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('city-map');
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedAreaId, setSelectedAreaId] = useState<string | undefined>(undefined);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // User Geolocation Coordinates & Denial state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocationDenied, setIsLocationDenied] = useState<boolean>(false);

  // Admin Portal & Modals
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);

  // Read URL search parameters on initial mount (e.g., ?search=Johny, ?category=cobbler)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location) {
      const params = new URLSearchParams(window.location.search);
      const searchParam = params.get('search');
      const categoryParam = params.get('category');
      const areaParam = params.get('area');

      if (searchParam) {
        setSearchQuery(searchParam);
        setDebouncedSearch(searchParam);
      }
      if (categoryParam) {
        setSelectedCategorySlug(categoryParam);
      }
      if (areaParam) {
        setSelectedAreaId(areaParam);
      }

      // Check for direct admin route
      if (window.location.pathname.startsWith('/admin')) {
        setIsAdminPortalOpen(true);
      }
    }
  }, []);

  // Debounce search query by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Initial Geolocation probe on mount
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'denied') {
            setIsLocationDenied(true);
            setUserCoords({ lat: 22.7196, lng: 75.8552 }); // Centroid: Rajwada Indore
          }
          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'denied') {
              setIsLocationDenied(true);
              setUserCoords({ lat: 22.7196, lng: 75.8552 });
            } else if (permissionStatus.state === 'granted') {
              setIsLocationDenied(false);
              handleLocateMe();
            }
          };
        })
        .catch(() => {});
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocationDenied(false);
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn('Geolocation denied or unavailable:', err.message);
          setIsLocationDenied(true);
          setUserCoords({ lat: 22.7196, lng: 75.8552 });
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      setIsLocationDenied(true);
      setUserCoords({ lat: 22.7196, lng: 75.8552 });
    }
  }, []);

  // Initial Data Load (Categories & Areas & Admin Session)
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories', err));

    fetchAreas()
      .then(setAreas)
      .catch((err) => console.error('Failed to load areas', err));

    // Check stored admin session
    if (localStorage.getItem('galiguide_admin_token')) {
      adminGetMe()
        .then(setAdminUser)
        .catch(() => localStorage.removeItem('galiguide_admin_token'));
    }
  }, []);

  // Fetch Vendors whenever filters, debounced search, or coordinates change
  const loadVendors = () => {
    fetchVendors({
      category: selectedCategorySlug === 'all' ? undefined : selectedCategorySlug,
      search: debouncedSearch || undefined,
      areaId: selectedAreaId,
      lat: userCoords?.lat,
      lng: userCoords?.lng,
      limit: 50,
    })
      .then((res) => {
        setVendors(res.vendors);
      })
      .catch((err) => console.error('Failed to load vendors', err));
  };

  useEffect(() => {
    loadVendors();
  }, [selectedCategorySlug, debouncedSearch, selectedAreaId, userCoords]);

  // Request HTML5 Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      setIsLocationDenied(true);
      setUserCoords({ lat: 22.7196, lng: 75.8552 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocationDenied(false);
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn('Geolocation denied or unavailable:', err.message);
        setIsLocationDenied(true);
        // Fallback default: Rajwada Indore
        setUserCoords({ lat: 22.7196, lng: 75.8552 });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Switch to City Map from Explore Search
  const handleExploreSearch = (text: string, areaId?: string, categorySlug?: string) => {
    setSearchQuery(text);
    if (areaId) setSelectedAreaId(areaId);
    if (categorySlug) setSelectedCategorySlug(categorySlug);
    setActiveTab('city-map');
  };

  // Select Category from Grid
  const handleCategorySelect = (slug: string) => {
    setSelectedCategorySlug(slug);
    setActiveTab('city-map');
  };

  // Handle area selection from MapView locality selector
  const handleAreaSelect = (area: Area | null) => {
    if (area) {
      setSelectedAreaId(area.id);
      setUserCoords({ lat: area.latitude, lng: area.longitude });
    } else {
      setSelectedAreaId(undefined);
      setUserCoords({ lat: 22.7196, lng: 75.8552 });
    }
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-surface flex flex-col">
      {/* Universal Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'about') {
            setIsAboutModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onLocateMe={handleLocateMe}
        userCoords={userCoords}
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
        isAdminLoggedIn={!!adminUser}
      />

      {/* Main Content Area */}
      <main className="w-full pt-20 flex-1 flex flex-col">
        {activeTab === 'explore' ? (
          <ExploreView
            categories={categories}
            areas={areas}
            onSearchSubmit={handleExploreSearch}
            onSelectCategory={handleCategorySelect}
          />
        ) : (
          <MapView
            vendors={vendors}
            categories={categories}
            areas={areas}
            selectedCategorySlug={selectedCategorySlug}
            onSelectCategory={setSelectedCategorySlug}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedVendor={selectedVendor}
            onSelectVendor={setSelectedVendor}
            userCoords={userCoords}
            onLocateMe={handleLocateMe}
            onAreaSelect={handleAreaSelect}
            isLocationDenied={isLocationDenied}
            onDismissLocationDenied={() => setIsLocationDenied(false)}
          />
        )}
      </main>

      {/* Vendor Detail Slide-over / Modal */}
      <VendorDetailDrawer
        vendor={selectedVendor}
        onClose={() => setSelectedVendor(null)}
      />

      {/* Administrative Governance Portal Modal */}
      {isAdminPortalOpen && (
        <AdminPortal
          categories={categories}
          areas={areas}
          onClose={() => setIsAdminPortalOpen(false)}
          onDataModified={() => {
            loadVendors();
            fetchCategories().then(setCategories);
          }}
          adminUser={adminUser}
          setAdminUser={setAdminUser}
        />
      )}

      {/* About Indore Heritage Modal */}
      {isAboutModalOpen && (
        <AboutModal onClose={() => setIsAboutModalOpen(false)} />
      )}
    </div>
  );
};

export default App;
