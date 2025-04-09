document.getElementById('add-list-button').addEventListener('click', function() {
    let listTitle = prompt('Enter the title of the new list:');
    if (listTitle) {
        addList(listTitle, true); // Pass a flag to indicate it's a new list creation
    }
    saveListsToLocalStorage();
});

document.getElementById('clear-all-lists-button').addEventListener('click', function() {
    if (confirm('Clear ALL lists?')) {
        clearAllLists();
    }
});

function clearAllLists() {
    let listsContainer = document.getElementById('lists-container');
    listsContainer.innerHTML = ''; // Clear all lists
    localStorage.removeItem('todoLists'); // Remove from local storage
}

function addList(title, isNew = false, tasks = []) {
    let listsContainer = document.getElementById('lists-container');

    let newList = document.createElement('div');
    newList.className = 'list';

    let listHeader = document.createElement('div');
    listHeader.className = 'list-header';
    listHeader.style.cursor = 'move'; // Show move cursor on header
    newList.appendChild(listHeader);

    let listTitle = document.createElement('input');
    listTitle.className = 'list-title';
    listTitle.value = title;
    listTitle.addEventListener('click', function() {
        listTitle.removeAttribute('readonly');
        listTitle.focus();
    });
    listTitle.addEventListener('blur', function() {
        listTitle.setAttribute('readonly', true);
        saveListsToLocalStorage();
    });
    listHeader.appendChild(listTitle);

    let addTaskButton = document.createElement('button');
    addTaskButton.className = 'add-task-button';
    addTaskButton.textContent = 'Add Task';
    addTaskButton.addEventListener('click', function() {
        addTask(newList);
        saveListsToLocalStorage();
    });
    listHeader.appendChild(addTaskButton);

    let deleteListButton = document.createElement('button');
    deleteListButton.textContent = 'X';
    deleteListButton.className = 'delete-list-button';
    deleteListButton.addEventListener('click', function() {
        let listName = listTitle.value;
        if (confirm(`You are about to delete "${listName}". Are you sure?`)) {
            newList.remove();
            saveListsToLocalStorage();
        }
    });
    listHeader.appendChild(deleteListButton);

    let progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    let progressBarInner = document.createElement('div');
    progressBarInner.className = 'progress-bar-inner';
    progressBar.appendChild(progressBarInner);
    let progressBarText = document.createElement('div');
    progressBarText.className = 'progress-bar-text';
    progressBarText.textContent = ''; // Start with no text
    progressBar.appendChild(progressBarText);
    newList.appendChild(progressBar);

    let tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks-container';
    newList.appendChild(tasksContainer);

    // Add default task with "New Task" placeholder text
    if (isNew) {
        addTask(newList, '');
    }

    tasks.forEach(task => {
        addTask(newList, task.text, task.completed);
    });

    listsContainer.appendChild(newList);
    updateProgress(newList);
}

function addTask(list, text = '', completed = false) {
    let tasksContainer = list.querySelector('.tasks-container');
    let taskRow = document.createElement('div');
    taskRow.className = 'task';

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('change', function() {
        updateProgress(list);
        saveListsToLocalStorage();
    });
    taskRow.appendChild(checkbox);

    let taskNumber = document.createElement('span');
    taskNumber.className = 'task-number';
    taskNumber.textContent = tasksContainer.children.length + 1;
    taskRow.appendChild(taskNumber);

    let taskTextarea = document.createElement('textarea'); // Change from input to textarea
    taskTextarea.value = text;
    taskTextarea.placeholder = 'New Task';
    taskTextarea.addEventListener('blur', function() {
        saveListsToLocalStorage();
    });

    // Automatically adjust the height of the textarea
    taskTextarea.addEventListener('input', function() {
        taskTextarea.style.height = 'auto';
        taskTextarea.style.height = (taskTextarea.scrollHeight) + 'px';
    });

    // Initial adjustment for existing content
    taskTextarea.dispatchEvent(new Event('input'));

    taskRow.appendChild(taskTextarea);

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', function() {
        taskRow.remove();
        updateProgress(list);
        saveListsToLocalStorage();
        updateTaskNumbers(list);
    });
    taskRow.appendChild(deleteButton);

    tasksContainer.appendChild(taskRow);
    updateProgress(list);
}

function updateTaskNumbers(list) {
    let tasks = list.querySelectorAll('.task-number');
    tasks.forEach((task, index) => {
        task.textContent = index + 1;
    });
}

function updateProgress(list) {
    let tasks = list.querySelectorAll('.task');
    let completedTasks = list.querySelectorAll('.task input[type="checkbox"]:checked').length;

    let progressBarInner = list.querySelector('.progress-bar-inner');
    let progressBarText = list.querySelector('.progress-bar-text');

    if (tasks.length === 0) {
        progressBarInner.style.width = '0%';
        progressBarText.textContent = ''; // No text if there are no tasks
    } else {
        let progressPercentage = (completedTasks / tasks.length) * 100;
        progressBarInner.style.width = `${progressPercentage}%`;
        progressBarText.textContent = `${Math.round(progressPercentage)}%`;
    }
}

function saveListsToLocalStorage() {
    let lists = [];
    document.querySelectorAll('.list').forEach(list => {
        let title = list.querySelector('.list-title').value;
        let tasks = [];
        list.querySelectorAll('.task').forEach(task => {
            let text = task.querySelector('textarea').value; // Update selector
            let completed = task.querySelector('input[type="checkbox"]').checked;
            tasks.push({ text, completed });
        });
        lists.push({ title, tasks });
    });
    localStorage.setItem('todoLists', JSON.stringify(lists));
}

function loadListsFromLocalStorage() {
    let savedLists = JSON.parse(localStorage.getItem('todoLists') || '[]');
    savedLists.forEach(list => addList(list.title, false, list.tasks));

    // Adjust the height of textareas after loading
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
    });
}

window.addEventListener('load', () => {
    loadListsFromLocalStorage();

    // Make the lists draggable from the list header
    Sortable.create(document.getElementById('lists-container'), {
        handle: '.list-header', // Only allow dragging from the list header
        animation: 150,
        ghostClass: 'sortable-ghost',
        onChoose: function(evt) {
            evt.item.style.opacity = '1'; // Make the dragged item solid
        },
        onEnd: function() {
            saveListsToLocalStorage();
        }
    });
});
