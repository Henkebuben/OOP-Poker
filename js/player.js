import { Validate, HANDS } from "./validate.js"

const VALUE_HTML = ['', '' , '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const playerCollectionContainerElement = document.getElementById("player-collection-container-id");

export default class Player {
    static players = [];
    constructor(name) {
        Player.players.push(this);
        this.name = name;
        this.MAX_CARDS = 5;
        this.cardCount = 0;
        this.flipEnabled = false;
        this.playerContainerElement = this.#createPlayerContainerElement(playerCollectionContainerElement);
        this.playerContainerElement.innerHTML = `<p class="player-hand"></p><div class="player-card-collection-container"></div><p class="player-name">${name}</p>`;
        this.playerHandElement = this.playerContainerElement.querySelector(".player-hand");
        this.playerCardCollectionContainerElement = this.playerContainerElement.querySelector(".player-card-collection-container");
        this.playerNameElement = this.playerContainerElement.querySelector(".player-name");
        this.cardContainers = this.#createCardContainer(this.playerCardCollectionContainerElement);
    }

    static deletePlayers() {
        Player.players.forEach((player) => player.deletePlayer());
        playerCollectionContainerElement.innerHTML = '';
    }

    deletePlayer() {
        this.cardContainers.forEach((cardContainer) => cardContainer.removeEventListener("click", this.#flipCard));
        this.playerContainerElement.innerHTML = '';
    }

    #createPlayerContainerElement(gameBoardElement, name) {
        const playerContainerElement = document.createElement("div");
        playerContainerElement.className = "player-container";
        gameBoardElement.appendChild(playerContainerElement);
        return playerContainerElement;
    }

    #createCardContainer(cardContainerCollectionElement){
        const cardContainers = [];
        //Create Card Holders
        for(let i=0; i<this.MAX_CARDS; i++) {
            const cardContainerElement = document.createElement('div');
            cardContainerElement.classList.add("card-container");
            cardContainers.push(cardContainerElement);
            // Attach card holder to DOM
            cardContainerCollectionElement.appendChild(cardContainerElement);

            // Add event listener
            cardContainerElement.addEventListener("click", (e) => this.#flipCard(e));
        }
        return cardContainers;
    }

    enableFlipCard() {
        this.flipEnabled = true;
        const cardContainerElements = this.playerCardCollectionContainerElement.querySelectorAll(".card-container");
        for(const cardContainerElement of cardContainerElements) {
            cardContainerElement.title = "Click to flip card";
            cardContainerElement.classList.add("card-container-flip");
        }
    }

    disableFlipCard() {
        this.flipEnabled = false;
        const cardContainerElements = this.playerCardCollectionContainerElement.querySelectorAll(".card-container");
        for(const cardContainerElement of cardContainerElements) {
            cardContainerElement.title = "";
            cardContainerElement.classList.remove("card-container-flip");
        }
    }

    addCard(card, frontUp = true) {
        if(this.cardCount > this.MAX_CARDS-1) {
            console.error(`Player has too many cards`);
            return;
        }

        const cardContainerElement = this.cardContainers[this.cardCount];

        this.addCardToCardContainer(cardContainerElement, card, frontUp);

        // Update Hand info
        this.#updateHandInfo();
    }

    replaceCardContainer(cardContainerElement, card) {
        const frontUp = true;
        this.removeCard(cardContainerElement);

        this.addCardToCardContainer(cardContainerElement, card, frontUp);

        // Update Hand info
        this.#updateHandInfo();
    }

    getCardContainerFrontDown() {
        return this.cardContainers.filter((item) => item.dataset.frontUp === "false");
    }

    #createCardFrontElement(card, frontUp) {
        const valueHTML = VALUE_HTML[card.value];

        const cardFrontElement = document.createElement('div');
        cardFrontElement.className = "card-front-frame box-shadow-thin";
        cardFrontElement.innerHTML = `
            <img type="img" src="./cards/${valueHTML}${card.suit}.svg" alt="Card Front" class="card-front-image">
            `
        return cardFrontElement;
    }

    #createCardBackElement(frontUp) {
        const cardBackElement = document.createElement('div');
        cardBackElement.className = "card-back-frame box-shadow-thin";
        cardBackElement.innerHTML = `
            <img type="img" src="./svg/card-back.svg" alt="Card Back" class="card-back-image">
            `
        return cardBackElement;
    }

    #flipCard(e) {
        if(this.flipEnabled) {
            const cardContainerElement = e.currentTarget;
            const frontUp = (cardContainerElement.dataset.frontUp === 'true');
            const cardFront = cardContainerElement.querySelector('.card-front-frame');
            const cardBack = cardContainerElement.querySelector('.card-back-frame');
    
            if(cardFront === null || cardBack === null)
                return;
    
            cardContainerElement.dataset.frontUp = !frontUp;
            cardContainerElement.classList.toggle('is-flipped');
        }
    }

    #updateHandInfo() {
        const hand = Validate.getHand(this.getCards());
        this.playerHandElement.textContent = HANDS[hand.handIdx];
    }

    getCards() {
        return this.cardContainers.reduce((acc, cardContainerElement) => (cardContainerElement.dataset.card !== undefined) ? [...acc,  JSON.parse(cardContainerElement.dataset.card)] : acc, []);
    }

    getName() {
        return this.name;
    }

    length() {
        return this.cards.length;
    }

    addCards(cards) {
        cards.forEach((card) => this.addCard(card));
    }

    addCardToCardContainer(cardContainerElement, card, frontUp) {
        // Create new Card
        const cardFrontElement = this.#createCardFrontElement(card, frontUp);
        const cardBackElement = this.#createCardBackElement(frontUp);
        
        // Update Card Container
        cardContainerElement.dataset.frontUp = frontUp;
        cardContainerElement.dataset.card = JSON.stringify(card);
        cardContainerElement.classList.remove('is-flipped');
    
        // Attach card to card container
        cardContainerElement.appendChild(cardFrontElement);
        cardContainerElement.appendChild(cardBackElement);

        this.cardCount++;
    }

    removeCard(cardContainerElement) {
        if(cardContainerElement.dataset.card !== undefined) {
            const removedCard = JSON.parse(cardContainerElement.dataset.card);
            delete cardContainerElement.dataset.card;
            this.cardCount--;
            // Empty Card Container
            cardContainerElement.innerHTML = "";


            return removedCard;
        }
    }

    removeCards() {
        return this.cardContainers.map((cardContainerElement) => this.removeCard(cardContainerElement));
    }

    resetHand() {
        this.cardContainers.forEach((cardContainer) => {
            cardContainer.classList.remove("card-container-outline-orange");
            for(const child of cardContainer.children) {
                child.classList.add("box-shadow-thin");
            }
        });
    }

    setHand(hand) {
        for(const cardContainer of this.cardContainers)  {
            const playerCard = JSON.parse(cardContainer.dataset.card);
            if(hand.some((card) => playerCard.suit === card.suit  && playerCard.value === card.value)) {
                cardContainer.classList.add("card-container-outline-orange");
                for(const child of cardContainer.children) {
                    child.classList.remove("box-shadow-thin");
                }
            }
                
        }
    }

    resetWinner() {
        this.playerNameElement.textContent = this.name;
        this.playerNameElement.classList.remove('winner');
        this.playerHandElement.classList.remove('winner');
    }

    setWinner() {
        this.playerNameElement.textContent = this.name + ' wins!';
        this.playerNameElement.classList.add('winner');
        this.playerHandElement.classList.add('winner');
    }
}