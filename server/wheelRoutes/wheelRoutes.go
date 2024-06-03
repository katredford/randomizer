package api

import (
	"database/sql"
	"fmt"
	"github.com/gofiber/fiber/v3"
	"github.com/lib/pq"
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
}

type WheelValue struct {
	ID       int    `json:"id"`
	Value    string `json:"value"`
	Wheel_Id int    `json:"wheel_id"`
}

type WheelColor struct {
	ID       int    `json:"id"`
	Color    string `json:"value"`
	Wheel_Id int    `json:"wheel_id"`
}

type CompleteWheel struct {
	WheelID   int      `json:"wheel_id"`
	Title     string   `json:"title"`
	CreatedAt string   `json:"created_at"`
	UpdatedAt string   `json:"updated_at"`
	ValueIDs  []int    `json:"value_ids"`
	Values    []string `json:"values"`
}

// http request
// c is context from the fiber framework
// db is of type *sql.DB a pointer to an SQL database connection
// func GetWheel(c fiber.Ctx, db *sql.DB) error {

// 	// variable set to the database query to get id and title from the wheel tabe
// 	rows, err := db.Query("SELECT id, title FROM wheel")

// 	// if an error occurs  it is printed as a json response
// 	if err != nil {
// 		fmt.Println(err)
// 		return c.JSON("An error occurred")
// 	}
// 	//rows are closed to release any resources held by query result
// 	defer rows.Close()

// 	//this is an empty slice
// 	var wheels []Wheel

// 	//iterate over rows, the result of the query
// 	//.Next() method advances the *sql.Rows to the next row in the result set
// 	for rows.Next() {
// 		//for each new row a new wheel struct instance is created
// 		var wheel Wheel

// 		//reports erros that occur during scanning
// 		if err := rows.Scan(&wheel.ID, &wheel.Title); err != nil {
// 			fmt.Println(err)
// 			return c.JSON("An error occurred")
// 		}
// 		//the wheel instance is added to the wheel slice
// 		wheels = append(wheels, wheel)
// 	}

// 	//this loops over the wheels slice and prints out the results
// 	for _, wheel := range wheels {
// 		fmt.Println(wheel)
// 	}

// 	//returns wheels slice as JSON
// 	return c.JSON(wheels)
// }

//? this
func GetWheel(c fiber.Ctx, db *sql.DB) error {
	wheelID := c.Params("id")

	query := `
    SELECT
        w.id AS wheel_id,
        w.title,
        w.created_at,
        w.updated_at,
        w.value_ids,
        ARRAY_AGG(wv.value) AS values
    FROM
        wheel w
    JOIN
        complete_wheel cw
    ON
        w.id = cw.wheel_id
    JOIN
        wheel_values wv
    ON
        cw.value_id = wv.id
    WHERE
        w.id = $1
    GROUP BY
        w.id;
    `

	row := db.QueryRow(query, wheelID)

	var completeWheel CompleteWheel
	var valueIDs []sql.NullInt32
	var values []sql.NullString

	err := row.Scan(&completeWheel.WheelID, &completeWheel.Title, &completeWheel.CreatedAt, &completeWheel.UpdatedAt, pq.Array(&valueIDs), pq.Array(&values))
	if err != nil {
		return nil
	}

	// Convert []sql.NullInt32 to []int
	for _, id := range valueIDs {
		if id.Valid {
			completeWheel.ValueIDs = append(completeWheel.ValueIDs, int(id.Int32))
		}
	}

	// Convert []sql.NullString to []string
	for _, value := range values {
		if value.Valid {
			completeWheel.Values = append(completeWheel.Values, value.String)
		}
	}

	return c.JSON(completeWheel)

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

//? this
func addToCompleteWheel(c fiber.Ctx, db *sql.DB, wheel_id string) error {

    fmt.Println(wheel_id)

    rows, err := db.Query(`
    SELECT id, value, wheel_id
    FROM wheel_values
    WHERE wheel_id = $1
    `, wheel_id)

    	// if an error occurs  it is printed as a json response
    	if err != nil {
    		fmt.Println(err)
    		return c.JSON("An error occurred")
    	}
    	//rows are closed to release any resources held by query result
    	defer rows.Close()

   	var ids []int

	//iterate over rows, the result of the query
	//.Next() method advances the *sql.Rows to the next row in the result set
	for rows.Next() {
		//for each new row a new wheel struct instance is created
        var id int
        var value string
        var wheelId string

		//reports erros that occur during scanning
		if err := rows.Scan(&id, &value, &wheelId); err != nil {
			fmt.Println(err)
			return c.JSON("An error occurred")
		}
		//the wheel instance is added to the wheel slice
        ids = append(ids, id)
	}

    if err := rows.Err(); err != nil {
        return fmt.Errorf("rows error: %v", err)
    }

//     for _, id := range ids {
//         fmt.Println("Inserting value", id)
//         _, err := db.Exec(`
//             INSERT INTO complete_wheel (wheel_id, value_id) VALUES (?, ?)
//         `, wheel_id, id)
//         if err != nil {
//             return fmt.Errorf("insertion error: %v", err)
//         }
//     }

//     return nil
// }

	for i := 0; i < len(ids); i++ {
		value := ids[i]
        fmt.Println("value in loop", value)
	    addToCompleteWheel, err := db.Query(
        `
            INSERT INTO complete_wheel (wheel_id, value_id) VALUES ($1, $2)
        `,  wheel_id, value)
		fmt.Println(ids[i], wheel_id)
		if err != nil {
			return c.JSON("An error occurred adding to complete wheel")
		}

	    defer addToCompleteWheel.Close()
	}

    // addToCompleteWheel, err := db.Query(
    //     `
    //         INSERT INTO complete_wheel (wheel_id, value_id) VALUES (1, 10);
    //     `)
    //     	if err != nil {
	// 		return c.JSON("An error occurred adding to complete wheel")
	// 	}

    return c.JSON(addToCompleteWheel)
}
