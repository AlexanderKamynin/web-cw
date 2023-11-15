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
        this.gameInformation = document.querySelector(".game_info");
    }

    async start()
    {
        await this.gameManager.init();

        this.startGameButton.addEventListener("click", async() => {
            this.startGameButton.style.visibility = "hidden";
            this.gameInformation.style.visibility = "visible";
            
            await this.gameManager.startGame();
        });

        document.addEventListener("finish", () => {
            //checks when game finished
            // 1. hero health < 0
            // 2. all levels done
            // 3. current level done (maybe restart?)
        });
    }
}


let engine = new Engine();
engine.start();