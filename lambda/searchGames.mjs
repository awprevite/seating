import mysql from 'mysql2'

export const handler = async (event) => {
  
  var pool = mysql.createPool({
    host: "",
    user: "",
    password: "",
    database: ""
  });

  let search = (host_key, start_time_date) => {
    return new Promise((resolve, reject) => {
      let query;
      let queryParams = [];
  
      if (host_key === "" && start_time_date === "") {
        query = "SELECT * FROM games WHERE host_key = ?";
        queryParams.push(host_key);
      } else if (start_time_date === "") {
        query = "SELECT * FROM games WHERE host_key = ?";
        queryParams.push(host_key);
      } else{
        query = "SELECT * FROM games WHERE DATE(start_time_date) = ? AND host_key = ?";
        queryParams.push(start_time_date, host_key);
      }
  
      pool.query(query, queryParams, (error, rows) => {
        if (error) {
          return reject(error);
        }
        return resolve(rows);
      });
    });
  };

  try {

    let games = await search(event.host_key, event.start_time_date);

    return{
      statusCode: 200,
      body: games
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