import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL, { NEXT_PUBLIC_GOOGLE_CLIENT_ID } from "@/utils/API_URL";

const GoogleAuthButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    /* global google */
    // @ts-ignore
    google.accounts.id.initialize({
      client_id:NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: async (response: any) => {
        try {
          const { data } = await axios.post(`${API_URL}auth/google`, {
            credential: response.credential,
          });

          sessionStorage.setItem("token", data.token);
          navigate("/dashboard");
        } catch (err) {
          console.error("Login failed", err);
        }
      },
    });

    // @ts-ignore
    google.accounts.id.renderButton(document.getElementById("google-button"), {
      theme: "filled_blue",
      size: "large",
      shape: "pill",
      width: 280,
    });
  }, [navigate]);

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <p className="text-sm text-muted-foreground tracking-wide">
        Continue with Google
      </p>
      <div
        id="google-button"
        className="transition-all duration-300 transform hover:scale-105 rounded-full backdrop-blur-sm bg-white/10 p-[2px] border border-white/20 shadow-lg w-fit"
      ></div>
    </div>
  );
};

export default GoogleAuthButton;
