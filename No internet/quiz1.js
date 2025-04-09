const questions = [
// question 1 //
{
    question: "Which war ended the colonial rule in the Americas during William McKinley''s presidency?",
    answers: [
        {text: "Seven Years'' War", correct: false},
        {text: "Spanish-American War", correct: true},
        {text: "War of 1812", correct: false},
        {text: "French and Iroquois Wars", correct: false},
    ]
},
// question 2 //
{
    question: "Who was the first president to ride in an airplane.",
    answers: [
        {text: "Theodore Roosevelt", correct: false},
        {text: "James Garfield", correct: false},
        {text: "James K. Polk", correct: false},
        {text: "Franklin Delano Roosevelt", correct: true},
    ] 
},
// question 3 //
{
    question: "In which war did George H.W. Bush serve as a torpedo bomber pilot?",
    answers: [
        {text: "World War II", correct: true},
        {text: "Vietnam War", correct: false},
        {text: "Gulf War", correct: false},
        {text: "Cold War", correct: false},
    ]
},
// question 4 //
{
    question: "Which president was given a $20 speeding ticket for riding his horse and buggy too fast down a street in Washington, D.C",
    answers: [
        {text: "Benjamin Harrison", correct: false},
        {text: "John Quincy Adams", correct: false},
        {text: "Ulysses S. Grant", correct: true},
        {text: "Zachary Taylor", correct: false},
    ]
},
// question 5 //
{
    question: "Which president studied to become a medical doctor?",
    answers: [
        {text: "William Henry Harrison", correct: true},
        {text: "John Quincy Adams", correct: false},
        {text: "Herbert Hoover", correct: false},
        {text: "Richard Nixon", correct: false},
    ]
},
// question 6 //
{
    question: "Who was the first United States president to die in office?",
    answers: [
        {text: "Ulysses S. Grant", correct: false},
        {text: "Chester A. Arthur", correct: false},
        {text: "William Henry Harrison", correct: true},
        {text: "Benjamin Harrison", correct: false},
    ]
},
// question 7 //
{
    question: "In which war did President Harry S. Truman fight as an artillery captain?",
    answers: [
        {text: "Korean War", correct: false},
        {text: "World War I", correct: true},
        {text: "Philippine–American War", correct: false},
        {text: "Persian Gulf War", correct: false},
    ]
},
// question 8 //
{
    question: "Which U.S. president drafted the first ten amendments to the Constitution?",
    answers: [
        {text: "James Madison", correct: true},
        {text: "Franklin D. Roosevelt", correct: false},
        {text: "Zachary Taylor", correct: false},
        {text: "Thomas Jefferson", correct: false},
    ]
},
// question 9 //
{
    question: "How many presidents were born before the United States became a nation?",
    answers: [
        {text: "10", correct: false},
        {text: "12", correct: false},
        {text: "6", correct: false},
        {text: "8", correct: true},
    ]
},
// question 10 //
{
    question: "Which U.S. federal holiday is celebrated in honor of President George Washington and Abraham Lincoln?",
    answers: [
        {text: "National Freedom Day", correct: false},
        {text: "Presidents'' Day", correct: true},
        {text: "Emancipation Day", correct: false},
        {text: "Memorial Day", correct: false},
    ]
},
// question 11 //
{
    question: "What was the name of the commission created to investigate John F. Kennedy''s assassination?",
    answers: [
        {text: "Warren Commission", correct: true},
        {text: "Oswald Commission", correct: false},
        {text: "Katzenbach Commission", correct: false},
        {text: "Kerner Commission", correct: false},
    ]
},
// question 12 //
{
    question: "Which president signed the Louisiana Purchase?",
    answers: [
        {text: "George Washington", correct: false},
        {text: "James K. Polk", correct: false},
        {text: "Thomas Jefferson", correct: true},
        {text: "John Adams", correct: false},
    ]
},
// question 13 //
{
    question: "For which organization did George H.W. Bush serve as the director before becoming the president of the United States?",
    answers: [
        {text: "Central Intelligence Agency", correct: true},
        {text: "Federal Bureau of Investigation", correct: false},
        {text: "United States Secret Service", correct: false},
        {text: "National Security Agency", correct: false},
    ]
},
// question 14 //
{
    question: "Who was named president after Abraham Lincoln was assassinated?",
    answers: [
        {text: "Grover Cleveland", correct: false},
        {text: "Theodore Roosevelt", correct: false},
        {text: "Ulysses S. Grant", correct: false},
        {text: "Andrew Johnson", correct: true},
    ]
},
// question 15 //
{
    question: "How many U.S. presidents have served more than two terms?",
    answers: [
        {text: "4", correct: false},
        {text: "2", correct: false},
        {text: "1", correct: true},
        {text: "3", correct: false},
    ]
},
// question 16 //
{
    question: "Under whose presidency did the Iran hostage crisis take place?",
    answers: [
        {text: "Barack Obama", correct: false},
        {text: "Jimmy Carter", correct: true},
        {text: "Ronald Reagan", correct: false},
        {text: "William Howard Taft", correct: false},
    ]
},
// question 17 //
{
    question: "The first American president to live in the White House was:",
    answers: [
        {text: "John Adams", correct: true},
        {text: "Abraham Lincoln", correct: false},
        {text: "George Washington", correct: false},
        {text: "Thomas Jefferson", correct: false},
    ]
},
// question 18 //
{
    question: "Harriet Lane acted as the First Lady during James Buchanan''s presidency? How is she related to him?",
    answers: [
        {text: "sister", correct: false},
        {text: "daughter", correct: false},
        {text: "wife", correct: false},
        {text: "niece", correct: true},
    ]
},
// question 19 //
{
    question: "Which president was a peanut farmer before taking office? ",
    answers: [
        {text: "Theodore Roosevelt", correct: false},
        {text: "Jimmy Carter", correct: true},
        {text: "Abraham Lincoln", correct: false},
        {text: "James Garfield", correct: false},
    ]
},
// question 20 //
{
    question: "Who was the first president to ride in a car during office?",
    answers: [
        {text: "Teddy Roosevelt", correct: true},
        {text: "Millard Fillmore", correct: false},
        {text: "William Henry Harrison", correct: false},
        {text: "Andrew Johnson", correct: false},
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