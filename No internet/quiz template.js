const questions = [
// question 1 //
{
    question: " ",
    answers: [
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: true},
    ]
},
// question 2 //
{
    question: " ",
    answers: [
        {text: " ", correct: false},
        {text: " ", correct: true},
        {text: " ", correct: false},
        {text: " ", correct: false},
    ]
},
// question 3 //
{
    question: " ",
    answers: [
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: true},
        {text: " ", correct: false},
    ]
},
// question 4 //
{
    question: " ",
    answers: [
        {text: " ", correct: true},
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: false},
    ]
},
// question 5 //
{
    question: " ",
    answers: [
        {text: " ", correct: true},
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: false},
    ]
},
// question 6 //
{
    question: " ",
    answers: [
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: true},
        {text: " ", correct: false},
    ]
},
// question 7 //
{
    question: " ",
    answers: [
        {text: " ", correct: false},
        {text: " ", correct: true},
        {text: " ", correct: false},
        {text: " ", correct: false},
    ]
},
// question 8 //
{
    question: " ",
    answers: [
        {text: " ", correct: true},
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: false},
    ]
},
// question 9 //
{
    question: " ",
    answers: [
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: true},
    ]
},
// question 10 //
{
    question: " ",
    answers: [
        {text: " ", correct: false},
        {text: " ", correct: true},
        {text: " ", correct: false},
        {text: " ", correct: false},
    ]
},
// question 11 //
{
    question: " ",
    answers: [
        {text: " ", correct: true},
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: false},
    ]
},
// question 12 //
{
    question: " ",
    answers: [
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: true},
        {text: " ", correct: false},
    ]
},
// question 13 //
{
    question: " ",
    answers: [
        {text: " ", correct: true},
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: false},
    ]
},
// question 14 //
{
    question: " ",
    answers: [
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: true},
    ]
},
// question 15 //
{
    question: " ",
    answers: [
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: true},
        {text: " ", correct: false},
    ]
},
// question 16 //
{
    question: " ",
    answers: [
        {text: " ", correct: false},
        {text: " ", correct: true},
        {text: " ", correct: false},
        {text: " ", correct: false},
    ]
},
// question 17 //
{
    question: " ",
    answers: [
        {text: " ", correct: true},
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: false},
    ]
},
// question 18 //
{
    question: " ",
    answers: [
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: true},
    ]
},
// question 19 //
{
    question: " ",
    answers: [
        {text: " ", correct: false},
        {text: " ", correct: true},
        {text: " ", correct: false},
        {text: " ", correct: false},
    ]
},
// question 20 //
{
    question: " ",
    answers: [
        {text: " ", correct: true},
        {text: " ", correct: false},
        {text: " ", correct: false},
        {text: " ", correct: false},
    ]
},
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const NextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    NextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = "Q" + questionNo + " / 20 <br><br>" + currentQuestion.
    question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if(answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState(){

    NextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }

}

function selectAnswer(e){
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    }else{
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    NextButton.style.display = "block";
}

function showScore(){
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!
<br>

`;
    NextButton.innerHTML = "Take again";
    NextButton.style.display = "block";
}

function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        showScore();
    }
}

NextButton.addEventListener("click", ()=>{
    if(currentQuestionIndex < questions.length){
        handleNextButton();
    }else{
        startQuiz();
    }

});

startQuiz();