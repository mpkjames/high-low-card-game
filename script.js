const newGameBtn = document.getElementById("new-game-btn");
let knownCardDrawn;
let unknownCardDrawn;
let currentKnown;
let currentUnknown;
let streak;
let canViewDiscardPile;
let canViewActivePile;

// Get various elements from game board
const knownCard = document.getElementById("known-card");
const unknownCard = document.getElementById("unknown-card");
const higherBtn = document.getElementById("higher-btn");
const lowerBtn = document.getElementById("lower-btn");
const streakCounterContainer = document.getElementById("streak-counter");
const streakCounter = document.getElementById("streak-count-num");
const discardPile = document.getElementById("discard-cards");
const activePile = document.getElementById("active-cards");
const modal = document.getElementById("modal-overlay");
const rulesBtn = document.getElementById("rules-btn");
const modalContent = document.getElementById("modal-content");

// A function to start a new game (called automatically on page load)
function startNewGame() {
    // A boolean value to see if the knownCard card has been drawn or not
    knownCardDrawn = false;
    unknownCardDrawn = false;
    currentKnown = null;
    currentUnknown = null;
    streak = 0;
    discardDeck = [];
    canViewDiscardPile = false;
    canViewActivePile = false;
    createDeck();
    shuffle(deck);
    knownCard.innerHTML = "";
    knownCard.classList.add("card-back", "flippable");
    knownCard.classList.remove("flip-animate");
    unknownCard.innerHTML = "";
    unknownCard.classList.add("card-back");
    unknownCard.classList.remove("flip-animate", "flippable");
    higherBtn.classList.add("not-selectable");
    higherBtn.classList.remove("selected");
    lowerBtn.classList.add("not-selectable");
    lowerBtn.classList.remove("selected");
    streakCounter.innerHTML = streak + "!";
    discardPile.classList.add("empty", "inactive-pile");
    activePile.classList.add("inactive-pile");
    knownCard.classList.remove("slide-and-fade-out");
    unknownCard.classList.remove("slide-and-replace");
}

newGameBtn.addEventListener("click", function () {
    startNewGame();
});

// Two arrays to store suite and rank information, an empty array for the deck
const suits = ["♣️", "♦️", "♥️", "♠️"];
const ranks = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
];
let deck = [];
let discardDeck = [];

// Use 'suits' and 'ranks' to create a deck
function createDeck() {
    deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push(`${rank}-${suit}`);
        }
    }
}

/*  A function to shuffle a deck of cards, uses the Fisher-Yates shuffle
    [https://bost.ocks.org/mike/shuffle/]
*/
function shuffle(array) {
    // Get the last index in the array
    let currentIndex = array.length;
    // Repeat the loop while there are still cards to shuffle, (index decremented each iteraton)
    while (currentIndex != 0) {
        /*  Generate a random index
            Since .random() is between 0 and 1, multiplying by currentIndex will keep the new index
            within in the range of the array
            .floor() rounds down to the closest integer
        */
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // Swap the elements and current and random
        let tempElement = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempElement;
    }
}

// Display the next card when the "Draw" button is clicked
knownCard.addEventListener("click", function () {
    if (!knownCardDrawn) {
        currentKnown = getnextCard(deck);
        knownCard.classList.add("flip-animate");
        setTimeout(function () {
            knownCard.innerHTML = "<h3>" + currentKnown + "</h3>";
            knownCard.classList.remove("card-back", "flippable");
        }, 250);
        higherBtn.classList.remove("not-selectable");
        lowerBtn.classList.remove("not-selectable");
    }
    knownCardDrawn = true;
});

// A function to remove the last element from the deck array and return it
function getnextCard(deck) {
    return deck.pop();
}

// Make a selection of higher or lower
higherBtn.addEventListener("click", function () {
    if (knownCardDrawn && !unknownCardDrawn) {
        higherBtn.classList.add("selected");
        lowerBtn.classList.remove("selected");
        unknownCard.classList.add("flippable");
    }
});
lowerBtn.addEventListener("click", function () {
    if (knownCardDrawn && !unknownCardDrawn) {
        lowerBtn.classList.add("selected");
        higherBtn.classList.remove("selected");
        unknownCard.classList.add("flippable");
    }
});

// Reveal the unknown card
unknownCard.addEventListener("click", function () {
    // Check to see if a higher/lower option has been selected
    const higherLowerSelected = document.querySelector(".selected");
    if (higherLowerSelected == null) {
        return;
    }
    // If a higher/lower select has been made, reveal the unknown card
    if (knownCardDrawn && !unknownCardDrawn) {
        // Get the player's guess based on which button is selected
        let playerGuess = higherLowerSelected.id;
        // Disable the ability for the player to change guesses after the reveal
        if (playerGuess === "higher-btn") {
            lowerBtn.classList.add("not-selectable");
        } else {
            higherBtn.classList.add("not-selectable");
        }
        // Flip the card
        currentUnknown = getnextCard(deck);
        unknownCard.classList.add("flip-animate");
        setTimeout(function () {
            unknownCard.innerHTML = "<h3>" + currentUnknown + "</h3>";
            unknownCard.classList.remove("card-back", "flippable");
        }, 250);
        // Compare the values
        compareCards(currentKnown, currentUnknown, playerGuess);
        unknownCardDrawn = true;
    }
});

// convert the cards and compare
function convertCard(card) {
    if (card.split("-")[0] === "A") {
        return 14;
    }
    if (card.split("-")[0] === "K") {
        return 13;
    }
    if (card.split("-")[0] === "Q") {
        return 12;
    }
    if (card.split("-")[0] === "J") {
        return 11;
    }
    return parseInt(card.split("-")[0]);
}

function compareCards(card1, card2, playerGuess) {
    let card1Value = convertCard(card1);
    let card2Value = convertCard(card2);
    if (
        (card1Value < card2Value && playerGuess === "higher-btn") ||
        (card1Value > card2Value && playerGuess === "lower-btn") ||
        card1Value === card2Value
    ) {
        handleWin();
        // Check if discard pile is viewable

        // Check in active pile is viewable
    } else {
        setTimeout(function () {
            gameOverLose(streak);
        }, 1000);
    }
}

function handleWin() {
    streak++;
    streakCounterContainer.classList.add("update-bounce-animate");
    setTimeout(function () {
        streakCounter.innerHTML = streak + "!";
    }, 250);
    setTimeout(function () {
        streakCounterContainer.classList.remove("update-bounce-animate");
    }, 500);
    knownCard.classList.add("slide-and-fade-out");
    setTimeout(function () {
        discardDeck.push(currentKnown);
        unknownCard.classList.add("slide-and-replace");
        setTimeout(function () {
            currentKnown = currentUnknown;
            knownCard.innerHTML = "<h3>" + currentKnown + "</h3>";
            knownCard.classList.remove("flip-animate");
            knownCard.classList.remove("slide-and-fade-out");
            unknownCard.innerHTML = "";
            unknownCard.classList.add("card-back");
            unknownCard.classList.remove("flip-animate");
            higherBtn.classList.remove("not-selectable");
            higherBtn.classList.remove("selected");
            lowerBtn.classList.remove("not-selectable");
            lowerBtn.classList.remove("selected");
            unknownCard.classList.remove("slide-and-replace");
            knownCardDrawn = true;
            unknownCardDrawn = false;
            currentUnknown = null;
            // // Temporary placeholder for testing
            // canViewDiscardPile = true;
            // canViewActivePile = true;
            // Check whether the active/discard piles should be accessible or not
            canAccessDiscardPile();
            canAccessActivePile();
        }, 1000);
    }, 1000);
}

/*  VIEW DISCARD PILE
    -----------------
*/
// Functions to handle pile access called after each round
function canAccessDiscardPile() {
    if (canViewDiscardPile) {
        discardPile.classList.remove("inactive-pile");
    } else {
        discardPile.classList.add("inactive-pile");
    }
    if (discardDeck.length > 0) {
        discardPile.classList.remove("empty");
    } else {
        discardPile.classList.add("empty");
    }
}
function canAccessActivePile() {
    if (canViewActivePile) {
        activePile.classList.remove("inactive-pile");
    } else {
        activePile.classList.add("inactive-pile");
    }
    if (deck.length > 0) {
        activePile.classList.remove("empty");
    } else {
        activePile.classList.add("empty");
    }
}

discardPile.addEventListener("click", function () {
    if (!canViewDiscardPile) {
        return;
    } else {
        // For display pusposes, create a reversed COPY of the discard pile
        const reverseDiscardDeck = [...discardDeck].reverse();
        const cardsHTML = reverseDiscardDeck
            .map((card) => `<div class="card"><h3>${card}</h3></div>`)
            .join("");
        showModal(`<div id="show-pile-modal">
                        <div id="modal-header">
                            <h2>Discard Pile</h2>
                        </div>
                        <div id="card-viewer-container" class="discard">
                            ${cardsHTML}
                        </div>
                        <div id="modal-btn-row">
                            <button id="close-modal-btn">Close</button>
                        </div>
                    </div>`);
    }
});

activePile.addEventListener("click", function () {
    if (!canViewActivePile) {
        return;
    } else {
        // For display pusposes, create a reversed COPY of the discard pile
        const reverseActiveDeck = [...deck].reverse();
        const cardsHTML = reverseActiveDeck
            .map((card) => `<div class="card"><h3>${card}</h3></div>`)
            .join("");
        showModal(`<div id="show-pile-modal">
                        <div id="modal-header">
                            <h2>Active Deck</h2>
                        </div>
                        <div id="card-viewer-container">
                            ${cardsHTML}
                        </div>
                        <div id="modal-btn-row">
                            <button id="close-modal-btn">Close</button>
                        </div>
                    </div>`);
    }
});

/*  MODAL FUNCTIONALITY
    -------------------
*/
function showModal(contentHTML) {
    modalContent.innerHTML = contentHTML;
    modal.classList.remove("hidden");
}

function hideModal() {
    modalContent.innerHTML = "";
    modal.classList.add("hidden");
}

// Add an event listener for any buttons on the modal
modal.addEventListener("click", function (event) {
    if (event.target.id === "close-modal-btn") {
        hideModal();
    } else if (event.target.id === "game-over-btn") {
        hideModal();
        startNewGame();
    }
});

/*  SHOW RULES MODAL
    ----------------
*/
rulesBtn.addEventListener("click", function () {
    showModal(`<div id="show-rules-modal">
                    <div id="rules-header">
                        <h2>Game Rules</h2>
                    </div>
                    <div id="rules-text">
                        <p>Here are the rules to the game.</p>
                        <ul>
                            <li>
                                Two cards are drawn from your deck. One is
                                flipped. You must guess if the card you
                                cannot see is higher or lower than the one you
                                can see.
                            </li>
                            <li>
                                If you guess correctly, a new, face-down card is
                                drawn and the game continues. If you guess
                                incorrectly, it is game over.
                            </li>
                            <li>
                                When there are no more cards left in the deck to
                                draw, you have won 🎉
                            </li>
                            <li>
                                As you play, you may be presented with modifiers
                                that change the rules of the game. Your current
                                modifiers can be examined at any time.
                            </li>
                            <li>
                                In the absence of modifiers, the cards of a suit
                                are ordered (from smallest): 2, 3, 4, 5, 6, 7,
                                8, 9, 10, J, Q, K, A. If the revealed card is
                                equal to the current known card, either guess is
                                accepted as correct.
                            </li>
                        </ul>
                        <p>Good luck!</p>
                    </div>
                    <div id="modal-btn-row">
                        <button id="close-modal-btn">Close rules</button>
                    </div>
                </div>`);
});

/*  GAME OVER MODAL
    ---------------
*/
function gameOverLose(score) {
    showModal(`<div id="game-over-modal">
                    <div id="modal-header">
                        <h2>Game Over!</h2>
                    </div>
                    <div id="modal-text">
                        <p id="game-over-modal-text">You got a streak of <span id="game-over-streak">${score}</span> this run! Try to beat it on the next one.</p>
                    </div>
                    <div id="modal-btn-row">
                        <button id="game-over-btn">New Game</button>
                    </div>
                </div>`);
}

/*  START → MODIFIER SYSTEM
--------------------------------------------------------------------------------
*/
/* Define a modifier libary taht includes an id, title, description, type, 
image, and effect.
*/
const MODIFIER_LIBRARY = [
    {
        id: "increase_value_1",
        title: "+1 Value Boost",
        description:
            "Increase the value of the current active card by 1 immediately.",
        type: "instant",
        effect: "applyIncreaseValueBy1",
        image: "plus-one",
        weight: 10, // common
    },
    {
        id: "increase_value_2",
        title: "+2 Value Boost",
        description:
            "Increase the value of the current active card by 2 immediately.",
        type: "instant",
        effect: "applyIncreaseValueBy2",
        image: "plus-two",
        weight: 5, // uncommon
    },
    {
        id: "decrease_value_1",
        title: "-1 Value Reduction",
        description:
            "Decrease the value of the current active card by 1 immediately.",
        type: "instant",
        effect: "applyDecreaseValueBy1",
        image: "minus-one",
        weight: 10, // common
    },
    {
        id: "decrease_value_2",
        title: "-2 Value Reduction",
        description:
            "Decrease the value of the current active card by 1 immediately.",
        type: "instant",
        effect: "applyDecreaseValueBy2",
        image: "minus-two",
        weight: 5, // uncommon
    },
];
/*  END → MODIFIER SYSTEM
--------------------------------------------------------------------------------
*/

// Run the start new game function on page load
startNewGame();

/*  EMOJI ROTATION FOOTER
    ---------------------
    This feature is unrelated to the game logic. It cycles the emoji used in the footer of the
    page on page load and click
*/
// A function to get an emoji at random
function getEmoji() {
    const accaptableEmojis = [
        "♣️",
        "♦️",
        "♥️",
        "♠️",
        "🥰",
        "😱",
        "😈",
        "💖",
        "❤️‍🔥",
        "✌️",
        "🧚‍♂️",
        "🐈‍⬛",
        "🐶",
        "🍑",
        "☕️",
        "🌚",
        "🎉",
        "🕹",
        "🪓",
        "🪤",
        "🏳️‍🌈",
    ];
    return accaptableEmojis[
        Math.floor(Math.random() * accaptableEmojis.length)
    ];
}

// Get and update the footer span that contains the emoji on page load
const footerEmoji = document.getElementById("footer-emoji");
footerEmoji.innerHTML = getEmoji();

// Get and update emoji on click, compare to not repeat same emoji twice in a row
footerEmoji.addEventListener("click", function () {
    let newEmoji = getEmoji();
    while (newEmoji === footerEmoji.innerText) {
        newEmoji = getEmoji();
    }
    // Add emoji with a spin effect
    footerEmoji.classList.add("spin");
    // Delay the changeing of the emoji until the 0.5s animation is half way through
    setTimeout(function () {
        footerEmoji.innerHTML = newEmoji;
    }, 250);
});

// Remove the spin animation class when the animation is over
footerEmoji.addEventListener("animationend", function () {
    footerEmoji.classList.remove("spin");
});
