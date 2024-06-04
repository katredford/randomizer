package api

import (
	"database/sql"
	"fmt"
	"github.com/gofiber/fiber/v3"
	// "github.com/lib/pq"
	_ "github.com/lib/pq"
	// "log"
	"strings"
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
	ID       int    `json:"id"`
	Value    string `json:"value"`
	WheelID int    `json:"wheel_id"`
}

type WheelColor struct {
	ID       int    `json:"id"`
	Color    string `json:"value"`
	Wheel_Id int    `json:"wheel_id"`
}


// http request
// c is context from the fiber framework
// db is of type *sql.DB a pointer to an SQL database connection
func GetWheel(c fiber.Ctx, db *sql.DB) error {

	// get wheel id from the URL path
	paramWheelID := c.Params("id")

	//query selects columns from the wheel and wheel_values tables,
	// joining them on w.id = v.wheel_id.
	query := `
    SELECT
      w.id AS wheel_id,
      w.title AS wheel_title,
      w.created_at AS wheel_created_at,
      w.updated_at AS wheel_updated_at,
      v.id AS value_id,
      v.value AS value,
      v.wheel_id AS value_wheel_id
    FROM
      wheel w
    JOIN
      wheel_values v ON w.id = v.wheel_id
    WHERE
      w.id = $1;
    `

	//a variable set to the results of the db query that runs 
	//the query and takes in paramwheelid to use in the placeholder in the query
	rows, err := db.Query(query, paramWheelID)

	// if an error occurs  it is printed as a json response
	if err != nil {
		fmt.Println(err)
		return c.JSON("An error occurred")
	}
	//rows are closed to release any resources held by query result
	defer rows.Close()

	//this is an empty "wheel" struct with an epmty wheelValue slice
	var wheel Wheel
    var wheelValues []WheelValue

	//iterate over rows, the result of the query
	//.Next() method advances the *sql.Rows to the next row in the result set
	for rows.Next() {
		
		var wheelID int
        var title, createdAt, updatedAt string
        var valueID int
        var value string
        var valueWheelID int
		//reports erros that occur during scanning
		if err := rows.Scan(&wheelID, &title, &createdAt, &updatedAt, &valueID, &value, &valueWheelID); err != nil {
			fmt.Println(err)
			return c.JSON("An error occurred")
		}
		//Sets the Wheel struct fields with the scanned data
		wheel.ID = wheelID
        wheel.Title = title
        wheel.CreatedAt = createdAt
        wheel.UpdatedAt = updatedAt

		//Creates a WheelValue struct with the scanned value data and appends it to wheelValues
        wheelValue := WheelValue{
            ID:      valueID,
            Value:   value,
            WheelID: valueWheelID,
        }
        wheelValues = append(wheelValues, wheelValue)
	}
	//assigns the collected wheelValues slice to the Values field of the wheel struct
	wheel.Values = wheelValues
	//this loops over the wheels slice and prints out the results
	for _, wheel := range wheel.Values {
		fmt.Println(wheel)
	}

	//returns wheels struct as JSON
	return c.JSON(&wheel)
}

func AddWheel(c fiber.Ctx, db *sql.DB) error {
	req := new(Wheel)

	if err := c.Bind().Body(req); err != nil {
		return err
	}
	fmt.Println(req)

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

