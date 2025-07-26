
import Deck from "./deck.js";

export default class Dealer {
    constructor() {
        this.deck = new Deck();
        this.deck.shuffle();
    }

    newDeck() {
        this.deck = new Deck();
        this.deck.shuffle();
    }

    deal(cards, ...players) {
        for(let i=0; i<cards; i++) {
            players.forEach((player) => player.addCard(this.deck.removeCard()));
        }
    }

    replace(cardContainers, player) {
        cardContainers.forEach((cardContainer) => player.replaceCardContainer(cardContainer, this.deck.removeCard()));
    }

}
