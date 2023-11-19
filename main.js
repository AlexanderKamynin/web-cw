import { GameManager } from "./src/scripts/gameManager";


class Engine
{
    constructor()
    {
        this.gameManager = new GameManager();

        this.startGameButton = document.querySelector(".start_game");
        this.gameInformation = document.querySelector(".game_info");
        this.restartGameButton = document.querySelector(".restart_game");
    }

    async start()
    {
        await this.gameManager.init();
        this.restartGameButton.style.visibility = "hidden";

        this.startGameButton.addEventListener("click", async() => {
            this.startGameButton.style.visibility = "hidden";
            
            await this.gameManager.startGame();
        });

        this.restartGameButton.addEventListener("click", async() => {
            await this.gameManager.init();
            this.restartGameButton.style.visibility = "hidden";
            await this.gameManager.startGame();
        })
    }
}


let engine = new Engine();
engine.start();