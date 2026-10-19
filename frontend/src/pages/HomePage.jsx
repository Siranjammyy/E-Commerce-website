import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  RotateCcw,
  Truck,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProducts } from '../actions/productActions';

const HomePage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('keyword') || '';
  const selectedCategory = queryParams.get('category') || 'all';

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const categories = [
    { id: 'all', label: 'All Artifacts' },
    { id: 'Audio', label: 'Acoustics' },
    { id: 'Electronics', label: 'Workspace' },
    { id: 'Cameras', label: 'Optics' },
    { id: 'Gaming', label: 'Interactive' },
    { id: 'Accessories', label: 'Peripherals' },
  ];

  useEffect(() => {
    dispatch(listProducts(keyword, selectedCategory));
  }, [dispatch, keyword, selectedCategory]);

  const handleCategorySelect = (category) => {
    const params = new URLSearchParams(location.search);
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    const searchString = params.toString();
    navigate({ search: searchString ? `?${searchString}` : '' });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      return;
    }
    setNewsletterStatus('success');
    setNewsletterEmail('');
    setTimeout(() => setNewsletterStatus(null), 5000);
  };

  return (
    <div className="bg-canvas min-h-screen text-charcoal">
      {/* 1. Asymmetrical Editorial Hero Section */}
      {!keyword && (
        <section className="relative border-b border-sand/40 overflow-hidden bg-ivory/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
              {/* Left Column: Editorial Headline & Copy */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="w-6 h-px bg-olive"></span>
                  <span className="text-[11px] uppercase tracking-[0.25em] text-olive font-medium">
                    VERO &bull; Edition 2026
                  </span>
                </div>

                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-charcoal mb-6">
                  Objects of utility, <br className="hidden sm:inline" />
                  <span className="italic font-light">engineered</span> for living.
                </h1>

                <p className="text-charcoal/70 text-sm sm:text-base leading-relaxed max-w-xl mb-10 font-light">
                  A curated inventory of high-fidelity acoustic monitors, precision optics,
                  and tactile computing essentials. Conceived with quiet craftsmanship and 
                  uncompromising performance.
                </p>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <a
                    href="#catalog"
                    className="group inline-flex items-center gap-3 bg-charcoal text-ivory text-xs uppercase tracking-widest px-8 py-4 font-medium hover:bg-olive transition duration-300 shadow-sm"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>

                  <Link
                    to="/cart"
                    className="inline-flex items-center gap-2 border border-sand hover:border-charcoal text-charcoal text-xs uppercase tracking-widest px-7 py-4 font-medium transition duration-300 bg-white/60"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-olive" />
                    <span>View Your Bag</span>
                  </Link>
                </div>

                {/* Sub-hero trust marks */}
                <div className="mt-14 pt-8 border-t border-sand/40 grid grid-cols-3 gap-4 text-left">
                  <div>
                    <span className="block font-serif text-lg sm:text-xl text-charcoal">01</span>
                    <span className="text-[11px] text-charcoal/60 uppercase tracking-wider">Direct Warranty</span>
                  </div>
                  <div>
                    <span className="block font-serif text-lg sm:text-xl text-charcoal">02</span>
                    <span className="text-[11px] text-charcoal/60 uppercase tracking-wider">Complimentary Transit</span>
                  </div>
                  <div>
                    <span className="block font-serif text-lg sm:text-xl text-charcoal">03</span>
                    <span className="text-[11px] text-charcoal/60 uppercase tracking-wider">30-Day Evaluation</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Hero Imagery Frame */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none bg-white border border-sand/70 p-3 sm:p-4 shadow-sm">
                  <div className="aspect-[4/5] bg-sand/20 overflow-hidden relative group">
                    <img
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
                      alt="Acoustic high fidelity headphones in studio lighting"
                      className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                    />
                    <span className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 text-[9px] uppercase tracking-widest text-olive font-semibold border border-sand/60">
                      Curator Highlight
                    </span>
                  </div>
                  <div className="pt-4 pb-2 px-1 flex items-center justify-between border-t border-sand/40 mt-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50 block">
                        Featured Reference
                      </span>
                      <p className="font-serif text-base text-charcoal font-medium">
                        Acoustic Precision Series
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-olive font-medium bg-sand/30 px-2.5 py-1 border border-sand/50">
                      Studio Fidelity
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Curated Category Showcase */}
      {!keyword && (
        <section className="py-14 sm:py-20 border-b border-sand/40 bg-canvas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-sand/40">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] text-olive font-medium block mb-1.5">
                  Disciplines & Form
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-charcoal">
                  Explore by Department
                </h2>
              </div>
              <p className="text-xs text-charcoal/60 mt-2 sm:mt-0 max-w-sm text-left sm:text-right">
                Every department adheres to rigorous benchmarks of acoustic fidelity,
                ergonomic calibration, and visual harmony.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  title: 'Acoustics & Sound',
                  category: 'Audio',
                  count: 'High-Fidelity',
                  image:
                    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
                },
                {
                  title: 'Optical & Imaging',
                  category: 'Cameras',
                  count: 'Full-Frame Precision',
                  image:
                    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
                },
                {
                  title: 'Compute & Workspace',
                  category: 'Electronics',
                  count: 'Modern Performance',
                  image:
                    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
                },
                {
                  title: 'Interactive Gaming',
                  category: 'Gaming',
                  count: 'Next-Gen Immersion',
                  image:
                    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80',
                },
              ].map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleCategorySelect(cat.category);
                    const el = document.getElementById('catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group text-left block focus:outline-none"
                >
                  <div className="aspect-[4/5] bg-sand/20 overflow-hidden relative mb-3 border border-sand/50">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-charcoal/15 group-hover:bg-charcoal/5 transition-colors" />
                    <span className="absolute bottom-3 left-3 bg-white/95 px-2.5 py-1 text-[10px] uppercase tracking-widest text-charcoal font-medium border border-sand/60">
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg text-charcoal group-hover:text-olive transition">
                    {cat.title}
                  </h3>
                  <span className="text-[11px] uppercase tracking-widest text-charcoal/50 group-hover:text-olive transition">
                    Explore Department &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Main Catalog Section with Filter Strip */}
      <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-sand/50 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-4 h-px bg-olive"></span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-olive font-semibold">
                Available Inventory
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              {keyword
                ? `Results for “${keyword}”`
                : selectedCategory === 'all'
                ? 'The Collection'
                : `${categories.find((c) => c.id === selectedCategory)?.label || selectedCategory}`}
            </h2>
            <p className="text-xs text-charcoal/60 mt-1.5 font-light">
              {products?.length || 0} active artifacts ready for dispatch
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-charcoal/40 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-olive" />
              Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`text-xs px-3.5 py-1.5 transition uppercase tracking-wider font-medium ${
                  selectedCategory === cat.id
                    ? 'bg-charcoal text-ivory border border-charcoal'
                    : 'bg-white text-charcoal/70 border border-sand hover:border-charcoal hover:text-charcoal'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Body */}
        {loading ? (
          <div className="py-20">
            <Loader text="Connecting to VERO backend database..." />
          </div>
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : products && products.length === 0 ? (
          <div className="bg-white border border-sand p-12 text-center max-w-lg mx-auto shadow-sm my-8">
            <ShoppingBag className="w-10 h-10 text-sand mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-charcoal mb-2">
              No matching artifacts found
            </h3>
            <p className="text-xs text-charcoal/60 mb-6 leading-relaxed">
              We couldn’t find items matching your selection. Try clearing your search keyword
              or browsing all departments.
            </p>
            <button
              onClick={() => {
                handleCategorySelect('all');
                if (keyword) navigate('/');
              }}
              className="bg-charcoal text-ivory px-6 py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-olive transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* 4. Editorial Story / Manifesto Banner */}
      {!keyword && (
        <section className="bg-ivory border-y border-sand/40 py-20 sm:py-28 my-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="text-[11px] uppercase tracking-[0.25em] text-olive font-medium block mb-4">
              Our Story
            </span>
            <blockquote className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light text-charcoal leading-[1.25] mb-8">
              “Every tool we surround ourselves with should feel deliberate, enduring, and 
              honestly crafted.”
            </blockquote>
            <p className="text-xs sm:text-sm text-charcoal/70 max-w-xl mx-auto leading-relaxed mb-10 font-light">
              We reject planned obsolescence. Every audio monitor, camera body, and console
              stocked at VERO is vetted for build longevity, serviceability,
              and aesthetic clarity.
            </p>
            <div className="inline-flex items-center gap-8 text-[11px] uppercase tracking-widest text-charcoal/60">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-olive" /> Verified Hardware
              </span>
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-olive" /> Secure Global Dispatch
              </span>
              <span className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-olive" /> Fair Evaluations
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 5. Refined Newsletter Subscription */}
      {!keyword && (
        <section className="py-16 sm:py-20 bg-canvas">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-olive font-semibold block mb-2">
              The Gazette
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-charcoal mb-3">
              Receive the VERO Gazette
            </h3>
            <p className="text-xs text-charcoal/60 mb-6 font-light max-w-md mx-auto">
              Fortnightly dispatches covering acoustic engineering, product design, and 
              exclusive inventory drops. No promotions or spam.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row items-stretch justify-center max-w-md mx-auto gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-white border border-sand px-4 py-3 text-xs text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-charcoal flex-1 transition"
                required
              />
              <button
                type="submit"
                className="bg-charcoal text-ivory text-xs uppercase tracking-widest px-6 py-3 font-medium hover:bg-olive transition whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>

            {newsletterStatus === 'success' && (
              <p className="mt-4 text-xs text-olive flex items-center justify-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5" /> Welcome to the Gazette. You are subscribed.
              </p>
            )}
            {newsletterStatus === 'error' && (
              <p className="mt-4 text-xs text-red-600">
                Please enter a valid email address.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
