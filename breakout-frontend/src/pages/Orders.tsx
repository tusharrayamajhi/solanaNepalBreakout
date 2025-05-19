import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Stripe from "stripe";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import API_URL from "@/utils/API_URL";

// Orders Component
const Orders = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jwt = sessionStorage.getItem("token");
    if (!jwt) {
      navigate("/");
    } else {
      setToken(jwt);
      fetchUserAndBusiness(jwt);
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

      if (data.businesses == null) {
        navigate("/business-details");
      } else {
        fetchOrders(token, data.businesses.id);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setLoading(false);
    }
  };

  const fetchOrders = async (token: string, businessId: string) => {
    try {
      const res = await fetch(
        `${API_URL}orders?businessId=${businessId}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(
        `${API_URL}orders/status/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading || !userData) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <ScrollArea className="h-[70vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>payment method</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/order-details/${order.id}`)}
                  >
                    <TableCell className="truncate max-w-xs" title={order.id}>
                      {order.id}
                    </TableCell>
                    <TableCell
                      className="truncate max-w-xs"
                      title={order.customer.fullName}
                    >
                      {order.customer.fullName}
                    </TableCell>
                    <TableCell>
                      {order.payment
                        ? order.payment.payment_method === "stripe"
                          ? `$${order.total_amount}`
                          : order.payment.payment_method === "esewa"
                          ? `NPR ${order.total_amount * 130}`
                          : order.payment.payment_method === "solana"
                          ? `0.001 SOL`
                          : `${order.total_amount}`
                        : "Not paid"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          handleStatusChange(order.id, value)
                        }
                        onOpenChange={(open) =>
                          open && event?.stopPropagation()
                        }
                      >
                        <SelectTrigger
                          className={`w-[120px] ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "shipping"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="Reject">Reject</SelectItem>
                          <SelectItem value="shipping">Shipping</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell
                      className={
                        order.payment
                          ? order.payment.payment_method === "esewa"
                            ? "text-green-600 font-semibold"
                            : order.payment.payment_method === "stripe"
                            ? "text-blue-600 font-semibold"
                            : order.payment.payment_method === "solana"
                            ? "text-purple-600 font-semibold"
                            : "text-yellow-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {order.payment
                        ? order.payment.payment_method
                        : "not paid"}
                    </TableCell>

                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

// OrderDetails Component
const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(
    null
  );

  useEffect(() => {
    const jwt = sessionStorage.getItem("token");
    if (!jwt) {
      navigate("/");
    } else {
      setToken(jwt);
      fetchUserAndBusiness(jwt);
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

      if (data.businesses == null) {
        navigate("/business-details");
      } else {
        fetchOrder(token, orderId!);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setLoading(false);
    }
  };

  const fetchOrder = async (token: string, orderId: string) => {
    try {
      const res = await fetch(`${API_URL}orders/${orderId}`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setOrder(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching order:", err);
      setLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!order.payment) {
      setVerificationResult("No payment data available.");
      return;
    }

    setVerifying(true);
    setVerificationResult(null);

    try {
      if (order.payment.payment_method === "esewa") {
        const jsonString = atob(order.payment.transaction_uuid);
        const parsed = JSON.parse(jsonString);
        const res = await fetch(
          `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${parsed.product_code}&total_amount=${parsed.total_amount}&transaction_uuid=${parsed.transaction_uuid}`
        );
        const data = await res.json();
        setVerificationResult(
          data.status === "success"
            ? `Payment Received (Method: ${order.payment.payment_method})`
            : `Payment Not Received - Status: ${data.status} (Method: ${order.payment.payment_method})`
        );
      }
      if (order.payment.payment_method === "stripe") {
        const stripe = new Stripe(
          "sk_test_51RKDJM2MTP04X9qxJX4LqrA4dS5bIV83qHDKJzrxM3IThBEFiioqZaIG626JB6uBl8FDZvfoKtOe0pAXI536Efdv00OViROqzE"
        );
        const session = await stripe.checkout.sessions.retrieve(
          order.payment.transaction_uuid
        );
        setVerificationResult(
          session.payment_status === "paid"
            ? `Payment Received (Method: ${order.payment.payment_method})`
            : `Payment Not Received - Status: ${session.payment_status} (Method: ${order.payment.payment_method})`
        );
      }
      if (order.payment.payment_method === "solana") {
        // Note: `connection` and `findReference` are not defined in the original code
        // This part is left as a placeholder and may need additional setup
        // const signatureInfo = await findReference(connection, reference, { finality: 'confirmed' });
        setVerificationResult("Solana payment verification not implemented.");
      }
    } catch (err) {
      console.error("Error verifying payment:", err);
      setVerificationResult("Failed to verify payment.");
    } finally {
      setVerifying(false);
    }
  };

  if (loading || !userData || !order) {
    return <div className="p-10">Loading...</div>;
  }

  const business = userData.businesses;

  return (
    // <div className="flex-1 bg-gray-100 min-h-screen p-8">
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {business.logoUrl && (
              <Avatar className="w-16 h-16 mr-4">
                <AvatarImage src={business.logoUrl} alt={business.name} />
                <AvatarFallback>{business.name[0]}</AvatarFallback>
              </Avatar>
            )}
            <CardTitle className="text-2xl">Order Invoice</CardTitle>
          </div>
          <div>
            <span className="text-sm text-gray-600">Invoice #:</span>{" "}
            <span className="font-semibold">{order.id}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {order.payment && (
          <div className="mb-6">
            <Button
              onClick={handleVerifyPayment}
              disabled={verifying}
              className={`text-white ${
                verifying
                  ? "bg-gray-400 cursor-not-allowed"
                  : order.payment?.payment_method === "stripe"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : order.payment?.payment_method === "solana"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : order.payment?.payment_method === "esewa"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              {verifying
                ? "Verifying..."
                : order.payment?.payment_method === "stripe"
                ? "Check Payment in Stripe"
                : order.payment?.payment_method === "solana"
                ? "Check Payment on Solana Explorer"
                : order.payment?.payment_method === "esewa"
                ? "Check Payment in Esewa Wallet"
                : "Verify Payment"}
            </Button>
            {verificationResult && (
              <p
                className={`mt-2 text-sm ${
                  verificationResult.includes("Received")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {verificationResult}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Order ID:</span> {order.id}
              </p>
              <p>
                <span className="font-medium">Total Amount:</span>{" "}
                {order.payment?.payment_method === "solana"
                  ? "0.001 SOL"
                  : order.payment?.payment_method === "esewa"
                  ? `Rs. ${order.total_amount * 130}`
                  : `$${order.total_amount}`}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <Badge
                  variant={
                    order.status === "pending"
                      ? "secondary"
                      : order.status === "shipping"
                      ? "default"
                      : order.status === "delivered"
                      ? "success"
                      : order.status === "Reject"
                      ? "error"
                      : "success"
                  }
                  className={
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "shipping"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Reject"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {order.status}
                </Badge>
              </p>
              <p>
                <span className="font-medium">Created At:</span>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Updated At:</span>{" "}
                {new Date(order.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {order.customer.fullName}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {order.customer.email || "N/A"}
              </p>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 mt-6">
            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
            {order.payment ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p className="flex items-center space-x-1">
                  <span className="font-medium">Transaction UUID:</span>
                  <span
                    className="truncate max-w-[200px] text-white"
                    title={order.payment.transaction_uuid}
                  >
                    {order.payment.transaction_uuid || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <Badge variant="success" className="bg-green-100 text-green-800">Paid</Badge>
                </p>
                <p className="flex items-center space-x-1">
                  <span className="font-medium">Payment Method:</span>
                  <span
                    className={
                      order.payment?.payment_method === "stripe"
                        ? "text-blue-600 font-semibold"
                        : order.payment?.payment_method === "esewa"
                        ? "text-green-600 font-semibold"
                        : order.payment?.payment_method === "solana"
                        ? "text-purple-600 font-semibold"
                        : "text-gray-600"
                    }
                  >
                    {order.payment?.payment_method || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {order.payment.email || "N/A"}
                </p>
              </div>
            ) : (
              <p className="text-gray-600">No payment information available.</p>
            )}
          </div>
          <div className="col-span-1 md:col-span-2 mt-6">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <ScrollArea className="h-[50vh]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Size</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {order.orderItem.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="flex items-center">
                        {item.product.imageUrl && (
                          <Avatar className="w-12 h-12 mr-2">
                            <AvatarImage
                              src={item.product.imageUrl}
                              alt={item.product.productName}
                            />
                            <AvatarFallback>
                              {item.product.productName[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        {item.product.productName}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell>{item.product.color || "N/A"}</TableCell>
                      <TableCell>{item.size || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Issued by {business.name}{" "}
            {business.website && (
              <a
                href={business.website}
                className="text-blue-600 hover:underline"
              >
                ({business.website})
              </a>
            )}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Thank you for your business!
          </p>
        </div>
      </CardContent>
    </Card>
    // </div>
  );
};

export { Orders, OrderDetails };
