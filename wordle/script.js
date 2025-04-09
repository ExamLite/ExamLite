document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const guessButton = document.getElementById('guessButton');
    const messageDiv = document.getElementById('message');
    const nextButton = document.getElementById('nextButton');
    const hintDiv = document.getElementById('hint');
    const progressContainer = document.getElementById('progress-container');
    let wordToGuess = '';
    const maxAttempts = 6;
    let currentRow = 0;

    // Predefined list of words, hints, and descriptions
    const wordsList = [
        { word: 'APPLE', hint: "It's a fruit and keeps the doctor away.", description: "Apples are nutritious and delicious!" },
        { word: 'GRAPE', hint: "Small, round, and often turned into wine.", description: "Grapes are used to make wine, raisins, and juice." },
        { word: 'MANGO', hint: "Tropical fruit with a big seed inside.", description: "Mangoes are sweet and tropical, enjoyed worldwide." }
    ];
    let currentWordIndex = 0;

    // Function to set the word, hint, and description
    function setWordAndHint() {
        const currentWord = wordsList[currentWordIndex];
        wordToGuess = currentWord.word;
        hintDiv.innerHTML = `<strong>Hint:</strong> ${currentWord.hint}`;
        generateInputRows(wordToGuess.length);
        updateProgressBar();
    }

    // Function to generate input rows based on word length
    function generateInputRows(wordLength) {
        board.innerHTML = ''; // Clear existing rows
        for (let i = 0; i < maxAttempts; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            for (let j = 0; j < wordLength; j++) {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = '1';
                input.classList.add('square');
                input.disabled = true;
                row.appendChild(input);
            }
            board.appendChild(row);
        }
        enableRow(0); // Enable the first row on initial setup
    }

    setWordAndHint();

    guessButton.addEventListener('click', makeGuess);
    nextButton.addEventListener('click', () => {
        currentWordIndex = (currentWordIndex + 1) % wordsList.length;
        resetGame();
        setWordAndHint();
    });

    function makeGuess() {
        const rowInputs = board.children[currentRow].getElementsByTagName('input');
        const guess = Array.from(rowInputs).map(input => input.value.toUpperCase()).join('');

        if (guess.length !== wordToGuess.length) {
            shakeRow(board.children[currentRow]);
            return;
        }

        for (let i = 0; i < guess.length; i++) {
            if (guess[i] === wordToGuess[i]) {
                rowInputs[i].classList.add('correct');
            } else if (wordToGuess.includes(guess[i])) {
                rowInputs[i].classList.add('present');
            } else {
                rowInputs[i].classList.add('absent');
            }
        }

        if (guess === wordToGuess) {
            showCompletionMessage(true);
            disableInput(rowInputs);  // Disable current row's input
        } else if (currentRow >= maxAttempts - 1) {
            showCompletionMessage(false);
            disableInput(rowInputs);  // Disable current row's input
        } else {
            currentRow++;
            enableRow(currentRow);
        }
    }

    function shakeRow(row) {
        row.classList.add('shake');
        setTimeout(() => {
            row.classList.remove('shake');
            focusOnNextEmptyInput(row); // Focus on the next empty input box after shaking
        }, 500);
    }

    function focusOnNextEmptyInput(row) {
        const inputs = row.getElementsByTagName('input');
        for (let input of inputs) {
            if (input.value === '') {
                input.focus();
                break;
            }
        }
    }

    function showCompletionMessage(isCorrect) {
        const currentWord = wordsList[currentWordIndex];
        if (isCorrect) {
            messageDiv.innerHTML = 'Congratulations, you guessed the word!';
        } else {
            messageDiv.innerHTML = `Sorry, you used all attempts! The word was ${wordToGuess}.`;
        }
        hintDiv.innerHTML += `<p><strong>Description:</strong> ${currentWord.description}</p>`;
        guessButton.disabled = true; // Disable the Guess button
        showButtons();
    }

    function showButtons() {
        nextButton.style.display = 'block';
    }

    function enableRow(rowIndex) {
        const rowInputs = board.children[rowIndex].getElementsByTagName('input');
        for (let input of rowInputs) {
            input.disabled = false;
        }
        setFocusToRow(rowIndex);
    }

    function setFocusToRow(rowIndex) {
        const rowInputs = board.children[rowIndex].getElementsByTagName('input');
        rowInputs[0].focus();
        for (let i = 0; i < rowInputs.length; i++) {
            rowInputs[i].addEventListener('input', function() {
                if (this.value.length === 1 && i < rowInputs.length - 1) {
                    rowInputs[i + 1].focus();
                }
            });

            rowInputs[i].addEventListener('keydown', function(event) {
                if (event.key === 'Backspace' && this.value === '') {
                    if (i > 0) {
                        rowInputs[i - 1].value = '';
                        rowInputs[i - 1].focus();
                    }
                }

                if (event.key === 'Enter') {
                    if (currentRow === Array.from(board.children).indexOf(this.parentNode)) {
                        makeGuess();
                    }
                }
            });
        }
    }

    function disableInput(rowInputs) {
        for (let input of rowInputs) {
            input.disabled = true;
        }
    }

    function updateProgressBar() {
        progressContainer.innerHTML = ''; // Clear existing segments
        for (let i = 0; i < wordsList.length; i++) {
            const segment = document.createElement('div');
            segment.classList.add('progress-segment');
            if (i < currentWordIndex + 1) {
                segment.classList.add('filled');
            }
            progressContainer.appendChild(segment);
        }
    }

    function resetGame() {
        const inputs = board.getElementsByTagName('input');
        for (let input of inputs) {
            input.value = '';
            input.classList.remove('correct', 'present', 'absent');
            input.disabled = true;
        }
        currentRow = 0;
        enableRow(currentRow);
        hintDiv.innerHTML = `<strong>Hint:</strong> ${wordsList[currentWordIndex].hint}`;
        messageDiv.innerHTML = '';
        nextButton.style.display = 'none';
        guessButton.disabled = false; // Re-enable the Guess button
        updateProgressBar(); // Update the progress bar when the game is reset
    }

    // Initial setup to focus on the first row and add key event listeners
    enableRow(currentRow);
    updateProgressBar(); // Initial update of the progress bar
});
