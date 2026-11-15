import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Navigation, Compass } from 'lucide-react';
import { Category, Area } from '../types';
import { getCategoryAsset, HERO_ASSET } from '../utils/categoryAssets';
import { Button } from './shared/Button';
import { Badge } from './shared/Badge';

interface ExploreViewProps {
  categories: Category[];
  areas: Area[];
  onSearchSubmit: (text: string, areaId?: string, categorySlug?: string) => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  categories,
  areas,
  onSearchSubmit,
  onSelectCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchTerm, selectedAreaId === 'all' ? undefined : selectedAreaId);
  };

  const trendingPills = [
    { label: 'Johny Hot Dog', query: 'Johny' },
    { label: 'Kulhad Chai', query: 'Chai' },
    { label: 'Ramesh Cobbler', query: 'Cobbler' },
    { label: 'Cycle Puncture', query: 'Puncture' },
    { label: 'Emergency Tailor', query: 'Tailor' },
    { label: 'Flying Dahi Bada', query: 'Dahi Bada' },
    { label: 'Master Key Maker', query: 'Key' },
  ];

  return (
    <div className="flex flex-col w-full bg-canvas text-on-surface">
      {/* 1. Immersive Editorial Hero */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-aubergine-50/60 via-canvas to-canvas pt-6 pb-14 lg:pb-20 border-b border-icesilver-300">
        {/* Subtle Ambient Brand Glows */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-marigold-100/40 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-aubergine-100/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Headline & Grand Dual Search Console */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-aubergine text-marigold text-xs font-bold tracking-wider uppercase shadow-street-sm">
                  Hyperlocal Street Discovery
                </span>
                <span className="text-aubergine-700 flex items-center gap-1 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-marigold-600" />
                  Sarafa • Chhappan Dukan • Rajwada
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-aubergine tracking-tight mb-4 leading-[1.12] font-black">
                Find the artisans behind{' '}
                <span className="text-marigold underline decoration-marigold/40 underline-offset-4">
                  Indore's streets.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-on-surface-variant max-w-xl mb-7 leading-relaxed">
                Discover sidewalk cobblers, late-night chai masters, roadside cycle mechanics, and
                informal food pushcarts across Indore—verified in person with landmark navigation.
              </p>

              {/* Grand Dual-Input Search Console */}
              <form
                onSubmit={handleSearch}
                className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-street-md border border-icesilver-300 flex flex-col md:flex-row gap-2.5 items-stretch"
              >
                {/* Input 1: Trade / Service */}
                <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 bg-icesilver-50 rounded-xl border border-icesilver-200 focus-within:border-marigold focus-within:ring-2 focus-within:ring-marigold/20 transition-all">
                  <Search className="text-aubergine w-5 h-5 flex-shrink-0" />
                  <div className="flex flex-col w-full">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Need / Service / Vendor
                    </span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cobbler, chai, key maker, poha..."
                      className="bg-transparent border-0 outline-none text-sm text-on-surface placeholder:text-on-surface-variant/50 w-full font-medium"
                    />
                  </div>
                </div>

                {/* Input 2: Indore Locality Dropdown */}
                <div className="w-full md:w-56 flex items-center gap-3 px-3.5 py-2.5 bg-icesilver-50 rounded-xl border border-icesilver-200 focus-within:border-marigold focus-within:ring-2 focus-within:ring-marigold/20 transition-all">
                  <MapPin className="text-marigold-700 w-5 h-5 flex-shrink-0" />
                  <div className="flex flex-col w-full">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Indore Locality
                    </span>
                    <select
                      value={selectedAreaId}
                      onChange={(e) => setSelectedAreaId(e.target.value)}
                      className="bg-transparent border-0 outline-none text-sm text-on-surface cursor-pointer w-full font-medium"
                    >
                      <option value="all">Entire Indore City</option>
                      {areas.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Primary Find CTA */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  iconRight={<ArrowRight className="w-4 h-4 text-aubergine" />}
                  className="whitespace-nowrap px-6"
                >
                  Locate Vendors
                </Button>
              </form>

              {/* Trending Quick Search Pills */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-aubergine uppercase tracking-wider mr-1">
                  Popular:
                </span>
                {trendingPills.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => onSearchSubmit(p.query)}
                    className="px-3 py-1 bg-white hover:bg-marigold-50 hover:text-aubergine hover:border-marigold-300 rounded-full text-xs font-semibold text-on-surface-variant border border-icesilver-300 shadow-street-sm transition-all cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Authentic Indore Street Visual Composition */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden shadow-street-lg bg-aubergine border-2 border-icesilver-300">
                <img
                  src={HERO_ASSET}
                  alt="Historic Indore street bazaar at twilight with handcarts and lanterns"
                  className="w-full h-full object-cover"
                />

                {/* Floating Street Verification Stamp */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-street-md flex items-center gap-2.5 border border-icesilver-300">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-marigold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-marigold-600"></span>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-aubergine tracking-wider">
                      Live Street Registry
                    </span>
                    <span className="text-xs text-marigold-900 font-bold">Verified Footsteps</span>
                  </div>
                </div>

                {/* Authentic Landmark Directional Banner */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-street-md border border-icesilver-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-marigold-100 text-aubergine flex-shrink-0">
                      <Navigation className="w-4 h-4 text-marigold-900" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-aubergine">
                          Hyperlocal Landmark Guidance
                        </span>
                        <span className="text-[11px] font-semibold text-on-surface-variant">
                          High Court Gate 2
                        </span>
                      </div>
                      <p className="text-xs text-on-surface mt-1 font-medium leading-relaxed">
                        “Look behind the historic banyan tree across Gate 2; find master cobbler Ramu
                        with leather repair tools on his wooden phad.”
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Essential Categories Bento Grid */}
      <section className="w-full py-14 bg-white border-b border-icesilver-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-marigold-700">
                Informal Micro-Artisans
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-aubergine mt-1">
                Explore Essential Street Guilds
              </h2>
            </div>
            <p className="text-sm text-on-surface-variant max-w-md mt-2 md:mt-0 font-medium">
              Micro-occupations keeping Indore self-reliant, sustainable, and vibrant from dawn till
              past midnight.
            </p>
          </div>

          {/* Categories Grid with Authentic Visual Assets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="group bg-canvas hover:bg-white rounded-2xl p-4 shadow-street-sm hover:shadow-street-md transition-all duration-200 cursor-pointer flex flex-col justify-between border border-icesilver-300 hover:border-marigold hover:-translate-y-1"
              >
                <div>
                  <div className="w-full h-32 rounded-xl overflow-hidden bg-white border border-icesilver-200 mb-3 flex items-center justify-center p-2 group-hover:scale-102 transition-transform">
                    <img
                      src={getCategoryAsset(cat.slug)}
                      alt={cat.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex items-center justify-between mb-1.5">
                    <Badge variant="stall" size="sm">
                      {cat.vendorCount || 0} active
                    </Badge>
                  </div>

                  <h3 className="font-display font-bold text-base text-aubergine group-hover:text-marigold-900 transition-colors">
                    {cat.name}
                  </h3>
                  {cat.hindiName && (
                    <span className="text-xs font-semibold text-on-surface-variant block mt-0.5">
                      {cat.hindiName}
                    </span>
                  )}
                  <p className="text-xs text-on-surface-variant mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-icesilver-200 flex items-center justify-between text-xs font-bold text-aubergine group-hover:text-marigold-800">
                  <span>Explore Guild</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Cultural & Civic Value Proposition */}
      <section className="w-full py-14 bg-icesilver-50 border-b border-icesilver-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest font-bold text-marigold-700">
              Zero-Cost Civic Philosophy
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-aubergine mt-1.5">
              Dignity for Informal Street Artisans
            </h2>
            <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
              Google Maps charges commercial fees and caters exclusively to brick-and-mortar storefronts.
              GaliGuide operates with 100% open-source cartography to give street entrepreneurship digital permanence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-icesilver-300 shadow-street-sm">
              <div className="w-10 h-10 rounded-xl bg-marigold-100 text-aubergine flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-marigold-900" />
              </div>
              <h3 className="font-display font-bold text-lg text-aubergine mb-2">
                Zero Commission, Zero Fees
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Vendors pay zero rupees to be listed. Citizens discover them for free. Built with
                OpenStreetMap tiles and Leaflet without proprietary API toll gates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-icesilver-300 shadow-street-sm">
              <div className="w-10 h-10 rounded-xl bg-aubergine-100 text-aubergine flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-aubergine" />
              </div>
              <h3 className="font-display font-bold text-lg text-aubergine mb-2">
                Privacy by Vendor Consent
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Informal hawkers control their digital presence. Phone numbers are masked unless explicit
                consent is granted, preventing telemarketing spam and harassment.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-icesilver-300 shadow-street-sm">
              <div className="w-10 h-10 rounded-xl bg-marigold-100 text-marigold-900 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-aubergine mb-2">
                Topological Landmark Guidance
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                No postal street numbers needed. We guide citizens by local landmarks—banyan trees,
                police chowkis, temple gates, and street food corridors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Universal Footer */}
      <footer className="w-full py-8 bg-white border-t border-icesilver-300 text-xs text-on-surface-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-base text-aubergine">
              Gali<span className="text-marigold">Guide</span>
            </span>
            <span className="text-xs text-on-surface-variant">
              • Indore Hyperlocal Civic Discovery Initiative © 2026
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-aubergine font-semibold">
              Sarafa • Chhappan Dukan • Rajwada • Palasia • Vijay Nagar
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
