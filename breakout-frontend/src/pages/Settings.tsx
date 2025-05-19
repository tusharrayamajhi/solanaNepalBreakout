import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import API_URL from "@/utils/API_URL";

// Define the schema for form validation using Zod
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Business name is required"),
  logoUrl: z.string().url("Must be a valid URL").min(1, "Logo URL is required"),
  website: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Website URL is required"),
  email: z.string().email("Must be a valid email").min(1, "Email is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  description: z.string().min(1, "Description is required"),
});

const EditBusinessPage = () => {
  const navigate = useNavigate();
  const [ id ,setId] = useState("");
  const [error, setError] = useState("");

  // Initialize the form with React Hook Form and Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      logoUrl: "",
      website: "",
      email: "",
      phoneNumber: "",
      address: "",
      description: "",
    },
  });

  // Fetch business details on mount
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
      toast.error("Please log in to access this page.");
      return;
    }

    const fetchBusiness = async () => {
      try {
        const response = await axios.get(`${API_URL}auth/profile`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        });

        // Populate form with fetched data
        form.reset({
          id:response.data.businesses.id,
          name: response.data.businesses.name,
          logoUrl: response.data.businesses.logoUrl,
          website: response.data.businesses.website,
          email: response.data.businesses.email,
          phoneNumber: response.data.businesses.phoneNumber,
          address: response.data.businesses.address,
          description: response.data.businesses.description,
        });
        setId(response.data.businesses.id)

      } catch (err) {
        console.error("Error fetching business details", err);
        setError("Failed to load business details. Please try again.");
        toast.error("Failed to load business details.");
      }
    };

    fetchBusiness();
  }, [id,navigate, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
      toast.error("Please log in to continue.");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}businesses/${id}`,
        {
          name: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber,
          website: values.website,
          address: values.address,
          logoUrl: values.logoUrl,
          description: values.description,
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Business details updated successfully!");
        navigate("/dashboard");
      } else {
        setError("Failed to update business details. Please try again.");
        toast.error("Failed to update business details.");
      }
    } catch (err) {
      console.error("Error updating business details", err);
      setError("Something went wrong. Please try again.");
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen items-center justify-center flex w-full p-4">
      <div className="w-full max-w-2xl p-6 rounded-lg shadow-md">
        <h2 className="text-2xl text-white font-semibold text-center mb-6">
          Edit Business Details
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="display-none">
                  <FormLabel className="text-sm font-medium text-white">
                    Business Name
                  </FormLabel>
                  <FormControl className="text-sm font-medium text-white">
                    <Input placeholder="Enter business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">
                    Logo URL
                  </FormLabel>
                  <FormControl className="text-sm font-medium text-white">
                    <Input placeholder="Enter logo URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">
                    Website URL
                  </FormLabel>
                  <FormControl className="text-sm font-medium text-white">
                    <Input placeholder="Enter website URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">
                    Email Address
                  </FormLabel>
                  <FormControl className="text-sm font-medium text-white">
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">
                    Phone Number
                  </FormLabel>
                  <FormControl className="text-sm font-medium text-white">
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">
                    Address
                  </FormLabel>
                  <FormControl className="text-sm font-medium text-white">
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">
                    Description
                  </FormLabel>
                  <FormControl className="text-sm font-medium text-white">
                    <Textarea placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button type="submit" className="w-full">
              Update Business Details
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditBusinessPage;
