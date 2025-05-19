
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import CustomerList from '@/components/CustomerList';
import { fetchCustomers } from '@/utils/api';
import { useNavigate } from 'react-router-dom';
import API_URL from '@/utils/API_URL';

const Customers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
   const navigate = useNavigate();
  
  
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    const fetchUser = async ()=>{
      const res = await fetch(`${API_URL}auth/profile`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (!data.businesses) {
        navigate("/business-details");
      } 
    }
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Error loading customers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser()
    loadData();
  }, [searchQuery]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  return (
    <div className="p-6">
      <DashboardHeader 
        title="Customers" 
        subtitle="Manage your customer relationships"
      />
      
      <div className="mt-6">
        <CustomerList 
          customers={customers} 
          isLoading={isLoading} 
          onSearch={handleSearch}
        />
      </div>
    </div>
  );
};

export default Customers;