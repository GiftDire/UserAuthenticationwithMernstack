import React from 'react'
import { useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:4004/Login', { email, password })
            .then((result) => {
                console.log(result);
                if (result.data === "success") {
                    navigate('/Dashboard');
                }
            })
            .catch((err) => console.log(err));
    };
    return (

        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>


                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            className="form-control rounded-0"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            className="form-control rounded-0"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-default border w-100 bg-light rounded-0 text-decorate-green">
                        Login
                    </button>
                </form>


                <p> Do not have an account?</p>
                <Link to="/Signup" className="signup-link">
                    Signup
                </Link>
            </div>
        </div>
    );
}

export default Login;
