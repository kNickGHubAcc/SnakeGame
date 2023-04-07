const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;


let highScore = localStorage.getItem("high-score") || 0;  //Το localStorage είναι ένας μόνιμος χώρος αποθήκευσης
highScoreElement.innerText = `High Score: ${highScore}`;

//Το φιδάκι αλλάζει directions όταν κλικάρω στα βελάκια
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if (gameOver)    //Αν η gameOver είναι true, δηλαδή αν το φιδάκι πέσει σε τοίχο
    {
        return handleGameOver();
    }
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;     //Το food είναι div με διαστάσεις foodX και foodY

    if (snakeX === foodX && snakeY === foodY) {    //Αν το φιδάκι φάει το food
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);    //Το food που φαγώθηκε προστίθεται στο σώμα του φιδιού (που είναι πίνακας)
        score++;
        highScore = score >= highScore ? score : highScore;    // Αν το score > high score τότε high score = score
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Update το Snake Head
    snakeX += velocityX;
    snakeY += velocityY;

    // Shifthing κάθε κομματιού του φιδιού κατά μια θέση προς τα εμπρός
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];    //Η στάνταρ τοποθέτηση του αρχικού φιδιού (1 κουτάκι)

    //Αν τo φιδάκι πέσει πάνω σε τοίχο
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    //Προσθήκη ενός div για κάθε κομμάτι σώματος του φιδιού
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        //Αν το φίδι πέσει πάνω στο σώμα του
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;   //Αρχική εμφάνιση φιδιού και food στο playboard
}

const handleGameOver = () => {
    clearInterval(setIntervalId);    //Σταματάει να εκτελείται η initGame
    alert("Game Over! Press OK to replay...");
    location.reload();    //Κάνει reload-refresh το game
}

//Κάθε φορά το food τοποθετείται τυχαία ανάλογα με τις τιμές που παίρνουν τα foodX και foodY
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;    //'Αξονας x = 0, αφού κινούμαι στον y
        velocityY = -1;   //Κινούμαι ανάποδα στον y, δηλαδή προς τα πάνω, για αυτό ορίζω -1
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;   //Κινούμαι ανάποδα στον x, δηλαδή προς τα αριστερά, για αυτό ορίζω -1
        velocityY = 0;    //Άξονας y=0, αφού κινούμαι στον x
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);    //Η initGame εκτελείται με καθυστέρηση 100ms
document.addEventListener("keyup", changeDirection);   //Κάθε φορά που πατιέται βελάκι εκτελείται η changeDirection()
