-- Drop the database if it exists
DROP DATABASE IF EXISTS randomizer_db;

-- Create the new database
CREATE DATABASE randomizer_db;

-- Connect to the database
\c randomizer_db


CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the users table
-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY,
--   user_name VARCHAR(30) UNIQUE NOT NULL,
--   email VARCHAR(30) UNIQUE NOT NULL,
--   password VARCHAR(30) 
-- );

-- Create the wheel table
CREATE TABLE wheel (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(30) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
  -- user_id INTEGER NOT NULL,
  -- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the employee table
CREATE TABLE wheel_values (
  id SERIAL PRIMARY KEY,
  value VARCHAR(30) NOT NULL,
  wheel_id INTEGER NOT NULL,
  FOREIGN KEY (wheel_id) REFERENCES wheel(id) ON DELETE CASCADE
);

-- CREATE TABLE wheel_colors (
--   id SERIAL PRIMARY KEY,
--   color VARCHAR(30) NOT NULL,
--   wheel_id INTEGER NOT NULL,
--   FOREIGN KEY (wheel_id) REFERENCES wheel(id) ON DELETE CASCADE
-- );

