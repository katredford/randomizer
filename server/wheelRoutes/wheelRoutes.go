package api

import (
	"database/sql"
	"fmt"
	"github.com/gofiber/fiber/v3"
	// "github.com/gofiber/fiber/v2"
	// "github.com/lib/pq"
	_ "github.com/lib/pq"
	"log"
	"strings"
	"strconv"
)

// defines Wheel type
type Wheel struct {
	ID        int    `json:"id"`
	Title     string `json:"title"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
	Values    []WheelValue
}

	type WheelValue struct {
		ID      int    `json:"id"`
		Value   string `json:"value"`
		WheelID int    `json:"wheel_id"`
	}


type WheelColor struct {
	ID       int    `json:"id"`
	Color    string `json:"value"`
	Wheel_Id int    `json:"wheel_id"`
}




func AllWheels(c fiber.Ctx, db *sql.DB) error {
	query := `SELECT id, title, created_at, updated_at FROM wheel`

		// Execute the query
		rows, err := db.Query(query)
		if err != nil {
			fmt.Println(err)
			return c.JSON(fiber.Map{"error": "An error occurred"})
		}
		defer rows.Close()

		// Slice to hold all wheels
		var wheels []Wheel

		// Iterate over the query results
		for rows.Next() {
			var wheel Wheel

			// Scan the row into the Wheel struct
			if err := rows.Scan(&wheel.ID, &wheel.Title, &wheel.CreatedAt, &wheel.UpdatedAt); err != nil {
				fmt.Println(err)
				return c.JSON(fiber.Map{"error": "An error occurred"})
			}

			// Append the wheel to the wheels slice
			wheels = append(wheels, wheel)
		}

		// Check for errors after the loop
		if err = rows.Err(); err != nil {
			fmt.Println(err)
			return c.JSON(fiber.Map{"error": "An error occurred"})
		}

		// Return the wheels as JSON
		return c.JSON(wheels)
}
// http request
// c is context from the fiber framework
// db is of type *sql.DB a pointer to an SQL database connection
//Had to rewrite this query to be able to get one wheel even when the values array is empty
func GetWheel(c fiber.Ctx, db *sql.DB) error {
    // Get wheel id from the URL path
    paramWheelID := c.Params("id")
    fmt.Println("paramWheelID:", paramWheelID)

    // Query to get the wheel details
    wheelQuery := `
        SELECT id, title, created_at, updated_at
        FROM wheel
        WHERE id = $1;
    `

    // Execute the wheel query
    var wheel Wheel
    err := db.QueryRow(wheelQuery, paramWheelID).Scan(&wheel.ID, &wheel.Title, &wheel.CreatedAt, &wheel.UpdatedAt)
    if err != nil {
        if err == sql.ErrNoRows {
            // No wheel found with the given ID
            return c.JSON(fiber.Map{
                "error": "Wheel not found",
            })
        }
        fmt.Println("Query Error:", err)
        return c.JSON("An error occurred")
    }

    // Query to get the wheel values
    valuesQuery := `
        SELECT id, value, wheel_id
        FROM wheel_values
        WHERE wheel_id = $1;
    `

    // Execute the values query
    rows, err := db.Query(valuesQuery, paramWheelID)
    if err != nil {
        fmt.Println("Query Error:", err)
        return c.JSON("An error occurred")
    }
    defer rows.Close()

    // Initialize an empty wheelValue slice
    var wheelValues []WheelValue

    // Iterate over rows
    for rows.Next() {
        var valueID int
        var value string
        var valueWheelID int

        if err := rows.Scan(&valueID, &value, &valueWheelID); err != nil {
            fmt.Println("Scan Error:", err)
            return c.JSON("An error occurred")
        }

        // Append WheelValue to the slice
        wheelValue := WheelValue{
            ID:      valueID,
            Value:   value,
            WheelID: valueWheelID,
        }
        wheelValues = append(wheelValues, wheelValue)
    }

    // Assign the collected wheelValues slice to the Values field of the wheel struct
    wheel.Values = wheelValues

    // Debug print statements
    fmt.Println("Wheel Struct:", wheel)
    // for _, wheelValue := range wheel.Values {
    //     fmt.Println("Wheel Value:", wheelValue)
    // }

    // Return wheel struct as JSON
    return c.JSON(&wheel)
}


func AddWheel(c fiber.Ctx, db *sql.DB) error {
	req := new(Wheel)

	if err := c.Bind().Body(req); err != nil {
		return err
	}

	createWheel, err := db.Query("INSERT INTO wheel (title) VALUES ($1)", req.Title)
	if err != nil {
		return c.JSON("An error occurred")
	}

	fmt.Println(createWheel)

	return c.JSON("wheel added successfuly ")
}

func AddValues(c fiber.Ctx, db *sql.DB) error {

	req := new(WheelValue)
	if err := c.Bind().Body(req); err != nil {
		return err
	}

	// fmt.Println(req.Value)

	wheel_id := c.Params("id")
	values := strings.Split(req.Value, ",")

	// fmt.Println("BEEP BOOP", wheel_id)
	for i := 0; i < len(values); i++ {
		valTrim := strings.TrimSpace(values[i])
		createWheelValues, err := db.Query(
			`
            INSERT INTO wheel_values (value, wheel_id) VALUES ($1, $2)
        `, valTrim, wheel_id)

		if err != nil {
			return c.JSON("An error occurred")
		}
		defer createWheelValues.Close()

	}
	// addToCompleteWheel( c, db, wheel_id)
	return c.JSON("values added successfuly ")
}

func AddColors(c fiber.Ctx, db *sql.DB) error {

	req := new(WheelColor)
	if err := c.Bind().Body(req); err != nil {
		return err
	}

	fmt.Println(req.Color)
	color := strings.Split(req.Color, ",")
	wheel_id := c.Params("id")

	for i := 0; i < len(color); i++ {
		colorTrim := strings.TrimSpace(color[i])

		createWheelColors, err := db.Query("INSERT INTO wheel_colors (color, wheel_id) VALUES ($1, $2)", colorTrim, wheel_id)
		fmt.Println(color[i], wheel_id)
		if err != nil {
			return c.JSON("An error occurred")
		}
		defer createWheelColors.Close()
	}

	return c.JSON("colors added successfuly ")
}


// http request
// c is context from the fiber framework
// db is of type *sql.DB a pointer to an SQL database connection
func UpdateWheel(c fiber.Ctx, db *sql.DB) error {

	// get wheel id from the URL path
	paramWheelID := c.Params("id")

	req := new(Wheel)

	if err := c.Bind().Body(req); err != nil {
		return err
	}

	// Update the wheel record in the database
	updateQuery := `
UPDATE wheel
SET title = $1, updated_at = NOW()
WHERE id = $2
RETURNING id, title, created_at, updated_at;
`

	err := db.QueryRow(updateQuery, req.Title, paramWheelID).Scan(
		&req.ID, &req.Title, &req.CreatedAt, &req.UpdatedAt,
	)
	if err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusInternalServerError).JSON("An error occurred while updating the wheel")
	}

	// Return the updated wheel as JSON
	return c.JSON(&req)
}

// func UpdateWheelValue(c fiber.Ctx, db *sql.DB) error {

// 	body := c.Body()
// 	bodyString := string(body)
// 	splitBody := strings.Split(bodyString, "\"")
// 	fmt.Println("this thing working?", splitBody[3])

// 	wheel_id := c.Params("wheelId")

// 	rows, err := db.Query("SELECT id, wheel_id, value FROM wheel_values WHERE wheel_id = $1", wheel_id)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer rows.Close()

// 	paramValId := c.Params("valId")
	
// 	number, err := strconv.ParseUint(paramValId, 10, 32)
// 	value_id := int(number)
	
// 	// Loop over the query results
// 	for rows.Next() {
// 		var wv WheelValue

// 		err := rows.Scan(&wv.ID, &wv.WheelID, &wv.Value)
// 		if err != nil {
// 			log.Fatal(err)
// 		}

// 		// Print each result to the console
// 		fmt.Printf("ID: %d, WheelID: %d, Value: %s\n", wv.ID, wv.WheelID, wv.Value)

// 		if value_id == wv.ID {
// 			newValue := splitBody[3]
// 			_, err := db.Exec("UPDATE wheel_values SET value = $1 WHERE id = $2", newValue, wv.ID)
// 			if err != nil {
// 				log.Fatal(err)
// 			}

// 		}
// 	}

// 	// Check for errors after loop
// 	if err = rows.Err(); err != nil {
// 		log.Fatal(err)
// 	}

// 	return c.JSON("values updated successfuly ")
// }

func UpdateWheelValue(c fiber.Ctx, db *sql.DB) error {
	body := c.Body()
	bodyString := string(body)
	splitBody := strings.Split(bodyString, "\"")

	if len(splitBody) < 4 {
		log.Println("Invalid input data:", bodyString)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid input data",
		})
	}

	fmt.Println("splitBody:", splitBody)

	wheel_id := c.Params("wheelId")

	rows, err := db.Query("SELECT id, wheel_id, value FROM wheel_values WHERE wheel_id = $1", wheel_id)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	paramValId := c.Params("valId")

	number, err := strconv.ParseUint(paramValId, 10, 32)
	if err != nil {
		log.Fatal(err)
	}
	value_id := int(number)

	// Loop over the query results
	for rows.Next() {
		var wv WheelValue

		err := rows.Scan(&wv.ID, &wv.WheelID, &wv.Value)
		if err != nil {
			log.Fatal(err)
		}

		// Print each result to the console
		fmt.Printf("ID: %d, WheelID: %d, Value: %s\n", wv.ID, wv.WheelID, wv.Value)

		if value_id == wv.ID {
			newValue := splitBody[3]
			_, err := db.Exec("UPDATE wheel_values SET value = $1 WHERE id = $2", newValue, wv.ID)
			if err != nil {
				log.Fatal(err)
			}

		}
	}

	// Check for errors after loop
	if err = rows.Err(); err != nil {
		log.Fatal(err)
	}

	return c.JSON("values updated successfully")
}


func DeleteWheelValue(c fiber.Ctx, db *sql.DB) error {
	wheel_id := c.Params("wheelId")
	paramValId := c.Params("valId")

	fmt.Println("delete wheel paramWheelID:", wheel_id)

	number, err := strconv.ParseUint(paramValId, 10, 32)
	if err != nil {
		log.Fatal(err)
	}
	value_id := int(number)

	// Execute the delete query
	_, err = db.Exec("DELETE FROM wheel_values WHERE wheel_id = $1 AND id = $2", wheel_id, value_id)
	if err != nil {
		log.Fatal(err)
	}

	return c.JSON("value deleted successfully")
}



