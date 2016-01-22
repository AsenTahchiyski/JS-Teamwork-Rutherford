// Constants
var WIDTH = 1220;
var HEIGHT = 800;
var OWNERS = {
    DECK: 'Deck',
    PLAYER_1: 'Player_1',
    PLAYER_2: 'Player_2',
    PLAYER_3: 'Player_3',
    PLAYER_4: 'Player_4',
    BACKUP_CARD: 'Backup_card'
};
var CARDS = {
    GUARD: {
        name: 'Guard',
        value: 1,
        quantity: 5,
        description: 'Name a non-Guard card and choose another player. If that player has that card, he or she is out of the round.'
    },
    PRIEST: {
        name: 'Priest',
        value: 2,
        quantity: 2,
        description: 'Look at another player\'s hand.'
    },
    BARON: {
        name: 'Baron',
        value: 3,
        quantity: 2,
        description: 'You and another player secretly compare hands. The player with the lower value is out of the round.'
    },
    HANDMAID: {
        name: 'Handmaid',
        value: 4,
        quantity: 2,
        description: 'Until your next turn, ignore all effects from other players\' actions.'
    },
    PRINCE: {
        name: 'Prince',
        value: 5,
        quantity: 2,
        description: 'Choose any player (including yourself) to discard his or her hand and draw a new card.'
    },
    KING: {value: 6, quantity: 1, description: 'Trade hands with another player of your choice.'},
    COUNTESS: {
        name: 'Countess',
        value: 7,
        quantity: 1,
        description: 'If you have this card and the King or Prince in your hand, you must discard this card.'
    },
    PRINCESS: {
        name: 'Princess',
        value: 8,
        quantity: 1,
        description: 'If you discard this card, you are out of the round.'
    }
};

var canvas, stage;
var mouseTarget;
var offset;
var update;
var deck, players;
var backupCard;


window.onload = function main() {
    init();
    tick();
};

// Initialization of game
function init() {
    // Create canvas on document
    canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'myCanvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    document.body.appendChild(canvas);

    //Create stage
    stage = new createjs.Stage(canvas);

    //Enable mouse over event
    stage.enableMouseOver(10);

    // Initialize deck - generate all 16 cards and shuffle them
    if (deck == null) {
        deck = shuffleDeck(generateDeck());
    }

    // Initialize players
    if (players == null) {
        var count = 4; // to be edited
        players = initializePlayers(count);
    }

    // Draw backup card - random card from deck
    backupCard = (getRandomCard(deck));
    backupCard.owner = OWNERS.BACKUP_CARD;

    render();
}

function stop() {
    createjs.Ticker.removeEventListener('tick', tick);
}

function getRandomCard(stack) {
    var cardIndex = Math.floor(Math.random() * stack.length);
    var card = stack[cardIndex];
    stack.splice(cardIndex, 1);
    return card;
}


function render() {
    players.forEach(function (player) {
        for (var i = 0; i < player.hand.length; i++) {
            player.hand[i].position.x += i * 50;
            addCardToBoard(player.hand[i]);
        }

    });
}


// Main elements
function Card(value, name, description, owner, position) {
    this.value = value;
    this.name = name;
    this.description = description;
    this.owner = owner;
    this.position = position;
}

Card.prototype.toString = function () {
    return '(' + this.value + ')' + this.name + ': ' + this.description;
};

function addCardToBoard(card) {
    var picture = 'resources/cardFaces/' + card.name.toLowerCase() + '.png';
    var image = new Image();
    image.src = picture;
    image.onload = handleImageLoad;//('onload', card);
}

function handleImageLoad(event) { //card
    console.log(event.target);
    var image = event.target;
    var bitmap;

    var container = new createjs.Container();
    stage.addChild(container);
    bitmap = new createjs.Bitmap(image);
    container.addChild(bitmap);
    bitmap.x = 0;//card.position.x;
    bitmap.y = 0;//card.position.y;
    bitmap.scale = 1;
    console.log(bitmap.x, bitmap.y);
    bitmap.name = 'card' + Math.floor(Math.random() * 100); //card.owner +
    bitmap.cursor = 'pointer';
    stage.update();
    bitmap.on('mousedown', function (evt) {
        this.parent.addChild(this);
        this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
    });

    bitmap.on('rollover', function (evt) {
        this.scaleX = this.scaleY = this.scale * 1.2;
        update = true;
    });

    bitmap.on('rollout', function (evt) {
        this.scaleX = this.scaleY = this.scale;
        update = true;
    });

    createjs.Ticker.addEventListener('tick', tick);
}

function tick(event) {
    if (update) {
        update = false; // only update once
        stage.update(event);
    }
}

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
}

function generateDeck() {
    var deck = [];
    for (var cardType in CARDS) {
        var type = CARDS[cardType];
        for (var i = 0; i < type.quantity; i++) {
            var card = new Card(type.value, type.name, type.description, OWNERS.DECK, new Position(0, 0));
            deck.push(card);
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
        var player = new Player('Player_' + i);
        var card = getCardFromDeck();
        card.owner = player.name;
        card.position = new Position(player.position.x, player.position.y);
        player.hand.push(card);
        players.push(player);
    }

    return players;
}

function givePlayerPositionByID(playerID) {
    if (playerID === 'Player_1') {
        return new Position(50, 20);
    } else if (playerID === 'Player_2') {
        return new Position(330, 20);
    } else if (playerID === 'Player_3') {
        return new Position(610, 20);
    } else {
        return new Position(890, 20);
    }
}

// GUI stuff

function drawText(currentCard, context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.font = '30pt Arial';
    //context.fillStyle = getLinearGradient(context);
    context.fillText(currentCard.toString(), 100, 500);
}

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
    return deck.pop();
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