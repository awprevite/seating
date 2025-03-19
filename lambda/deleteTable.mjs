import mysql from 'mysql2'

export const handler = async (event) => {
  
  var pool = mysql.createPool({
    host: "",
    user: "",
    password: "",
    database: ""
  });

  let deleteGame = (game_id) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM games WHERE game_id = ?", [game_id], (error, rows) => {
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

  try {

    let deletedSeats = await deleteSeats(event.game_id);

    let deletedGame = await deleteGame(event.game_id);

    if (deletedGame.affectedRows){
      return{
        statusCode: 200,
        body: `removed ${deletedGame.affectedRows} games`
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No games were removed"})
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