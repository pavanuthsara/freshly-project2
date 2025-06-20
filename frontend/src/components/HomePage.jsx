import React, { Suspense, lazy, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

// Lazy-loaded components
const Hero = lazy(() => import('./home/Hero'));
const Categories = lazy(() => import('./home/Categories'));
const FeaturedProducts = lazy(() => import('./home/FeaturedProducts'));
const FarmerSpotlight = lazy(() => import('./home/FarmerSpotlight'));
const HowItWorks = lazy(() => import('./home/HowItWorks'));
const Testimonials = lazy(() => import('./home/Testimonials'));
const CallToAction = lazy(() => import('./home/CallToAction'));

const HomePage = () => {
  // Animation triggers using Intersection Observer
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [categoriesRef, categoriesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [productsRef, productsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [spotlightRef, spotlightInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [howItWorksRef, howItWorksInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="home-page min-h-screen bg-gray-50 text-gray-800 font-sans"
      role="main"
      aria-label="Freshly.lk Homepage"
    >
      <Suspense fallback={<div className="flex items-center justify-center h-screen bg-gray-100"><p className="text-lg text-emerald-600">Loading...</p></div>}>
        {/* Hero Section */}
        <section
          ref={heroRef}
          className={`transition-opacity duration-1000 ${heroInView ? 'opacity-100' : 'opacity-0'}`}
          aria-labelledby="hero-title"
        >
          <Hero />
        </section>

        {/* Categories Section */}
        <section
          ref={categoriesRef}
          className={`transition-opacity duration-1000 ${categoriesInView ? 'opacity-100' : 'opacity-0'}`}
          aria-labelledby="categories-title"
        >
          <Categories />
        </section>

        {/* Featured Products Section */}
        <section
          ref={productsRef}
          className={`transition-opacity duration-1000 ${productsInView ? 'opacity-100' : 'opacity-0'}`}
          aria-labelledby="featured-products-title"
        >
          <FeaturedProducts />
        </section>

        {/* Farmer Spotlight Section */}
        <section
          ref={spotlightRef}
          className={`transition-opacity duration-1000 ${spotlightInView ? 'opacity-100' : 'opacity-0'}`}
          aria-labelledby="farmer-spotlight-title"
        >
          <FarmerSpotlight />
        </section>

        {/* How It Works Section */}
        <section
          ref={howItWorksRef}
          className={`transition-opacity duration-1000 ${howItWorksInView ? 'opacity-100' : 'opacity-0'}`}
          aria-labelledby="how-it-works-title"
        >
          <HowItWorks />
        </section>

        {/* Testimonials Section */}
        <section
          ref={testimonialsRef}
          className={`transition-opacity duration-1000 ${testimonialsInView ? 'opacity-100' : 'opacity-0'}`}
          aria-labelledby="testimonials-title"
        >
          <Testimonials />
        </section>

        {/* Call to Action Section */}
        <section
          ref={ctaRef}
          className={`transition-opacity duration-1000 ${ctaInView ? 'opacity-100' : 'opacity-0'}`}
          aria-labelledby="cta-title"
        >
          <CallToAction />
        </section>
      </Suspense>
    </div>
  );
};

export default HomePage;