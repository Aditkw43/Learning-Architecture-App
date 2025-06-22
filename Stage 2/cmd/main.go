package main

import (
	"log"
	"net/http"
	"taskmaster/internal/db"
	"taskmaster/internal/handlers"
	"taskmaster/internal/middleware"
)

func main() {
	db.InitDB()

	mux := http.NewServeMux()
	mux.HandleFunc("/todos", handlers.GetTodos)
	mux.HandleFunc("/todos/create", handlers.CreateTodo)
	mux.HandleFunc("/todos/update", handlers.UpdateTodo)
	mux.HandleFunc("/todos/delete", handlers.DeleteTodo)

	log.Println("Starting server on :8080")
	http.ListenAndServe(":8080", middleware.CORS(mux))
}
