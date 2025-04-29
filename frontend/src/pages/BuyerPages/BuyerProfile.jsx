import React, { useEffect, useState } from 'react';
import { UserIcon, MailIcon, CalendarIcon, ShoppingBagIcon, StarIcon, TrendingUpIcon, AwardIcon, Loader2Icon, SettingsIcon, EditIcon, BellIcon, MessageCircleIcon, ChevronRightIcon, AlertCircleIcon, AlertTriangleIcon } from 'lucide-react';
import BuyerSidebar from './BuyerSidebar';

const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 8
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - progress / 100 * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle 
          className="text-gray-200" 
          strokeWidth={strokeWidth} 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx={size / 2} 
          cy={size / 2} 
        />
        <circle 
          className="text-emerald-500 transition-all duration-1000 ease-in-out" 
          strokeWidth={strokeWidth} 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round" 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx={size / 2} 
          cy={size / 2} 
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-700">{progress}%</span>
        <span className="text-xs text-gray-500">Complete</span>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  trend,
  color = 'emerald'
}) => {
  // Ensure icon is valid before using it
  const Icon = icon || (() => null);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`bg-white rounded-xl p-6 shadow-lg transition-all duration-300 transform ${isHovered ? 'scale-105 shadow-xl' : ''}`} 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-${color}-50 rounded-lg transition-colors duration-300`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        {trend && (
          <span className={`text-${color}-600 text-sm font-medium flex items-center`}>
            <TrendingUpIcon className="h-4 w-4 mr-1" />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1 transition-transform duration-300">
        {value}
      </h3>
      <p className="text-sm text-gray-500">{label}</p>
      {isHovered && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center">
            View Details
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </a>
        </div>
      )}
    </div>
  );
};

const AchievementBadge = ({
  icon,
  label,
  progress,
  isUnlocked
}) => {
  // Ensure icon is valid before using it
  const Icon = icon || (() => null);
  
  return (
  <div className="group relative flex flex-col items-center p-4">
    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${isUnlocked ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg' : 'bg-gray-200'}`}>
      <Icon className={`h-8 w-8 ${isUnlocked ? 'text-white' : 'text-gray-400'}`} />
    </div>
    <span className="text-sm font-medium text-gray-700 text-center">
      {label}
    </span>
    {!isUnlocked && (
      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" 
          style={{
            width: `${progress}%`
          }} 
        />
      </div>
    )}
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="bg-black bg-opacity-75 text-white text-xs py-1 px-2 rounded">
        {isUnlocked ? 'Achieved!' : `${progress}% Progress`}
      </div>
    </div>
  </div>
  );
};

const QuickActionsMenu = () => {
  const [showComplaintTooltip, setShowComplaintTooltip] = useState(false);
  
  return (
    <div className="fixed bottom-8 right-8 flex flex-col space-y-2">
      <button className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
        <SettingsIcon className="h-6 w-6 text-gray-600 group-hover:text-emerald-600" />
      </button>
      <button className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
        <EditIcon className="h-6 w-6 text-gray-600 group-hover:text-emerald-600" />
      </button>
      <button className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
        <MessageCircleIcon className="h-6 w-6 text-gray-600 group-hover:text-emerald-600" />
      </button>
      <div className="relative">
        <button 
          className="bg-amber-500 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group animate-pulse"
          onMouseEnter={() => setShowComplaintTooltip(true)}
          onMouseLeave={() => setShowComplaintTooltip(false)}
          onClick={() => window.alert('Complaint form will open here!')}
        >
          <BellIcon className="h-6 w-6 text-white" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">!</span>
        </button>
        {showComplaintTooltip && (
          <div className="absolute bottom-full right-0 mb-2 bg-white p-3 rounded-lg shadow-xl w-48 text-sm text-gray-700 font-medium">
            Submit a complaint or feedback
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white transform rotate-45"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const ActivityTimelineItem = ({
  icon,
  title,
  description,
  time,
  status
}) => {
  // Ensure icon is valid before using it
  const Icon = icon || (() => null);
  
  return (
  <div className="flex items-start group">
    <div className="flex-shrink-0">
      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-5 w-5 text-emerald-600" />
      </div>
    </div>
    <div className="ml-4 flex-1">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
          {title}
        </h3>
        <span className="text-sm text-gray-500">{time}</span>
      </div>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
      {status && (
        <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
          {status}
        </div>
      )}
    </div>
  </div>
  );
};

const BuyerProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setTimeout(() => {
      setUser({
        name: 'Damith Chandrathilaka',
        email: 'damchandrathilake@gmail.com',
        totalOrders: 5,
        createdAt: '2024-12-01T00:00:00Z',
        lastOrderDate: '2025-04-15T00:00:00Z',
        stats: {
          totalSpent: 1250,
          avgOrderValue: 250,
          orderCompletion: 100,
          satisfaction: 98
        },
        achievements: [
          {
            id: 1,
            label: 'First Order',
            progress: 100,
            isUnlocked: true,
            icon: ShoppingBagIcon
          }, 
          {
            id: 2,
            label: 'Loyal Customer',
            progress: 75,
            isUnlocked: false,
            icon: AwardIcon
          }, 
          {
            id: 3,
            label: 'Top Rated',
            progress: 100,
            isUnlocked: true,
            icon: StarIcon
          }, 
          {
            id: 4,
            label: 'Early Bird',
            progress: 50,
            isUnlocked: false,
            icon: BellIcon
          }
        ],
        recentActivity: [
          {
            id: 1,
            type: 'order',
            title: 'Order #12345',
            description: 'Completed order for $249.99',
            time: '2 hours ago',
            status: 'Delivered'
          }
        ]
      });
      setIsLoading(false);
    }, 800);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="space-y-4">
          <Loader2Icon size={40} className="text-emerald-600 animate-spin mx-auto" />
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-600 mb-2">Loading your profile</p>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BuyerSidebar activeTab="profile" />
      <div className="flex-1">
        <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 pb-32 pt-12">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMC0xMmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiNmZmZmZmYxMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10 animate-pulse"></div>
          </div>
          <div className="relative px-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-6 md:mb-0">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl mr-6 transform hover:scale-105 transition-transform duration-300">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name} 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-emerald-50 flex items-center justify-center">
                      <UserIcon className="h-12 w-12 text-emerald-600" />
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {user.name}
                  </h1>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center text-emerald-50">
                      <MailIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center text-emerald-50">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300">
                  Edit Profile
                </button>
                <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors duration-300">
                  View Dashboard
                </button>
                <button 
                  className="relative group bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  onClick={() => window.alert('Complaint form will open here!')}
                >
                  <span className="flex items-center">
                    <BellIcon className="h-4 w-4 mr-2" />
                    Submit Feedback
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110">!</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative px-4 md:px-8 -mt-24 pb-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <ShoppingBagIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <span className="text-emerald-600 text-sm font-medium flex items-center">
                  <TrendingUpIcon className="h-4 w-4 mr-1" />
                  +2 this month
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {user.totalOrders}
              </h3>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
            
            <div className="flex-1 min-w-[200px] bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <StarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-blue-600 text-sm font-medium flex items-center">
                  <TrendingUpIcon className="h-4 w-4 mr-1" />
                  +12.5% vs last month
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                ${user.stats.avgOrderValue}
              </h3>
              <p className="text-sm text-gray-500">Average Order Value</p>
            </div>
            
            <div className="flex-1 min-w-[200px] bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <AwardIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {user.stats.satisfaction}%
              </h3>
              <p className="text-sm text-gray-500">Satisfaction Rate</p>
            </div>
            
            <div className="flex-1 min-w-[200px] bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <AwardIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {user.stats.orderCompletion}%
              </h3>
              <p className="text-sm text-gray-500">Order Completion</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Achievements</h2>
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {user.achievements.map(achievement => (
                <AchievementBadge 
                  key={achievement.id} 
                  icon={achievement.icon} 
                  label={achievement.label} 
                  progress={achievement.progress} 
                  isUnlocked={achievement.isUnlocked} 
                />
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
              <div className="flex space-x-2">
                <button 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`} 
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`} 
                  onClick={() => setActiveTab('all')}
                >
                  All Activity
                </button>
                <button 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeTab === 'complaints' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-100'}`} 
                  onClick={() => setActiveTab('complaints')}
                >
                  <AlertCircleIcon className="h-4 w-4 mr-1 inline-block" />
                  Complaints
                </button>
              </div>
            </div>
            <div className="space-y-6">
              {activeTab !== 'complaints' ? (
                [1, 2, 3].map((_, index) => (
                  <ActivityTimelineItem 
                    key={index} 
                    icon={ShoppingBagIcon} 
                    title={`Order #${12345 + index}`} 
                    description="Completed order for $249.99" 
                    time="2 hours ago" 
                    status="Delivered" 
                  />
                ))
              ) : (
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-amber-800">Submit a New Complaint</h3>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center">
                      <AlertTriangleIcon className="h-4 w-4 mr-2" />
                      New Complaint
                    </button>
                  </div>
                  <p className="text-amber-700 mb-2">No active complaints at the moment.</p>
                  <div className="flex items-center text-sm text-amber-600">
                    <AlertCircleIcon className="h-4 w-4 mr-2" />
                    <span>Submit a complaint about product quality, delivery, or customer service.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <QuickActionsMenu />
      </div>
    </div>
  );
};

export default BuyerProfile;