'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {

  // Page open variables
  const[homeOpen, setHomeOpen] = useState(true);
  const[loginOpen, setLoginOpen] = useState(false);
  const[createOpen, setCreateOpen] = useState(false);
  const[hostOpen, setHostOpen] = useState(false);
  const[playerOpen, setPlayerOpen] = useState(false);
  
  // Login variables
  const[selectedRole, setSelectedRole] = useState<string>("player");
  const[username, setUsername] = useState<string>("");
  const[password, setPassword] = useState<string>("");
  const[confirmPassword, setConfirmPassword] = useState<string>("");

  // Host variables
  const [totalSeats, setTotalSeats] = useState<number>(2);
  const [hostKey, setHostKey] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [games, setGames] = useState<any[]>([]);
  const [createGameOpen, setCreateGameOpen] = useState(false);

  // Player variables
  const [selectedGamePlayer, setSelectedGamePlayer] = useState<number | null>(null);
  const [selectedDatePlayer, setSelectedDatePlayer] = useState<string>("");
  const [hostKeyPlayer, setHostKeyPlayer] = useState<string>("");
  const [usernames, setUsernames] = useState<string[]>([]);

  // API endpoints
  const urlLogin = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/login";
  const urlCreateAccount = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/createAccount";
  const urlCreateTable = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/createTable";
  const urlGetHostTableInfo = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/getHostTableInfo";
  const urlDeleteTable = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/deleteTable";
  const urlSearchGames = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/searchGames";
  const urlJoinGame = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/joinGame";
  const urlGetGameInfo = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/getTableInfo"

  // API functions
  const handleCreateGame = async () => {
    try {
      if(totalSeats === 0 || selectedDate === "" || selectedTime === ""){
        alert("Fill out all fields before creating")
        return
      }
      const startTimeDate = selectedDate + " " + selectedTime + ":00:00";
      const response = await axios.post(urlCreateTable, {
        username: username,
        password: password,
        host_key: hostKey,
        total_seats: totalSeats,
        start_time_date: startTimeDate
      });
      const { statusCode } = response.data;
      alert(statusCode === 200 ? "Successfully Created Game and Seats!" : "Failed to create game and seats");
      setCreateGameOpen(false);
    } catch (error) {
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      getHostGameInfo();
    }
  };

  const handleJoinGame = async () => {
    try {
      const response = await axios.post(urlJoinGame, {
        username: username,
        game_id: selectedGame,
      });

      const { statusCode, body } = response.data;

      if (statusCode === 200) {
        alert("Joined");
      } else {
        alert("Could Not Join");
      }
    } catch (error) {
        alert("An unexpected error occurred. Please try again later.");
    }

    getGameInfo();
  };

  const handleSearchGames = async () => {
    try {
      const response = await axios.post(urlSearchGames, { 
        host_key: hostKey, 
        start_time_date: selectedDate
      });
      const { statusCode, body } = response.data;
      if (statusCode === 200) {
        setGames(body);
      } else {
        alert("Failed to retrieve game information");
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again later.");
    };
  }

  const handleDeleteGame = async () => {
    try {
      const response = await axios.post(urlDeleteTable, {
        game_id: selectedGame
      });
      const { statusCode } = response.data;
      if(statusCode === 200){
        setSelectedGame(null);
      }
      alert(statusCode === 200 ? "Deleted game" : "Failed to delete game");
    } catch (error) {
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      getHostGameInfo();
    }
  };

  const getHostGameInfo = async () => {
    try {
      const response = await axios.post(urlGetHostTableInfo, { 
        username: username, 
        password: password 
      });
      const { statusCode, body } = response.data;
      if (statusCode === 200) {
        setGames(body);
      } else {
        alert("Failed to retrieve game information");
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again later.");
    };
  }

  const getGameInfo = async () => {
    console.log(selectedGame)
    try {
      const response = await axios.post(urlGetHostTableInfo, { 
        game_id: selectedGame
      });
      const { statusCode, game, seat } = response.data;

      console.log(statusCode);
      console.log(seat);
  
      if (statusCode === 200) {
        (seat as { player_username: string }[]).forEach((seatItem) => {
          usernames.push(seatItem.player_username)
        });
      } else {
        alert("Failed to retrieve game information");
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(urlLogin, {
        role: selectedRole,
        username: username,
        password: password,
      });

      const { statusCode, body } = response.data;
      const { id, returnedUsername, returnedPassword } = body;
      console.log("ID:", id);
      console.log("Username:", returnedUsername);
      console.log("Password:", returnedPassword);
      console.log(statusCode);

      if (statusCode === 200) {
        alert("Login successful!");
        setLoginOpen(false);
        setHomeOpen(false);
        if(selectedRole === "player"){
          setPlayerOpen(true);
        }else{
          setHostOpen(true);
          getHostGameInfo();
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
        username: username,
        password: password,
      });

      const { statusCode, body } = response.data;
      const { id, returnedUsername, returnedPassword } = body;
      console.log("ID:", id);
      console.log("username:", returnedUsername);
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

  // Input handlers
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHostKey(e.target.value);
  };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };
  const toggleLogin = () => {
    setLoginOpen(!loginOpen);
  };
  const toggleCreate = () => {
    setCreateOpen(!createOpen);
  }
  const toggleCreateGame = () => {
    setCreateGameOpen(!createGameOpen);
  }
  const handleLogout = () => {
    setHomeOpen(true);
    setHostOpen(false);
    setPlayerOpen(false);
    setUsername("");
    setPassword("");
    setSelectedRole("player");
    setConfirmPassword("");
    setTotalSeats(2);
    setHostKey("");
    setSelectedDate("");
    setSelectedTime("");
    setSelectedGame(null);
    setGames([]);
  }

  // Other functions

  const renderGameList = () => (
    <div>
      <h1>Your Games</h1>
      <ul>
        {games.map((game) => (
          <li key={game.game_id}>
            <button onClick={() => setSelectedGame(game.game_id)}>
              {game.total_seats} seats
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderGameDetails = () => {
    const game = games.find((t) => t.game_id === selectedGame);
    if (!game) return null;

    return (
      <div>
        <button onClick={() => setSelectedGame(null)}>Back to Game List</button>
        <h1>Details for {game.game_id}</h1>
        <p>Total Seats: {game.total_seats}</p>
        <h2>Seats</h2>
        <ul>
          {game.seats.map((seat: any) => (
            <li key={seat.seat_id}>
              Seat Number: {seat.seat_num}, Occupied: {seat.player_id ? seat.player_id : "no"}
            </li>
          ))}
        </ul>
        <button onClick={handleDeleteGame}>Delete Game</button>
      </div>
    );
  };

  const handleNameClick = (name: string) => {
    console.log(`Name clicked: ${name}`);
  };

  // Views
  const homeView = () => {
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
                <button className={selectedRole === "player" ? "role-button selected" : "role-button"} onClick={() => setSelectedRole("player")}>player</button>
                <button className={selectedRole === "player" ? "role-button" : "role-button selected"} onClick={() => setSelectedRole("host")}>host</button>
                <button className="close-button" onClick={toggleLogin}>Back</button>
              </div>
              <div className="login-input-container">
                <label className="login-label">Username</label>
                <input className="login-input" type="text" placeholder="username" required onChange={handleUsernameChange}/>
  
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
              <button className={selectedRole === "player" ? "role-button selected" : "role-button"} onClick={() => setSelectedRole("player")}>player</button>
              <button className={selectedRole === "player" ? "role-button" : "role-button selected"} onClick={() => setSelectedRole("player")}>host</button>
              <button className="close-button" onClick={() => {toggleLogin(); toggleCreate();}}>Back</button>
            </div>
            <div className="login-input-container">
              <label className="login-label">Username</label>
              <input className="login-input" type="text" placeholder="username" required onChange={handleUsernameChange}/>
  
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

  const playerView = () => {

    return(
      <div>
        <label>Enter Host Key:</label>
        <input type="text" value={hostKey} onChange={handleKeyChange}></input>
        <label>Filter by Date</label>
        <div className="date-picker-container">
          <label htmlFor="select-date">Select Date:</label>
          <input type="date" id="select-date" value={selectedDate} onChange={handleDateChange}/>
        </div>
        <button onClick={() => setSelectedDate("")}>Clear</button>
        <button onClick={() => handleSearchGames()}>Search</button>
        <label>Available Games</label>
        <ul>
          {games.map((game) => (
            <li key={game.game_id}>
              <button onClick={() => {setSelectedGame(game.game_id); getGameInfo();}}>
                {game.game_id}
              </button>
            </li>
          ))}
        </ul>
        {selectedGame && (
          <div className="container">
          <button onClick={() => setSelectedGame(null)}>Back to Game List</button>
          <h1>Details for {games.find((game) => game.game_id === selectedGame)?.game_id}</h1>
          <div className="table-container">
            <div className="table">
              {usernames.map((username, index) => {
                const angle = (360 / usernames.length) * index;
                const x = Math.ceil(250 + 250 * Math.cos((angle * Math.PI) / 180));
                const y = Math.ceil(125 + 125 * Math.sin((angle * Math.PI) / 180));
                return (
                  <div
                    key={index}
                    className={`name position-${index + 1}`}
                    style={{position: 'absolute', left: `${x}px`, top: `${y}px`, transform: `translate(-50%, -50%)`,}}>
                    <button onClick={() => handleNameClick(username)}>{username}</button>
                  </div>
                );
              })}
            </div>
          </div>
          <button onClick={handleJoinGame}>Join Game</button>
        </div>
      )}
      </div>
    );
  };


  const hostView = () => {
    return (
      <div>
        <div className="login-button-container">
          <button onClick={handleLogout}>Log out</button>
          <button onClick={toggleCreateGame}>Create Game</button>
        </div>
        {createGameOpen && (
          <div className="modal-overlay">
            <div className="login-modal">
              <div className="login-button-container">
                <button onClick={toggleCreateGame}>Back</button>
              </div>
              <div className="login-input-container">
                <label>Total Seats</label>
                <select onChange={(e) => setTotalSeats(Number(e.target.value))} value={totalSeats}>
                  {[...Array(8)].map((_, index) => (
                    <option key={index} value={index + 2}>
                      {index + 2}
                    </option>
                  ))}
                </select>
                <label>Key</label>
                <input type="text" value={hostKey} onChange={(e) => setHostKey(e.target.value)}/>
                <label>Date</label>
                <input type="date" id="select-date" value={selectedDate} onChange={handleDateChange}/>
                <label>Time</label>
                <select onChange={(e) => setSelectedTime(e.target.value)} value={selectedTime}>
                  {[...Array(24)].map((_, index) => (
                    <option key={index} value={index}>
                      {String(index).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <button onClick={handleCreateGame}>Create Game</button>
              </div>
            </div>
          </div>
        )}
        {selectedGame === null && renderGameList()}
        {selectedGame !== null && renderGameDetails()}
      </div>
    )
  }

  return (
    <div>
      {homeOpen && homeView()}
      {hostOpen && hostView()}
      {playerOpen && playerView()}
    </div>
  );
}