import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";


import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Private } from "./pages/Private.jsx";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

import injectContext from "./store/appContext";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
        <BrowserRouter basename={basename}>
            <ScrollToTop>
                <Navbar />
                <Routes>

                    <Route element={<Login />} path="/login" />
                    <Route element={<Register />} path="/" />
                    <Route element={<Private />} path="/private" />
                    <Route element={<h1>Not found!</h1>} path="*" />
                </Routes>
                <Footer />
            </ScrollToTop>
        </BrowserRouter>
    </div>
    );
};

export default injectContext(Layout);