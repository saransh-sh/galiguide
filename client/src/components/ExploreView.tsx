import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, CheckCircle2, ShieldAlert, Sparkles, Navigation } from 'lucide-react';
import { Category, Area } from '../types';
import { CategoryIcon } from '../utils/categoryIcons';

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
    { label: 'Ramesh Cobbler', query: 'Ramesh' },
    { label: 'Kulhad Chai', query: 'Chai' },
    { label: 'Cycle Puncture', query: 'Puncture' },
    { label: 'Emergency Tailor', query: 'Tailor' },
    { label: 'Flying Dahi Bada', query: 'Dahi Bada' },
    { label: 'Key Maker', query: 'Chabi' },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Immersive Editorial Hero */}
      <section className="relative w-full overflow-hidden bg-surface-container-low pt-8 pb-16 lg:pb-24 border-b border-surface-container-high/40">
        {/* Ambient Gradient Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Headline & Dual Search Console */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-on-secondary text-xs font-bold tracking-wider uppercase">
                  Hyperlocal Street Cartography
                </span>
                <span className="text-tertiary flex items-center gap-1 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Sarafa • Chhappan • Rajwada
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-on-surface tracking-tight mb-4 leading-tight">
                Your neighbourhood has{' '}
                <span className="text-primary italic font-display">more to offer.</span>
              </h1>

              <p className="text-base sm:text-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed">
                Find the People Behind Your Streets. Discover sidewalk cobblers, roadside chai masters,
                cycle mechanics, and informal street hawkers across Indore with verified footsteps
                and generational pride.
              </p>

              {/* Grand Dual-Input Search Console */}
              <form
                onSubmit={handleSearch}
                className="bg-surface-container-lowest rounded-2xl p-2 sm:p-3 shadow-xl border border-surface-container-high/80 flex flex-col md:flex-row gap-2.5 items-stretch"
              >
                {/* Input 1: Trade / Service */}
                <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-surface-container rounded-xl">
                  <Search className="text-primary w-5 h-5 flex-shrink-0" />
                  <div className="flex flex-col w-full">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Need / Service
                    </span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cobbler, cycle puncture, kadak chai..."
                      className="bg-transparent border-0 outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60 w-full font-medium"
                    />
                  </div>
                </div>

                {/* Input 2: Indore Area Dropdown */}
                <div className="w-full md:w-56 flex items-center gap-3 px-4 py-2.5 bg-surface-container rounded-xl">
                  <MapPin className="text-secondary w-5 h-5 flex-shrink-0" />
                  <div className="flex flex-col w-full">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Indore Gali
                    </span>
                    <select
                      value={selectedAreaId}
                      onChange={(e) => setSelectedAreaId(e.target.value)}
                      className="bg-transparent border-0 outline-none text-sm text-on-surface cursor-pointer w-full font-medium"
                    >
                      <option value="all">Everywhere in Indore</option>
                      {areas.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Primary Find CTA */}
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-primary text-on-primary font-semibold text-sm rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <span>Locate Cart</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Trending Quick Pills */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mr-1">
                  Trending:
                </span>
                {trendingPills.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => onSearchSubmit(p.query)}
                    className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded-full text-xs font-medium text-on-surface border border-surface-container-high/60 transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Editorial Visual Composition */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative w-full h-[400px] sm:h-[440px] rounded-2xl overflow-hidden shadow-2xl bg-surface-container-high border border-surface-container-high">
                <img
                  src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80"
                  alt="Historic Indore street bazaar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/30 to-transparent" />

                {/* Floating Street Verification Stamp */}
                <div className="absolute top-4 right-4 bg-surface-container-lowest/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 border border-white/40">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-on-surface tracking-widest">
                      Live Street Registry
                    </span>
                    <span className="text-xs text-secondary font-bold">22 Mapped Hawkers</span>
                  </div>
                </div>

                {/* Authentic Landmark Directional Banner */}
                <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/95 backdrop-blur-md p-3.5 rounded-xl shadow-xl border border-white/40">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary-fixed text-on-primary-fixed flex-shrink-0">
                      <Navigation className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary">
                          Hyperlocal Landmark Guide
                        </span>
                        <span className="text-[11px] font-medium text-on-surface-variant">
                          High Court Bench Gate 2
                        </span>
                      </div>
                      <p className="text-xs text-on-surface mt-1 font-medium leading-relaxed">
                        “Look behind the historic banyan tree across Gate 2; find master cobbler Ramu
                        sitting on the wooden stool with leather repair tools.”
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
      <section className="w-full py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-secondary">
                Street Taxonomy
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-on-surface mt-1">
                Everyday Informal Guilds
              </h2>
            </div>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-md mt-2 md:mt-0">
              Hand-charted micro-occupations keeping Indore self-reliant, sustainable, and vibrant from dawn
              till past midnight.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="group bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between border border-surface-container-high/60 hover:border-primary/40 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${cat.color}15`,
                        color: cat.color,
                      }}
                    >
                      <CategoryIcon iconName={cat.icon} size={24} />
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded-full font-bold">
                      {cat.vendorCount || 0} vendors
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-on-surface group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Explore Guild</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Cultural & Civic Value Proposition */}
      <section className="w-full py-16 bg-surface-container-low border-t border-surface-container-high/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-bold text-secondary">
              Zero-Cost Civic Philosophy
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-on-surface mt-2">
              Dignity for Informal Micro-Artisans
            </h2>
            <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">
              Google Maps charges commercial fees and caters exclusively to brick-and-mortar storefronts.
              GaliGuide runs on 100% open-source cartography to give our streets digital permanence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface mb-2">
                Zero Commission, Zero Fees
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Vendors pay zero rupees to be listed. Citizens discover them for free. Built with
                OpenStreetMap tiles and Leaflet without proprietary API toll gates.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface mb-2">
                Privacy By Consent
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Informal hawkers control their digital presence. Phone numbers are masked unless explicit
                consent is granted, preventing telemarketing spam and harassment.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface mb-2">
                Hyperlocal Topological Landmarks
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                No postal street numbers needed. We guide citizens by local landmarks—banyan trees,
                police chowkis, temple gates, and street food corridors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 bg-surface-container border-t border-surface-container-high text-xs text-on-surface-variant">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-display font-bold text-base text-on-surface">
              Gali<span className="text-primary">Guide</span>
            </span>
            <span className="ml-2 text-xs text-on-surface-variant">
              • Indore Hyperlocal Civic Discovery Initiative © 2026
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-secondary font-semibold">
              Sarafa • Chhappan Dukan • Rajwada • Palasia • Vijay Nagar
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
