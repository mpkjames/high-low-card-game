const newGameBtn = document.getElementById("new-game-btn");
let knownCardDrawn;
let unknownCardDrawn;
let currentKnown;
let currentUnknown;
let streak;

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
    console.log(card1Value);
    let card2Value = convertCard(card2);
    console.log(card2Value);
    if (
        (card1Value < card2Value && playerGuess === "higher-btn") ||
        (card1Value > card2Value && playerGuess === "lower-btn") ||
        card1Value === card2Value
    ) {
        handleWin();
    } else {
        console.log("You lose. Game Over.");
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
        discardPile.classList.remove("empty");
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
        }, 1000);
    }, 1000);
}

// Modal Functionality
function showModal(contentHTML) {
    modalContent.innerHTML = contentHTML;
    modal.classList.remove("hidden");
}

function hideModal() {
    modalContent.innerHTML = "";
    modal.classList.add("hidden");
}
// Show Rules
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
                                flipped. You must guess whther the card you
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
                                draw, the game is over. You have won 🎉
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
                    <div id="rules-close-btn">
                        <button id="close-rules">Close rules</button>
                    </div>
                </div>`);
});
// Add an event listener to the overlay to be able to use the button to close
modal.addEventListener("click", function (event) {
    if (event.target.id === "close-rules") {
        hideModal();
    }
});

// Run the start new game function on page load
startNewGame();

/*  START EMOJI ROTATION
    --------------------
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
