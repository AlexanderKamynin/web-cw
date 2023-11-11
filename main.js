import { MapManager } from "./src/scripts/mapManager";
import { MAP_PATH } from "./src/scripts/const";

class Engine
{
    constructor()
    {
        this.mapManager = new MapManager();
    }

    start()
    {
        this.init();
    }

    async init()
    {
        await this.loadMap(MAP_PATH).then((json) => this.mapManager.parseMap(json));
        console.log(this.mapManager);
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