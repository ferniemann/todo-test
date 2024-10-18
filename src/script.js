"use strict";

const apiUrl = "http://localhost:3010/todos/";

const formWrapper = document.querySelectorAll("form");
const filters = document.querySelector("#filters-wrapper");
const todosOutput = document.querySelector("#todos-list");

formWrapper.forEach((wrapper) => {
  wrapper.addEventListener("submit", function (event) {
    event.preventDefault();
  });
});

let state = {
  todos: [],
  filter: "all",
};

class Todo {
  done = false;
  id = Math.floor(Math.random() * Date.now());

  constructor(todoDescription) {
    this.description = todoDescription;
  }

  showTodos() {
    console.log(this);
  }
}

function init() {
  const btnAdd = document.querySelector("#btn-add-todo");

  getTodos();
  btnAdd.addEventListener("click", addTodo);
  filters.addEventListener("change", setFilter);
  todosOutput.addEventListener("change", updateTodo);
}

async function getTodos() {
  try {
    const response = await fetch(apiUrl);
    state.todos = await response.json();
    localStorage.setItem("state", JSON.stringify(state));
  } catch (errorMsg) {
    console.error(errorMsg);
    state = JSON.parse(localStorage.getItem("state"));
  }

  filterTodos();
}

function renderTodos(todos = state.todos) {
  todosOutput.innerText = "";

  todos.forEach(createTodoElement);
}

function createTodoElement(todo) {
  const listEl = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "todo-" + todo.id;
  checkbox.checked = todo.done;
  checkbox.todoElement = todo;

  const description = document.createElement("label");
  description.htmlFor = checkbox.id;
  description.innerText = todo.description;

  listEl.append(checkbox, description);
  todosOutput.append(listEl);
}

async function addTodo() {
  console.log(this);
  const newTodoDescription = document.querySelector("#new-todo");
  const description = newTodoDescription.value;

  if (isNotValidTodo(description)) return;

  const newTodo = await postTodo(description);

  state.todos.push(newTodo);

  state.filter = "all";

  newTodoDescription.value = "";
  newTodoDescription.focus();

  localStorage.setItem("state", JSON.stringify(state));
  filterTodos();
}

function isNotValidTodo(description) {
  const todoExists = state.todos.some(
    (todo) => todo.description.toLowerCase() === description.toLowerCase()
  );

  return todoExists || description.length === 0;
}

async function postTodo(description) {
  const newTodo = new Todo(description);
  newTodo.showTodos();

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  });

  return await response.json();
}

function updateTodo(event) {
  const todo = event.target.todoElement;

  todo.done = !todo.done;

  localStorage.setItem("state", JSON.stringify(state));
}

function setFilter(event) {
  state.filter = event.target.id;
  localStorage.setItem("state", JSON.stringify(state));

  filterTodos();
}

function filterTodos() {
  const checkedRadio = filters.querySelector(`#${state.filter}`);
  checkedRadio.checked = true;

  let filteredTodos;
  if (state.filter === "done") {
    filteredTodos = state.todos.filter((todo) => todo.done);
  } else if (state.filter === "open") {
    filteredTodos = state.todos.filter((todo) => todo.done === false);
  } else if (state.filter === "all") {
    filteredTodos = state.todos;
  }

  renderTodos(filteredTodos);
}

init();
