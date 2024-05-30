package api

import (
	"database/sql"
	"fmt"

	"github.com/gofiber/fiber/v3"
	_ "github.com/lib/pq"
)

//defines Wheel type
type Wheel struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
}

//http request
// c is context from the fiber framework
// db is of type *sql.DB a pointer to an SQL database connection
func GetWheel( c fiber.Ctx,db *sql.DB) error {

    // variable set to the database query to get id and title from the wheel tabe
    rows, err := db.Query("SELECT id, title FROM wheel")
	
    // if an error occurs  it is printed as a json response
	if err != nil {
		fmt.Println(err)
		return c.JSON("An error occurred")
	}
    //rows are closed to release any resources held by query result
	defer rows.Close()

    //this is an empty slice
	var wheels []Wheel

    //iterate over rows, the result of the query
    //.Next() method advances the *sql.Rows to the next row in the result set
	for rows.Next() {
        //for each new row a new wheel struct instance is created
		var wheel Wheel

        //reports erros that occur during scanning
		if err := rows.Scan(&wheel.ID, &wheel.Title); err != nil {
			fmt.Println(err)
			return c.JSON("An error occurred")
		}
        //the wheel instance is added to the wheel slice
		wheels = append(wheels, wheel)
	}

    //this loops over the wheels slice and prints out the results
	for _, wheel := range wheels {
		fmt.Println(wheel)
	}

    //returns wheels slice as JSON
	return c.JSON(wheels)
}

// func AddWheel(c fiber.Ctx, db *sql.DB) error {
//     rows, err := db.Query("INSERT INTO wheel (title) VALUES ($1)")
// }