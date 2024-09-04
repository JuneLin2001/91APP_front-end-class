import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
import Loading from "../components/Loading";
const PrivateRoute = ({ children }) => {
  const { isLogin, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />; // 或者返回一個 loading 組件
  }
  return isLogin ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
