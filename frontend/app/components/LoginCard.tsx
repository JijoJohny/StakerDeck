import React, { useState } from 'react';


const LoginCard = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Call backend API for login
      console.log('Logging in with:', { email, password });
    } else {
      // Call backend API for registration
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      console.log('Registering with:', { email, password });
    }
    onClose(); // Close the card after login/register
  };

  return (
    <div className="login-card-overlay">
      <div className="login-card">
        <button className="close-button" onClick={onClose}>X</button>

        <h2>{isLogin ? 'Login' : 'Register'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-container">
            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {!isLogin && (
            <div className="input-container">
              <label>Confirm Password:</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>
          )}

          <button type="submit" className="submit-button">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p onClick={() => setIsLogin(!isLogin)} className="toggle-text">
          {isLogin ? 'Don’t have an account? Register' : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  );
};

export default LoginCard;
