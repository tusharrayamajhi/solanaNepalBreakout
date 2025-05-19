import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";
import { orderItem, Orderres } from "@/utils/api";
import SearchInput from "./SearchInput";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface OrderListProps {
  orders: Orderres[];
  isLoading: boolean;
  onSearch: (query: string) => void;
  onStatusFilter: (status: string) => void;
}

const OrderList = ({
  orders,
  isLoading,
  onSearch,
  onStatusFilter,
}: OrderListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [openItems, setOpenItems] = useState<Array<number | string>>([]);

  const toggleItem = (id: number | string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    onStatusFilter(value);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: Orderres["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipping":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: Orderres["payment"]) => {
    switch (status) {
      case null:
        return "bg-red-100 text-red-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const statuses = [
    "all",
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <SearchInput
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search orders..."
              className="w-full sm:w-[300px]"
            />

            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger
                className={`w-[120px] text-xs ${getStatusColor()}`}
                onClick={(e) => e.stopPropagation()}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-10 text-center">
            <div
              className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-primary rounded-full"
              aria-hidden="true"
            ></div>
            <p className="mt-2 text-gray-500">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: Orderres) => (
                  <Collapsible
                    key={order.id}
                    open={openItems.includes(order.id)}
                    onOpenChange={() => toggleItem(order.id)}
                    className="w-full"
                  >
                    <TableRow>
                      <TableCell>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            {openItems.includes(order.id) ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </TableCell>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.customer.fullName}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => {
                            statusMutation.mutate({
                              orderId: order.id,
                              status: value,
                            });
                          }}
                          onOpenChange={(open) => {
                            if (open) event?.stopPropagation();
                          }}
                        >
                          <SelectTrigger
                            className={`w-[120px] text-xs ${getStatusColor(
                              order.status
                            )}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">
                              Processing
                            </SelectItem>
                            <SelectItem value="shipping">Shipping</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getPaymentStatusColor(
                            order.payment?.payment_method || "none"
                          )}
                          variant="outline"
                        >
                          {order.payment
                            ? order.payment.payment_method
                                .charAt(0)
                                .toUpperCase() +
                              order.payment.payment_method.slice(1)
                            : "None"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(order.total_amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => navigate(`/order-details/${order.id}`)}
                        >
                          <Eye size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <TableRow className="bg-gray-50 dark:bg-gray-800 border-t-0">
                        <TableCell colSpan={8} className="p-4">
                          <div className="text-sm">
                            <h4 className="font-semibold mb-2">Order Items</h4>
                            <table className="min-w-full text-left">
                              <thead>
                                <tr>
                                  <th className="py-2 pr-4 font-medium">
                                    Product
                                  </th>
                                  <th className="py-2 pr-4 font-medium">
                                    Size
                                  </th>
                                  <th className="py-2 pr-4 font-medium">
                                    Color
                                  </th>
                                  <th className="py-2 pr-4 font-medium text-right">
                                    Price
                                  </th>
                                  <th className="py-2 pr-4 font-medium text-right">
                                    Qty
                                  </th>
                                  <th className="py-2 font-medium text-right">
                                    Subtotal
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.orderItem.map(
                                  (item: orderItem, idx: number) => (
                                    <tr key={`${order.id}-item-${idx}`}>
                                      <td className="py-2 pr-4">
                                        {item.product.productName}
                                      </td>
                                      <td className="py-2 pr-4">{item.size}</td>
                                      <td className="py-2 pr-4">
                                        {item.color}
                                      </td>
                                      <td className="py-2 pr-4 text-right">
                                        {formatCurrency(item.price)}
                                      </td>
                                      <td className="py-2 pr-4 text-right">
                                        {item.quantity}
                                      </td>
                                      <td className="py-2 text-right">
                                        {formatCurrency(
                                          parseFloat(item.price) *
                                            parseFloat(item.quantity)
                                        )}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderList;
