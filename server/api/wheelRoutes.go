package api

import ( 
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
	"github.com/gofiber/fiber/v3"
)

type Wheel struct {
    ID   int    `json:"id"`
    Title string `json:"title"`
    
}

func indexHandler(c fiber.Ctx, db *sql.DB) error {
    // var id int
    // var name string
    // var depts []fiber.Map

    rows, err := db.Query("SELECT id, title FROM wheel")
    if err != nil {
        fmt.Println(err)
        return c.JSON("An error occurred")
    }
    defer rows.Close()
    
    var wheels []Wheel
    for rows.Next() {
        var wheel Wheel

        if err := rows.Scan(&wheel.ID, &wheel.Title); err != nil {
            fmt.Println(err)
            return c.JSON("An error occurred")
        }
        wheels  = append(wheels , wheel)
    }



	    for _, wheel := range wheels  {
        fmt.Println(wheel)
    }

    // Return departments as JSON
    // return c.Render("form", fiber.Map{
    //     "Depts": depts,
    // })
    return c.JSON(wheels )
}