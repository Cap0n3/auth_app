import { useContext } from 'react';
import Nav from '../components/Common/Navbar';
import { UserContext } from '../main';
import { Outlet } from 'react-router-dom';

export default function Root() {
    const currentUser = useContext(UserContext);

    return (
        <>
            <Nav />
            {/* This is where the child routes will be rendered */}
            <Outlet />
        </>
    );
}