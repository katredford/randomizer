package connection

import (
	"database/sql"
	"fmt"
	// "os"
	// "github.com/joho/godotenv"
	// "golang.org/x/example/hello/reverse"
)

// type Config struct {
//     Host     string
//     Port     string
//     Username string
//     Password string
//     Database string
// }

// type EnvDBConfig struct {
// 	host string
// 	port string
// 	// Username string
// 	// Password string
// 	database string
// }



// func NewEnvDBConfig() *EnvDBConfig {
//     return &EnvDBConfig{
//         // host:     os.Getenv("DB_HOST"),
//         port:     os.Getenv("DB_PORT"),
//         // username: os.Getenv("DB_USERNAME"),
//         // password: os.Getenv("DB_PASSWORD"),
//         database: os.Getenv("DB_NAME"),
//     }
// }

// func (c *EnvDBConfig) GetPort() string {
//     return c.port
// }

// func (c *EnvDBConfig) GetDatabase() string {
//     return c.database
// }

func CheckError(err error) {
    if err != nil {
        panic(err)
    }
}

func Hello() (*sql.DB, error) {
		// psqlconn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)
		psqlconn := "postgresql://@localhost:5432/randomizer_db?sslmode=disable"  
        // open database
    db, err := sql.Open("postgres", psqlconn)
    CheckError(err)
     
        // close database
    // defer db.Close()

 
        // check db
    err = db.Ping()
    CheckError(err)
 
    fmt.Println("Connected!")
	return db, nil

}