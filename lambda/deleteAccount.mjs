import mysql from 'mysql2'

export const handler = async (event) => {
  
  var pool = mysql.createPool({
    host: "",
    user: "",
    password: "",
    database: ""
  });

  let getHostId = (username) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT host_id FROM hosts WHERE username = ?", [username], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows[0]?.host_id);
      })
    })
  }

  let getHostGames = (host_id) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT game_id FROM games WHERE host_id = ?", [host_id], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      })
    })
  }

  let deleteSeats = (game_id) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM seats WHERE game_id = ?", [game_id], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      })
    })
  }

  let deleteGames = (host_id) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM games WHERE host_id = ?", [host_id], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      })
    })
  }

  let deleteHostAccount = (username) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM hosts WHERE username = ?", [username], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      })
    })
  }

  let clear_player = (username) => {
    return new Promise((resolve, reject) => {
      pool.query('UPDATE seats SET player_username = ? WHERE player_username = ?', [username, username], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      })
    })
  }

  let deletePlayerAccount = (username) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM players WHERE username = ?", [username], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      })
    })
  }

  try {

    let username = event.username;
    let userInfo;

    if(event.role === "host"){
      let host_id = await getHostId(username);
      let hostGames = await getHostGames(host_id);

      // Loop through each game_id and delete seats
      for (let game of hostGames) {
        await deleteSeats(game.game_id);
      }

      await deleteGames(host_id);
      userInfo = await deleteHostAccount(username); 
    } else {
      await clear_player(username);
      userInfo = await deletePlayerAccount(username);
    }

    if (userInfo.affectedRows){
      return {
        statusCode: 200,
        body: JSON.stringify({ affectedRows: userInfo.affectedRows })
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: `unable to delete account for ${event.role}` })
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    pool.end();
  }
};