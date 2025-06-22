package repositories

import (
	"taskmaster/internal/db"
	"taskmaster/internal/models"
)

func GetAllTodos() ([]models.Todo, error) {
	rows, err := db.DB.Query("SELECT id, title, done, sequence FROM todos ORDER BY sequence ASC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var todos []models.Todo
	for rows.Next() {
		var todo models.Todo
		if err := rows.Scan(&todo.ID, &todo.Title, &todo.Done, &todo.Sequence); err != nil {
			return nil, err
		}
		todos = append(todos, todo)
	}
	return todos, nil
}

func AddTodo(todo models.Todo) (models.Todo, error) {
	result, err := db.DB.Exec("INSERT INTO todos (title, done) VALUES (?, ?)", todo.Title, todo.Done)
	if err != nil {
		return todo, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return todo, err
	}
	todo.ID = int(id)
	return todo, nil
}

func UpdateTodo(id int, updatedTodo models.Todo) (models.Todo, error) {
	_, err := db.DB.Exec("UPDATE todos SET title = ?, done = ?, sequence = ? WHERE id = ?", updatedTodo.Title, updatedTodo.Done, updatedTodo.Sequence, id)
	updatedTodo.ID = id
	return updatedTodo, err
}

func DeleteTodo(id int, isDeleteAll bool) error {
	if isDeleteAll {
		_, err := db.DB.Exec("DELETE FROM todos")
		return err
	}
	if id <= 0 {
		return nil
	}
	_, err := db.DB.Exec("DELETE FROM todos WHERE id = ?", id)
	return err
}
