import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";

export default function LoginLogoff() {
  //localStorage parse
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log("user:", user);
  }, [user]);

  // hoisted function so it can be referenced when useGoogleLogin is created
  async function GetUserProfile(tokenInfo) {
    console.log("➡️ GetUserProfile() called with token:", tokenInfo?.access_token);

    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("✅ axios.get success! User data:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
      setOpenDialog(false);
      
    } catch (error) {
      console.error("❌ Error in axios.get():", error?.response?.data || error.message || error);
    }
  }

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log("Google login error:", error),
  });

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5 w-screen">
      <h1 className="text-center font-extrabold text-[25px] ml-50">Login</h1>

      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger>
                <img src={user?.picture} className="h-[35px] w-[35px] rounded-full" alt="user" />
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  className="cursor-pointer"
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    setUser(null);
                   
                  }}
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign in</Button>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>Sign in securely with Google.</DialogDescription>

            <div className="mt-4 text-center">
              <img src="/logo.svg" alt="Logo" className="mx-auto mb-4" />

              <div className="font-bold text-lg">Sign in with Google</div>
              <div className="text-sm text-gray-500 mb-4">Secure login with Google Authentication</div>

              <Button onClick={() => login()} variant="outline" className="w-full flex items-center justify-center gap-3">
                <FcGoogle className="h-6 w-6" />
                <span>Sign In With Google</span>
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
