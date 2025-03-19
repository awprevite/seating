import mysql from 'mysql2'

export const handler = async (event) => {
  
  var pool = mysql.createPool({
    host: "",
    user: "",
    password: "",
    database: ""
  });

  let getGameInfo = (game_id) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM games WHERE game_id = ?", [game_id], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      })
    })
  }

  let getSeatInfo = (game_id) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM seats WHERE game_id = ?", [game_id], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      })
    })
  }

  try {

    let gameInfo = await getGameInfo(event.game_id);
    let seatInfo = await getSeatInfo(event.game_id);

    if(gameInfo.length === 0){
      return{
        statusCode: 400,
        body: JSON.stringify({message: "no game info"})
      }
    }else if(seatInfo.length === 0){
      return{
        statusCode: 400,
        body: JSON.stringify({message: "no seat info"})
      }
    }else{
      return{
        statusCode: 200,
        game: gameInfo, 
        seat: seatInfo
      }
    }

  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };

  } finally {

    pool.end()
    
  }
}