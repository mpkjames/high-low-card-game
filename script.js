// Two arrays to store suite and rank information
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

// Use 'suits' and 'ranks' to create a deck
let deck = [];
for (const suit of suits) {
    for (const rank of ranks) {
        deck.push(`${rank}-${suit}`);
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

// Shuffle the deck
shuffle(deck);

// Get button and card elements from game board
const knownCard = document.getElementById("known-card");
const unknownCard = document.getElementById("unknown-card");
const higherBtn = document.getElementById("higher-btn");
const lowerBtn = document.getElementById("lower-btn");
// A boolean value to see if the knownCard card has been drawn or not
let knownCardDrawn = false;

// Display the next card when the "Draw" button is clicked
knownCard.addEventListener("click", function () {
    if (!knownCardDrawn) {
        knownCard.classList.add("flip-animate");
        setTimeout(function () {
            knownCard.innerHTML = "<h3>" + getnextCard(deck) + "</h3>";
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
    if (knownCardDrawn) {
        higherBtn.classList.add("selected");
        lowerBtn.classList.remove("selected");
        unknownCard.classList.add("flippable");
    }
});
lowerBtn.addEventListener("click", function () {
    if (knownCardDrawn) {
        lowerBtn.classList.add("selected");
        higherBtn.classList.remove("selected");
        unknownCard.classList.add("flippable");
    }
});

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
