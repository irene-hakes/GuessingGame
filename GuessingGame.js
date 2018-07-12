function generateWinningNumber() {
    return number = Math.floor(Math.random() * 100 + 1);
}

function shuffle(array) {
    let m = array.length;
    let t;
    let i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
}

function Game() {
    this.winningNumber = generateWinningNumber();
    this.playersGuess = null;
    this.pastGuesses = [];
}

Game.prototype.difference = function() {
    return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess) {
    if(typeof guess !== 'number' || guess < 1 || guess > 100) {
        throw 'That is an invalid guess.'
    }
    this.playersGuess = guess;
    return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    if(this.winningNumber === this.playersGuess) {
        $('#hint, #submit').prop("disabled",true);
        $('#subtitle').text("Press the Reset button to play again!")
        return 'We have a winner!';
    }
    
    if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
        return 'Hey, you have already guessed that number, silly!';
    }
    
    this.pastGuesses.push(this.playersGuess);
    $('#guess-list li:nth-child(' + this.pastGuesses.length +')').text(this.playersGuess);
    if(this.pastGuesses.length === 5) {
        $('#hint, #submit').prop("ddisabled",true);
        $('#subtitle').text("Press the Reset button to play again!");
        return 'You Lose :(';
    }

    let diff = this.difference();
    if(this.isLower()) {
        $('#subtitle').text("Guess Higher!");
    }else {
        $('#subtitle').text("Guess Lower!");
    }
    if(diff < 10) {
        return `You're burning up!`;
    }

    if(diff < 25) {
        return `You're lukewarm.`;
    }

    if(diff < 50) {
        return `You're a bit chilly.`;
    }

    return `You're ice cold!`;
 }

Game.prototype.provideHint = function() {
    let hintArray = [this.winningNumber];
    while(hintArray.length < 3) {
        let hint = generateWinningNumber();
        if(hint !== this.winningNumber && this.pastGuesses.indexOf(hint) === -1) {
            hintArray.push(hint);
        }
    }
    return shuffle(hintArray);
}

function newGame() {
    return new Game();
}

function makeAGuess(game) {
    var guess = +$('#players-input').val();
    var result = game.playersGuessSubmission(guess);
    // $('.title').addClass('duringGame');
    if(result === `You're a bit chilly.` || result === `You're ice cold!`) {
        $('.title').addClass('duringGame-cold');
        $('.title, .duringGame-cold').text(result);
    }else if(result === `You're burning up!` || result === `You're lukewarm.`) {
        $('.title').addClass('duringGame-hot');
        $('.title, .duringGame-hot').text(result);
    }else {
        $('.title, .duringGame-hot').removeClass('duringGame-hot');
        $('.title, .duringGame-cold').removeClass('duringGame-cold');
        if(result = 'We have a winner!') {
            $('.title').addClass('winner');
            $('.title, .winner').text(result);
            $('#input-parent, #guesses').hide();
        }else {
            $('.title').text(result);
        }
    }

}

$(document).ready( function() {
    var game = new Game();
    $('#submit').click(function(e) {
        makeAGuess(game);
        $('#players-input').val("");
    })
    $('#players-input').keypress(function(event) {
        if( event.which == 13 ) {
            console.log('You hit enter!');
            makeAGuess(game);
            $('#players-input').val("");
        }
    })
    $('#hint').click(function() {
        var hints = game.provideHint();
        $('#subtitle').text(`One of these is the winning number: ${hints[0]}, ${hints[1]} or ${hints[2]}!`);
    })
    $('#reset').click(function() {
        game = new Game();
        $('.title').text('Play the Guessing Game!');
        $('.title, .duringGame-hot').removeClass('duringGame-hot');
        $('.title, .duringGame-cold').removeClass('duringGame-cold');
        $('.title, .winner').removeClass('winner');
        $('#subtitle').text('Guess a number between 1-100!');
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled", false);
        $('#input-parent, #guesses').show();
    })
})