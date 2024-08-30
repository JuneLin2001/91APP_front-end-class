import {
  onAuthStateChanged,
  signInWithPopup,
  GithubAuthProvider,
  signOut,
} from "firebase/auth";
import { useState, createContext, useCallback, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({
  isLogin: false,
  loading: false,
  user: {},
  CRUDtoken: "",
  login: () => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [CRUDtoken, setCRUDtoken] = useState(
    localStorage.getItem("CRUDtoken") || ""
  );
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsLogin(true);
        const storedToken = localStorage.getItem("CRUDtoken");
        if (storedToken) {
          setCRUDtoken(storedToken);
        }
      } else {
        setUser(null);
        setIsLogin(false);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const githubLogout = useCallback(() => {
    signOut(auth)
      .then(() => {
        setIsLogin(false);
        setUser({});
        setCRUDtoken("");
        localStorage.removeItem("CRUDtoken");

        console.log("Logout successful");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        const errorMessage = error.message || "Something went wrong";
        navigate("/error", { state: { errorMessage } });
      });
  }, [navigate]);

  const githubLogin = useCallback(() => {
    const provider = new GithubAuthProvider();
    provider.addScope("repo");
    provider.addScope("user");

    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        setUser(user);
        setIsLogin(true);
        setCRUDtoken(token);

        localStorage.setItem("CRUDtoken", token);

        const timeoutId = setTimeout(() => {
          githubLogout();
        }, 28800 * 1000);

        return () => {
          clearTimeout(timeoutId);
        };
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error during GitHub login:", errorCode, errorMessage);
        navigate("/error", { state: { errorMessage } });
      });
  }, [githubLogout, navigate]);

  return (
    <AuthContext.Provider
      value={{ isLogin, loading, user, CRUDtoken, githubLogin, githubLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
