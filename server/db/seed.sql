-- Connect to the database
\c randomizer_db

INSERT INTO wheel
    (title)
VALUES
    ('rant wheel'),
    ('rave wheel'),
    ('wheel of time'),
    ('wagon wheel');

INSERT INTO wheel_values
    (value, wheel_id)
VALUES
    ('airplane food', 1),
    ('cars', 1),
    ('dogs', 2),
    ('beetles', 2),
    ('too many books', 3),
    ('should only be 12', 3),
    ('rock me', 4),
    ('mama', 4);

INSERT INTO wheel_colors
    (color, wheel_id)
VALUES
    ('red', 1),
    ('blue', 1),
    ('yellow', 2),
    ('black', 2),
    ('black', 3),
    ('black', 4);
   
