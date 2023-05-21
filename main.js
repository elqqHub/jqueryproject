$(document).ready(function() {
    const todoForm = $('.todo-form');
    const todoInput = $('.todo-input');
    const todoItemsList = $('.todo-items');
    let todos = [];
  
    todoForm.on('submit', function(event) {
      event.preventDefault();
      addTodo(todoInput.val());
    });
  
    function addTodo(item) {
      if (item.length < 3) {
        alert("Kirjoita ensin jotain! (Vähintään 3 merkkiä)");
        todoInput.css('background-color', 'red');
        return;
      } else if (item.trim() !== '') {
        const todo = {
          id: Date.now(),
          name: item,
          completed: false
        };
        todos.push(todo);
        addToLocalStorage(todos);
        todoInput.val('');
        todoInput.css('background-color', 'white');
      }
    }
  
    function renderTodos(todos) {
      todoItemsList.empty();
      todos.forEach(function(item) {
        const checked = item.completed ? 'checked' : null;
        const li = $('<li>').attr({
          class: 'item',
          'data-key': item.id
        });
        if (item.completed === true) {
          li.addClass('checked');
        }
        li.html(`
          <input type="checkbox" class="checkbox" ${checked}>
          ${item.name}
          <button class="delete-button">X</button>
        `);
        todoItemsList.append(li);
      });
    }
  
    function addToLocalStorage(todos) {
      localStorage.setItem('todos', JSON.stringify(todos));
      renderTodos(todos);
    }
  
    function getFromLocalStorage() {
      const reference = localStorage.getItem('todos');
      if (reference) {
        todos = JSON.parse(reference);
        renderTodos(todos);
      }
    }
  
    function toggle(id) {
      todos.forEach(function(item) {
        if (item.id == id) {
          item.completed = !item.completed;
        }
      });
      addToLocalStorage(todos);
    }
  
    function deleteTodo(id) {
      todos = todos.filter(function(item) {
        return item.id != id;
      });
      addToLocalStorage(todos);
    }
  
    getFromLocalStorage();
  
    todoItemsList.on('click', function(event) {
      if (event.target.type === 'checkbox') {
        toggle($(event.target).parent().attr('data-key'));
      }
  
      if ($(event.target).hasClass('delete-button')) {
        deleteTodo($(event.target).parent().attr('data-key'));
      }
    });
  });