const questions = [
// question 1 //
{
    question: "Management has been taking measures to increase the network security. You have been tasked with implementing an ACL on the edge router. What type of security control could this be considered?",
    answers: [
        {text: "Corrective", correct: false},
        {text: "Preventive", correct: true},
        {text: "Deterrent", correct: false},
        {text: "Detective", correct: false},
    ]
},
// question 2 //
{
    question: "Your company has decided to ramp up security by adding a large warning sign that states “NO TRESPASSING! VIOLATORS WILL BE PROSECUTED!” at every entrance. What type of security control could this be considered?",
    answers: [
        {text: "Corrective", correct: false},
        {text: "Directive", correct: false},
        {text: "Compensating", correct: false},
        {text: "Deterrent", correct: true},
    ] 
},
// question 3 //
{
    question: "Your company experienced an attack on their servers overnight. The IT department was able to perform a system backup to restore services. What type of security control is this considered?",
    answers: [
        {text: "Corrective", correct: false},
        {text: "Detective", correct: false},
        {text: "Preventive", correct: false},
        {text: "Deterrent", correct: true},
    ]
},
// question 4 //
{
    question: "You have been tasked with coordinating / avoiding a potential network outage. A router in your network needs to be sent back to the provider for repairs. You must substitute the router with something that affords the same or better level of protection to ensure your network remains secure and operational. What type of security control is this considered?",
    answers: [
        {text: "Deterrent", correct: false},
        {text: "Directive", correct: false},
        {text: "Compensating", correct: true},
        {text: "Detective", correct: false},
    ]
},
// question 5 //
{
    question: "You attend orientation for a new cyber security job and spend the afternoon filling out paperwork and reviewing company policies. One of the policies outlines what will happen if you do not comply to the “Security best practices”. This policy is included in every employee contract. What type of security control is this considered?",
    answers: [
        {text: "Directive", correct: true},
        {text: "Deterrent", correct: false},
        {text: "Preventive", correct: false},
        {text: "Corrective", correct: false},
    ]
},
// question 6 //
{
    question: "An attack on your companies SQL Server took place overnight. Management believes it may have been a disgruntled employee who was recently let go. You are tasked with checking the logs for any attempted or successful intrusions. What type of security control is this considered?",
    answers: [
        {text: "Corrective", correct: false},
        {text: "Preventive ", correct: false},
        {text: "Directive", correct: false},
        {text: "Detective", correct: true},
    ]
},
// question 7 //
{
   question: "To access the server room, you must unlock the door by entering an access code on the keypad. What category of security controls would this fall under?",
    answers: [
        {text: "Operational", correct: false},
        {text: "Managerial", correct: false},
        {text: "Physical", correct: true},
        {text: "Technical", correct: false},
    ] 
},
// question 8 //
{
    question: "Once a year, the IT department emails everyone a link to mandatory cyber security training. This is to ensure that employees stay up to date on the latest cyber security best practices. What category of security controls would this be considered?",
    answers: [
        {text: "Technical", correct: false},
        {text: "Operational", correct: true},
        {text: "Managerial", correct: false},
        {text: "Physical", correct: false},
    ]
},
// question 9 //
{
   question: "The Sales department has received a new shipment of laptops. You are tasked with downloading Antivirus software before they are allowed to use them. What category of security controls would this be considered?",
    answers: [
        {text: "Technical", correct: true},
        {text: "Managerial", correct: false},
        {text: "Operational", correct: false},
        {text: "Physical", correct: false},
    ]
},
// question 10 //
{
    question: "An old legacy router is due to be phased out of your network design soon. Before any changes can be approved to the equipment or the security policies, a team of department heads need to evaluate the system and identify any risk associated with removing or adding equipment. What category of security controls would this more than likely fall under?",
    answers: [
        {text: "Operational", correct: false},
        {text: "Physical", correct: false},
        {text: "Technical", correct: false},
        {text: "Managerial", correct: true},
    ]
},
// question 11 //
{
   question: "Your company has decided to place a security guard at every entrance of the building. They will be responsible for checking ID badges as you enter / exit the premises. What category of security controls would this most likely be considered?",
    answers: [
        {text: "Operational", correct: true},
        {text: "Technical", correct: false},
        {text: "Managerial", correct: false},
        {text: "Physical", correct: false},
    ]
},
// question 12 //
{
   question: "Your company has decided to place a motion activated light and a security camera at the server room entrance. What category of security controls would this most likely be considered?",
    answers: [
        {text: "Managerial", correct: false},
        {text: "Physical", correct: true},
        {text: "Operational", correct: false},
        {text: "Technical", correct: false},
    ] 
},
// question 13 //
{
    question: "A new software revision has come out for a router in your network. Management has decided that upgrading to the new revision will reduce the likelihood of a successful attack. What type of security control is this considered?",
    answers: [
        {text: "Detective", correct: false},
        {text: "Corrective", correct: false},
        {text: "Deterrent", correct: false},
        {text: "Preventive", correct: true},
    ]
},
// question 14 //
{
    question: "You have been tasked with consoling into a server. It requires a unique username and password before letting you make any configuration changes. You accidentally type in your username or password wrong, and it creates a log entry. What type of security control might this log be used for?",
    answers: [
        {text: "Deterrent", correct: false},
        {text: "Corrective", correct: false},
        {text: "Directive", correct: false},
        {text: "Detective", correct: true},
    ]
},
// question 15 //
{
    question: "An attack on your computer has left your network vulnerable to hackers looking to gain access through a backdoor. After consulting with a Subject matter expert, management has determined we must install a new patch to address the vulnerability. What type of security control would this be considered?",
    answers: [
        {text: "Corrective", correct: true},
        {text: "Compensating", correct: false},
        {text: "Preventive", correct: false},
        {text: "Directive", correct: false},
    ]
},
// question 16 //
{
   question: "Every day at noon, you are to perform preventative maintenance on a Third-party system. You are not familiar with this system, but you know it is vital to maintaining your network. Luckily, there is a Standard Operating Procedure (SOP) that details every step of the required maintenance. What type of security control is this considered?",
    answers: [
        {text: "Deterrent", correct: false},
        {text: "Preventive", correct: false},
        {text: "Directive", correct: true},
        {text: "Compensating", correct: false},
    ]
},
// question 17 //
{
    question: "You are reviewing a diagram of the network. You notice there is a router labeled “R1-Main” and another labeled “R2-Back-up”. Having this router redundancy could be considered a form of what security control?",
    answers: [
        {text: "Directive", correct: false},
        {text: "Compensating", correct: true},
        {text: "Detective", correct: false},
        {text: "Corrective", correct: false},
    ] 
},
// question 18 //
{
   question: "When you go to console into a switch, you notice a long banner pop up. It details the harsh punishments for accessing the equipment illegally. What type of security control is this considered?",
    answers: [
        {text: "Deterrent", correct: true},
        {text: "Preventive", correct: false},
        {text: "Detective", correct: false},
        {text: "Corrective", correct: false},
    ]
},
// question 19 //
{
    question: "Employees have been reporting a suspicious “Bank” email. Management wants you to implement an ACL to deny any message traffic from this email address. What category of security controls could this be considered?",
    answers: [
        {text: "Physical", correct: false},
        {text: "Managerial", correct: false},
        {text: "Technical", correct: true},
        {text: "Operational", correct: false},
    ]
},
// question 20 //
{
   question: "You have been tasked with drafting up an Incident response plan for any network outages that may occur. You must coordinate with other department heads to come up with a solution to any potential threats. What category of security controls would this fall under?",
    answers: [
        {text: "Managerial", correct: true},
        {text: "Technical", correct: false},
        {text: "Physical", correct: false},
        {text: "Operational", correct: false},
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
