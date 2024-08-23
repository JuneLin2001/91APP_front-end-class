import { onAuthStateChanged, signInWithPopup, GithubAuthProvider, signOut } from "firebase/auth";
import { useState, createContext, useCallback, useEffect } from "react";
import { auth, provider } from "../../firebaseConfig";

export const AuthContext = createContext({
  isLogin: false,
  loading: false,
  user: {},
  githubToken: "",
  login: () => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [githubToken, setGithubToken] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsLogin(true);
        console.log("User info:", user);
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
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        setGithubToken(token);
        const user = result.user;
        setUser(user);
        setIsLogin(true);
        console.log("User info:", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GithubAuthProvider.credentialFromError(error);
        console.error("Error during GitHub login:", errorCode, errorMessage);
      });
  });

  const githubLogout = useCallback(() => {
    signOut(auth)
      .then(() => {
        setIsLogin(false);
        setUser({});
        setGithubToken("");
        console.log("Logout successful");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isLogin, loading, user, githubLogin, githubLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
