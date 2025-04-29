// BuyerAnalytics.jsx
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { BarChart2Icon } from 'lucide-react';

const BuyerAnalytics = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState('all');

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          const sampleOrders = [
            { id: 1, status: 'delivered',  totalPrice: 2500, createdAt: '2025-01-15T08:30:00Z' },
            { id: 2, status: 'processing', totalPrice: 1800, createdAt: '2025-02-20T10:15:00Z' },
            { id: 3, status: 'delivered',  totalPrice: 3200, createdAt: '2025-03-05T14:45:00Z' },
            { id: 4, status: 'cancelled',  totalPrice: 1200, createdAt: '2025-03-18T09:20:00Z' },
            { id: 5, status: 'delivered',  totalPrice: 4500, createdAt: '2025-04-02T16:30:00Z' },
            { id: 6, status: 'processing', totalPrice: 2800, createdAt: '2025-04-15T11:10:00Z' },
          ];
          setOrders(sampleOrders);
          setLoading(false);
        }, 1000);
        // In production:
        // const res = await api.get('/orders/my-orders');
        // setOrders(res.data);
        // setLoading(false);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load order data');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders based on selected timeframe
  const getFilteredOrders = () => {
    if (timeframe === 'all' || !orders.length) return orders;
    const now = new Date();
    const cutoffDate = new Date(now);
    if (timeframe === '30days') cutoffDate.setDate(now.getDate() - 30);
    if (timeframe === '6months') cutoffDate.setMonth(now.getMonth() - 6);
    if (timeframe === '1year')   cutoffDate.setFullYear(now.getFullYear() - 1);
    return orders.filter(o => new Date(o.createdAt) >= cutoffDate);
  };
  const filteredOrders = getFilteredOrders();

  // Calculate order statistics
  const { totalOrders, totalSpent, avgOrderValue } = React.useMemo(() => {
    if (!filteredOrders.length) return { totalOrders: 0, totalSpent: 0, avgOrderValue: 0 };
    const total = filteredOrders.length;
    const spent = filteredOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    return { totalOrders: total, totalSpent: spent, avgOrderValue: spent / total };
  }, [filteredOrders]);

  // Prepare data for status pie chart
  const statusData = React.useMemo(() => {
    const counts = {};
    filteredOrders.forEach(o => counts[o.status] = (counts[o.status] || 0) + 1);
    return Object.entries(counts).map(([status, value]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value
    }));
  }, [filteredOrders]);

  // Prepare data for monthly spending bar chart
  const monthlyData = React.useMemo(() => {
    const monthly = {};
    filteredOrders.forEach(o => {
      const d = new Date(o.createdAt);
      const key = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthly[key] = (monthly[key] || 0) + o.totalPrice;
    });
    return Object.entries(monthly)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => new Date(a.name) - new Date(b.name))
      .slice(-6);
  }, [filteredOrders]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B'];
  const formatCurrency = val => `Rs. ${val.toFixed(2)}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <svg className="animate-spin text-teal-600 mr-3 h-6 w-6" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p className="text-slate-600">Loading your analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border-l-4 border-rose-500 p-4 my-4 rounded-md">
        <div className="flex">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <div>
            <h3 className="text-rose-800 font-medium">Error Loading Analytics</h3>
            <p className="text-rose-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-teal-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center">
          <BarChart2Icon className="h-5 w-5 text-teal-600 mr-2" />
          Order Analytics
        </h2>
        <select
          value={timeframe}
          onChange={e => setTimeframe(e.target.value)}
          className="border border-teal-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Time</option>
          <option value="30days">Last 30 Days</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-6 text-slate-500">
          No order data available for the selected timeframe.
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 shadow-sm border border-teal-100">
              <h3 className="text-teal-800 text-sm font-medium mb-1">Total Orders</h3>
              <p className="text-2xl font-semibold text-teal-900">{totalOrders}</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 shadow-sm border border-teal-100">
              <h3 className="text-teal-800 text-sm font-medium mb-1">Total Spent</h3>
              <p className="text-2xl font-semibold text-teal-900">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 shadow-sm border border-teal-100">
              <h3 className="text-teal-800 text-sm font-medium mb-1">Average Order Value</h3>
              <p className="text-2xl font-semibold text-teal-900">{formatCurrency(avgOrderValue)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-4 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-slate-800 font-medium mb-4 text-center">Order Status Distribution</h3>
              <div className="h-64">
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%" cy="50%"
                        outerRadius={80}
                        dataKey="value" nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={val => [`${val} orders`, 'Quantity']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    No status data to display
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Spending */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-4 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-slate-800 font-medium mb-4 text-center">Spending Trend</h3>
              <div className="h-64">
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={val => [formatCurrency(val), 'Amount']} />
                      <Bar dataKey="amount" fill="#0088FE" name="Amount Spent" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    No spending data to display
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BuyerAnalytics;
