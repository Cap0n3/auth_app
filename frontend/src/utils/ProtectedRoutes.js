import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../main';

/**
 * Protect the route from unauthorized access
 * 
 * @param {Object} element  - The element to be protected
 * @returns 
 */
function ProtectedRoute({ element }) {
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/signin');
        }
    }, [currentUser, navigate]);

    console.log("ProtectedRoute: ", currentUser);
    console.log("Element: ", element)

    return element;
}

export default ProtectedRoute;