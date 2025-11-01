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
