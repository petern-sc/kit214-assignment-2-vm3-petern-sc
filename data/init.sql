CREATE TABLE IF NOT EXISTS rooms (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  target_url VARCHAR(2048) NOT NULL,
  interface_type VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  room_id CHAR(36) NOT NULL,
  start_time DATETIME(3) NOT NULL,
  end_time DATETIME(3) NOT NULL,
  user_id CHAR(36) NOT NULL,
  INDEX bookings_room_time (room_id, start_time, end_time),
  INDEX bookings_user_id (user_id)
) ENGINE=InnoDB;
