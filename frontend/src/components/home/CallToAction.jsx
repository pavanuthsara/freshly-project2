import React from 'react';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login-dashboard');
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:shadow-2xl">
          <div className="relative px-6 py-16 sm:px-12 lg:px-16">
            {/* Background pattern */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMC0xMmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiNmZmZmZmYxMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
            </div>
            <div className="relative text-center max-w-3xl mx-auto">
              <h2 id="cta-title" className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Start enjoying farm-fresh produce today
              </h2>
              <p className="text-lg text-emerald-50 mb-8">
                Join Freshly.lk and discover the taste of locally grown, fresh
                produce delivered directly from Sri Lankan farms to your
                doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3 rounded-lg font-medium shadow-lg transition-all duration-300 transform hover:scale-105">
                  Create an Account
                </button>
                <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                  Learn More
                </button>
                <button
                  onClick={handleLoginClick}
                  className="flex items-center justify-center gap-2 bg-emerald-800 text-white hover:bg-emerald-700 px-8 py-3 rounded-lg font-medium shadow-lg transition-all duration-300 group transform hover:scale-105"
                >
                  <LogIn size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                  <span>Quick Login</span>
                </button>
              </div>
              <p className="mt-6 text-emerald-100 text-sm">
                Already have an account?{' '}
                <a href="#" className="underline text-white font-medium">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;