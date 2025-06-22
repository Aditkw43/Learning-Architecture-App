package models

type Todo struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	Done     bool   `json:"done"`
	Sequence int    `json:"sequence,omitempty"` // Optional field for ordering
}
