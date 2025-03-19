'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {

  // View variables
  const[homeOpen, setHomeOpen] = useState(true);
  const[loginOpen, setLoginOpen] = useState(false);
  const[createOpen, setCreateOpen] = useState(false);
  const[hostOpen, setHostOpen] = useState(false);
  const[playerOpen, setPlayerOpen] = useState(false);
  
  // Variables
  const[role, setRole] = useState<string>("player");
  const[username, setUsername] = useState<string>("");
  const[password, setPassword] = useState<string>("");
  const[confirmPassword, setConfirmPassword] = useState<string>("");
  const[totalSeats, setTotalSeats] = useState<number>(2);
  const[hostKey, setHostKey] = useState<string>("");
  const[gameName, setGameName] = useState<string>("");
  const[date, setDate] = useState<string>("");
  const[time, setTime] = useState<string>("");
  const[game, setGame] = useState<number | null>(null);
  const[games, setGames] = useState<any[]>([]);
  const[createGameOpen, setCreateGameOpen] = useState(false);
  const[usernames, setUsernames] = useState<string[]>([]);

  // API endpoints
  const urlLogin = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/login";
  const urlCreateAccount = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/createAccount";
  const urlCreateTable = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/createTable";
  const urlGetHostTableInfo = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/getHostTableInfo";
  const urlDeleteTable = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/deleteTable";
  const urlSearchGames = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/searchGames";
  const urlJoinGame = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/joinGame";
  const urlLeaveGame = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/leaveGame";
  const urlGetGameInfo = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/getTableInfo"
  const urlDeleteAccount = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/deleteAccount";

  // API functions
  const handleLogin = async () => {
    try {
      const response = await axios.post(urlLogin, {
        role: role,
        username: username,
        password: password,
      });
      const { statusCode, body } = response.data;
      if (statusCode === 200) {
        setLoginOpen(false);
        setHomeOpen(false);
        if(role === "player"){
          setPlayerOpen(true);
        }else{
          setHostOpen(true);
          getHostGameInfo();
        }
      } else {
        alert("Login failed.");
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
        role: role,
        username: username,
        password: password,
      });
      const { statusCode, body } = response.data;
      if (statusCode === 200) {
        alert("Account created successful! You can now log in.");
        setLoginOpen(true);
        setCreateOpen(false);
      } else {
        alert("Create Account failed.");
      }
    } catch (error) {
        alert("An unexpected error occurred. Please try again later.");
    }
  };

  const handleCreateGame = async () => {
    try {
      if(totalSeats === 0 || date === "" || time === ""){
        alert("Fill out all fields before creating.")
        return
      }
      const startTimeDate = date + " " + time + ":00:00";
      const response = await axios.post(urlCreateTable, {
        username: username,
        password: password,
        game_name: gameName,
        host_key: hostKey,
        total_seats: totalSeats,
        start_time_date: startTimeDate
      });
      const { statusCode } = response.data;
      alert(statusCode === 200 ? "Successfully Created Game and Seats." : "Failed to create game and seats.");
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
        game_id: game,
      });
      const { statusCode, body } = response.data;
      if (statusCode === 200) {
        alert("Joined.");
      } else {
        alert("Could Not Join.");
      }
    } catch (error) {
        alert("An unexpected error occurred. Please try again later.");
    }
    getGameInfo();
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.post(urlDeleteAccount, {
        role: role,
        username: username,
      });
      const { statusCode, body } = response.data;
      if (statusCode === 200) {
        alert("Deleted.");
      } else {
        alert("Could Not Delete.");
      }
    } catch (error) {
        alert("An unexpected error occurred. Please try again later.");
    }
    setHomeOpen(true);
    setHostOpen(false);
    setPlayerOpen(false);
  };

  const handleLeaveGame = async () => {
    try {
      const response = await axios.post(urlLeaveGame, {
        username: username,
        game_id: game,
      });
      const { statusCode, body } = response.data;
      if (statusCode === 200) {
        alert("Left.");
      } else {
        alert("Could Not Leave.");
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
        start_time_date: date
      });
      const { statusCode, body } = response.data;
      if (statusCode === 200) {
        setGames(body);
      } else {
        alert("Failed to retrieve game information.");
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again later.");
    };
  }

  const handleDeleteGame = async () => {
    try {
      const response = await axios.post(urlDeleteTable, {
        game_id: game
      });
      const { statusCode } = response.data;
      if(statusCode === 200){
        setGame(null);
      }
      alert(statusCode === 200 ? "Deleted game." : "Failed to delete game.");
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
        alert("Failed to retrieve game information.");
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again later.");
    };
  }

  const getGameInfo = async () => {
    setUsernames([]);
    try {
      const response = await axios.post(urlGetGameInfo, { 
        game_id: game
      });
      const { statusCode, game_id, seat } = response.data;
      if (statusCode === 200) {
        (seat as { player_username: string }[]).forEach((seatItem) => {
          setUsernames((prevUsernames) => [...prevUsernames, seatItem.player_username]);
        });
        console.log(usernames);
      } else {
        alert("Failed to retrieve game information.");
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  // Input handlers
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
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
  };
  const toggleCreateGame = () => {
    setCreateGameOpen(!createGameOpen);
  };
  const handleLogout = () => {
    setHomeOpen(true);
    setHostOpen(false);
    setPlayerOpen(false);
    setUsername("");
    setPassword("");
    setRole("player");
    setConfirmPassword("");
    setTotalSeats(2);
    setHostKey("");
    setDate("");
    setTime("");
    setGame(null);
    setGames([]);
  }

  // Other functions
  useEffect(() => {
    if (game !== null && role === "player") {
      getGameInfo();
    }
  }, [game]);

  const renderGameList = () => (
    <div>
      <h1>Your Games</h1>
      <ul>
        {games.map((game) => (
          <li key={game.game_id}>
            <button className="home-button" onClick={() => setGame(game.game_id)}>{game.game_name}</button>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderGameDetails = () => {
    const foundGame = games.find((t) => t.game_id === game);
    if (!foundGame) return null;

    return (
      <div>
        <button className="home-button" onClick={() => setGame(null)}>Back to Game List</button>
        <h1>Details for {foundGame.game_name}</h1>
        <p>Total Seats: {foundGame.total_seats}</p>
        <h2>Seats</h2>
        <ul>
          {foundGame.seats.map((seat: any) => (
            <li key={seat.seat_id}>
              Seat Number: {seat.seat_num}, Occupied: {seat.player_username ? seat.player_username : "-"}
            </li>
          ))}
        </ul>
        <button className="home-button" onClick={handleDeleteGame}>Delete Game</button>
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
        <div className="home-button-container">
          <button className="home-button" onClick={toggleLogin}>Login/Sign Up</button>
        </div>
        <div className="info-container">
          <h2>Find a poker game or host your own!</h2>
        </div>
        <div className="info-container">
          <div className="box left-box">
            <h2>Player</h2>
            <p>Find public games</p>
            <p>Register for private games with a key</p>
          </div>
          <div className="box right-box">
            <h2>Host</h2>
            <p>Create and manage games</p>
            <p>Customize game settings and monitor players</p>
          </div>
        </div>
        <div className="info-container">
          <p>This app is for finding and managing in person poker games</p>
        </div>
  
        {loginOpen && (
          <div className="modal-overlay">
            <div className="login-modal">
              <h2>Login</h2>
              <div className="login-button-container">
                <button className={role === "player" ? "role-button selected" : "role-button"} onClick={() => setRole("player")}>player</button>
                <button className={role === "player" ? "role-button" : "role-button selected"} onClick={() => setRole("host")}>host</button>
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
              <button className={role === "player" ? "role-button selected" : "role-button"} onClick={() => setRole("player")}>player</button>
              <button className={role === "player" ? "role-button" : "role-button selected"} onClick={() => setRole("host")}>host</button>
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
        <div className="horizontal-container">
          <button className="home-button" onClick={handleDeleteAccount}>Delete Account</button>
          <button className="home-button" onClick={handleLogout}>Log out</button>
        </div>
        <div className="vertical-container">
          <label>Enter Host Key:</label>
          <input type="text" value={hostKey} onChange={handleKeyChange}></input>
          <div className="date-picker-container">
            <label htmlFor="select-date">Select Date:</label>
            <input type="date" id="select-date" value={date} onChange={handleDateChange}/>
          </div>
          <button className="home-button" onClick={() => setDate("")}>Clear</button>
          <button className="home-button" onClick={() => handleSearchGames()}>Search</button>
          <label>Available Games</label>
          <ul>
            {games.map((game) => (
              <li key={game.game_id}>
                <button onClick={() => setGame(game.game_id)}>
                  {game.game_name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {game && (
          <div className="container">
          <button className="home-button" onClick={() => setGame(null)}>Back to Game List</button>
          <h1>Game Details</h1>
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
          <button className="home-button" onClick={handleJoinGame}>Join Game</button>
          <button className="home-button" onClick={handleLeaveGame}>Leave Game</button>
        </div>
      )}
      </div>
    );
  };


  const hostView = () => {
    return (
      <div>
        <div className="horizontal-container">
          <button className="home-button" onClick={handleLogout}>Log out</button>
          <button className="home-button" onClick={toggleCreateGame}>Create Game</button>
          <button className="home-button" onClick={handleDeleteAccount}>Delete Account</button>
        </div>
        {createGameOpen && (
          <div className="modal-overlay">
            <div className="login-modal">
              <div className="login-button-container">
                <button className="close-button" onClick={toggleCreateGame}>Back</button>
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
                <label>Game Name</label>
                <input type="text" value={gameName} onChange={(e) => setGameName(e.target.value)}/>
                <label>Key</label>
                <input type="text" value={hostKey} onChange={(e) => setHostKey(e.target.value)}/>
                <label>Date</label>
                <input type="date" id="select-date" value={date} onChange={handleDateChange}/>
                <label>Time</label>
                <select onChange={(e) => setTime(e.target.value)} value={time}>
                  {[...Array(24)].map((_, index) => (
                    <option key={index} value={index}>
                      {String(index).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <button className="login-button" onClick={handleCreateGame}>Create Game</button>
              </div>
            </div>
          </div>
        )}
        {game === null && renderGameList()}
        {game !== null && renderGameDetails()}
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