
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  CreditCard, 
  ShoppingBag, 
  Users, 
  Package,
  TrendingUp
} from 'lucide-react';

interface DashboardStatsProps {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  salesByCategory: {category: string; sales: number}[];
}

const DashboardStats = ({
  totalSales,
  totalOrders,
  totalCustomers,
  totalProducts,
  salesByCategory
}: DashboardStatsProps) => {
  // Format numbers for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Generate mock sales data for the chart
  const salesData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - 5 + i) % 12;
      const month = months[monthIndex >= 0 ? monthIndex : monthIndex + 12];
      
      // Create some random but increasing sales data
      const baseSale = 2000 + Math.floor(Math.random() * 1000);
      const sale = baseSale + (i * 500) + Math.floor(Math.random() * 500);
      
      return {
        name: month,
        sales: sale
      };
    });
  }, []);
  
  // Colors for the category chart
  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#10b981', '#ef4444', '#f97316'];
  
  return (
    <div className="space-y-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-dashboard-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+12.5% from last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-dashboard-indigo" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+8.2% from last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-dashboard-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+5.3% from last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Products</CardTitle>
            <Package className="h-4 w-4 text-dashboard-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-dashboard-gray flex items-center mt-1">
              <span>Active inventory</span>
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      compactDisplay: 'short'
                    }).format(value)
                  }
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Sales']}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesByCategory}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="category" />
                <YAxis 
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      compactDisplay: 'short'
                    }).format(value)
                  }
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Sales']}
                />
                <Bar dataKey="sales">
                  {salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;
