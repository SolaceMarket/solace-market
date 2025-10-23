import { useState } from "react";

export function TursoDemoPage() {
  const [todos, setTodos] = useState([]);

  const fetchData = async () => {
    //   const result = await CreateTodoTable();
    const response = await fetch("/demo/turso/api", {
      method: "GET",
    });
    const result = await response.json();
    console.log("Turso API Response:", result);
    setTodos(result);
  };

  return (
    <div>
      <h1>Turso Demo Page</h1>

      {todos.length > 0 ? (
        <div>
          <h2>Todos:</h2>
          <ul>
            {todos.map((todo: any, index) => (
              <li key={todo.name}>{todo.description}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No todos found.</p>
      )}

      <button type="button" onClick={fetchData}>
        Call Turso API
      </button>
    </div>
  );
}
