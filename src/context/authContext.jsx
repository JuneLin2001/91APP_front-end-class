import {
  onAuthStateChanged,
  signInWithPopup,
  GithubAuthProvider,
  signOut,
} from "firebase/auth";
import { useState, createContext, useCallback, useEffect } from "react";
import { auth } from "../../firebaseConfig";

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
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [CRUDtoken, setCRUDtoken] = useState(
    localStorage.getItem("CRUDtoken") || ""
  );

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
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // const email = error.email;
        // const credential = GithubAuthProvider.credentialFromError(error);
        console.error("Error during GitHub login:", errorCode, errorMessage);
      });
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
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLogin, loading, user, CRUDtoken, githubLogin, githubLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
