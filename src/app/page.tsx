'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {

  const[loginOpen, setLoginOpen] = useState(false);
  const[createOpen, setCreateOpen] = useState(false);
  const[selectedRole, setSelectedRole] = useState(true); {/*true is for player*/}

  const router = useRouter();

  const urlLogin = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/login";

  const handleLogin = async () => {
    try {
      const response = await axios.post(urlLogin, {
        email: "awprevite",
        password: "password",
      });

      const { statusCode, body } = response.data;

      const { host_id, email, password } = body;

      console.log("Host ID:", host_id);
      console.log("Email:", email);
      console.log("Password:", password);


      if (statusCode === 200) {
        alert("Login successful!");
      } else {
        alert("Login failed");
      }
    } catch (error) {
        //console.error("Login Error:", error.response?.data || error.message);
        alert("An unexpected error occurred. Please try again later.");
    }
  };



    {/*
    setLoginOpen(false);
    setCreateOpen(false);
    if(selectedRole === true){
      router.push('/player');
    }else{
      router.push('host');
    }
    */}

  const toggleLogin = () => {
    setLoginOpen(!loginOpen);
  };

  const toggleCreate = () => {
    setCreateOpen(!createOpen);
  }

  const handleSelectedRole = (role:boolean) => {
    setSelectedRole(role);
  }

  return (
    <div>
      <header>
        <button onClick={toggleLogin}>Login/Sign Up</button>
      </header>

      {loginOpen && (
        <div className="modal-overlay">
          <div className="login-modal">
            <h2>Login</h2>
            <div className="login-button-container">
              <button className={selectedRole === true ? "role-button selected" : "role-button"} onClick={() => handleSelectedRole(true)}>player</button>
              <button className={selectedRole === true ? "role-button" : "role-button selected"} onClick={() => handleSelectedRole(false)}>host</button>
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
          <h2>Create Account</h2>
          <div className="login-button-container">
            <button className={selectedRole === true ? "role-button selected" : "role-button"} onClick={() => handleSelectedRole(true)}>player</button>
            <button className={selectedRole === true ? "role-button" : "role-button selected"} onClick={() => handleSelectedRole(false)}>host</button>
            <button className="close-button" onClick={() => {toggleLogin(); toggleCreate();}}>Back</button>
          </div>
          <div className="login-input-container">
            <label className="login-label">Email</label>
            <input className="login-input" type="text" placeholder="email" id="email" name="email" required />

            <label className="login-label">Password</label>
            <input className="login-input" type="password" placeholder="password" id="password" name="password" required />

            <label className="login-label">Confirm Password</label>
            <input className="login-input" type="password" placeholder="confirm password" id="confirm-password" name="confirm-password" required />
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
