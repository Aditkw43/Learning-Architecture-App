package services

import (
	"taskmaster/internal/models"
	"taskmaster/internal/repositories"
)

func GetTodos() []models.Todo {
	todos, err := repositories.GetAllTodos()
	if err != nil {
		return []models.Todo{}
	}
	if len(todos) == 0 {
		return []models.Todo{}
	}
	return todos
}

func CreateTodo(title string) models.Todo {
	todoExists := GetTodos()
	maxSequence := 0
	todoExistsMap := make(map[string]bool)
	for _, todo := range todoExists {
		if todo.Title == title {
			return models.Todo{} // Return empty if the todo already exists
		}
		todoExistsMap[todo.Title] = true
		if todo.Sequence > maxSequence {
			maxSequence = todo.Sequence
		}
	}

	todos, err := repositories.AddTodo(models.Todo{Title: title, Done: false, Sequence: maxSequence + 1})
	if err != nil {
		return models.Todo{}
	}
	return todos
}

func EditTodo(id int, updatedTodo models.Todo) (models.Todo, bool) {
	todos, err := repositories.UpdateTodo(id, updatedTodo)
	if err != nil {
		return models.Todo{}, false
	}
	return todos, true
}

func RemoveTodo(id int, isDeleteAll bool) bool {
	err := repositories.DeleteTodo(id, isDeleteAll)
	return err == nil
}
