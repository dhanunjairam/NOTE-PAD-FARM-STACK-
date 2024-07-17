import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:8000/user', { email, password });
      setMessage('Registration successful!');
    } catch (error) {
      setMessage('Registration failed!');
    }
  };

  return (
    <div>
      <h2 style={{'textAlign':'center'}}>Register</h2>
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
        <button type="submit" className="btn-primary" >Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
