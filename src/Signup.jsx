import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
    
        console.log('Submitting form...');
    
        axios.post('http://localhost:4004/Signup', { name, email, password })
            .then((response) => {
                console.log('Server response:', response.data);
                navigate('/Login');
            })
            .catch((err) => {
                console.error('Error submitting form:', err);
            });
    };
    



return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
        <div className="bg-white p-3 rounded w-25">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name">
                        <strong>Name</strong>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Name"
                        autoComplete="off"
                        name="name"
                        className="form-control rounded-0"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

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
                    Register
                </button>
            </form>

            <p>Already have an Account</p>
            <Link to="/login" className="login-link">
                Login
            </Link>
        </div>
    </div>
);
}

export default Signup;
