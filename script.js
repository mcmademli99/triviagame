document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answers');
    const nextButton = document.getElementById('next-button');
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');

    let currentQuestionIndex = 0;
    let questions = [];
    let score = 0;
    let timeLeft = 30;
    let timer;

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        setNextQuestion();
    });

    function startGame() {
        currentQuestionIndex = 0;
        score = 0;
        scoreElement.textContent = `Score: ${score}`;
        nextButton.classList.add('hide');
        fetchQuestions();
    }

    function fetchQuestions() {
        fetch('https://opentdb.com/api.php?amount=10&type=multiple')
            .then(response => response.json())
            .then(data => {
                questions = data.results.map(q => ({
                    question: q.question,
                    answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
                    correctAnswer: q.correct_answer
                }));
                setNextQuestion();
            })
            .catch(error => console.error('Error fetching questions:', error));
    }

    function setNextQuestion() {
        resetState();
        showQuestion(questions[currentQuestionIndex]);
        startTimer();
    }

    function showQuestion(question) {
        questionElement.innerHTML = question.question;
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerHTML = answer;
            button.addEventListener('click', () => selectAnswer(button, question.correctAnswer));
            answerButtonsElement.appendChild(button);
        });
    }

    function resetState() {
        nextButton.classList.add('hide');
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
        clearInterval(timer);
        timeLeft = 30;
        timerElement.textContent = `Time: ${timeLeft}`;
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Time: ${timeLeft}`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                selectAnswer(null, questions[currentQuestionIndex].correctAnswer);
            }
        }, 1000);
    }

    function selectAnswer(button, correctAnswer) {
        if (button) {
            const selectedAnswer = button.innerHTML;
            if (selectedAnswer === correctAnswer) {
                button.style.backgroundColor = 'green';
                score++;
                scoreElement.textContent = `Score: ${score}`;
            } else {
                button.style.backgroundColor = 'red';
            }
        }
        Array.from(answerButtonsElement.children).forEach(btn => {
            if (btn.innerHTML === correctAnswer) {
                btn.style.backgroundColor = 'green';
            }
            btn.disabled = true;
        });
        nextButton.classList.remove('hide');
        clearInterval(timer);
    }

    startGame();
});
