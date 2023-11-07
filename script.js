// 할 일 목록을 저장할 객체
const todos = {
  personal: [],
  work: [],
  other: [],
};

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("todo-form")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // 폼 제출 기본 동작 방지
      addTodo();
    });

  // 드래그 이벤트를 바인딩합니다.
  bindDragEvents();
});

function addTodo() {
  const todoInput = document.getElementById("todo-input");
  const todoText = todoInput.value.trim();
  const todoTime = document.getElementById("todo-time").value;
  const category = document.getElementById("category-select").value;
  const todoId = Date.now().toString(); // 고유 ID 생성

  if (!todoText) {
    alert("할 일을 입력해주세요.");
    return;
  }

  if (!todoTime) {
    alert("시간을 설정해주세요.");
    return;
  }

  // 새 할 일 객체 생성
  const newTodo = { id: todoId, text: todoText, time: todoTime };
  todos[category].push(newTodo);

  // 할 일을 목록에 추가
  renderTodoItem(category, newTodo);

  // 입력 필드 초기화
  todoInput.value = "";
  document.getElementById("todo-time").value = "";

  bindDragEvents(); // 새로운 항목에 대한 드래그 이벤트를 바인딩합니다.
}

function renderTodoItem(category, todo) {
  const todoList = document.getElementById(`${category}-todos`);
  const listItem = document.createElement("li");
  listItem.className = "todo-item"; // 리스트 아이템에 클래스 추가
  listItem.setAttribute("data-id", todo.id);
  listItem.setAttribute("draggable", true);

  const textSpan = document.createElement("span");
  textSpan.className = "todo-text";
  textSpan.textContent = todo.text;

  // 남은 시간 계산 및 표시
  const timeSpan = document.createElement("span");
  timeSpan.className = "todo-time";
  const remainingTimeText = getRemainingTimeText(todo.time);
  timeSpan.textContent = remainingTimeText;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "삭제";
  deleteBtn.className = "delete-btn"; // 스타일링을 위한 클래스 추가
  deleteBtn.onclick = function () {
    // 배열에서 해당 할 일 삭제
    deleteTodoItem(category, todo.id);
    // DOM에서 할 일 항목 삭제
    listItem.remove();
  };

  listItem.appendChild(textSpan);
  listItem.appendChild(timeSpan);
  listItem.appendChild(deleteBtn);

  todoList.appendChild(listItem);
}

function getRemainingTimeText(todoTime) {
  const deadline = new Date(todoTime);
  const now = new Date();
  const remainingTime = deadline - now;

  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

  if (remainingTime < 0) {
    return "시간 초과됨";
  } else if (days > 0) {
    return `${days}일 남음`;
  } else if (hours > 0) {
    return `${hours}시간 ${minutes}분 남음`;
  } else {
    return `${minutes}분 남음`;
  }
}

function deleteTodoItem(category, todoId) {
  const index = todos[category].findIndex((todo) => todo.id === todoId);
  if (index !== -1) {
    todos[category].splice(index, 1);
  }
}

function bindDragEvents() {
  const listItems = document.querySelectorAll(".todo-list li");
  listItems.forEach((item) => {
    item.addEventListener("dragstart", dragStart);
    item.addEventListener("dragend", dragEnd);
  });

  const lists = document.querySelectorAll(".todo-list");
  lists.forEach((list) => {
    list.addEventListener("dragover", dragOver);
    list.addEventListener("drop", drop);
  });
}

function dragStart(event) {
  event.dataTransfer.setData(
    "text/plain",
    event.target.getAttribute("data-id")
  );
  event.target.classList.add("dragging");
}

function dragEnd(event) {
  event.target.classList.remove("dragging");
}

function dragOver(event) {
  event.preventDefault();
  event.target.classList.add("over");
}

function drop(event) {
  event.preventDefault();
  const idToMove = event.dataTransfer.getData("text/plain");
  const itemToMove = document.querySelector(`[data-id="${idToMove}"]`);
  event.target.classList.remove("over");

  let targetList = event.target;

  while (!targetList.classList.contains("todo-list")) {
    if (targetList === document.documentElement) {
      return;
    }
    targetList = targetList.parentNode;
  }

  if (targetList) {
    targetList.appendChild(itemToMove);
    updateTodoCategory(idToMove, targetList.id);
  }
}

function updateTodoCategory(todoId, newCategoryListId) {
  // newCategoryListId에서 카테고리 이름을 가져옵니다 (예: "personal-todos"에서 "personal")
  const newCategory = newCategoryListId.split("-")[0];

  // 기존의 모든 카테고리를 반복하며 할 일을 업데이트합니다.
  for (const category in todos) {
    const index = todos[category].findIndex((todo) => todo.id === todoId);
    if (index !== -1) {
      const [todoToUpdate] = todos[category].splice(index, 1); // 기존 위치에서 할 일을 제거합니다.
      todos[newCategory].push(todoToUpdate); // 새 카테고리에 할 일을 추가합니다.
      break; // 일단 찾으면 반복을 멈춥니다.
    }
  }
}
