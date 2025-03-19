import mysql from 'mysql2'

export const handler = async (event) => {
  
  var pool = mysql.createPool({
    host: "",
    user: "",
    password: "",
    database: ""
  });

  let getHostId = (username, password) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT host_id FROM hosts WHERE username = ? AND password = ?", [username, password], (error, rows) => {
        if (error) { return reject(error); }
        if (rows.length === 0) {
          return reject(new Error("No host found with the provided username and password"));
        }
        return resolve(rows[0].host_id);
      });
    });
  };

  let getGames = (host_id) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM games WHERE host_id = ?", [host_id], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      })
    })
  }

  let getSeat = (game_id) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM seats WHERE game_id = ?", [game_id], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      })
    })
  }

  try {

    let host_id = await getHostId(event.username, event.password);
    host_id = parseInt(host_id);

    let games = await getGames(host_id);

    let gamesWithSeats = await Promise.all(
      games.map(async (game) => {
        let seats = await getSeat(game.game_id);
        return { ...game, seats };
      })
    );

    if (gamesWithSeats){
      return{
        statusCode: 200,
        body: gamesWithSeats
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Unable to retrieve games"})
      };
    }

  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };

  } finally {

    pool.end()
    
  }
};