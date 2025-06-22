package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"taskmaster/internal/models"
	"taskmaster/internal/services"
	"taskmaster/pkg/response"
)

func GetTodos(w http.ResponseWriter, r *http.Request) {
	todos := services.GetTodos()
	response.JSON(w, http.StatusOK, todos)
}

func CreateTodo(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title string `json:"title"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.JSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid input"})
	}

	todo := services.CreateTodo(input.Title)
	response.JSON(w, http.StatusCreated, todo)
}

func UpdateTodo(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil || id <= 0 {
		response.JSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid ID}"})
		return
	}

	var updatedTodo models.Todo
	if err := json.NewDecoder(r.Body).Decode(&updatedTodo); err != nil {
		response.JSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid input"})
		return
	}

	todo, ok := services.EditTodo(id, updatedTodo)
	if !ok {
		response.JSON(w, http.StatusNotFound, map[string]string{"error": "Todo not found"})
		return
	}
	response.JSON(w, http.StatusOK, todo)
}

func DeleteTodo(w http.ResponseWriter, r *http.Request) {
	// Check if the request is to delete all todos
	isDeleteAll := r.URL.Query().Get("delete_all") == "true"
	if isDeleteAll {
		if !services.RemoveTodo(0, true) { // Pass 0 for ID to delete all todos
			response.JSON(w, http.StatusInternalServerError, map[string]string{"error": "Failed to delete all todos"})
			return
		}
		response.JSON(w, http.StatusOK, map[string]string{"message": "All todos deleted successfully"})
		return
	}

	if !isDeleteAll {
		id, err := strconv.Atoi(r.URL.Query().Get("id"))
		if err != nil || id <= 0 {
			response.JSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid ID"})
			return
		}

		if !services.RemoveTodo(id, false) {
			response.JSON(w, http.StatusNotFound, map[string]string{"error": "Todo not found"})
			return
		}
	}

	response.JSON(w, http.StatusOK, map[string]string{"message": "Todo deleted successfully"})
}
