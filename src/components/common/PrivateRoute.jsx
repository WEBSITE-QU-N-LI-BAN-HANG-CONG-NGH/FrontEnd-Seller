
import { useEffect} from 'react';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const urlCustomer = import.meta.env.VITE_CUSTOMER_URL || 'http://localhost:5173';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    useEffect(() => {
        // Only redirect after loading is complete and no user found
        if (!loading && !user) {
            console.log('No authenticated user, redirecting to customer login');
            window.location.href = urlCustomer;
        }
    }, [user, loading]);

    // Show loading while checking authentication
    if (loading) {
        return <LoadingSpinner />;
    }

    // Don't render anything if redirecting
    if (!user) {
        return null;
    }

    return children;
};

export default PrivateRoute;