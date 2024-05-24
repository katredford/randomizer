package main

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
	"github.com/gofiber/fiber/v3"
	
	"github.com/gofiber/template/html/v2"

)

// const (
//     host     = "localhost"
//     port     = 5432
//     user     = "postgres"
//     password = ""
//     dbname   = "employees"
// )

// //RenderForm renders html form
func RenderForm(c fiber.Ctx) error {
	return c.Render("form", fiber.Map{})
}

// //ProcessForm process the form submission


func CheckError(err error) {
    if err != nil {
        panic(err)
    }
}

func ProcessForm(c fiber.Ctx) error {
	name := c.FormValue("name")
	greeting := fmt.Sprintf("Hello, %s!", name)
	return c.Render("greeting", fiber.Map{"Greeting": greeting})
}

func main() {

	// psqlconn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)
       psqlconn := "postgresql://@localhost:5432/employees?sslmode=disable"  
        // open database
    db, err := sql.Open("postgres", psqlconn)
    CheckError(err)
     
        // close database
    defer db.Close()
 
        // check db
    err = db.Ping()
    CheckError(err)
 
    fmt.Println("Connected!")

 


	app := fiber.New(fiber.Config {
		Views: html.New("./views", ".html"),
	//   // Initialize standard Go html template engine
	//   engine := html.New("./views", ".html")
	//   // If you want other engine, just replace with following
	//   // Create a new engine with django
	//   // engine := django.New("./views", ".django")
  
	//   app := fiber.New(fiber.Config{
	// 	  Views: engine,
	})

	// Serve static files (HTML templates and stylesheets).
	app.Static("/", "./static")

	// Define routes
	app.Get("/", RenderForm)

	
	app.Post("/submit", ProcessForm)


	app.Get("/data", func(c fiber.Ctx) error {
		return indexHandler(c, db)
	})

	// Start the Fiber app on port 8080.
	app.Listen(":8080")
}

func indexHandler(c fiber.Ctx, db *sql.DB) error {
    var id int
    var name string
    var depts []fiber.Map

    rows, err := db.Query("SELECT id, name FROM department")
    if err != nil {
        fmt.Println(err)
        return c.JSON("An error occurred")
    }
    defer rows.Close()
    
    for rows.Next() {
        if err := rows.Scan(&id, &name); err != nil {
            fmt.Println(err)
            return c.JSON("An error occurred")
        }
        depts = append(depts, fiber.Map{"id": id, "name": name})
    }



	    for _, dept := range depts {
        fmt.Println(dept)
    }

    // Return departments as JSON
    return c.Render("form", fiber.Map{
        "Depts": depts,
    })
}
