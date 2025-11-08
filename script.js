const newGameBtn = document.getElementById("new-game-btn");
let knownCardDrawn;
let unknownCardDrawn;
let currentKnown;
let currentUnknown;
let streak;
let canViewDiscardPile;
let canViewActivePile;
let activeTrumpSuit;
let isGamePaused;

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
const modifierDrawer = document.getElementById("modifier-drawer");
const modifierCloseBtn = document.getElementById("close-modifier-btn");
const modifierChoicesContainer = document.getElementById(
    "modifier-choices-container"
);
const modifierToolTip = document.getElementById("modifier-tooltip");

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
    activeTrumpSuit = null;
    isGamePaused = false;
    createDeck();
    shuffle(deck);
    knownCard.innerHTML = "";
    knownCard.classList.add("card-back", "flippable");
    knownCard.classList.remove("flip-animate");
    unknownCard.innerHTML = "";
    unknownCard.classList.add("card-back");
    unknownCard.classList.remove("flip-animate", "flippable", "inactive-pile");
    higherBtn.classList.add("not-selectable");
    higherBtn.classList.remove("selected");
    lowerBtn.classList.add("not-selectable");
    lowerBtn.classList.remove("selected");
    streakCounter.innerHTML = streak + "!";
    discardPile.classList.add("empty", "inactive-pile");
    activePile.classList.add("inactive-pile");
    knownCard.classList.remove("slide-and-fade-out");
    unknownCard.classList.remove("slide-and-replace");
    modifierDrawer.classList.remove("is-visible");
}
function pauseGame() {
    knownCard.classList.remove("flippable");
    unknownCard.classList.remove("flippable");
    unknownCard.classList.add("inactive-pile");
    higherBtn.classList.add("not-selectable");
    lowerBtn.classList.add("not-selectable");
    isGamePaused = true;
}
function resumeGame() {
    if (knownCardDrawn) {
        higherBtn.classList.remove("not-selectable");
        lowerBtn.classList.remove("not-selectable");
    }
    if (!knownCardDrawn) {
        knownCard.classList.add("flippable");
    } else if (
        knownCardDrawn &&
        !unknownCardDrawn &&
        document.querySelector(".selected")
    ) {
        unknownCard.classList.add("flippable");
    }
    unknownCard.classList.remove("inactive-pile");
    isGamePaused = false;
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
    if (isGamePaused) {
        return;
    }
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
    if (isGamePaused) {
        return;
    }
    if (knownCardDrawn && !unknownCardDrawn) {
        higherBtn.classList.add("selected");
        lowerBtn.classList.remove("selected");
        unknownCard.classList.add("flippable");
    }
});
lowerBtn.addEventListener("click", function () {
    if (isGamePaused) {
        return;
    }
    if (knownCardDrawn && !unknownCardDrawn) {
        lowerBtn.classList.add("selected");
        higherBtn.classList.remove("selected");
        unknownCard.classList.add("flippable");
    }
});

// Reveal the unknown card
unknownCard.addEventListener("click", function () {
    if (isGamePaused) {
        return;
    }
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
    let trumpSuitDecidedRoundOutcome = false;
    // Handle trump suit modifiers
    if (activeTrumpSuit != null) {
        card1Suit = card1.split("-")[1];
        card2Suit = card2.split("-")[1];
        if (
            (card1Suit === activeTrumpSuit &&
                card2Suit != activeTrumpSuit &&
                playerGuess === "lower-btn") ||
            (card2Suit === activeTrumpSuit &&
                card1Suit != activeTrumpSuit &&
                playerGuess === "higher-btn")
        ) {
            handleWin();
            trumpSuitDecidedRoundOutcome = true;
        } else if (
            (card1Suit === activeTrumpSuit &&
                card2Suit != activeTrumpSuit &&
                playerGuess === "higher-btn") ||
            (card2Suit === activeTrumpSuit &&
                card1Suit != activeTrumpSuit &&
                playerGuess === "lower-btn")
        ) {
            setTimeout(function () {
                gameOverLose(streak);
            }, 1000);
            trumpSuitDecidedRoundOutcome = true;
        }
    }
    if (!trumpSuitDecidedRoundOutcome) {
        if (
            (card1Value < card2Value && playerGuess === "higher-btn") ||
            (card1Value > card2Value && playerGuess === "lower-btn") ||
            card1Value === card2Value
        ) {
            handleWin();
        } else {
            setTimeout(function () {
                gameOverLose(streak);
            }, 1000);
        }
    }
    activeTrumpSuit = null;
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
            showModifierSelection();
            pauseGame();
            // // Temporary placeholder for testing
            canViewDiscardPile = true;
            canViewActivePile = true;
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
            "Increase the value of the current active card by 1 immediately if value is not an ace or face card.",
        type: "instant",
        effect: "applyIncreaseValueBy1",
        image: "elixir",
        weight: 10, // common
    },
    {
        id: "increase_value_2",
        title: "+2 Value Boost",
        description:
            "Increase the value of the current active card by 2 immediately if value is not an ace or face card.",
        type: "instant",
        effect: "applyIncreaseValueBy2",
        image: "elixir",
        weight: 5, // uncommon
    },
    {
        id: "increase_value_3",
        title: "+3 Value Boost",
        description:
            "Increase the value of the current active card by 3 immediately if value is not an ace or face card.",
        type: "instant",
        effect: "applyIncreaseValueBy3",
        image: "elixir",
        weight: 2, // rare
    },
    {
        id: "increase_value_5",
        title: "+5 Value Boost",
        description:
            "Increase the value of the current active card by 5 immediately if value is not an ace or face card.",
        type: "instant",
        effect: "applyIncreaseValueBy5",
        image: "elixir",
        weight: 1, // super rare
    },
    {
        id: "decrease_value_1",
        title: "-1 Value Reduction",
        description:
            "Decrease the value of the current active card by 1 immediately if value is not an ace or face card.",
        type: "instant",
        effect: "applyDecreaseValueBy1",
        image: "axe",
        weight: 10, // common
    },
    {
        id: "decrease_value_2",
        title: "-2 Value Reduction",
        description:
            "Decrease the value of the current active card by 2 immediately if value is not an ace or face card.",
        type: "instant",
        effect: "applyDecreaseValueBy2",
        image: "axe",
        weight: 5, // uncommon
    },
    {
        id: "decrease_value_3",
        title: "-3 Value Reduction",
        description:
            "Decrease the value of the current active card by 3 immediately if value is not an ace or face card.",
        type: "instant",
        effect: "applyDecreaseValueBy3",
        image: "axe",
        weight: 2, // rare
    },
    {
        id: "decrease_value_5",
        title: "-5 Value Reduction",
        description:
            "Decrease the value of the current active card by 5 immediately if value is not an ace or face card.",
        type: "instant",
        effect: "applyDecreaseValueBy5",
        image: "axe",
        weight: 1, // super rare
    },
    {
        id: "swap_with_discard",
        title: "Discard Pile Swap",
        description:
            "Swap the currently active card with a randomly chosen card from your discard pile. No effect if empty.",
        type: "instant",
        effect: "applySwapWithDiscard",
        image: "signpost",
        weight: 2, // uncommon
    },
    {
        id: "swap_with_active",
        title: "Re-roll",
        description:
            "Swap the currently active card with a randomly chosen card from your active pile. No effect if empty.",
        type: "instant",
        effect: "applySwapWithActive",
        image: "dices",
        weight: 5, // rare
    },
    {
        id: "set_trump_hearts",
        title: "Trump Suit: ♥️",
        description:
            "Any heart card for the next round is higher than any non-heart card, regardless of rank.",
        type: "round",
        effect: "applyTrumpHearts",
        image: "level-up",
        weight: 2, // rare
    },
    {
        id: "set_trump_diamonds",
        title: "Trump Suit: ♦️",
        description:
            "Any diamond card for the next round is higher than any non-diamond card, regardless of rank.",
        type: "round",
        effect: "applyTrumpDiamonds",
        image: "level-up",
        weight: 2, // rare
    },
    {
        id: "set_trump_clubs",
        title: "Trump Suit: ♣️",
        description:
            "Any club card for the next round is higher than any non-club card, regardless of rank.",
        type: "round",
        effect: "applyTrumpClubs",
        image: "level-up",
        weight: 2, // rare
    },
    {
        id: "set_trump_spades",
        title: "Trump Suit: ♠️",
        description:
            "Any spade card for the next round is higher than any non-spade card, regardless of rank.",
        type: "round",
        effect: "applyTrumpSpades",
        image: "level-up",
        weight: 2, // rare
    },
];
function showModifierSelection() {
    const choice1 = getRandomModifier();
    let choice2 = getRandomModifier();
    let choice3 = getRandomModifier();
    while (choice2.id === choice1.id) {
        choice2 = getRandomModifier();
    }
    while (choice3.id === choice1.id || choice3.id === choice2.id) {
        choice3 = getRandomModifier();
    }
    const choices = [choice1, choice2, choice3];
    const modifiersHTML = choices
        .map((choice) => {
            const rarity = getRarityTier(choice.weight);
            return `
                <button class="modifier-choice ${rarity.className}" data-modifier-id="${choice.id}" data-modifier-description="${choice.description}">
                    <img src="images/${choice.image}.png" alt="${choice.title}">
                    <h3>${choice.title}</h3>
                    <p class="rarity-label">${rarity.label}</p>
                </button>
                `;
        })
        .join("");
    modifierChoicesContainer.innerHTML = `
            ${modifiersHTML}
        `;
    modifierDrawer.classList.add("is-visible");
}
function getRandomModifier() {
    let totalWeight = 0;
    for (const modifier of MODIFIER_LIBRARY) {
        totalWeight += modifier.weight;
    }
    let randomNum = Math.random() * totalWeight;
    for (const modifier of MODIFIER_LIBRARY) {
        randomNum -= modifier.weight;
        if (randomNum <= 0) {
            return modifier;
        }
    }
}
function applyModifier(id) {
    const modifier = MODIFIER_LIBRARY.find((m) => m.id === id);
    if (!modifier) {
        return;
    }
    switch (modifier.effect) {
        case "applyIncreaseValueBy1":
            applyValueModifier(1);
            break;
        case "applyIncreaseValueBy2":
            applyValueModifier(2);
            break;
        case "applyIncreaseValueBy3":
            applyValueModifier(3);
            break;
        case "applyIncreaseValueBy5":
            applyValueModifier(5);
            break;
        case "applyDecreaseValueBy1":
            applyValueModifier(-1);
            break;
        case "applyDecreaseValueBy2":
            applyValueModifier(-2);
            break;
        case "applyDecreaseValueBy3":
            applyValueModifier(-3);
            break;
        case "applyDecreaseValueBy5":
            applyValueModifier(-5);
            break;
        case "applySwapWithDiscard":
            applySwapWithDiscard();
            break;
        case "applySwapWithActive":
            applySwapWithActive();
            break;
        case "applyTrumpHearts":
            activeTrumpSuit = "♥️";
            break;
        case "applyTrumpDiamonds":
            activeTrumpSuit = "♦️";
            break;
        case "applyTrumpClubs":
            activeTrumpSuit = "♣️";
            break;
        case "applyTrumpSpades":
            activeTrumpSuit = "♠️";
            break;
        default:
            console.log("Unknown modifier effect: ", modifier.effect);
    }
    hideModifierDrawer();
}
function getRarityTier(weight) {
    if (weight >= 10) {
        return { label: "Common", className: "rarity-common" };
    } else if (weight >= 5) {
        return { label: "Uncommon", className: "rarity-uncommon" };
    } else if (weight >= 2) {
        return { label: "Rare", className: "rarity-rare" };
    } else {
        return { label: "Super Rare", className: "rarity-super-rare" };
    }
}
function convertValueToRank(value) {
    if (value > 14) value = 14;
    if (value < 2) value = 2;
    if (value === 14) return "A";
    if (value === 13) return "K";
    if (value === 12) return "Q";
    if (value === 11) return "J";
    return value.toString();
}
function applyValueModifier(amount) {
    let currentValue = convertCard(currentKnown);
    let newValue = currentValue + amount;
    let newRank = convertValueToRank(newValue);
    currentKnown = newRank + "-" + currentKnown.split("-")[1];
    knownCard.classList.add("flip-animate");
    setTimeout(function () {
        knownCard.innerHTML = "<h3>" + currentKnown + "</h3>";
        knownCard.classList.remove("spin");
    }, 250);
}
function applySwapWithDiscard() {
    let randomIndex = Math.floor(Math.random() * discardDeck.length);
    let temp = discardDeck[randomIndex];
    discardDeck[randomIndex] = currentKnown;
    currentKnown = temp;
    knownCard.classList.add("flip-animate");
    setTimeout(function () {
        knownCard.innerHTML = "<h3>" + currentKnown + "</h3>";
        knownCard.classList.remove("spin");
    }, 250);
}
function applySwapWithActive() {
    let randomIndex = Math.floor(Math.random() * deck.length);
    let temp = deck[randomIndex];
    deck[randomIndex] = currentKnown;
    currentKnown = temp;
    knownCard.classList.add("flip-animate");
    setTimeout(function () {
        knownCard.innerHTML = "<h3>" + currentKnown + "</h3>";
        knownCard.classList.remove("spin");
    }, 250);
}
modifierChoicesContainer.addEventListener("click", function () {
    const modifierBtn = event.target.closest(".modifier-choice");
    if (modifierBtn) {
        const modifierId = modifierBtn.dataset.modifierId;
        applyModifier(modifierId);
    }
});
modifierChoicesContainer.addEventListener("mouseover", function (event) {
    const modifierBtn = event.target.closest(".modifier-choice");
    console.log("hello tooltip");
    if (modifierBtn) {
        const rect = modifierBtn.getBoundingClientRect();
        const description = modifierBtn.dataset.modifierDescription;
        console.log(description);
        modifierToolTip.innerHTML = description;
        modifierToolTip.style.left = rect.left + rect.width / 2 + "px";
        modifierToolTip.style.top = rect.bottom + 5 + "px";
        modifierToolTip.style.display = "block";
    }
});
modifierChoicesContainer.addEventListener("mouseout", function () {
    modifierToolTip.style.display = "none";
});
function hideModifierDrawer() {
    modifierDrawer.classList.remove("is-visible");
    modifierToolTip.style.display = "none";
    setTimeout(function () {
        modifierChoicesContainer.innerHTML = "";
        resumeGame();
    }, 500);
}

modifierCloseBtn.addEventListener("click", function () {
    hideModifierDrawer();
});

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
