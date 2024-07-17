import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // useNavigate hook for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/token', new URLSearchParams({
        username: email,
        password: password,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      localStorage.setItem('token', response.data.access_token);
      setMessage('Login successful!');
      navigate('/notepage');  // Navigate to Notepage on successful login
    } catch (error) {
      setMessage('Login failed!');
    }
  };

  return (
    <div>
      <h2 style={{'textAlign':'center'}}>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="email-input"
         
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="password-input"
        />
        <button type="submit" className="btn-primary" >Login</button>  {/* Updated to a button */}
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
