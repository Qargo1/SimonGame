const greenBtn = $('.green');
const redBtn = $('.red');
const yellowBtn = $('.yellow');
const blueBtn = $('.blue');

// Звуки для кнопок
const sounds = {
    green: new Audio('sounds/green.mp3'),
    red: new Audio('sounds/red.mp3'),
    yellow: new Audio('sounds/yellow.mp3'),
    blue: new Audio('sounds/blue.mp3'),
    wrong: new Audio('sounds/wrong.mp3')
};

$(document).keypress(appInit);

btnDict = {
    0: greenBtn,
    1: redBtn,
    2: yellowBtn,
    3: blueBtn
};

let playerIsWinning = true;
let counter = 1;

function appInit() {
    if (playerIsWinning) {
        const gameLog = [];
        for (let i = 0; i < counter; i++) {
            const randInt = parseInt(Math.random() * 4);
            gameLog.push(['green', 'red', 'yellow', 'blue'][randInt]);
        }

        $('h1').text(`Level ${counter}`);
        console.log('gameLog: ' + gameLog);

        // Показываем последовательность кнопок с задержкой
        showSequence(gameLog);
    } else {
        $('h1').text('Game Over, Press Any Key to Restart');
        return;
    }
}

function showSequence(sequence) {
    let index = 0;

    function animateNext() {
        if (index >= sequence.length) {
            startListening(sequence); // Начинаем слушать клики игрока
            return;
        }

        const color = sequence[index];
        const button = btnDict[['green', 'red', 'yellow', 'blue'].indexOf(color)];

        // Анимация кнопки
        button.animate({ opacity: '0.5' }, 200, () => {
            button.animate({ opacity: '1' }, 200);
        });

        // Проигрываем звук
        sounds[color].currentTime = 0; // Сбрасываем звук на начало
        sounds[color].play();

        index++;
        setTimeout(animateNext, 800); // Задержка между анимациями (800 мс)
    }

    animateNext();
}

function startListening(sequence) {
    let counterClick = 0;

    // Удаляем старые обработчики событий
    $(document).off('click');

    // Добавляем новый обработчик событий
    $(document).on('click', (event) => {
        const clName = event.target.className.split(' ')[1];
        const currentLog = sequence[counterClick];

        if (clName === currentLog) {
            console.log('rightClick');
            counterClick += 1;

            // Проигрываем звук
            sounds[clName].currentTime = 0;
            sounds[clName].play();

            if (counterClick >= sequence.length) {
                $(document).off('click'); // Удаляем обработчик
                console.log('You have won - next round');
                counter += 1;
                setTimeout(appInit, 1000); // Переход к следующему раунду через 1 секунду
            }
        } else {
            console.log("clName: " + clName);
            console.log("currentLog: " + currentLog);
            console.log("counterClick: " + counterClick);
            console.log("sequence.length: " + sequence.length);
            console.log('GameEnd');
            $(document).off('click'); // Удаляем обработчик
            playerIsWinning = false;
            $('h1').text('Game Over, Press Any Key to Restart');
            sounds['wrong'].currentTime = 0;
            sounds['wrong'].play();
            playerIsWinning = true;
            counter = 1;
        }
    });
}