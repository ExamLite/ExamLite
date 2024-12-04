const examData = [
    {
        question: "What is the capital of France?",
        a: "Berlin",
        b: "Madrid",
        c: "Paris",
        d: "Lisbon",
        correct: "c",
        explanation: "The capital of France is Paris, known for its rich history, art, and culture."
    },
    {
        question: "Which planet is known as the Red Planet?",
        a: "Earth",
        b: "Mars",
        c: "Jupiter",
        d: "Saturn",
        correct: "b",
        explanation: "Mars is red. There for it is known as the Red Planet"
    },
    // Add more questions here...
];

let currentQuestion = 0;
let score = 0;
let answers = Array(examData.length).fill(null); // Array to store answers
let lockedQuestions = Array(examData.length).fill(false); // Array to track locked questions
let scoreArray = Array(examData.length).fill(false); // Array to track if question has been scored

const examContainer = document.getElementById('exam');
const questionCounter = document.getElementById('question-counter');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const resultContainer = document.getElementById('result');
const restartButton = document.getElementById('restart-btn');
const backButton = document.getElementById('back-btn');
const answersReviewContainer = document.getElementById('answers-review');
const explanationButton = document.getElementById('explanation-btn');

function loadExam() {
    const currentExamData = examData[currentQuestion];
    const answer = answers[currentQuestion];
    examContainer.innerHTML = `
        <h2>${currentExamData.question}</h2>
        <label><input type="radio" name="answer" value="a" ${answer === 'a' ? 'checked' : ''} ${lockedQuestions[currentQuestion] ? 'disabled' : ''}> ${currentExamData.a}</label><br>
        <label><input type="radio" name="answer" value="b" ${answer === 'b' ? 'checked' : ''} ${lockedQuestions[currentQuestion] ? 'disabled' : ''}> ${currentExamData.b}</label><br>
        <label><input type="radio" name="answer" value="c" ${answer === 'c' ? 'checked' : ''} ${lockedQuestions[currentQuestion] ? 'disabled' : ''}> ${currentExamData.c}</label><br>
        <label><input type="radio" name="answer" value="d" ${answer === 'd' ? 'checked' : ''} ${lockedQuestions[currentQuestion] ? 'disabled' : ''}> ${currentExamData.d}</label>
        <div class="explanation" id="explanation" style="display:none;">
         <br><p>${currentExamData.explanation}</p> 
        </div>
    `;
    questionCounter.innerHTML = `Question ${currentQuestion + 1} of ${examData.length}`;
    questionCounter.style.display = 'block'; // Show question counter
    prevButton.style.display = currentQuestion > 0 ? 'block' : 'none';
    explanationButton.style.display = 'block'; // Show explanation button
}

function nextQuestion() {
    const answer = document.querySelector('input[name="answer"]:checked');
    if (answer) {
        if (answer.value === examData[currentQuestion].correct && !scoreArray[currentQuestion]) {
            score++;
            scoreArray[currentQuestion] = true; // Mark question as scored
        }
        answers[currentQuestion] = answer.value;
        lockedQuestions[currentQuestion] = true; // Lock the question after answering
        currentQuestion++;
        if (currentQuestion < examData.length) {
            loadExam();
        } else {
            showResult();
        }
    } else {
        alert("Please select an answer.");
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadExam();
    }
}

function toggleExplanation() {
    const explanation = document.getElementById('explanation');
    if (explanation.style.display === 'none') {
        explanation.style.display = 'block';
    } else {
        explanation.style.display = 'none';
    }
}

explanationButton.addEventListener('click', toggleExplanation);

function showResult() {
    const percentage = Math.round((score / examData.length) * 100);
    examContainer.style.display = 'none';
    nextButton.style.display = 'none';
    prevButton.style.display = 'none';
    explanationButton.style.display = 'none'; // Hide explanation button
    questionCounter.style.display = 'none'; // Hide question counter
    resultContainer.innerHTML = `<canvas id="pieChart" width="300" height="150"></canvas>
                                 <div>You scored ${score} out of ${examData.length}!</div>`;
    restartButton.style.display = 'block';
    backButton.style.display = 'block';
    animatePieChart(percentage);
    showAnswersReview();
}

function restartExam() {
    currentQuestion = 0;
    score = 0;
    answers = Array(examData.length).fill(null); // Reset answers
    lockedQuestions = Array(examData.length).fill(false); // Reset locked questions
    scoreArray = Array(examData.length).fill(false); // Reset score tracking
    examContainer.style.display = 'block';
    nextButton.style.display = 'block';
    prevButton.style.display = 'none';
    explanationButton.style.display = 'block'; // Show explanation button
    resultContainer.innerHTML = '';
    restartButton.style.display = 'none';
    backButton.style.display = 'none';
    answersReviewContainer.style.display = 'none';
    loadExam();
}

function animatePieChart(percentage) {
    const canvas = document.getElementById('pieChart');
    canvas.width = 300;  // Increase canvas width
    canvas.height = 150;  // Increase canvas height
    const ctx = canvas.getContext('2d');
    const targetEndAngle = Math.PI + (Math.PI * (percentage / 100));
    let currentEndAngle = Math.PI;

    function draw() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the background circle (representing total)
        ctx.beginPath();
        ctx.arc(150, 150, 150, Math.PI, Math.PI * 2);  // Adjust radius and position for larger size
        ctx.fillStyle = '#e0e0e0';
        ctx.fill();

        // Create radial gradient
        const gradient = ctx.createRadialGradient(150, 150, 0, 150, 150, 150);
        gradient.addColorStop(0, 'rgba(0, 123, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 123, 255, 1)');

        // Draw the foreground arc (representing score)
        ctx.beginPath();
        ctx.arc(150, 150, 150, Math.PI, currentEndAngle);  // Adjust radius and position for larger size
        ctx.lineTo(150, 150);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Add percentage text in the middle
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${percentage}%`, 150, 130);  // Adjust position for larger size

        if (currentEndAngle < targetEndAngle) {
            currentEndAngle += 0.05;  // Increased value for faster animation
            requestAnimationFrame(draw);
        }
    }

    draw();
}

function showAnswersReview() {
    answersReviewContainer.style.display = 'block';
    answersReviewContainer.innerHTML = '<h3>Review Your Answers:</h3>';

    examData.forEach((examItem, index) => {
        const userAnswer = answers[index];
        const correctAnswer = examItem.correct;

        const answerItem = document.createElement('div');
        answerItem.innerHTML = `<strong>Question ${index + 1}:</strong> ${examItem.question}<br>`;

        ['a', 'b', 'c', 'd'].forEach(choice => {
            const isCorrect = choice === correctAnswer;
            const isSelected = choice === userAnswer;
            answerItem.innerHTML += `<span ${isCorrect ? 'class="correct-answer"' : isSelected ? 'class="wrong-answer"' : ''}>
                                       ${choice.toUpperCase()}: ${examItem[choice]}
                                     </span><br>`;
        });

        // Add the explanation text
        answerItem.innerHTML += `<br><div class="explanation"><strong>Explanation:</strong> ${examItem.explanation}</div><br><hr><br>`;
        
        answersReviewContainer.appendChild(answerItem);
    });
}

// Initialize the exam
loadExam();
