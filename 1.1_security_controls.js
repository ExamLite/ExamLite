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
        {text: "Corrective", correct: true},
        {text: "Detective", correct: false},
        {text: "Preventive", correct: false},
        {text: "Deterrent", correct: false},
    ]
},
// question 4 //
{
    question: "You have been tasked with coordinating / avoiding a potential network outage. A router in your network needs to be sent back to the provider for repairs. You must replace the router with something that offers the same or better level of protection to ensure your network remains secure and operational. What type of security control is this considered?",
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
   question: "Everyday at noon, you are to perform preventative maintenance on a Third-party system. You are not familiar with this system, but you know it is vital to maintaining your network. Luckily, there is a Standard Operating Procedure (SOP) that details every step of the required maintenance. What type of security control is this considered?",
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
<span style="font-size: 25px;">Q1.</span> Management has been taking measures to increase the network security. You have been tasked with implementing an ACL on the edge router. What type of security control could this be considered?
<br>
<br>
A - Corrective
<br>
<br>
<span style="color:#9aeabc;"> B - Preventive </span>
<br>
<br>
C - Deterrent
<br>
<br>
D - Detective
<br>
<br>
Implementing a Preventive security control helps reduce the likelihood that an attack can succeed. This is an action that will take place BEFORE an attack occurs. A Corrective security control eliminates / reduces the impact of a security violation. This will take place AFTER an attack. A Deterrent security control may not prevent an attack but will attempt to discourage an attacker from trying. A Detective security control does not prevent an attack but will hopefully help identify and record an attempted / successful intrusion on your network.
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q2.</span> Your company has decided to ramp up security by adding a large warning sign that states “NO TRESPASSING! VIOLATORS WILL BE PROSECUTED!” at every entrance. What type of security control could this be considered?
<br>
<br>
A - Corrective
<br>
<br>
B - Directive
<br>
<br>
C - Compensating
<br>
<br>
<span style="color:#9aeabc;"> D - Deterrent </span>
<br>
<br>
A Deterrent security control may not prevent an attack but will attempt to discourage an attacker from trying. A Corrective security control eliminates / reduces the impact of a security violation. This will take place AFTER an attack. A Directive security control can be defined as guidelines, policies, SOPs, laws, or regulations. Companies will hold training and awareness programs to keep their employees up to date on the Cyber-security best practices. A Compensating security control is a substitute for a principal control that affords the same or better level of protection.  
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q3.</span> Your company experienced an attack on their servers overnight. The IT department was able to perform a system backup to restore services. What type of security control is this considered?
<br>
<br>
<span style="color:#9aeabc;"> A - Corrective </span>
<br>
<br>
B - Detective
<br>
<br>
C - Preventive
<br>
<br>
D - Deterrent
<br>
<br>
A Corrective security control eliminates / reduces the impact of a security violation. This will take place AFTER an attack. A Detective security control does not prevent an attack but will hopefully help identify and record an attempted / successful intrusion on your network. A Preventive security control helps reduce the likelihood that an attack can succeed. This is an action that will take place BEFORE an attack occurs. A Deterrent security control may not prevent an attack but will attempt to discourage an attacker from trying.
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q4.</span> You have been tasked with coordinating / avoiding a potential network outage. A router in your network needs to be sent back to the provider for repairs. You must replace the router with something that offers the same or better level of protection to ensure your network remains secure and operational. What type of security control is this considered?
<br>
<br>
A - Deterrent
<br>
<br>
B - Directive 
<br>
<br>
<span style="color:#9aeabc;"> C - Compensating </span>
<br>
<br>
D - Detective
<br>
<br>
A Compensating security control is a substitute for a principal control that affords the same or better level of protection. A Deterrent security control may not prevent an attack but will attempt to discourage an attacker from trying. A Directive security control can be defined as guidelines, policies, SOPs, laws, or regulations. Companies will hold training and awareness programs to keep their employees up to date on the Cyber-security best practices. A Detective security control does not prevent an attack but will hopefully help identify and record an attempted / successful intrusion on your network.
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q5.</span> You attend orientation for a new cyber security job and spend the afternoon filling out paperwork and reviewing company policies. One of the policies outlines what will happen if you do not comply to the “Security best practices”. This policy is included in every employee contract. What type of security control is this considered?
<br>
<br>
<span style="color:#9aeabc;"> A - Directive </span>
<br>
<br>
B - Deterrent
<br>
<br>
C - Preventive
<br>
<br>
D - Corrective
<br>
<br>
A Directive security control can be defined as guidelines, policies, SOPs, laws, or regulations. Companies will hold training and awareness programs to keep their employees up to date on the Cyber-security best practices. A Deterrent security control may not prevent an attack but will attempt to discourage an attacker from trying. A Preventive security control helps reduce the likelihood that an attack can succeed. This is an action that will take place BEFORE an attack occurs. A Corrective security control eliminates / reduces the impact of a security violation. This will take place AFTER an attack.
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q6.</span> An attack on your companies SQL Server took place overnight. Management believes it may have been a disgruntled employee who was recently let go. You are tasked with checking the logs for any attempted or successful intrusions. What type of security control is this considered?
<br>
<br>
A - Corrective
<br>
<br>
B - Preventive
<br>
<br>
C - Directive
<br>
<br>
<span style="color:#9aeabc;"> D - Detective </span>
<br>
<br>
A Detective security control does not prevent an attack but will hopefully help identify and record an attempted / successful intrusion on your network. A Corrective security control eliminates / reduces the impact of a security violation. This will take place AFTER an attack. A Preventive security control helps reduce the likelihood that an attack can succeed. This is an action that will take place BEFORE an attack occurs. A Directive security control can be defined as guidelines, policies, SOPs, laws, or regulations. Companies will hold training and awareness programs to keep their employees up to date on the Cyber-security best practices.
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q7.</span> To access the server room, you must unlock the door by entering an access code on the keypad. What category of security controls would this fall under?
<br>
<br>
A - Operational
<br>
<br>
B - Managerial
<br>
<br>
<span style="color:#9aeabc;"> C - Physical </span>
<br>
<br>
D - Technical
<br>
<br>
Physical controls are usually anything tangible that is used to prevent unauthorized access, such as alarms, gateways, locks, lighting, and security cameras that deter and detect access to a premises and hardware. Operational control is implemented primarily by people. Security guards and training programs would be considered Operational. Managerial control is also known as Administrative control. It gives oversight of the information system and focuses on the management of risk. Technical control is implemented as a system (Hardware, software, firmware).
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q8.</span> Once a year, the IT department emails everyone a link to mandatory cyber security training. This is to ensure that employees stay up to date on the latest cyber security best practices. What category of security controls would this be considered?
<br>
<br>
A - Technical
<br>
<br>
<span style="color:#9aeabc;"> B - Operational </span>
<br>
<br>
C - Managerial
<br>
<br>
D - Physical
<br>
<br>
Operational control is implemented primarily by people. Security guards and training programs would be considered Operational. Technical control is implemented as a system (Hardware, software, firmware). Managerial control is also known as Administrative control. It gives oversight of the information system and focuses on the management of risk. Physical controls are usually anything tangible that is used to prevent unauthorized access, such as alarms, gateways, locks, lighting, and security cameras that deter and detect access to a premises and hardware.
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q9.</span> The Sales department has received a new shipment of laptops. You are tasked with downloading Antivirus software before they are allowed to use them. What category of security controls would this be considered?
<br>
<br>
<span style="color:#9aeabc;"> A - Technical </span>
<br>
<br>
B - Managerial
<br>
<br>
C - Operational
<br>
<br>
D - Physical
<br>
<br>
Technical control is implemented as a system (Hardware, software, firmware). Managerial control is also known as Administrative control. It gives oversight of the information system and focuses on the management of risk. Operational control is implemented primarily by people. Security guards and training programs would be considered Operational. Physical controls are usually anything tangible that is used to prevent unauthorized access, such as alarms, gateways, locks, lighting, and security cameras that deter and detect access to a premises and hardware.
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q10.</span> An old legacy router is due to be phased out of your network design soon. Before any changes can be approved to the equipment or the security policies, a team of department heads need to evaluate the system and identify any risk associated with removing or adding equipment. What category of security controls would this more than likely fall under?
<br>
<br>
A - Operational
<br>
<br>
B - Physical
<br>
<br>
C - Technical
<br>
<br>
<span style="color:#9aeabc;"> D - Managerial </span>
<br>
<br>
Managerial control is also known as Administrative control. It gives oversight of the information system and focuses on the management of risk. Operational control is implemented primarily by people. Security guards and training programs would be considered Operational. Physical controls are usually anything tangible that is used to prevent unauthorized access, such as alarms, gateways, locks, lighting, and security cameras that deter and detect access to a premises and hardware. Technical control is implemented as a system (Hardware, software, firmware).
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q11.</span> Your company has decided to place a security guard at every entrance of the building. They will be responsible for checking ID badges as you enter / exit the premises. What category of security controls would this most likely be considered? 
<br>
<br>
<span style="color:#9aeabc;"> A - Operational </span>
<br>
<br>
B - Technical
<br>
<br>
C - Managerial
<br>
<br>
D - Physical
<br>
<br>
Operational control is implemented primarily by people. Security guards and training programs would be considered Operational. Technical control is implemented as a system (Hardware, software, firmware). Managerial control is also known as Administrative control. It gives oversight of the information system and focuses on the management of risk. Physical controls are usually anything tangible that is used to prevent unauthorized access, such as alarms, gateways, locks, lighting, and security cameras that deter and detect access to a premises and hardware.
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q12.</span> Your company has decided to place a motion activated light and a security camera at the server room entrance. What category of security controls would this most likely be considered?
<br>
<br>
A - Managerial
<br>
<br>
<span style="color:#9aeabc;"> B - Physical </span>
<br>
<br>
C - Operational
<br>
<br>
D - Technical
<br>
<br>
Physical controls are usually anything tangible that is used to prevent unauthorized access, such as alarms, gateways, locks, lighting, and security cameras that deter and detect access to a premises and hardware. Managerial control is also known as Administrative control. It gives oversight of the information system and focuses on the management of risk. Operational control is implemented primarily by people. Security guards and training programs would be considered Operational. Technical control is implemented as a system (Hardware, software, firmware).
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q13.</span> A new software revision has come out for a router in your network. Management has decided that upgrading to the new revision will reduce the likelihood of a successful attack. What type of security control is this considered?
<br>
<br>
A - Detective
<br>
<br>
B - Corrective
<br>
<br>
C - Deterrent
<br>
<br>
<span style="color:#9aeabc;"> D - Preventive </span>
<br>
<br>
A Preventive security control helps reduce the likelihood that an attack can succeed. This is an action that will take place BEFORE an attack occurs. A Detective security control does not prevent an attack but will hopefully help identify and record an attempted / successful intrusion on your network. A Corrective security control eliminates / reduces the impact of a security violation. This will take place AFTER an attack. A Deterrent security control may not prevent an attack but will attempt to discourage an attacker from trying.
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q14.</span> You have been tasked with consoling into a server. It requires a unique username and password before letting you make any configuration changes. You accidentally type in your username or password wrong, and it creates a log entry. What type of security control might this log be used for?
<br>
<br>
A - Deterrent
<br>
<br>
B - Corrective
<br>
<br>
C - Directive
<br>
<br>
<span style="color:#9aeabc;"> D - Detective </span>
<br>
<br>
A Detective security control does not prevent an attack but will hopefully help identify and record an attempted / successful intrusion on your network. A Deterrent security control may not prevent an attack but will attempt to discourage an attacker from trying. A Corrective security control eliminates / reduces the impact of a security violation. This will take place AFTER an attack. A Directive security control can be defined as guidelines, policies, SOPs, laws, or regulations. Companies will hold training and awareness programs to keep their employees up to date on the Cyber-security best practices.
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q15.</span> An attack on your computer has left your network vulnerable to hackers looking to gain access through a backdoor. After consulting with a Subject matter expert, management has determined we must install a new patch to address the vulnerability. What type of security control would this be considered?
<br>
<br>
<span style="color:#9aeabc;"> A - Corrective </span>
<br>
<br>
B - Compensating
<br>
<br>
C - Preventive
<br>
<br>
D - Directive
<br>
<br>
A Corrective security control eliminates / reduces the impact of a security violation. This will take place AFTER an attack. A Compensating security control is a substitute for a principal control that affords the same or better level of protection. A Preventive security control helps reduce the likelihood that an attack can succeed. This is an action that will take place BEFORE an attack occurs. A Directive security control can be defined as guidelines, policies, SOPs, laws, or regulations. Companies will hold training and awareness programs to keep their employees up to date on the Cyber-security best practices.
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q16.</span> Everyday at noon, you are to perform preventative maintenance on a Third-party system. You are not familiar with this system, but you know it is vital to maintaining your network. Luckily, there is a Standard Operating Procedure (SOP) that details every step of the required maintenance. What type of security control is this considered? 
<br>
<br>
A - Deterrent
<br>
<br>
B - Preventive 
<br>
<br>
<span style="color:#9aeabc;"> C - Directive </span>
<br>
<br>
D - Compensating
<br>
<br>
A Directive security control can be defined as guidelines, policies, SOPs, laws, or regulations. Companies will hold training and awareness programs to keep their employees up to date on the Cyber-security best practices. A Deterrent security control may not prevent an attack but will attempt to discourage an attacker from trying. A Preventive security control helps reduce the likelihood that an attack can succeed. This is an action that will take place BEFORE an attack occurs. A Compensating security control is a substitute for a principal control that affords the same or better level of protection.
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q17.</span> You are reviewing a diagram of the network. You notice there is a router labeled “R1-Main” and another labeled “R2-Back-up”. Having this router redundancy could be considered a form of what security control?
<br>
<br>
A - Directive
<br>
<br>
<span style="color:#9aeabc;"> B - Compensating </span>
<br>
<br>
C - Detective
<br>
<br>
D - Corrective
<br>
<br>
A Compensating security control is a substitute for a principal control that affords the same or better level of protection. A Directive security control can be defined as guidelines, policies, SOPs, laws, or regulations. Companies will hold training and awareness programs to keep their employees up to date on the Cyber-security best practices. A Detective security control does not prevent an attack but will hopefully help identify and record an attempted / successful intrusion on your network. A Corrective security control eliminates / reduces the impact of a security violation. This will take place AFTER an attack.
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q18.</span> When you go to console into a switch, you notice a long banner pop up. It details the harsh punishments for accessing the equipment illegally. What type of security control is this considered?
<br>
<br>
<span style="color:#9aeabc;"> A - Deterrent  </span>
<br>
<br>
B - Preventive
<br>
<br>
C - Detective
<br>
<br>
D - Corrective
<br>
<br>
A Deterrent security control may not prevent an attack but will attempt to discourage an attacker from trying. A Preventive security control helps reduce the likelihood that an attack can succeed. This is an action that will take place BEFORE an attack occurs. A Detective security control does not prevent an attack but will hopefully help identify and record an attempted / successful intrusion on your network. A Corrective security control eliminates / reduces the impact of a security violation. This will take place AFTER an attack.
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q19.</span> Employees have been reporting a suspicious “Bank” email. Management wants you to implement an ACL to deny any message traffic from this email address. What category of security controls could this be considered?
<br>
<br>
A - Physical
<br>
<br>
B - Managerial
<br>
<br>
<span style="color:#9aeabc;"> C - Technical </span>
<br>
<br>
D - Operational
<br>
<br>
Technical control is implemented as a system (Hardware, software, firmware). Physical controls are usually anything tangible that is used to prevent unauthorized access, such as alarms, gateways, locks, lighting, and security cameras that deter and detect access to a premises and hardware. Managerial control is also known as Administrative control. It gives oversight of the information system and focuses on the management of risk. Operational control is implemented primarily by people. Security guards and training programs would be considered Operational.
<br>
<br>
<br>
<hr>
<br>
<br>
<span style="font-size: 25px;">Q20.</span> You have been tasked with drafting up an Incident response plan for any network outages that may occur. You must coordinate with other department heads to come up with a solution to any potential threats. What category of security controls would this fall under?
<br>
<br>
<span style="color:#9aeabc;"> A - Managerial </span>
<br>
<br>
B - Technical
<br>
<br>
C - Physical
<br>
<br>
D - Operational
<br>
<br>
Managerial control is also known as Administrative control. It gives oversight of the information system and focuses on the management of risk. Technical control is implemented as a system (Hardware, software, firmware). Physical controls are usually anything tangible that is used to prevent unauthorized access, such as alarms, gateways, locks, lighting, and security cameras that deter and detect access to a premises and hardware. Operational control is implemented primarily by people. Security guards and training programs would be considered Operational.
<br>
<br>
<br>
</span>

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
