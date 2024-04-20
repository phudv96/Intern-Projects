const quizData = [
    {
      question: 'Which year did world war 2 start?',
      options: ['1945', '1939', '1909', '1911'],
      answer: '1939',
    },
    {
      question: 'Who is the father of computer science?',
      options: ['Albert Einstein', 'Bill Gates', 'Alan Turing', 'Hideo Kojima'],
      answer: 'Alan Turing',
    },
    {
      question: 'Which country won the FIFA World Cup in 2018?',
      options: ['Brazil', 'Germany', 'France', 'Argentina'],
      answer: 'France',
    },
    {
      question: 'Which computer language is the newest',
      options: ['C#', 'C', 'C++', 'JavaScript'],
      answer: 'C#',
    },
    {
      question: 'Which is the largest ocean on Earth?',
      options: [
        'Pacific Ocean',
        'Indian Ocean',
        'Atlantic Ocean',
        'Arctic Ocean',
      ],
      answer: 'Pacific Ocean',
    },
    {
      question: 'What is the chemical symbol for gold?',
      options: ['Au', 'Ag', 'Cu', 'Fe'],
      answer: 'Au',
    },
    {
      question: 'Who painted the Mona Lisa?',
      options: [
        'Pablo Picasso',
        'Vincent van Gogh',
        'Leonardo da Vinci',
        'Michelangelo',
      ],
      answer: 'Leonardo da Vinci',
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Mars', 'Venus', 'Mercury', 'Uranus'],
      answer: 'Mars',
    },
    {
      question: 'What is the largest species of shark?',
      options: [
        'Great White Shark',
        'Whale Shark',
        'Tiger Shark',
        'Hammerhead Shark',
      ],
      answer: 'Whale Shark',
    },
    {
      question: 'Which animal is known as the King of the Jungle?',
      options: ['Lion', 'Tiger', 'Elephant', 'Giraffe'],
      answer: 'Lion',
    },
  ];

const nameSpace = document.getElementById('nameSpace');
const resultContainer = document.getElementById('result');
const questionContainer = document.getElementById('questions');
const optionContainer = document.getElementById('options');
const submitButton = document.getElementById('submit');
const retryButton = document.getElementById('retry');
const showButton = document.getElementById('showAnswer');



let currentIndex = 0;
let score = 0;
let attempt = 1;
let incorrectAnswers = [];
let currentQuestion = quizData[currentIndex].question;
let currentOption = quizData[currentIndex].options;
let currentAnswer = quizData[currentIndex].answer;

start();

function start(){
    let playerName="Guest";
    /*while(playerName=="Guest" || playerName==""){
    playerName = window.prompt("Please enter your name");}*/

    nameSpace.textContent=`${playerName} - Attempt: ${attempt}`;
    nameSpace.style.display="block";
    displayQuestion();
}

function displayQuestion(){
  if (currentIndex === quizData.length){
    displayResult();
    return;
  }
  else{
    optionContainer.innerHTML = '';
    questionContainer.textContent = '';
    currentQuestion = quizData[currentIndex].question;
    currentOption = quizData[currentIndex].options;
    currentAnswer = quizData[currentIndex].answer;
    questionContainer.textContent=currentQuestion;
    for (let i=0; i<currentOption.length;i++){
        const newOption = document.createElement('input');
        newOption.type='radio';
        newOption.classList.add("option");
        newOption.id='option'+i;
        newOption.name='options';
        newOption.value=currentOption[i];
        
        const optionLabel = document.createElement('label');
        optionLabel.textContent=currentOption[i];
        optionLabel.setAttribute('for', 'option'+i);

        const lineBreak = document.createElement('br');

        optionContainer.appendChild(newOption);
        optionContainer.appendChild(optionLabel);
        optionContainer.appendChild(lineBreak);
        console.log(newOption);
    }
}
}
function submitAction(){
    const userAnswer = optionContainer.querySelector('input[type="radio"]:checked');
    if (userAnswer.value==currentAnswer){
        score ++;
        console.log(score);
    }
    else{
        incorrectAnswers.push({
          wrongAnswer: userAnswer.value,
          wrongIndex: currentIndex
        });
        console.log(incorrectAnswers);
    }
    currentIndex ++;
    console.log(currentIndex);
    displayQuestion();
}

function displayResult(){
  location.href = 'resultSide.html';
}

function retryAction(){
  location.href='quizSide.html';
  currentIndex = 0;
  score = 0;
  attempt ++;
  let incorrectAnswers = [];
}
