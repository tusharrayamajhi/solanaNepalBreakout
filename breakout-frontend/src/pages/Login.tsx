import GoogleAuthButton from "@/components/GoogleAuthButton";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-muted to-accent px-4">
      <div className="rounded-2xl p-10 max-w-md w-full border border-border shadow-xl bg-card/60 backdrop-blur-md">
        <div className="text-center">
          <img
            src="https://media.licdn.com/dms/image/v2/D4D16AQHJgOXbNphS3w/profile-displaybackgroundimage-shrink_350_1400/profile-displaybackgroundimage-shrink_350_1400/0/1713779956222?e=1752710400&v=beta&t=dTevDRIKHUslfUcCT0qc8Xfh9kGOkmu_rVP7ncN5W-s"
            alt="Your Business Logo"
            className="h-16 mx-auto mb-4 rounded"
          />
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to ATOSELR
          </h1>
          <p className="text-muted-foreground mt-2">
            Log in to manage your business and sell directly from Messenger
            using AI.
          </p>
        </div>

        <div className="mt-8">
          {isLoggedIn ? (
            <div className="text-center text-muted-foreground text-lg">
              Redirecting to Dashboard...
            </div>
          ) : (
            <div className="flex flex-col gap-4 items-center">
              <GoogleAuthButton />
              <p className="text-sm text-muted-foreground">
                Secure login with Google
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
