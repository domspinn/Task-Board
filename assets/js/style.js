// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;


// Generate Task Id Function
function generateTaskId() {
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return nextId;
}


// Create Task Card Function
function createTaskCard(task) {
  const taskCard = $('<div>').addClass('card task-card draggable my-3').attr('data-task-id', task.id);
  const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.description);
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardDeleteBtn = $('<button>').addClass('btn btn-danger delete').text('Delete').attr('data-task-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);
  return taskCard;
}


// Render Task List Function
function renderTaskList() {
    $('#todo-cards, #in-progress-cards, #done-cards').empty();
    if (taskList) {
      taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        $('#' + task.status + '-cards').append(taskCard);
      });
    }
    $('.draggable').draggable({
      revert: 'invalid',
      cursor: 'grab',
      stack: '.draggable',
      containment: '.swim-lanes'
    });
}


// Handle Add Task function
function handleAddTask(event){
    event.preventDefault();
    const title = $('#title').val();
    const description = $('#description').val();
    const dueDate = $('#due-date').val();
    const status = 'todo';
    const taskId = generateTaskId();
    const newTask = { id: taskId, title, description, dueDate, status };
    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
    $('#formModal').modal('hide');
    $('#addTaskForm').trigger('reset');
}


// Handle Delete Task Function
function handleDeleteTask(event){
    const taskId = $(this).attr('data-task-id');
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}

// Handle Drop Function
function handleDrop(event, ui) {
    const taskId = ui.draggable.data('task-id');
    const newStatus = event.target.id;
    taskList.forEach(task => {
      if (task.id === taskId) {
        task.status = newStatus;
      }
    });
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}


// Date Picker