import axios from "axios";
import API_URL from "./API_URL";

// Mock data for dashboard
export interface Product {
  id: string;
  productName: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string;
  videoLink?: string;
  color: string;
  size: string[];
  gender: string;
  season?: string;
  createdAt:string
}


export interface Customer {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  socialPage?: {
    pageName: string;
  };
}
export interface orderItem {
    id: string;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    quantity: string;
    price: string;
    size: string;
    color: string;
    product: {
      id: string;
      deletedAt: string | null;
      createdAt: string;
      updatedAt: string;
      productName: string;
      description: string;
      price: string;
      stock: number;
      imageUrl: string;
      videoLink: string | null;
      color: string;
      size: string[];
      gender: string | null;
      season: string | null;
    };
  };
export interface Orderres {
  id: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  total_amount: string;
  status: "pending" | "shipping" | "delivered" | "cancelled" | "processing";
  customer: {
    id: string;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    fullName: string;
    email: string;
  };
  orderItem: orderItem[];
  payment: {
    id: number;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    transaction_uuid: string;
    payment_method: string;
    email: string | null;
    raw_response: string | null;
  } | null;
}

// // Mock products data
const products: Product[] = [];

// Mock customers data
const customers: Customer[] = [];

interface PaymentResponse {
  id: string;
  methodType: string;
  stripeUserId?: string;
  merchantCode?: string;
  walletAddress?: string;
}
interface ProfileResponse {
  name: string;
  email: string;
  profilePicture: string;
  businesses?: {
    id:string;
    name: string;
    logoUrl: string;
    website: string;
  };
}

interface StripeConnectResponse {
  message?: string;
}

interface WalletConnectResponse {
  message?: string;
}

interface EsewaConnectResponse {
  status: number;
  message: string;
}

// Mock orders data
const orders: Orderres[] = [];


// Fetch payments
export const fetchPayments = async (token: string | null): Promise<PaymentResponse[]> => {
  // const token = sessionStorage.getItem('token');
  if (!token) throw new Error("No token");
  const response = await axios.get(`${API_URL}payment`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`, // add token in Authorization header
      "Content-Type": "application/json",
    },
  });
  return response.data as PaymentResponse[];
};

// Fetch user profile
export const fetchUserProfile = async (token: string | null): Promise<ProfileResponse> => {
  if (!token) throw new Error("No token");
  const response = await axios.get(`${API_URL}auth/profile`,
    {
    headers: {
      "ngrok-skip-browser-warning": "true",
      'Authorization': `Bearer ${token}`,  // add token in Authorization header
      'Content-Type': 'application/json',
    },
    })
  return response.data as ProfileResponse;
};

export const connectStripe = async (code: string, token: string | null): Promise<StripeConnectResponse> => {
  if (!token) throw new Error("No token");
 const response = await axios.post(
   `${API_URL}stripe/connect?code=${code}`,
   {},
   {
     headers: {
       "ngrok-skip-browser-warning": "true",
       Authorization: `Bearer ${token}`, // add token in Authorization header
       "Content-Type": "application/json",
     },
   }
 );
  return response.data;
};

// Connect Phantom Wallet
export const connectPhantomWallet = async (publicKey: string, token: string | null): Promise<WalletConnectResponse> => {
  console.log("wallet ",token)
  if (!token) throw new Error("No token");
  const response = await axios.post(
    `${API_URL}wallet/connect?publickey=${publicKey}`,{},
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`, // add token in Authorization header
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Connect eSewa
export const connectEsewa = async (merchantCode: string, token: string | null): Promise<EsewaConnectResponse> => {
  if (!token) throw new Error("No token");
  const response = await axios.post(
    `${API_URL}esewa/connect`,{
      merchantCode: merchantCode,
    },
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`, // add token in Authorization header
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};


export const fetchProducts = async (): Promise<Product[]> => {
  const url = `${API_URL}products`;  // your backend endpoint
  const token = sessionStorage.getItem('token');
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`, // add token in Authorization header
      "Content-Type": "application/json",
    }, // if you use cookies or JWT token
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  const data = await res.json();
  return data as Product[];
};

export const fetchCustomers = async (): Promise<Customer[]> => {
  const token = sessionStorage.getItem('token');
    const response = await axios.get<Customer[]>(`${API_URL}customers`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`, // add token in Authorization header
        "Content-Type": "application/json",
      }, // if you use cookies or JWT token
    });
     if (response.status != 200) {
    throw new Error('Failed to fetch products');
  } 
    return response.data as Customer[]

};
// Fetch orders
export const fetchOrders = async (token:string,businessid:string):Promise<Orderres[]> => {
  try{

    console.log("token",token)
    console.log("id",businessid)
    if (!token) throw new Error("No token");
    if (!businessid) throw new Error("Business ID is required");
    const response = await axios.get<Orderres[]>(
      `${API_URL}orders?businessId=${businessid}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`, // add token in Authorization header
          "Content-Type": "application/json",
        },
      }
    );
    console.log("hello")
    console.log(response.data)
    return response.data as Orderres[] || [];
  }catch(error){
    console.log(error)
    return [];
  }
};

export const fetchDashboardStats = async (): Promise<{
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Orderres[];
  salesByCategory: { category: string; sales: number }[];
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const totalSales = orders.reduce((sum, order) => sum + (+order.total_amount), 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const salesByCategory: { category: string; sales: number }[] = [];
  const categoryMap = new Map<string, number>();

  orders.forEach(order => {
    order.item.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const category = product.category;
        const currentTotal = categoryMap.get(category) || 0;
        categoryMap.set(category, currentTotal + (item.price * item.quantity));
      }
    });
  });

  categoryMap.forEach((sales, category) => {
    salesByCategory.push({ category, sales });
  });

  return {
    totalSales,
    totalOrders,
    totalCustomers,
    totalProducts,
    recentOrders,
    salesByCategory
  };
};
