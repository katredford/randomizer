package connection

import (
	"database/sql"
	"fmt"
	"github.com/joho/godotenv"
	"log"
	"os"
)

func CheckError(err error) {
	if err != nil {
		panic(err)
	}
}

// use godotenv package to get environment variables from .env file
func getEnvVar(key string) string {
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal(err)
	}
	return os.Getenv(key)
}

// exported functions must be capitalized
func RandomizerDb() (*sql.DB, error) {

	//Connection string
	// %s is go interpolation
	psqlconn := fmt.Sprintf("postgresql://@localhost:%s/%s?sslmode=disable", getEnvVar("DB_PORT"), getEnvVar("DB_NAME"))

	// open database
	db, err := sql.Open("postgres", psqlconn)
	CheckError(err)

	// check db
	err = db.Ping()
	CheckError(err)

	fmt.Println("Connected!")
	return db, nil

}
