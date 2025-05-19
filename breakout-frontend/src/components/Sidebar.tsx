// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { cn } from "@/lib/utils";
// import {
//   LayoutDashboard,
//   Package,
//   Users,
//   ShoppingCart,
//   Settings,
//   Menu,
//   X,
//   LogOut,
//   CreditCard,
//   Share2,
// } from "lucide-react";

// interface SidebarProps {
//   className?: string;
// }

// const Sidebar: React.FC<SidebarProps> = ({ className }) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const location = useLocation();

//   const toggleSidebar = () => setCollapsed(!collapsed);

//   const menuItems = [
//     {
//       title: "Dashboard",
//       icon: LayoutDashboard,
//       path: "/dashboard",
//     },
//     {
//       title: "Product Management",
//       icon: Package,
//       path: "/products",
//     },
//     {
//       title: "Social Media",
//       icon: Share2,
//       path: "/social-media",
//     },
//     {
//       title: "Customers",
//       icon: Users,
//       path: "/customer",
//     },
//     {
//       title: "Payment Method",
//       icon: CreditCard,
//       path: "/payment",
//     },
//     {
//       title: "Order Details",
//       icon: ShoppingCart,
//       path: "/order",
//     },
//     {
//       title: "Settings",
//       icon: Settings,
//       path: "/settings",
//     },
//   ];

//   return (
//     <>
//       <div
//         className={cn(
//           "fixed top-0 left-0 z-40 h-screen bg-sidebar border-r border-sidebar-border text-sidebar-foreground transition-all duration-300 flex flex-col",
//           collapsed ? "w-16" : "w-64",
//           className
//         )}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
//           {!collapsed && (
//             <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
//               Admin Dashboard
//             </h1>
//           )}
//           <button
//             onClick={toggleSidebar}
//             className={cn(
//               "p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground",
//               collapsed ? "mx-auto" : ""
//             )}
//           >
//             {collapsed ? <Menu size={20} /> : <X size={20} />}
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 overflow-y-auto py-6">
//           <ul className="space-y-2 px-2">
//             {menuItems.map((item) => (
//               <li key={item.path}>
//                 <Link
//                   to={item.path}
//                   className={cn(
//                     "flex items-center p-3 rounded-md transition-colors",
//                     location.pathname === item.path
//                       ? "bg-sidebar-primary text-sidebar-primary-foreground"
//                       : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
//                     collapsed ? "justify-center" : "justify-start"
//                   )}
//                 >
//                   <item.icon size={20} className="shrink-0" />
//                   {!collapsed && <span className="ml-3">{item.title}</span>}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* Footer */}
//         <div className="p-4 border-t border-sidebar-border">
//           <div
//             className={cn(
//               "flex items-center",
//               collapsed ? "justify-center" : "justify-start"
//             )}
//           >
//             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
//               A
//             </div>
//             {!collapsed && (
//               <div className="ml-3">
//                 <p className="font-medium">Admin User</p>
//                 <p className="text-xs text-sidebar-foreground/70">
//                   admin@example.com
//                 </p>
//               </div>
//             )}
//           </div>
//           {!collapsed && (
//             <button className="mt-4 w-full flex items-center justify-center gap-2 p-2 rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
//               <LogOut size={18} />
//               <span>Log out</span>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Mobile overlay */}
//       <div
//         className={cn(
//           "fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden",
//           collapsed ? "hidden" : "block"
//         )}
//         onClick={toggleSidebar}
//       />
//     </>
//   );
// };

// export default Sidebar;

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  Menu,
  X,
  LogOut,
  CreditCard,
  Share2,
} from "lucide-react";
import API_URL from "@/utils/API_URL";

interface SidebarProps {
  className?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    sessionStorage.removeItem("token");

    navigate("/"); // redirect to login page
  };

  const toggleSidebar = () => setCollapsed(!collapsed);

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Product Management", icon: Package, path: "/products" },
    { title: "Social Media", icon: Share2, path: "/social-media" },
    { title: "Customers", icon: Users, path: "/customer" },
    { title: "Payment Method", icon: CreditCard, path: "/payment" },
    { title: "Order Details", icon: ShoppingCart, path: "/order" },
    { title: "Settings", icon: Settings, path: "/settings" },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const jwt = sessionStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}auth/profile`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");
        const data: UserProfile = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 z-40 min-h-screen flex flex-col justify-between  bg-gray-700 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 transition-all",
          collapsed ? "w-16" : "w-64",
          "md:relative",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!collapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              ATOSELR ADMIN
            </h1>
          )}
          <button
            onClick={toggleSidebar}
            className={cn(
              "p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground",
              collapsed ? "mx-auto" : ""
            )}
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center p-3 rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-gray-900 hover:text-sidebar-accent-foreground",
                    collapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <item.icon size={20} className="shrink-0" />
                  {!collapsed && <span className="ml-3">{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer with user info */}
        <div className="p-4 border-t border-sidebar-border">
          <div
            className={cn(
              "flex items-center",
              collapsed ? "justify-center" : "justify-start"
            )}
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) ?? "U"}
              </div>
            )}
            {!collapsed && user && (
              <div className="ml-3">
                <p className="font-medium text-white">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/70">
                  {user.email}
                </p>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-rose-800 flex items-center justify-center gap-2 p-2 rounded-md text-sidebar-foreground/70 hover:bg-gray-900 hover:text-sidebar-accent-foreground transition-colors"
            >
              <LogOut size={18} />
              <span>Log out</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden",
          collapsed ? "hidden" : "block"
        )}
        onClick={toggleSidebar}
      />
    </>
  );
};

export default Sidebar;
