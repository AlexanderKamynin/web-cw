import { MapManager } from "./src/scripts/mapManager";
import { GameManager } from "./src/scripts/gameManager";
import { SpriteManager } from "./src/scripts/spriteManager";
import { MAP_PATH } from "./src/scripts/const";


class Engine
{
    constructor()
    {
        this.spriteManager = new SpriteManager();
        this.mapManager = new MapManager(this.spriteManager);
        this.gameManager = new GameManager();
    }

    start()
    {
        this.init();
    }

    async init()
    {
        await this.loadMap(MAP_PATH).then((json) => this.mapManager.parseMap(json));
        console.log(this.mapManager);

        this.gameManager.initGameObjects(this.mapManager.parseGameObjects());
        console.log(this.gameManager);

        this.mapManager.render(this.gameManager.gameObjects);
    }

    async loadMap(path) 
    {
        let tilesParsedJSON = null;

        await fetch(
            path,
            {
                headers:
                {
                    'Content-Type': 'application/json',
                },
                method: "GET"
            }
        )
        .then(response => response.json())
        .then(response => {
            tilesParsedJSON = response;
        });

        return tilesParsedJSON;
    }
}


let engine = new Engine();
engine.start();