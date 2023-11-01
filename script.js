document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.getElementById("add-button");
  const inputField = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");

  // 할 일 추가 기능
  addButton.addEventListener("click", function () {
    addTodo();
  });

  // 할 일 입력 필드에서 엔터키 누를 때
  inputField.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTodo();
    }
  });

  // 할 일 목록 불러오기
  loadTodos();

  function addTodo() {
    const todoText = inputField.value.trim();
    if (todoText === "") {
      alert("할 일을 입력해주세요.");
      return;
    }
  
    console.log("Adding todo:", todoText); // 디버깅을 위한 로그
  
    const todoItem = document.createElement("li");
    todoItem.innerHTML = `
      <input type="checkbox" onchange="toggleDone(this)">
      <span>${todoText}</span>
      <button class="delete-button" onclick="removeTodo(this)">삭제</button>
    `;
    todoList.appendChild(todoItem); // 여기서 실제로 리스트에 추가
    inputField.value = "";
    inputField.focus();
    saveTodos();
  }
  window.toggleDone = function (checkbox) {
    const todoItem = checkbox.parentElement;
    if (checkbox.checked) {
      todoItem.classList.add("done");
    } else {
      todoItem.classList.remove("done");
    }
    saveTodos();
  };

  window.removeTodo = function (button) {
    if (confirm("정말로 삭제하시겠습니까?")) {
      const todoItem = button.parentElement;
      todoList.removeChild(todoItem);
      saveTodos();
    }
  };

  function saveTodos() {
    const todos = Array.from(todoList.children).map(function (item) {
      return {
        text: item.querySelector("span").textContent,
        done: item.querySelector("input").checked,
      };
    });
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  function loadTodos() {
    const savedTodos = JSON.parse(localStorage.getItem("todos"));
    if (savedTodos) {
      savedTodos.forEach(function (todo) {
        const todoItem = document.createElement("li");
        todoItem.innerHTML = `
          <input type="checkbox" ${
            todo.done ? "checked" : ""
          } onchange="toggleDone(this)">
          <span>${todo.text}</span>
          <button class="delete-button" onclick="removeTodo(this)">삭제</button>
        `;
        if (todo.done) {
          todoItem.classList.add("done");
        }
        todoList.appendChild(todoItem);
      });
    }
  }
});
