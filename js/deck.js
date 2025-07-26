import { Card, SUITES } from "./card.js";

export default class Deck {
    constructor() {
        this.deck = [];
        for(let i=0; i<4; i++) {
            for(let j=2; j<15; j++) {
                const card = new Card(SUITES[i], j);
                this.deck.push(card);
            }
        }
    }

    shuffle() {
        for(let i=0; i<this.deck.length; i++) {
            const randIdx = Math.floor(Math.random()*this.deck.length);
            [this.deck[i], this.deck[randIdx]] = [this.deck[randIdx], this.deck[i]]; // Swap cards using destructuring
        }
    }

    length() {
        return this.deck.length;
    }

    addCards(cards) {
        cards.forEach((card) => this.deck.push(card));
    }

    removeCard() {
        if(this.deck.length <= 0) {
            console.error("Deck is empty");
            return null;
        } 
        else {
            return this.deck.pop();
        }
    }

    removeCards(cnt) {
        if(this.deck.length < cnt) {
            console.error("Not enough cards in deck");
            return [];
        }
        else {
            return this.deck.splice(0, cnt);
        }
    }

    print() {
        console.log('Deck:')
        console.log(this.deck);
    }

    printTotal() {
        const tot = this.deck.reduce((acc, card) => acc + 1, 0)
        console.log(`***Deck's total***:`);
        console.log(tot);
    }
}