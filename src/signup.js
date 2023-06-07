import React, { useState } from 'react';
import './signup.css';
import axios from 'axios';

const SignupPage = ({ onSignup, onLogin }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [areasOfInterest, setAreasOfInterest] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = async () => {
    if (!username || !name || !email || !role || !password || !confirmPassword || !areasOfInterest || !department) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const userData = {
      username,
      name,
      email,
      role,
      password,
      areas_of_interest: areasOfInterest,
      department,
    };

    try {
      const response = await axios.post('http://localhost:5000/register', userData);

      if (response.status === 200) {
        alert('User successfully created. Please verify the OTP sent to your email address');
        onSignup();
      } else if (response.status === 503) {
        alert('User already present in the system. Please login.');
      } else {
        alert('Error: Internal Server Error');
      }
    } catch (error) {
      alert('Error: Unable to create user');
    }
  };

  const handleLogin = () => {
    // Handle the login click event
    // Implement your desired logic here
    onLogin();
  };

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      <form>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="student"
                checked={role === 'student'}
                onChange={() => setRole('student')}
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                value="faculty"
                checked={role === 'faculty'}
                onChange={() => setRole('faculty')}
              />
              Faculty
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="areasOfInterest">Areas of Interest:</label>
          <input
            type="text"
            id="areasOfInterest"
            value={areasOfInterest}
            onChange={(e) => setAreasOfInterest(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>

        <button type="button" onClick={handleSubmit}>
          Sign Up
        </button>
        <button type="button" onClick={handleLogin}>
          Log In
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
