import { useState, useEffect } from "react";
import { auth, provider } from "../../firebaseConfig";
import { signInWithPopup, GithubAuthProvider, onAuthStateChanged } from "firebase/auth";

const GitHubLogin = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const githubLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        const user = result.user;
        console.log("User info:", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GithubAuthProvider.credentialFromError(error);
        console.error("Error during GitHub login:", errorCode, errorMessage);
      });
  };

  return (
    <>
      <button onClick={githubLogin}>Login with GitHub</button>
      {user ? (
        <div>
          <h2>Welcome, {user.displayName}</h2>
        </div>
      ) : (
        <div>No, 404</div>
      )}
    </>
  );
};

export default GitHubLogin;
