'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function LoginPage() {

  const[loginOpen, setLoginOpen] = useState(false);
  const[createOpen, setCreateOpen] = useState(false);

  const router = useRouter();

  const handleLogin = () => {
    setLoginOpen(false);
    setCreateOpen(false);
    router.push('/newpage');
  };

  const toggleLogin = () => {
    setLoginOpen(!loginOpen);
  };

  const toggleCreate = () => {
    setCreateOpen(!createOpen);
  }

  return (
    <div>
      <header>
        <button onClick={toggleLogin}>Login/Sign Up</button>
      </header>

      {loginOpen && (
        <div className="modal-overlay">
          <div className="login-modal">
            <div className="login-button-container">
              <button className="close-button" onClick={toggleLogin}>Back</button>
            </div>
            <div className="login-input-container">
              <label className="login-label">Email</label>
              <input className="login-input" type="text" placeholder="email" id="email" name="email" required />

              <label className="login-label">Password</label>
              <input className="login-input" type="password" placeholder="password" id="password" name="password" required />
            </div>
            <div className="login-button-container">
              <button className="login-button" onClick={handleLogin}>Login</button>
              <button className="login-button" onClick={() => {toggleLogin(); toggleCreate();}}>Create Account</button>
            </div>
          </div>
        </div>
      )}
      
      {createOpen && (
        <div className="modal-overlay">
        <div className="login-modal">
          <div className="login-button-container">
            <button className="close-button" onClick={() => {toggleLogin(); toggleCreate();}}>Back</button>
          </div>
          <div className="login-input-container">
            <label className="login-label">Email</label>
            <input className="login-input" type="text" placeholder="email" id="email" name="email" required />

            <label className="login-label">Password</label>
            <input className="login-input" type="password" placeholder="password" id="password" name="password" required />

            <label className="login-label">Confirm Password</label>
            <input className="login-input" type="password" placeholder="confirm password" id="password" name="password" required />
          </div>
          <div className="login-button-container">
            <button className="login-button" onClick={handleLogin}>Create Account</button>
          </div>
        </div>
      </div>
      )}    
    </div>
  );
}
