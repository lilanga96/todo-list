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

