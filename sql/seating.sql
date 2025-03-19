CREATE TABLE hosts (
	host_id INT PRIMARY KEY AUTO_INCREMENT,
    username varchar(50),
    password varchar(50)
);

CREATE TABLE players (
	player_id INT PRIMARY KEY AUTO_INCREMENT,
    username varchar(50),
    password varchar(50),
    signed_up TINYINT DEFAULT 0
);

CREATE TABLE games (
	game_id INT PRIMARY KEY AUTO_INCREMENT,
    host_id INT,
	game_name VARCHAR(150),
    host_key VARCHAR(50) DEFAULT "",
    total_seats INT,
    start_time_date DATETIME,
    FOREIGN KEY (host_id) REFERENCES hosts(host_id)
);

CREATE TABLE seats (
	seat_id INT PRIMARY KEY AUTO_INCREMENT,
	seat_num INT, 
    game_id INT, 
    player_username VARCHAR(50) DEFAULT "",
    FOREIGN key (game_id) REFERENCES games(game_id)
);