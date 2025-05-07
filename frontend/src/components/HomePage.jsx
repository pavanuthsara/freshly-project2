import React from 'react';
import { Hero } from './home/Hero';
import { Categories } from './home/Categories';
import { FeaturedProducts } from './home/FeaturedProducts';
import { FarmerSpotlight } from './home/FarmerSpotlight';
import { HowItWorks } from './home/HowItWorks';
import { Testimonials } from './home/Testimonials';
import { CallToAction } from './home/CallToAction';

const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <FarmerSpotlight />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default HomePage;