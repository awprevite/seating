import mysql from 'mysql2'

export const handler = async (event) => {
  
  var pool = mysql.createPool({
    host: "",
    user: "",
    password: "",
    database: ""
  });

  let hostAccountExists = (username) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM hosts WHERE username = ?", [username], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows[0]);
      })
    })
  }

  let playerAccountExists = (username) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM players WHERE username = ?", [username], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows[0]);
      })
    })
  }

  let createHostAccount = (username, password) => {
    return new Promise((resolve, reject) => {
      pool.query("INSERT INTO hosts (username, password) VALUES (?, ?)", [username, password], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      })
    })
  }

  let createPlayerAccount = (username, password) => {
    return new Promise((resolve, reject) => {
      pool.query("INSERT INTO players (username, password) VALUES (?, ?)", [username, password], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
      })
    })
  }

  try {

    let userInfo;
    let exists;

    if(event.role === "host"){
      exists = await hostAccountExists(event.username);
      if(exists){
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `${event.role} name taken`})
        };
      }
      userInfo = await createHostAccount(event.username, event.password);
    }else{
      exists = await playerAccountExists(event.username);
      if(exists){
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `${event.role} name taken`})
        };
      }
      userInfo = await createPlayerAccount(event.username, event.password);
    }

      if (userInfo.insertId){
        return{
          statusCode: 200,
          body: userInfo.insertId
        }
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `unable to create account for ${event.role}`})
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