// Declarar variables
const applauseSound = new Audio('sounds/aplausos.mp3'); 

const cards = [
    'images/img1.jpg', 'images/img1.jpg',
    'images/img2.jpg', 'images/img2.jpg',
    'images/img3.jpg', 'images/img3.jpg',
    'images/img4.jpg', 'images/img4.jpg',
    'images/img5.jpg', 'images/img5.jpg',
    'images/img6.jpg', 'images/img6.jpg',
    'images/img7.jpg', 'images/img7.jpg',
    'images/img8.jpg', 'images/img8.jpg',
    'images/img9.jpg', 'images/img9.jpg',
    'images/img10.jpg', 'images/img10.jpg'
];

const levels = {
    easy: {
        cards: ['images/img1.jpg', 'images/img1.jpg','images/img2.jpg', 'images/img2.jpg', 'images/img3.jpg', 'images/img3.jpg'], // 3 pares
        chances: 10
    },
    medium: {
        cards: ['images/img1.jpg', 'images/img1.jpg','images/img2.jpg', 'images/img2.jpg', 'images/img3.jpg', 'images/img3.jpg' ,
                'images/img1.4jpg', 'images/img4.jpg','images/img5.jpg', 'images/img5.jpg', ], // 5 pares
        chances: 8
    },
    hard: {
        cards: ['images/img1.jpg', 'images/img1.jpg','images/img2.jpg', 'images/img2.jpg', 'images/img3.jpg', 'images/img3.jpg' ,
            'images/img1.4pg', 'images/img4.jpg','images/img5.jpg', 'images/img5.jpg', 'images/img6.jpg', 'images/img6.jpg' ,
            'images/img7.jpg', 'images/img7.jpg' ,  ], // 7 pares
        chances: 6
    }
};


// card es un array con las cartas del juego  
const gameBoard = document.getElementById('game');
// el tablero del juego  
const stats = document.getElementById('stats');  
// las estadisticas del juego, victoria derrota o chances que hacen falta
const restartButton = document.getElementById('restart');  
let cardValues = [];  
// Almacena los valores de las cartas seleccionadas temporalmente
let flippedCards = [];  
// Almancena el valor de las cartes que han sido seleccionadas en la ronda actuvas
let matchesFound = 0;  
// cuantos pares han sido encontrado
let chances = 6;  
// numero de oportunidades
let selectedLevel = 'easy'; // Nivel por defecto (puede cambiarse según el jugador)
let timer;  // Variable para el cronómetro  
let seconds = 0;  // Variable para almacenar los segundos  
let inactivityTimer;  // Temporizador de inactividad


function setLevel(level) {
    selectedLevel = level;
    const { cards: levelCards, chances: levelChances } = levels[level];
    cards.length = 0; // Vacía el arreglo global de cartas
    cards.push(...levelCards); // Llena el arreglo con las cartas del nivel seleccionado
    chances = levelChances; // Configura las oportunidades según el nivel
    createBoard(); // Regenera el tablero para aplicar los cambios
}


// esta funcion desordena las cartas 
function shuffle(array) {  
    for (let i = array.length - 1; i > 0; i--) {  
        const j = Math.floor(Math.random() * (i + 1));  
        [array[i], array[j]] = [array[j], array[i]];  
    }  
    return array;  
}  

function createBoard() {   
    gameBoard.innerHTML = ''; // Limpiar el tablero  
    const shuffledCards = shuffle(cards.slice());  
    for (let i = 0; i < shuffledCards.length; i++) {  
        const cardElement = document.createElement('div');  
        cardElement.classList.add('card');  
        cardElement.setAttribute('data-value', shuffledCards[i]);  
        cardElement.innerHTML = `  
            <div class="back"></div>  
            <div class="face">
             <img src="${shuffledCards[i]}" alt="Card image">
            </div>  
        `;  
        cardElement.addEventListener('click', flipCard);  
        gameBoard.appendChild(cardElement);  
    }  
    resetGame();  
}  

function resetGame() {
    cardValues = [];
    flippedCards = [];
    matchesFound = 0;
    seconds = 0;  // Reiniciar el tiempo  
    stats.innerText = `Chances restantes: ${chances} | Tiempo: 0s`;  
    clearInterval(timer);  // Limpiar cualquier cronómetro anterior  
    startTimer();  // Iniciar el cronómetro 
    resetInactivityTimer();  // Reiniciar temporizador de inactividad
}

function startTimer() {  
    timer = setInterval(() => {  
        seconds++;  
        stats.innerText = `Chances restantes: ${chances} | Tiempo: ${seconds}s`;  
    }, 1000);  
}  

function startInactivityTime() {
    inactivityTimer = setTimeout(() => {
        clearInterval(timer);
        stats.innerText = "¡Se ha detenido el juego por inactividad!";
        alert("¡Se ha detenido el juego por 20 segundos de inactividad!");
    }, 20000);  // Detiene el juego tras 20 segundos de inactividad
}

document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('click', resetInactivityTimer);

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);  // Limpia el temporizador de inactividad anterior
    startInactivityTime();  // Reinicia el temporizador de inactividad
}


function flipCard() {  
    if (flippedCards.length < 2 && !this.classList.contains('active')) {  
        this.classList.add('active');  
        flippedCards.push(this);  
        cardValues.push(this.getAttribute('data-value'));  

        if (flippedCards.length === 2) {  
            checkMatch();  
        }  
    }  
}  

function checkMatch() {  
    if (cardValues[0] === cardValues[1]) {  
        matchesFound++;  
        stats.innerText = `Chances restantes: ${chances}`;  
        resetFlippedCards(true);  // Mantener cartas coincidentes  
        checkWin();  
    } else {  
        chances--;  
        stats.innerText = `Chances restantes: ${chances}`;  
        setTimeout(() => {  
            resetFlippedCards(false); // Revertir cartas no coincidentes  
            if (chances === 0) {  
                stats.innerText = "¡Perdiste! Fin del juego.";  
            }  
        }, 1000);  
    }  
}  

function resetFlippedCards(isMatch) {  
    flippedCards.forEach(card => {  
        if (!isMatch) {  
            card.classList.remove('active');  
        }  
    });  
    flippedCards.length = 0;  
    cardValues.length = 0;  
}  

function triggerConfetti() {
    confetti({
        particleCount: 200,
        spread: 90,
        origin: { x: 0.5, y: 0.5 } // Centrado
    });
    applauseSound.play(); 
}
function checkWin() {  
    if (matchesFound === cards.length / 2) {  
        stats.innerText = `¡Ganaste! Has encontrado todos los pares. Tiempo total: ${seconds}s`;  
        clearInterval(timer);  // Detener el cronómetro  
        triggerConfetti();  // Iniciar el efecto de confeti al ganar
    }  
}

// Añadir evento al botón de reinicio  
restartButton.addEventListener('click', () => {  
    createBoard();  
    stats.innerText = '¡El juego ha comenzado! Encuentra los pares.';  
});  

// Crear el tablero al cargar la página  
createBoard();


