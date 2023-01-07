import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App(props) {
  const beginTodos = [];

  const [todos, setTodos] = useState(beginTodos);
  const [add, setAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [realArray, setRealArray] = useState([]);
  const [titleValue, setTitleValue] = useState("");
  const [descriptValue, setDescriptValue] = useState("");
  const [edit, setEdit] = useState(false);
  const [editedTask, setEditedTask] = useState({});
  const [editTitleValue, setEditTitleValue] = useState("");
  const [editDescriptValue, setEditDescriptValue] = useState("");

  async function addTask(e) {
    await axios
      .post("http://localhost:8000/api/todos/", {
        title: titleValue,
        description: descriptValue,
      })
      .then((res) => console.log(res));

    setDescriptValue("");
    setTitleValue("");
    setAdd(false);
  }

  //fetch the data from DB:

  async function fetchTodos() {
    try {
      await axios
        .get("http://localhost:8000/api/todos/")
        .then((res) => setTodos(res.data));
      const newArray = todos.map((todo) => {
        return {
          title: todo.title,
          description: todo.description,
          id: todo.id,
          completed: todo.completed,
          hide: true,
        };
      });

      setRealArray(newArray);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, [todos]);

  //

  const clicked = (todo) => () => {
    let newState = [...realArray];
    const index = newState.indexOf(todo);

    if (newState[index].hide === true) {
      newState[index].hide = false;
    } else {
      newState[index].hide = true;
    }
    setRealArray(newState);
    console.log(newState);
  };

  function taskChanged(e) {
    if (e.target.className === "title-input") {
      setTitleValue(e.target.value);
    } else {
      setDescriptValue(e.target.value);
    }
  }

  function toggleAdd(e) {
    setAdd(!add);
  }

  function toggleEdit(e) {
    setEdit(!edit);
    let task;
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].id == e.target.title) {
        task = todos[i];
      }
    }

    setEditedTask({
      title: task.title,
      description: task.description,
      id: e.target.title,
    });

    setEditTitleValue(task.title);
    setEditDescriptValue(task.description);
  }

  function taskEdited(e) {
    if (e.target.className === "title-input") {
      setEditTitleValue(e.target.value);
    } else {
      setEditDescriptValue(e.target.value);
    }
  }

  async function updateTask(e) {
    setEdit(!edit);

    await axios
      .put(`http://localhost:8000/api/todos/${editedTask.id}/`, {
        title: editTitleValue,
        description: editDescriptValue,
      })
      .then((res) => console.log(res.data));

    setEditedTask({});
  }

  function remove(e) {
    //const filterArray = [];

    axios
      .delete(`http://localhost:8000/api/todos/${e.target.title}/`)
      .then((res) => console.log(res));

    //setTodos(filterArray);
  }

  const mapped = realArray.map((todo) => {
    if (realArray.indexOf(todo) === 0) {
      return (
        <div>
          <hr />
          <div className="todo-item">
            <p className="title" onClick={clicked(todo)} title={todo.id}>
              {todo.title}
            </p>
            <div className="todo-buttons">
              <button id="grey" onClick={toggleEdit} title={todo.id}>
                Edit
              </button>
              <button id="red" onClick={remove} title={todo.id}>
                Delete
              </button>
            </div>
          </div>
          <div className="description-div">
            <p>{todo.description}</p>
          </div>
          <hr />
        </div>
      );
    } else {
      return (
        <div>
          <div className="todo-item">
            <p className="title" onClick={clicked(todo)} title={todo.id}>
              {todo.title}
            </p>
            <div className="todo-buttons">
              <button id="grey" onClick={toggleEdit} title={todo.id}>
                Edit
              </button>
              <button id="red" onClick={remove} title={todo.id}>
                Delete
              </button>
            </div>
          </div>

          <div className="description-div">
            <p>{todo.description}</p>
          </div>
          <hr />
        </div>
      );
    }
  });

  return (
    <div className="container">
      <h1 className="header">TODO APP</h1>
      <div className="form">
        <div className="add">
          <button onClick={toggleAdd}>
            {add ? "Remove Task" : "Add Task"}
          </button>
        </div>

        {add ? (
          <div className="add-div">
            <div>
              <label>What do you need to do?</label>
              <input
                type="text"
                placeholder="Mow Lawn"
                className="title-input"
                value={titleValue}
                onChange={taskChanged}
                required
              />
            </div>
            <div>
              <label>Any more specifics?</label>
              <textarea
                type="input"
                placeholder="I need to mow the lawn on Tuesday. Before then, I have to go to Home Depot and buy seed, soil, and new propellers for the mower."
                className="description-input"
                value={descriptValue}
                onChange={taskChanged}
                required
              />
            </div>

            <div className="add" id="add-btn">
              <button type="submit" onClick={addTask}>
                Add Task
              </button>
            </div>
            <hr />
          </div>
        ) : null}

        {edit ? (
          <div className="add-div">
            <div>
              <label>What do you need to do?</label>
              <input
                type="text"
                placeholder="Mow Lawn"
                className="title-input"
                value={editTitleValue}
                onChange={taskEdited}
              />
            </div>
            <div>
              <label>Any more specifics?</label>
              <textarea
                type="input"
                value={editDescriptValue}
                onChange={taskEdited}
                className="description-input"
              />
            </div>

            <div className="add" id="add-btn">
              <button type="submit" onClick={updateTask}>
                Update Task
              </button>
            </div>
            <hr />
          </div>
        ) : null}

        <div className="filter">
          <button className="filter-active">complete</button>
          <button className="filter-unactive">Incomplete</button>
        </div>

        {isLoading ? (
          <h1>Loading</h1>
        ) : (
          <>
            {" "}
            {realArray.length > 0 ? (
              <div className="tasks">{mapped}</div>
            ) : (
              <div className="message">
                <p>
                  Nothing to do! You're doing an amazing job, Rockstar, keep
                  killing it!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
