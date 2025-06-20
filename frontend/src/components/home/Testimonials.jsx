import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Priya Mendis',
    location: 'Colombo',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    rating: 5,
    text:
      'The vegetables I receive from Freshly.lk are so much fresher than supermarket produce. I love knowing exactly which farm my food comes from.',
  },
  {
    id: 2,
    name: 'Amal Fernando',
    location: 'Kandy',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    rating: 5,
    text:
      'As a chef, quality ingredients are crucial. Freshly.lk delivers exceptional farm-fresh produce that truly elevates my cooking.',
  },
  {
    id: 3,
    name: 'Nisha Perera',
    location: 'Galle',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    rating: 4,
    text:
      "I've been ordering from Freshly.lk for 6 months now. The convenience, quality, and supporting local farmers makes this service invaluable.",
  },
];

const Testimonials = () => {
  return (
    <div className="bg-emerald-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="testimonials-title" className="text-3xl font-bold text-gray-800 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who enjoy farm-fresh produce
            delivered to their door
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-md p-8 relative transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover mr-4"
                  loading="lazy"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {testimonial.location}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 italic">"{testimonial.text}"</p>
              <div className="absolute -top-4 -left-4 text-emerald-600 opacity-20">
                <svg
                  className="w-12 h-12"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a
            href="#"
            className="text-emerald-600 hover:text-emerald-800 font-medium underline transition-colors"
          >
            Read more customer reviews
          </a>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;