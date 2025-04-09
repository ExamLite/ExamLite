let questionCount = 0;
let questions = [];
let currentQuestionIndex = 0;
let isEditMode = false;

document.getElementById('add-question-btn').addEventListener('click', function() {
    addQuestion();
    displayQuestions();
});
document.getElementById('edit-btn').addEventListener('click', function() {
    toggleEditMode();
    const quizNameDisplay = document.getElementById('quiz-name-display');
    const quizNameInput = document.getElementById('quiz-name-input');
    const helpEditBtn = document.getElementById('help-edit-btn'); // Reference to the Help-container button

    if (isEditMode) {
        quizNameInput.value = quizNameDisplay.textContent;
        quizNameDisplay.style.display = 'none';
        quizNameInput.style.display = 'block';
        quizNameInput.focus();
    } else {
        quizNameDisplay.textContent = quizNameInput.value;
        quizNameDisplay.style.display = 'block';
        quizNameInput.style.display = 'none';
        saveToLocalStorage();
    }

    // Toggle the glow effect on the Help-container button
    helpEditBtn.classList.toggle('edit-mode', isEditMode);
});

// Add functionality to Help-container buttons
document.getElementById('help-edit-btn').addEventListener('click', function() {
    document.getElementById('edit-btn').click();
});

document.getElementById('help-add-question-btn').addEventListener('click', function() {
    document.getElementById('add-question-btn').click();
});

document.getElementById('help-clear-storage-btn').addEventListener('click', function() {
    document.getElementById('clear-storage-btn').click();
});

// Save quiz name to local storage as you type
document.getElementById('quiz-name-input').addEventListener('input', function() {
    saveToLocalStorage();
});

// Prevent default form submission to ensure data is saved
window.addEventListener('beforeunload', function(event) {
    const quizNameInput = document.getElementById('quiz-name-input');
    if (isEditMode && quizNameInput.style.display !== 'none') {
        const quizNameDisplay = document.getElementById('quiz-name-display');
        quizNameDisplay.textContent = quizNameInput.value;
        saveToLocalStorage();
    }
});

document.getElementById('create-quiz-btn').addEventListener('click', function() {
    const quizName = prompt("Enter a name for the new quiz:");

    if (quizName) {
        const newQuizHtml = generateNewQuizHtml(quizName);
        downloadQuizHtml(newQuizHtml, `${quizName}.html`);
    }
});

function addQuestion() {
    const newQuestion = {
        question: '',
        answers: ['', '', '', ''],
        correctAnswer: null
    };
    questions.push(newQuestion);
    questionCount++;
    currentQuestionIndex = questions.length - 1;
    saveToLocalStorage();
    displayQuestions();
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    document.getElementById('edit-btn').classList.toggle('edit-mode', isEditMode);
    updateEditMode();
}

function updateEditMode() {
    const questionContainers = document.querySelectorAll('.question-container');
    questionContainers.forEach((container, index) => {
        const questionTextarea = container.querySelector('.display-question');
        questionTextarea.readOnly = !isEditMode;
        questionTextarea.classList.toggle('edit-mode', isEditMode);
        resizeTextarea(questionTextarea);

        const deleteButton = container.querySelector('.delete-question-btn');
        deleteButton.style.display = isEditMode ? 'inline-block' : 'none'; // Show/hide delete button

        const newDeleteButton = deleteButton.cloneNode(true);
        deleteButton.parentNode.replaceChild(newDeleteButton, deleteButton);

        newDeleteButton.addEventListener('click', function() {
            deleteQuestion(index, container);
        });

        const answerContainers = container.querySelectorAll('.answer-container');
        answerContainers.forEach((container, answerIndex) => {
            const btn = container.querySelector('.answer-btn');
            btn.readOnly = !isEditMode;
            btn.classList.toggle('edit-mode', isEditMode);
            resizeTextarea(btn);

            if (isEditMode) {
                const radioButtonExists = container.querySelector(`.edit-radio[data-index="${answerIndex}"]`);
                if (!radioButtonExists) {
                    container.insertAdjacentHTML('afterbegin', `<input type="radio" class="edit-radio" id="radio-${index}-${answerIndex}" name="correct-answer-${index}" data-index="${answerIndex}" onclick="updateCorrectAnswer(${index}, ${answerIndex})"><label for="radio-${index}-${answerIndex}"></label>`);
                }
                btn.classList.remove('correct', 'incorrect');
            }
        });

        if (!isEditMode) {
            container.querySelectorAll('.edit-radio').forEach(radio => radio.remove());
            container.querySelectorAll('label[for^="radio-"]').forEach(label => label.remove());
        } else {
            displayCorrectAnswer(index);
        }

        questionTextarea.addEventListener('input', function() {
            updateQuestion(index);
        });

        container.querySelectorAll('.answer-btn').forEach((btn, answerIndex) => {
            btn.addEventListener('input', function() {
                updateAnswer(index, answerIndex);
            });

            btn.addEventListener('click', function() {
                if (!isEditMode) {
                    handleAnswerClick(index, answerIndex, btn);
                }
            });
        });
    });
}

function handleAnswerClick(questionIndex, answerIndex, clickedButton) {
    const container = document.querySelector(`.question-container[data-index="${questionIndex}"]`);
    const answerButtons = container.querySelectorAll('.answer-btn');
    
    answerButtons.forEach((btn) => {
        btn.classList.remove('correct', 'incorrect'); // Reset all buttons' styles
    });

    if (questions[questionIndex].correctAnswer === answerIndex) {
        clickedButton.classList.add('correct');
    } else {
        clickedButton.classList.add('incorrect');
    }
}

function deleteQuestion(index, container) {
    questions.splice(index, 1);
    saveToLocalStorage();
    container.remove();
    displayQuestions();
}

function updateQuestion(index) {
    const textarea = document.querySelector(`.question-container[data-index="${index}"] .display-question`);
    questions[index].question = textarea.value;
    saveToLocalStorage();
    resizeTextarea(textarea);
}

function updateAnswer(questionIndex, answerIndex) {
    const answerButton = document.querySelector(`.question-container[data-index="${questionIndex}"] .answer-btn[data-index="${answerIndex}"]`);
    questions[questionIndex].answers[answerIndex] = answerButton.value;
    saveToLocalStorage();
    resizeTextarea(answerButton);
}

function updateCorrectAnswer(questionIndex, answerIndex) {
    questions[questionIndex].correctAnswer = answerIndex;
    saveToLocalStorage();
    displayQuestions();
}

window.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    if (questions.length === 0) {
        addQuestion();
    } else {
        displayQuestions();
    }
    // Show the Help-container
    const helpContainer = document.getElementById('help-container');
    helpContainer.style.display = 'block';
    setTimeout(() => {
        helpContainer.classList.add('show');
    }, 0); // Delay adding the class to trigger the transition
});

// Close Help-container on click of the close button
document.getElementById('close-help-btn').addEventListener('click', function() {
    const helpContainer = document.getElementById('help-container');
    helpContainer.classList.remove('show');
    setTimeout(() => {
        helpContainer.style.display = 'none';
    }, 500); // Delay hiding the container to allow transition to finish
});

function displayQuestions() {
    const questionList = document.getElementById('question-list');
    questionList.innerHTML = '';
    questions.forEach((question, index) => {
        const container = document.createElement('div');
        container.classList.add('question-container');
        container.dataset.index = index;

        container.innerHTML = `
            <div id="question-header">
                <div class="display-question-number">Question ${index + 1} / ${questions.length}</div> <!-- Show Question X / Y -->
                <button class="delete-question-btn">Delete</button> <!-- Delete button -->
            </div>
            <textarea class="display-question" placeholder="Click the Edit button to get started... Click the 'Quiz Editor' link in the top left for help!'" readonly>${question.question}</textarea>
            <div class="answer-container">
                <div class="answer-label">A</div>
                <textarea class="answer-btn" data-index="0">${question.answers[0]}</textarea>
            </div>
            <div class="answer-container">
                <div class="answer-label">B</div>
                <textarea class="answer-btn" data-index="1">${question.answers[1]}</textarea>
            </div>
            <div class="answer-container">
                <div class="answer-label">C</div>
                <textarea class="answer-btn" data-index="2">${question.answers[2]}</textarea>
            </div>
            <div class="answer-container">
                <div class="answer-label">D</div>
                <textarea class="answer-btn" data-index="3">${question.answers[3]}</textarea>
            </div>
        `;

        questionList.appendChild(container);
    });

    updateEditMode();
}

function displayCorrectAnswer(questionIndex) {
    const question = questions[questionIndex];
    const radioButtons = document.querySelectorAll(`.question-container[data-index="${questionIndex}"] input[type="radio"]`);
    radioButtons.forEach(radio => {
        radio.checked = parseInt(radio.dataset.index) === question.correctAnswer;
    });
}

function resizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
}

function saveToLocalStorage() {
    const filename = getCurrentFilename();
    localStorage.setItem(`questions_${filename}`, JSON.stringify(questions));
    const quizName = document.getElementById('quiz-name-input').value;
    localStorage.setItem(`quizName_${filename}`, quizName); // Use the quiz name input value
}

function loadFromLocalStorage() {
    const filename = getCurrentFilename();
    const savedQuestions = localStorage.getItem(`questions_${filename}`);
    const savedQuizName = localStorage.getItem(`quizName_${filename}`);
    if (savedQuestions) {
        questions = JSON.parse(savedQuestions);
        questionCount = questions.length;
        currentQuestionIndex = 0;
        displayQuestions();
    }
    if (savedQuizName) {
        document.getElementById('quiz-name-display').textContent = savedQuizName;
        document.getElementById('quiz-name-input').value = savedQuizName; // Load the value to the input field
    }
}

document.getElementById('clear-storage-btn').addEventListener('click', function() {
    const confirmation = confirm("Are you sure you want to clear all storage? This action cannot be undone.");
    if (confirmation) {
        clearLocalStorage();
    }
});

function clearLocalStorage() {
    if (isEditMode) {
        // Exit edit mode before clearing storage
        toggleEditMode();
    }
    const filename = getCurrentFilename();
    const quizName = document.getElementById('quiz-name-display').textContent; // Retain the quiz name
    localStorage.removeItem(`questions_${filename}`);
    localStorage.removeItem(`quizName_${filename}`);
    
    // Update the quiz name display with the retained quiz name
    document.getElementById('quiz-name-display').textContent = quizName;
    document.getElementById('quiz-name-input').value = quizName;
    
    // Reload the page to reset the questions list
    location.reload();
}


function getCurrentFilename() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().split('.').shift();
    return filename;
}

document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    if (questions.length === 0) {
        addQuestion();
    } else {
        displayQuestions();
    }
});

function generateNewQuizHtml(quizName) {
    return `<!DOCTYPE html>
<html>
<head>
    <title>Quiz Creator</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>
<body>
<div id="navbar">
    <h1><a href="#" id="quiz-editor-link">Quiz Creator</a></h1>
    <div id="nav-buttons">
        <button id="edit-btn">Edit Mode</button>
        <button id="add-question-btn">Add Question</button>
    </div>
    <button id="clear-storage-btn">Clear Storage</button>
</div>
<div id="quiz-name-container">
    <div id="quiz-name-display">Your Quiz Name Here</div>
    <input type="text" id="quiz-name-input" style="display:none;" placeholder="Enter quiz name here">
</div>
<div id="question-list">
    <!-- Example radio buttons -->
    <div class="answer-container">
        <input type="radio" id="radio1" class="edit-radio" name="radio-group">
        <label for="radio1">Option 1</label>
    </div>
    <div class="answer-container">
        <input type="radio" id="radio2" class="edit-radio" name="radio-group">
        <label for="radio2">Option 2</label>
    </div>
</div>

<div id="help-container">
    <button id="close-help-btn" class="close-btn">&times;</button>
    <h2>Welcome to Quiz Creator!</h2>
    <p>Create a simple multiple choice quiz with ease. No subscriptions. No logins. No hassle.</p>
    <p>This would be an ideal study tool to use if you want to quiz yourself or slap it on the projector and quiz a class. Unfortunately, it only saves on your device. This isn't a good tool if you're looking to create a quiz and share it with others. This is something we're still working on. </p>
    <p><strong>Data Storage Notice:</strong> Please be aware that all quiz data is saved locally on your current device. This means that your quiz data is stored only on the computer or device you are using right now. If you move these files to another computer or device, the saved data will not transfer with them.</p>
    <hr>
    <ul>
        <li>
            <strong>Create New Quiz:</strong> Click this to create a new quiz. This creates a new HTML file. Once you have named the file, it will download to your 'Downloads' folder. Be sure to move that new file to the folder containing your original quiz, styles.css and script.cs files.<br>
            <p><strong>Note:</strong> Renaming the file will cause all saved data to be lost. Please ensure you name the file what you want <strong>before</strong> you start working on your quiz.</p>
            <button id="create-quiz-btn">Create New Quiz</button>
            <hr>
        </li>
        <li>
            <strong>Edit Mode:</strong> Toggle this to edit the quiz. When enabled, you can modify the quiz name, questions, and answers. To mark the correct answer, select the radio button next to the answers. <br>
            <button class="help-btn" id="help-edit-btn">Edit Mode</button>
            <hr>
        </li>
        <li>
            <strong>Add Question:</strong> Click this to add a new question to your quiz. Each question will include multiple answer options.<br>
            <button class="help-btn" id="help-add-question-btn">Add Question</button>
            <hr>
        </li>
        <li>
            <strong>Clear Storage:</strong> Use this button to clear the stored data for this quiz from your browser's local storage. This action cannot be undone.<br>
            <p><strong>Note:</strong> This will only clear the storage for this quiz. Your other quizzes will keep their data. </p>
            <button class="help-btn" id="help-clear-storage-btn">Clear Storage</button>
        </li>
    </ul>
</div>

<script src="script.js"></script>
</body>
</html>`;
}

// Show Help-container when clicking the "Quiz Editor" link
document.getElementById('quiz-editor-link').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    const helpContainer = document.getElementById('help-container');
    helpContainer.style.display = 'block';
    setTimeout(() => {
        helpContainer.classList.add('show');
    }, 0); // Delay adding the class to trigger the transition
});

function downloadQuizHtml(content, filename) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: 'text/html' });
    a.href = URL.createObjectURL(file);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
