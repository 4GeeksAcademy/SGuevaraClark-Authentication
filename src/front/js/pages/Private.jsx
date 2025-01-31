import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Private = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            if (!localStorage.getItem('token')) {
                navigate('/');
                return;
            }
            
            const isValid = await actions.checkUser();
            if (!isValid) {
                localStorage.removeItem('token');
                navigate('/');
            }
        };
        
        checkAuth();
    }, []);

    const handleLogout = () => {
        actions.logout();
        navigate('/');
    };

    return (
        <div>
            <h2>Private View</h2>
            <p>Welcome: {store.user?.email}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};