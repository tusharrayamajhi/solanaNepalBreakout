// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
// import Dashboard from "./pages/Dashboard";
// import Products from "./pages/Products";
// import Customers from "./pages/Customers";
// import Orders from "./pages/Orders";
// import Settings from "./pages/Settings";
// import NotFound from "./pages/NotFound";
// import Login from "./pages/Login";

// // Create a client
// const queryClient = new QueryClient();

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <div className="dark">
//           <Toaster />
//           <Sonner />
//           <BrowserRouter>
//             <div className="flex min-h-screen bg-background">
//               <Sidebar />
//               <div className="flex-1 ml-0 md:ml-64 transition-all">
//                 <Routes>
//                   <Route path="/" element={<Login />} />
//                   <Route path="/dashboard" element={<Dashboard />} />
//                   <Route path="/products" element={<Products />} />
//                   <Route path="/customers" element={<Customers />} />
//                   <Route path="/orders" element={<Orders />} />
//                   <Route path="/settings" element={<Settings />} />
//                   <Route path="*" element={<NotFound />} />
//                 </Routes>
//               </div>
//             </div>
//           </BrowserRouter>
//         </div>
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// }

// export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import {OrderDetails, Orders} from "./pages/Orders";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import BusinessDetails from "./pages/BusinessDetails";
import EditProductPage from "./components/EditProductPage";
import AddProductPage from "./pages/AddProductPage";
import SocialMediaPage from "./pages/SocialMedia";
import Customers from "./pages/Customers";
import AddPaymentMethod from "./pages/AddPaymentMethond";
import SolanaRedirect from "./pages/solana";

const queryClient = new QueryClient();

// Layout wrapper for pages that include Sidebar
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className=" flex min-h-screen bg-background">
    <Sidebar />
    <div className="flex-1 ml-0  transition-all">{children}</div>
  </div>
);
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes - no layout */}
              <Route path="/" element={<Login />} />
              <Route path="/business-details" element={<BusinessDetails />} />

              {/* Protected routes with layout */}
              <Route
                path="/dashboard"
                element={
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                }
              />
              <Route
                path="/products/edit/:id"
                element={
                  <AppLayout>
                    <EditProductPage />
                  </AppLayout>
                }
              />
              <Route
                path="/solana/:userId/:orderId/:businessId"
                element={
                  <AppLayout>
                    <SolanaRedirect />
                  </AppLayout>
                }
              />
               <Route
                path="/order-details/:orderId"
                element={
                  <AppLayout>
                    <OrderDetails />
                  </AppLayout>
                }
              />
              
              <Route
                path="/social-media"
                element={
                  <AppLayout>
                    <SocialMediaPage />
                  </AppLayout>
                }
              />
               <Route
                path="/products/add"
                element={
                  <AppLayout>
                    <AddProductPage />
                  </AppLayout>
                }
              />
              
              <Route
                path="/products"
                element={
                  <AppLayout>
                    <Products />
                  </AppLayout>
                }
              />
              <Route
                path="/customer"
                element={
                  <AppLayout>
                    <Customers />
                  </AppLayout>
                }
              />
               <Route
                path="/payment"
                element={
                  <AppLayout>
                    <AddPaymentMethod />
                  </AppLayout>
                }
              />
              <Route
                path="/order"
                element={
                  <AppLayout>
                    <Orders />
                  </AppLayout>
                }
              />
              <Route
                path="/settings"
                element={
                  <AppLayout>
                    <Settings />
                  </AppLayout>
                }
              />
              <Route
                path="*"
                element={
                  <AppLayout>
                    <NotFound />
                  </AppLayout>
                }
              />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;