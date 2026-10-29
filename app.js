const express = require("express");
const app = express();
const cors = require('cors');
app.use(express.json()); // Parse JSON bodies
app.use(cors('*'));
let todos = [
  { id: 1, task: "Learn Node.js", completed: false },
  { id: 2, task: "Build CRUD API", completed: true },
];

//Custom Middleware
function checkPostBody(req, res, next) {
  const { task, completed } = req.body;

  if (!task || !completed)
    return res.status(400).json({ error: "Invalid body" });

  next();
}

// GET All – Read
app.get("/todos", (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

app.get("/todos/completed", (req, res) => {
  const completed = todos.filter((t) => t.completed === true);
  res.json(completed); // Custom Read!
});

//GET Uncompleted todos
app.get("/todos/active", (req, res) => {
  const active = todos.filter((t) => t.completed === false);
  res.json(active);
});

//GET Single
app.get("/todos/:id", (req, res) => {
  const id = Number(req.params.id);

  const todo = todos.filter((t) => t.id === id);

  if (todo.length === 0) return res.status(404).json({ error: "Not found" });
  return res.status(200).json(todo);
});


// POST New – Create
app.post("/todos", checkPostBody, (req, res) => {
  const newTodo = { id: todos.length + 1, ...req.body }; // Auto-ID
  todos.push(newTodo);
  res.status(201).json(newTodo); // Echo back
});

// PATCH Update – Partial
app.patch("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
});

// DELETE Remove
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: "Not found" });
  res.status(204).send(); // Silent success
});



app.use((err, req, res, next) => {
  res.status(500).json({ error: "Server error!", err });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
