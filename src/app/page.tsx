'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {

  const[loginOpen, setLoginOpen] = useState(false);
  const[createOpen, setCreateOpen] = useState(false);
  const[selectedRole, setSelectedRole] = useState<string>("player");
  const[email, setEmail] = useState<string>("");
  const[password, setPassword] = useState<string>("");
  const[confirmPassword, setConfirmPassword] = useState<string>("");
  const[userId, setUserId] = useState<number>(0)

  const router = useRouter();

  const urlLogin = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/login";
  const urlCreateAccount = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/createAccount";

  const handleLogin = async () => {

    try {
      const response = await axios.post(urlLogin, {
        role: selectedRole,
        email: email,
        password: password,
      });

      const { statusCode, body } = response.data;

      const { id, returnedEmail, returnedPassword } = body;

      console.log("ID:", id);
      console.log("Email:", returnedEmail);
      console.log("Password:", returnedPassword);
      console.log(statusCode);

      if (statusCode === 200) {
        alert("Login successful!");
        setUserId(id);
        setLoginOpen(false);
        if(selectedRole === "player"){
          router.push('/player');
        }else{
          router.push('/host')
        }
      } else {
        alert("Login failed");
      }
    } catch (error) {
        alert("An unexpected error occurred. Please try again later.");
    }
  };

  const handleCreateAccount = async () => {
    try {

      if(password != confirmPassword){
        alert("passwords do not match")
        return
      }

      const response = await axios.post(urlCreateAccount, {
        role: selectedRole,
        email: email,
        password: password,
      });

      const { statusCode, body } = response.data;

      const { id, returnedEmail, returnedPassword } = body;

      console.log("ID:", id);
      console.log("Email:", returnedEmail);
      console.log("Password:", returnedPassword);

      if (statusCode === 200) {
        alert("Account sreated successful! You can now log in.");
        setLoginOpen(true);
        setCreateOpen(false);
      } else {
        alert("Create Account failed");
      }
    } catch (error) {
        alert("An unexpected error occurred. Please try again later.");
    }
  };

  const toggleLogin = () => {
    setLoginOpen(!loginOpen);
  };

  const toggleCreate = () => {
    setCreateOpen(!createOpen);
  }

  const handleSelectedRole = (role:string) => {
    setSelectedRole(role);
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
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
              <button className={selectedRole === "player" ? "role-button selected" : "role-button"} onClick={() => handleSelectedRole("player")}>player</button>
              <button className={selectedRole === "player" ? "role-button" : "role-button selected"} onClick={() => handleSelectedRole("host")}>host</button>
              <button className="close-button" onClick={toggleLogin}>Back</button>
            </div>
            <div className="login-input-container">
              <label className="login-label">Email</label>
              <input className="login-input" type="text" placeholder="email" id="email" name="email" required onChange={handleEmailChange}/>

              <label className="login-label">Password</label>
              <input className="login-input" type="password" placeholder="password" id="password" name="password" required onChange={handlePasswordChange}/>
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
            <button className={selectedRole === "player" ? "role-button selected" : "role-button"} onClick={() => handleSelectedRole("player")}>player</button>
            <button className={selectedRole === "player" ? "role-button" : "role-button selected"} onClick={() => handleSelectedRole("player")}>host</button>
            <button className="close-button" onClick={() => {toggleLogin(); toggleCreate();}}>Back</button>
          </div>
          <div className="login-input-container">
            <label className="login-label">Email</label>
            <input className="login-input" type="text" placeholder="email" id="email" name="email" required onChange={handleEmailChange}/>

            <label className="login-label">Password</label>
            <input className="login-input" type="password" placeholder="password" id="password" name="password" required onChange={handlePasswordChange}/>

            <label className="login-label">Confirm Password</label>
            <input className="login-input" type="password" placeholder="confirm password" id="confirm-password" name="confirm-password" required onChange={handleConfirmPasswordChange}/>
          </div>
          <div className="login-button-container">
            <button className="login-button" onClick={handleCreateAccount}>Create Account</button>
          </div>
        </div>
      </div>
      )}    
    </div>
  );
}
