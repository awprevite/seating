import mysql from 'mysql2';

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

  let createGame = (host_id, game_name, total_seats, host_key, start_time_date) => {
    return new Promise((resolve, reject) => {
      pool.query("INSERT INTO games (host_id, game_name, host_key, total_seats, start_time_date) VALUES (?, ?, ?, ?, ?)", [host_id, game_name, host_key, total_seats, start_time_date], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      });
    });
  };

  let createSeat = (seat_num, game_id) => {
    return new Promise((resolve, reject) => {
      pool.query("INSERT INTO seats (seat_num, game_id) VALUES (?, ?)", [seat_num, game_id], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      });
    });
  };

  try {

    let host_id = await getHostId(event.username, event.password);
    host_id = parseInt(host_id);

    const gameInfo = await createGame(host_id, event.game_name, event.total_seats, event.host_key, event.start_time_date);

    if (gameInfo.insertId) {

      const game_id = gameInfo.insertId;

      let seatInfo;
      let total_seats = event.total_seats;

      for (let seat_num = 1; seat_num <= total_seats; seat_num++) {
        seatInfo = await createSeat(seat_num, game_id);
      }

      const game_name = event.game_name;

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Game and seats created successfully', game_id, total_seats, game_name })
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Unable to create game" })
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