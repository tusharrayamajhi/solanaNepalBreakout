

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardStats from '@/components/DashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchDashboardStats, Order } from '@/utils/api';
import { ShoppingBag } from 'lucide-react';
import API_URL from '@/utils/API_URL';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null); // Store user profile
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [] as Order[],
    salesByCategory: [] as { category: string; sales: number }[],
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      fetchUserAndBusiness(token);
    }
  }, [navigate]);

  const fetchUserAndBusiness = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}auth/profile`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUserData(data);

      if (!data.businesses) {
        navigate('/business-details');
      } else {
        loadData();
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const loadData = async () => {
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        title="Dashboard"
        subtitle="Welcome back to your business overview"
      />

      {isLoading ? (
        <div className="py-20 text-center">
          <div
            className="animate-spin inline-block w-8 h-8 border-2 border-current border-t-transparent text-primary rounded-full"
            aria-hidden="true"
          ></div>
          <p className="mt-4 text-gray-500">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <DashboardStats
            totalSales={stats.totalSales}
            totalOrders={stats.totalOrders}
            totalCustomers={stats.totalCustomers}
            totalProducts={stats.totalProducts}
            salesByCategory={stats.salesByCategory}
          />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Recent Orders</CardTitle>
              <ShoppingBag size={20} className="text-dashboard-blue" />
            </CardHeader>
            <CardContent>
              {stats.recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent orders found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-2 font-medium">Order ID</th>
                        <th className="pb-2 font-medium">Customer</th>
                        <th className="pb-2 font-medium">Date</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100">
                          <td className="py-3 font-medium">#{order.id}</td>
                          <td className="py-3">{order.customerName}</td>
                          <td className="py-3">{formatDate(order.date)}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 text-right font-medium">
                            {formatCurrency(order.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
