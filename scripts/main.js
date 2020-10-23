// Global Variables
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.wrapper')
  const scoreDisplay = document.getElementById('score')
  const width = 20;
  let score = 0;

  //layout grid;
  const layout = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,3,0,1,0,3,0,0,3,1,1,3,3,0,3,3,1,3,3,1,
    3,3,3,1,3,3,1,3,3,1,1,3,0,1,3,3,1,0,3,3,
    3,0,3,1,3,0,1,0,3,0,3,3,3,1,0,3,1,3,3,3,
    3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,
    1,0,3,1,3,0,3,3,3,0,3,3,3,3,3,0,3,0,3,1,
    1,3,3,3,3,3,1,3,3,3,3,3,3,1,3,3,3,1,3,1,
    1,1,1,3,3,1,1,1,2,2,2,2,1,1,1,1,3,3,4,1,
    1,4,3,3,1,1,1,1,2,2,2,2,1,1,1,3,0,1,1,1,
    1,3,1,3,3,3,0,1,1,1,1,1,1,1,3,3,3,3,3,1,
    0,3,3,0,3,1,3,1,3,0,3,1,0,1,3,1,0,0,3,3,
    3,0,3,3,3,1,3,1,3,3,3,1,3,1,3,1,3,3,3,3,
    1,1,1,3,3,1,3,1,3,1,3,1,3,3,3,3,3,1,1,1,
    1,3,3,3,3,0,3,3,3,1,3,3,3,3,1,3,3,3,3,1,
    1,0,1,3,3,1,3,0,3,1,0,3,1,0,1,3,3,1,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
  ]

  const squares = [];
  // Legend
  // 0 - fish
  // 1 - cobblestone
  // 2 - ocean ruin
  // 3 - empty
  // 4 - golden apple

  function createBoard() {
    for (let i = 0; i < layout.length; i++) {
      const square = document.createElement('div')
      grid.appendChild(square)
      squares.push(square)

      //add layout to the board
      if(layout[i] === 0) {
        squares[i].classList.add('fish')
      } else if (layout[i] === 1) {
        squares[i].classList.add('cobblestone')
      } else if (layout[i] === 2) {
        squares[i].classList.add('ocean-ruin')
      } else if (layout[i] === 4) {
        squares[i].classList.add('golden-apple')
      }
    }
  }
  createBoard()

  // Boat Starting Position
  let boatCurrentIndex = 219
  squares[boatCurrentIndex].classList.add('boat')

  //move boat
  function moveBoat(e) {
    squares[boatCurrentIndex].classList.remove('boat')
    switch(e.keyCode) {
      case 37: 
      case 65:
        if(
          boatCurrentIndex % width !== 0 &&
          !squares[boatCurrentIndex -1].classList.contains('cobblestone') &&
          !squares[boatCurrentIndex -1].classList.contains('ocean-ruin')
          )
        boatCurrentIndex -= 1
        if (squares[boatCurrentIndex -1] === squares[39]) {
          boatCurrentIndex = 59
        } else if (squares[boatCurrentIndex -1] === squares[59]) {
          boatCurrentIndex = 79
        } else if (squares[boatCurrentIndex -1] === squares[79]) {
          boatCurrentIndex = 99
        } else if (squares[boatCurrentIndex -1] === squares[199]) {
          boatCurrentIndex = 219
        } else if (squares[boatCurrentIndex -1] === squares[219]) {
          boatCurrentIndex = 239
        }
        break;
      case 38:
      case 87:
        if(
          boatCurrentIndex - width >= 0 &&
          !squares[boatCurrentIndex -width].classList.contains('cobblestone') &&
          !squares[boatCurrentIndex -width].classList.contains('ocean-ruin')
          ) 
        boatCurrentIndex -= width
        break
      case 39:
      case 68:
        if(
          boatCurrentIndex % width < width - 1 &&
          !squares[boatCurrentIndex +1].classList.contains('cobblestone')  &&
          !squares[boatCurrentIndex +1].classList.contains('ocean-ruin')
        )
        boatCurrentIndex += 1
        if (squares[boatCurrentIndex +1] === squares[60]) {
          boatCurrentIndex = 40
        } else if (squares[boatCurrentIndex +1] === squares[80]) {
          boatCurrentIndex = 60
        } else if (squares[boatCurrentIndex +1] === squares[100]) {
          boatCurrentIndex = 80
        } else if (squares[boatCurrentIndex +1] === squares[220]) {
          boatCurrentIndex = 200
        } else if (squares[boatCurrentIndex +1] === squares[240]) {
          boatCurrentIndex = 220
        }
        break
      case 40:
      case 83:
        if (
          boatCurrentIndex + width < width * width &&
          !squares[boatCurrentIndex +width].classList.contains('cobblestone')  &&
          !squares[boatCurrentIndex +width].classList.contains('ocean-ruin')
        )
        boatCurrentIndex += width
        break
    }
    squares[boatCurrentIndex].classList.add('boat')

    fishTaken();
    goldenAppleEaten();
    checkGameOver();
    checkForWin();
  }
  
  document.addEventListener('keyup', moveBoat)

  function fishTaken() {
    if (squares[boatCurrentIndex].classList.contains('fish')) {
      score++;
      scoreDisplay.innerHTML = score;
      squares[boatCurrentIndex].classList.remove('fish');var audio = new Audio('audio_file.mp3');
    }
  }

  function goldenAppleEaten() {
    if (squares[boatCurrentIndex].classList.contains('golden-apple')) {
      score += 10;
      drowneds.forEach(drowned => drowned.isScared = true)
      setTimeout(unScareDrowned, 10000)
      squares[boatCurrentIndex].classList.remove('golden-apple')
    }
  }

  function unScareDrowned() {
    drowneds.forEach(drowned => drowned.isScared = false)
  }

  function checkGameOver() {
    if (squares[boatCurrentIndex].classList.contains('drowned') &&
    !squares[boatCurrentIndex].classList.contains('scared-drowned')) {
      drowneds.forEach(drowned => clearInterval(drowned.timerId))
      document.removeEventListener('keyup', moveBoat)
      scoreDisplay.innerHTML = 'GAME OVER'
    }
  }

  function checkForWin() {
    if (score >= 100) {
      drowneds.forEach(drowned => clearInterval(drowned.timerId))
      document.removeEventListener('keyup', moveBoat)
      scoreDisplay.innerHTML = 'You Won'
    }
  }

  class Drowned {
    constructor(className, startIndex, speed) {
      this.className = className;
      this.startIndex = startIndex;
      this.speed = speed;
      this.currentIndex = startIndex;
      this.isScared = false;
      this.timerId = NaN;
    }
  }

  drowneds = [
    new Drowned('drowned-1', 150, 300),
    new Drowned('drowned-2', 151, 400),
    new Drowned('drowned-3', 169, 450),
    new Drowned('drowned-4', 170, 475),
  ]

  //Insert drowned to map
  drowneds.forEach(drowned => {
    squares[drowned.currentIndex].classList.add(drowned.className)
    squares[drowned.currentIndex].classList.add('drowned')
  });

  drowneds.forEach(drowned => moveDrowned(drowned))

  // Auto Move Drowned
  function moveDrowned(drowned) {
    const directions = [-1, +1, width, -width]
    let direction = directions[Math.floor(Math.random() * directions.length)]

    drowned.timerId = setInterval(function() {
      if (!squares[drowned.currentIndex + direction].classList.contains('drowned') && !squares[drowned.currentIndex + direction].classList.contains('cobblestone')) {
        squares[drowned.currentIndex].classList.remove(drowned.className)
        squares[drowned.currentIndex].classList.remove('drowned', 'scared-drowned')
        drowned.currentIndex += direction
        squares[drowned.currentIndex].classList.add(drowned.className, 'drowned')
      } else direction = directions[Math.floor(Math.random() * directions.length)]

      if (drowned.isScared) {
        squares[drowned.currentIndex].classList.add('scared-drowned')
      }

      if (drowned.isScared && squares[drowned.currentIndex].classList.contains('boat')) {
        squares[drowned.currentIndex].classList.remove(drowned.className, 'drowned', 'scared-drowned')
        drowned.currentIndex = drowned.startIndex
        score += 20
        squares[drowned.currentIndex].classList.add(drowned.className, 'drowned')
      }

    }, drowned.speed)
  }

})


