import React, { useState } from 'react';
import { 
  Sprout, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function FarmerDashboard() {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { icon: Sprout, label: 'My Products' },
    { icon: Users, label: 'My Profile' },
    { icon: Calendar, label: 'Complaints' },
    { icon: BarChart3, label: 'Analytics' },,
    { icon: HelpCircle, label: 'Help Bot' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`w-64 bg-green-800 min-h-screen p-4 transition-all duration-300 ease-in-out relative`}
      >
        {/* Logo Section */}
        <div className="flex items-center mb-8">
          <Sprout className="h-8 w-8 text-green-100" />
          {isExpanded && (
            <span className="text-green-100 text-xl font-bold ml-3">
              Freshly.lk
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`
                flex items-center px-3 py-3 rounded-lg
                text-green-100 hover:bg-green-700 transition-colors
                ${index === 0 ? 'bg-green-700' : ''}
              `}
            >
              <item.icon className="h-6 w-6" />
              {isExpanded && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-gray-800">Welcome to Freshly.lk farmer's dashboard</h1>
        <p className="text-gray-600 mt-2">Select an option from the navigation menu to get started.</p>
      </div>
    </div>
  );
}

export default FarmerDashboard;