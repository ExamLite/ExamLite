const questions = [
// question 1 //
{
    question: "Is this an example of a question?",
    info: "This IS an example of a question.",
    answers: [
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: true},
    ]
},
// question 2 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: false},
        {text: "", correct: true},
        {text: "", correct: false},
        {text: "", correct: false},
    ] 
},
// question 3 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: true},
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: false},
    ]
},
// question 4 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: true},
        {text: "", correct: false},
    ]
},
// question 5 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: false},
        {text: "", correct: true},
        {text: "", correct: false},
        {text: "", correct: false},
    ]
},
// question 6 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: true},
        {text: "", correct: false},
    ]
},
// question 7 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: true},
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: false},
    ] 
},
// question 8 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: true},
    ]
},
// question 9 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: true},
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: false},
    ]
},
// question 10 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: false},
        {text: "", correct: true},
        {text: "", correct: false},
        {text: "", correct: false},
    ]
},
// question 11 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: true},
    ]
},
// question 12 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: true},
        {text: "", correct: false},
    ] 
},
// question 13 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: false},
        {text: "", correct: true},
        {text: "", correct: false},
        {text: "", correct: false},
    ]
},
// question 14 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: true},
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: false},
    ]
},
// question 15 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: true},
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: false},
    ]
},
// question 16 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: true},
        {text: "", correct: false},
    ]
},
// question 17 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: false},
        {text: "", correct: true},
        {text: "", correct: false},
        {text: "", correct: false},
    ] 
},
// question 18 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: true},
    ]
},
// question 19 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: true},
        {text: "", correct: false},
        {text: "", correct: false},
        {text: "", correct: false},
    ]
},
// question 20 //
{
    question: "",
    info: "",
    answers: [
        {text: "", correct: false},
        {text: "", correct: true},
        {text: "", correct: false},
        {text: "", correct: false},
    ]
},
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const NextButton = document.getElementById("next-btn");
const InfoButton = document.getElementById("info-btn");
const infoElement = document.getElementById("info");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    NextButton.innerHTML = "Next";
    InfoButton.innerHTML = "Explanation";
    showQuestion();
}

function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = "Q" + questionNo + " / 20 <br><br>" + currentQuestion.
    question;
    infoElement.innerHTML = currentQuestion.info;

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

function myFunction() {
  var x = document.getElementById("info");
  x.style.display = x.style.display != "block"?"block":"none"
}

function resetState(){

    NextButton.style.display = "none";
    InfoButton.style.display = "none";
    infoElement.style.display = "none";
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
    InfoButton.style.display = "block";
}


function showScore(){
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!
<br>
<br>
Below is a breakdown of the exam:
<br>
<br>
<hr>
<br>
<br>
<span style="color:lavender; font-weight: 3; font-size: 18px;">

<!—Question 1 -->
<span style="font-size: 25px;">Q1.</span> question question question?
<br>
<br>
A - Words
<br>
<br>
B - Words
<br>
<br>
C - Words
<br>
<br>
<span style="color:#9aeabc;"> D - Words </span>
<br>
<br>
info info info info
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 2 -->
<span style="font-size: 25px;">Q2.</span> question question question?
<br>
<br>
A - Words
<br>
<br>
<span style="color:#9aeabc;"> B - Words </span>
<br>
<br>
C - Words
<br>
<br>
D - Words
<br>
<br>
info info info info 
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 3 -->
<span style="font-size: 25px;">Q3.</span> question question question?
<br>
<br>
<span style="color:#9aeabc;"> A - Words </span>
<br>
<br>
B - Words
<br>
<br>
C - Words
<br>
<br>
D - Words
<br>
<br>
info info info info
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 4 -->
<span style="font-size: 25px;">Q4.</span> question question question?
<br>
<br>
A - Words
<br>
<br>
B - Words 
<br>
<br>
<span style="color:#9aeabc;"> C - Words </span>
<br>
<br>
D - Words
<br>
<br>
info info info info
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 5 -->
<span style="font-size: 25px;">Q5.</span> question question question?
<br>
<br>
A - Words
<br>
<br>
<span style="color:#9aeabc;"> B - Words </span>
<br>
<br>
C - Words
<br>
<br>
D - Words
<br>
<br>
info info info info
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 6 -->
<span style="font-size: 25px;">Q6.</span> question question question?
<br>
<br>
A - Words
<br>
<br>
B - Words
<br>
<br>
<span style="color:#9aeabc;"> C - Words </span>
<br>
<br>
D - Words
<br>
<br>
info info info info
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 7 -->
<span style="font-size: 25px;">Q7.</span> question question question?
<br>
<br>
<span style="color:#9aeabc;"> A - Words </span>
<br>
<br>
B - Words
<br>
<br>
C - Words
<br>
<br>
D - Words
<br>
<br>
info info info info
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 8 -->
<span style="font-size: 25px;">Q8.</span> question question question?
<br>
<br>
A - Words
<br>
<br>
B - Words
<br>
<br>
C - Words
<br>
<br>
<span style="color:#9aeabc;"> D - Words </span>
<br>
<br>
info info info info
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 9 -->
<span style="font-size: 25px;">Q9.</span> question question question?
<br>
<br>
<span style="color:#9aeabc;"> A - Words </span>
<br>
<br>
B - Words
<br>
<br>
C - Words
<br>
<br>
D - Words
<br>
<br>
info info info info
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 10 -->
<span style="font-size: 25px;">Q10.</span> question question question?
<br>
<br>
A - Words
<br>
<br>
<span style="color:#9aeabc;"> B - Words </span>
<br>
<br>
C - Words
<br>
<br>
D - Words
<br>
<br>
info info info info
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 11 -->
<span style="font-size: 25px;">Q11.</span> question question question?
<br>
<br>
A - Words
<br>
<br>
B - Words
<br>
<br>
C - Words
<br>
<br>
<span style="color:#9aeabc;"> D - Words </span>
<br>
<br>
info info info info
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 12 -->
<span style="font-size: 25px;">Q12.</span> question question question?
<br>
<br>
A - Words
<br>
<br>
B - Words
<br>
<br>
<span style="color:#9aeabc;"> C - Words </span>
<br>
<br>
D - Words
<br>
<br>
info info info info
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 13 -->
<span style="font-size: 25px;">Q13.</span> question question question?
<br>
<br>
A - Words
<br>
<br>
<span style="color:#9aeabc;"> B - Words </span>
<br>
<br>
C - Words
<br>
<br>
D - Words
<br>
<br>
info info info info
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 14 -->
<span style="font-size: 25px;">Q14.</span> question question question?
<br>
<br>
<span style="color:#9aeabc;"> A - Words </span>
<br>
<br>
B - Words
<br>
<br>
C - Words
<br>
<br>
D - Words
<br>
<br>
info info info info
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 15 -->
<span style="font-size: 25px;">Q15.</span> question question question?
<br>
<br>
<span style="color:#9aeabc;"> A - Words </span>
<br>
<br>
B - Words
<br>
<br>
C - Words
<br>
<br>
D - Words
<br>
<br>
info info info info
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 16 -->
<span style="font-size: 25px;">Q16.</span> question question question?
<br>
<br>
A - Words
<br>
<br>
B - Words
<br>
<br>
<span style="color:#9aeabc;"> C - Words </span>
<br>
<br>
D - Words
<br>
<br>
info info info info 
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 17 -->
<span style="font-size: 25px;">Q17.</span> question question question?
<br>
<br>
A - Words
<br>
<br>
<span style="color:#9aeabc;"> B - Words </span>
<br>
<br>
C - Words
<br>
<br>
D - Words
<br>
<br>
info info info info
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 18 -->
<span style="font-size: 25px;">Q18.</span> question question question?
<br>
<br>
A - Words
<br>
<br>
B - Words
<br>
<br>
C - Words
<br>
<br>
<span style="color:#9aeabc;"> D - Words </span>
<br>
<br>
info info info info 
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 19 -->
<span style="font-size: 25px;">Q19.</span> question question question?
<br>
<br>
<span style="color:#9aeabc;"> A - Words </span>
<br>
<br>
B - Words
<br>
<br>
C - Words
<br>
<br>
D - Words
<br>
<br>
info info info info
<br>
<br>
<br>
<hr>
<br>
<br>

<!—Question 20 -->
<span style="font-size: 25px;">Q20.</span> question question question?
<br>
<br>
A - Words
<br>
<br>
<span style="color:#9aeabc;"> B - Words </span>
<br>
<br>
C - Words
<br>
<br>
D - Words
<br>
<br>
info info info info
<br>
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