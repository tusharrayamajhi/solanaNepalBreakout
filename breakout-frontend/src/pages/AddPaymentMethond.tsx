import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import {
  fetchUserProfile,
  fetchPayments,
  connectStripe,
  connectPhantomWallet,
  connectEsewa,
} from "@/utils/api";

// Extend the Window interface to include the solana property
declare global {
  interface Window {
    solana?: {
      isPhantom: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      publicKey: { toString: () => string };
    };
  }
}

const esewaSchema = z.object({
  merchantCode: z.string().min(1, "Merchant code is required"),
});

const AddPaymentMethod = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem("token");
  console.log(token)

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // Fetch user profile
  const { data: profileData, isLoading: isProfileLoading, error: profileError } = useQuery({
    queryKey: ["profile", token],
    queryFn: () => fetchUserProfile(token),
    enabled: !!token,
  });

  // Fetch payments
  const { data: payments, isLoading: isPaymentsLoading, error: paymentsError } = useQuery({
    queryKey: ["payments", token],
    queryFn: () => fetchPayments(token),
    enabled: !!token,
  });

  useEffect(() => {
    if (profileError) {
      toast.error("Failed to load user data.");
      sessionStorage.removeItem("token");
      navigate("/");
    }
    if (profileData && !profileData.businesses) {
      navigate("/business-details");
    }
  }, [profileError, profileData, navigate]);

  // Stripe connection mutation
  const stripeMutation = useMutation({
    mutationFn: (code: string) => connectStripe(code, token),
    onSuccess: () => {
      toast.success("Stripe account connected successfully!");
      navigate("/dashboard");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to connect Stripe");
    },
  });

  // Phantom Wallet connection mutation
  const walletMutation = useMutation({
    mutationFn: async () => {
      if (!window.solana || !window.solana.isPhantom) {
        throw new Error("Phantom wallet not installed. Please install the Phantom extension.");
      }
      const provider = window.solana;
      await provider.connect();
      const publicKey = provider.publicKey.toString();
      return connectPhantomWallet(publicKey, token);
    },
    onSuccess: () => {
      toast.success("Phantom wallet connected successfully!");
      navigate("/payment");
    },
    onError: (err: any) => {
      if (err.code === 4001) {
        toast.error("Connection rejected by user.");
      } else {
        toast.error(err.message || "Failed to connect Phantom wallet");
      }
    },
  });

  // eSewa connection mutation
  const esewaMutation = useMutation({
    mutationFn: (values: z.infer<typeof esewaSchema>) => connectEsewa(values.merchantCode, token),
    onSuccess: (data) => {
      toast.success(data.message || "eSewa account connected successfully!");
      navigate("/payment");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to connect eSewa");
    },
  });

  // eSewa form
  const form = useForm<z.infer<typeof esewaSchema>>({
    resolver: zodResolver(esewaSchema),
    defaultValues: {
      merchantCode: "",
    },
  });

  const connectStripeAuth = () => {
  const clientId = "";
  const redirectUri = "http://localhost:8080/payment";
  const scope = "read_write";
  const state = Math.random().toString(36).substring(2); // Generate random state

  const authUrl = `https://connect.stripe.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${scope}&response_type=code&state=${state}`;

  localStorage.setItem("stripe_oauth_state", state); // Store state for validation
  window.location.href = authUrl;
};

  // Handle Stripe OAuth redirect
  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const code = params.get("code");
  const state = params.get("state");
  const storedState = localStorage.getItem("stripe_oauth_state");

  if (code && state === storedState) {
    const currentToken = sessionStorage.getItem("token");
    if (!currentToken) {
      toast.error("Authentication token missing. Please log in to continue.", {
        action: {
          label: "Log In",
          onClick: () => navigate("/"),
        },
      });
      return;
    }
    stripeMutation.mutate(code);
    localStorage.removeItem("stripe_oauth_state"); // Clean up
    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (code && state !== storedState) {
    toast.error("Invalid state parameter. Please try again.");
  }
}, [location, navigate, stripeMutation]);

  if (isProfileLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
      </div>
    );
  }

  return (
    // <div className="flex min-h-screen w-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <Card className="border-none w-full ">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Add Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <div className="border rounded-lg p-5 w-full flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="https://logos-world.net/wp-content/uploads/2021/03/Stripe-Logo.png"
                alt="Stripe"
                className="h-8"
              />
              <h3 className="text-lg  font-medium">Stripe Account</h3>
            </div>
            <Button
              onClick={connectStripeAuth}
              disabled={stripeMutation.isLoading}
              style={{ backgroundColor: "#665bff" }}
              className=" text-white hover:bg-blue-700"
            >
              {stripeMutation.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect Stripe Account"
              )}
            </Button>
          </div>
        </div>

        <div>
          <div className="border rounded-lg p-5 w-full flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="https://99bitcoins.com/de/wp-content/uploads/sites/3/2024/06/phantom-wallet-logo.png"
                alt="Phantom"
                className="h-8"
              />
              <h3 className="text-lg font-medium">Phantom Wallet</h3>
            </div>
            <Button
              onClick={() => walletMutation.mutate()}
              disabled={walletMutation.isLoading}
              style={{ backgroundColor: "#ab9ff3" }}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              {walletMutation.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect Phantom Wallet"
              )}
            </Button>
          </div>
        </div>

        <div className="border rounded-lg p-5 w-full flex flex-col">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src="https://lh3.googleusercontent.com/Imp5kLEg6mIoYZcsyQoTUQdIIP3gpVPJyxNUj10eqRa1Alw9rf4UkuY_W4xZcl2nCHU=w300"
              alt="eSewa"
              className="h-8"
            />
            <h3 className="text-lg font-medium">eSewa Account</h3>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) =>
                esewaMutation.mutate(values)
              )}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="merchantCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>eSewa Merchant Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your eSewa merchant code"
                        {...field}
                        disabled={esewaMutation.isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={esewaMutation.isLoading}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {esewaMutation.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect eSewa"
                )}
              </Button>
            </form>
          </Form>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Payment Records</h3>
          {isPaymentsLoading ? (
            <p className="text-gray-500 dark:text-gray-400">
              Loading payments...
            </p>
          ) : paymentsError ? (
            <p className="text-red-500">
              {(paymentsError as Error).message || "Error fetching payments"}
            </p>
          ) : payments && payments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No payment records found.
            </p>
          ) : (
            <div className="border rounded-lg p-5 w-full flex items-center justify-between overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Account Address </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments &&
                    payments.map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.methodType}</TableCell>
                        <TableCell>
                          {payment.stripeUserId ||
                            payment.merchantCode ||
                            payment.walletAddress}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    // </div>
  );
};

export default AddPaymentMethod;