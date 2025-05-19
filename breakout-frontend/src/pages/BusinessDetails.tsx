import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "@/utils/API_URL";

const BusinessDetails = () => {
  const [businessName, setBusinessName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true); // Default to true
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if the user already has business details
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login if no token exists
      return;
    }

    const checkBusinessDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}auth/profile`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        });

        // If business details already exist, redirect to the dashboard
        if (response.data.businesses) {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Error checking business details", err);
      }
    };

    checkBusinessDetails();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure the form is filled out
    if (!businessName || !logoUrl || !website || !email || !phoneNumber || !address || !description) {
      setError("All fields are required!");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login if no token exists
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}businesses`, // Correct API endpoint
        {
          name: businessName, // 'name' corresponds to the property in BusinessDto
          email,
          phoneNumber,
          website,
          address,
          logoUrl,
          description,
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status == 200) {
        // Redirect to dashboard on success
        navigate("/dashboard");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting business details", err);
      setError("Something went wrong. Please try again.");
    }
  };

  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem("token"); // Remove token from sessionStorage
    navigate("/"); // Redirect to login page
  };


  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        {/* Logout Button */}
        <div className="text-right mb-6">
          <button
            onClick={handleLogout}
            className="p-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6">Business Details</h2>
        <form onSubmit={handleSubmit}>
          <table className="min-w-full table-auto">
            <tbody>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700">Business Name</td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter business name"
                    required
                  />
                </td>
              </tr>

              <tr>
                <td className="px-4 py-2 font-medium text-gray-700">Logo URL</td>
                <td className="px-4 py-2">
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter logo URL"
                    required
                  />
                </td>
              </tr>

              <tr>
                <td className="px-4 py-2 font-medium text-gray-700">Website URL</td>
                <td className="px-4 py-2">
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter website URL"
                    required
                  />
                </td>
              </tr>

              <tr>
                <td className="px-4 py-2 font-medium text-gray-700">Email Address</td>
                <td className="px-4 py-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter email"
                    required
                  />
                </td>
              </tr>

              <tr>
                <td className="px-4 py-2 font-medium text-gray-700">Phone Number</td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter phone number"
                    required
                  />
                </td>
              </tr>

              <tr>
                <td className="px-4 py-2 font-medium text-gray-700">Address</td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter address"
                    required
                  />
                </td>
              </tr>

              <tr>
                <td className="px-4 py-2 font-medium text-gray-700">Description</td>
                <td className="px-4 py-2">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter description"
                    required
                  />
                </td>
              </tr>

             
            </tbody>
          </table>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="mt-4 w-full p-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Save Business Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessDetails;
