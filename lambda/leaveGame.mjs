import mysql from 'mysql2'

export const handler = async (event) => {
  
  var pool = mysql.createPool({
    host: "",
    user: "",
    password: "",
    database: ""
  });

  let leaveGame = (username, game_id) => {
    return new Promise((resolve, reject) => {
      const selectQuery = 'SELECT seat_id FROM seats WHERE game_id = ? AND player_username = ?';
  
      pool.query(selectQuery, [game_id, username], (selectError, rows) => {
        if (selectError) {
          return reject(selectError);
        }
  
        if (rows.length === 0) {
          return reject(new Error("No empty seats available"));
        }
  
        const seatId = rows[0].seat_id;
        const updateQuery = `UPDATE seats SET player_username = "" WHERE seat_id = ?`;
  
        pool.query(updateQuery, [seatId], (updateError, updateResult) => {
          if (updateError) {
            return reject(updateError);
          }
          return resolve(updateResult);
        });
      });
    });
  };
  

  try {

    let info = await leaveGame(event.username, event.game_id);

      if (info.affectedRows){
        return{
          statusCode: 200,
          body: info.affectedRows
        }
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `unable to leave table`})
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