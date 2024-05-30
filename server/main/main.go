package main

import (
    "fmt"
	"github.com/gofiber/fiber/v3"
	_ "github.com/lib/pq"

	"connection"
	"wheelRoutes"
)

func CheckError(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {

	//connect to database
	db, err := connection.RandomizerDb()
	CheckError(err)
	//close database
	defer db.Close()

	app := fiber.New(fiber.Config{})

	// Define routes
	app.Get("/api/data", func(c fiber.Ctx) error {
		return api.GetWheel(c, db)
	})

    app.Post("/api/data", func(c fiber.Ctx) error {
       
        type Wheel struct {
            // ID    int    `json:"id"`
            Title string `json:"title"`
        }

         req := new(Wheel)
        if err := c.Bind().Body(req); err != nil {
            return err
        }
        fmt.Println(req)
       
        return c.JSON(req)
      })

	// Start the Fiber app on port 8080.
	app.Listen(":8080")
}
