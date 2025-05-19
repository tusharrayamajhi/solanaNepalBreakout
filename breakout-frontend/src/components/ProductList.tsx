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
import { Edit, Trash2 } from "lucide-react";
import { Product } from "@/utils/api";
import SearchInput from "./SearchInput";
import { useNavigate } from "react-router-dom";

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
}

const ProductList = ({ products, isLoading }: ProductListProps) => {
  const navigate = useNavigate();
  const handleEdit = (productId: string) => {
    navigate(`/products/edit/${productId}`);
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

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* <SearchInput 
              value={searchQuery} 
              onChange={handleSearch} 
              placeholder="Search products..."
              className="w-full sm:w-[300px]"
            /> */}

            {/* <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
          </div>

          <Button
            className="w-full md:w-auto"
            onClick={() => navigate("/products/add")}
          >
            Add Product
          </Button>
        </div>

        {isLoading ? (
          <div className="py-10 text-center">
            <div
              className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-primary rounded-full"
              aria-hidden="true"
            ></div>
            <p className="mt-2 text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">No products found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-700">
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead className="text-right">Product Name</TableHead>
                  {/* <TableHead>Category</TableHead> */}
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Inventory</TableHead>
                  <TableHead className="text-right">color</TableHead>
                  <TableHead className="text-right">size</TableHead>
                  <TableHead className="text-right">Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow className="text-right" key={product.id}>
                    <TableCell>
                      <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className="h-10 w-10 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.productName}
                    </TableCell>
                    {/* <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell> */}
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={product.stock < 20 ? "text-rose-500" : ""}
                      >
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.color}
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.size.join(",")}
                    </TableCell>
                    <TableCell>{formatDate(product.createdAt)}</TableCell>
                    <TableCell className="">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(product.id)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductList;
