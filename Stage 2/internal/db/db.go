package db

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3" // Import SQLite driver
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite3", "taskmaster.db")
	if err != nil {
		log.Fatal(err)
	}

	_, err = DB.Exec(`
		CREATE TABLE IF NOT EXISTS todos (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			done BOOLEAN NOT NULL DEFAULT 0,
			sequence INTEGER DEFAULT 0
		);`)
	if err != nil {
		log.Fatal(err)
	}
}
