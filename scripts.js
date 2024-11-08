const daysContainer = document.querySelector('.days');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const month = document.querySelector('.month');
const todayBtn = document.querySelector('.today-btn');
const modal = document.getElementById("todo-modal");
const modalDate = document.getElementById("modal-date");
const todoList = document.getElementById("todo-list");
const newTodoInput = document.getElementById("new-todo");
const addTodoBtn = document.getElementById("add-todo-btn");
const closeBtn = document.querySelector(".close-btn");


const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
const today = `${date.getDate()}-${currentMonth + 1}-${currentYear}`;
const todos = {};
const consultations = {}; 

function renderCalendar() {
    date.setDate(1);
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevLastDay = new Date(currentYear, currentMonth, 0).getDate();
    const nextDays = 7 - new Date(currentYear, currentMonth + 1, 0).getDay() - 1;

    month.innerHTML = `${months[currentMonth]} ${currentYear}`;

    let days = '';

    for (let x = firstDay; x > 0; x--) {
        days += `<div class='day prev'>${prevLastDay - x + 1}</div>`;
    }

    for (let i = 1; i <= lastDay; i++) {
        const fullDate = `${i}-${currentMonth + 1}-${currentYear}`;
        days += `<div class='day${fullDate === today ? ' today' : ''}' data-date='${fullDate}'>${i}</div>`;
    }

    for (let j = 1; j <= nextDays; j++) {
        days += `<div class='day next'>${j}</div>`;
    }

    daysContainer.innerHTML = days;

    document.querySelectorAll('.day').forEach(day => {
        day.addEventListener('click', openModal);
    });
}

renderCalendar();

nextBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

prevBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

function openModal(event) {
    const selectedDate = event.currentTarget.getAttribute('data-date');
    modalDate.innerText = selectedDate;
    displayTodos(selectedDate);
    displayConsultations(selectedDate); 
    modal.classList.add('show');
}

function displayTodos(date) {
    todoList.innerHTML = '';
    const items = todos[date] || [];
    
    const noTasksMessage = document.getElementById("no-tasks-message");
    if (items.length === 0) {
        noTasksMessage.style.display = 'flex';
    } else {
        noTasksMessage.style.display = 'none'; 
        items.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" ${item.completed ? 'checked' : ''} onchange="toggleTodoStatus('${date}', ${index})">
                <span style="text-decoration: ${item.completed ? 'line-through' : 'none'};">${item.text}</span>
                <button onclick="deleteTodo('${date}', ${index})">Delete</button>
            `;
            todoList.appendChild(li);
        });
    }
}

function displayConsultations(date) {
    const consultationTable = document.getElementById("consultation-table").getElementsByTagName('tbody')[0];
    const consultationTableContainer = document.getElementById("consultation-table-container");
    const noConsultationsMessage = document.getElementById("no-consultations-message");

    
    consultationTable.innerHTML = '';

    const consultationsForDate = consultations[date] || [];

    if (consultationsForDate.length === 0) {
        noConsultationsMessage.style.display = 'flex';
        consultationTableContainer.style.display = 'none';
    } else {
        noConsultationsMessage.style.display = 'none';
        consultationTableContainer.style.display = 'block';

        consultationsForDate.forEach(entry => {
            const newRow = consultationTable.insertRow();
            newRow.insertCell(0).innerText = entry.name;
            newRow.insertCell(1).innerText = entry.surname;
            newRow.insertCell(2).innerText = entry.number;
            newRow.insertCell(3).innerText = entry.address;
            
        });
    }
}

todayBtn.addEventListener('click', () => {
    openModal({ currentTarget: { getAttribute: () => today } });
});

function toggleTodoStatus(date, index) {
    todos[date][index].completed = !todos[date][index].completed;
    displayTodos(date);
}

function deleteTodo(date, index) {
    todos[date].splice(index, 1);
    displayTodos(date);
}

closeBtn.onclick = () => modal.classList.remove('show');

addTodoBtn.addEventListener('click', () => {
    const date = modalDate.innerText; 
    const newTodo = newTodoInput.value.trim(); 
    
   
    if (newTodo) {
        if (!todos[date]) todos[date] = [];
        todos[date].push({ text: newTodo, completed: false }); 
        
        displayTodos(date); 
        newTodoInput.value = ''; 
    } else {
        alert("Please enter a to-do item!");
    }
});


const addConsultationBtn = document.getElementById("add-consultation-btn");
const addEntryBtn = document.getElementById("add-entry-btn");

addConsultationBtn.addEventListener('click', () => {
    document.getElementById("consultation-table-container").style.display = 'block';
});

addEntryBtn.addEventListener('click', () => {
    const date = modalDate.innerText;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" placeholder="Name"></td>
        <td><input type="text" placeholder="Surname"></td>
        <td><input type="text" placeholder="Number"></td>
        <td><input type="text" placeholder="Address"></td>
       
    `;

    const consultationTable = document.getElementById("consultation-table").getElementsByTagName('tbody')[0];
    consultationTable.appendChild(newRow);

    
    newRow.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', () => saveConsultationEntry(date, newRow));
    });
});


function saveConsultationEntry(date, row) {
    const [nameInput, surnameInput, numberInput, addressInput] = row.querySelectorAll('input');
    
    const name = nameInput.value.trim();
    const surname = surnameInput.value.trim();
    const number = numberInput.value.trim();
    const address = addressInput.value.trim();
   

    
    if (name && surname && number && address) {
        if (!consultations[date]) consultations[date] = [];
        consultations[date].push({ name, surname, number, address, });

        
        row.innerHTML = `
            <td>${name}</td>
            <td>${surname}</td>
            <td>${number}</td>
            <td>${address}</td>
            
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const taskViewSelector = document.getElementById('task-view');
    const daysContainer = document.querySelector('.days');
  
    // Mock task data for demonstration, including time
    const tasks = [
      { date: '2024-11-08', time: '09:00', task: 'Meeting with client' },
      { date: '2024-11-08', time: '11:00', task: 'Submit report' },
      { date: '2024-11-08', time: '13:00', task: 'Project presentation' },
      { date: '2024-11-09', time: '10:00', task: 'Team stand-up' },
    ];
  
    taskViewSelector.addEventListener('change', (event) => {
      const selectedView = event.target.value;
      renderTasks(selectedView);
    });
  
    function renderTasks(view) {
      daysContainer.innerHTML = ''; // Clear previous content
  
      if (view === 'list') {
        render5HourView();
      } else if (view === 'week') {
        renderHourlyWeekView();
      } else if (view === 'month') {
        renderMonthView();
      }
    }
  
    function render5HourView() {
      const currentDate = new Date();
      const currentHour = currentDate.getHours();
  
      for (let offset = 0; offset < 5; offset++) {
        const hour = currentHour + offset;
        if (hour >= 24) break; // Stop if it goes beyond the day
  
        const hourSlot = document.createElement('div');
        hourSlot.className = 'hour-slot';
  
        const hourLabel = document.createElement('div');
        hourLabel.className = 'hour-label';
        hourLabel.textContent = `${hour.toString().padStart(2, '0')}:00`;
  
        hourSlot.appendChild(hourLabel);
  
        // Append tasks for this specific hour
        tasks.forEach(task => {
          const taskDate = new Date(task.date);
          const isToday = taskDate.toDateString() === currentDate.toDateString();
          
          if (isToday && task.time.startsWith(hour.toString().padStart(2, '0'))) {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            taskElement.textContent = task.task;
            hourSlot.appendChild(taskElement);
          }
        });
  
        daysContainer.appendChild(hourSlot);
      }
    }
  
    function renderHourlyWeekView() {
      const weekGrid = document.createElement('div');
      weekGrid.className = 'week-view-grid';
  
      for (let day = 0; day < 7; day++) {
        const dayColumn = document.createElement('div');
        dayColumn.className = 'week-day-column';
  
        for (let hour = 0; hour < 24; hour++) {
          const hourSlot = document.createElement('div');
          hourSlot.className = 'hour-slot';
  
          const hourLabel = document.createElement('div');
          hourLabel.className = 'hour-label';
          hourLabel.textContent = `${hour.toString().padStart(2, '0')}:00`;
  
          hourSlot.appendChild(hourLabel);
  
          // Append tasks for this specific day and hour
          tasks.forEach(task => {
            const taskDate = new Date(task.date);
            const today = new Date();
            today.setDate(today.getDate() + day);
  
            if (taskDate.toDateString() === today.toDateString() && task.time.startsWith(hour.toString().padStart(2, '0'))) {
              const taskElement = document.createElement('div');
              taskElement.className = 'task-item';
              taskElement.textContent = task.task;
              hourSlot.appendChild(taskElement);
            }
          });
  
          dayColumn.appendChild(hourSlot);
        }
        weekGrid.appendChild(dayColumn);
      }
  
      daysContainer.appendChild(weekGrid);
    }
  
    function renderMonthView() {
      for (let i = 1; i <= 31; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = i;
        daysContainer.appendChild(dayElement);
      }
    }
  
    // Initial load (default to list view)
    renderTasks('list');
  });
  