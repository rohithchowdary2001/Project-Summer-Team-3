import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });
      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      alert('Login failed: ' + err.response?.data?.message);
    }
  };
  const handleRegisterRedirect = () => {
    navigate('/register');
  };
  return (
<div className="login-container">
    <h2>Login Page</h2>
    <form onSubmit={handleLogin}>
      <input type="text" placeholder="Username" value={username}
        onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
    <button onClick={handleRegisterRedirect}>Register Now</button>
  </div>
);
}

export default LoginPage;
