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

CREATE TABLE complete_wheel (
  wheel_id INTEGER,
  value_id INTEGER,
  PRIMARY KEY (wheel_id, value_id),
  FOREIGN KEY (wheel_id) REFERENCES wheel(id),
  FOREIGN KEY (value_id) REFERENCES wheel_values(id)
);

-- CREATE TABLE complete_wheel (
--   wheel_id INTEGER,
--   value_id INTEGER,
--   color_id INTEGER,
--   PRIMARY KEY (wheel_id, value_id, color_id),
--   FOREIGN KEY (wheel_id) REFERENCES wheel(id),
--   FOREIGN KEY (value_id) REFERENCES wheel_values(id),
--   FOREIGN KEY (color_id) REFERENCES wheel_colors(id)
-- );


-- SELECT
--     wheel.*,
--     wheel_values.*,
--     wheel_colors.*
-- FROM
--     wheel
-- LEFT JOIN
--     wheel_values ON wheel.id = wheel_values.wheel_id
-- LEFT JOIN
--     wheel_colors ON wheel.id = wheel_colors.wheel_id;



-- INSERT INTO complete_wheel (wheel_id, value_id, color_id) VALUES
-- (1, 1, 1), 
-- (1, 2, 2), 
-- (2, 2, 3), 
-- (2, 3, 4);

-- SELECT 
--     w.id AS wheel_id,
--     w.title,
--     w.created_at,
--     w.updated_at,
--     w.value_ids,
--     ARRAY_AGG(wv.value) AS values
-- FROM 
--     wheel w
-- JOIN 
--     complete_wheel cw 
-- ON 
--     w.id = cw.wheel_id
-- JOIN 
--     wheel_values wv 
-- ON 
--     cw.value_id = wv.id
-- GROUP BY 
--     w.id;


-- SELECT
--     wheel.*,
--     wheel_values.*,
--     wheel_colors.*
-- FROM
--     wheel
-- LEFT JOIN
--     wheel_values ON wheel.id = wheel_values.wheel_id
-- LEFT JOIN
--     wheel_colors ON wheel.id = wheel_colors.wheel_id;
