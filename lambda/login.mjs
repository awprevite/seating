import mysql from 'mysql2'

export const handler = async (event) => {
  
  var pool = mysql.createPool({
    host: "",
    user: "",
    password: "",
    database: ""
  });

  let loginHost = (username, password) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM hosts WHERE username = ? AND password = ?", [username, password], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      })
    })
  }

  let loginPlayer = (username, password) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM players WHERE username = ? AND password = ?", [username, password], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      })
    })
  }

  try {

    let userInfo;

    if(event.role === "host"){
      userInfo = await loginHost(event.username, event.password);
    }else{
      userInfo = await loginPlayer(event.username, event.password);
    }

      if (userInfo && userInfo.length > 0){
        return{
          statusCode: 200,
          body: userInfo[0]
        }
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `Invalid username or password for ${event.role}`})
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