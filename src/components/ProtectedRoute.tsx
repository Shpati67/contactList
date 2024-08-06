import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectToken } from "../features/authSlice";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = useSelector(selectToken);
  console.log(token);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) return;
    navigate("/login");
  }, [token]);

  return <>{children}</>;
};

export default ProtectedRoute;
