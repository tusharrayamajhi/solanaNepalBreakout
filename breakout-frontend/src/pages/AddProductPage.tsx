import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import API_URL from "@/utils/API_URL";

enum Size {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
  FREE_SIZE = "Free Size",
}

enum Gender {
  MEN = "Men",
  WOMEN = "Women",
  UNISEX = "Unisex",
  CHILDREN = "Children",
}

interface Product {
  productName: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string;
  videoLink?: string;
  color: string;
  size: Size[];
  gender?: Gender;
  season?: string;
}

// Zod schema for form validation
const formSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price (e.g., 29.99)"),
  stock: z.number().min(0, "Stock cannot be negative"),
  imageUrl: z.string().url("Enter a valid URL"),
  videoLink: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  color: z.string().min(1, "Color is required"),
  size: z.array(z.nativeEnum(Size)).min(1, "Select at least one size"),
  gender: z.nativeEnum(Gender).optional(),
  season: z.string().optional(),
});

const AddProductPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      description: "",
      price: "",
      stock: 0,
      imageUrl: "",
      videoLink: "",
      color: "",
      size: [],
      gender: undefined,
      season: "",
    },
  });

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
      if (!data.businesses) {
        navigate("/business-details");
      } else {
        setBusinessId(data.businesses.id);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to load user data.");
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(
        `${API_URL}products?businessId=${businessId}`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product.");
      }

      toast.success("Product added successfully!");
      form.reset();
      setTimeout(() => navigate("/products"), 2000);
    } catch (err: any) {
      console.error("Error adding product:", err);
      toast.error(err.message || "Failed to add product.");
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  return (
    // <div className="flex min-h-screen w-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className=" border-none p-2 my-10 w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price *</FormLabel>
                    <FormControl>
                      <Input placeholder="29.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videoLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/video" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Blue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900">
                        {Object.values(Gender).map((gender) => (
                          <SelectItem className="hover:bg-gray-800" key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Season</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Winter" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter product description" {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Size *</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {Object.values(Size).map((size) => (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox
                            id={size}
                            checked={field.value.includes(size)}
                            onCheckedChange={(checked) => {
                              const newSizes = checked
                                ? [...field.value, size]
                                : field.value.filter((s) => s !== size);
                              field.onChange(newSizes);
                            }}
                          />
                          <label htmlFor={size} className="text-sm">
                            {size}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4 md:col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/products")}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Product</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    // </div>
  );
};

export default AddProductPage;