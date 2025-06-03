
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    useEffect(() => {
        // Only redirect after loading is complete and no user found
        if (!loading && !user) {
            console.log('No authenticated user, redirecting to customer login');
            window.location.href = 'http://localhost:5173';
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