//(function () {
var canvas, context;
var deck, players, discardedPile;


window.onload = function main() {
    canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'board');
    context = canvas.getContext('2d');
    canvas.width = 1220;
    canvas.height = 800;
    document.body.appendChild(canvas);
// Background image
//    var bgReady = false;
//    var bgImage = new Image();
//    bgImage.onload = function () {
//        bgReady = true;
//    };
//    bgImage.src = 'resources/background.jpg';

    canvas.addEventListener('mousedown', mouseDown)

    init();
    tick();
};

// Initialization of game
function init() {
    if (deck == null) {
        deck = shuffleDeck(generateDeck());
    }

    if (players == null) {
        var count = 4; // to be edited
        players = initializePlayers(count);
    }

    this.discardedPile = [];
    this.discardedPile.push(getCardFromDeck());
    // initializations here
}

function tick() {
    window.requestAnimationFrame(tick);

    update();
    render();
}

function update() {
    // Other updates here
    //checkForWinner();
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    //if (bgReady) {
    //    context.drawImage(bgImage, 0, 0)
    //}
    //for (var i = players.length; i--;) {
    //    //players[i].update();
    //    players[i].hand.forEach(function (card) {
    //        if (!card.isDrawn) {
    //            card.isDrawn = true;
    //            drawCard(card, players[i]);
    //        }
    //    });
    //}
    // render here
    players.forEach(function (player) {
        player.hand.forEach(function (card) {
            context.drawImage(card.image, player.position.x, player.position.y);
        });

    });
}

function mouseDown(evt) {
    var el = evt.target;
    var px = evt.clientX - el.offsetLeft;
    var py = evt.clientY - el.offsetTop;
    //console.log(el.offsetLeft, el.offsetTop);
    //console.log(px, py)
    if (py % 120 >= 20 && py % 120 >= 20) {
        var idx = Math.floor(px / 120);
        idx += Math.floor(py / 120) * 3;
        //if (players[idx].hasData()) {
        //    return;
        //}
        //players[idx].hand[].flip();


    }

}

// Main elements

function Card(value, name, qty, description) {
    this.value = value;
    this.name = name;
    this.qty = qty;
    this.picture = 'resources/cardFaces/' + this.name.toLowerCase() + '.png';
    this.description = description;
    this.isReady = false;

    this.image = new Image();
    // this is not ok
    this.image.onload = function () {
        this.isReady = true;
    };
    this.image.src = this.picture;
    //this.sound = 'resources/cardSounds/' + this.name.toLowerCase() + '.wav';
}

Card.prototype.toString = function () {
    return '(' + this.value + ')' + this.name + ': ' + this.description;
};

function Position(x, y) {
    this.x = x;
    this.y = y;
}

function Player(name) {
    this.name = name;
    this.hand = [];
    this.discardPile = [];
    this.points = 0;
    this.isAlive = true;
    this.isProtected = false;
    this.enemyHands = {};
    this.position = givePlayerPositionByID(name);
    //console.log(position);
}

function generateDeck() {
    var guard = new Card(1, 'Guard', 5, 'Name a non-Guard card and choose another player. If that player has that card, he or she is out of the round.');
    var priest = new Card(2, 'Priest', 2, 'Look at another player\'s hand.', 'resources/cardFaces/priest.png');
    var baron = new Card(3, 'Baron', 2, 'You and another player secretly compare hands. The player with the lower value is out of the round.');
    var handmaid = new Card(4, 'Handmaid', 2, 'Until your next turn, ignore all effects from other players\' actions.');
    var prince = new Card(5, 'Prince', 2, 'Choose any player (including yourself) to discard his or her hand and draw a new card.');
    var king = new Card(6, 'King', 1, 'Trade hands with another player of your choice.');
    var countess = new Card(7, 'Countess', 1, 'If you have this card and the King or Prince in your hand, you must discard this card.');
    var princess = new Card(8, 'Princess', 1, 'If you discard this card, you are out of the round.');
    var allCardTypes = [guard, priest, baron, handmaid, prince, king, countess, princess];
    var deck = [];
    for (var card = 0; card < allCardTypes.length; card++) {
        for (var i = 0; i < allCardTypes[card].qty; i++) {
            deck.push(allCardTypes[card]);
        }
    }

    return deck;
}

function shuffleDeck(deck) {
    var i = deck.length, j, tempi, tempj;
    if (i === 0) return false;
    while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        tempi = deck[i];
        tempj = deck[j];
        deck[i] = tempj;
        deck[j] = tempi;
    }

    return deck;
}

function initializePlayers(count) {
    players = [];
    for (var i = 1; i <= count; i++) {
        var player = new Player('Player ' + i);
        player.hand.push(getCardFromDeck());
        players.push(player);
    }

    return players;
}

function givePlayerPositionByID(playerID) {
    if (playerID === 'Player 1') {
        return new Position(50, 20);
    } else if (playerID === 'Player 2') {
        return new Position(330, 20);
    } else if (playerID === 'Player 3') {
        return new Position(610, 20);
    } else {
        return new Position(890, 20);
    }
}

function getRandomCard(stack) {
    var cardIndex = Math.floor(Math.random() * stack.length);
    var card = stack[cardIndex];
    stack.splice(cardIndex, 1);
    return card;
} // this is not used

// GUI stuff

function drawText(currentCard, context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.font = '30pt Arial';
    //context.fillStyle = getLinearGradient(context);
    context.fillText(currentCard.toString(), 100, 500);
}

//function drawCard(currentCard, player) {
//    if (Modernizr.canvas) {
//          if (context) {
//            //var currentCard = drawRandomCard();
//            if (currentCard) {
//                var currentImage = new Image();
//                currentImage.onload = function () {
//
//                    ctx.drawImage(currentImage, 0, 0, 157, 114);
//                };
//                currentImage.src = currentCard.picture;
//                //playSound(currentCard.sound);
//                drawText(currentCard, ctx);
//                //alert(currentCard.toString());
//            }
//        }
//    } else {
//        alert('Canvas is not supported');
//    }
//}

//function playSound(soundResource) {
//    if (soundResource) {
//        var currentAudio = new Audio();
//        currentAudio.src = soundResource;
//        currentAudio.play();
//    }
//}

//---- main game logic ----//

function getDiscardPile(players) {
    var pile = [];
    players.forEach(function (p) {
        p.discardPile.forEach(function (c) {
            pile.push(c);
        });
    });

    return pile;
}

function getCardFromDeck() {
    var topCard = deck.pop();
    return topCard;
}

function playGuard(attacker, target) {
    var guess;
    var discardPile = getDiscardPile(players);
    var possibleCards = getPossibleEnemyCards(discardPile, attacker.hand);
    var somethingWrongCounter = 0;
    do {
        if (target === undefined) { // no useful action
            console.log('no target, Guard is drunk');
            return;
        }

        if (attacker.enemyHands[target.name] != undefined && attacker.enemyHands[target.name].length > 0) {
            guess = Math.floor(Math.random() * (attacker.enemyHands[target.name].length - 1)); // random so far
        } else {
            guess = Math.floor(Math.random() * (possibleCards.length - 1));
        }

        // check if only guards are left
        var totalGuards = 0;
        possibleCards.forEach(function (c) {
            if (c.value == 1) {
                totalGuards++;
            }
        });
        if (totalGuards == possibleCards.length) {
            return;
        }
        if (isNaN(guess) || possibleCards[guess] == undefined) {
            console.log('!-- guess = NaN || possibleCards[guess] == undefined');
            return;
        }

        somethingWrongCounter++;
        if (somethingWrongCounter > 15) {
            possibleCards.sort(function (a, b) {
                return a.value > b.value;
            });
            guess = possibleCards.length - 1;
        }
    } while (possibleCards[guess].value == 1);

    if (guess == target.hand[0].value) {
        target.isAlive = false;
        console.log(target.name + ' is out of the round');
    } else {
        console.log(attacker.name + ' guessed ' + possibleCards[guess].name + ', not correct');
    }

    return true;
}

function playPriest(attacker, target) {
    var enemyCard = target.hand[0];
    attacker.enemyHands[target.name] = enemyCard;
    console.log(attacker.name + ' now knows the card of ' + target.name);
    return true;
}

function playBaron(attacker, target) {
    var attackerCard = attacker.hand[0];
    var targetCard = target.hand[0];
    if (attackerCard.value > targetCard.value) {
        target.isAlive = false;
        console.log(target.name + ' is out of the round');
    } else if (attackerCard.value < targetCard.value) {
        attacker.isAlive = false;
        console.log(attacker.name + ' is out of the round');
    } else {     // if they are equal nothing happens
        console.log(attacker.name + ' has the same card as ' + target.name);
    }
    return true;
}

function playHandmaid(player) {
    player.isProtected = true;
    console.log(player.name + ' is now protected until his/her next turn');
    return true;
}

function playPrince(target, deck) {
    var discarded = target.hand.pop();
    target.discardPile.push(discarded);
    if (discarded.value === 8) {
        target.isAlive = false;
        console.log(target.name + ' dropped the princess, bye-bye');
    } else {
        target.hand.push(getRandomCard(deck));
        console.log(target.name + ' discards his/her card and draws another');
    }

    return true;
}

function playKing(attacker, target) {
    var cardToGive = attacker.hand.pop();
    attacker.hand.push(target.hand.pop());
    target.hand.push(cardToGive);
    console.log(attacker.name + ' swaps hand with ' + target.name);
    return true;
}

function playCountess() {
    console.log('guess why?');
    return true;
}

function playPrincess(player) {
    player.isAlive = false;
    console.log(player.name + ' dropped the princess, bye-bye');
    return true;
}