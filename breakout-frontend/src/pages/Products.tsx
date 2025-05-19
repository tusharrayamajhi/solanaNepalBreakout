import { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import ProductList from "@/components/ProductList";
import { fetchProducts } from "@/utils/api";
import { useNavigate } from "react-router-dom";
import API_URL from "@/utils/API_URL";
// import type { Product } from '@/types/product';  // if you have a separate type file

const Products = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
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
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser()
    loadData();
  }, []);

  return (
    <div className="p-6">
      <DashboardHeader
        title="Products"
        subtitle="Manage your product inventory"
      />

      <div className="mt-6">
        <ProductList
          products={products}
          isLoading={isLoading}
          // productId={products.id}
          // Removed search and category handlers because filters are not used
        />
      </div>
    </div>
  );
};

export default Products;
