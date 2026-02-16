import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return <Navigate to="/login" state={{ from: location }} replace />;
        }

        if (requiredRole && decoded.role !== requiredRole) {
            // Optional: Redirect to unauthorized page or just dashboard
            return <Navigate to="/admin" replace />;
        }

    } catch (error) {
        localStorage.removeItem("token");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
