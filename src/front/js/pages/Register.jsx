import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/auth.css";
import "../../styles/register.css";


export const Register = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        acceptTerms: false
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.acceptTerms) {
            setError("Please accept the terms and conditions");
            return;
        }
        const success = await actions.register({
            email: formData.email,
            password: formData.password
        });
        if (success) {
            navigate("/login");
        } else {
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <div className="auth-left">
                   
                </div>
                <div className="auth-right">
                    <div className="auth-form">
                        <h2>Register</h2>
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
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        password: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-check">
                                <input 
                                    type="checkbox" 
                                    id="terms"
                                    checked={formData.acceptTerms}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        acceptTerms: e.target.checked
                                    })}
                                />
                                <label htmlFor="terms">I accept the privacy policy and terms of use.</label>
                            </div>
                            <button type="submit" className="auth-button">Register</button>
                            <div className="link-container">
                                <div className="login-prompt">
                                    <span>Already a member? </span>
                                    <a href="/login" className="register-link">Sign In</a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};