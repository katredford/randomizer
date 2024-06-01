package main

import (
    // "fmt"
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
       return api.AddWheel(c, db)
      })

      app.Post("/api/wheelVal/:id", func(c fiber.Ctx) error {
        return api.AddValues(c, db)
       })

	// Start the Fiber app on port 8080.
	app.Listen(":8080")
}
