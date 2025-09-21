import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import {
  checkAuthService,
  registeloginService,
  registerService,
} from "@/services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [authUser, setAuthUser] = useState({
    authenticate: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const handelRegisterUser = async (event) => {
    try {
      event.preventDefault();
      const data = await registerService(signUpFormData);
    } catch (error) {
      console.log(error);
    }
  };
  const handelLoginUser = async (event) => {
    try {
      event.preventDefault();
      const data = await registeloginService(signInFormData);
      // console.log(data);

      if (data.success) {
        sessionStorage.setItem("token", JSON.stringify(data.token));
        setAuthUser({
          authenticate: true,
          user: data.user,
        });
      } else {
        setAuthUser({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(authUser);
  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuthUser({
          authenticate: true,
          user: data.user,
        });
        setIsLoading(false);
      } else {
        setAuthUser({
          authenticate: false,
          user: null,
        });
        setIsLoading(false);
      }
    } catch (error) {
      if (!error?.response?.data?.success) {
        setAuthUser({
          authenticate: false,
          user: null,
        });
        setIsLoading(false);
      }
    }
  }
  // console.log(authUser,"authUser");
  useEffect(() => {
    checkAuthUser();
  }, []);

  function resetCredentials() {
    setAuthUser({
      authenticate: false,
      user: null,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handelRegisterUser,
        handelLoginUser,
        authUser,
        setAuthUser,
        resetCredentials,
      }}
    >
      {isLoading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
