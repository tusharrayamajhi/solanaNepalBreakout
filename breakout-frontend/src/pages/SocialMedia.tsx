import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import API_URL from "@/utils/API_URL";



const SocialMediaPage = () => {
  const navigate = useNavigate();

  // Retrieve token synchronously from sessionStorage
  const token = sessionStorage.getItem("token");

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // Fetch user profile and business
  const { data: profileData, isLoading: isProfileLoading, error: profileError } = useQuery({
    queryKey: ["profile", token],
    queryFn: async () => {
      if (!token) throw new Error("No token");
      const res = await fetch(`${API_URL}auth/profile`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    enabled: !!token,
  });

  // Fetch social pages
  const { data: socialPages = [], isLoading: isSocialLoading, error: socialError } = useQuery({
    queryKey: ["socialPages", token, profileData?.businesses?.id],
    queryFn: async () => {
      if (!token || !profileData?.businesses?.id) throw new Error("No token or business ID");
      const res = await fetch(`${API_URL}auth/facebook/fb-page`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch social pages");
      return res.json();
    },
    enabled: !!token && !!profileData?.businesses?.id,
  });

  useEffect(() => {
    if (profileError) {
      toast.error("Failed to load user data.");
    }
    if (socialError) {
      toast.error("Failed to load social pages.");
    }
    if (profileData && !profileData.businesses) {
      navigate("/business-details");
    }
  }, [profileError, socialError, profileData, navigate]);

  const connectFacebook = () => {
    const FB_APP_ID = "1160645722385502";
    const REDIRECT_URI = "http://localhost:8080/social-media"; // Updated to match your redirectUri
    const scopes = [
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_metadata",
      "pages_messaging",
      "pages_manage_posts",
    ].join(",");

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${scopes}&response_type=code`;

    window.location.href = authUrl;
  };

  const exchangeCodeForToken = async (code: string, token: string | null) => {
    try {
      if (!token) throw new Error("No token available. Please log in again.");
      const res = await fetch(`${API_URL}auth/facebook`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code,
          redirectUri: "http://localhost:8080/social-media",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to connect Facebook page");
      toast.success("Facebook Page connected successfully!");
      window.location.reload();
    } catch (err: any) {
      console.error("Error connecting page:", err);
      toast.error(err.message || "Failed to connect Facebook page");
      if (err.message.includes("No token")) {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      const currentToken = sessionStorage.getItem("token"); // Retrieve token synchronously
      exchangeCodeForToken(code, currentToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (isProfileLoading || isSocialLoading) {
    return <div className="flex h-screen items-center justify-center text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  return (
    // <div className="flex min-h-screen w-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full h-screen">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold">Social Media Pages</CardTitle>
            <Button onClick={connectFacebook}>Connect Facebook Page</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Page Name</TableHead>
                <TableHead>Page Id</TableHead>
                <TableHead>Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {socialPages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 dark:text-gray-400">
                    No social pages connected
                  </TableCell>
                </TableRow>
              ) : (
                socialPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="capitalize">{page.platform}</TableCell>
                    <TableCell>{page.pageName}</TableCell>
                    <TableCell>{page.pageId || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={page.isActive ? "default" : "destructive"}
                        className={page.isActive ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"}
                      >
                        {page.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    // </div>
  );
};

export default SocialMediaPage;