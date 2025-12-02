import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Verify() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your account...");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid verification link.");
      return;
    }

    const verifyUser = async () => {
      try {
        // Always call backend
        await fetch(`http://localhost:5050/api/auth/verify/${token}`);

        // Treat ANY response as success (backend redirect happens here)
        setMessage("Account verified! Redirecting...");

        setTimeout(() => navigate("/onboarding"), 1000);
      } catch (err) {
        setMessage("Cannot reach server.");
      }
    };

    verifyUser();
  }, [token, navigate]);

  return (
    <div className="p-8 text-center text-xl">
      <h1>{message}</h1>
    </div>
  );
}
