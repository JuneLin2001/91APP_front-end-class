import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
const PrivateRoute = ({ children }) => {
  const { isLogin, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // 或者返回一個 loading 組件
  }
  return isLogin ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
