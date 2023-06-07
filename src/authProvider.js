import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = ({ onLogin, onSignup }) => {
  const [clgId, setClgId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (clgId.trim() === '' || password.trim() === '') {
      alert('Username and password cannot be empty');
      return;
    }

    const data = {
      loginId: clgId,
      password,
    };

    // axios.post('http://localhost:5000/login', data)
    //   .then(response => {
    //     alert('Login successful');
    //     onLogin(); // Call onLogin prop to update the loggedIn state in App.js
    //   })
    //   .catch(error => {
    //     console.error(error);
    //     alert('Login failed');
    //   });

    onLogin(); // Mocking login
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form">
        <div>
          <label htmlFor="clgId">College ID:</label>
          <input
            type="text"
            id="clgId"
            value={clgId}
            onChange={(e) => setClgId(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
      <p>
        Don't have an account?{' '}
        <button type="button" onClick={onSignup}>
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginPage;