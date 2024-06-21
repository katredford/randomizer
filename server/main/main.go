package main

import (
	// "fmt"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/logger"
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

	  // Middleware
	  app.Use(logger.New())

	  // Serve static files from the "dist" directory
	  app.Static("/", "./client/dist")
  
	  // Catch-all route to serve the index.html file
	  app.Get("/", func(c fiber.Ctx) error {
		  return c.SendFile("./client/dist/index.html")
	  })

	// Define routes
	app.Get("/api/data", func(c fiber.Ctx) error {
		return api.AllWheels(c, db)
	})

	app.Get("/api/data/:id", func(c fiber.Ctx) error {
		return api.GetWheel(c, db)
	})

	app.Post("/api/data/update/:id", func(c fiber.Ctx) error {
		return api.UpdateWheelValue(c, db)
	})
	
	app.Put("/api/data/updateVal/:wheelId/:valId", func(c fiber.Ctx) error {
		return api.UpdateWheelValue(c, db)
	})

	app.Delete("/api/data/updateVal/:wheelId/:valId", func(c fiber.Ctx) error {
		return api.DeleteWheelValue(c, db)
	})

	app.Post("/api/data", func(c fiber.Ctx) error {
		return api.AddWheel(c, db)
	})

	app.Post("/api/wheelVal/:id", func(c fiber.Ctx) error {
		return api.AddValues(c, db)
	})

	app.Post("/api/wheelColor/:id", func(c fiber.Ctx) error {
		return api.AddColors(c, db)
	})

	// Start the Fiber app on port 8080.
	app.Listen(":8080")
}
