import { MapManager } from "./src/scripts/mapManager";
import { GameManager } from "./src/scripts/gameManager";
import { SpriteManager } from "./src/scripts/spriteManager";
import { MAP_PATH } from "./src/scripts/const";


class Engine
{
    constructor()
    {
        this.gameManager = new GameManager();

        this.startGameButton = document.querySelector(".start_game");
    }

    async start()
    {
        await this.gameManager.init();

        this.startGameButton.addEventListener("click", async() => {
            await this.gameManager.startGame();
        });
    }
}


let engine = new Engine();
engine.start();