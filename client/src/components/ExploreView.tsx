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
    { label: 'Joshi Flying Dahi Bada', query: 'Dahi Bada' },
    { label: 'Johny Hot Dog (Chappan)', query: 'Johny' },
    { label: 'Ramu Mochi (High Court)', query: 'Mochi' },
    { label: 'Nagori Shikanji (Sarafa)', query: 'Shikanji' },
    { label: 'Cycle Puncture Wale', query: 'Puncture' },
    { label: 'Chabi Wale Bhaiya', query: 'Key' },
    { label: 'Raffu Tailor (Malwa Mill)', query: 'Tailor' },
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
                  इन्दौर की असली गलियाँ • Local Street Atlas
                </span>
                <span className="text-aubergine-700 flex items-center gap-1 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-marigold-600" />
                  Sarafa • Chappan Dukan • Rajwada • Malharganj
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-6xl text-aubergine tracking-tight mb-3 sm:mb-4 leading-[1.15] font-black">
                Galiyon ke ustaad, thele aur gumtiyan —{' '}
                <span className="text-marigold underline decoration-marigold/40 underline-offset-4">
                  Apna Indore.
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant max-w-xl mb-5 sm:mb-7 leading-relaxed">
                From morning poha-jalebi to midnight Sarafa chaat; roadside cobblers under the banyan tree to alley key makers — verified in person by municipal ward teams, guided by street landmarks.
              </p>

              {/* Grand Dual-Input Search Console */}
              <form
                onSubmit={handleSearch}
                className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-street-md border border-icesilver-300 flex flex-col md:flex-row gap-2.5 items-stretch"
              >
                {/* Input 1: Trade / Service */}
                <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 bg-icesilver-50 rounded-xl border border-icesilver-200 focus-within:border-marigold focus-within:ring-2 focus-within:ring-marigold/20 transition-all min-h-[46px]">
                  <Search className="text-aubergine w-5 h-5 flex-shrink-0" />
                  <div className="flex flex-col w-full">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Kya Dhoond Rahe Hain? (Service / Vendor)
                    </span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Mochi, poha-jalebi, dahi bada, cycle puncture, chabi..."
                      className="bg-transparent border-0 outline-none text-base sm:text-sm text-on-surface placeholder:text-on-surface-variant/50 w-full font-medium touch-action-manipulation"
                    />
                  </div>
                </div>

                {/* Input 2: Indore Locality Dropdown */}
                <div className="w-full md:w-56 flex items-center gap-3 px-3.5 py-2.5 bg-icesilver-50 rounded-xl border border-icesilver-200 focus-within:border-marigold focus-within:ring-2 focus-within:ring-marigold/20 transition-all min-h-[46px]">
                  <MapPin className="text-marigold-700 w-5 h-5 flex-shrink-0" />
                  <div className="flex flex-col w-full">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Indore Ka Elaqa (Locality)
                    </span>
                    <select
                      value={selectedAreaId}
                      onChange={(e) => setSelectedAreaId(e.target.value)}
                      className="bg-transparent border-0 outline-none text-base sm:text-sm text-on-surface cursor-pointer w-full font-medium"
                    >
                      <option value="all">Poora Indore (All Localities)</option>
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
                  className="whitespace-nowrap px-6 min-h-[46px] w-full md:w-auto touch-action-manipulation justify-center"
                >
                  Gali Dhoondo (Find Vendors)
                </Button>
              </form>

              {/* Trending Quick Search Pills */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-bold text-aubergine uppercase tracking-wider mr-1">
                  Indori Favourites:
                </span>
                {trendingPills.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => onSearchSubmit(p.query)}
                    className="px-3 py-1.5 bg-white hover:bg-marigold-50 hover:text-aubergine hover:border-marigold-300 active:bg-marigold-100 rounded-full text-xs font-semibold text-on-surface-variant border border-icesilver-300 shadow-street-sm transition-all cursor-pointer touch-action-manipulation min-h-[34px]"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Authentic Indore Street Visual Composition */}
            <div className="lg:col-span-5 relative mt-3 lg:mt-0">
              <div className="relative w-full h-[260px] sm:h-[340px] md:h-[400px] rounded-2xl overflow-hidden shadow-street-lg bg-aubergine border-2 border-icesilver-300">
                <img
                  src={HERO_ASSET}
                  alt="Historic Indore street bazaar at twilight with handcarts and lanterns"
                  className="w-full h-full object-cover"
                />

                {/* Floating Street Verification Stamp */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shadow-street-md flex items-center gap-2 sm:gap-2.5 border border-icesilver-300">
                  <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-marigold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-marigold-600"></span>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[9px] sm:text-[10px] uppercase font-black text-aubergine tracking-wider">
                      Ward Verification
                    </span>
                    <span className="text-[11px] sm:text-xs text-marigold-900 font-bold">Zameeni Satyaapan (On-Ground)</span>
                  </div>
                </div>

                {/* Authentic Landmark Directional Banner */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-xl shadow-street-md border border-icesilver-300">
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-marigold-100 text-aubergine flex-shrink-0">
                      <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-marigold-900" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-aubergine">
                          Gali Ki Nishani (Street Landmark)
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-on-surface-variant">
                          High Court Gate 2
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-on-surface mt-0.5 sm:mt-1 font-medium leading-relaxed line-clamp-2 sm:line-clamp-none">
                        “Gate No. 2 ke saamne purane bargad ke ped ke peeche — Ramu Dada apne lakdi ke phad par leather silai auzaaron ke saath milenge.”
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
      <section className="w-full py-10 sm:py-14 bg-white border-b border-icesilver-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-marigold-700">
                Street Hawkers &amp; Karigars • पटरी दुकानदार व कारीगर
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-aubergine mt-1">
                Explore Essential Street Trades
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mt-2 md:mt-0 font-medium">
              Bhor 6 baje ki tapri chai aur garam poha se lekar raat 2 baje Sarafa ke dahi bade tak — Indore ko har din chalane wale hamare thele aur gumtiyan.
            </p>
          </div>

          {/* Categories Grid with 2-Column Mobile Ergonomics */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="group bg-canvas hover:bg-white active:bg-marigold-50/40 rounded-2xl p-3 sm:p-4 shadow-street-sm hover:shadow-street-md transition-all duration-200 cursor-pointer flex flex-col justify-between border border-icesilver-300 hover:border-marigold hover:-translate-y-1 touch-action-manipulation"
              >
                <div>
                  <div className="w-full h-24 sm:h-32 rounded-xl overflow-hidden bg-white border border-icesilver-200 mb-2.5 sm:mb-3 flex items-center justify-center p-2 group-hover:scale-102 transition-transform">
                    <img
                      src={getCategoryAsset(cat.slug)}
                      alt={cat.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="stall" size="sm">
                      {cat.vendorCount || 0} active
                    </Badge>
                  </div>

                  <h3 className="font-display font-bold text-sm sm:text-base text-aubergine group-hover:text-marigold-900 transition-colors">
                    {cat.name}
                  </h3>
                  {cat.hindiName && (
                    <span className="text-[11px] sm:text-xs font-semibold text-on-surface-variant block mt-0.5">
                      {cat.hindiName}
                    </span>
                  )}
                  <p className="text-[11px] sm:text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-3 sm:mt-4 pt-2 sm:pt-2.5 border-t border-icesilver-200 flex items-center justify-between text-[11px] sm:text-xs font-bold text-aubergine group-hover:text-marigold-800">
                  <span>View Stalls • ठेले देखें</span>
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
              Khuli Cartography • Zero Commission
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-aubergine mt-1.5">
              Har Thele Aur Phad Ko Mile Digital Pehchan
            </h2>
            <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
              Badi companiyan sirf AC showroom aur malls ko nakshe par dikhati hain. GaliGuide Indore ke har sidewalk thele, phad aur gumti wale ko bina kisi kharche ya commission ke internet par laata hai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-icesilver-300 shadow-street-sm">
              <div className="w-10 h-10 rounded-xl bg-marigold-100 text-aubergine flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-marigold-900" />
              </div>
              <h3 className="font-display font-bold text-lg text-aubergine mb-2">
                Na Koi Commission, Na Koi Fees
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                GaliGuide par judne ke liye thele wale bhaiyon se ek rupya bhi nahi liya jata, aur nagrikon ke liye bhi yeh poori tarah muft hai. 100% open mapping, bina kisi company ke toll tax ke.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-icesilver-300 shadow-street-sm">
              <div className="w-10 h-10 rounded-xl bg-aubergine-100 text-aubergine flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-aubergine" />
              </div>
              <h3 className="font-display font-bold text-lg text-aubergine mb-2">
                Vendor Ki Sahmati Aur Suraksha
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Har vendor ki niji jaankari surakshit hai. Jab tak vendor khud ijazat na dein, unka phone number public nahi hota taaki telemarketing aur fuzool calls se unka kaam na ruke.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-icesilver-300 shadow-street-sm">
              <div className="w-10 h-10 rounded-xl bg-marigold-100 text-marigold-900 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-aubergine mb-2">
                Desi Nishaniyon Se Asli Rasta (Landmarks)
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Thele aur patri par koi house number ya pincode nahi hota. Hum aapko seedhe le jaate hain mandir ke gate, purane bargad ke ped, police chowki aur gali ke mod ki nishani se.
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
              • Indore Ki Galiyon Ka Khula Naksheybaaz © 2026 • Dedicated to Street Entrepreneurs
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-aubergine font-semibold">
              Sarafa • Chappan Dukan • Rajwada • Malharganj • Vijay Nagar
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
