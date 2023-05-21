$(document).ready(function() {
  // Määritetään formi, input sekä listä objekteiksi.
  const todoForm = $('.todo-form');
  const todoInput = $('.todo-input');
  const todoItemsList = $('.todo-items');
  // Luodaan array, joka varastoi tehtävät.
  let todos = [];

  // Lisätään formille listeneri, joka odottaa, että submit suoritetaan, kutsutaan addTodo funktiota, jonka arvona toimii input ja estetään sivua uudelleenlatautumasta.
  todoForm.on('submit', function(event) {
    event.preventDefault();
    addTodo(todoInput.val());
  });

  // Luodaan addTodo funktio.
  function addTodo(item) {
    // Luodaan virheilmoitus, joka aktivoituu jos syötetty arvo on alle kolme merkkiä ja samalla input laatikon tausta muuttuu punaiseksi.
    if (item.length < 3) {
      alert("Kirjoita ensin jotain! (Vähintään 3 merkkiä)");
      todoInput.css('background-color', 'red');
      return;
    } else if (item.trim() !== '') {
      // Luodaan todo objekti
      const todo = {
        id: Date.now(),
        name: item,
        completed: false
      };
      // Lisätään objekti listalle ja tallenetaan se samalla localstorageen.
      todos.push(todo);
      addToLocalStorage(todos);
      todoInput.val('');
      todoInput.css('background-color', 'white');
    }
  }

  // Luodaan funktio, joka renderöi listan näytölle.
  function renderTodos(todos) {
    // Clearataan lista
    todoItemsList.empty();
    todos.forEach(function(item) {
      const checked = item.completed ? 'checked' : null;
      // Luodaan jokaiselle todolle oma <li> elementti listaan.
      const li = $('<li>').attr({
        class: 'item',
        'data-key': item.id
      });
      // Lisätään todolle checked class, jos todo on suoritettu.
      if (item.completed === true) {
        li.addClass('checked');
      }
      // Lisätään <li> elementille tarpeelliset asiat.
      li.html(`
        <input type="checkbox" class="checkbox" ${checked}>
        ${item.name}
        <button class="delete-button">X</button>
      `);
      // Liitetään <li> elementti listaan.
      todoItemsList.append(li);
    });
  }

  // Luodaan funktio, joka lisää todot localstorageen.
  function addToLocalStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos(todos);
  }

  // Luodaan funktio, jolla todo saadaan localstoragesta.
  function getFromLocalStorage() {
    const reference = localStorage.getItem('todos');
    if (reference) {
      todos = JSON.parse(reference);
      renderTodos(todos);
    }
  }

  // Luodaan funktio, jolla todo voidaan kuitata tehdyksi.
  function toggle(id) {
    todos.forEach(function(item) {
      if (item.id == id) {
        item.completed = !item.completed;
      }
    });
    addToLocalStorage(todos);
  }

  // Luodaan funktio, jolla todo voidaan poistaa.
  function deleteTodo(id) {
    todos = todos.filter(function(item) {
      return item.id != id;
    });
    addToLocalStorage(todos);
  }

  // Haetaan todot localstoragesta ja renderöidään ne.
  getFromLocalStorage();

  // Lisätään kuittausboksille sekä poistonappulalle listenerit.
  todoItemsList.on('click', function(event) {
    if (event.target.type === 'checkbox') {
      toggle($(event.target).parent().attr('data-key'));
    }

    if ($(event.target).hasClass('delete-button')) {
      deleteTodo($(event.target).parent().attr('data-key'));
    }
  });
});