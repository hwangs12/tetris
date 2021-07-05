document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const width = 10
    const ScoreDisplay = document.querySelector('#score')
    const StartBtn = document.querySelector('#start-button')
    let nextRandom = Math.floor(Math.random()*4)
    let timerId
    let score = 0
    const colors = [
        'orange',
        'red', 
        'purple',
        'green', 
        'blue'
    ]

    console.log(squares)

    //The Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2], 
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [width*2, width+1, width*2+1, width+2],
        [0, width, width+1, width*2+1],
        [width*2, width+1, width*2+1, width+2],
        [0, width, width+1, width*2+1]
    ]

    const tTetromino = [
        [width, 1, width+1, width+2],
        [1, width+1, width*2+1, width+2],
        [width, width+1, width*2+1, width+2],
        [width, 1, width+1, width*2+1]
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominoes = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino]

    let randomPosition = Math.floor(Math.random() * 7)


    //randomly select a Tetromino and its first rotation
    let randomShape = Math.floor(Math.random()*theTetrominoes.length)
    let randomRotation = Math.floor(Math.random()*4)
    let current = theTetrominoes[randomShape][randomRotation]
    

    //draw the first rotation in the first tetromino
    function draw() {
        current.forEach(index => {
            squares[randomPosition + index].classList.add('tetromino')
            squares[randomPosition + index].style.backgroundColor = colors[randomShape]
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[randomPosition + index].classList.remove('tetromino')
            squares[randomPosition + index].style.backgroundColor = ''
        })
    }

    //make the tetromino move down every second
    // timerId = setInterval(moveDown, 1000)

    //assign functions to keycodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        } else if (e.keyCode === 38) {
            rotate()
        }
    }

    document.addEventListener('keydown', control)

    //move down function
    function moveDown() {
        undraw()
        randomPosition += width
        draw()
        freeze()
    }

    //stop the block when they hit the floor
    function freeze() {
        if(current.some(index => squares[randomPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[randomPosition + index]. classList.add('taken'))
            //start a new tetromino falling
            randomShape = nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            current = theTetrominoes[randomShape][randomRotation]
            randomPosition = Math.floor(Math.random() * 7)
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    //move the tetromino left, unless is at the edge or there is a blockage
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (randomPosition + index) % width == 0)

        if (!isAtLeftEdge) {
            randomPosition -= 1
        }

        if (current.some(index => squares[randomPosition + index].classList.contains('taken'))) {
            randomPosition += 1
        }

        draw()
    }

    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (randomPosition + index) % width == 9)

        if (!isAtRightEdge) {
            randomPosition += 1
        }

        if (current.some(index => squares[randomPosition + index].classList.contains('taken'))) {
            randomPosition -= 1
        }

        draw()
    }

    function rotate() {
        undraw()
        randomRotation += 1
        if (randomRotation == 4) {
            randomRotation = 0
        }
        current = theTetrominoes[randomShape][randomRotation]
        draw()
    }

    //show up-next tetromino in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0
    

    //the Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0, displayWidth, displayWidth+1, displayWidth*2+1],
        [1, displayWidth, displayWidth+1, displayWidth+2],
        [0, 1, displayWidth, displayWidth+1],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
    ]

    //display the shape in the mini-grid display
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    //add functionality to the button
    StartBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })

    //remove row from our grid
    //increase score to score tally
    //add a new row 

    //add score
    function addScore() {
        for (let i=0; i<199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                ScoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width) 
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    //game over
    function gameOver() {
        if (current.some(index => squares[randomPosition + index].classList.contains('taken'))) {
            ScoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }




})