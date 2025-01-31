import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/auth.css";
import "../../styles/login.css";


export const Login = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.login(formData);
        if (success) {
            navigate("/private");
        } else {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <div className="auth-left">
                    <div className="auth-form">
                        <h2>Sign In</h2>
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        email: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input 
                                    type="password" 
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        password: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <button type="submit" className="auth-button">Sign In</button>
                            <div className="link-container">
                                <a href="#" className="forgot-password">Forgot password?</a>
                                <div className="register-prompt">
                                    <span>New here? </span>
                                    <a href="/" className="register-link">Register Now</a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="auth-right">
                  
                </div>
            </div>
        </div>
    );
};
