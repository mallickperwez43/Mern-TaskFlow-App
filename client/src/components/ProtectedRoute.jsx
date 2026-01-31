import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const ProtectedRoute = () => {
    const { isAuthenticated, isChecking } = useAuthStore();

    if (isChecking) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    // If not authenticated, redirect to login
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;