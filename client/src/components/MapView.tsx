import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.heat';
import {
  Search,
  X,
  Layers,
  MapPin,
  Flame,
  CheckCircle2,
  ChevronRight,
  Phone,
  Navigation,
  Clock,
  LayoutList,
  Columns,
  Map as MapIcon,
  Filter,
} from 'lucide-react';
import { Vendor, Category, Area, ViewMode } from '../types';
import { CategoryIcon } from '../utils/categoryIcons';
import { fetchHeatmap } from '../services/api';

interface MapViewProps {
  vendors: Vendor[];
  categories: Category[];
  areas: Area[];
  selectedCategorySlug: string;
  onSelectCategory: (slug: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedVendor: Vendor | null;
  onSelectVendor: (vendor: Vendor) => void;
  userCoords: { lat: number; lng: number } | null;
  onLocateMe: () => void;
  onAreaSelect?: (area: Area | null) => void;
  isLocationDenied?: boolean;
  onDismissLocationDenied?: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  vendors,
  categories,
  areas,
  selectedCategorySlug,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedVendor,
  onSelectVendor,
  userCoords,
  onLocateMe,
  onAreaSelect,
  isLocationDenied,
  onDismissLocationDenied,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const heatmapLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);

  const [isHeatmapActive, setIsHeatmapActive] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('all');

  // Center of Indore (Rajwada: 22.7196, 75.8577)
  const INDORE_CENTER: [number, number] = [22.7196, 75.8577];

  // Helper to create category SVG DivIcon
  const createVendorIcon = (color: string, isSelected: boolean, isApproximate?: boolean) => {
    const size = isSelected ? 44 : 36;
    const pinSvg = isApproximate
      ? `
      <div class="pin-wrapper" style="width: ${size + 8}px; height: ${size + 8}px; display: flex; align-items: center; justify-content: center; position: relative;">
        <div style="position: absolute; inset: 0; border-radius: 9999px; border: 3px solid #d97706; background-color: rgba(217, 119, 6, 0.25);"></div>
        <svg viewBox="0 0 36 36" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: relative; z-index: 10;">
          <path d="M18 34C18 34 30 22.5 30 14C30 7.37258 24.6274 2 18 2C11.3726 2 6 7.37258 6 14C6 22.5 18 34 18 34Z" fill="${color}" stroke="#d97706" stroke-width="3" />
          <circle cx="18" cy="14" r="5" fill="#ffffff" />
        </svg>
      </div>
    `
      : `
      <div class="pin-wrapper" style="width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
        <svg viewBox="0 0 36 36" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 34C18 34 30 22.5 30 14C30 7.37258 24.6274 2 18 2C11.3726 2 6 7.37258 6 14C6 22.5 18 34 18 34Z" fill="${color}" stroke="#ffffff" stroke-width="2.5" />
          <circle cx="18" cy="14" r="6" fill="#ffffff" />
        </svg>
      </div>
    `;

    return L.divIcon({
      html: pinSvg,
      className: 'leaflet-marker-icon custom-vendor-pin',
      iconSize: [isApproximate ? size + 8 : size, isApproximate ? size + 8 : size],
      iconAnchor: [isApproximate ? (size + 8) / 2 : size / 2, isApproximate ? size + 8 : size],
      popupAnchor: [0, -size],
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: userCoords ? [userCoords.lat, userCoords.lng] : INDORE_CENTER,
      zoom: 14,
      zoomControl: false,
    });

    // OpenStreetMap Raster Basemap Layer (Zero-cost, no Google Maps API)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors | GaliGuide Indore',
    }).addTo(map);

    // Zoom Controls top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Marker Cluster Group
    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 45,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div><span>${count}</span></div>`,
          className: 'marker-cluster-custom',
          iconSize: L.point(40, 40),
        });
      },
    });

    map.addLayer(clusterGroup);
    markerClusterGroupRef.current = clusterGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Invalidate map size when view mode changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 250);
    }
  }, [viewMode]);

  // Update User GPS Marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (userCoords) {
      if (!userMarkerRef.current) {
        userMarkerRef.current = L.circleMarker([userCoords.lat, userCoords.lng], {
          radius: 9,
          fillColor: '#3d6659',
          color: '#ffffff',
          weight: 3,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(mapInstanceRef.current);

        userMarkerRef.current.bindPopup(
          '<div class="font-bold text-xs p-1">Your Location (GPS)</div>'
        );
      } else {
        userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
      }
    } else if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
  }, [userCoords]);

  // Update Vendor Markers in Cluster Group
  useEffect(() => {
    const cluster = markerClusterGroupRef.current;
    if (!cluster) return;

    cluster.clearLayers();

    vendors.forEach((vendor) => {
      const isSelected = selectedVendor?.id === vendor.id;
      const color = vendor.category?.color || '#9d3e1c';
      const icon = createVendorIcon(color, isSelected, vendor.isApproximateLoc);

      const marker = L.marker([vendor.latitude, vendor.longitude], { icon });

      // Click to select
      marker.on('click', () => {
        onSelectVendor(vendor);
      });

      // Tooltip preview
      marker.bindTooltip(
        `<div class="font-bold text-xs">${vendor.name}</div><div class="text-[10px] text-gray-600">${vendor.landmark}</div>`,
        { direction: 'top', offset: [0, -30] }
      );

      cluster.addLayer(marker);
    });
  }, [vendors, selectedVendor]);

  // Heatmap Overlay Toggle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (isHeatmapActive) {
      fetchHeatmap().then((points) => {
        if (!mapInstanceRef.current) return;
        if (heatmapLayerRef.current) {
          map.removeLayer(heatmapLayerRef.current);
        }

        // @ts-ignore (L.heatLayer from leaflet.heat)
        if (typeof (L as any).heatLayer === 'function') {
          // @ts-ignore
          const heat = (L as any).heatLayer(points, {
            radius: 35,
            blur: 22,
            maxZoom: 17,
            gradient: {
              0.2: '#bce9d9',
              0.4: '#efc055',
              0.7: '#bd5632',
              1.0: '#9d3e1c',
            },
          });
          heat.addTo(map);
          heatmapLayerRef.current = heat;
        }
      });
    } else if (heatmapLayerRef.current) {
      map.removeLayer(heatmapLayerRef.current);
      heatmapLayerRef.current = null;
    }
  }, [isHeatmapActive]);

  // Center map on selected vendor
  useEffect(() => {
    if (selectedVendor && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedVendor.latitude, selectedVendor.longitude],
        16,
        { duration: 0.8 }
      );
    }
  }, [selectedVendor]);

  // Handle Area selection dropdown flyTo
  const handleAreaChange = (areaId: string) => {
    setSelectedAreaId(areaId);
    if (areaId === 'all') {
      if (onAreaSelect) onAreaSelect(null);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(INDORE_CENTER, 14, { duration: 0.8 });
      }
    } else {
      const area = areas.find((a) => a.id === areaId);
      if (area) {
        if (onAreaSelect) onAreaSelect(area);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([area.latitude, area.longitude], 15, { duration: 0.8 });
        }
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-5rem)] overflow-hidden bg-background">
      {/* Geolocation Denied Banner (PAC-11 / TC-11) */}
      {isLocationDenied && (
        <div
          id="location-denied-banner"
          data-testid="location-denied-banner"
          className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-xs font-medium text-amber-800 dark:text-amber-200 flex items-center justify-between z-30"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Location access disabled. Browsing central Indore (Rajwada).</span>
          </div>
          {onDismissLocationDenied && (
            <button
              onClick={onDismissLocationDenied}
              className="text-amber-800 dark:text-amber-200 hover:opacity-75 p-1"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Top Controls Bar: Categories & Search */}
      <div className="bg-surface-container-lowest border-b border-surface-container-high px-4 py-2.5 z-20 flex flex-col gap-2 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input Bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              id="search-input"
              data-testid="search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, Hindi alias, landmark, or trade..."
              className="w-full pl-9 pr-8 py-2 bg-surface-container rounded-xl text-xs sm:text-sm font-medium text-on-surface placeholder:text-on-surface-variant/60 border border-transparent focus:border-primary/40 focus:bg-surface-container-lowest outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Indore Area Locality Dropdown & View Mode Switch */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-xl border border-surface-container-high text-xs">
              <MapPin className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
              <select
                id="select-indore-area"
                data-testid="select-indore-area"
                value={selectedAreaId}
                onChange={(e) => handleAreaChange(e.target.value)}
                className="bg-transparent border-0 outline-none text-xs font-semibold text-on-surface cursor-pointer pr-1"
              >
                <option value="all">Everywhere in Indore</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Heatmap Toggle */}
            <button
              onClick={() => setIsHeatmapActive(!isHeatmapActive)}
              title="Toggle Vendor Density Heatmap Overlay"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isHeatmapActive
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'bg-surface-container border-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Heatmap</span>
            </button>

            {/* Layout Mode Toggles (Desktop) */}
            <div className="hidden md:flex items-center bg-surface-container p-0.5 rounded-xl border border-surface-container-high">
              <button
                id="btn-view-split"
                data-testid="btn-view-split"
                onClick={() => setViewMode('split')}
                title="Split Map & List View"
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Columns className="w-4 h-4" />
              </button>
              <button
                id="btn-view-map"
                data-testid="btn-view-map"
                onClick={() => setViewMode('map')}
                title="Map Only View"
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <MapIcon className="w-4 h-4" />
              </button>
              <button
                id="btn-view-list"
                data-testid="btn-view-list"
                onClick={() => setViewMode('list')}
                title="List Only View"
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pill Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-0.5">
          <button
            id="pill-category-all"
            data-testid="pill-category-all"
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategorySlug === 'all'
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface-container border-surface-container-high/80 text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All Guilds ({vendors.length})
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                id={`pill-category-${cat.slug}`}
                data-testid={`pill-category-${cat.slug}`}
                onClick={() => onSelectCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-secondary text-on-secondary border-secondary shadow-sm'
                    : 'bg-surface-container border-surface-container-high/80 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
                }`}
              >
                <CategoryIcon iconName={cat.icon} size={14} />
                <span>{cat.name}</span>
                {cat.vendorCount !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {cat.vendorCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Body: Map Canvas & Distance-Sorted List */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Left Sidebar: Vendor Feed (Desktop Split View or List Only View) */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <aside
            id="vendor-list-container"
            data-testid="vendor-list-container"
            className={`${
              viewMode === 'list' ? 'w-full max-w-4xl mx-auto' : 'w-full md:w-[440px] xl:w-[480px]'
            } flex-shrink-0 bg-surface-container-low border-r border-surface-container-high flex flex-col overflow-hidden z-10`}
          >
            {/* Feed Header */}
            <div className="p-3.5 bg-surface-container-lowest/80 border-b border-surface-container-high flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-on-surface">
                <Filter className="w-3.5 h-3.5 text-primary" />
                <span>
                  {vendors.length} Street {vendors.length === 1 ? 'Vendor' : 'Vendors'} Found
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant font-medium">
                {userCoords ? 'Sorted by proximity' : 'Verified Indore Directory'}
              </span>
            </div>

            {/* Scrollable Feed List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {vendors.length === 0 ? (
                <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-surface-container-high mt-4">
                  <div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center text-on-surface-variant mb-3">
                    <Search className="w-6 h-6 text-outline" />
                  </div>
                  <h4 className="font-display font-bold text-base text-on-surface">
                    No Vendors Found
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-1 max-w-xs mx-auto">
                    Try clearing your search query or selecting a different category or locality.
                  </p>
                  <button
                    onClick={() => {
                      onSearchChange('');
                      onSelectCategory('all');
                      handleAreaChange('all');
                    }}
                    className="mt-4 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-container transition-all cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                vendors.map((vendor) => {
                  const isSelected = selectedVendor?.id === vendor.id;
                  const isOpen = vendor.operatingHoursToday?.isOpenNow;

                  return (
                    <div
                      key={vendor.id}
                      id={`vendor-card-${vendor.id}`}
                      data-testid="vendor-card"
                      onClick={() => onSelectVendor(vendor)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-surface-container-lowest border-primary shadow-lg ring-2 ring-primary/20'
                          : 'bg-surface-container-lowest border-surface-container-high hover:border-primary/40 hover:shadow-md'
                      }`}
                    >
                      {/* Category & Status Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"
                          style={{
                            backgroundColor: `${vendor.category?.color || '#9d3e1c'}15`,
                            color: vendor.category?.color || '#9d3e1c',
                          }}
                        >
                          <CategoryIcon iconName={vendor.category?.icon} size={12} />
                          <span>{vendor.category?.name}</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          {vendor.isVerified && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-secondary">
                              <CheckCircle2 className="w-3 h-3 text-secondary" />
                              <span>Verified</span>
                            </span>
                          )}

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isOpen
                                ? 'bg-secondary-container text-on-secondary-container'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {isOpen ? 'Open Now' : 'Closed'}
                          </span>
                        </div>
                      </div>

                      {/* Vendor Name & Hindi Script */}
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="font-display font-bold text-base text-on-surface leading-snug">
                          {vendor.name}
                        </h4>
                        {vendor.distanceKm !== null && vendor.distanceKm !== undefined && (
                          <span className="text-xs font-bold text-primary flex-shrink-0">
                            {vendor.distanceKm < 1
                              ? `${Math.round(vendor.distanceKm * 1000)} m`
                              : `${vendor.distanceKm.toFixed(1)} km`}
                          </span>
                        )}
                      </div>

                      {vendor.hindiName && (
                        <span className="text-xs text-on-surface-variant font-medium">
                          {vendor.hindiName}
                        </span>
                      )}

                      {/* Landmark Direction */}
                      <div className="mt-2.5 p-2 rounded-xl bg-surface-container flex items-start gap-2 text-xs text-on-surface font-medium border border-surface-container-high/40">
                        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{vendor.landmark}</span>
                      </div>

                      {/* Action Triggers */}
                      <div className="mt-3 pt-2.5 border-t border-surface-container flex items-center justify-between text-xs font-semibold">
                        <span className="text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>View Details &amp; Directions</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>

                        {vendor.contactPhone && vendor.isPhonePublic && (
                          <span className="text-secondary flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        )}

        {/* Right Canvas: Leaflet Map (Split View or Map Only View) */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <main
            id="leaflet-map-container"
            data-testid="leaflet-map-container"
            className="flex-1 relative h-full w-full"
          >
            <div ref={mapContainerRef} className="w-full h-full" id="leaflet-map-canvas" />

            {/* Mobile View Switcher Floating Action */}
            <div className="md:hidden absolute bottom-5 left-1/2 -translate-x-1/2 z-30">
              <button
                id={viewMode === 'split' ? 'btn-view-list' : 'btn-view-map'}
                data-testid={viewMode === 'split' ? 'btn-view-list' : 'btn-view-map'}
                onClick={() => setViewMode(viewMode === 'split' ? 'list' : 'split')}
                className="px-5 py-2.5 bg-primary text-on-primary rounded-full font-bold text-xs shadow-xl flex items-center gap-2 border border-white/40 cursor-pointer"
              >
                {viewMode === 'split' ? (
                  <>
                    <LayoutList className="w-4 h-4" />
                    <span>View List ({vendors.length})</span>
                  </>
                ) : (
                  <>
                    <MapIcon className="w-4 h-4" />
                    <span>View Map</span>
                  </>
                )}
              </button>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};
