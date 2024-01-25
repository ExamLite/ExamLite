const questions = [

    {
        question: "Examlite need to collect evidence for a recent data breach. What do we need to collect first based on the order of volatility?",
        answers: [
            {text: "RAM", correct: false},
            {text: "Swap file", correct: false},
            {text: "Processor Cache", correct: true},
            {text: "USB", correct: false},
        ]
    },
    {
        question: "We received an alert that a firewall went down. Upon investigation, we found no vulnerability existed on the system. We can categorize this as a:",
        answers: [
            {text: "True negative", correct: false},
            {text: "False Negative", correct: false},
            {text: "True positive", correct: false},
            {text: "False positive", correct: true},
        ] 
    },
    {
    question: "We need to set up a symmetric cyrptographic algorithm. Which algorithm should we use?",
        answers: [
            {text: "RC4", correct: true},
            {text: "ECC", correct: false},
            {text: "RSA", correct: false},
            {text: "DSA", correct: false},
        ]
    },
    {
        question: "Examlite was hacked recently! The hacker redirected our website to a blog called 'Save the whales!'. What can we most likely classify this hacker as? ",
            answers: [
                {text: "Insider threat", correct: false},
                {text: "Script kiddies", correct: false},
                {text: "A hacktivist", correct: true},
                {text: "Advanced Persistent threat", correct: false},
            ]
        },
        {
            question: "Which biometic scan utilizes visible and near-infrared light?",
                answers: [
                    {text: "Iris recognition", correct: true},
                    {text: "A retinal scan", correct: false},
                    {text: "A signature kinetics scan", correct: false},
                    {text: "Facial recognition", correct: false},
                ]
            }
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
    questionElement.innerHTML = "Q" + questionNo + " / 5 <br><br>" + currentQuestion.
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
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
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
