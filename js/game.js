import Dealer from "./dealer.js";
import Player from "./player.js"
import { Validate } from "./validate.js"

const playerDialog = document.getElementById("player-dialog-id");
const playerDialogCountFieldset = document.getElementById("player-dialog-fieldset-id");
const playerDialogNameContainerElement = document.getElementById("player-dialog-name-container-id");
const playerDialogOkBtn = document.getElementById("player-dialog-ok-btn-id");
const settingsImg = document.getElementById("footer-settings-id");
const dealBtn = document.getElementById("deal-button-id");
const drawBtn = document.getElementById("draw-button-id");

export default class Game {
    constructor() {
        this.dealer = new Dealer();
        this.players = [];
        this.winner = null;
        this.gameState = 'start';

        playerDialogCountFieldset.addEventListener('click', (e) => this.#updatePlayerInputElements(parseInt(e.target.dataset.input_fields)));
        playerDialogOkBtn.addEventListener('click', (e) => {
            this.#createPlayers();
            playerDialog.close();
            playerDialog.classList.toggle("collapsed");
            this.#setGameState('deal');
        });

        this.#settingsDialog();

        settingsImg.addEventListener('click', (e) => this.#settingsDialog());
        dealBtn.addEventListener('click', (e) => this.dealCards());
        drawBtn.addEventListener('click', (e) => this.drawCards());
    }

    #setGameState(state) {
        switch(state){
            case 'deal':
                dealBtn.classList.remove("footer-button-disable");
                drawBtn.classList.add("footer-button-disable");
                this.players.forEach((player) => player.disableFlipCard());
                this.gameState = 'deal';
            break;
            case 'draw':
                drawBtn.classList.remove("footer-button-disable");
                dealBtn.classList.add("footer-button-disable");
                this.players.forEach((player) => player.enableFlipCard());
                this.gameState = 'draw';
            break;   
        }
    }

    #settingsDialog() {
        playerDialog.showModal();
        playerDialog.classList.toggle("collapsed");
        this.#updatePlayerInputElements(parseInt(playerDialog.dataset.player_cnt));
    }

    #createPlayers() {
        const inputElements = playerDialogNameContainerElement.querySelectorAll("input");
        Player.deletePlayers();
        delete this.players;
        this.players = [];
        this.players.length = 0;
        for(const inputElement of inputElements){
            const player = new Player(inputElement.value);
            this.players.push(player);
        }
    }

    #updatePlayerInputElements(playerCnt) {
        const currentInputElementCount = playerDialogNameContainerElement.children.length;

        if(playerCnt>currentInputElementCount) {
            // Add input elements
            for(let i=currentInputElementCount; i<playerCnt; i++) {
                const divElement = document.createElement("div");
                divElement.innerHTML = `
                <input type="text" id="player${i+1}-id" minlength="1" maxlength="30" size="20" placeholder="Player ${i+1}'s Name">
                `;
                playerDialogNameContainerElement.appendChild(divElement);
            }
        } else if(playerCnt<currentInputElementCount) {
            // Remove input elements
            const cnt = currentInputElementCount - playerCnt;
            for(let i=0; i<cnt; i++) {
                playerDialogNameContainerElement.removeChild(playerDialogNameContainerElement.lastChild);
            }
        }
        playerDialog.dataset.player_cnt = playerCnt;
    }

    dealCards() {
        if(this.gameState === 'deal')  {
            if(this.winner != null) {
                this.winner.resetWinner();
                this.winner = null;
            }
            this.players.forEach((player) => player.resetHand());
            this.players.forEach((player) => player.removeCards());
            this.dealer.deal(5, ...this.players);
            this.#setGameState('draw');
        }
    }

    drawCards() {
        if(this.gameState === 'draw')  {
            this.players.forEach((player) => this.dealer.replace(player.getCardContainerFrontDown(), player));
            const validate = new Validate(this.players);
            this.players.forEach((player) => player.setHand(validate.getPlayerHand(player)));
            this.winner = validate.getWinner();
            this.winner.setWinner();
            this.dealer.newDeck();
            this.#setGameState('deal');
        }
    }
}