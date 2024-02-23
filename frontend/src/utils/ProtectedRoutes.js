import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../routes/Root';

/**
 * Protect the route from unauthorized access
 * 
 * @param {Object} element  - The element to be protected
 * @returns 
 */
function ProtectedRoute({ element }) {
    const { isAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/signin');
        }
    }, [isAuthenticated, navigate]);

    return element;
}

export default ProtectedRoute;